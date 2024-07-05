import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';
//import { getAnalytics } from "firebase/analytics";

//Firebase configuration
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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider =  new GoogleAuthProvider();
export const database = getFirestore(app);
export const transactionCollection = collection(database, "transactions")
export const travellersCollection = collection(database, "travellers-info")
export const tripCollection = collection(database, "trip-details")
//const analytics = getAnalytics(app);