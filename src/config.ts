// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJrXbOZZqri-RpjxBONK3B32Pk2YGksj0",
  authDomain: "chat-f60b9.firebaseapp.com",
  projectId: "chat-f60b9",
  storageBucket: "chat-f60b9.appspot.com",
  messagingSenderId: "669312349462",
  appId: "1:669312349462:web:3670bfaf36ec6afdcb8c37",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
