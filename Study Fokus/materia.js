document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // TEMA (cor da matéria) + TÍTULO
  // =========================
  const header = document.querySelector(".header");
  const tituloMateria = document.getElementById("tituloMateria");

  const materiaAtual = localStorage.getItem("materiaSelecionada") || "Padrao";
  if (tituloMateria) tituloMateria.textContent = materiaAtual;

  // Cor salva quando você cria a matéria (ex.: "Azul", "Verde"...)
  const corMateriaRaw = localStorage.getItem("corMateria") || "Azul";
  const corMateria =
    corMateriaRaw.charAt(0).toUpperCase() + corMateriaRaw.slice(1).toLowerCase();

  const tema = {
    Azul: { c1: "#ffffff", c2: "#1e40af" },
    Verde: { c1: "#ffffff", c2: "#15803d" },
    Roxo: { c1: "#ffffff", c2: "#5b21b6" },
    Laranja: { c1: "#ffffff", c2: "#c2410c" },
    Rosa: { c1: "#ffffff", c2: "#9d174d" },
    Ciano: { c1: "#ffffff", c2: "#0e7490" },
  };

  const t = tema[corMateria] || tema.Azul;

  // Header com classe (seu CSS já tem .header.Azul etc.)
  if (header) {
    header.classList.remove(
      "Azul", "Verde", "Roxo", "Laranja", "Rosa", "Ciano",
      "azul", "verde", "roxo", "laranja", "rosa", "ciano"
    );
    header.classList.add(corMateria);
  }

  // Variáveis CSS para colorir cronômetro e botões
  document.documentElement.style.setProperty("--tema-1", t.c1);
  document.documentElement.style.setProperty("--tema-2", t.c2);

  // =========================
  // CHECKLIST (To-do)
  // =========================
  const progressoFill = document.querySelector(".progresso > div");
  if (progressoFill) progressoFill.style.backgroundColor = t.c2;

  const inputAssunto = document.querySelector(".addAssunto input");
  const btnAdd = document.querySelector(".botaoAssunto");
  const lista = document.querySelector(".lista");
  const contador = document.querySelector(".card .card-header span"); // primeiro card

  if (btnAdd) btnAdd.style.backgroundColor = t.c2;

  function obterItens() {
    if (!lista) return [];
    return Array.from(lista.querySelectorAll(".item"));
  }

  function atualizarChecklistUI() {
    const itens = obterItens();
    const total = itens.length;
    const concluidos = itens.filter((li) => {
      const cb = li.querySelector('input[type="checkbox"]');
      return cb && cb.checked;
    }).length;

    if (contador) contador.textContent = `${concluidos}/${total} concluídos`;

    const pct = total === 0 ? 0 : Math.round((concluidos / total) * 100);
    if (progressoFill) progressoFill.style.width = `${pct}%`;
  }

  function ligarEventosItem(li) {
    const checkbox = li.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    checkbox.addEventListener("change", () => {
      li.style.opacity = checkbox.checked ? "0.7" : "1";
      li.style.textDecoration = checkbox.checked ? "line-through" : "none";
      atualizarChecklistUI();
    });
  }

  // Ligar nos itens que já existem no HTML
  obterItens().forEach(ligarEventosItem);

  function criarItem(texto) {
    const li = document.createElement("li");
    li.classList.add("item");
    li.innerHTML = `
      <input type="checkbox">
      <span></span>
    `;
    li.querySelector("span").textContent = texto;
    ligarEventosItem(li);
    return li;
  }

  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      const texto = inputAssunto ? inputAssunto.value.trim() : "";
      if (!texto || !lista) return;

      lista.appendChild(criarItem(texto));
      inputAssunto.value = "";
      atualizarChecklistUI();
    });
  }

  if (inputAssunto) {
    inputAssunto.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && btnAdd) btnAdd.click();
    });
  }

  atualizarChecklistUI();

  // =========================
  // CRONÔMETRO + TEMPO POR MATÉRIA
  // =========================
  const timeDisplay = document.querySelector(".time");
  const statusDisplay = document.querySelector(".status");
  const btnPlay = document.querySelector(".acoes button:nth-child(1)");
  const btnReset = document.querySelector(".acoes button:nth-child(2)");

  // pinta botões de ação
  document.querySelectorAll(".acoes button").forEach((b) => (b.style.backgroundColor = t.c2));

  // chave do tempo por matéria
  const CHAVE_TEMPO = `timer:${materiaAtual}`;

  // tenta carregar tempo salvo (em segundos)
  const salvo = parseInt(localStorage.getItem(CHAVE_TEMPO), 10);

  let tempoTotal = Number.isFinite(salvo) && salvo > 0 ? salvo : 25 * 60;
  let tempoAtual = tempoTotal;
  let intervalo = null;
  let rodando = false;

  // ========= HH:MM:SS =========
  function formatarTempo(segundos) {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function renderTempo() {
    if (!timeDisplay) return;
    timeDisplay.textContent = formatarTempo(tempoAtual);
  }

  function setStatus(texto) {
    if (!statusDisplay) return;
    statusDisplay.textContent = texto;
  }

  function parar() {
    clearInterval(intervalo);
    intervalo = null;
    rodando = false;
    if (btnPlay) btnPlay.textContent = "▶";
  }

  function iniciar() {
    if (rodando) return;

    rodando = true;
    setStatus("Em andamento");
    if (btnPlay) btnPlay.textContent = "⏸";

    intervalo = setInterval(() => {
      if (tempoAtual > 0) {
        tempoAtual--;
        renderTempo();
      } else {
        parar();
        setStatus("Finalizado");
      }
    }, 1000);
  }

  function pausar() {
    if (!rodando) return;
    parar();
    setStatus("Pausado");
  }

  if (btnPlay) {
    btnPlay.addEventListener("click", () => {
      if (!rodando) iniciar();
      else pausar();
    });
  }

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      parar();
      tempoAtual = tempoTotal;
      renderTempo();
      setStatus("Pausado");
    });
  }

  // =========================
  // MODAL "DEFINIR TEMPO" (MÁSCARA AUTOMÁTICA)
  // =========================
  const btnDefinirTempo = document.getElementById("definirTempo");
  const tempoOverlay = document.getElementById("tempoOverlay");
  const tempoFechar = document.getElementById("tempoFechar");
  const tempoCancelar = document.getElementById("tempoCancelar");
  const tempoSalvar = document.getElementById("tempoSalvar");
  const tempoInput = document.getElementById("tempoInput");

  // ======== MÁSCARA: usuário digita SÓ NÚMEROS e aparece HH:MM:SS ========
  function somenteDigitos(str) {
    return String(str).replace(/\D/g, "");
  }

  function formatarHHMMSSDeDigitos(digitos) {
    // mantém até 6 dígitos (HHMMSS)
    const d = somenteDigitos(digitos).slice(0, 6);

    // completa à esquerda para sempre formar 6 dígitos
    const pad = d.padStart(6, "0");

    const hh = pad.slice(0, 2);
    const mm = pad.slice(2, 4);
    const ss = pad.slice(4, 6);

    return `${hh}:${mm}:${ss}`;
  }

  function parseTempoEntrada(valorMascarado) {
    // pega HHMMSS (6 dígitos)
    const digitos = somenteDigitos(valorMascarado).slice(0, 6);
    if (digitos.length !== 6) return null;

    const h = parseInt(digitos.slice(0, 2), 10);
    const m = parseInt(digitos.slice(2, 4), 10);
    const s = parseInt(digitos.slice(4, 6), 10);

    if (!Number.isFinite(h) || !Number.isFinite(m) || !Number.isFinite(s)) return null;
    if (m > 59 || s > 59) return null;

    const total = h * 3600 + m * 60 + s;
    return total > 0 ? total : null;
  }

  function abrirModalTempo() {
    if (!tempoOverlay || !tempoInput) return;
    tempoOverlay.classList.add("ativo");
    tempoOverlay.setAttribute("aria-hidden", "false");

    // preenche com o tempo atual (HH:MM:SS)
    tempoInput.value = formatarTempo(tempoTotal);

    // cursor no final (melhor para máscara)
    tempoInput.focus();
    const len = tempoInput.value.length;
    tempoInput.setSelectionRange(len, len);
  }

  function fecharModalTempo() {
    if (!tempoOverlay) return;
    tempoOverlay.classList.remove("ativo");
    tempoOverlay.setAttribute("aria-hidden", "true");
  }

  if (btnDefinirTempo) {
    btnDefinirTempo.addEventListener("click", abrirModalTempo);

    // opcional: teclado (Enter ou Espaço abre)
    btnDefinirTempo.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") abrirModalTempo();
    });
  }

  if (tempoFechar) tempoFechar.addEventListener("click", fecharModalTempo);
  if (tempoCancelar) tempoCancelar.addEventListener("click", fecharModalTempo);

  if (tempoOverlay) {
    tempoOverlay.addEventListener("click", (e) => {
      if (e.target === tempoOverlay) fecharModalTempo();
    });
  }

  // aplica máscara e impede caracteres inválidos
  if (tempoInput) {
    tempoInput.setAttribute("inputmode", "numeric");

    // bloqueia letras/símbolos na digitação
    tempoInput.addEventListener("beforeinput", (e) => {
      if (!e.data) return; // apagar, etc.
      if (!/^\d+$/.test(e.data)) e.preventDefault();
    });

    // máscara em tempo real
    tempoInput.addEventListener("input", () => {
      const digitos = somenteDigitos(tempoInput.value);
      tempoInput.value = formatarHHMMSSDeDigitos(digitos);

      // mantém cursor no final
      const len = tempoInput.value.length;
      tempoInput.setSelectionRange(len, len);
    });

    // enter salva / esc fecha
    tempoInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && tempoSalvar) tempoSalvar.click();
      if (e.key === "Escape") fecharModalTempo();
    });
  }

  if (tempoSalvar) {
    tempoSalvar.addEventListener("click", () => {
      if (!tempoInput) return;

      const totalSegundos = parseTempoEntrada(tempoInput.value);
      if (!totalSegundos) {
        alert("Tempo inválido. Digite apenas números (HHMMSS). Ex: 000500 vira 00:05:00.");
        return;
      }

      if (rodando) pausar();

      tempoTotal = totalSegundos;
      tempoAtual = totalSegundos;

      // salva por matéria (em segundos)
      localStorage.setItem(CHAVE_TEMPO, String(totalSegundos));

      renderTempo();
      setStatus("Pausado");
      fecharModalTempo();
    });
  }

  // render inicial
  renderTempo();
  setStatus("Pausado");
});
