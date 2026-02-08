// js/cliente/applyVisualCliente.js

console.log("🎨 applyVisualCliente.js carregado");

// ==============================
// APLICA VISUAL DO CLIENTE
// ==============================
function aplicarVisualCliente(clinica) {
  if (!clinica || !clinica.visual_cliente) return;

  const visual = clinica.visual_cliente;

  document.documentElement.style.setProperty(
    "--cliente-primary",
    visual.cor_primaria || "#6C4AB6"
  );

  document.documentElement.style.setProperty(
    "--cliente-bg-start",
    visual.fundo_inicio || "#F3EFFF"
  );

  document.documentElement.style.setProperty(
    "--cliente-bg-end",
    visual.fundo_fim || "#E6DBFF"
  );

  console.log("🎨 Visual do cliente aplicado com sucesso");
}

// ==============================
// 🔥 ÚNICA FONTE: FIREBASE
// ==============================
document.addEventListener("clinicaCarregada", (e) => {
  aplicarVisualCliente(e.detail);
});
