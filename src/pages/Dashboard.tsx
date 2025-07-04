import React from 'react';
import { TrendingUp, TrendingDown, CreditCard, Calendar, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExpenseChart } from '../components/ExpenseChart';
import { useExpenses } from '../hooks/useExpenses';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { expenses, stats, loading } = useExpenses();

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  
  const previousMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === previousMonth.getMonth() && 
           expenseDate.getFullYear() === previousMonth.getFullYear();
  });
  
  const previousMonthTotal = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyChange = previousMonthTotal > 0 
    ? (((stats?.monthlyTotal || 0) - previousMonthTotal) / previousMonthTotal) * 100 
    : 0;

  const recentExpenses = expenses.slice(0, 5);

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
        day: 'numeric'
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Dining': 'from-red-500 to-pink-500',
      'Transportation': 'from-blue-500 to-cyan-500',
      'Shopping': 'from-purple-500 to-indigo-500',
      'Entertainment': 'from-green-500 to-emerald-500',
      'Bills & Utilities': 'from-yellow-500 to-orange-500',
      'Healthcare': 'from-teal-500 to-blue-500',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your financial overview.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-24 h-8 bg-gray-200 rounded mb-1"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your financial overview.</p>
        </div>
        <button
          onClick={() => navigate('/expenses')}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              monthlyChange >= 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {monthlyChange >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="font-medium">{Math.abs(monthlyChange).toFixed(1)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            ${stats?.totalExpenses.toFixed(2) || '0.00'}
          </h3>
          <p className="text-gray-600 text-sm">Total Expenses</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm text-blue-600">
              <span className="font-medium">{currentMonth}</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            ${stats?.monthlyTotal.toFixed(2) || '0.00'}
          </h3>
          <p className="text-gray-600 text-sm">This Month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>{expenses.length} entries</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            ${expenses.length > 0 ? (stats?.totalExpenses / expenses.length).toFixed(2) : '0.00'}
          </h3>
          <p className="text-gray-600 text-sm">Average per Entry</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>{stats ? Object.keys(stats.categoryBreakdown).length : 0} categories</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            ${previousMonthTotal.toFixed(2)}
          </h3>
          <p className="text-gray-600 text-sm">Previous Month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Expense Overview</h3>
          {stats && Object.keys(stats.categoryBreakdown).length > 0 ? (
            <ExpenseChart stats={stats} />
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h4>
              <p className="text-gray-600 mb-4">Start tracking your expenses to see insights here.</p>
              <button
                onClick={() => navigate('/expenses')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Add Your First Expense
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Transactions</h3>
            <button
              onClick={() => navigate('/history')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
            >
              View All
            </button>
          </div>
          
          {recentExpenses.length > 0 ? (
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${getCategoryColor(expense.category)}`}>
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {expense.description || expense.category}
                      </h4>
                      <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-red-600">
                      -${expense.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">{expense.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h4>
              <p className="text-gray-600 mb-4">Your recent expenses will appear here.</p>
              <button
                onClick={() => navigate('/expenses')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Add Expense
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};