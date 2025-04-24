document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
    const btnAvancar = document.querySelector('.btn-avancar');
    
    // Esconde o botão avançar inicialmente
    btnAvancar.style.display = 'none';

    cadastroForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const data = {
            nome_completo: document.getElementById('nome_completo').value,
            email: document.getElementById('email').value,
            CPF: document.getElementById('CPF').value,
            telefone: document.getElementById('telefone').value,
            usuario: document.getElementById('usuario').value,
            senha: document.getElementById('senha').value
        };

        fetch('/cadastro_usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.id_dono) {
                // Mostra o botão avançar após cadastro
                btnAvancar.style.display = 'block';
                // Atualiza o link com o ID
                btnAvancar.href = `/cadastro_salao`;
                alert('Cadastro realizado! Clique em Avançar para continuar.');
            } else {
                throw new Error(data.error || 'Erro no cadastro');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert(error.message);
        });
    });
});