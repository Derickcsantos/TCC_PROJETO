function formatPhone(input) {
    let phone = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    phone = phone.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca o DDD entre parênteses
    phone = phone.replace(/(\d{5})(\d{4})$/, '$1-$2'); // Coloca o hífen entre o 5º e o 6º dígito
    input.value = phone;
}