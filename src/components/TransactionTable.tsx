import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'expense' | 'income' | 'split';
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case 'expense':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'split':
        return <ArrowUpRight className="w-4 h-4 text-blue-600" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="py-4 px-4 text-sm text-gray-600">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="py-4 px-4">
                <div className="font-medium text-gray-900">{transaction.description}</div>
              </td>
              <td className="py-4 px-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {transaction.category}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className={`font-semibold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(transaction.type)}
                  <span className="text-sm text-gray-600 capitalize">{transaction.type}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(transaction.status)}
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};