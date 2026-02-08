document.addEventListener("DOMContentLoaded", () => {
  if (!window.ConfigClinica) return;
if (window.__SEM_CLINICA__ === true) {
  console.warn("Painel bloqueado: clínica não criada ainda");
  return;
}

  const corPrimaria = document.getElementById("corPrimaria");
  const corFundoInicio = document.getElementById("corFundoInicio");
  const corFundoFim = document.getElementById("corFundoFim");
  const btnSalvar = document.getElementById("btnSalvarVisual");

  function carregar() {
    const config = ConfigClinica.obter();

    // 🔒 GARANTE IDENTIDADE
    if (!config.identidade) {
      config.identidade = {};
    }

    const identidade = config.identidade;

    corPrimaria.value = identidade.cor_primaria || "#6C4AB6";
    corFundoInicio.value = identidade.cor_secundaria || "#F3EFFF";
    corFundoFim.value = identidade.cor_fundo_fim || "#E6DBFF";
  }

  btnSalvar.addEventListener("click", () => {
    const config = ConfigClinica.obter();

    // 🔒 GARANTE IDENTIDADE ANTES DE USAR
    if (!config.identidade) {
      config.identidade = {};
    }

    config.identidade.cor_primaria = corPrimaria.value;
    config.identidade.cor_secundaria = corFundoInicio.value;
    config.identidade.cor_fundo_fim = corFundoFim.value;

    ConfigClinica.salvar(config);

    document.documentElement.style.setProperty("--primary", corPrimaria.value);
    document.documentElement.style.setProperty("--bg-start", corFundoInicio.value);
    document.documentElement.style.setProperty("--bg-end", corFundoFim.value);

    alert("Visual atualizado com sucesso!");
  });

  carregar();
});
