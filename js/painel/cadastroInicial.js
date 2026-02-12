// js/painel/cadastroInicial.js
import { salvarClinica } from "../data.js";

function gerarClinicaId(nome) {
  const base = (nome || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base || "clinica"}-${Math.random().toString(36).slice(2, 7)}`;
}

function limparTelefone(v = "") {
  return v.replace(/\D/g, "");
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.__SEM_CLINICA__ !== true) return;

  const inputNome = document.getElementById("cadNomeClinica");
  const inputWhatsapp = document.getElementById("cadWhatsapp");
  const btnCriar = document.getElementById("btnCriarClinica");

  if (!inputNome || !inputWhatsapp || !btnCriar) return;

  btnCriar.addEventListener("click", async () => {
    const nome = inputNome.value.trim();
    const whatsapp = limparTelefone(inputWhatsapp.value);

    if (!nome) {
      alert("Informe o nome da clinica.");
      return;
    }

    if (whatsapp.length < 10) {
      alert("Informe um WhatsApp valido com DDD.");
      return;
    }

    btnCriar.disabled = true;

    try {
      const clinicaId = gerarClinicaId(nome);
      const atual = ConfigClinica.obter();

      const config = {
        ...atual,
        clinica_id: clinicaId,
        identidade: {
          ...(atual.identidade || {}),
          nome
        },
        contato: {
          ...(atual.contato || {}),
          whatsapp,
          telefone_visivel: whatsapp
        },
        funcionamento: {
          dias_ativos: [1, 2, 3, 4, 5],
          hora_inicio: "09:00",
          hora_fim: "18:00",
          intervalo_minimo: 30,
          ...(atual.funcionamento || {})
        },
        servicos: Array.isArray(atual.servicos) ? atual.servicos : [],
        visual_cliente: {
          cor_primaria: "#6C4AB6",
          fundo_inicio: "#F3EFFF",
          fundo_fim: "#E6DBFF",
          ...(atual.visual_cliente || {})
        },
        visual_painel: {
          cor_primaria: "#6C4AB6",
          fundo_inicio: "#F3EFFF",
          fundo_fim: "#E6DBFF",
          ...(atual.visual_painel || {})
        }
      };

      ConfigClinica.salvar(config);
      await salvarClinica(clinicaId, config);

      window.__SEM_CLINICA__ = false;
      window.location.reload();
    } catch (err) {
      console.error("Erro ao criar clinica:", err);
      alert("Nao foi possivel criar a clinica.");
    } finally {
      btnCriar.disabled = false;
    }
  });
});
