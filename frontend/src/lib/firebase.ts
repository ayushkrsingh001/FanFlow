import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBdEKHYMblxuxfYPBvACAMEHnSR-m2fF-U",
  authDomain: "parulolx.firebaseapp.com",
  projectId: "parulolx",
  storageBucket: "parulolx.firebasestorage.app",
  messagingSenderId: "392039663484",
  appId: "1:392039663484:web:15700a2a18cf42e3f986f9",
  measurementId: "G-SKKWCX5X9J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
