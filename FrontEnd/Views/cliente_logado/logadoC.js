import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Configurações do Supabase para o LADO DO CLIENTE (ANON_KEY / PUBLIC_ANON_KEY)
// Substitua pelas suas credenciais PÚBLICAS do Supabase!
const SUPABASE_URL = 'https://mxhwmpouoajvidghhevq.supabase.co'; // Sua URL do Supabase
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14aHdtcG91b2FqdmlkZ2hoZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NTI0ODEsImV4cCI6MjA1NzIyODQ4MX0.yPIQaaUTGiqz5LG6KJM43NL-8hIk6mgShsOpm8DEplM'; // Sua Chave Pública ANON do Supabase

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const menuIcon = document.querySelector('.menu-icon');
const menu = document.querySelector('.menu');
const menuItems = document.querySelectorAll('.menu li a');

// --- Lógica para Menu Responsivo (já existente) ---
// Abre e fecha o menu quando o ícone é clicado
menuIcon.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Fecha o menu quando qualquer item de menu é clicado
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menu.classList.remove('active');
    });
});

// Fecha o menu quando clicar fora do menu
document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
        menu.classList.remove('active');
    }
});

// --- Lógica para Dropdown (já existente) ---
document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdown = document.querySelector('.dropdown');
    const userEmailElement = document.getElementById('user-email'); // Supondo que você tenha um elemento para exibir o email
    const logoutButton = document.getElementById('logout-button'); // Supondo que você tenha um botão de logout

    // Verifica a sessão ao carregar a página
    async function checkUserSession() {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                console.log('Usuário logado:', user.email);
                // Exibe o email do usuário logado no dropdown ou em outro lugar
                if (userEmailElement) {
                    userEmailElement.textContent = user.email;
                }
            } else {
                console.log('Nenhum usuário logado. Exibindo alerta e redirecionando para login...');
                // === ALTERAÇÃO AQUI: ADICIONANDO O ALERT ANTES DO REDIRECIONAMENTO ===
                alert('Você precisa estar logado para acessar esta página. Por favor, faça login.');
                window.location.href = '/loginC';
            }
        } catch (error) {
            console.error('Erro ao verificar a sessão:', error.message);
            // === ALTERAÇÃO AQUI: ADICIONANDO O ALERT NO ERRO TAMBÉM ===
            alert('Ocorreu um erro ao verificar sua sessão. Por favor, faça login novamente.');
            window.location.href = '/loginC';
        }
    }

    // Chama a função de verificação de sessão assim que o DOM estiver carregado
    checkUserSession();

    // Event listener para o toggle do dropdown
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function(event) {
            event.preventDefault(); // Impede o comportamento padrão do link "#"
            dropdown.classList.toggle('show');
        });
    }


    // Fechar o dropdown se o usuário clicar fora dele
    window.addEventListener('click', function(event) {
        if (dropdown && dropdownToggle) { // Garante que os elementos existem
            if (!event.target.matches('.dropdown-toggle') && !dropdown.contains(event.target)) {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            }
        }
    });

    // --- Lógica para Logout ---
    if (logoutButton) {
        logoutButton.addEventListener('click', async (event) => {
            event.preventDefault(); // Impede o comportamento padrão do botão

            try {
                const { error } = await supabase.auth.signOut();

                if (error) {
                    console.error('Erro ao fazer logout:', error.message);
                    alert('Erro ao fazer logout: ' + error.message);
                } else {
                    console.log('Logout realizado com sucesso. Redirecionando para login...');
                    // Redireciona para a página de login após o logout
                    window.location.href = '/loginC';
                }
            } catch (error) {
                console.error('Erro inesperado durante o logout:', error.message);
                alert('Ocorreu um erro inesperado durante o logout.');
            }
        });
    }
});
