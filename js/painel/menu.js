// ======================
// MENU DO PAINEL
// ======================
document.addEventListener("DOMContentLoaded", () => {

  const areaServicos = document.getElementById("areaServicos");
  const areaAgenda = document.getElementById("areaAgenda");
  const areaConfig = document.getElementById("areaConfiguracoes");

  const btnServicos = document.getElementById("btnServicos");
  const btnAgenda   = document.getElementById("btnAgenda");
  const btnConfig   = document.getElementById("btnConfig");
  const titulo      = document.getElementById("tituloPainel");

  function mostrar(area, tituloTexto) {
    areaServicos.style.display = "none";
    areaAgenda.style.display   = "none";
    areaConfig.style.display   = "none";

    area.style.display = "block";
    if (titulo) titulo.innerText = tituloTexto;
  }

  if (btnServicos) btnServicos.onclick = () => mostrar(areaServicos, "Serviços");
  if (btnAgenda)   btnAgenda.onclick   = () => mostrar(areaAgenda, "Agenda");
  if (btnConfig)   btnConfig.onclick   = () => mostrar(areaConfig, "Ajustes");

  // estado inicial
  mostrar(areaServicos, "Serviços");
});


// ======================
// LINKS DE CONFIGURAÇÃO (SEM ?c=)
// ======================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".config-item").forEach(item => {
    item.addEventListener("click", () => {
      const destino = item.dataset.destino;
      if (!destino) return;

      // Painel NÃO usa contexto por URL
      window.location.href = destino;
    });
  });
});
