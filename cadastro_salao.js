document.addEventListener('DOMContentLoaded', function () {
    const cadastroSalaoForm = document.getElementById('cadastroSalaoForm');

    // Mapeamento das regiões para IDs
    const REGIOES = {
        "NORTE": 1,
        "SUL": 2,
        "LESTE": 3,
        "OESTE": 4
    };

    // Obtém o ID do dono da URL
    const urlParams = new URLSearchParams(window.location.search);
    const idDonoDaURL = urlParams.get('id_dono');

    if (!idDonoDaURL) {
        alert('Você precisa cadastrar um usuário dono primeiro');
        window.location.href = 'cadastro_usuario.html';
        return;
    }

    console.log('ID do Dono recebido na pagina de cadastro do salao:', idDonoDaURL);

    cadastroSalaoForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Obtenha o valor selecionado no dropdown
        const localizacaoSelecionada = document.getElementById('localizacao').value;

        //  Verifica se a região é valida
        if (!REGIOES[localizacaoSelecionada]) {
            alert('Selecione uma localização válida');
            return;
        }

        // Coleta dos dados do formulário
        const formData = {
            nome_salao: document.getElementById('nome_salao').value.trim(),
            telefone: document.getElementById('telefone').value.trim(),
            endereco: document.getElementById('endereco').value.trim(),
            numero_salao: document.getElementById('numero_salao').value.trim(),
            complemento_salao: document.getElementById('complemento_salao').value.trim(),
            localizacao: localizacaoSelecionada, // Envie a string da localização
            id_dono: Number(idDonoDaURL)
        };

        console.log('Dados sendo enviados (antes de stringify):', formData);

        // Envio dos dados para o servidor

        try {
            // 4. Envie os dados
            const response = await fetch('/cadastro_salao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json(); // A correção está aqui: usar await e .json() separadamente

            if (data.success) {
                alert('Salao Cadastrado com sucesso');
                window.location.href = `/home?id_dono=${idDonoDaURL}`;
            } else {
                alert('Erro ao cadastrar salão');
                console.error('Erro no cadastro do salão:', data);
            }

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro: ' + error.message);
        }
    });
});

// Função para exibir mensagens de erro
function formErrorResponse(inputId, message) {
    const errorElement = document.getElementById(inputId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}