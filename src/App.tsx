import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingSpinner } from './components/LoadingSpinner';

// Auth pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerifyEmail } from './pages/VerifyEmail';

// App pages
import { Dashboard } from './pages/Dashboard';
import { ExpenseTracker } from './pages/ExpenseTracker';
import { ExpenseSplitter } from './pages/ExpenseSplitter';
import { TransactionHistory } from './pages/TransactionHistory';
import { Profile } from './pages/Profile';

// Layout components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header user={user} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64 pt-20">
          <div className="animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Loading your account..." />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" replace />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/dashboard" replace />} />
      <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" replace />} />
      
      {/* Email verification route */}
      <Route 
        path="/verify-email" 
        element={
          user && !user.emailVerified ? <VerifyEmail /> : <Navigate to="/dashboard" replace />
        } 
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ExpenseTracker />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/splitter"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ExpenseSplitter />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TransactionHistory />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;