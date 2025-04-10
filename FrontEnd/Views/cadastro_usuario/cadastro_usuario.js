document.addEventListener('DOMContentLoaded', function () {
    const cadastroForm = document.getElementById('cadastroForm');

    cadastroForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const nomeCompleto = document.getElementById('nome_completo').value;
        const email = document.getElementById('email').value;
        const CPF = document.getElementById('CPF').value;
        const telefone = document.getElementById('telefone').value;
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;

        let hasErrors = false;

        const campos = [
            { nome: 'nome_completo', valor: nomeCompleto, mensagem: 'Nome Completo é obrigatório' },
            { nome: 'email', valor: email, mensagem: 'Email é obrigatório' },
            { nome: 'CPF', valor: CPF, mensagem: 'CPF é obrigatório' },
            { nome: 'telefone', valor: telefone, mensagem: 'Telefone é obrigatório' },
            { nome: 'usuario', valor: usuario, mensagem: 'Usuário é obrigatório' },
            { nome: 'senha', valor: senha, mensagem: 'Senha é obrigatória' },
        ];

        campos.forEach(campo => {
            if (!campo.valor.trim()) {
                formErrorResponse(`${campo.nome}-error`, campo.mensagem);
                hasErrors = true;
            } else {
                document.getElementById(`${campo.nome}-error`).style.display = 'none';
            }
        });

        if (email && !isValidEmail(email)) {
            formErrorResponse('email-error', 'Email inválido');
            hasErrors = true;
        }
        if (CPF && !isValidCPF(CPF)) {
            formErrorResponse('CPF-error', 'CPF inválido');
            hasErrors = true;
        }
        if (senha && senha.length < 6) {
            formErrorResponse('senha-error', 'Senha deve ter no mínimo 6 caracteres');
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }

        const data = {
            nome_completo: nomeCompleto,
            email: email,
            CPF: CPF,
            telefone: telefone,
            usuario: usuario,
            senha: senha,
        };

        console.log('Dados a serem enviados:', data);

        fetch('/cadastro_usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(responseData => {
                if (responseData.message === 'Usuário dono cadastrado com sucesso') {
                    alert('Cadastro realizado com sucesso!');
                    window.location.href = `cadastro_salao.html?id_dono=${responseData.id_dono}`;
                } else {
                    alert(`Erro no cadastro: ${responseData.error}`);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao tentar realizar o cadastro: ' + error.message);
            });
    });

    function formErrorResponse(inputId, mensagem) {
        const errorElement = document.getElementById(inputId);
        errorElement.textContent = mensagem;
        errorElement.style.display = 'block';
    }

    function isValidEmail(email) {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailRegex.test(email);
    }

    function isValidCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11) return false;
        if (/^(\d)\1+$/.test(cpf)) return false;
        let sum = 0;
        for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
        let remainder = 11 - (sum % 11);
        let digit1 = remainder >= 10 ? 0 : remainder;
        sum = 0;
        for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
        remainder = 11 - (sum % 11);
        let digit2 = remainder >= 10 ? 0 : remainder;
        return digit1 === parseInt(cpf.charAt(9)) && digit2 === parseInt(cpf.charAt(10));
    }
});