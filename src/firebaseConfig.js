// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD0UHmgPSNEZsI4cG5MQipiN0KzK-322H4",
    authDomain: "echospace-83557.firebaseapp.com",
    projectId: "echospace-83557",
    storageBucket: "echospace-83557.appspot.com",
    messagingSenderId: "898527656790",
    appId: "1:898527656790:web:5ce8038eda1cc2b9e3f4f7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);       // Initialize Firebase Auth
const db = getFirestore(app);     // Initialize Firestore

export { auth, db };             // Export auth and Firestore instance
