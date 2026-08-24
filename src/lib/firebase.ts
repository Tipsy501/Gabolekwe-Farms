import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKEXYDSmXx4h8LbWlPq_iaTT-32307SMQ",
  authDomain: "gfarms-169ec.firebaseapp.com",
  projectId: "gfarms-169ec",
  storageBucket: "gfarms-169ec.firebasestorage.app",
  messagingSenderId: "616382530002",
  appId: "1:616382530002:web:bacc1de99fdeff6a5c880b",
  measurementId: "G-HGC7DFHXRM"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);

export default app;

