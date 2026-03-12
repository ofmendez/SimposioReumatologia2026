  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAd_R31sy3Mnx23Y28RwifpAYJ0w_kQfJs",
    authDomain: "simposio-reumatologia-2026.firebaseapp.com",
    projectId: "simposio-reumatologia-2026",
    storageBucket: "simposio-reumatologia-2026.firebasestorage.app",
    messagingSenderId: "455645777685",
    appId: "1:455645777685:web:c5a38649690edf9119e31c",
    measurementId: "G-QDDRKMFB2Y"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
