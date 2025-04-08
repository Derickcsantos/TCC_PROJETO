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

        if (hasErrors){
            return:
        }

        if (!nomeCompleto.trim()) {
            formErrorResponse('nome_completo-error', 'Nome Completo é obrigatório');
            hasErrors = true;
        } else {
            document.getElementById('nome_completo-error').style.display = 'none';
        }
        if (!email.trim()) {
            formErrorResponse('email-error', 'Email é obrigatório');
            hasErrors = true;
        } else if (!isValidEmail(email)) {
            formErrorResponse('email-error', 'Email inválido');
            hasErrors = true;
        } else {
            document.getElementById('email-error').style.display = 'none';
        }

        if (!CPF.trim()) {
            formErrorResponse('CPF-error', 'CPF é obrigatório');
            hasErrors = true;
        } else if (!isValidCPF(CPF)) {
            formErrorResponse('CPF-error', 'CPF inválido');
            hasErrors = true;
        } else {
            document.getElementById('CPF-error').style.display = 'none';
        }

        if (!telefone.trim()) {
            formErrorResponse('telefone-error', 'Telefone é obrigatório');
            hasErrors = true;
        } else {
            document.getElementById('telefone-error').style.display = 'none';
        }

        if (!usuario.trim()) {
            formErrorResponse('usuario-error', 'Usuário é obrigatório');
            hasErrors = true;
        } else {
            document.getElementById('usuario-error').style.display = 'none';
        }

        if (!senha.trim()) {
            formErrorResponse('senha-error', 'Senha é obrigatória');
            hasErrors = true;
        } else if (senha.length < 6) {
            formErrorResponse('senha-error', 'Senha deve ter no mínimo 6 caracteres');
            hasErrors = true;
        } else {
            document.getElementById('senha-error').style.display = 'none';
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
                    window.location.href = `cadastro_salao.html?id_dono=${responseData.id_dono};`
                } else {
                    alert(`Erro no cadastro: ${responseData.error}`);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao tentar realizar o cadastro: ' + error.message);
            });
    });

    function formErrorResponse(inputId, response) {
        const errorElement = document.getElementById(inputId);
        errorElement.textContent = response;
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
