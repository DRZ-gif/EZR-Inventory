
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

export const firebaseConfig = {
  apiKey: "AIzaSyD9eWC9PYNTyahnUrNR2FrZDlLAdlDjnDo",
  authDomain: "ezr-inventory.firebaseapp.com",
  databaseURL: "https://ezr-inventory-default-rtdb.firebaseio.com",
  projectId: "ezr-inventory",
  storageBucket: "ezr-inventory.firebasestorage.app",
  messagingSenderId: "238043628460",
  appId: "1:238043628460:web:9cdd470519418029817009",
  measurementId: "G-YPTJR2LP3W"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
