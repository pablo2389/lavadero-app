import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAToXPgiUYpHd5emmbGTzOY94qG_t10Ofo",
  authDomain: "lavadero-app-34ea2.firebaseapp.com",
  projectId: "lavadero-app-34ea2",
  storageBucket: "lavadero-app-34ea2.firebasestorage.app",
  messagingSenderId: "886764097578",
  appId: "1:886764097578:web:d21985808ae578c1053353",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
