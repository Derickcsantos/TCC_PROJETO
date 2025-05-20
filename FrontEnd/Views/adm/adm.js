document.addEventListener('DOMContentLoaded', () => {
    const dashboardContent = document.getElementById('dashboard-content');
    const clientesContent = document.getElementById('clientes-content');
    const clientesLink = document.querySelector('.sidebar-menu a[href="#clientes"]').parentElement;
    const clientesTableBody = document.getElementById('clientes-table-body');
    const addClienteBtn = document.getElementById('add-cliente-btn');
    const clienteModalEl = document.getElementById('clienteModal');
    const modalTitle = document.getElementById('modalTitle');
    const clienteForm = document.getElementById('clienteForm');
    const clienteIdInput = document.getElementById('clienteId');
    const saveClienteBtn = document.getElementById('saveClienteBtn');
    let clienteModal; // Declaração do modal no escopo correto

    const clientesCountSpan = document.getElementById('clientes-count');
    const saloesCountSpan = document.getElementById('saloes-count');
    const usuariosCountSpan = document.getElementById('usuarios-count');

    // Adicionando elementos para Salões
    const saloesContentEl = document.getElementById('saloes-content');
    const saloesLink = document.querySelector('.sidebar-menu a[href="#saloes"]').parentElement;
    const saloesTableBody = document.getElementById('saloes-table-body');
    const addSalaoBtn = document.getElementById('add-salao-btn');
    const salaoModalEl = document.getElementById('salaoModal');
    const salaoModalTitle = document.getElementById('salaoModalTitle');
    const salaoForm = document.getElementById('salaoForm');
    const salaoIdInput = document.getElementById('salaoId');
    const saveSalaoBtn = document.getElementById('saveSalaoBtn');
    let salaoModal;

    async function adicionarCliente() {
        const nome_cliente = document.getElementById("nome").value;
        const email_cliente = document.getElementById("email").value;
        const telefone_cliente = document.getElementById("telefone").value;
        const regiao_cliente = document.getElementById("regiao").value;
        const senha_cliente = document.getElementById("senha").value;

        // Validação básica dos campos
        if (!nome_cliente || !email_cliente || !telefone_cliente || !regiao_cliente || !senha_cliente) {
            alert("Por favor, preencha todos os campos!");
            return; // Impede o envio se algum campo estiver vazio
        }

        const clienteData = {
            nome_cliente,
            email_cliente,
            telefone_cliente,
            região_cliente,
            senha_cliente,
        };

        try {
            const response = await fetch("/api/clientes", { // Use a rota /api/clientes
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(clienteData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao cadastrar cliente: ${response.status} - ${errorText}`);
            }

            const responseData = await response.json(); // Obtém os dados da resposta

            alert(responseData.message); // Exibe mensagem de sucesso

            // Limpa o formulário após o sucesso
            document.getElementById("nome").value = "";
            document.getElementById("email").value = "";
            document.getElementById("telefone").value = "";
            document.getElementById("regiao").value = "";
            document.getElementById("senha").value = "";

            // Atualiza a página ou redireciona, se necessário
            // window.location.href = '/lista_clientes.html'; // Exemplo de redirecionamento
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro ao cadastrar cliente. Verifique o console para mais detalhes.");
        }
    }

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
                throw new Error(`Erro HTTP! Status: ${response.status}`);
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
                throw new Error(`Erro HTTP! Status: ${response.status}`);
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
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            Swal.fire('Sucesso!', 'Cliente deletado com sucesso.', 'success');
            await fetchClientes(); // Recarrega a lista de clientes
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            Swal.fire('Erro!', 'Erro ao deletar o cliente.', 'error');
        }
    }

    // Inicializa o modal do Bootstrap
    clienteModal = new bootstrap.Modal(clienteModalEl);
    salaoModal = new bootstrap.Modal(salaoModalEl);

    // Event listener para mostrar a seção de clientes ao clicar no link da sidebar
    clientesLink.addEventListener('click', (e) => {
        e.preventDefault();
        dashboardContent.style.display = 'none';
        clientesContent.style.display = 'block';
        saloesContentEl.style.display = 'none';
        fetchClientes(); // Carrega a lista de clientes ao exibir a seção
    });

    saloesLink.addEventListener('click', (e) => {
        e.preventDefault();
        dashboardContent.style.display = 'none';
        clientesContent.style.display = 'none';
        saloesContentEl.style.display = 'block';
        fetchSaloes();
    });

    // Lógica para o botão "Adicionar Cliente" abrir o modal
    addClienteBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Adicionar Cliente';
        clienteForm.reset();
        clienteIdInput.value = ''; // Limpa o ID para adicionar um novo cliente
        clienteModal.show();
    });

    addSalaoBtn.addEventListener('click', () => {
        window.location.href = 'http://localhost:3000/cadastro_usuario'
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

    // Funções para Salões

    async function fetchSaloes() {
        try {
            const response = await fetch('/api/saloes');
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            const saloes = await response.json();
            displaySaloes(saloes);
        } catch (error) {
            console.error('Erro ao buscar salões:', error);
        }
    }

    function displaySaloes(saloes) {
        saloesTableBody.innerHTML = '';
        saloes.forEach(salao => {
            const row = saloesTableBody.insertRow();
            row.insertCell().textContent = salao.id_salao;
            row.insertCell().textContent = salao.nome_salao;
            row.insertCell().textContent = salao.endereco;
            row.insertCell().textContent = salao.telefone;
            const actionsCell = row.insertCell();
            actionsCell.innerHTML = `
                <button class="btn btn-sm btn-primary edit-salao-btn" data-id="${salao.id_salao}"><i class="fas fa-edit"></i> Editar</button>
                <button class="btn btn-sm btn-danger delete-salao-btn" data-id="${salao.id_salao}"><i class="fas fa-trash-alt"></i> Deletar</button>
            `;
        });
        addEventListenersToSalaoActions();
    }

    function addEventListenersToSalaoActions() {
        document.querySelectorAll('.edit-salao-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const salaoId = button.dataset.id;
                salaoModalTitle.textContent = 'Editar Salão';
                salaoIdInput.value = salaoId;
                await fetchSalaoDetails(salaoId);
                salaoModal.show();
            });
        });

        document.querySelectorAll('.delete-salao-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const salaoId = button.dataset.id;
                if (confirm('Tem certeza que deseja deletar este salão?')) {
                    await deleteSalao(salaoId);
                }
            });
        });
    }

    async function fetchSalaoDetails(id) {
        try {
            const response = await fetch(`/api/saloes/${id}`);
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            const salao = await response.json();
            console.log('Detalhes do salão recebidos:', salao)
            populateSalaoForm(salao);
        } catch (error) {
            console.error('Erro ao buscar detalhes do salão:', error);
        }
    }

    function populateSalaoForm(salao) {
        console.log('Dados do salão para popular o formulário:', salao)
        document.getElementById('nome-salao').value = salao.nome_salao;
        document.getElementById('endereco-salao').value = salao.endereco;
        document.getElementById('telefone-salao').value = salao.telefone;
    }

    async function deleteSalao(id) {
        try {
            const response = await fetch(`/api/saloes/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            Swal.fire('Sucesso!', 'Salão deletado com sucesso.', 'success');
            await fetchSaloes();
        } catch (error) {
            console.error('Erro ao deletar salão:', error);
            Swal.fire('Erro!', 'Erro ao deletar o salão.', 'error');
        }
    }

    saveSalaoBtn.addEventListener('click', async () => {
        const nomeSalao = document.getElementById('nome-salao').value;
        const enderecoSalao = document.getElementById('endereco-salao').value;
        const telefoneSalao = document.getElementById('telefone-salao').value;
        const idSalao = salaoIdInput.value;
        const isEdit = idSalao !== '';

        const salaoData = {
            nome_salao: nomeSalao, // Mantido igual
            endereco: enderecoSalao, // Mantido igual
            telefone: telefoneSalao, // Mantido igual
        };

        const url = isEdit ? `/api/saloes/${idSalao}` : '/api/saloes';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(salaoData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                Swal.fire('Erro!', errorData.error || `Erro ao salvar o salão: ${response.status}`, 'error');
                return;
            }

            Swal.fire('Sucesso!', `Salão ${isEdit ? 'atualizado' : 'adicionado'} com sucesso.`, 'success');
            salaoModal.hide();
            await fetchSaloes();
        } catch (error) {
            console.error('Erro ao salvar/atualizar salão:', error);
            Swal.fire('Erro!', 'Erro interno ao salvar o salão.', 'error');
        }
    });

    // Inicialmente, exibe o dashboard e oculta a seção de clientes
    dashboardContent.style.display = 'block';
    clientesContent.style.display = 'none';
    saloesContentEl.style.display = 'none';

    // Adiciona event listener para exibir o dashboard ao clicar no link (se necessário)
    const dashboardLink = document.querySelector('.sidebar-menu a[href="#dashboard"]').parentElement;
    if (dashboardLink) {
        dashboardLink.addEventListener('click', (e) => {
            e.preventDefault();
            dashboardContent.style.display = 'block';
            clientesContent.style.display = 'none';
            saloesContentEl.style.display = 'none';
            // Não precisa refazer o fetch das contagens aqui, elas já foram carregadas
        });
    }

    fetchCounts(); // Chama a função para buscar as contagens quando a página carregar
    fetchSaloes();

});
