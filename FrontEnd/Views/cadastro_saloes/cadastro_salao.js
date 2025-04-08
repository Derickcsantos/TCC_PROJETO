document.addEventListener('DOMContentLoaded', function () {
    const cadastroForm = document.getElementById('cadastroForm');

    cadastroForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const CPF = document.getElementById('CPF').value;
        const salonName = document.getElementById('salon-name').value;
        const username = document.getElementById('username').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const salonNumber = document.getElementById('salon-number').value;
        const complement = document.getElementById('complement').value;
        const salonPhone = document.getElementById('salon-phone').value;
        const region = document.getElementById('region').value;
        const password_dono = document.getElementById('password_dono').value;

        let hasErrors = false;

        if (!name.trim()) {
            formErrorResponse('name-error', 'Nome é obrigatório');
            hasErrors = true;
        } else {
            document.getElementById('name-error').style.display = 'none';
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

        if (!salonName.trim()) {
            formErrorResponse('salon-name-error', 'Nome do Salão é obrigatório');
            hasErrors = true;
        } else {
            document.getElementById('salon-name-error').style.display = 'none';
        }

        if (!username.trim()) {
            formErrorResponse('username-error', 'Nome de Usuário é obrigatório');
            hasErrors = true;
        } else {
            document.getElementById('username-error').style.display = 'none';
        }

        if (!phone.trim()) {
            formErrorResponse('phone-error', 'Telefone é obrigatório');
            hasErrors = true;
        } else {
            document.getElementById('phone-error').style.display = 'none';
        }

        if (!address.trim()) {
            formErrorResponse('address-error', 'Endereço é obrigatório');
            hasErrors = true;
        } else {
            document.getElementById('address-error').style.display = 'none';
        }

        if (!salonNumber.trim()) {
            formErrorResponse('salon-number-error', 'Número do Salão é obrigatório');
            hasErrors = true;
        } else {
            document.getElementById('salon-number-error').style.display = 'none';
        }

        if (!salonPhone.trim()) {
            formErrorResponse('salon-phone-error', 'Telefone do Salão é obrigatório');
            hasErrors = true;
        } else {
            document.getElementById('salon-phone-error').style.display = 'none';
        }

        if (!region.trim()) {
            formErrorResponse('region-error', 'Região é obrigatória');
            hasErrors = true;
        } else {
            document.getElementById('region-error').style.display = 'none';
        }

        if (!password_dono.trim()) {
            formErrorResponse('password_dono-error', 'Senha é obrigatória');
            hasErrors = true;
        } else if (password_dono.length < 6) {
            formErrorResponse('password_dono-error', 'Senha deve ter no mínimo 6 caracteres');
            hasErrors = true;
        } else {
            document.getElementById('password_dono-error').style.display = 'none';
        }

        if (hasErrors) {
            return;
        }

        const data = {
            name: name,
            email: email,
            CPF: CPF,
            "salon-name": salonName,
            username: username,
            phone: phone,
            address: address,
            "salon-number": salonNumber,
            complement: complement,
            "salon-phone": salonPhone,
            region: region,
            password_dono: password_dono,
        };

        console.log('Dados a serem enviados:', data);

        fetch('/cadastro_salao', {
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
                if (responseData.message === 'Salão/Usuário cadastrado com sucesso') {
                    alert('Cadastro realizado com sucesso!');
                    cadastroForm.reset();
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