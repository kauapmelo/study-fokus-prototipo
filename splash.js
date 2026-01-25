const splash = document.getElementById("splash");

// tempo total da splash (ms)
const TEMPO_SPLASH = 2500;

// inicia fade-out antes de sair
setTimeout(() => {
  splash.classList.add("fade-out");
}, TEMPO_SPLASH - 800);

// redireciona após animação
setTimeout(() => {
  window.location.href = "home.html";
}, TEMPO_SPLASH);
