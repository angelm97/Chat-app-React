// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB49qdIwvDj61jz0Dqg0DlD1adgXrSoNd8",
  authDomain: "chat-app-ce539.firebaseapp.com",
  projectId: "chat-app-ce539",
  storageBucket: "chat-app-ce539.appspot.com",
  messagingSenderId: "832617520350",
  appId: "1:832617520350:web:e7246af49bfb7e6248364f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const dbr = getDatabase(app);

export {auth, provider, db, dbr};
