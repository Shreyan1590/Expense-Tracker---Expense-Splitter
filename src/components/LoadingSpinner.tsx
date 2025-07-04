import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        <p className="text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
};