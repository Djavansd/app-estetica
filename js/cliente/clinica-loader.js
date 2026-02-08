// js/cliente/clinica-loader.js

import { buscarClinica } from "../data.js";
import { db } from "../firebase.js";
import {
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

console.log("🏥 clinica-loader.js carregado");

// =========================
// 🔑 RESOLVER CLÍNICA ID (FONTE ÚNICA)
// =========================

// REGRA ABSOLUTA:
// 1. URL (?c=) vence
// 2. localStorage é fallback
// 3. SEMPRE salvar em clinicId

const params = new URLSearchParams(window.location.search);

let CLINICA_ID = params.get("c");

if (CLINICA_ID) {
  localStorage.setItem("clinicId", CLINICA_ID);
} else {
  CLINICA_ID = localStorage.getItem("clinicId");
}

// =========================
// CONTROLE DE EXECUÇÃO
// =========================
let JA_INICIADO = false;
let unsubscribeRealtime = null;

// =========================
// 🔄 TEMPO REAL (FIRESTORE)
// =========================
function escutarClinicaTempoReal(clinicaId) {
  if (!clinicaId) return;

  const ref = doc(db, "clinicas", clinicaId);

  return onSnapshot(ref, snap => {
    if (!snap.exists()) return;

    const dados = snap.data();
    console.log("🔄 Clínica atualizada em tempo real", dados);

    // 🔒 Atualiza estado local (SEM QUEBRAR)
    const cfgAtual = ConfigClinica.obter();
    const atualizado = {
      ...cfgAtual,
      ...dados,
      clinica_id: clinicaId
    };

    ConfigClinica.salvar(atualizado);

    // 🔔 Notifica o app inteiro
    document.dispatchEvent(
      new CustomEvent("clinicaAtualizada", {
        detail: atualizado
      })
    );
  });
}

// =========================
// 🚀 INICIAR CLÍNICA
// =========================
export async function iniciarClinica() {
  if (JA_INICIADO) return;
  JA_INICIADO = true;

  if (!CLINICA_ID) {
    console.warn("⚠️ Nenhuma clínica identificada");
    document.body.classList.add("sem-clinica");
    return;
  }

  try {
    const dados = await buscarClinica(CLINICA_ID);

    if (!dados) {
      console.warn("⚠️ Clínica não encontrada:", CLINICA_ID);
      document.body.classList.add("sem-clinica");
      return;
    }

    // 🔒 ESTADO GLOBAL CONSISTENTE
    const configAtual = ConfigClinica.obter();
    const configInicial = {
      ...configAtual,
      ...dados,
      clinica_id: CLINICA_ID
    };

    ConfigClinica.salvar(configInicial);

    window.__CLINICA_ATUAL__ = configInicial;

    console.log("🏥 Clínica carregada:", CLINICA_ID);

    // 🔔 EVENTO OFICIAL (BASE)
    document.dispatchEvent(
      new CustomEvent("clinicaCarregada", {
        detail: configInicial
      })
    );

    // 🔄 ATIVA TEMPO REAL (UMA VEZ)
    if (!unsubscribeRealtime) {
      unsubscribeRealtime = escutarClinicaTempoReal(CLINICA_ID);
    }

    // ✅ AGORA SIM O APP ESTÁ PRONTO
    document.dispatchEvent(new Event("appClientePronto"));

  } catch (err) {
    console.error("❌ Erro ao iniciar clínica:", err);
    document.body.classList.add("sem-clinica");
  }
}
