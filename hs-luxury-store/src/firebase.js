// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlQ7yDqx8QDnw7Jg5AnQ_ObxcXVoEKr78",
  authDomain: "hs-luxury-store-e179d.firebaseapp.com",
  projectId: "hs-luxury-store-e179d",
  storageBucket: "hs-luxury-store-e179d.firebasestorage.app",
  messagingSenderId: "8924837218",
  appId: "1:8924837218:web:8585a671ebac2f9025e83b",
  measurementId: "G-RDNF640FVM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);