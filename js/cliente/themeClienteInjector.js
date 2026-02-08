// =======================================
// THEME CLIENTE INJECTOR (ISOLADO 100%)
// Limpa tema anterior antes de aplicar novo
// =======================================

console.log("🎨 themeClienteInjector.js carregado");

// 🔥 REMOVE QUALQUER TEMA ANTIGO
function limparTemaCliente() {
  const vars = [
    "--cliente-primary",
    "--cliente-bg-start",
    "--cliente-bg-end"
  ];

  vars.forEach(v =>
    document.documentElement.style.removeProperty(v)
  );

  console.log("🎨 Tema anterior removido");
}

function aplicarTemaClienteSeguro(config) {
  if (!config || !config.visual_cliente) {
    console.warn("🎨 visual_cliente ausente");
    return;
  }

  // 🔥 LIMPA ANTES DE APLICAR
  limparTemaCliente();

  const visual = config.visual_cliente;

  document.documentElement.style.setProperty(
    "--cliente-primary",
    visual.cor_primaria || "#000000"
  );

  document.documentElement.style.setProperty(
    "--cliente-bg-start",
    visual.fundo_inicio || "#ffffff"
  );

  document.documentElement.style.setProperty(
    "--cliente-bg-end",
    visual.fundo_fim || "#ffffff"
  );

  console.log("🎨 Tema do cliente aplicado (limpo)", visual);
}

// ===============================
// Fonte única e oficial
// ===============================
document.addEventListener("clinicaCarregada", (e) => {
  aplicarTemaClienteSeguro(e.detail);
});

// ===============================
// Cold start (atalho / reload)
// ===============================
(function aguardarClinica() {
  let tentativas = 0;

  const timer = setInterval(() => {
    tentativas++;

    if (window.ConfigClinica?.obter) {
      const config = window.ConfigClinica.obter();
      if (config) {
        aplicarTemaClienteSeguro(config);
        clearInterval(timer);
      }
    }

    if (tentativas > 20) {
      clearInterval(timer);
      console.warn("🎨 Tema não aplicado no cold start");
    }
  }, 150);
})();
// ===============================
// 🔔 ATUALIZAÇÃO AUTOMÁTICA (PAINEL → CLIENTE)
// via localStorage (entre abas / PWA)
// ===============================
window.addEventListener("storage", (event) => {
  if (event.key === "ultima_atualizacao_visual") {
    console.log("🎨 Atualização visual recebida via storage");

    if (window.ConfigClinica?.obter) {
      const config = window.ConfigClinica.obter();
      aplicarTemaClienteSeguro(config);
    }
  }
});
