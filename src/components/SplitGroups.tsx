import React from 'react';
import { Users, DollarSign, Calendar, ChevronRight } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  members: string[];
  totalAmount: number;
  expenses: Array<{
    description: string;
    amount: number;
    paidBy: string;
  }>;
}

interface SplitGroupsProps {
  groups: Group[];
}

export const SplitGroups: React.FC<SplitGroupsProps> = ({ groups }) => {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div
          key={group.id}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                <p className="text-sm text-gray-500">{group.members.length} members</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${group.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Total spent</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Members</h4>
              <div className="flex flex-wrap gap-2">
                {group.members.map((member, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Recent Expenses</h4>
              <div className="space-y-1">
                {group.expenses.slice(0, 2).map((expense, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{expense.description}</span>
                    <span className="text-gray-900 font-medium">${expense.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Created 2 days ago</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-600 font-medium">Your share: ${(group.totalAmount / group.members.length).toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};