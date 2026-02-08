document.addEventListener("DOMContentLoaded", () => {

  const diasContainer = document.getElementById("diasSemana");
  const horaInicio = document.getElementById("horaInicio");
  const horaFim = document.getElementById("horaFim");
  const intervaloMin = document.getElementById("intervaloMin");
  const btnSalvar = document.getElementById("btnSalvarHorario");

  if (!btnSalvar) return;

  const dias = [
    { id: 0, nome: "Dom" },
    { id: 1, nome: "Seg" },
    { id: 2, nome: "Ter" },
    { id: 3, nome: "Qua" },
    { id: 4, nome: "Qui" },
    { id: 5, nome: "Sex" },
    { id: 6, nome: "Sáb" }
  ];

  function carregar() {
    const config = ConfigClinica.obter();
    const func = config.funcionamento;

    horaInicio.value = func.hora_inicio;
    horaFim.value = func.hora_fim;
    intervaloMin.value = func.intervalo_minimo || 0;

    diasContainer.innerHTML = "";

    dias.forEach(d => {
      const btn = document.createElement("button");
      btn.innerText = d.nome;
      btn.className = "dia-btn";

      if (func.dias_ativos.includes(d.id)) {
        btn.classList.add("ativo");
      }

      btn.onclick = () => {
        btn.classList.toggle("ativo");
      };

      diasContainer.appendChild(btn);
    });
  }

  btnSalvar.onclick = () => {
    const config = ConfigClinica.obter();

    const diasAtivos = [];
    diasContainer.querySelectorAll(".dia-btn").forEach((btn, index) => {
      if (btn.classList.contains("ativo")) {
        diasAtivos.push(dias[index].id);
      }
    });

    config.funcionamento.hora_inicio = horaInicio.value;
    config.funcionamento.hora_fim = horaFim.value;
    config.funcionamento.intervalo_minimo = Number(intervaloMin.value);
    config.funcionamento.dias_ativos = diasAtivos;

    ConfigClinica.salvar(config);

    alert("Horários atualizados!");
  };

  carregar();
});
