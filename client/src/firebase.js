// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-3052f.firebaseapp.com",
  projectId: "mern-blog-3052f",
  storageBucket: "mern-blog-3052f.appspot.com",
  messagingSenderId: "710291699980",
  appId: "1:710291699980:web:f69994e41cf64a16253129"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);