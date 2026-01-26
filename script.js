// responsavel JS: Adriel //
 abrirModal = document.getElementById("abrirModal");
const fecharModal = document.getElementById("fecharModal");
const modal = document.getElementById("modal");
const inputMateria = document.getElementById("inputMateria");
const btnCriar = document.querySelector(".criarMateria");
const cardsContainer = document.querySelector(".cards");

let corEscolhida = "";
const botoesCor = document.querySelectorAll(".cor");

// LOCAL STORAGE // 
const STORAGE_KEY = "materias";

// Carrega materia //
function carregarMaterias() {
    const materias = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    materias.forEach(m => criarCard(m.nome, m.cor, false));
}
// Salva a materia //
function salvarMateria(nome, cor) {
    const materias = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    materias.push({ nome, cor });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materias));
}
// Remove a materia //
function removerMateria(nome) {
    let materias = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    materias = materias.filter(m => m.nome !== nome);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materias));
}

// CORES // 
botoesCor.forEach(botao => {
    botao.addEventListener("click", () => {
        corEscolhida = botao.classList[1];
        botoesCor.forEach(b => b.classList.remove("ativo"));
        botao.classList.add("ativo");
    });
});

// CRIAR CARD // 
function criarCard(nome, cor, salvar = true) {
    const novoCard = document.createElement("div");
    novoCard.classList.add("card", cor);

    novoCard.innerHTML = `
        <img class="excluirCard" src="imagens/lixo-icon.png" alt="Excluir">
        <h3 class="cardtitulo">${nome}</h3>
    `;
    // Adiciona novo card //
    novoCard.addEventListener("click", () => {
        localStorage.setItem("materiaSelecionada", nome);
        window.location.href = "materia.html";
    });

    // Excluir
    const btnExcluir = novoCard.querySelector(".excluirCard");
    btnExcluir.addEventListener("click", (e) => {
        e.stopPropagation();
        novoCard.remove();
        removerMateria(nome);
    });

    // Abrir matéria
    novoCard.addEventListener("click", () => {
        localStorage.setItem("corMateria", cor);
        localStorage.setItem("nomeMateria", nome);
        window.location.href = "materia.html";
    });

    cardsContainer.appendChild(novoCard);

    if (salvar) salvarMateria(nome, cor);
}

// BOTÃO CRIAR // 
btnCriar.addEventListener("click", () => {
    const nome = inputMateria.value.trim();

    //Verificação de Escrita//

    if (nome === "") {
        alert("Escreva algo!");
        return;
    }

    //Verificação de cor//

    if (!corEscolhida) {
        alert("Escolha uma cor!");
        return;
    }

    criarCard(nome, corEscolhida, true);

    inputMateria.value = "";
    corEscolhida = "";
    botoesCor.forEach(b => b.classList.remove("ativo"));
});

// MODAL // 
abrirModal.addEventListener("click", () => {
    modal.style.display = "flex";
});
// Fecha o modal //
fecharModal.addEventListener("click", () => {
    modal.style.display = "none";
});

//Click fora do modal = modal display none//

modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

// BOTÃO ATIVO // 
inputMateria.addEventListener("input", () => {
    if (inputMateria.value.trim() !== "") {
        btnCriar.classList.add("ativo");
        btnCriar.disabled = false;
    } else {
        btnCriar.classList.remove("ativo");
        btnCriar.disabled = true;
    }
});

// INICIALIZAÇÃO // 
carregarMaterias();
