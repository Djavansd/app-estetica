// js/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDM-sL68XtvcVjYvLpbEnBb3NHQ0EQCAj0",
  authDomain: "app-estetica-7cd55.firebaseapp.com",
  projectId: "app-estetica-7cd55",
  storageBucket: "app-estetica-7cd55.firebasestorage.app",
  messagingSenderId: "103983870278",
  appId: "1:103983870278:web:a0be935cc276da49927547"
};

const app = initializeApp(firebaseConfig);

// 🔥 O QUE JÁ FUNCIONAVA (INALTERADO)
const db = getFirestore(app);

// ✅ O QUE FALTAVA (LOGIN)
const auth = getAuth(app);

console.log("🔥 Firebase inicializado:", firebaseConfig.projectId);

export { db, auth };
