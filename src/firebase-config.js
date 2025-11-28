// Importation des fonctions nécessaires de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Votre configuration (celle que vous m'avez fournie)
const firebaseConfig = {
  apiKey: "AIzaSyC9yhV65zunHHU1dArxt4ciWQ1n1dGMV-g",
  authDomain: "iftsau-espace.firebaseapp.com",
  projectId: "iftsau-espace",
  storageBucket: "iftsau-espace.firebasestorage.app",
  messagingSenderId: "581719326112",
  appId: "1:581719326112:web:83e30de4034f2a10c7f8c5",
  measurementId: "G-2R7WHL6YX4"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// On exporte ces outils pour pouvoir les utiliser dans les autres pages
export { auth, db };