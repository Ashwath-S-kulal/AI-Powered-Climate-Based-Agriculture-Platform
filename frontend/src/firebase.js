// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: "mern-auth-e623e.firebaseapp.com",
//   projectId: "mern-auth-e623e",
//   storageBucket: "mern-auth-e623e.firebasestorage.app",
//   messagingSenderId: "522397456920",
//   appId: "1:522397456920:web:db6bafc15e57650549416d"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "climate-resilient-agricu-b5111.firebaseapp.com",
  projectId: "climate-resilient-agricu-b5111",
  storageBucket: "climate-resilient-agricu-b5111.firebasestorage.app",
  messagingSenderId: "874806196850",
  appId: "1:874806196850:web:1689061e1da035e112e0eb",
  measurementId: "G-NCD5P2VF8Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);