// URL da sua API Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbzKMk3WGjg5FUqfNDFOJIoNYbwEF30bEtkcsmmfllmZK4Df341lfnpIx2TxAptMjt20Uw/exec";

// Função para trocar telas
function mostrarTela(tela) {
    document.querySelectorAll('.tela').forEach(el => el.style.display = 'none');
    document.getElementById(tela).style.display = 'block';

    if (tela === 'historico') {
        carregarHistorico();
    }
}

// Função para enviar dados
document.getElementById('formTreino').addEventListener('submit', function (e) {
    e.preventDefault();

    const dados = {
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
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (res.ok) {
            alert('Treino salvo com sucesso!');
            document.getElementById('formTreino').reset();
        } else {
            alert('Erro ao salvar treino.');
        }
    })
    .catch(err => console.error('Erro:', err));
});

// Função para carregar histórico
function carregarHistorico() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const lista = document.getElementById('listaTreinos');
            lista.innerHTML = '';

            data.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <b>${item.pessoa}</b> — 
                    <i>${item.grupo}</i> — 
                    ${item.exercicio} 
                    (${item.series} séries de ${item.repeticoes} repetições) 
                    em ${item.data}
                `;
                lista.appendChild(li);
            });
        })
        .catch(err => console.error('Erro:', err));
}
