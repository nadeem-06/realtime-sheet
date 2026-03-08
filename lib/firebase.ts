import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPQG-f5Kr9a5MDwDOk14F626SowdIL5qE",
  authDomain: "realtime-sheet-fbd09.firebaseapp.com",
  projectId: "realtime-sheet-fbd09",
  storageBucket: "realtime-sheet-fbd09.firebasestorage.app",
  messagingSenderId: "67073157522",
  appId: "1:67073157522:web:6a83fa7e34f7541442f94b",
  measurementId: "G-QNHT969Y6H"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);