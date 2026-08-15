import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getDatabase,
    ref,
    set
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyDkOXi1MYbb9rp5Zo7HNfQYnhJBMPp8bs",
    authDomain: "testdogithub.firebaseapp.com",
    databaseURL: "https://testdogithub-default-rtdb.firebaseio.com/",
    projectId: "testdogithub",
    storageBucket: "testdogithub.firebasestorage.app",
    messagingSenderId: "1045850387937",
    appId: "1:1045850387937:web:276466d0630d8e3a7f8ea0"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


const button =
    document.getElementById("enterButton");

const input =
    document.getElementById("nameInput");

const modal =
    document.getElementById("nameModal");


button.addEventListener("click", async () => {

    console.log("BOTÃO CLICADO");

    const nome = input.value.trim();

    if (!nome) {

        alert("Digite seu nome!");

        return;
    }

    console.log("Nome:", nome);

    try {

        await set(
            ref(db, "teste/jogadores"),
            {
                nome: nome,
                horario: Date.now()
            }
        );

        console.log("Firebase funcionando!");

        modal.classList.add("hidden");

        alert("Entrou no jogo!");

    } catch (erro) {

        console.error(
            "ERRO DO FIREBASE:",
            erro
        );

        alert(
            "Erro ao conectar ao Firebase. Veja o console."
        );

    }

});    storageBucket:
        "testdogithub.firebasestorage.app",

    messagingSenderId:
        "1045850387937",

    appId:
        "1:1045850387937:web:276466d0630d8e3a7f8ea0"

};


const app =
    initializeApp(firebaseConfig);


const db =
    getDatabase(app);


/*
========================================
ESTADO
========================================
*/

let playerId =
    localStorage.getItem("rpsPlayerId");


if (!playerId) {

    playerId =
        crypto.randomUUID();

    localStorage.setItem(
        "rpsPlayerId",
        playerId
    );

}


let playerName = "";

let currentGame = {};

let processandoRodada = false;


/*
========================================
ELEMENTOS
========================================
*/

const nameModal =
    document.getElementById("nameModal");


const nameInput =
    document.getElementById("nameInput");


const enterButton =
    document.getElementById("enterButton");


const statusText =
    document.getElementById("status");


const roundMessage =
    document.getElementById("roundMessage");


const queueList =
    document.getElementById("queueList");


const player1Name =
    document.getElementById("player1Name");


const player2Name =
    document.getElementById("player2Name");


const player1Choice =
    document.getElementById("player1Choice");


const player2Choice =
    document.getElementById("player2Choice");


const score1 =
    document.getElementById("score1");


const score2 =
    document.getElementById("score2");


const scoreName1 =
    document.getElementById("scoreName1");


const scoreName2 =
    document.getElementById("scoreName2");


const leaveButton =
    document.getElementById("leaveButton");


const choiceButtons =
    document.querySelectorAll(
        ".choice-button"
    );


/*
========================================
ENTRAR
========================================
*/

enterButton.addEventListener(
    "click",
    entrar
);


nameInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            entrar();

        }

    }
);


async function entrar() {

    const name =
        nameInput.value.trim();


    if (!name) {

        alert(
            "Digite um nome."
        );

        return;

    }


    playerName =
        name.substring(0, 20);


    nameModal.classList.add(
        "hidden"
    );


    await entrarNaPartida();

}


/*
========================================
ENTRAR NA PARTIDA
========================================
*/

async function entrarNaPartida() {

    const jogadores =
        currentGame.jogadores || {};


    const fila =
        currentGame.fila || {};


    /*
    Já está jogando
    */

    if (jogadores[playerId]) {

        return;

    }


    /*
    Já está na fila
    */

    if (fila[playerId]) {

        return;

    }


    const quantidade =
        Object.keys(jogadores).length;


    /*
    TEM VAGA
    */

    if (quantidade < 2) {

        await set(

            ref(
                db,
                `jogo/jogadores/${playerId}`
            ),

            {

                nome: playerName,

                escolha: null,

                pontos: 0

            }

        );


        configurarSaida();


        return;

    }


    /*
    PARTIDA CHEIA
    */

    await set(

        ref(
            db,
            `jogo/fila/${playerId}`
        ),

        {

            nome: playerName,

            entrada: Date.now()

        }

    );

}


/*
========================================
SAÍDA AUTOMÁTICA
========================================
*/

function configurarSaida() {

    const jogadorRef =
        ref(
            db,
            `jogo/jogadores/${playerId}`
        );


    onDisconnect(
        jogadorRef
    ).remove();

}


