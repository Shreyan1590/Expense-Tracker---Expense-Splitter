import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { user, resendEmailVerification, signOut, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResendVerification = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await resendEmailVerification();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    setError('');

    try {
      await refreshUser();
      if (user?.emailVerified) {
        navigate('/dashboard');
      } else {
        setError('Email not verified yet. Please check your email and click the verification link.');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-200/50 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify Your Email</h2>
          
          <p className="text-gray-600 mb-6">
            We've sent a verification email to <strong>{user?.email}</strong>. 
            Please check your email and click the verification link to activate your account.
          </p>

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleCheckVerification}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>I've Verified My Email</span>
                </>
              )}
            </button>

            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Resend Verification Email</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            >
              Sign out and use different email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};