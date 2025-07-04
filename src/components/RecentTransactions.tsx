import React from 'react';
import { ArrowUpRight, ArrowDownRight, ShoppingCart, Car, Coffee } from 'lucide-react';

export const RecentTransactions: React.FC = () => {
  const transactions = [
    {
      id: '1',
      description: 'Grocery Shopping',
      amount: -127.50,
      date: 'Today',
      icon: ShoppingCart,
      category: 'Food',
    },
    {
      id: '2',
      description: 'Gas Station',
      amount: -45.20,
      date: 'Yesterday',
      icon: Car,
      category: 'Transportation',
    },
    {
      id: '3',
      description: 'Coffee Shop',
      amount: -8.75,
      date: '2 days ago',
      icon: Coffee,
      category: 'Food',
    },
    {
      id: '4',
      description: 'Salary Deposit',
      amount: 3500.00,
      date: '3 days ago',
      icon: ArrowUpRight,
      category: 'Income',
    },
  ];

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const Icon = transaction.icon;
        const isIncome = transaction.amount > 0;
        
        return (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`font-semibold ${
                isIncome ? 'text-green-600' : 'text-red-600'
              }`}>
                {isIncome ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">{transaction.category}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};