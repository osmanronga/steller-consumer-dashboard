// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3fucXkGXcBeWk1Axy2",
  authDomain: "op-plus.firebaseapp.com",
  projectId: "op-plus",
  storageBucket: 'op-plus.appspot.com',
  messagingSenderId: "1021495233101",
  appId: "1:1021495233101:android:c634a2d15e2a88bd836a04"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
