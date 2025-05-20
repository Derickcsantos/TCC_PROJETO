const menuIcon = document.querySelector('.menu-icon');
const menu = document.querySelector('.menu');
const menuItems = document.querySelectorAll('.menu li a');


// Abre e fecha o menu quando o ícone é clicado
menuIcon.addEventListener('click', () => {
    menu.classList.toggle('active');
});


//Menu dropdown
document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdown = document.querySelector('.dropdown');

    dropdownToggle.addEventListener('click', function(event) {
        event.preventDefault(); // Impede o comportamento padrão do link "#"
        dropdown.classList.toggle('show');
    });

    // Fechar o dropdown se o usuário clicar fora dele
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.dropdown-toggle') && !event.target.matches('.dropdown-menu *')) {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    });
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