/*
========================================
ESCOLHAS
========================================
*/

choiceButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            async () => {

                await fazerEscolha(
                    button.dataset.choice
                );

            }
        );

    }
);


async function fazerEscolha(choice) {

    const jogadores =
        currentGame.jogadores || {};


    const jogador =
        jogadores[playerId];


    if (!jogador) {

        return;

    }


    if (jogador.escolha) {

        return;

    }


    await update(

        ref(
            db,
            `jogo/jogadores/${playerId}`
        ),

        {

            escolha: choice

        }

    );

}


/*
========================================
RESULTADO
========================================
*/

function descobrirVencedor(
    escolha1,
    escolha2
) {

    if (
        escolha1 === escolha2
    ) {

        return "empate";

    }


    if (

        (
            escolha1 === "pedra" &&
            escolha2 === "tesoura"
        )

        ||

        (
            escolha1 === "papel" &&
            escolha2 === "pedra"
        )

        ||

        (
            escolha1 === "tesoura" &&
            escolha2 === "papel"
        )

    ) {

        return "jogador1";

    }


    return "jogador2";

}


/*
========================================
PROCESSAR RODADA
========================================
*/

async function processarRodada() {

    if (processandoRodada) {

        return;

    }


    const jogadores =
        currentGame.jogadores || {};


    const ids =
        Object.keys(jogadores);


    if (ids.length !== 2) {

        return;

    }


    const jogador1 =
        jogadores[ids[0]];


    const jogador2 =
        jogadores[ids[1]];


    if (

        !jogador1.escolha ||
        !jogador2.escolha

    ) {

        return;

    }


    processandoRodada = true;


    const resultado =
        descobrirVencedor(

            jogador1.escolha,

            jogador2.escolha

        );


    /*
    EMPATE
    */

    if (
        resultado === "empate"
    ) {

        roundMessage.textContent =
            "Empate!";


        await esperar(1200);


        await update(

            ref(
                db,
                "jogo/jogadores"
            ),

            {

                [`${ids[0]}/escolha`:
                    null],

                [`${ids[1]}/escolha`:
                    null]

            }

        );


        processandoRodada =
            false;


        return;

    }


    /*
    VENCEDOR
    */

    const vencedorId =

        resultado === "jogador1"
            ? ids[0]
            : ids[1];


    const perdedorId =

        resultado === "jogador1"
            ? ids[1]
            : ids[0];


    const vencedor =
        jogadores[vencedorId];


    roundMessage.textContent =
        `${vencedor.nome} venceu!`;


    /*
    Aumenta pontuação
    */

    await update(

        ref(
            db,
            `jogo/jogadores/${vencedorId}`
        ),

        {

            pontos:
                (vencedor.pontos || 0) + 1

        }

    );


    await esperar(1500);


    /*
    Remove o perdedor
    */

    await remove(

        ref(
            db,
            `jogo/jogadores/${perdedorId}`
        )

    );


    /*
    Limpa escolha do vencedor
    */

    await update(

        ref(
            db,
            `jogo/jogadores/${vencedorId}`
        ),

        {

            escolha: null

        }

    );


    processandoRodada =
        false;

}


/*
========================================
PROMOVER FILA
========================================
*/

async function promoverFila() {

    const jogadores =
        currentGame.jogadores || {};


    const fila =
        currentGame.fila || {};


    if (
        Object.keys(jogadores).length >= 2
    ) {

        return;

    }


    const lista =

        Object.entries(fila)

        .sort(

            (a, b) =>

                (a[1].entrada || 0) -
                (b[1].entrada || 0)

        );


    if (
        lista.length === 0
    ) {

        return;

    }


    const [id, dados] =
        lista[0];


    await set(

        ref(
            db,
            `jogo/jogadores/${id}`
        ),

        {

            nome: dados.nome,

            escolha: null,

            pontos: 0

        }

    );


    await remove(

        ref(
            db,
            `jogo/fila/${id}`
        )

    );


    onDisconnect(

        ref(
            db,
            `jogo/jogadores/${id}`
        )

    ).remove();

}


/*
========================================
FIREBASE LISTENER
========================================
*/

onValue(

    ref(db, "jogo"),

    snapshot => {

        currentGame =
            snapshot.val() || {};


        atualizarInterface();


        promoverFila();


        processarRodada();

    },

    error => {

        console.error(
            "Erro Firebase:",
            error
        );


        statusText.textContent =
            "Erro ao conectar ao Firebase.";

    }

);


/*
========================================
INTERFACE
========================================
*/

