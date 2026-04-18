import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAAvbbkb5K-vAc0WTXIO24-rVWwD1rRTOc",
  authDomain: "banjir-694eb.firebaseapp.com",
  projectId: "banjir-694eb",
  storageBucket: "banjir-694eb.firebasestorage.app",
  messagingSenderId: "277377011101",
  appId: "1:277377011101:web:15affb159645846d0ff374"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
