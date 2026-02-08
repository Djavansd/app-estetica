document.addEventListener("DOMContentLoaded", () => {

  if (!window.ConfigClinica) return;

  const inputLogo = document.getElementById("logoClinica");
  const logoPreview = document.getElementById("logoPreview");
  const logoImg = document.getElementById("logoImg");
  const btnRemoverLogo = document.getElementById("btnRemoverLogo");

  const corPrimaria = document.getElementById("corPrimaria");
  const corFundoInicio = document.getElementById("corFundoInicio");
  const corFundoFim = document.getElementById("corFundoFim");

  const btnSalvar = document.getElementById("btnSalvarVisual");

  let logoBase64 = null;

  function carregar() {
    const config = ConfigClinica.obter();
    const identidade = config.identidade || {};

    corPrimaria.value = identidade.cor_primaria || "#6C4AB6";
    corFundoInicio.value = identidade.cor_fundo_inicio || "#F3EFFF";
    corFundoFim.value = identidade.cor_fundo_fim || "#E6DBFF";

    if (identidade.logo) {
      logoBase64 = identidade.logo;
      logoImg.src = identidade.logo;
      logoPreview.classList.remove("hidden");
    }
  }

  inputLogo.addEventListener("change", () => {
    const file = inputLogo.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      logoBase64 = reader.result;
      logoImg.src = logoBase64;
      logoPreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

  btnRemoverLogo.onclick = () => {
    logoBase64 = null;
    logoImg.src = "";
    logoPreview.classList.add("hidden");
    inputLogo.value = "";
  };

  btnSalvar.onclick = () => {
    const config = ConfigClinica.obter();

    config.identidade.logo = logoBase64;
    config.identidade.cor_primaria = corPrimaria.value;
    config.identidade.cor_fundo_inicio = corFundoInicio.value;
    config.identidade.cor_fundo_fim = corFundoFim.value;

    ConfigClinica.salvar(config);

    // ⚠️ NÃO aplicar cores globais aqui
    // O painel do cliente usa variáveis próprias (--cliente-*)

    alert("Identidade atualizada com sucesso!");
  };

  carregar();
});
