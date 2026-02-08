function gerarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}



document.addEventListener("DOMContentLoaded", () => {
  if (window.__SEM_CLINICA__ === true) {
    console.warn("Painel bloqueado: clínica não criada ainda");
    return;
  }

  // =========================
  // ELEMENTOS
  // =========================
  const lista = document.getElementById("listaServicos");
  const inputNome = document.getElementById("novoNome");
  const inputDuracao = document.getElementById("novaDuracao");
  const btnAdicionar = document.getElementById("btnAdicionar");

  const diasBtns = document.querySelectorAll(".dia-btn");
  const horaInicio = document.getElementById("horaInicio");
  const horaFim = document.getElementById("horaFim");
  const btnSalvarFuncionamento = document.getElementById("btnSalvarFuncionamento");

  // =========================
  // UTIL
  // =========================
  function dispararAtualizacao(config) {
    document.dispatchEvent(
      new CustomEvent("clinicaAtualizada", { detail: config })
    );
  }

  // =========================
  // FUNCIONAMENTO
  // =========================
  function carregarFuncionamento() {
    const config = ConfigClinica.obter();
    const func = config.funcionamento || {};

    const diasAtivos = func.dias_ativos || [];

    diasBtns.forEach(btn => {
      const dia = Number(btn.dataset.dia);
      btn.classList.toggle("ativo", diasAtivos.includes(dia));

      btn.onclick = () => {
        btn.classList.toggle("ativo");
      };
    });

    if (horaInicio) horaInicio.value = func.hora_inicio || "09:00";
    if (horaFim) horaFim.value = func.hora_fim || "18:00";
  }

  if (btnSalvarFuncionamento) {
    btnSalvarFuncionamento.onclick = () => {
      const config = ConfigClinica.obter();

      const diasSelecionados = Array.from(diasBtns)
        .filter(b => b.classList.contains("ativo"))
        .map(b => Number(b.dataset.dia));

      if (!diasSelecionados.length) {
        alert("Selecione pelo menos um dia de funcionamento");
        return;
      }

      config.funcionamento = {
        ...config.funcionamento,
        dias_ativos: diasSelecionados.sort(),
        hora_inicio: horaInicio.value,
        hora_fim: horaFim.value
      };

      ConfigClinica.salvar(config);
      dispararAtualizacao(config);

      alert("Funcionamento salvo com sucesso!");
    };
  }

  // =========================
  // SERVIÇOS
  // =========================
  function carregarServicos() {
    const config = ConfigClinica.obter();
    lista.innerHTML = "";

    (config.servicos || []).forEach((servico, index) => {
      const div = document.createElement("div");
      div.className = "servico-linha";

      div.innerHTML = `
        <div class="servico-info">
          <strong>${servico.nome}</strong>
          <span>${servico.duracao} min</span>
        </div>
        <div class="servico-acoes">
          <span class="status ${servico.ativo ? "ativo" : "inativo"}">●</span>
          <button class="btn-editar">✏️</button>
          <button class="btn-remover">🗑</button>
        </div>
      `;

      // ATIVAR / DESATIVAR
      div.onclick = () => {
        const cfg = ConfigClinica.obter();
        cfg.servicos = cfg.servicos.map((s, i) =>
          i === index ? { ...s, ativo: !s.ativo } : s
        );
        ConfigClinica.salvar(cfg);
        dispararAtualizacao(cfg);
        carregarServicos();
      };

      // EDITAR
      div.querySelector(".btn-editar").onclick = (e) => {
        e.stopPropagation();

        const novoNome = prompt("Nome do serviço:", servico.nome);
        const novaDuracao = prompt("Duração (min):", servico.duracao);
        const duracaoNum = parseInt(novaDuracao);

        if (!novoNome || !duracaoNum) return;

        const cfg = ConfigClinica.obter();
        cfg.servicos = cfg.servicos.map((s, i) =>
          i === index ? { ...s, nome: novoNome, duracao: duracaoNum } : s
        );

        ConfigClinica.salvar(cfg);
        dispararAtualizacao(cfg);
        carregarServicos();
      };

      // REMOVER
      div.querySelector(".btn-remover").onclick = (e) => {
        e.stopPropagation();
        if (!confirm("Remover este serviço?")) return;

        const cfg = ConfigClinica.obter();
        cfg.servicos = cfg.servicos.filter((_, i) => i !== index);

        ConfigClinica.salvar(cfg);
        dispararAtualizacao(cfg);
        carregarServicos();
      };

      lista.appendChild(div);
    });
  }

  // ADICIONAR SERVIÇO
  btnAdicionar.onclick = () => {
    const nome = inputNome.value.trim();
    const duracao = parseInt(inputDuracao.value);

    if (!nome || !duracao) {
      alert("Preencha nome e duração");
      return;
    }

    const cfg = ConfigClinica.obter();
    cfg.servicos = [
      ...(cfg.servicos || []),
      { id: gerarUUID(),
 nome, duracao, ativo: true }
    ];

    ConfigClinica.salvar(cfg);
    dispararAtualizacao(cfg);

    inputNome.value = "";
    inputDuracao.value = "";

    carregarServicos();
  };

  // INIT
  carregarFuncionamento();
  carregarServicos();
});
