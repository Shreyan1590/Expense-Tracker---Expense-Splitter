import React, { useState } from 'react';
import { X, Users, DollarSign, Plus, Minus } from 'lucide-react';

interface SplitFormProps {
  onSubmit: (group: any) => void;
  onClose: () => void;
}

export const SplitForm: React.FC<SplitFormProps> = ({ onSubmit, onClose }) => {
  const [group, setGroup] = useState({
    name: '',
    members: [''],
    expenses: [{ description: '', amount: '', paidBy: '' }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = group.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || '0'), 0);
    onSubmit({
      ...group,
      members: group.members.filter(member => member.trim()),
      expenses: group.expenses.filter(expense => expense.description && expense.amount),
      totalAmount,
    });
  };

  const addMember = () => {
    setGroup({ ...group, members: [...group.members, ''] });
  };

  const removeMember = (index: number) => {
    setGroup({
      ...group,
      members: group.members.filter((_, i) => i !== index),
    });
  };

  const updateMember = (index: number, value: string) => {
    const newMembers = [...group.members];
    newMembers[index] = value;
    setGroup({ ...group, members: newMembers });
  };

  const addExpense = () => {
    setGroup({
      ...group,
      expenses: [...group.expenses, { description: '', amount: '', paidBy: '' }],
    });
  };

  const removeExpense = (index: number) => {
    setGroup({
      ...group,
      expenses: group.expenses.filter((_, i) => i !== index),
    });
  };

  const updateExpense = (index: number, field: string, value: string) => {
    const newExpenses = [...group.expenses];
    newExpenses[index] = { ...newExpenses[index], [field]: value };
    setGroup({ ...group, expenses: newExpenses });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Split Group</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={group.name}
              onChange={(e) => setGroup({ ...group, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter group name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Members
            </label>
            <div className="space-y-2">
              {group.members.map((member, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={member}
                    onChange={(e) => updateMember(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Member name"
                  />
                  {group.members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors duration-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addMember}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expenses
            </label>
            <div className="space-y-3">
              {group.expenses.map((expense, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Expense {index + 1}</span>
                    {group.expenses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExpense(index)}
                        className="p-1 rounded-lg text-red-600 hover:bg-red-100 transition-colors duration-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={expense.description}
                      onChange={(e) => updateExpense(index, 'description', e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      value={expense.amount}
                      onChange={(e) => updateExpense(index, 'amount', e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Amount"
                      step="0.01"
                    />
                    <select
                      value={expense.paidBy}
                      onChange={(e) => updateExpense(index, 'paidBy', e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Paid by</option>
                      {group.members.filter(member => member.trim()).map((member, memberIndex) => (
                        <option key={memberIndex} value={member}>{member}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addExpense}
                className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};