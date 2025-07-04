import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { ExpenseChart } from '../components/ExpenseChart';
import { useExpenses } from '../hooks/useExpenses';
import { Expense, ExpenseFormData } from '../types/expense';

export const ExpenseTracker: React.FC = () => {
  const { 
    expenses, 
    stats, 
    loading, 
    error, 
    addExpense, 
    updateExpense, 
    deleteExpense,
    clearError 
  } = useExpenses();

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleAddExpense = async (data: ExpenseFormData) => {
    await addExpense(data);
    setShowForm(false);
  };

  const handleEditExpense = async (data: ExpenseFormData) => {
    if (!editingExpense) return;
    await updateExpense(editingExpense.id, data);
    setEditingExpense(null);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(expenseId);
    }
  };

  const openEditForm = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingExpense(null);
    clearError();
  };

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-600 mt-1">Track and manage your daily expenses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 transform rotate-45" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            ${stats?.totalExpenses.toFixed(2) || '0.00'}
          </h3>
          <p className="text-gray-600 text-sm">Total Expenses</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <TrendingDown className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            ${stats?.monthlyTotal.toFixed(2) || '0.00'}
          </h3>
          <p className="text-gray-600 text-sm">{currentMonth}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-500">{expenses.length} entries</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            ${expenses.length > 0 ? (stats?.totalExpenses / expenses.length).toFixed(2) : '0.00'}
          </h3>
          <p className="text-gray-600 text-sm">Average per Entry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ExpenseList 
            expenses={expenses}
            onEdit={openEditForm}
            onDelete={handleDeleteExpense}
            loading={loading}
          />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
            {stats ? (
              <ExpenseChart stats={stats} />
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">No data to display</p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Entries</span>
                <span className="font-semibold text-gray-900">{expenses.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Month</span>
                <span className="font-semibold text-gray-900">
                  ${stats?.monthlyTotal.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Categories</span>
                <span className="font-semibold text-gray-900">
                  {stats ? Object.keys(stats.categoryBreakdown).length : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(showForm || editingExpense) && (
        <ExpenseForm
          onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
          onClose={closeForm}
          initialData={editingExpense ? {
            amount: editingExpense.amount.toString(),
            category: editingExpense.category,
            date: editingExpense.date,
            description: editingExpense.description || '',
            paymentMethod: editingExpense.paymentMethod
          } : undefined}
          isEditing={!!editingExpense}
        />
      )}
    </div>
  );
};