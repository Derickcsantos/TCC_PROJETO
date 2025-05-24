// FrontEnd/Views/Login_cliente/LogC.js

// Não precisamos mais das definições de SUPABASE_URL, SUPABASE_ANON_KEY e createClient aqui.
// A instância 'supabase' será fornecida globalmente por 'FrontEnd/Views/js/supabaseClient.js'.
// (Certifique-se de que 'supabaseClient.js' é carregado antes deste no HTML!)

document.querySelector('.btn').addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/loginC', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, senha: password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            if (data.userType === 'admin') {
                console.log('Login bem-sucedido para ADM - Redirecionando para adm.html');
                // Caminho relativo de LogC.js (em Login_cliente) para adm.html (em adm)
                window.location.href = '/adm';
            } else if (data.userType === 'cliente') {
                console.log('Login bem-sucedido para Cliente - Armazenando sessão e redirecionando para home.html');

                if (data.session) {
                    // Usa a instância global 'supabase' (do supabaseClient.js) para setar a sessão.
                    await supabase.auth.setSession(data.session);
                    console.log("Sessão do Supabase setada no frontend com sucesso.");
                } else {
                    console.warn("Login de cliente bem-sucedido, mas o objeto de sessão do Supabase não foi retornado pelo backend.");
                }
                // Caminho relativo de LogC.js (em Login_cliente) para home.html (em Home)
                window.location.href = '/';
            } else {
                console.warn('Tipo de usuário desconhecido retornado pelo servidor:', data.userType);
                alert('Login bem-sucedido, mas o tipo de usuário é desconhecido. Por favor, tente novamente.');
                window.location.href = '/'; // Volta para a própria página de login
            }
        } else {
            alert(`Erro no login: ${data.error || data.message || 'Ocorreu um erro desconhecido ao tentar fazer login.'}`);
            console.error('Detalhes do erro do backend:', data);
        }
    } catch (error) {
        console.error('Erro na requisição de login:', error);
        alert('Ocorreu um erro de conexão. Verifique sua rede ou tente novamente mais tarde.');
    }
});
