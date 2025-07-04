import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, CreditCard, History, Users, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { id: 'expenses', label: 'Track Expenses', icon: CreditCard, path: '/expenses' },
    { id: 'splitter', label: 'Split Expenses', icon: Users, path: '/splitter' },
    { id: 'history', label: 'Transaction History', icon: History, path: '/history' },
    { id: 'profile', label: 'Profile', icon: Settings, path: '/profile' },
  ];

  return (
    <aside className="fixed left-0 top-16 w-64 h-full bg-white/80 backdrop-blur-md border-r border-gray-200/50 z-40">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:transform hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};