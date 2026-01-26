// responsavel JS: Adriel //
const splash = document.getElementById("splash");

// TEMPO TOTAL //
const TEMPO_SPLASH = 2500;

// FADE-OUT //
setTimeout(() => {
  splash.classList.add("fade-out");
}, TEMPO_SPLASH - 800);

// REDIRECIONAMENTO //
setTimeout(() => {
  window.location.href = "home.html";
}, TEMPO_SPLASH);
