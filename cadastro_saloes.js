document.addEventListener("DOMContentLoaded", function () {
  const cadastroForm = document.getElementById("cadastroForm");

  cadastroForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // 1. Coletar os valores dos campos do formulário usando os IDs
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const CPF = document.getElementById("CPF").value; // Use 'CPF' para corresponder ao HTML
    const salonName = document.getElementById("salon-name").value;
    const username = document.getElementById("username").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const salonNumber = document.getElementById("salon-number").value;
    const complement = document.getElementById("complement").value;
    const salonPhone = document.getElementById("salon-phone").value;
    const region = document.getElementById("region").value;
    const password_dono = document.getElementById("password_dono").value;

    // 2. Criar o objeto de dados a serem enviados
    const data = {
      name: name,
      email: email,
      CPF: CPF, // Use 'CPF' para corresponder ao HTML e ao backend
      "salon-name": salonName, // Mantém a consistência com o HTML e backend
      username: username,
      phone: phone,
      address: address,
      "salon-number": salonNumber, // Mantém a consistência
      complement: complement,
      "salon-phone": salonPhone, // Mantém a consistência
      region: region,
      password_dono: password_dono,
    };

    // 3. Log dos dados antes do envio (para depuração)
    console.log("Dados a serem enviados:", data);

    // 4. Enviar a requisição para o servidor usando fetch
    fetch("/cadastro_salao", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Indica que estamos enviando JSON
      },
      body: JSON.stringify(data), // Converte o objeto JavaScript para JSON
    })
      .then((response) => {
        if (!response.ok) {
          // Se a resposta não for OK, lança um erro para ser capturado no catch
          throw new Error(
            `Erro na requisição: ${response.status} ${response.statusText}`
          );
        }
        return response.json(); // Tenta analisar o corpo da resposta como JSON
      })
      .then((responseData) => {
        // 5. Tratar a resposta do servidor
        if (responseData.message === "Salão/Usuário cadastrado com sucesso") {
          alert("Cadastro realizado com sucesso!");
          // Redirecionar para outra página, se necessário
          // window.location.href = '/login';
        } else {
          alert(`Erro no cadastro: ${responseData.error}`); // Exibe a mensagem de erro do servidor
        }
      })
      .catch((error) => {
        // 6. Tratar erros de rede ou erros na resposta do servidor
        console.error("Erro:", error);
        alert(
          "Ocorreu um erro ao tentar realizar o cadastro: " + error.message
        ); // Exibe mensagem de erro
      });
  });
});
