const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');

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

module.exports = { auth };