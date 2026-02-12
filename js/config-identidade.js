document.addEventListener("DOMContentLoaded", () => {
  if (!window.ConfigClinica || !ConfigClinica.obter) {
    console.error("ConfigClinica nao disponivel");
    return;
  }

  const btnSalvar = document.getElementById("btnSalvar");
  const nomeClinica = document.getElementById("nomeClinica");

  if (!btnSalvar || !nomeClinica) {
    console.error("Elementos obrigatorios nao encontrados");
    return;
  }

  function gerarClinicaId(nome) {
    return (nome || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }

  function limparTelefone(v = "") {
    return v.replace(/\D/g, "");
  }

  function preencherFormulario() {
    const cfg = ConfigClinica.obter();
    const identidade = cfg.identidade || {};
    const contato = cfg.contato || {};

    nomeClinica.value = identidade.nome || "";
    const slogan = document.getElementById("sloganClinica");
    const endereco = document.getElementById("enderecoClinica");
    const instagram = document.getElementById("instagramClinica");
    const logo = document.getElementById("logoClinica");
    const tel = document.getElementById("telefoneVisivel");
    const whats = document.getElementById("whatsappClinica");
    const msg = document.getElementById("mensagemWhatsapp");

    if (slogan) slogan.value = identidade.slogan || "";
    if (endereco) endereco.value = identidade.endereco_resumido || "";
    if (instagram) instagram.value = identidade.instagram || "";
    if (logo) logo.value = identidade.logo_url || "";
    if (tel) tel.value = contato.telefone_visivel || "";
    if (whats) whats.value = contato.whatsapp || "";
    if (msg) msg.value = contato.mensagem_padrao || "";
  }

  btnSalvar.addEventListener("click", () => {
    const nome = nomeClinica.value.trim();
    if (!nome) {
      alert("Informe o nome da clinica");
      return;
    }

    const cfg = ConfigClinica.obter();
    cfg.identidade = cfg.identidade || {};
    cfg.contato = cfg.contato || {};

    if (!cfg.clinica_id) {
      cfg.clinica_id = gerarClinicaId(nome);
    }

    cfg.identidade.nome = nome;
    cfg.identidade.slogan = document.getElementById("sloganClinica")?.value.trim() || "";
    cfg.identidade.endereco_resumido = document.getElementById("enderecoClinica")?.value.trim() || "";
    cfg.identidade.instagram = document.getElementById("instagramClinica")?.value.trim() || "";
    cfg.identidade.logo_url = document.getElementById("logoClinica")?.value.trim() || null;

    cfg.contato.telefone_visivel = limparTelefone(
      document.getElementById("telefoneVisivel")?.value || ""
    );
    cfg.contato.whatsapp = limparTelefone(
      document.getElementById("whatsappClinica")?.value || ""
    );
    cfg.contato.mensagem_padrao =
      document.getElementById("mensagemWhatsapp")?.value.trim() || "";

    ConfigClinica.salvar(cfg);
    alert("Clinica salva com sucesso!");
  });

  preencherFormulario();
});
