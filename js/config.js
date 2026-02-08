// js/config.js
import { buscarClinica } from "./data.js";

// Configuração padrão (fallback)
const APP_CONFIG = {
  nome: "Estética Viva",
  slogan: "Cuidado, beleza e bem-estar",

  whatsapp: {
    numero: "5511999999999",
    mensagemPadrao:
      "Olá! Vim pelo app e gostaria de tirar uma dúvida 😊"
  },

  instagram: {
    link: ""
  },

  cores: {
    primaria: "#553599"
  }
};

// Lê clinica_id da URL (?c=)
const params = new URLSearchParams(window.location.search);
const clinicaId = params.get("c");

// Carrega dados da clínica do Firebase
async function carregarClinicaFirebase() {
  if (!clinicaId) return;

  try {
    const dadosClinica = await buscarClinica(clinicaId);

    if (!dadosClinica) {
      console.warn("Clínica não encontrada no Firebase");
      return;
    }

    // Salva como cache local
    localStorage.setItem("clinica", JSON.stringify(dadosClinica));

    // Atualiza config em memória
    Object.assign(APP_CONFIG, dadosClinica);

    // Dispara evento para o app reagir
    document.dispatchEvent(new Event("clinicaCarregada"));

  } catch (err) {
    console.error("Erro ao carregar clínica:", err);
  }
}

// Executa automaticamente
carregarClinicaFirebase();

export default APP_CONFIG;
