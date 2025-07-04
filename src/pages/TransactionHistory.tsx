import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Calendar, Tag, CreditCard } from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../types/expense';

export const TransactionHistory: React.FC = () => {
  const { expenses, loading } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
      const matchesPaymentMethod = selectedPaymentMethod === 'all' || expense.paymentMethod === selectedPaymentMethod;
      
      let matchesDateRange = true;
      if (dateRange !== 'all') {
        const expenseDate = new Date(expense.date);
        const today = new Date();
        
        switch (dateRange) {
          case '7days':
            matchesDateRange = expenseDate >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30days':
            matchesDateRange = expenseDate >= new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case '3months':
            matchesDateRange = expenseDate >= new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case '6months':
            matchesDateRange = expenseDate >= new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000);
            break;
          case '1year':
            matchesDateRange = expenseDate >= new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        }
      }
      
      return matchesSearch && matchesCategory && matchesPaymentMethod && matchesDateRange;
    });
  }, [expenses, searchTerm, selectedCategory, selectedPaymentMethod, dateRange]);

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Payment Method', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredExpenses.map(expense => [
        expense.date,
        `"${expense.description || expense.category}"`,
        expense.category,
        expense.paymentMethod,
        expense.amount.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Dining': 'bg-red-100 text-red-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-green-100 text-green-800',
      'Bills & Utilities': 'bg-yellow-100 text-yellow-800',
      'Healthcare': 'bg-teal-100 text-teal-800',
      'Travel': 'bg-indigo-100 text-indigo-800',
      'Education': 'bg-emerald-100 text-emerald-800',
      'Personal Care': 'bg-pink-100 text-pink-800',
      'Home & Garden': 'bg-lime-100 text-lime-800',
      'Gifts & Donations': 'bg-violet-100 text-violet-800',
      'Business': 'bg-slate-100 text-slate-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-1">View and manage all your expense transactions</p>
        </div>
        <button 
          onClick={exportToCSV}
          disabled={filteredExpenses.length === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Download className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Payment Methods</option>
              {PAYMENT_METHODS.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="3months">Last 3 months</option>
              <option value="6months">Last 6 months</option>
              <option value="1year">Last year</option>
            </select>
          </div>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              Showing {filteredExpenses.length} of {expenses.length} transactions
            </span>
            <span className="text-lg font-semibold text-gray-900">
              Total: ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">
              {expenses.length === 0 
                ? "You haven't added any expenses yet." 
                : "Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex flex-col items-center space-y-1">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {expense.description || expense.category}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(expense.category)}`}>
                          {expense.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{expense.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-lg font-semibold text-red-600">
                    -${expense.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};