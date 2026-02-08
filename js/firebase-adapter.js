import { salvarClinica } from "./data.js";

console.log("🔥 firebase-adapter carregou");

window.salvarClinicaFirebase = async function (clinicaId, config) {
  if (!clinicaId) return;

  try {
    await salvarClinica(clinicaId, config);
    console.log("Clínica salva no Firebase:", clinicaId);
  } catch (err) {
    console.error("Erro ao salvar no Firebase:", err);
  }
};
