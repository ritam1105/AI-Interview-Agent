import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
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

const auth=getAuth(app);

const provider=new GoogleAuthProvider();

export {auth, provider}