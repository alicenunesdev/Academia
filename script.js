// 🔗 Sua API do Google Sheets (Google Apps Script)
const API_URL = "https://script.google.com/macros/s/AKfycbzKMk3WGjg5FUqfNDFOJIoNYbwEF30bEtkcsmmfllmZK4Df341lfnpIx2TxAptMjt20Uw/exec";

let treinos = [];
let treinoEditando = null;

// 🔄 Troca de telas
function mostrarTela(tela) {
    document.querySelectorAll('.tela').forEach(el => el.style.display = 'none');
    document.getElementById(tela).style.display = 'block';

    if (tela === 'historico') {
        carregarHistorico();
    }
}

// 🎯 Enviar treino (Criar ou Editar)
document.getElementById('formTreino').addEventListener('submit', function (e) {
    e.preventDefault();

    const dados = {
        id: treinoEditando ?? '', // vazio para criar, preenchido para editar
        pessoa: document.getElementById('pessoa').value,
        grupo: document.getElementById('grupo').value,
        exercicio: document.getElementById('exercicio').value,
        series: document.getElementById('series').value,
        repeticoes: document.getElementById('repeticoes').value,
        data: new Date().toLocaleDateString()
    };

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(dados),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
        if (res.ok) {
            alert('Treino salvo com sucesso!');
            document.getElementById('formTreino').reset();
            treinoEditando = null;
            mostrarTela('historico');
        } else {
            alert('Erro ao salvar treino.');
        }
    })
    .catch(err => console.error('Erro:', err));
});

// 🔍 Carregar Histórico
function carregarHistorico() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            treinos = data;
            mostrarLista(data);
            carregarFiltros();
        })
        .catch(err => console.error('Erro:', err));
}

// 📝 Mostrar Lista
function mostrarLista(lista) {
    const ul = document.getElementById('listaTreinos');
    ul.innerHTML = '';

    lista.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <b>${item.pessoa}</b> — 
            <i>${item.grupo}</i> — 
            ${item.exercicio} 
            (${item.series}x${item.repeticoes}) 
            em ${item.data}
            <button onclick="editarTreino('${item.id}')">✏️</button>
            <button onclick="excluirTreino('${item.id}')">❌</button>
        `;
        ul.appendChild(li);
    });
}

// ✏️ Editar
function editarTreino(id) {
    const treino = treinos.find(t => t.id === id);
    if (!treino) return;

    document.getElementById('pessoa').value = treino.pessoa;
    document.getElementById('grupo').value = treino.grupo;
    document.getElementById('exercicio').value = treino.exercicio;
    document.getElementById('series').value = treino.series;
    document.getElementById('repeticoes').value = treino.repeticoes;

    treinoEditando = treino.id;
    mostrarTela('cadastrar');
}

// ❌ Excluir
function excluirTreino(id) {
    if (!confirm('Tem certeza que deseja excluir esse treino?')) return;

    fetch(`${API_URL}?id=${id}`, { method: 'DELETE' })
        .then(res => {
            if (res.ok) {
                alert('Treino excluído!');
                carregarHistorico();
            } else {
                alert('Erro ao excluir treino.');
            }
        })
        .catch(err => console.error('Erro:', err));
}

// 🔍 Filtro
function filtrar() {
    const pessoa = document.getElementById('filtroPessoa').value.toLowerCase();
    const grupo = document.getElementById('filtroGrupo').value.toLowerCase();

    const filtrados = treinos.filter(t => 
        (pessoa === '' || t.pessoa.toLowerCase().includes(pessoa)) &&
        (grupo === '' || t.grupo.toLowerCase().includes(grupo))
    );

    mostrarLista(filtrados);
}

// 🚦 Carregar filtros automáticos
function carregarFiltros() {
    const pessoas = [...new Set(treinos.map(t => t.pessoa))];
    const grupos = [...new Set(treinos.map(t => t.grupo))];

    document.getElementById('filtroPessoa').innerHTML = `
        <option value="">Todas</option>
        ${pessoas.map(p => `<option value="${p}">${p}</option>`).join('')}
    `;

    document.getElementById('filtroGrupo').innerHTML = `
        <option value="">Todos</option>
        ${grupos.map(g => `<option value="${g}">${g}</option>`).join('')}
    `;
}
