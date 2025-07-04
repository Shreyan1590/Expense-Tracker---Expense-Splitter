import React, { useState } from 'react';
import { Calendar, Tag, Trash2, Edit, CreditCard, FileText } from 'lucide-react';
import { Expense } from '../types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (expenseId: string) => void;
  loading?: boolean;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ 
  expenses, 
  onEdit, 
  onDelete,
  loading = false 
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Dining': 'from-red-500 to-pink-500',
      'Transportation': 'from-blue-500 to-cyan-500',
      'Shopping': 'from-purple-500 to-indigo-500',
      'Entertainment': 'from-green-500 to-emerald-500',
      'Bills & Utilities': 'from-yellow-500 to-orange-500',
      'Healthcare': 'from-teal-500 to-blue-500',
      'Travel': 'from-indigo-500 to-purple-500',
      'Education': 'from-emerald-500 to-teal-500',
      'Personal Care': 'from-pink-500 to-rose-500',
      'Home & Garden': 'from-lime-500 to-green-500',
      'Gifts & Donations': 'from-violet-500 to-purple-500',
      'Business': 'from-slate-500 to-gray-500',
      'Other': 'from-gray-500 to-slate-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const handleDelete = async (expenseId: string) => {
    if (!onDelete) return;
    
    setDeletingId(expenseId);
    try {
      await onDelete(expenseId);
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Your Expenses</h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Your Expenses</h2>
        </div>
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
          <p className="text-gray-600">Start tracking your expenses by adding your first entry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">
          Your Expenses ({expenses.length})
        </h2>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="p-6 hover:bg-gray-50 transition-colors duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(expense.category)}`}></div>
                  <h3 className="font-medium text-gray-900">
                    {expense.description || expense.category}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(expense.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Tag className="w-4 h-4" />
                    <span>{expense.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CreditCard className="w-4 h-4" />
                    <span>{expense.paymentMethod}</span>
                  </div>
                </div>
                
                {expense.description && expense.description !== expense.category && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600 mt-2">
                    <FileText className="w-4 h-4" />
                    <span className="truncate">{expense.description}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-lg font-semibold text-red-600">
                    -${expense.amount.toFixed(2)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(expense)}
                      className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors duration-200"
                      title="Edit expense"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      onClick={() => handleDelete(expense.id)}
                      disabled={deletingId === expense.id}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors duration-200 disabled:opacity-50"
                      title="Delete expense"
                    >
                      {deletingId === expense.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};