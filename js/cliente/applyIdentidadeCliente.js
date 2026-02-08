// =======================================
// APPLY IDENTIDADE DO CLIENTE (OFICIAL)
// =======================================

console.log("🧾 applyIdentidadeCliente.js carregado");

// ----------------------
// Normaliza Instagram
// ----------------------
function normalizarInstagram(valor) {
  if (!valor) return null;

  let v = valor.trim();

  if (v.startsWith("@")) v = v.slice(1);

  if (/^https?:\/\//i.test(v)) return v;

  if (v.includes("instagram.com")) return "https://" + v;

  return "https://www.instagram.com/" + v;
}

// ----------------------
// Normaliza WhatsApp
// Aceita: 992841312 | 11992841312 | 5511992841312
// ----------------------
function normalizarWhatsApp(numero, mensagem = "") {
  if (!numero) return null;

  // remove tudo que não for número
  let n = numero.replace(/\D/g, "");

  // se não tiver país, adiciona 55
  if (!n.startsWith("55")) {
    n = "55" + n;
  }

  // se tiver só 55 + número (sem DDD), assume 11
  if (n.length === 10) {
    n = "5511" + n.slice(2);
  }

  const texto = mensagem
    ? "?text=" + encodeURIComponent(mensagem)
    : "";

  return `https://wa.me/${n}${texto}`;
}

function aplicarIdentidadeCliente(config) {
  if (!config || !config.identidade) return;

  const id = config.identidade;
  const contato = config.contato || {};

  const nomeEl     = document.getElementById("nomeClinicaCliente");
  const sloganEl   = document.getElementById("sloganClinicaCliente");
  const enderecoEl = document.getElementById("enderecoClinicaCliente");
  const telEl      = document.getElementById("telefoneClinicaCliente");
  const logoEl     = document.getElementById("logoClinicaCliente");
  const instaBtn   = document.getElementById("btnInstagram");
  const whatsBtn   = document.getElementById("btnWhatsapp");

  // NOME
  if (nomeEl && id.nome) nomeEl.innerText = id.nome;

  // SLOGAN
  if (sloganEl && id.slogan) sloganEl.innerText = id.slogan;

  // ENDEREÇO
  if (enderecoEl && id.endereco_resumido) {
    enderecoEl.querySelector("span").innerText = id.endereco_resumido;
    enderecoEl.classList.remove("hidden");
  }

  // TELEFONE VISÍVEL
  if (telEl && contato.telefone_visivel) {
    telEl.querySelector("span").innerText = contato.telefone_visivel;
    telEl.classList.remove("hidden");
  }

  // LOGO
  if (logoEl && id.logo_url) {
    logoEl.src = id.logo_url;
    logoEl.classList.remove("hidden");
  }

  // INSTAGRAM
  if (instaBtn && id.instagram) {
    const url = normalizarInstagram(id.instagram);
    if (url) {
      instaBtn.href = url;
      instaBtn.target = "_blank";
      instaBtn.rel = "noopener noreferrer";
      instaBtn.classList.remove("hidden");
    }
  }

  // WHATSAPP (🔥 COMPLETO AGORA)
  if (whatsBtn && contato.whatsapp) {
    const url = normalizarWhatsApp(
      contato.whatsapp,
      contato.mensagem_padrao
    );

    if (url) {
      whatsBtn.href = url;
      whatsBtn.target = "_blank";
      whatsBtn.rel = "noopener noreferrer";
      whatsBtn.classList.remove("hidden");
    }
  }

  console.log("✅ Identidade aplicada no cliente");
}

// FIREBASE
document.addEventListener("clinicaCarregada", (e) => {
  aplicarIdentidadeCliente(e.detail);
});

// FALLBACK
document.addEventListener("DOMContentLoaded", () => {
  if (!window.ConfigClinica) return;
  aplicarIdentidadeCliente(ConfigClinica.obter());
});
