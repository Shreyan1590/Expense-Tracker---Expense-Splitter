import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService';
import { Expense, ExpenseFormData, ExpenseStats } from '../types/expense';
import { useAuth } from './useAuth';

interface UseExpensesReturn {
  expenses: Expense[];
  stats: ExpenseStats | null;
  loading: boolean;
  error: string | null;
  addExpense: (data: ExpenseFormData) => Promise<void>;
  updateExpense: (id: string, data: ExpenseFormData) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  refreshExpenses: () => Promise<void>;
  clearError: () => void;
}

export const useExpenses = (): UseExpensesReturn => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshExpenses = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const [userExpenses, expenseStats] = await Promise.all([
        expenseService.getUserExpenses(user.uid),
        expenseService.getExpenseStats(user.uid)
      ]);
      
      setExpenses(userExpenses);
      setStats(expenseStats);
    } catch (error: any) {
      console.error('Error refreshing expenses:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addExpense = useCallback(async (data: ExpenseFormData) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setError(null);
      await expenseService.addExpense(user.uid, data);
      // Real-time listener will update the state automatically
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  }, [user]);

  const updateExpense = useCallback(async (id: string, data: ExpenseFormData) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setError(null);
      await expenseService.updateExpense(id, user.uid, data);
      // Real-time listener will update the state automatically
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  }, [user]);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      setError(null);
      await expenseService.deleteExpense(id);
      // Real-time listener will update the state automatically
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  }, []);

  // Set up real-time listener
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const unsubscribe = expenseService.subscribeToUserExpenses(
      user.uid,
      async (newExpenses) => {
        setExpenses(newExpenses);
        
        // Update stats when expenses change
        try {
          const newStats = await expenseService.getExpenseStats(user.uid);
          setStats(newStats);
        } catch (error: any) {
          console.error('Error updating stats:', error);
        }
        
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  return {
    expenses,
    stats,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses,
    clearError
  };
};