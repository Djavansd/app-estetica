// js/painel/applyVisualPainel.js
function aplicarVisualPainel() {
  if (!window.ConfigClinica) return;

  const config = ConfigClinica.obter();
  const visual = config.visual_painel || {};

  if (visual.cor_primaria) {
    document.documentElement.style.setProperty("--primary", visual.cor_primaria);
  }

  if (visual.fundo_inicio) {
    document.documentElement.style.setProperty("--bg-start", visual.fundo_inicio);
  }

  if (visual.fundo_fim) {
    document.documentElement.style.setProperty("--bg-end", visual.fundo_fim);
  }
}

document.addEventListener("DOMContentLoaded", aplicarVisualPainel);
window.addEventListener("storage", (event) => {
  if (event.key === "clinica_config" || event.key === "ultima_atualizacao_visual") {
    aplicarVisualPainel();
  }
});
