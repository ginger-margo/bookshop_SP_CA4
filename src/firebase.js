import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgl2NRzzgfUrr8n-ihZKHHQ0yL4ji7fSk",
  authDomain: "bookshop-sp-ca4.firebaseapp.com",
  projectId: "bookshop-sp-ca4",
  storageBucket: "bookshop-sp-ca4.appspot.com",
  messagingSenderId: "46954138938",
  appId: "1:46954138938:web:e78b8c5f2b2ca01bd95403",
  measurementId: "G-RQDB0LSF03"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
