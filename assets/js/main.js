import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   FIREBASE
========================= */

const firebaseConfig = {
    apiKey: "AIzaSyAd_R31sy3Mnx23Y28RwifpAYJ0w_kQfJs",
    authDomain: "simposio-reumatologia-2026.firebaseapp.com",
    projectId: "simposio-reumatologia-2026",
    storageBucket: "simposio-reumatologia-2026.firebasestorage.app",
    messagingSenderId: "455645777685",
    appId: "1:455645777685:web:c5a38649690edf9119e31c",
    measurementId: "G-QDDRKMFB2Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

  const successModal = document.getElementById("successModal");
const successModalClose = document.getElementById("successModalClose");
const successModalButton = document.getElementById("successModalButton");

/* =========================
   COUNTDOWN
========================= */

const eventDate = new Date("2026-04-17T07:00:00-05:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = eventDate - now;



  if (distance <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* =========================
   FORM
========================= */

const registerForm = document.getElementById("registerForm");
const formMessage = document.getElementById("formMessage");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("submit iniciado");

  const submitButton = registerForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "ENVIANDO...";
  formMessage.textContent = "";

  const formData = new FormData(registerForm);

  const data = {
    nombre: formData.get("nombre")?.trim() || "",
    cedula: formData.get("cedula")?.trim() || "",
    celular: formData.get("celular")?.trim() || "",
    correo: formData.get("correo")?.trim() || "",
    pais: formData.get("pais")?.trim() || "",
    ciudad: formData.get("ciudad")?.trim() || "",
    profesion: formData.get("profesion")?.trim() || "",
    institucion: formData.get("institucion")?.trim() || "",
    asistencia: formData.get("asistencia") || "",
    createdAt: serverTimestamp()
  };

  console.log("datos listos", data);

  try {
    console.log("antes de addDoc");
    await addDoc(collection(db, "inscripciones"), data);
    console.log("después de addDoc");

    formMessage.textContent = "";
registerForm.reset();
openSuccessModal();
  } catch (error) {
    console.error("error al guardar", error);
    formMessage.textContent = "Hubo un error al enviar el formulario.";
  } finally {
    console.log("finally");
    submitButton.disabled = false;
    submitButton.textContent = "REGISTRARME";
  }
});


function openSuccessModal() {
  successModal.classList.add("is-open");
  successModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeSuccessModal() {
  successModal.classList.remove("is-open");
  successModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

successModalClose.addEventListener("click", closeSuccessModal);
successModalButton.addEventListener("click", closeSuccessModal);

successModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("success-modal__backdrop")) {
    closeSuccessModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && successModal.classList.contains("is-open")) {
    closeSuccessModal();
  }
});