document.addEventListener('DOMContentLoaded', () => {
    const clientesCountSpan = document.getElementById('clientes-count');
    const saloesCountSpan = document.getElementById('saloes-count');
    const usuariosCountSpan = document.getElementById('usuarios-count');

    async function fetchCounts() {
        try {
            const clientesResponse = await fetch('/api/clientes/count');
            const clientesData = await clientesResponse.json();
            clientesCountSpan.textContent = clientesData.count;

            const saloesResponse = await fetch('/api/saloes/count');
            const saloesData = await saloesResponse.json();
            saloesCountSpan.textContent = saloesData.count;

            const usuariosResponse = await fetch('/api/usuarios/count');
            const usuariosData = await usuariosResponse.json();
            usuariosCountSpan.textContent = usuariosData.count;

        } catch (error) {
            console.error('Erro ao buscar contagens:', error);
            // Lógica para exibir uma mensagem de erro no dashboard, se necessário
        }
    }

    fetchCounts(); // Chama a função para buscar as contagens quando a página carregar
});
