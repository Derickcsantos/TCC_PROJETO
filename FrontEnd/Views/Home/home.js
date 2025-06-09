document.addEventListener('DOMContentLoaded', function() {
    // ============ MENU MOBILE ============
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('show');
        this.querySelector('i').classList.toggle('fa-times');
        this.querySelector('i').classList.toggle('fa-bars');
    });
  
    // ============ MODAIS ============
    // const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const businessRegisterBtn = document.getElementById('business-register-btn');
    // const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const businessRegisterModal = document.getElementById('business-register-modal');
    const bookingModal = document.getElementById('booking-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const partner = document.getElementById('partner-btn')
  
    // Abrir modais
    // loginBtn.addEventListener('click', function(e) {
    //     e.preventDefault();
    //     loginModal.style.display = 'block';
    // });
    // Acessar página de login do cliente
        document.getElementById('login-btn').addEventListener('click', function(e) {
        e.preventDefault(); // Evita o comportamento padrão do link
        window.location.href = '/loginC'; // Redireciona para a rota
        });

    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    });
  
    businessRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        businessRegisterModal.style.display = 'block';
    });
  
    // Fechar modais
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
            businessRegisterModal.style.display = 'none';
            bookingModal.style.display = 'none';
        });
    });


    // Enviar cliente para o cadastro de dono de salão 

    document.getElementById('partner-btn').addEventListener('click', function(e) {
    e.preventDefault(); // Evita o comportamento padrão do link
    window.location.href = '/cadastro_usuario'; // Redireciona para a rota
  });
  
  
    // ============ SISTEMA DE AGENDAMENTO ============
    // Dados mockados (numa aplicação real viriam de uma API)
    const servicesData = [
        { id: 1, name: "Corte de Cabelo", duration: 48, price: 64.55, type: "barbershop" },
        { id: 2, name: "Sobrancelha", duration: 5, price: 19.50, type: "barbershop" },
        { id: 3, name: "Barba", duration: 70, price: 65.43, type: "barbershop" },
        { id: 4, name: "Hidratação Capilar", duration: 60, price: 80.00, type: "salon" },
        { id: 5, name: "Massagem Relaxante", duration: 50, price: 120.00, type: "spa" }
    ];
  
    const partnersData = [
        { 
            id: 1, 
            name: "Barbearia Vintage", 
            address: "Av. Paulista, 1000 - SP", 
            rating: 4.9, 
            reviews: 127,
            services: [1, 2, 3],
            image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        { 
            id: 2, 
            name: "The King's Barber", 
            address: "Rua Oscar Freire, 200 - SP", 
            rating: 5.0, 
            reviews: 89,
            services: [1, 3],
            image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        { 
            id: 3, 
            name: "Studio Hair", 
            address: "Rua Augusta, 500 - SP", 
            rating: 4.7, 
            reviews: 64,
            services: [1, 4],
            image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
    ];
  
    // Variáveis para armazenar a seleção do usuário
    let selectedService = null;
    let selectedPartner = null;
    let selectedDateTime = null;
  
    // Inicializar botões de agendamento
    document.querySelectorAll('.btn-book').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Se não estiver logado, redirecionar para login
            if (!isLoggedIn()) {
                loginModal.style.display = 'block';
                return;
            }
            
            // Se for um botão "Agendar" genérico
            if (!this.dataset.serviceId) {
                startBookingProcess();
            } else {
                // Se for um botão para agendar serviço específico
                const serviceId = parseInt(this.dataset.serviceId);
                selectedService = servicesData.find(s => s.id === serviceId);
                startBookingProcess(1);
            }
        });
    });

    // ============ SCROLL SUAVE ============
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Não aplicar para links de login/cadastro
            if (this.id === 'login-btn' || this.id === 'register-btn' || this.id === 'business-register-btn') {
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
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });
  
    // ============ ANIMAÇÕES AO ROLAR ============
    const fadeElements = document.querySelectorAll('.feature-card, .partner-card, .service-card, .gallery-item, .testimonial-card');
    
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
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Verificar ao carregar e ao rolar
    window.addEventListener('load', checkFade);
    window.addEventListener('scroll', checkFade);
  
    // ============ NEWSLETTER ============
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulação de cadastro
            console.log('Newsletter subscription:', email);
            alert('Obrigado por assinar nossa newsletter!');
            this.reset();
        });
    }
  });
  
