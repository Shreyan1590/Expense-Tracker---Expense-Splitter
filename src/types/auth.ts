export interface User {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  phoneNumber?: string;
  bio?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  displayName: string;
  photoURL?: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdateProfileData {
  displayName?: string;
  username?: string;
  photoURL?: string;
  phoneNumber?: string;
  bio?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}