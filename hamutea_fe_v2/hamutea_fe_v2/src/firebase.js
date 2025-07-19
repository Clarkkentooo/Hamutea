// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCddTz_xHlf59K8na5Ygted78duw7s08TU",
  authDomain: "hamutea-web-app.firebaseapp.com",
  projectId: "hamutea-web-app",
  storageBucket: "hamutea-web-app.firebasestorage.app",
  messagingSenderId: "612910950122",
  appId: "1:612910950122:web:53e865b02efde54f885993",
  measurementId: "G-0PM7ZKMCK7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };