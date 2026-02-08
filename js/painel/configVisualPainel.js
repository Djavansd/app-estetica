document.addEventListener("DOMContentLoaded", () => {
  if (!window.ConfigClinica) return;

  const corPrimaria = document.getElementById("corPrimariaPainel");
  const fundoInicio = document.getElementById("fundoInicioPainel");
  const fundoFim = document.getElementById("fundoFimPainel");
  const btnSalvar = document.getElementById("btnSalvarVisualPainel");

  if (!corPrimaria || !fundoInicio || !fundoFim || !btnSalvar) return;

  function carregar() {
    const config = ConfigClinica.obter();
    config.visual_painel = config.visual_painel || {};

    corPrimaria.value = config.visual_painel.cor_primaria || "#6C4AB6";
    fundoInicio.value = config.visual_painel.fundo_inicio || "#F3EFFF";
    fundoFim.value = config.visual_painel.fundo_fim || "#E6DBFF";
  }

  btnSalvar.onclick = () => {
    const configAtual = ConfigClinica.obter();

    configAtual.visual_painel = {
      cor_primaria: corPrimaria.value,
      fundo_inicio: fundoInicio.value,
      fundo_fim: fundoFim.value
    };

    ConfigClinica.salvar(configAtual);

    document.documentElement.style.setProperty("--primary", corPrimaria.value);
    document.documentElement.style.setProperty("--bg-start", fundoInicio.value);
    document.documentElement.style.setProperty("--bg-end", fundoFim.value);

    alert("Visual do painel salvo com sucesso!");
  };

  carregar();
});
