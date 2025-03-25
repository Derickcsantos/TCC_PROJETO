const menuIcon = document.querySelector('.menu-icon');
const menu = document.querySelector('.menu');
const menuItems = document.querySelectorAll('.menu li a');


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