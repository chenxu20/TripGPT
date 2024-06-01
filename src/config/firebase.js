// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPq7ec9cStswmQSSg2UwAR5g0oFItIwHw",
  authDomain: "orbital-c44e9.firebaseapp.com",
  projectId: "orbital-c44e9",
  storageBucket: "orbital-c44e9.appspot.com",
  messagingSenderId: "807915002792",
  appId: "1:807915002792:web:e49cd12f7be6baa9b25b9d",
  measurementId: "G-QPQ4VKW4ZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider =  new GoogleAuthProvider();
export const db = getFirestore(app);
//const analytics = getAnalytics(app);