document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });

    // Modal de Login
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'block';
    });

    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });

    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });

    // Formulário de Login
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Aqui você pode adicionar a lógica de autenticação
        console.log('Login attempt:', email, password);
        alert('Login realizado com sucesso!');
        loginModal.style.display = 'none';
    });

    // Formulário de Cadastro
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        
        if (password !== confirm) {
            alert('As senhas não coincidem!');
            return;
        }
        
        // Aqui você pode adicionar a lógica de cadastro
        console.log('Registration:', name, email, password);
        alert('Cadastro realizado com sucesso! Agora você pode fazer login.');
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
    });

    // Smooth scrolling para links do menu
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Não aplicar smooth scroll para o link de login
            if (this.getAttribute('id') === 'login-btn' || this.getAttribute('id') === 'register-btn') {
                return;
            }
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Fechar menu mobile se estiver aberto
            navMenu.classList.remove('show');
        });
    });

    // Botões de agendamento
    const bookButtons = document.querySelectorAll('.btn-book');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceName = this.parentElement.querySelector('h3').textContent;
            alert(`Você está agendando: ${serviceName}\nEm breve implementaremos o sistema completo de agendamento!`);
        });
    });

    // Efeito de revelação ao rolar
    const fadeElements = document.querySelectorAll('.team-member, .service-card, .gallery-item');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Definir estado inicial
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Verificar ao carregar e ao rolar
    window.addEventListener('load', checkFade);
    window.addEventListener('scroll', checkFade);
});

// FrontEnd/Views/Home/home.js

// Este script será executado na página home.html
// A instância 'supabase' já estará disponível globalmente,
// pois home.html vai carregar '../js/supabaseClient.js' antes deste.

async function checkAuthAndRedirect() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error("Erro ao obter sessão Supabase:", error);
        alert("Ocorreu um erro na sessão. Faça login novamente.");
        // Caminho de Home/ para Login_cliente/
        window.location.href = '../Login_cliente/login_cliente.html'; // Redireciona para o login
        return;
    }

    if (!session) {
        console.log("Nenhuma sessão ativa encontrada. Redirecionando para o login.");
        // Caminho de Home/ para Login_cliente/
        window.location.href = '../Login_cliente/login_cliente.html'; // Redireciona para o login
    } else {
        console.log("Sessão ativa para o usuário:", session.user.email);
        // O usuário está logado, continue a carregar a página
        // Você pode atualizar a interface do usuário aqui, por exemplo:
        // document.getElementById('user-email').textContent = session.user.email;
    }
}

// Chama a função de verificação assim que o script é carregado
checkAuthAndRedirect();

// Lógica para o botão de Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Erro ao fazer logout:", error);
            alert("Erro ao fazer logout.");
        } else {
            alert("Logout realizado com sucesso!");
            // Caminho de Home/ para Login_cliente/
            window.location.href = '../Login_cliente/login_cliente.html'; // Redireciona para o login
        }
    });
}
