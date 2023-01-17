import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-JgdDLgKAaKy9l2AXU07wN8hokEo3RaM",
  authDomain: "trinder-app.firebaseapp.com",
  projectId: "trinder-app",
  storageBucket: "trinder-app.appspot.com",
  messagingSenderId: "715417904541",
  appId: "1:715417904541:web:b0f8f883295d48040efb74",
  measurementId: "G-B0T6RP51XZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);