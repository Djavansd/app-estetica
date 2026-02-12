// js/painel/resolverClinica.js
(function resolverClinicaPainel() {
  function aplicarEstado(temClinica) {
    const cadastro = document.getElementById("cadastroInicial");
    const painel = document.getElementById("painelPrincipal");

    window.__SEM_CLINICA__ = !temClinica;

    if (cadastro) {
      cadastro.classList.toggle("hidden", temClinica);
    }

    if (painel) {
      painel.style.display = temClinica ? "block" : "none";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const config = window.ConfigClinica?.obter?.() || {};
    aplicarEstado(Boolean(config.clinica_id));
  });
})();
