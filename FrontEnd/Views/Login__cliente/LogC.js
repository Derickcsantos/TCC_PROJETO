// FrontEnd/Views/Login_cliente/LogC.js

// Importa createClient diretamente do pacote Supabase JS via CDN como um módulo ES6
// O '+esm' no final da URL é CRUCIAL para que o navegador a trate como um módulo.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://mxhwmpouoajvidghhevq.supabase.co';
// Use a ANON_KEY real do seu painel Supabase (Project Settings -> API)
// CUIDADO: Não use sua SERVICE_ROLE key aqui!
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14aHdtcG91b2FqdmlkZ2hoZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NTI0ODEsImV4cCI6MjA1NzIyODQ4MX0.yPIQaaUTGiqz5LG6KJM43NL-8hIk6mgShsOpm8DEplM';

// Cria a instância do cliente Supabase usando o createClient importado
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
                window.location.href = '/adm';
            } else if (data.userType === 'cliente') {
                console.log('Login bem-sucedido para Cliente - Armazenando sessão e redirecionando para home.html');

                if (data.session) {
                    // Agora 'supabase' é a instância importada e está disponível
                    await supabase.auth.setSession(data.session);
                    console.log("Sessão do Supabase setada no frontend com sucesso.");
                } else {
                    console.warn("Login de cliente bem-sucedido, mas o objeto de sessão do Supabase não foi retornado pelo backend.");
                }
                window.location.href = '/'; // Redireciona APÓS setar a sessão (ou a falta dela)
            } else {
                console.warn('Tipo de usuário desconhecido retornado pelo servidor:', data.userType);
                alert('Login bem-sucedido, mas o tipo de usuário é desconhecido. Por favor, tente novamente.');
                window.location.href = '/';
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
