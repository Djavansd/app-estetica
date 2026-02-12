// js/painel/linksSalao.js
document.addEventListener("DOMContentLoaded", () => {
  if (window.__SEM_CLINICA__ === true) return;

  const inputLinkCliente = document.getElementById("linkClienteSalao");
  const btnCopiarCliente = document.getElementById("copiarLinkCliente");
  const inputTelefone = document.getElementById("telefoneCliente");
  const btnEnviar = document.getElementById("btnEnviarWhatsapp");

  if (!inputLinkCliente || !btnCopiarCliente || !inputTelefone || !btnEnviar) {
    return;
  }

  const config = ConfigClinica.obter();
  if (!config?.clinica_id) {
    alert("Clinica nao configurada.");
    return;
  }

  const basePath = window.location.pathname.replace(/[^/]*$/, "");
  const linkCliente = `${window.location.origin}${basePath}index.html?c=${config.clinica_id}`;
  inputLinkCliente.value = linkCliente;

  btnCopiarCliente.onclick = async () => {
    try {
      await navigator.clipboard.writeText(linkCliente);
      btnCopiarCliente.innerText = "Copiado";
      setTimeout(() => {
        btnCopiarCliente.innerText = "Copiar";
      }, 1500);
    } catch {
      alert("Nao foi possivel copiar o link.");
    }
  };

  function limparTelefone(valor = "") {
    return valor.replace(/\D/g, "");
  }

  btnEnviar.onclick = () => {
    const telefone = limparTelefone(inputTelefone.value);
    if (telefone.length < 10) {
      alert("Digite um telefone valido com DDD.");
      return;
    }

    const nomeClinica = config.identidade?.nome || "nossa clinica";
    const mensagem = `Ola. Aqui esta o link para agendar no ${nomeClinica}: ${linkCliente}`;
    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };
});
