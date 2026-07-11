import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Replace these placeholders with your actual Firebase config or add them to your .env.local / env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyPlaceholderForDevelopmentOnly",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "propit-dummy.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "propit-dummy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "propit-dummy.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:dummy",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
