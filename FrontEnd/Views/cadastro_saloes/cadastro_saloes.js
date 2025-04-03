document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');

    cadastroForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const formData = new FormData(cadastroForm);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('/cadastro_salao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
           
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(responseData => {
            if (responseData.message === 'Salão cadastrado com sucesso') {
                alert('Cadastro realizado com sucesso!');
                // Redirecione para a página de login ou outra página, se necessário
                // window.location.href = '/login';
            } else {
                alert(`Erro no cadastro: ${responseData.error}`);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao tentar realizar o cadastro.');
        });
    });
});