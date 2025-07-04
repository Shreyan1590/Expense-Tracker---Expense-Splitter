import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enhanced emulator connection with better error handling
if (import.meta.env.DEV) {
  let emulatorsConnected = false;
  
  try {
    // Check if we're already connected to avoid multiple connection attempts
    if (!emulatorsConnected) {
      // Test if emulators are available before connecting
      const testEmulatorConnection = async () => {
        try {
          const response = await fetch('http://localhost:9099', { method: 'HEAD' });
          return response.ok || response.status === 404; // 404 is also acceptable for emulator
        } catch {
          return false;
        }
      };

      testEmulatorConnection().then(isAvailable => {
        if (isAvailable) {
          try {
            connectAuthEmulator(auth, "http://localhost:9099");
            connectFirestoreEmulator(db, 'localhost', 8080);
            connectStorageEmulator(storage, "localhost", 9199);
            emulatorsConnected = true;
            console.log("✅ Connected to Firebase emulators");
          } catch (error) {
            console.warn("⚠️ Firebase emulators already connected or connection failed:", error);
          }
        } else {
          console.warn("⚠️ Firebase emulators not detected. Using production Firebase services.");
          console.warn("💡 To use emulators, run: firebase emulators:start");
        }
      }).catch(() => {
        console.warn("⚠️ Could not test emulator connection. Using production Firebase services.");
      });
    }
  } catch (error) {
    console.warn("⚠️ Firebase emulator setup failed:", error);
  }
}

export default app;