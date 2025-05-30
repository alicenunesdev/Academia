// Alterna entre telas
function mostrarTela(tela) {
    const telas = document.querySelectorAll('.tela');
    telas.forEach(t => t.style.display = 'none');

    document.getElementById(tela).style.display = 'block';

    if (tela === 'historico') {
        carregarHistorico();
    }
}

// Salvar treino no LocalStorage
document.getElementById('formTreino').addEventListener('submit', function(e) {
    e.preventDefault();

    const exercicio = document.getElementById('exercicio').value;
    const series = document.getElementById('series').value;
    const repeticoes = document.getElementById('repeticoes').value;

    const treino = { exercicio, series, repeticoes };

    let treinos = JSON.parse(localStorage.getItem('treinos')) || [];
    treinos.push(treino);
    localStorage.setItem('treinos', JSON.stringify(treinos));

    alert('Treino salvo com sucesso!');

    // Limpa formulário
    this.reset();
});

// Carregar histórico
function carregarHistorico() {
    const lista = document.getElementById('listaTreinos');
    lista.innerHTML = '';

    const treinos = JSON.parse(localStorage.getItem('treinos')) || [];

    if (treinos.length === 0) {
        lista.innerHTML = '<li>Nenhum treino cadastrado.</li>';
        return;
    }

    treinos.forEach((t, index) => {
        const item = document.createElement('li');
        item.innerHTML = `${t.exercicio} - ${t.series} séries x ${t.repeticoes} repetições 
        <button onclick="deletarTreino(${index})">Excluir</button>`;
        lista.appendChild(item);
    });
}

// Deletar treino
function deletarTreino(index) {
    let treinos = JSON.parse(localStorage.getItem('treinos')) || [];
    treinos.splice(index, 1);
    localStorage.setItem('treinos', JSON.stringify(treinos));
    carregarHistorico();
}
// Configurações do seu projeto (pegue no console do Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyAQZrwPVmbcNZTEcGdqqE-Hscn2TS-hnwY",
    authDomain: "academia-bd-9d4da.firebaseapp.com",
    projectId: "academia-bd-9d4da",
    storageBucket: "academia-bd-9d4da.firebasestorage.app",
    messagingSenderId: "201289997890",
    appId: "1:201289997890:web:19bece6aa0b3d52e3417db"
};

// Inicializar Firebase
// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// Função para listar treinos
function listarTreinos() {
    const lista = document.getElementById('lista-treinos');
    lista.innerHTML = "";

    db.collection("academia").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const dados = doc.data();
            const item = document.createElement('li');
            item.innerHTML = `
                <strong>Treino:</strong> ${dados.treino || '(sem nome)'}<br>
                <strong>Séries:</strong> ${dados.serie}<br>
                <strong>Repetições:</strong> ${dados.repetição}
            `;
            lista.appendChild(item);
        });
    });
}

// Chama a função ao carregar a página
listarTreinos();