function atualizarInterface() {

    const jogadores =
        currentGame.jogadores || {};


    const fila =
        currentGame.fila || {};


    const ids =
        Object.keys(jogadores);


    /*
    JOGADOR 1
    */

    if (ids[0]) {

        const jogador =
            jogadores[ids[0]];


        player1Name.textContent =
            jogador.nome;


        scoreName1.textContent =
            jogador.nome;


        score1.textContent =
            jogador.pontos || 0;


        player1Choice.textContent =
            converterEscolha(
                jogador.escolha
            );

    }

    else {

        player1Name.textContent =
            "---";

        scoreName1.textContent =
            "---";

        score1.textContent =
            "0";

        player1Choice.textContent =
            "?";

    }


    /*
    JOGADOR 2
    */

    if (ids[1]) {

        const jogador =
            jogadores[ids[1]];


        player2Name.textContent =
            jogador.nome;


        scoreName2.textContent =
            jogador.nome;


        score2.textContent =
            jogador.pontos || 0;


        player2Choice.textContent =
            converterEscolha(
                jogador.escolha
            );

    }

    else {

        player2Name.textContent =
            "---";

        scoreName2.textContent =
            "---";

        score2.textContent =
            "0";

        player2Choice.textContent =
            "?";

    }


    /*
    STATUS
    */

    if (
        ids.length === 0
    ) {

        statusText.textContent =
            "Nenhum jogador.";

        roundMessage.textContent =
            "Aguardando jogadores...";

    }

    else if (
        ids.length === 1
    ) {

        statusText.textContent =
            "1 jogador na partida.";

        roundMessage.textContent =
            "Aguardando outro jogador...";

    }

    else {

        statusText.textContent =
            "Partida em andamento.";

        atualizarMensagem(
            jogadores,
            ids
        );

    }


    /*
    BOTÕES
    */

    const eu =
        jogadores[playerId];


    choiceButtons.forEach(
        button => {

            button.disabled =

                !eu ||

                !!eu.escolha ||

                ids.length < 2;

        }
    );


    /*
    FILA
    */

    const filaIds =
        Object.keys(fila);


    if (
        filaIds.length === 0
    ) {

        queueList.textContent =
            "Ninguém na fila.";

    }

    else {

        queueList.innerHTML = "";


        filaIds

            .sort(

                (a, b) =>

                    (fila[a].entrada || 0) -
                    (fila[b].entrada || 0)

            )

            .forEach(

                (id, index) => {

                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className =
                        "queue-player";


                    div.textContent =
                        `${index + 1}. ${fila[id].nome}`;


                    queueList.appendChild(
                        div
                    );

                }

            );

    }

}


/*
========================================
MENSAGEM
========================================
*/

function atualizarMensagem(
    jogadores,
    ids
) {

    const jogador1 =
        jogadores[ids[0]];


    const jogador2 =
        jogadores[ids[1]];


    if (

        jogador1.escolha &&
        jogador2.escolha

    ) {

        const resultado =
            descobrirVencedor(

                jogador1.escolha,

                jogador2.escolha

            );


        if (
            resultado === "empate"
        ) {

            roundMessage.textContent =
                "Empate! Nova rodada...";

        }

        else {

            const vencedor =

                resultado === "jogador1"
                    ? jogador1.nome
                    : jogador2.nome;


            roundMessage.textContent =
                `${vencedor} venceu!`;

        }


        return;

    }


    const eu =
        jogadores[playerId];


    if (
        eu && eu.escolha
    ) {

        roundMessage.textContent =
            "Você escolheu! Aguardando o adversário...";

    }

    else {

        roundMessage.textContent =
            "Escolha sua jogada!";

    }

}


/*
========================================
CONVERTER ESCOLHA
========================================
*/

function converterEscolha(
    escolha
) {

    if (
        escolha === "pedra"
    ) {

        return "🪨";

    }


    if (
        escolha === "papel"
    ) {

        return "📄";

    }


    if (
        escolha === "tesoura"
    ) {

        return "✂️";

    }


    return "?";

}


/*
========================================
SAIR
========================================
*/

leaveButton.addEventListener(

    "click",

    async () => {

        await remove(

            ref(
                db,
                `jogo/jogadores/${playerId}`
            )

        );


        await remove(

            ref(
                db,
                `jogo/fila/${playerId}`
            )

        );


        nameModal.classList.remove(
            "hidden"
        );


        nameInput.value = "";

        playerName = "";

    }

);


/*
========================================
UTILIDADE
========================================
*/

function esperar(ms) {

    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );

}
