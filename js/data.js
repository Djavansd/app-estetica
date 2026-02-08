// js/data.js

import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* =========================
   CLÍNICA
========================= */

export async function salvarClinica(clinicaId, dados) {
  if (!clinicaId) return;

  const ref = doc(db, "clinicas", clinicaId);

  await setDoc(
    ref,
    {
      ...dados,
      clinica_id: clinicaId,
      atualizado_em: serverTimestamp()
    },
    { merge: true }
  );
}

export async function buscarClinica(clinicaId) {
  if (!clinicaId) return null;

  const ref = doc(db, "clinicas", clinicaId);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data() : null;
}

export function escutarClinica(clinicaId, callback) {
  if (!clinicaId) return;

  const ref = doc(db, "clinicas", clinicaId);

  return onSnapshot(ref, snap => {
    if (snap.exists()) callback(snap.data());
  });
}

/* =========================
   AGENDAMENTOS
========================= */

export async function criarAgendamento(clinicaId, dados) {
  if (!clinicaId) return;

  const col = collection(db, "agendamentos", clinicaId, "itens");

  await addDoc(col, {
    ...dados,
    clinica_id: clinicaId,
    cancelado: false,
    criado_em: serverTimestamp()
  });
}

export function escutarAgendamentos(clinicaId, callback) {
  if (!clinicaId) return;

  const col = collection(db, "agendamentos", clinicaId, "itens");

  return onSnapshot(col, snapshot => {
    const dados = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    callback(dados);
  });
}

/* =========================
   CANCELAMENTO (CRÍTICO)
========================= */

export async function cancelarAgendamento(clinicaId, agendamentoId) {
  if (!clinicaId || !agendamentoId) return;

  const ref = doc(db, "agendamentos", clinicaId, "itens", agendamentoId);

  await updateDoc(ref, {
    cancelado: true,
    cancelado_por: "proprietaria",
    cancelado_em: serverTimestamp()
  });
}
