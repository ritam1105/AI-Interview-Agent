import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewai-bcb85.firebaseapp.com",
  projectId: "interviewai-bcb85",
  storageBucket: "interviewai-bcb85.firebasestorage.app",
  messagingSenderId: "991734192530",
  appId: "1:991734192530:web:36523232e743011592894b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

