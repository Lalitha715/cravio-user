
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHFVeml99c3fZ3YTIGAgLGT7rOqvci50I",
  authDomain: "cravio-user.firebaseapp.com",
  projectId: "cravio-user",
  storageBucket: "cravio-user.firebasestorage.app",
  messagingSenderId: "535579487460",
  appId: "1:535579487460:web:0576aec4035ecd514990f1",
  measurementId: "G-RTF1HRPNWB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
