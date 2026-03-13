import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

/* =========================
   ADMINS PERMITIDOS
========================= */

const allowedAdmins = [
  "carenangel@tretto.co",
  "andresgarcia@tretto.co"
];

/* =========================
   ELEMENTOS
========================= */

const adminEmailInput = document.getElementById("adminEmail");
const adminPasswordInput = document.getElementById("adminPassword");
const loginBtn = document.getElementById("loginBtn");
const loadBtn = document.getElementById("loadBtn");
const exportBtn = document.getElementById("exportBtn");
const logoutBtn = document.getElementById("logoutBtn");
const statusEl = document.getElementById("status");
const loginCard = document.getElementById("loginCard");
const panelCard = document.getElementById("panelCard");
const dataTable = document.getElementById("dataTable");
const tbody = dataTable.querySelector("tbody");

let cachedRows = [];

/* =========================
   UTILIDADES
========================= */

function setStatus(message) {
  statusEl.textContent = message;
}

function escapeCsv(value) {
  if (value === null || value === undefined) return "";
  return `"${String(value).replace(/"/g, '""')}"`;
}

/* =========================
   RENDER TABLA
========================= */

function renderTable(rows) {
  tbody.innerHTML = "";

  rows.forEach((row) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${row.nombre || ""}</td>
      <td>${row.cedula || ""}</td>
      <td>${row.celular || ""}</td>
      <td>${row.correo || ""}</td>
      <td>${row.pais || ""}</td>
      <td>${row.ciudad || ""}</td>
      <td>${row.profesion || ""}</td>
      <td>${row.institucion || ""}</td>
      <td>${row.asistencia || ""}</td>
    `;

    tbody.appendChild(tr);
  });

  dataTable.classList.remove("hidden");
}

/* =========================
   CARGAR INSCRIPCIONES
========================= */

async function loadInscripciones() {

  setStatus("Cargando inscripciones...");

  const q = query(collection(db, "inscripciones"));
  const snapshot = await getDocs(q);

  cachedRows = snapshot.docs.map((doc) => {

    const data = doc.data();

    return {
      nombre: data.nombre || "",
      cedula: data.cedula || "",
      celular: data.celular || "",
      correo: data.correo || "",
      pais: data.pais || "",
      ciudad: data.ciudad || "",
      profesion: data.profesion || "",
      institucion: data.institucion || "",
      asistencia: data.asistencia || ""
    };

  });

  renderTable(cachedRows);

  setStatus(`Inscripciones cargadas: ${cachedRows.length}`);

}

/* =========================
   EXPORTAR CSV
========================= */

function downloadCsv(rows) {

  const headers = [
    "Nombre",
    "Cedula",
    "Celular",
    "Correo",
    "Pais",
    "Ciudad",
    "Profesion",
    "Institucion",
    "Asistencia"
  ];

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.nombre,
        row.cedula,
        row.celular,
        row.correo,
        row.pais,
        row.ciudad,
        row.profesion,
        row.institucion,
        row.asistencia
      ].map(escapeCsv).join(",")
    )
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "inscripciones-simposio.csv";

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);

}

/* =========================
   LOGIN
========================= */

loginBtn.addEventListener("click", async () => {

  try {

    setStatus("Ingresando...");

    await signInWithEmailAndPassword(
      auth,
      adminEmailInput.value.trim(),
      adminPasswordInput.value
    );

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    setStatus(error.message);

  }

});

/* =========================
   BOTONES PANEL
========================= */

loadBtn.addEventListener("click", async () => {

  try {

    await loadInscripciones();

  } catch (error) {

    console.error(error);

    setStatus("No se pudieron cargar las inscripciones.");

  }

});

exportBtn.addEventListener("click", () => {

  if (!cachedRows.length) {

    setStatus("Primero carga las inscripciones.");

    return;

  }

  downloadCsv(cachedRows);

});

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

});

/* =========================
   ESTADO DE AUTENTICACIÓN
========================= */

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    loginCard.classList.remove("hidden");
    panelCard.classList.add("hidden");

    dataTable.classList.add("hidden");
    tbody.innerHTML = "";
    cachedRows = [];

    return;

  }

  const email = user.email?.toLowerCase() || "";

  if (!allowedAdmins.includes(email)) {

    setStatus("Tu cuenta no tiene permisos para acceder.");

    await signOut(auth);

    return;

  }

  loginCard.classList.add("hidden");
  panelCard.classList.remove("hidden");

  setStatus("");

  try {

    await loadInscripciones();

  } catch (error) {

    console.error(error);

    setStatus("No se pudieron cargar las inscripciones.");

  }

});