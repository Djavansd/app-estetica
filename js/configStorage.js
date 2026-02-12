// js/configStorage.js
console.log("CONFIG STORAGE ATIVO");

const CONFIG_KEY = "clinica_config";

function obterConfig() {
  let salvo = {};
  try {
    salvo = JSON.parse(localStorage.getItem(CONFIG_KEY)) || {};
  } catch {
    salvo = {};
  }
  return salvo;
}

function salvarConfig(config) {
  const stack = new Error().stack;

  console.group("SALVAR CONFIG CHAMADO");
  console.log("CONFIG RECEBIDO:", config);
  console.log("STACK TRACE:");
  console.log(stack);
  console.groupEnd();

  localStorage.setItem(CONFIG_KEY, JSON.stringify(config || {}));
  localStorage.setItem("ultima_atualizacao_visual", String(Date.now()));

  window.dispatchEvent(
    new CustomEvent("configClinicaSalva", {
      detail: config || {}
    })
  );

  if (
    config?.clinica_id &&
    typeof window.salvarClinicaFirebase === "function"
  ) {
    window.salvarClinicaFirebase(config.clinica_id, config);
  }
}

window.ConfigClinica = {
  obter: obterConfig,
  salvar: salvarConfig
};
