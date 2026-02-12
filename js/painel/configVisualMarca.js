// js/painel/configVisualMarca.js
document.addEventListener("DOMContentLoaded", () => {
  if (!window.ConfigClinica) return;

  const corPrimaria = document.getElementById("corPrimaria");
  const corFundoInicio = document.getElementById("corFundoInicio");
  const corFundoFim = document.getElementById("corFundoFim");
  const btnSalvar = document.getElementById("btnSalvarVisual");

  if (!corPrimaria || !corFundoInicio || !corFundoFim || !btnSalvar) return;

  const config = ConfigClinica.obter();
  const visual = config.visual_cliente || {};

  corPrimaria.value = visual.cor_primaria || "#6C4AB6";
  corFundoInicio.value = visual.fundo_inicio || "#F3EFFF";
  corFundoFim.value = visual.fundo_fim || "#E6DBFF";

  btnSalvar.addEventListener("click", () => {
    const atual = ConfigClinica.obter();
    atual.visual_cliente = {
      cor_primaria: corPrimaria.value,
      fundo_inicio: corFundoInicio.value,
      fundo_fim: corFundoFim.value
    };
    ConfigClinica.salvar(atual);
    alert("Identidade visual salva com sucesso!");
  });
});
