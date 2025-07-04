import React from 'react';
import { ExpenseStats } from '../types/expense';

interface ExpenseChartProps {
  stats: ExpenseStats;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ stats }) => {
  const { categoryBreakdown } = stats;
  
  const categories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const total = categories.reduce((sum, [, amount]) => sum + amount, 0);

  const colors = [
    'from-red-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-indigo-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-orange-500',
  ];

  if (total === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-gray-400 text-sm">No data</span>
        </div>
        <p className="text-gray-600">No expenses to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <svg className="w-64 h-64 mx-auto" viewBox="0 0 100 100">
          {categories.map(([category, amount], index) => {
            const radius = 40;
            const circumference = 2 * Math.PI * radius;
            const percentage = (amount / total) * 100;
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const rotateAngle = categories.slice(0, index).reduce((acc, [, currAmount]) => 
              acc + ((currAmount / total) * 360), 0);
            
            return (
              <circle
                key={category}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={`url(#gradient-${index})`}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset="0"
                transform={`rotate(${rotateAngle - 90} 50 50)`}
                className="transition-all duration-500 hover:stroke-width-10"
              />
            );
          })}
          
          {categories.map((_, index) => (
            <defs key={index}>
              <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={
                  index === 0 ? '#ef4444' : 
                  index === 1 ? '#3b82f6' : 
                  index === 2 ? '#8b5cf6' : 
                  index === 3 ? '#10b981' : '#f59e0b'
                } />
                <stop offset="100%" stopColor={
                  index === 0 ? '#ec4899' : 
                  index === 1 ? '#06b6d4' : 
                  index === 2 ? '#6366f1' : 
                  index === 3 ? '#059669' : '#ea580c'
                } />
              </linearGradient>
            </defs>
          ))}
          
          <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-sm font-semibold fill-gray-900">
            ${total.toFixed(0)}
          </text>
        </svg>
      </div>
      
      <div className="space-y-3">
        {categories.map(([category, amount], index) => {
          const percentage = ((amount / total) * 100).toFixed(1);
          return (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors[index]}`}></div>
                <span className="text-gray-700 font-medium text-sm">{category}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-900 font-semibold">${amount.toFixed(2)}</span>
                <span className="text-gray-500 text-sm ml-2">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};