// js/painel/agenda.js

import {
  escutarAgendamentos,
  cancelarAgendamento
} from "../data.js";

document.addEventListener("DOMContentLoaded", () => {
if (window.__SEM_CLINICA__ === true) {
  console.warn("Painel bloqueado: clínica não criada ainda");
  return;
}

  // ======================
  // CLÍNICA ID VIA URL (?c=)
  // ======================
  const config = ConfigClinica.obter();
const CLINICA_ID = config.clinica_id;

if (!CLINICA_ID) {
  alert("Clínica não configurada corretamente.");
  return;
}


  // ======================
  // ELEMENTOS
  // ======================
  const lista = document.getElementById("listaAgendamentos");
  const dataFiltro = document.getElementById("dataFiltro");
  const btnLimpar = document.getElementById("btnLimpar");

  if (!lista || !dataFiltro) {
    console.error("Elementos da agenda não encontrados no DOM");
    return;
  }

  // ======================
  // ESTADO (CRU, SEM FILTRO)
  // ======================
  let AGENDAMENTOS = [];

  // ======================
  // UTILIDADES
  // ======================
  function formatarDataBR(dataISO) {
    const [a, m, d] = dataISO.split("-");
    return `${d}/${m}/${a}`;
  }

  function limparTelefone(v = "") {
    return v.replace(/\D/g, "");
  }

  function formatarTelefoneBR(v = "") {
    const n = limparTelefone(v);
    if (n.length !== 11) return v;
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
  }

  function telefoneWhats(v = "") {
    return "55" + limparTelefone(v);
  }

  // ======================
  // RENDERIZAÇÃO (SOBERANA)
  // ======================
  function renderizar() {
    lista.innerHTML = "";

    const dataSelecionada = dataFiltro.value || null;

    let ags = AGENDAMENTOS.filter(a => a.cancelado !== true);

    if (dataSelecionada) {
      ags = ags.filter(a => a.data === dataSelecionada);
    }

    if (!ags.length) {
      lista.innerHTML = `
        <div class="card">
          <p>Nenhum agendamento.</p>
        </div>
      `;
      return;
    }

    ags
      .sort((a, b) => {
        if (a.data !== b.data) return a.data.localeCompare(b.data);
        return a.horario.localeCompare(b.horario);
      })
      .forEach(a => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <strong>${a.servico}</strong><br>
          👤 ${a.clienteNome}<br>
          📞 ${formatarTelefoneBR(a.clienteTelefone)}<br>
          📅 ${formatarDataBR(a.data)}<br>
          ⏰ ${a.horario}<br><br>

          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="button btn-whats">
              WhatsApp
            </button>

            <button class="button btn-cancelar" style="background:#999">
              Cancelar agendamento
            </button>
          </div>
        `;

        // WhatsApp
        card.querySelector(".btn-whats").onclick = () => {
          const msg = `
Olá ${a.clienteNome} 😊
Seu agendamento de ${a.servico} está confirmado para
${formatarDataBR(a.data)} às ${a.horario}.

Qualquer dúvida, estou à disposição 💜
          `.trim();

          window.open(
            `https://wa.me/${telefoneWhats(a.clienteTelefone)}?text=${encodeURIComponent(msg)}`,
            "_blank"
          );
        };

        // Cancelamento REAL (Firestore)
        card.querySelector(".btn-cancelar").onclick = async () => {
          if (!confirm("Cancelar este agendamento?")) return;

          try {
            await cancelarAgendamento(CLINICA_ID, a.id);
          } catch (err) {
            console.error("Erro ao cancelar:", err);
            alert("Erro ao cancelar agendamento");
          }
        };

        lista.appendChild(card);
      });
  }

  // ======================
  // ESCUTA EM TEMPO REAL (MANDATÓRIA)
  // ======================
  escutarAgendamentos(CLINICA_ID, (listaFirestore) => {
    AGENDAMENTOS = listaFirestore; // SEM FILTRO
    renderizar();                 // SEM CONDIÇÃO
  });

  // ======================
  // EVENTOS
  // ======================
  dataFiltro.addEventListener("change", renderizar);

  if (btnLimpar) {
    btnLimpar.onclick = () => {
      alert(
        "⚠️ Limpeza desativada.\n\n" +
        "Agendamentos vêm do Firestore e não podem ser apagados localmente."
      );
    };
  }

  // Exposição segura para menu / abas
  window.__renderizarAgenda = renderizar;

});
