function mostrarTela(tela) {
    document.querySelectorAll('.tela').forEach(el => el.style.display = 'none');
    document.getElementById(tela).style.display = 'block';

    if (tela === 'historico') {
        carregarHistorico();
    }
}

// Salvar treino
document.getElementById('formTreino').addEventListener('submit', function(e) {
    e.preventDefault();

    const dados = {
        pessoa: document.getElementById('pessoa').value,
        grupo: document.getElementById('grupo').value,
        exercicio: document.getElementById('exercicio').value,
        series: parseInt(document.getElementById('series').value),
        repeticoes: parseInt(document.getElementById('repeticoes').value),
        data: new Date().toLocaleDateString()
    };

    db.collection('treinos').add(dados)
    .then(() => {
        alert('✅ Treino salvo com sucesso!');
        document.getElementById('formTreino').reset();
    })
    .catch(error => {
        console.error('❌ Erro ao salvar treino: ', error);
    });
});

// Carregar histórico
function carregarHistorico() {
    const lista = document.getElementById('listaTreinos');
    lista.innerHTML = '';

    db.collection('treinos').orderBy('data', 'desc').get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            const item = doc.data();
            const li = document.createElement('li');
            li.innerHTML = `
                <b>${item.pessoa}</b> — 
                <i>${item.grupo}</i> — 
                ${item.exercicio} 
                (${item.series}x${item.repeticoes}) 
                em ${item.data}
            `;
            lista.appendChild(li);
        });
    });
}
