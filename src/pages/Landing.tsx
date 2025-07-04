import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, CreditCard, Shield, Users } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: CreditCard,
      title: 'Smart Expense Tracking',
      description: 'Track and categorize your expenses with intelligent insights and automated categorization.',
    },
    {
      icon: Users,
      title: 'Easy Expense Splitting',
      description: 'Split bills with friends and family effortlessly with custom split options and settlement tracking.',
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'Get detailed insights into your spending patterns with beautiful charts and reports.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and secure with enterprise-grade security measures.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ExpenseFlow</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-fadeInUp">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Take Control of Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Finances</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Track expenses, split bills, and gain insights into your spending habits with our comprehensive financial management platform.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-xl"
              >
                <span>Start Tracking Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Everything You Need to Manage Expenses
              </h3>
              <p className="text-gray-600 text-lg">
                Powerful features designed to make expense management effortless and insightful.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Financial Management?
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of users who have already taken control of their finances.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};