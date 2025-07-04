import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { authService } from '../services/authService';
import { User, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  signUp: (data: any) => Promise<void>;
  signIn: (data: any) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  changePassword: (data: any) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  deleteAccount: () => Promise<void>;
  resendEmailVerification: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          const userData = await authService.getUserData(firebaseUser.uid);
          setState({
            user: userData,
            loading: false,
            error: null
          });
        } else {
          setState({
            user: null,
            loading: false,
            error: null
          });
        }
      } catch (error: any) {
        setState({
          user: null,
          loading: false,
          error: error.message
        });
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async (data: any) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await authService.signUp(data);
      // User state will be updated by onAuthStateChanged
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const signIn = async (data: any) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await authService.signIn(data);
      // User state will be updated by onAuthStateChanged
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await authService.signInWithGoogle();
      // User state will be updated by onAuthStateChanged
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await authService.signOut();
      // User state will be updated by onAuthStateChanged
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await authService.sendPasswordReset(email);
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  };

  const updateProfile = async (data: any) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await authService.updateUserProfile(data);
      await refreshUser();
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const changePassword = async (data: any) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await authService.changePassword(data);
      setState(prev => ({ ...prev, loading: false }));
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const photoURL = await authService.uploadProfilePicture(file);
      await refreshUser();
      return photoURL;
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await authService.deleteAccount();
      // User state will be updated by onAuthStateChanged
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const resendEmailVerification = async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await authService.resendEmailVerification();
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      if (auth.currentUser) {
        const userData = await authService.getUserData(auth.currentUser.uid);
        setState(prev => ({ ...prev, user: userData, loading: false }));
      }
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
    }
  };

  const value: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    sendPasswordReset,
    updateProfile,
    changePassword,
    uploadProfilePicture,
    deleteAccount,
    resendEmailVerification,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};