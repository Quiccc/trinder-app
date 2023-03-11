import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJF3X9WWI3RSl4Rc6VMR1BcPwtX__neHM",
  authDomain: "trinder-4pp.firebaseapp.com",
  projectId: "trinder-4pp",
  storageBucket: "trinder-4pp.appspot.com",
  messagingSenderId: "432564282535",
  appId: "1:432564282535:web:8d71e71c794a4e8bc12782"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);