// js/cliente/agendamento.js

import { criarAgendamento, escutarAgendamentos } from "../data.js";

console.log("📅 agendamento.js carregado");

// =========================
// UTILITÁRIOS
// =========================
function duracaoHumana(min) {
  if (!min) return "";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

function limparTelefone(v = "") {
  return v.replace(/\D/g, "");
}

function diaSemanaISO(dataStr) {
  const d = new Date(dataStr + "T00:00");
  const js = d.getDay();
  return js === 0 ? 7 : js;
}

function nomeDia(d) {
  const mapa = {
    1: "Segunda",
    2: "Terça",
    3: "Quarta",
    4: "Quinta",
    5: "Sexta",
    6: "Sábado",
    7: "Domingo"
  };
  return mapa[d];
}
function formatarDataBR(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// =========================
// CLÍNICA ID
// =========================
let CLINICA_ID = null;

if (window.__CLINICA_ATUAL__?.clinica_id) {
  CLINICA_ID = window.__CLINICA_ATUAL__.clinica_id;
}

if (!CLINICA_ID) {
  const params = new URLSearchParams(window.location.search);
  CLINICA_ID = params.get("c");
}

// =========================
// ESTADO
// =========================
let CONFIG_ATUAL = null;
let AGENDAMENTOS_ATUAIS = [];

let servicoSelecionado = null;
let dataSelecionada = null;
let horarioSelecionado = null;

let JA_INICIALIZADO = false;
let ENVIANDO = false;

// =========================
// AVISO DE FUNCIONAMENTO
// =========================
function montarTextoFuncionamento(config) {
  const box = document.getElementById("horarioFuncionamentoCliente");
  const texto = document.getElementById("textoHorarioFuncionamento");
  if (!box || !texto || !config?.funcionamento) return;

  const { dias_ativos, hora_inicio, hora_fim } = config.funcionamento;

  if (!dias_ativos || !dias_ativos.length) {
    box.style.display = "none";
    return;
  }

  const dias = [...dias_ativos].sort();
  const nomes = dias.map(nomeDia);

  let linhaDias;
  if (nomes.length === 7) {
    linhaDias = "Todos os dias";
  } else if (nomes.length === 1) {
    linhaDias = nomes[0];
  } else {
    linhaDias = `${nomes[0]} a ${nomes[nomes.length - 1]}`;
  }

  texto.innerHTML = `
    ${linhaDias}<br>
    ${hora_inicio} às ${hora_fim}
  `;
}

// =========================
// EVENTOS DA CLÍNICA
// =========================
document.addEventListener("clinicaCarregada", (e) => {
  CONFIG_ATUAL = e.detail;

  if (!CLINICA_ID && CONFIG_ATUAL?.clinica_id) {
    CLINICA_ID = CONFIG_ATUAL.clinica_id;
  }

  montarTextoFuncionamento(CONFIG_ATUAL);
  tentarInicializar();
});

document.addEventListener("clinicaAtualizada", (e) => {
  CONFIG_ATUAL = e.detail;

  montarTextoFuncionamento(CONFIG_ATUAL);

  const telaServicos = document.getElementById("telaServicos");
  if (telaServicos && telaServicos.style.display === "block") {
    montarServicos();
  }
});

window.addEventListener("load", () => {
  if (window.__CLINICA_ATUAL__) {
    CONFIG_ATUAL = window.__CLINICA_ATUAL__;
    if (!CLINICA_ID) CLINICA_ID = CONFIG_ATUAL.clinica_id;

    montarTextoFuncionamento(CONFIG_ATUAL);
    tentarInicializar();
  }
});

// =========================
// INIT SEGURO
// =========================
function tentarInicializar() {
  if (!CONFIG_ATUAL || !CLINICA_ID || JA_INICIALIZADO) return;

  console.log("📅 Inicializando agendamento:", CLINICA_ID);

  escutarAgendamentos(CLINICA_ID, (lista = []) => {
    AGENDAMENTOS_ATUAIS = Array.isArray(lista) ? lista : [];
  });

  inicializarAgendamento();
  JA_INICIALIZADO = true;
}

// =========================
// FLUXO PRINCIPAL
// =========================
function inicializarAgendamento() {
  const telaInicio   = document.getElementById("telaInicio");
  const telaServicos = document.getElementById("telaServicos");
  const telaData     = document.getElementById("telaData");
  const telaHorarios = document.getElementById("telaHorarios");
  const telaCliente  = document.getElementById("telaCliente");
  const btnVoltarData = document.getElementById("btnVoltarData");

  

  const btnAgendar       = document.getElementById("btnAgendar");
  const btnContinuarData = document.getElementById("btnContinuarData");
  const btnConfirmar     = document.getElementById("btnConfirmar");

  const inputData     = document.getElementById("dataSelecionada");
  const listaHorarios = document.getElementById("listaHorarios");

  const inputNome     = document.getElementById("clienteNome");
  const inputTelefone = document.getElementById("clienteTelefone");

  if (btnVoltarData) {
  btnVoltarData.onclick = () => {
    telaHorarios.style.display = "none";
    telaData.style.display = "block";
  };
}


  

  // DATA MÍNIMA
  const hoje = new Date();
  hoje.setHours(0,0,0,0);
  if (inputData) inputData.min = hoje.toISOString().split("T")[0];

  // =========================
  // AGENDAR
  // =========================
  if (btnAgendar) {
    btnAgendar.onclick = () => {
      telaInicio.style.display = "none";
      telaServicos.style.display = "block";
      montarServicos();
    };
  }

  // =========================
  // CONTINUAR DATA
  // =========================
  if (btnContinuarData && inputData) {
    btnContinuarData.onclick = () => {
      if (!inputData.value) {
        alert("Selecione uma data");
        return;
      }

      dataSelecionada = inputData.value;

      telaData.style.display = "none";
      telaHorarios.style.display = "block";

      gerarHorarios();
    };
  }

  // =========================
  // SERVIÇOS
  // =========================
  function montarServicos() {
    const container = document.getElementById("listaServicosCliente");
    if (!container) return;

    container.innerHTML = "";

    (CONFIG_ATUAL.servicos || [])
      .filter(s => s.ativo)
      .forEach(servico => {
        const div = document.createElement("div");
        div.className = "servico";
        div.innerHTML = `
          <strong>${servico.nome}</strong>
          <p>⏱ ${duracaoHumana(servico.duracao)}</p>
        `;

        div.onclick = () => {
          document.querySelectorAll(".servico")
            .forEach(el => el.classList.remove("selecionado"));

          div.classList.add("selecionado");
          servicoSelecionado = servico;

          setTimeout(() => {
            telaServicos.style.display = "none";
            telaData.style.display = "block";
          }, 150);
        };

        container.appendChild(div);
      });
  }

  // =========================
  // HORÁRIOS
  // =========================
  function gerarHorarios() {
    listaHorarios.innerHTML = "";

    if (!servicoSelecionado) {
      listaHorarios.innerHTML = "<p>Selecione um serviço</p>";
      return;
    }

    const funcionamento = CONFIG_ATUAL.funcionamento || {};
    const diasAtivos = funcionamento.dias_ativos || [1,2,3,4,5];
    const diaEscolhido = diaSemanaISO(dataSelecionada);

    if (!diasAtivos.includes(diaEscolhido)) {
      listaHorarios.innerHTML = "<p>⚠️ A clínica não atende neste dia.</p>";
      return;
    }

    let intervalo = Number(funcionamento.intervalo_minimo);
    if (!intervalo || intervalo < 5) intervalo = 30;

    const ocupados = AGENDAMENTOS_ATUAIS.filter(a =>
      a.data === dataSelecionada && a.cancelado !== true
    );

    const [hIni, mIni] = funcionamento.hora_inicio.split(":").map(Number);
    const [hFim, mFim] = funcionamento.hora_fim.split(":").map(Number);

    const inicioDia = hIni * 60 + mIni;
    const fimDia = hFim * 60 + mFim;
    const duracao = servicoSelecionado.duracao;

    for (let t = inicioDia; t + duracao <= fimDia; t += intervalo) {
      const h = String(Math.floor(t / 60)).padStart(2,"0");
      const m = String(t % 60).padStart(2,"0");
      const horario = `${h}:${m}`;

      const conflito = ocupados.some(a => {
        const [ah, am] = a.horario.split(":").map(Number);
        const ini = ah * 60 + am;
        return t < ini + a.duracao && t + duracao > ini;
      });

      if (conflito) continue;

      const btn = document.createElement("div");
      btn.className = "horario";
      btn.innerText = horario;

      btn.onclick = () => {
        horarioSelecionado = horario;
        telaHorarios.style.display = "none";
        telaCliente.style.display = "block";
      };

      listaHorarios.appendChild(btn);
    }

    if (!listaHorarios.children.length) {
      listaHorarios.innerHTML = "<p>Nenhum horário disponível</p>";
    }
  }

  // =========================
  // CONFIRMAR
  // =========================
  if (btnConfirmar) {
    btnConfirmar.onclick = async () => {
      if (ENVIANDO) return;
      ENVIANDO = true;

      await criarAgendamento(CLINICA_ID, {
        clienteNome: inputNome?.value.trim() || "",
        clienteTelefone: limparTelefone(inputTelefone?.value || ""),
        servico: servicoSelecionado?.nome,
        duracao: servicoSelecionado?.duracao,
        data: dataSelecionada,
        horario: horarioSelecionado
      });
      alert(
  `✅ Agendamento confirmado!\n\n` +
  `Serviço: ${servicoSelecionado?.nome}\n` +
  `Data: ${formatarDataBR(dataSelecionada)}\n` +
  `Horário: ${horarioSelecionado}`
);

      telaCliente.style.display = "none";
      telaInicio.style.display = "block";
      ENVIANDO = false;
    };
  }
}
