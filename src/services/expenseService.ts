import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  limit,
  startAfter,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Expense, ExpenseFormData, ExpenseStats } from '../types/expense';

class ExpenseService {
  private readonly COLLECTION_NAME = 'expenses';

  async addExpense(userId: string, expenseData: ExpenseFormData): Promise<string> {
    try {
      this.validateExpenseData(expenseData);

      const expense = {
        userId,
        amount: parseFloat(expenseData.amount),
        category: expenseData.category,
        date: expenseData.date,
        description: expenseData.description.trim() || null,
        paymentMethod: expenseData.paymentMethod,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), expense);
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding expense:', error);
      throw this.handleError(error);
    }
  }

  async updateExpense(expenseId: string, userId: string, expenseData: ExpenseFormData): Promise<void> {
    try {
      this.validateExpenseData(expenseData);

      const expense = {
        amount: parseFloat(expenseData.amount),
        category: expenseData.category,
        date: expenseData.date,
        description: expenseData.description.trim() || null,
        paymentMethod: expenseData.paymentMethod,
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, this.COLLECTION_NAME, expenseId), expense);
    } catch (error: any) {
      console.error('Error updating expense:', error);
      throw this.handleError(error);
    }
  }

  async deleteExpense(expenseId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION_NAME, expenseId));
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      throw this.handleError(error);
    }
  }

  async getUserExpenses(userId: string): Promise<Expense[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapDocToExpense(doc));
    } catch (error: any) {
      console.error('Error fetching expenses:', error);
      throw this.handleError(error);
    }
  }

  async getUserExpensesPaginated(
    userId: string, 
    limitCount: number = 20, 
    lastDoc?: QueryDocumentSnapshot
  ): Promise<{ expenses: Expense[]; lastDoc: QueryDocumentSnapshot | null }> {
    try {
      let q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const expenses = querySnapshot.docs.map(doc => this.mapDocToExpense(doc));
      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      return { expenses, lastDoc: newLastDoc };
    } catch (error: any) {
      console.error('Error fetching paginated expenses:', error);
      throw this.handleError(error);
    }
  }

  subscribeToUserExpenses(
    userId: string, 
    callback: (expenses: Expense[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(
        q,
        (querySnapshot) => {
          const expenses = querySnapshot.docs.map(doc => this.mapDocToExpense(doc));
          callback(expenses);
        },
        (error) => {
          console.error('Error in expense subscription:', error);
          if (onError) {
            onError(this.handleError(error));
          }
        }
      );
    } catch (error: any) {
      console.error('Error setting up expense subscription:', error);
      throw this.handleError(error);
    }
  }

  async getExpenseStats(userId: string): Promise<ExpenseStats> {
    try {
      const expenses = await this.getUserExpenses(userId);
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      });

      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      const categoryBreakdown: Record<string, number> = {};
      expenses.forEach(expense => {
        categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + expense.amount;
      });

      const recentExpenses = expenses.slice(0, 5);

      return {
        totalExpenses,
        monthlyTotal,
        categoryBreakdown,
        recentExpenses
      };
    } catch (error: any) {
      console.error('Error calculating expense stats:', error);
      throw this.handleError(error);
    }
  }

  async getExpensesByDateRange(
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<Expense[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapDocToExpense(doc));
    } catch (error: any) {
      console.error('Error fetching expenses by date range:', error);
      throw this.handleError(error);
    }
  }

  async getExpensesByCategory(userId: string, category: string): Promise<Expense[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('category', '==', category),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapDocToExpense(doc));
    } catch (error: any) {
      console.error('Error fetching expenses by category:', error);
      throw this.handleError(error);
    }
  }

  private mapDocToExpense(doc: QueryDocumentSnapshot): Expense {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      amount: data.amount,
      category: data.category,
      date: data.date,
      description: data.description,
      paymentMethod: data.paymentMethod,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
    };
  }

  private validateExpenseData(data: ExpenseFormData): void {
    if (!data.amount || isNaN(parseFloat(data.amount))) {
      throw new Error('Please enter a valid amount');
    }

    if (parseFloat(data.amount) <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    if (parseFloat(data.amount) > 999999.99) {
      throw new Error('Amount cannot exceed $999,999.99');
    }

    if (!data.category || data.category.trim() === '') {
      throw new Error('Please select a category');
    }

    if (!data.date || data.date.trim() === '') {
      throw new Error('Please select a date');
    }

    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {
      throw new Error('Date cannot be in the future');
    }

    if (!data.paymentMethod || data.paymentMethod.trim() === '') {
      throw new Error('Please select a payment method');
    }

    if (data.description && data.description.length > 500) {
      throw new Error('Description cannot exceed 500 characters');
    }
  }

  private handleError(error: any): Error {
    if (error.code === 'permission-denied') {
      return new Error('You do not have permission to perform this action');
    }
    
    if (error.code === 'unavailable') {
      return new Error('Service is currently unavailable. Please try again later');
    }

    if (error.code === 'failed-precondition') {
      return new Error('Database operation failed. Please check your connection');
    }

    return new Error(error.message || 'An unexpected error occurred');
  }
}

export const expenseService = new ExpenseService();