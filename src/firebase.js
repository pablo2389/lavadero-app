import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRyZ9-Wq9Itv8ox8_kfrqXB4q92MqyDtA",
  authDomain: "lavadero-app-46a17.firebaseapp.com",
  projectId: "lavadero-app-46a17",
  storageBucket: "lavadero-app-46a17.appspot.com",
  messagingSenderId: "542463286936",
  appId: "1:542463286936:web:ca72843bfde56f9c6bfaed",
  measurementId: "G-GZBXHK06DN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
