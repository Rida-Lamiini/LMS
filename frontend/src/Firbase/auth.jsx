// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBTnqjq15_QxIEONIP-9EFZm5u1FFuFmwg",
  authDomain: "lms-app-bd2b4.firebaseapp.com",
  projectId: "lms-app-bd2b4",
  storageBucket: "lms-app-bd2b4.appspot.com",
  messagingSenderId: "830421415465",
  appId: "1:830421415465:web:526f2f53a0a90bec7cce38",
  measurementId: "G-C2BW3782DG"
};

// Initialize Firebase
// const analytics = getAnalytics(app);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth,db };
