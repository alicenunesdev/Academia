// URL da sua API do Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbzKMk3WGjg5FUqfNDFOJIoNYbwEF30bEtkcsmmfllmZK4Df341lfnpIx2TxAptMjt20Uw/exec";

let dadosTreinos = [];
let editandoId = null;

// Função para trocar de tela
function mostrarTela(tela) {
    document.querySelectorAll('.tela').forEach(el => el.style.display = 'none');
    document.getElementById(tela).style.display = 'block';

    if (tela === 'historico') {
        carregarHistorico();
    }
}

// Função para salvar treino
document.getElementById('formTreino').addEventListener('submit', function (e) {
    e.preventDefault();

    const dados = {
        id: editandoId, // se estiver editando, mantém o ID
        pessoa: document.getElementById('pessoa').value,
        grupo: document.getElementById('grupo').value,
        exercicio: document.getElementById('exercicio').value,
        series: document.getElementById('series').value,
        repeticoes: document.getElementById('repeticoes').value,
        data: new Date().toLocaleDateString('pt-BR')
    };

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(dados),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (res.ok) {
            alert('Treino salvo com sucesso!');
            document.getElementById('formTreino').reset();
            editandoId = null;
            mostrarTela('historico');
        } else {
            alert('Erro ao salvar treino.');
        }
    })
    .catch(err => console.error('Erro:', err));
});

// Função para carregar o histórico
function carregarHistorico() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            dadosTreinos = data;
            listarTreinos(data);
        })
        .catch(err => console.error('Erro:', err));
}

// Função que exibe a lista de treinos
function listarTreinos(data) {
    const lista = document.getElementById('listaTreinos');
    lista.innerHTML = '';

    if (data.length === 0) {
        lista.innerHTML = '<li>Nenhum treino cadastrado.</li>';
        return;
    }

    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <b>${item.pessoa}</b> — 
            <i>${item.grupo}</i> — 
            ${item.exercicio} 
            (${item.series}x${item.repeticoes}) 
            em ${item.data}
            <button onclick="editarTreino('${item.id}')">✏️ Editar</button>
            <button onclick="excluirTreino('${item.id}')">🗑️ Excluir</button>
        `;
        lista.appendChild(li);
    });
}

// Função para editar treino
function editarTreino(id) {
    const treino = dadosTreinos.find(item => item.id === id);
    if (!treino) return;

    document.getElementById('pessoa').value = treino.pessoa;
    document.getElementById('grupo').value = treino.grupo;
    document.getElementById('exercicio').value = treino.exercicio;
    document.getElementById('series').value = treino.series;
    document.getElementById('repeticoes').value = treino.repeticoes;

    editandoId = id;
    mostrarTela('cadastrar');
}

// Função para excluir treino
function excluirTreino(id) {
    if (!confirm('Deseja realmente excluir este treino?')) return;

    fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (res.ok) {
            alert('Treino excluído com sucesso!');
            carregarHistorico();
        } else {
            alert('Erro ao excluir treino.');
        }
    })
    .catch(err => console.error('Erro:', err));
}

// Função para filtrar por pessoa
function filtrarPorPessoa(nome) {
    const filtrados = dadosTreinos.filter(item => 
        item.pessoa.toLowerCase().includes(nome.toLowerCase())
    );
    listarTreinos(filtrados);
}

// Função para filtrar por grupo muscular
function filtrarPorGrupo(grupo) {
    const filtrados = dadosTreinos.filter(item => 
        item.grupo.toLowerCase().includes(grupo.toLowerCase())
    );
    listarTreinos(filtrados);
}
