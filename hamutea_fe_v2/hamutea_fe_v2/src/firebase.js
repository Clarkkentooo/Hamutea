// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCddTz_xHlf59K8na5Ygted78duw7s08TU",
  authDomain: "localhost", // Use localhost instead of hamutea-web-app.firebaseapp.com
  projectId: "hamutea-web-app",
  storageBucket: "hamutea-web-app.appspot.com",
  messagingSenderId: "612910950122",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:612910950122:web:53e865b02efde54f885993",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0PM7ZKMCK7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider };