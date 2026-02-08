// js/configStorage.js
console.log("🚨 CONFIG STORAGE ATIVO");

const CONFIG_KEY = "clinica_config";

function obterConfig() {
  let salvo = {};
  try {
    salvo = JSON.parse(localStorage.getItem(CONFIG_KEY)) || {};
  } catch {}
  return salvo;
}

function salvarConfig(config) {
  const stack = new Error().stack;

  console.group("💥 SALVAR CONFIG CHAMADO");
  console.log("CONFIG RECEBIDO:", config);
  console.log("STACK TRACE:");
  console.log(stack);
  console.groupEnd();

  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

window.ConfigClinica = {
  obter: obterConfig,
  salvar: salvarConfig
};
