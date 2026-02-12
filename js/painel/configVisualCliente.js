// js/painel/configVisualCliente.js
document.addEventListener("DOMContentLoaded", () => {
  if (!window.ConfigClinica) return;

  const corPrimaria = document.getElementById("corPrimariaCliente");
  const fundoInicio = document.getElementById("fundoInicioCliente");
  const fundoFim = document.getElementById("fundoFimCliente");
  const btnSalvar = document.getElementById("btnSalvarVisualCliente");

  if (!corPrimaria || !fundoInicio || !fundoFim || !btnSalvar) return;

  const cfg = ConfigClinica.obter();

  corPrimaria.value = cfg.visual_cliente?.cor_primaria || "#6C4AB6";
  fundoInicio.value = cfg.visual_cliente?.fundo_inicio || "#F3EFFF";
  fundoFim.value = cfg.visual_cliente?.fundo_fim || "#E6DBFF";

  btnSalvar.onclick = () => {
    const atual = ConfigClinica.obter();
    if (!atual?.clinica_id) {
      alert("Crie a clinica primeiro no painel.");
      return;
    }

    atual.visual_cliente = {
      cor_primaria: corPrimaria.value,
      fundo_inicio: fundoInicio.value,
      fundo_fim: fundoFim.value
    };

    ConfigClinica.salvar(atual);
    alert("Visual do cliente salvo com sucesso!");
  };
});
