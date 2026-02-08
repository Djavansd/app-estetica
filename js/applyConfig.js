// js/applyConfig.js

// =========================
// UTILITÁRIOS
// =========================
function limparTelefone(valor = "") {
  return valor.replace(/\D/g, "");
}

function formatarTelefoneBR(valor = "") {
  const numeros = limparTelefone(valor);
  if (numeros.length !== 11) return valor;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function telefoneWhatsApp(valor = "") {
  let numero = limparTelefone(valor);
  if (!numero) return null;

  // garante 55 no início
  if (!numero.startsWith("55")) {
    numero = "55" + numero;
  }

  return numero;
}

// =========================
// APLICA CONFIGURAÇÃO NO CLIENTE
// =========================
function aplicarConfiguracoesCliente(config) {
  if (!config) return;

  console.log("🎨 Aplicando identidade da clínica", config.identidade);

  /* ===== TEXTO ===== */
  const titulo = document.getElementById("nomeClinicaCliente");
  const slogan = document.getElementById("sloganClinicaCliente");

  if (titulo) titulo.innerText = config.identidade?.nome || "";
  if (slogan) slogan.innerText = config.identidade?.slogan || "";

  /* ===== LOGO ===== */
  const logoImg = document.getElementById("logoClinicaCliente");

  if (
    logoImg &&
    config.features?.exibir_logo === true &&
    config.identidade?.logo_url
  ) {
    const cacheBuster = `?v=${Date.now()}`;
    logoImg.src = config.identidade.logo_url + cacheBuster;
    logoImg.classList.remove("hidden");
  } else if (logoImg) {
    logoImg.src = "";
    logoImg.classList.add("hidden");
  }

  /* ===== ENDEREÇO ===== */
  const enderecoDiv = document.getElementById("enderecoClinicaCliente");
  if (enderecoDiv && config.identidade?.endereco_resumido) {
    enderecoDiv.querySelector("span").innerText =
      config.identidade.endereco_resumido;
    enderecoDiv.classList.remove("hidden");
  } else if (enderecoDiv) {
    enderecoDiv.classList.add("hidden");
  }

  /* ===== TELEFONE VISÍVEL ===== */
  const telefoneDiv = document.getElementById("telefoneClinicaCliente");
  if (telefoneDiv && config.contato?.telefone_visivel) {
    telefoneDiv.querySelector("span").innerText =
      formatarTelefoneBR(config.contato.telefone_visivel);
    telefoneDiv.classList.remove("hidden");
  } else if (telefoneDiv) {
    telefoneDiv.classList.add("hidden");
  }

  /* ===== WHATSAPP (COM MENSAGEM OPCIONAL) ===== */
  const btnWhatsapp = document.getElementById("btnWhatsapp");
  if (btnWhatsapp && config.contato?.whatsapp) {
    const numero = telefoneWhatsApp(config.contato.whatsapp);

    if (numero) {
      let url = `https://wa.me/${numero}`;

      if (
        config.contato.mensagem_padrao &&
        config.contato.mensagem_padrao.trim()
      ) {
        url += `?text=${encodeURIComponent(
          config.contato.mensagem_padrao
        )}`;
      }

      btnWhatsapp.href = url;
      btnWhatsapp.target = "_blank";
      btnWhatsapp.classList.remove("hidden");
    } else {
      btnWhatsapp.classList.add("hidden");
      btnWhatsapp.removeAttribute("href");
    }
  } else if (btnWhatsapp) {
    btnWhatsapp.classList.add("hidden");
    btnWhatsapp.removeAttribute("href");
  }

  /* ===== INSTAGRAM ===== */
  const btnInstagram = document.getElementById("btnInstagram");
  if (btnInstagram) {
    const instagramRaw = config.identidade?.instagram;

    if (instagramRaw && instagramRaw.trim() !== "") {
      let link = instagramRaw.trim();
      if (!link.startsWith("http")) {
        link = "https://instagram.com/" + link.replace("@", "");
      }
      btnInstagram.href = link;
      btnInstagram.classList.remove("hidden");
    } else {
      btnInstagram.classList.add("hidden");
      btnInstagram.removeAttribute("href");
    }
  }
}

// =========================
// EVENTO FIREBASE → CLIENTE
// =========================
document.addEventListener("clinicaCarregada", (e) => {
  aplicarConfiguracoesCliente(e.detail);
});
