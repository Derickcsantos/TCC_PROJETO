document.addEventListener('DOMContentLoaded', () => {
    const dashboardContent = document.getElementById('dashboard-content');
    const clientesContent = document.getElementById('clientes-content');
    const clientesLink = document.querySelector('.sidebar-menu a[href="#clientes"]').parentElement;
    const clientesTableBody = document.getElementById('clientes-table-body');
    const addClienteBtn = document.getElementById('add-cliente-btn');
    const clienteModalEl = document.getElementById('clienteModal'); // Renomeei para evitar sombra
    const modalTitle = document.getElementById('modalTitle');
    const clienteForm = document.getElementById('clienteForm');
    const clienteIdInput = document.getElementById('clienteId');
    const saveClienteBtn = document.getElementById('saveClienteBtn');

    const clientesCountSpan = document.getElementById('clientes-count');
    const saloesCountSpan = document.getElementById('saloes-count');
    const usuariosCountSpan = document.getElementById('usuarios-count');

    let clienteModal; // Declarei fora para poder usar no escopo correto

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

    // Função para buscar e exibir a lista de clientes
    async function fetchClientes() {
        try {
            const response = await fetch('/api/clientes');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const clientes = await response.json();
            displayClientes(clientes);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            // Exibir mensagem de erro na tela, se necessário
        }
    }

    // Função para exibir os clientes na tabela
    function displayClientes(clientes) {
        clientesTableBody.innerHTML = ''; // Limpa a tabela
        clientes.forEach(cliente => {
            const row = clientesTableBody.insertRow();
            row.insertCell().textContent = cliente.id_cliente;
            row.insertCell().textContent = cliente.nome_cliente;
            row.insertCell().textContent = cliente.email_cliente;
            row.insertCell().textContent = cliente.telefone_cliente || '';
            row.insertCell().textContent = cliente.região_cliente || '';
            row.insertCell().textContent = new Date(cliente.data_cadastro).toLocaleDateString();
            const actionsCell = row.insertCell();
            actionsCell.innerHTML = `
                <button class="btn btn-sm btn-primary edit-btn" data-id="${cliente.id_cliente}"><i class="fas fa-edit"></i> Editar</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${cliente.id_cliente}"><i class="fas fa-trash-alt"></i> Deletar</button>
            `;
        });

        // Adiciona event listeners aos botões de editar e deletar após a tabela ser carregada
        addEventListenersToActions();
    }

    function addEventListenersToActions() {
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const clienteId = button.dataset.id;
                modalTitle.textContent = 'Editar Cliente';
                clienteIdInput.value = clienteId;
                await fetchClienteDetails(clienteId);
                clienteModal.show();
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const clienteId = button.dataset.id;
                if (confirm('Tem certeza que deseja deletar este cliente?')) {
                    await deleteCliente(clienteId);
                }
            });
        });
    }

    async function fetchClienteDetails(id) {
        try {
            const response = await fetch(`/api/clientes/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const cliente = await response.json();
            populateClienteForm(cliente);
        } catch (error) {
            console.error('Erro ao buscar detalhes do cliente:', error);
            // Exibir mensagem de erro
        }
    }

    function populateClienteForm(cliente) {
        document.getElementById('nome').value = cliente.nome_cliente;
        document.getElementById('email').value = cliente.email_cliente;
        document.getElementById('telefone').value = cliente.telefone_cliente || '';
        document.getElementById('regiao').value = cliente.região_cliente || '';
        document.getElementById('senha').value = ''; // Não preenche a senha para edição
    }

    async function deleteCliente(id) {
        try {
            const response = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            Swal.fire('Sucesso!', 'Cliente deletado com sucesso.', 'success');
            await fetchClientes(); // Recarrega a lista de clientes
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            Swal.fire('Erro!', 'Erro ao deletar o cliente.', 'error');
        }
    }

    // Event listener para mostrar a seção de clientes ao clicar no link da sidebar
    clientesLink.addEventListener('click', (e) => {
        e.preventDefault();
        dashboardContent.style.display = 'none';
        clientesContent.style.display = 'block';
        fetchClientes(); // Carrega a lista de clientes ao exibir a seção
    });

    // Lógica para o botão "Adicionar Cliente" abrir o modal
    addClienteBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Adicionar Cliente';
        clienteForm.reset();
        clienteIdInput.value = ''; // Limpa o ID para adicionar um novo cliente
        clienteModal.show();
    });

      // Inicializa o modal no evento de clique do botão "Adicionar Cliente"
    addClienteBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Adicionar Cliente';
        clienteForm.reset();
        clienteIdInput.value = '';
        // Garante que o modal seja inicializado apenas uma vez
        if (!clienteModal) {
            clienteModal = new bootstrap.Modal(clienteModalEl);
        }
        clienteModal.show();
    });

    // Event listener para o botão "Salvar" no modal (Adicionar/Editar)
    saveClienteBtn.addEventListener('click', async () => {
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const regiao = document.getElementById('regiao').value;
        const senha = document.getElementById('senha').value;
        const idCliente = clienteIdInput.value;
        const isEdit = idCliente !== '';

        const clienteData = {
            nome_cliente: nome,
            email_cliente: email,
            telefone_cliente: telefone,
            região_cliente: regiao,
            ...(senha && { senha_cliente: senha }) // Adiciona a senha apenas se estiver preenchida
        };

        const url = isEdit ? `/api/clientes/${idCliente}` : '/api/clientes';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                Swal.fire('Erro!', errorData.error || `Erro ao salvar o cliente: ${response.status}`, 'error');
                return;
            }

            Swal.fire('Sucesso!', `Cliente ${isEdit ? 'atualizado' : 'adicionado'} com sucesso.`, 'success');
            clienteModal.hide();
            await fetchClientes(); // Recarrega a lista de clientes
        } catch (error) {
            console.error('Erro ao salvar/atualizar cliente:', error);
            Swal.fire('Erro!', 'Erro interno ao salvar o cliente.', 'error');
        }
    });

    // Inicialmente, exibe o dashboard e oculta a seção de clientes
    dashboardContent.style.display = 'block';
    clientesContent.style.display = 'none';

    // Adiciona event listener para exibir o dashboard ao clicar no link (se necessário)
    const dashboardLink = document.querySelector('.sidebar-menu a[href="#dashboard"]').parentElement;
    if (dashboardLink) {
        dashboardLink.addEventListener('click', (e) => {
            e.preventDefault();
            dashboardContent.style.display = 'block';
            clientesContent.style.display = 'none';
            // Não precisa refazer o fetch das contagens aqui, elas já foram carregadas
        });
    }

    fetchCounts(); // Chama a função para buscar as contagens quando a página carregar
});
