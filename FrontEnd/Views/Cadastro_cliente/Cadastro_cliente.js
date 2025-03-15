function formatPhone(input) {
    let phone = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    phone = phone.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca o DDD entre parênteses
    phone = phone.replace(/(\d{5})(\d{4})$/, '$1-$2'); // Coloca o hífen entre o 5º e o 6º dígito
    input.value = phone;
}

document.getElementById("cadastroForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Impede o formulario de recarregar a pagina
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const region = document.getElementById("region").value

    if(password !== confirmPassword){
        alert("As senhas não coincidem");
        return;
    }

    try{
        const response = await fetch ("http://localhost:3000/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nome_cliente: name,
                email_cliente: email,
                telefone_cliente: phone,
                senha_cliente: password,
                região_cliente: region
                
            }),
        });

        const result = await response.json();
        if(response.ok){
            alert("Cadastro realizado com sucesso!");
        } else{
            alert(`Erro: ${result.message}`);
        }
    } catch (error){
        alert("Erro ao tentar se cadastrar. Tente novamente")
    }
})