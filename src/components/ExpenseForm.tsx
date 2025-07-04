import React, { useState, useEffect } from 'react';
import { X, DollarSign, FileText, Tag, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { ExpenseFormData, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../types/expense';

interface ExpenseFormProps {
  onSubmit: (expense: ExpenseFormData) => Promise<void>;
  onClose: () => void;
  initialData?: ExpenseFormData;
  isEditing?: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  onSubmit, 
  onClose, 
  initialData,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    } else if (parseFloat(formData.amount) > 999999.99) {
      newErrors.amount = 'Amount cannot exceed $999,999.99';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.amount ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="0.00"
                step="0.01"
                min="0"
                max="999999.99"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.category ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                <option value="">Select a category</option>
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.date ? 'border-red-300' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.paymentMethod ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                <option value="">Select payment method</option>
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            {errors.paymentMethod && (
              <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                maxLength={500}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Add a note about this expense..."
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.description.length}/500 characters
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                <span>{isEditing ? 'Update Expense' : 'Add Expense'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};