import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../config/firebase';
import { User, SignUpData, LoginData, UpdateProfileData, ChangePasswordData } from '../types/auth';

class AuthService {
  private loginAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  async signUp(data: SignUpData): Promise<User> {
    try {
      // Validate input
      this.validateSignUpData(data);

      // Check if username is already taken
      await this.checkUsernameAvailability(data.username);

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: data.displayName,
        photoURL: data.photoURL || null
      });

      // Create user document in Firestore
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: data.displayName,
        username: data.username,
        photoURL: data.photoURL,
        emailVerified: false,
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });

      // Send email verification
      await sendEmailVerification(firebaseUser);

      return userData;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async signIn(data: LoginData): Promise<User> {
    try {
      // Check rate limiting
      this.checkRateLimit(data.email);

      // Set persistence based on remember me
      const persistence = data.rememberMe 
        ? browserLocalPersistence 
        : browserSessionPersistence;
      
      await setPersistence(auth, persistence);

      // Sign in user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Reset login attempts on successful login
      this.loginAttempts.delete(data.email);

      // Update last login time
      await this.updateLastLogin(userCredential.user.uid);

      // Get user data from Firestore
      const userData = await this.getUserData(userCredential.user.uid);
      return userData;
    } catch (error: any) {
      // Increment login attempts
      this.incrementLoginAttempts(data.email);
      throw this.handleAuthError(error);
    }
  }

  async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');

      // Add custom parameters to improve popup experience
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // Create new user document for Google sign-in
        const username = await this.generateUniqueUsername(firebaseUser.displayName || firebaseUser.email!);
        
        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '',
          username,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          createdAt: new Date(),
          lastLoginAt: new Date()
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...userData,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        });

        return userData;
      } else {
        // Update last login time
        await this.updateLastLogin(firebaseUser.uid);
        return await this.getUserData(firebaseUser.uid);
      }
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async updateUserProfile(data: UpdateProfileData): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      // Update Firebase Auth profile
      const updateData: any = {};
      if (data.displayName !== undefined) updateData.displayName = data.displayName;
      if (data.photoURL !== undefined) updateData.photoURL = data.photoURL;

      if (Object.keys(updateData).length > 0) {
        await updateProfile(user, updateData);
      }

      // Update Firestore document
      const firestoreData: any = {};
      if (data.displayName !== undefined) firestoreData.displayName = data.displayName;
      if (data.username !== undefined) {
        await this.checkUsernameAvailability(data.username, user.uid);
        firestoreData.username = data.username;
      }
      if (data.photoURL !== undefined) firestoreData.photoURL = data.photoURL;
      if (data.phoneNumber !== undefined) firestoreData.phoneNumber = data.phoneNumber;
      if (data.bio !== undefined) firestoreData.bio = data.bio;

      if (Object.keys(firestoreData).length > 0) {
        await updateDoc(doc(db, 'users', user.uid), firestoreData);
      }
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('No authenticated user');

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, data.newPassword);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async uploadProfilePicture(file: File): Promise<string> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size must be less than 5MB');
      }

      // Upload to Firebase Storage
      const storageRef = ref(storage, `profile-pictures/${user.uid}/${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update user profile
      await this.updateUserProfile({ photoURL: downloadURL });

      return downloadURL;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', user.uid));

      // Delete profile picture from Storage if exists
      if (user.photoURL) {
        try {
          const photoRef = ref(storage, user.photoURL);
          await deleteObject(photoRef);
        } catch (error) {
          console.warn('Could not delete profile picture:', error);
        }
      }

      // Delete user account
      await deleteUser(user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async resendEmailVerification(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      await sendEmailVerification(user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async getUserData(uid: string): Promise<User> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const data = userDoc.data();
      return {
        uid,
        email: data.email,
        displayName: data.displayName,
        username: data.username,
        photoURL: data.photoURL,
        emailVerified: data.emailVerified,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        phoneNumber: data.phoneNumber,
        bio: data.bio
      };
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  private validateSignUpData(data: SignUpData): void {
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Please enter a valid email address');
    }

    if (!data.password || data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!this.isValidPassword(data.password)) {
      throw new Error('Password must contain at least one number and one special character');
    }

    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (!data.username || data.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (!this.isValidUsername(data.username)) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }

    if (!data.displayName || data.displayName.trim().length === 0) {
      throw new Error('Display name is required');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasNumber && hasSpecialChar;
  }

  private isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
  }

  private async checkUsernameAvailability(username: string, excludeUid?: string): Promise<void> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingUser = querySnapshot.docs[0];
      if (!excludeUid || existingUser.id !== excludeUid) {
        throw new Error('Username is already taken');
      }
    }
  }

  private async generateUniqueUsername(baseName: string): Promise<string> {
    let username = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (username.length < 3) username = 'user';

    let counter = 0;
    let finalUsername = username;

    while (true) {
      try {
        await this.checkUsernameAvailability(finalUsername);
        return finalUsername;
      } catch (error) {
        counter++;
        finalUsername = `${username}${counter}`;
      }
    }
  }

  private async updateLastLogin(uid: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        lastLoginAt: serverTimestamp()
      });
    } catch (error) {
      console.warn('Could not update last login time:', error);
    }
  }

  private checkRateLimit(email: string): void {
    const attempts = this.loginAttempts.get(email);
    if (attempts) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
      
      if (attempts.count >= this.MAX_LOGIN_ATTEMPTS) {
        if (timeSinceLastAttempt < this.LOCKOUT_DURATION) {
          const remainingTime = Math.ceil((this.LOCKOUT_DURATION - timeSinceLastAttempt) / 60000);
          throw new Error(`Too many login attempts. Please try again in ${remainingTime} minutes.`);
        } else {
          // Reset attempts after lockout period
          this.loginAttempts.delete(email);
        }
      }
    }
  }

  private incrementLoginAttempts(email: string): void {
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    attempts.count++;
    attempts.lastAttempt = Date.now();
    this.loginAttempts.set(email, attempts);
  }

  private handleAuthError(error: any): Error {
    console.error('Auth error:', error);

    switch (error.code) {
      case 'auth/popup-closed-by-user':
        return new Error('Sign-in was cancelled. Please try again if you want to continue.');
      case 'auth/popup-blocked':
        return new Error('Pop-up was blocked by your browser. Please allow pop-ups and try again.');
      case 'auth/cancelled-popup-request':
        return new Error('Sign-in was cancelled. Please try again.');
      case 'auth/user-not-found':
        return new Error('No account found with this email address');
      case 'auth/wrong-password':
        return new Error('Incorrect password');
      case 'auth/email-already-in-use':
        return new Error('An account with this email already exists');
      case 'auth/weak-password':
        return new Error('Password is too weak');
      case 'auth/invalid-email':
        return new Error('Invalid email address');
      case 'auth/user-disabled':
        return new Error('This account has been disabled');
      case 'auth/too-many-requests':
        return new Error('Too many requests. Please try again later');
      case 'auth/network-request-failed':
        return new Error('Network connection failed. Please check your internet connection and try again.');
      case 'auth/requires-recent-login':
        return new Error('Please log in again to perform this action');
      case 'unavailable':
        return new Error('Service is temporarily unavailable. Please try again later.');
      case 'permission-denied':
        return new Error('You do not have permission to perform this action');
      default:
        // For development environment, provide more helpful error messages
        if (import.meta.env.DEV && (error.code === 'unavailable' || error.message?.includes('UNAVAILABLE'))) {
          return new Error('Unable to connect to Firebase. Make sure Firebase emulators are running or check your internet connection.');
        }
        return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const authService = new AuthService();