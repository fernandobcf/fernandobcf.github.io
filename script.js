import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


import {
    getDatabase,
    ref,
    onValue,
    onDisconnect,
    set
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";


const firebaseConfig = {

    apiKey:
        "AIzaSyDkOXi1MYbb9rp5Zo7HNfQYnhJBMPPp8bs",

    authDomain:
        "testdogithub.firebaseapp.com",

    databaseURL:
        "https://testdogithub-default-rtdb.firebaseio.com/",

    projectId:
        "testdogithub",

    storageBucket:
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


// Gera um ID para este navegador
const id =
    crypto.randomUUID();


// Local onde os usuários online ficam registrados
const meuUsuario =
    ref(db, "online/" + id);


// Quando o navegador desconectar,
// remove automaticamente este usuário.
onDisconnect(meuUsuario)
    .remove()
    .then(() => {

        // Registra o usuário como online
        set(meuUsuario, true);

    });


// Observa todos os usuários online
const onlineRef =
    ref(db, "online");


onValue(onlineRef, snapshot => {

    const dados =
        snapshot.val();

    let quantidade = 0;


    if (dados) {

        quantidade =
            Object.keys(dados).length;

    }


    document.getElementById(
        "online"
    ).textContent = quantidade;

});