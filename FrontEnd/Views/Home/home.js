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
  
    // window.addEventListener('click', function(e) {
    //     if (e.target === loginModal) loginModal.style.display = 'none';
    //     if (e.target === registerModal) registerModal.style.display = 'none';
    //     if (e.target === businessRegisterModal) businessRegisterModal.style.display = 'none';
    //     if (e.target === bookingModal) bookingModal.style.display = 'none';
    // });
  
    // ============ FORMULÁRIOS ============
    // Login
    // const loginForm = document.getElementById('login-form');
    // loginForm.addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     const email = document.getElementById('email').value;
    //     const password = document.getElementById('password').value;
        
    //     // Simulação de autenticação
    //     console.log('Login attempt:', email, password);
    //     alert('Login realizado com sucesso!');
    //     loginModal.style.display = 'none';
        
    //     // Atualizar UI para usuário logado
    //     updateUserUI(true);
    // });
  
    // // Cadastro Cliente
    // const registerForm = document.getElementById('register-form');
    // registerForm.addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     const name = document.getElementById('reg-name').value;
    //     const email = document.getElementById('reg-email').value;
    //     const phone = document.getElementById('reg-phone').value;
    //     const password = document.getElementById('reg-password').value;
    //     const confirm = document.getElementById('reg-confirm').value;
        
    //     if (password !== confirm) {
    //         alert('As senhas não coincidem!');
    //         return;
    //     }
        
    //     console.log('Client registration:', { name, email, phone, password });
    //     alert('Cadastro realizado com sucesso! Agora você pode fazer login.');
    //     registerModal.style.display = 'none';
    //     loginModal.style.display = 'block';
    // });
  
    // // Cadastro Estabelecimento
    // const businessRegisterForm = document.getElementById('business-register-form');
    // businessRegisterForm.addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     const businessName = document.getElementById('business-name').value;
    //     const email = document.getElementById('business-email').value;
    //     const phone = document.getElementById('business-phone').value;
    //     const address = document.getElementById('business-address').value;
    //     const businessType = document.getElementById('business-type').value;
        
    //     console.log('Business registration:', { businessName, email, phone, address, businessType });
    //     alert('Cadastro enviado com sucesso! Nossa equipe entrará em contato em breve.');
    //     businessRegisterModal.style.display = 'none';
    // });
  
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
  
    // // Função para iniciar o processo de agendamento
    // function startBookingProcess(step = 0) {
    //     // Resetar seleções se começando do zero
    //     if (step === 0) {
    //         selectedService = null;
    //         selectedPartner = null;
    //         selectedDateTime = null;
    //     }
        
    //     // Mostrar modal
    //     bookingModal.style.display = 'block';
        
    //     // Ir para o passo apropriado
    //     if (step === 0) {
    //         loadServicesStep();
    //     } else if (step === 1) {
    //         goToStep(1);
    //     } else if (step === 2) {
    //         goToStep(2);
    //     }
    // }
  
    // // Função para navegar entre passos
    // function goToStep(stepNumber) {
    //     // Esconder todos os passos
    //     document.querySelectorAll('.booking-step').forEach(step => {
    //         step.style.display = 'none';
    //     });
        
    //     // Atualizar indicadores de passo
    //     document.querySelectorAll('.step').forEach((step, index) => {
    //         if (index + 1 <= stepNumber) {
    //             step.classList.add('active');
    //         } else {
    //             step.classList.remove('active');
    //         }
    //     });
        
    //     // Mostrar passo atual
    //     const currentStep = document.getElementById(`booking-step-${stepNumber}`);
    //     currentStep.style.display = 'block';
        
    //     // Carregar conteúdo do passo se necessário
    //     if (stepNumber === 1 && !currentStep.hasChildNodes()) {
    //         loadServicesStep();
    //     } else if (stepNumber === 2) {
    //         loadPartnersStep();
    //     } else if (stepNumber === 3) {
    //         loadDateTimeStep();
    //     } else if (stepNumber === 4) {
    //         loadConfirmationStep();
    //     }
    // }
  
    // // Passo 1 - Selecionar Serviço
    // function loadServicesStep() {
    //     const step1 = document.getElementById('booking-step-1');
    //     step1.innerHTML = '<h3>Selecione o Serviço</h3>';
        
    //     // Filtros de tipo
    //     const filterButtons = document.querySelectorAll('.service-filters .filter-btn');
    //     filterButtons.forEach(button => {
    //         button.addEventListener('click', function() {
    //             filterButtons.forEach(btn => btn.classList.remove('active'));
    //             this.classList.add('active');
                
    //             const filterType = this.dataset.type;
    //             renderServices(filterType);
    //         });
    //     });
        
    //     // Renderizar serviços inicialmente
    //     renderServices('all');
        
    //     // Botão de próximo
    //     const nextButton = document.createElement('button');
    //     nextButton.id = 'next-step';
    //     nextButton.className = 'btn';
    //     nextButton.textContent = 'Próximo';
    //     nextButton.disabled = true;
    //     nextButton.addEventListener('click', () => goToStep(2));
    //     step1.appendChild(nextButton);
    // }
  
    // function renderServices(filterType) {
    //     const step1 = document.getElementById('booking-step-1');
    //     const servicesContainer = document.createElement('div');
    //     servicesContainer.className = 'services-container';
        
    //     // Limpar serviços existentes
    //     const existingContainer = step1.querySelector('.services-container');
    //     if (existingContainer) existingContainer.remove();
        
    //     // Filtrar serviços
    //     const filteredServices = filterType === 'all' 
    //         ? servicesData 
    //         : servicesData.filter(s => s.type === filterType);
        
    //     // Adicionar serviços filtrados
    //     filteredServices.forEach(service => {
    //         const serviceEl = document.createElement('div');
    //         serviceEl.className = 'service-option';
    //         serviceEl.dataset.serviceId = service.id;
    //         serviceEl.innerHTML = `
    //             <div class="service-icon">
    //                 <i class="${getServiceIcon(service.type)}"></i>
    //             </div>
    //             <div class="service-info">
    //                 <h4>${service.name}</h4>
    //                 <p class="duration"><i class="fas fa-clock"></i> ${service.duration} min</p>
    //                 <p class="price">R$ ${service.price.toFixed(2)}</p>
    //             </div>
    //         `;
            
    //         serviceEl.addEventListener('click', function() {
    //             selectedService = service;
    //             document.querySelectorAll('.service-option').forEach(el => el.classList.remove('selected'));
    //             this.classList.add('selected');
    //             document.getElementById('next-step').disabled = false;
    //         });
            
    //         servicesContainer.appendChild(serviceEl);
    //     });
        
    //     step1.insertBefore(servicesContainer, step1.lastElementChild);
    // }
  
    // function getServiceIcon(serviceType) {
    //     switch(serviceType) {
    //         case 'barbershop': return 'fas fa-cut';
    //         case 'salon': return 'fas fa-spa';
    //         case 'spa': return 'fas fa-hot-tub';
    //         default: return 'fas fa-scissors';
    //     }
    // }
  
    // // Passo 2 - Selecionar Estabelecimento
    // function loadPartnersStep() {
    //     const step2 = document.getElementById('booking-step-2');
    //     step2.innerHTML = '<h3>Escolha o Estabelecimento</h3>';
        
    //     // Filtrar parceiros que oferecem o serviço selecionado
    //     const filteredPartners = partnersData.filter(partner => 
    //         partner.services.includes(selectedService.id)
    //     );
        
    //     if (filteredPartners.length === 0) {
    //         step2.innerHTML += '<p>Nenhum estabelecimento encontrado para este serviço.</p>';
    //     } else {
    //         filteredPartners.forEach(partner => {
    //             const partnerEl = document.createElement('div');
    //             partnerEl.className = 'partner-option';
    //             partnerEl.dataset.partnerId = partner.id;
    //             partnerEl.innerHTML = `
    //                 <img src="${partner.image}" alt="${partner.name}" class="partner-img">
    //                 <div class="partner-details">
    //                     <h4>${partner.name}</h4>
    //                     <div class="rating">
    //                         <i class="fas fa-star"></i> ${partner.rating} (${partner.reviews} avaliações)
    //                     </div>
    //                     <p><i class="fas fa-map-marker-alt"></i> ${partner.address}</p>
    //                 </div>
    //             `;
                
    //             partnerEl.addEventListener('click', function() {
    //                 selectedPartner = partner;
    //                 document.querySelectorAll('.partner-option').forEach(el => el.classList.remove('selected'));
    //                 this.classList.add('selected');
    //                 document.getElementById('next-step-2').disabled = false;
    //             });
                
    //             step2.appendChild(partnerEl);
    //         });
    //     }
        
    //     // Botões de navegação
    //     const buttonContainer = document.createElement('div');
    //     buttonContainer.className = 'booking-buttons';
        
    //     const backButton = document.createElement('button');
    //     backButton.className = 'btn btn-outline';
    //     backButton.textContent = 'Voltar';
    //     backButton.addEventListener('click', () => goToStep(1));
        
    //     const nextButton = document.createElement('button');
    //     nextButton.id = 'next-step-2';
    //     nextButton.className = 'btn';
    //     nextButton.textContent = 'Próximo';
    //     nextButton.disabled = true;
    //     nextButton.addEventListener('click', () => goToStep(3));
        
    //     buttonContainer.appendChild(backButton);
    //     buttonContainer.appendChild(nextButton);
    //     step2.appendChild(buttonContainer);
    // }
  
    // // Passo 3 - Selecionar Data e Hora
    // function loadDateTimeStep() {
    //     const step3 = document.getElementById('booking-step-3');
    //     step3.innerHTML = `
    //         <h3>Escolha a Data e Hora</h3>
    //         <div class="date-selection">
    //             <h4>Selecione a Data</h4>
    //             <div id="calendar"></div>
    //         </div>
    //         <div class="time-selection">
    //             <h4>Horários Disponíveis</h4>
    //             <div id="time-slots" class="time-slots"></div>
    //         </div>
    //     `;
        
    //     // Simulação de calendário (em produção usar uma biblioteca como Flatpickr)
    //     initCalendar();
        
    //     // Botões de navegação
    //     const buttonContainer = document.createElement('div');
    //     buttonContainer.className = 'booking-buttons';
        
    //     const backButton = document.createElement('button');
    //     backButton.className = 'btn btn-outline';
    //     backButton.textContent = 'Voltar';
    //     backButton.addEventListener('click', () => goToStep(2));
        
    //     const nextButton = document.createElement('button');
    //     nextButton.id = 'next-step-3';
    //     nextButton.className = 'btn';
    //     nextButton.textContent = 'Próximo';
    //     nextButton.disabled = true;
    //     nextButton.addEventListener('click', () => goToStep(4));
        
    //     buttonContainer.appendChild(backButton);
    //     buttonContainer.appendChild(nextButton);
    //     step3.appendChild(buttonContainer);
    // }
  
    // function initCalendar() {
    //     const calendarEl = document.getElementById('calendar');
        
    //     // Simulação simples - em produção usar uma biblioteca de calendário
    //     calendarEl.innerHTML = `
    //         <div class="calendar-header">
    //             <button id="prev-week"><i class="fas fa-chevron-left"></i></button>
    //             <h5>Próximos 7 dias</h5>
    //             <button id="next-week"><i class="fas fa-chevron-right"></i></button>
    //         </div>
    //         <div class="calendar-days" id="calendar-days"></div>
    //     `;
        
    //     // Gerar dias (simulação)
    //     const daysContainer = document.getElementById('calendar-days');
    //     const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    //     const today = new Date();
        
    //     for (let i = 0; i < 7; i++) {
    //         const date = new Date();
    //         date.setDate(today.getDate() + i);
            
    //         const dayEl = document.createElement('div');
    //         dayEl.className = 'calendar-day';
    //         if (i === 0) dayEl.classList.add('selected');
            
    //         dayEl.innerHTML = `
    //             <div class="day-name">${days[date.getDay()]}</div>
    //             <div class="day-number">${date.getDate()}</div>
    //         `;
            
    //         dayEl.addEventListener('click', function() {
    //             document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
    //             this.classList.add('selected');
    //             loadTimeSlots(date);
    //         });
            
    //         daysContainer.appendChild(dayEl);
    //     }
        
    //     // Carregar horários para hoje inicialmente
    //     loadTimeSlots(today);
        
    //     // Navegação do calendário (simulada)
    //     document.getElementById('prev-week').addEventListener('click', () => {
    //         alert('Na versão completa, isso carregaria a semana anterior');
    //     });
        
    //     document.getElementById('next-week').addEventListener('click', () => {
    //         alert('Na versão completa, isso carregaria a próxima semana');
    //     });
    // }
  
    // function loadTimeSlots(date) {
    //     const timeSlotsEl = document.getElementById('time-slots');
    //     timeSlotsEl.innerHTML = '';
        
    //     // Simulação de horários disponíveis
    //     const availableSlots = [
    //         '09:00', '10:30', '12:00', '14:00', '15:30', '17:00'
    //     ];
        
    //     availableSlots.forEach(slot => {
    //         const slotEl = document.createElement('div');
    //         slotEl.className = 'time-slot';
    //         slotEl.textContent = slot;
            
    //         slotEl.addEventListener('click', function() {
    //             document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
    //             this.classList.add('selected');
    //             selectedDateTime = `${formatDate(date)} às ${slot}`;
    //             document.getElementById('next-step-3').disabled = false;
    //         });
            
    //         timeSlotsEl.appendChild(slotEl);
    //     });
    // }
  
    // function formatDate(date) {
    //     const options = { weekday: 'long', day: 'numeric', month: 'long' };
    //     return date.toLocaleDateString('pt-BR', options);
    // }
  
    // // Passo 4 - Confirmação
    // function loadConfirmationStep() {
    //     const step4 = document.getElementById('booking-step-4');
    //     step4.innerHTML = '<h3>Confirme seu Agendamento</h3>';
        
    //     const summaryEl = document.createElement('div');
    //     summaryEl.className = 'booking-summary';
    //     summaryEl.innerHTML = `
    //         <div class="summary-item">
    //             <h4>Serviço:</h4>
    //             <p>${selectedService.name}</p>
    //         </div>
    //         <div class="summary-item">
    //             <h4>Estabelecimento:</h4>
    //             <p>${selectedPartner.name}</p>
    //         </div>
    //         <div class="summary-item">
    //             <h4>Data/Hora:</h4>
    //             <p>${selectedDateTime}</p>
    //         </div>
    //         <div class="summary-item">
    //             <h4>Duração:</h4>
    //             <p>${selectedService.duration} minutos</p>
    //         </div>
    //         <div class="summary-item total">
    //             <h4>Total:</h4>
    //             <p>R$ ${selectedService.price.toFixed(2)}</p>
    //         </div>
    //     `;
        
    //     step4.appendChild(summaryEl);
        
    //     // Botões de navegação
    //     const buttonContainer = document.createElement('div');
    //     buttonContainer.className = 'booking-buttons';
        
    //     const backButton = document.createElement('button');
    //     backButton.className = 'btn btn-outline';
    //     backButton.textContent = 'Voltar';
    //     backButton.addEventListener('click', () => goToStep(3));
        
    //     const confirmButton = document.createElement('button');
    //     confirmButton.id = 'confirm-booking';
    //     confirmButton.className = 'btn';
    //     confirmButton.textContent = 'Confirmar Agendamento';
    //     confirmButton.addEventListener('click', confirmBooking);
        
    //     buttonContainer.appendChild(backButton);
    //     buttonContainer.appendChild(confirmButton);
    //     step4.appendChild(buttonContainer);
    // }
  
    // function confirmBooking() {
    //     // Simulação de envio para o servidor
    //     console.log('Booking confirmed:', {
    //         service: selectedService,
    //         partner: selectedPartner,
    //         dateTime: selectedDateTime
    //     });
        
    //     // Feedback para o usuário
    //     alert(`Agendamento confirmado!\n\n${selectedService.name} na ${selectedPartner.name}\n${selectedDateTime}\n\nObrigado!`);
        
    //     // Fechar modal e resetar
    //     bookingModal.style.display = 'none';
    //     selectedService = null;
    //     selectedPartner = null;
    //     selectedDateTime = null;
        
    //     // Atualizar UI (ex: mostrar agendamentos do usuário)
    // }
  
    // // ============ FILTROS ============
    // // Filtro da galeria
    // document.querySelectorAll('.gallery-filter .filter-btn').forEach(button => {
    //     button.addEventListener('click', function() {
    //         document.querySelectorAll('.gallery-filter .filter-btn').forEach(btn => {
    //             btn.classList.remove('active');
    //         });
    //         this.classList.add('active');
            
    //         const filter = this.dataset.filter;
    //         filterGallery(filter);
    //     });
    // });
  
    // function filterGallery(filter) {
    //     const galleryItems = document.querySelectorAll('.gallery-item');
        
    //     galleryItems.forEach(item => {
    //         if (filter === 'all' || item.dataset.category === filter) {
    //             item.style.display = 'block';
    //         } else {
    //             item.style.display = 'none';
    //         }
    //     });
    // }
  
    // // ============ FUNÇÕES AUXILIARES ============
    // function isLoggedIn() {
    //     // Simulação - em produção verificar token de autenticação
    //     return false;
    // }
  
    // function updateUserUI(loggedIn) {
    //     if (loggedIn) {
    //         loginBtn.innerHTML = '<i class="fas fa-user"></i> Minha Conta';
    //         // Adicionar outros elementos de UI para usuário logado
    //     } else {
    //         loginBtn.innerHTML = '<i class="fas fa-user"></i> Login';
    //     }
    // }
  
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
  
