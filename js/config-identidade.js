document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ config-identidade carregado");

  if (!window.ConfigClinica || !ConfigClinica.obter) {
    console.error("❌ ConfigClinica não disponível");
    return;
  }

  const btnSalvar = document.getElementById("btnSalvar");
  const nomeClinica = document.getElementById("nomeClinica");

  if (!btnSalvar || !nomeClinica) {
    console.error("❌ Elementos obrigatórios não encontrados");
    return;
  }

  function gerarClinicaId(nome) {
    return nome
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }

  function limparTelefone(v = "") {
    return v.replace(/\D/g, "");
  }

  btnSalvar.addEventListener("click", () => {
    const nome = nomeClinica.value.trim();

    console.log("🧪 Clique em salvar. Nome:", nome);

    if (!nome) {
      alert("Informe o nome da clínica");
      return;
    }

    // 🔑 SEMPRE reobter o config
    const cfg = ConfigClinica.obter();

    // 🔒 garantir estrutura
    cfg.identidade = cfg.identidade || {};
    cfg.contato = cfg.contato || {};

    // 🔑 FIXAÇÃO DEFINITIVA DO ID
    if (!cfg.clinica_id) {
      cfg.clinica_id = gerarClinicaId(nome);
      console.log("🏥 clinica_id criado:", cfg.clinica_id);
    }

    // IDENTIDADE
    cfg.identidade.nome = nome;
    cfg.identidade.slogan =
      document.getElementById("sloganClinica")?.value.trim() || "";
    cfg.identidade.endereco_resumido =
      document.getElementById("enderecoClinica")?.value.trim() || "";
    cfg.identidade.instagram =
      document.getElementById("instagramClinica")?.value.trim() || "";
    cfg.identidade.logo_url =
      document.getElementById("logoClinica")?.value.trim() || null;

    // CONTATO
    cfg.contato.telefone_visivel = limparTelefone(
      document.getElementById("telefoneVisivel")?.value
    );
    cfg.contato.whatsapp = limparTelefone(
      document.getElementById("whatsappClinica")?.value
    );
    cfg.contato.mensagem_padrao =
      document.getElementById("mensagemWhatsapp")?.value.trim() || "";

    // 💾 SALVAR ESTADO COMPLETO
    ConfigClinica.salvar(cfg);

    console.log("✅ Config salvo:", cfg);
    alert("Clínica salva com sucesso!");
  });
});
