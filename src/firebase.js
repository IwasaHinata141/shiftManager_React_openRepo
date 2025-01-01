// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaVtHJAG86Gg3EJ54Y5JbY3VcXiZlLadI",
  authDomain: "shiftmaker-fee68.firebaseapp.com",
  projectId: "shiftmaker-fee68",
  storageBucket: "shiftmaker-fee68.appspot.com",
  messagingSenderId: "622996524957",
  appId: "1:622996524957:web:8779aa2e96400dc2e1e974",
  measurementId: "G-0LV3Z5CVW7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

 