//   // ============ SUPABASE (EXEMPLO DE INTEGRAÇÃO) ============
//   // Configuração do Supabase (substitua com suas credenciais)
//   const supabaseUrl = 'SUA_URL_SUPABASE';
//   const supabaseKey = 'SUA_CHAVE_SUPABASE';
//   const supabase = supabase.createClient(supabaseUrl, supabaseKey);
  
//   async function checkAuthAndRedirect() {
//     const { data: { session }, error } = await supabase.auth.getSession();
  
//     if (error) {
//         console.error("Erro ao obter sessão:", error);
//         window.location.href = '../Login_cliente/login_cliente.html';
//         return;
//     }
  
//     if (!session) {
//         console.log("Nenhuma sessão ativa encontrada.");
//         window.location.href = '../Login_cliente/login_cliente.html';
//     } else {
//         console.log("Usuário logado:", session.user.email);
//         // Atualizar UI para usuário logado
//     }
//   }
  
  // Verificar autenticação ao carregar
//   checkAuthAndRedirect();
  
//   // Logout
//   const logoutBtn = document.getElementById('logout-btn');
//   if (logoutBtn) {
//     logoutBtn.addEventListener('click', async () => {
//         const { error } = await supabase.auth.signOut();
//         if (error) {
//             console.error("Erro ao fazer logout:", error);
//         } else {
//             window.location.href = '../Login_cliente/login_cliente.html';
//         }
//     });
//   }
