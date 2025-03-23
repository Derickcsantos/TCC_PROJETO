document.querySelector('.btn').addEventListener('click', async(event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch ('http://localhost:3000/loginC', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email, senhaHash: password}),
        });

        const data = await response.json();

        if (response.ok){
            // Login bem sucedido
            alert('Login realizado com sucesso')
            // Redirecione para outra página, se necessário
            // window.location.href = '/pagina-principal';
        } else {
            // Erro no login
            alert(`Erro no login: ${data.error}`)
        }
    } catch (error){{
        console.error('Erro:', error);
        alert('Ocorreu um erro ao tentar fazer login')
    }}
})