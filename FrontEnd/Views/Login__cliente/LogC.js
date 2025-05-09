document.querySelector(".btn").addEventListener("click", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/loginC", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, senha: password }),
      redirect: "follow", // Explicitamente instrui o fetch a seguir redirecionamentos
    });

    if (response.ok) {
      console.log("Login bem-sucedido - Redirecionando no frontend...");
      window.location.href = "/adm.html"; // Força o redirecionamento no frontend
    } else {
      const data = await response.json();
      alert(`Erro no login: ${data.error}`);
    }
  } catch (error) {
    {
      console.error("Erro:", error);
      alert("Ocorreu um erro ao tentar fazer login");
    }
  }
});
