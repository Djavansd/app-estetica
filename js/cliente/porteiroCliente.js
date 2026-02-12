// js/cliente/porteiroCliente.js
(function iniciarPorteiroCliente() {
  const params = new URLSearchParams(window.location.search);
  const clinicaIdUrl = params.get("c");
  const clinicaIdLocal = localStorage.getItem("clinicId");

  if (clinicaIdUrl) {
    localStorage.setItem("clinicId", clinicaIdUrl);
  }

  if (clinicaIdUrl || clinicaIdLocal) return;

  document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".app-container");
    if (!container) return;

    const aviso = document.createElement("div");
    aviso.className = "card";
    aviso.innerHTML = `
      <h3>Link invalido</h3>
      <p>Abra o app pelo link enviado pela clinica para carregar os dados.</p>
    `;

    container.prepend(aviso);
  });
})();
