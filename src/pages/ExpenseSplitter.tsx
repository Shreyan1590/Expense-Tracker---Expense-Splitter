import React, { useState } from 'react';
import { Users, Plus, Calculator, Share2 } from 'lucide-react';
import { SplitForm } from '../components/SplitForm';
import { SplitGroups } from '../components/SplitGroups';

export const ExpenseSplitter: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [groups, setGroups] = useState([
    {
      id: '1',
      name: 'Weekend Trip',
      members: ['Alice', 'Bob', 'Charlie', 'Diana'],
      totalAmount: 480.00,
      expenses: [
        { description: 'Hotel', amount: 320.00, paidBy: 'Alice' },
        { description: 'Dinner', amount: 160.00, paidBy: 'Bob' },
      ],
    },
    {
      id: '2',
      name: 'Office Lunch',
      members: ['John', 'Sarah', 'Mike'],
      totalAmount: 75.50,
      expenses: [
        { description: 'Pizza', amount: 45.50, paidBy: 'John' },
        { description: 'Drinks', amount: 30.00, paidBy: 'Sarah' },
      ],
    },
  ]);

  const handleCreateGroup = (newGroup: any) => {
    setGroups([...groups, { ...newGroup, id: Date.now().toString() }]);
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Splitter</h1>
          <p className="text-gray-600 mt-1">Split bills and track shared expenses with friends</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Create Group</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{groups.length}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Groups</h3>
          <p className="text-gray-600 text-sm">Groups you're part of</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">$555.50</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Split</h3>
          <p className="text-gray-600 text-sm">Amount in all groups</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">$125.25</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">You Owe</h3>
          <p className="text-gray-600 text-sm">Amount to be settled</p>
        </div>
      </div>

      <SplitGroups groups={groups} />

      {showForm && (
        <SplitForm
          onSubmit={handleCreateGroup}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};