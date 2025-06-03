document.addEventListener('DOMContentLoaded', () => {
    const dashboardContent = document.getElementById('dashboard-content');
    const clientesContent = document.getElementById('clientes-content');
    const saloesContentEl = document.getElementById('saloes-content');
    // Adicionando referência para o novo conteúdo de usuários
    const usuariosContent = document.getElementById('usuarios-content');

    const clientesLink = document.querySelector('.sidebar-menu a[href="#clientes"]').parentElement;
    const saloesLink = document.querySelector('.sidebar-menu a[href="#saloes"]').parentElement;
    // Adicionando referência para o link da sidebar de usuários
    const usuariosLink = document.querySelector('.sidebar-menu a[href="#usuarios"]').parentElement;

    const clientesTableBody = document.getElementById('clientes-table-body');
    const addClienteBtn = document.getElementById('add-cliente-btn');
    const clienteModalEl = document.getElementById('clienteModal');
    const modalTitle = document.getElementById('modalTitle');
    const clienteForm = document.getElementById('clienteForm');
    const clienteIdInput = document.getElementById('clienteId');
    const saveClienteBtn = document.getElementById('saveClienteBtn');
    let clienteModal;

    const clientesCountSpan = document.getElementById('clientes-count');
    const saloesCountSpan = document.getElementById('saloes-count');
    const usuariosCountSpan = document.getElementById('usuarios-count');

    // Adicionando elementos para Salões
    const saloesTableBody = document.getElementById('saloes-table-body');
    const addSalaoBtn = document.getElementById('add-salao-btn');
    const salaoModalEl = document.getElementById('salaoModal');
    const salaoModalTitle = document.getElementById('salaoModalTitle');
    const salaoForm = document.getElementById('salaoForm');
    const salaoIdInput = document.getElementById('salaoId');
    const saveSalaoBtn = document.getElementById('saveSalaoBtn');
    let salaoModal;

    // NOVOS ELEMENTOS PARA USUÁRIOS DONOS
    const usuariosTableBody = document.getElementById('usuarios-table-body');
    const addUsuarioBtn = document.getElementById('add-usuario-btn');
    const usuarioModalEl = document.getElementById('usuarioModal');
    const usuarioModalTitle = document.getElementById('usuarioModalTitle');
    const usuarioForm = document.getElementById('usuarioForm');
    const usuarioIdInput = document.getElementById('usuarioId');
    const saveUsuarioBtn = document.getElementById('saveUsuarioBtn');
    let usuarioModal; // Declaração do modal de usuário

    // Funções de Formatação (Recomendado adicionar ao final do arquivo ou em um arquivo utils.js)
    function formatarCPF(campo) {
        let cpf = campo.value.replace(/\D/g, ""); // Remove tudo que não é dígito
        if (cpf.length > 9) {
            cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
            cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
            cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        } else if (cpf.length > 6) {
            cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
            cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        } else if (cpf.length > 3) {
            cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
        }
        campo.value = cpf;
    }

    function formatarTelefone(campo) {
        let telefone = campo.value.replace(/\D/g, ""); // Remove tudo que não é dígito
        if (telefone.length > 10) {
            telefone = telefone.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
        } else if (telefone.length > 5) {
            telefone = telefone.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        } else if (telefone.length > 2) {
            telefone = telefone.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
        }
        campo.value = telefone;
    }
    // FIM DAS FUNÇÕES DE FORMATAÇÃO

    async function adicionarCliente() {
        const nome_cliente = document.getElementById("nome").value;
        const email_cliente = document.getElementById("email").value;
        const telefone_cliente = document.getElementById("telefone").value;
        const regiao_cliente = document.getElementById("regiao").value;
        const senha_cliente = document.getElementById("senha").value;

        // Validação básica dos campos
        if (!nome_cliente || !email_cliente || !telefone_cliente || !regiao_cliente || !senha_cliente) {
            Swal.fire('Atenção!', 'Por favor, preencha todos os campos obrigatórios!', 'warning');
            return;
        }

        const clienteData = {
            nome_cliente,
            email_cliente,
            telefone_cliente,
            região_cliente, // Correção de digitação aqui: região_cliente
            senha_cliente,
        };

        try {
            const response = await fetch("/api/clientes", {
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

            const responseData = await response.json();

            Swal.fire('Sucesso!', responseData.message, 'success');

            document.getElementById("nome").value = "";
            document.getElementById("email").value = "";
            document.getElementById("telefone").value = "";
            document.getElementById("regiao").value = "";
            document.getElementById("senha").value = "";

            fetchClientes(); // Atualiza a lista
            fetchCounts(); // Atualiza as contagens
            clienteModal.hide(); // Fecha o modal
        } catch (error) {
            console.error("Erro:", error);
            Swal.fire('Erro!', 'Erro ao cadastrar cliente. Verifique o console para mais detalhes.', 'error');
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

            // NOVA REQUISIÇÃO PARA CONTAGEM DE USUÁRIOS
            const usuariosResponse = await fetch('/api/usuarios/count');
            const usuariosData = await usuariosResponse.json();
            usuariosCountSpan.textContent = usuariosData.count;

        } catch (error) {
            console.error('Erro ao buscar contagens:', error);
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
        }
    }

    // Função para exibir os clientes na tabela
    function displayClientes(clientes) {
        clientesTableBody.innerHTML = '';
        clientes.forEach(cliente => {
            const row = clientesTableBody.insertRow();
            row.insertCell().textContent = cliente.id_cliente;
            row.insertCell().textContent = cliente.nome_cliente;
            row.insertCell().textContent = cliente.email_cliente;
            row.insertCell().textContent = cliente.telefone_cliente || '';
            row.insertCell().textContent = cliente.região_cliente || ''; // Correção de digitação aqui: região_cliente
            row.insertCell().textContent = new Date(cliente.data_cadastro).toLocaleDateString();
            const actionsCell = row.insertCell();
            actionsCell.innerHTML = `
                <button class="btn btn-sm btn-primary edit-btn" data-id="${cliente.id_cliente}"><i class="fas fa-edit"></i> Editar</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${cliente.id_cliente}"><i class="fas fa-trash-alt"></i> Deletar</button>
            `;
        });

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
                Swal.fire({
                    title: 'Tem certeza?',
                    text: "Você não poderá reverter isso!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim, deletar!',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await deleteCliente(clienteId);
                    }
                });
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
        }
    }

    function populateClienteForm(cliente) {
        document.getElementById('nome').value = cliente.nome_cliente;
        document.getElementById('email').value = cliente.email_cliente;
        document.getElementById('telefone').value = cliente.telefone_cliente || '';
        document.getElementById('regiao').value = cliente.região_cliente || '';
        document.getElementById('senha').value = '';
    }

    async function deleteCliente(id) {
        try {
            const response = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro HTTP! Status: ${response.status}`);
            }
            Swal.fire('Sucesso!', 'Cliente deletado com sucesso.', 'success');
            await fetchClientes();
            fetchCounts(); // Atualiza as contagens
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            Swal.fire('Erro!', error.message || 'Erro ao deletar o cliente.', 'error');
        }
    }

    // Inicializa os modais do Bootstrap
    clienteModal = new bootstrap.Modal(clienteModalEl);
    salaoModal = new bootstrap.Modal(salaoModalEl);
    // Inicializa o modal de usuário
    usuarioModal = new bootstrap.Modal(usuarioModalEl);

    // Event listener para mostrar a seção de clientes ao clicar no link da sidebar
    clientesLink.addEventListener('click', (e) => {
        e.preventDefault();
        dashboardContent.style.display = 'none';
        clientesContent.style.display = 'block';
        saloesContentEl.style.display = 'none';
        usuariosContent.style.display = 'none'; // Oculta a seção de usuários
        fetchClientes();
    });

    saloesLink.addEventListener('click', (e) => {
        e.preventDefault();
        dashboardContent.style.display = 'none';
        clientesContent.style.display = 'none';
        saloesContentEl.style.display = 'block';
        usuariosContent.style.display = 'none'; // Oculta a seção de usuários
        fetchSaloes();
    });

    // NOVO Event listener para mostrar a seção de usuários ao clicar no link da sidebar
    usuariosLink.addEventListener('click', (e) => {
        e.preventDefault();
        dashboardContent.style.display = 'none';
        clientesContent.style.display = 'none';
        saloesContentEl.style.display = 'none';
        usuariosContent.style.display = 'block'; // Mostra a seção de usuários
        fetchUsuarios(); // Carrega a lista de usuários ao exibir a seção
    });


    // Lógica para o botão "Adicionar Cliente" abrir o modal
    addClienteBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Adicionar Cliente';
        clienteForm.reset();
        clienteIdInput.value = ''; // Limpa o ID para adicionar um novo cliente
        document.getElementById('senha').setAttribute('required', 'required'); // Torna a senha obrigatória ao adicionar
        document.getElementById('senhaDonoHelp').style.display = 'none'; // Esconde a dica de "deixar em branco"
        clienteModal.show();
    });

    // Ajuste para o botão "Salvar" no modal de cliente
    saveClienteBtn.addEventListener('click', async () => {
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const regiao = document.getElementById('regiao').value;
        const senha = document.getElementById('senha').value;
        const idCliente = clienteIdInput.value;
        const isEdit = idCliente !== '';

        if (!nome || !email || !telefone || !regiao || (!isEdit && !senha)) { // Validação para campos obrigatórios, incluindo senha para adição
            Swal.fire('Atenção!', 'Por favor, preencha todos os campos obrigatórios!', 'warning');
            return;
        }

        const clienteData = {
            nome_cliente: nome,
            email_cliente: email,
            telefone_cliente: telefone,
            região_cliente: regiao,
        };
        // Adiciona a senha apenas se estiver preenchida OU se for uma nova adição
        if (senha || !isEdit) {
            clienteData.senha_cliente = senha;
        }


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
            await fetchClientes();
            fetchCounts(); // Atualiza as contagens
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
                Swal.fire({
                    title: 'Tem certeza?',
                    text: "Você não poderá reverter isso!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim, deletar!',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await deleteSalao(salaoId);
                    }
                });
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
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro HTTP! Status: ${response.status}`);
            }
            Swal.fire('Sucesso!', 'Salão deletado com sucesso.', 'success');
            await fetchSaloes();
            fetchCounts(); // Atualiza as contagens
        } catch (error) {
            console.error('Erro ao deletar salão:', error);
            Swal.fire('Erro!', error.message || 'Erro ao deletar o salão.', 'error');
        }
    }

    saveSalaoBtn.addEventListener('click', async () => {
        const nomeSalao = document.getElementById('nome-salao').value;
        const enderecoSalao = document.getElementById('endereco-salao').value;
        const telefoneSalao = document.getElementById('telefone-salao').value;
        const idSalao = salaoIdInput.value;
        const isEdit = idSalao !== '';

        if (!nomeSalao || !enderecoSalao || !telefoneSalao) {
            Swal.fire('Atenção!', 'Por favor, preencha todos os campos obrigatórios!', 'warning');
            return;
        }

        const salaoData = {
            nome_salao: nomeSalao,
            endereco: enderecoSalao,
            telefone: telefoneSalaa,
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
            fetchCounts(); // Atualiza as contagens
        } catch (error) {
            console.error('Erro ao salvar/atualizar salão:', error);
            Swal.fire('Erro!', 'Erro interno ao salvar o salão.', 'error');
        }
    });

    // Lógica para o botão "Adicionar Salão" (o link para '/cadastro_usuario' foi removido para ser substituído pela modal)
    addSalaoBtn.addEventListener('click', () => {
        salaoModalTitle.textContent = 'Adicionar Salão';
        salaoForm.reset();
        salaoIdInput.value = ''; // Limpa o ID para adicionar um novo salão
        salaoModal.show();
    });

    // ##########################################################################
    // NOVAS FUNÇÕES PARA O GERENCIAMENTO DE USUÁRIOS DONOS (USUARIO_DONO)
    // ##########################################################################

    // Função para buscar e exibir a lista de usuários donos
    async function fetchUsuarios() {
        try {
            const response = await fetch('/api/usuarios'); // Nova rota para usuários donos
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            const usuarios = await response.json();
            displayUsuarios(usuarios);
        } catch (error) {
            console.error('Erro ao buscar usuários donos:', error);
            Swal.fire('Erro!', 'Não foi possível carregar a lista de usuários donos.', 'error');
        }
    }

    // Função para exibir os usuários donos na tabela
    function displayUsuarios(usuarios) {
    usuariosTableBody.innerHTML = ''; // Limpa a tabela
    usuarios.forEach(usuario => {
        const row = usuariosTableBody.insertRow();
        row.insertCell().textContent = usuario.id_dono; // OK, usando id_dono para exibir
        row.insertCell().textContent = usuario.nome_dono;
        row.insertCell().textContent = usuario.email_dono;
        row.insertCell().textContent = usuario.usuario;
        row.insertCell().textContent = usuario.CPF;
        row.insertCell().textContent = usuario.telefone_dono;
        const actionsCell = row.insertCell();
        actionsCell.innerHTML = `
            <button class="btn btn-sm btn-primary edit-usuario-btn" data-id="${usuario.id_dono}"><i class="fas fa-edit"></i> Editar</button>
            <button class="btn btn-sm btn-danger delete-usuario-btn" data-id="${usuario.id_dono}"><i class="fas fa-trash-alt"></i> Deletar</button>
        `;
    });
    addEventListenersToUsuarioActions();
}

    // Adiciona event listeners aos botões de editar e deletar usuários
    function addEventListenersToUsuarioActions() {
        document.querySelectorAll('.edit-usuario-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const usuarioId = button.dataset.id;
                usuarioModalTitle.textContent = 'Editar Usuário Dono';
                usuarioIdInput.value = usuarioId;
                await fetchUsuarioDetails(usuarioId);
                // Torna a senha não obrigatória na edição e mostra a dica
                document.getElementById('senhaDono').removeAttribute('required');
                document.getElementById('senhaDonoHelp').style.display = 'block';
                usuarioModal.show();
            });
        });

        document.querySelectorAll('.delete-usuario-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const usuarioId = button.dataset.id;
                Swal.fire({
                    title: 'Tem certeza?',
                    text: "Você não poderá reverter isso!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim, deletar!',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await deleteUsuario(usuarioId);
                    }
                });
            });
        });
    }

    // Busca os detalhes de um usuário dono para edição
    async function fetchUsuarioDetails(id) {
        try {
            const response = await fetch(`/api/usuarios/${id}`); // Nova rota para detalhes de usuário
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            const usuario = await response.json();
            populateUsuarioForm(usuario);
        } catch (error) {
            console.error('Erro ao buscar detalhes do usuário dono:', error);
            Swal.fire('Erro!', 'Não foi possível carregar os detalhes do usuário.', 'error');
        }
    }

    // Preenche o formulário do modal com os dados do usuário dono
    function populateUsuarioForm(usuario) {
        document.getElementById('usuarioId').value = usuario.id_dono || '';
        document.getElementById('nomeDono').value = usuario.nome_dono || ''; // <-- Ajustado
        document.getElementById('emailDono').value = usuario.email_dono || ''; // <-- Ajustado
        document.getElementById('usuarioDono').value = usuario.usuario || ''; // <-- Ajustado
        document.getElementById('cpfDono').value = usuario.CPF || ''; // <-- Ajustado
        document.getElementById('telefoneDono').value = usuario.telefone_dono || ''; // <-- Ajustado
        document.getElementById('senhaDono').value = ''; // Sempre limpa a senha para edição
        document.getElementById('senhaDonoHelp').style.display = 'block'; // Mostra a mensagem de ajuda
        document.getElementById('usuarioModalTitle').textContent = 'Editar Usuário Dono';
        usuarioModal.show();
    }

    // Deleta um usuário dono
    async function deleteUsuario(id) {
        try {
            const response = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' }); // Nova rota DELETE
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro HTTP! Status: ${response.status}`);
            }
            Swal.fire('Sucesso!', 'Usuário dono deletado com sucesso.', 'success');
            await fetchUsuarios(); // Recarrega a lista de usuários
            fetchCounts(); // Atualiza as contagens
        } catch (error) {
            console.error('Erro ao deletar usuário dono:', error);
            Swal.fire('Erro!', error.message || 'Erro ao deletar o usuário dono.', 'error');
        }
    }

    // Lógica para o botão "Adicionar Usuário" abrir o modal
    addUsuarioBtn.addEventListener('click', () => {
        usuarioModalTitle.textContent = 'Adicionar Usuário Dono';
        usuarioForm.reset();
        usuarioIdInput.value = ''; // Limpa o ID para adicionar um novo usuário
        // Torna a senha obrigatória ao adicionar e esconde a dica
        document.getElementById('senhaDono').setAttribute('required', 'required');
        document.getElementById('senhaDonoHelp').style.display = 'none';
        usuarioModal.show();
    });

    // Event listener para o botão "Salvar" no modal de Usuário Dono (Adicionar/Editar)
    saveUsuarioBtn.addEventListener('click', async () => {
        const nomeCompleto = document.getElementById('nomeDono').value;
        const email = document.getElementById('emailDono').value;
        const nomeUsuario = document.getElementById('usuarioDono').value;
        const cpf = document.getElementById('cpfDono').value;
        const telefone = document.getElementById('telefoneDono').value;
        const senha = document.getElementById('senhaDono').value;
        const idUsuario = usuarioIdInput.value; // Assumindo que usuarioIdInput está definido (ex: document.getElementById('usuarioId'))
        const isEdit = idUsuario !== '';

        // Validação básica dos campos obrigatórios
        // Para criação, todos os campos são obrigatórios. Para edição, a senha é opcional.
        if (!nomeCompleto || !email || !nomeUsuario || !cpf || (!isEdit && !senha)) {
            Swal.fire('Atenção!', 'Por favor, preencha todos os campos obrigatórios!', 'warning');
            return;
        }

        // AQUI ESTÁ A MUDANÇA CRÍTICA: Os nomes das propriedades devem corresponder às colunas do seu DB
        const usuarioData = {
            nome_dono: nomeCompleto,    // Corresponde à coluna 'nome_dono'
            email_dono: email,          // Corresponde à coluna 'email_dono'
            usuario: nomeUsuario,       // Corresponde à coluna 'usuario'
            CPF: cpf,                   // Corresponde à coluna 'CPF'
            telefone_dono: telefone,    // Corresponde à coluna 'telefone_dono'
        };

        // Adiciona a senha apenas se estiver preenchida OU se for uma nova adição
        if (senha || !isEdit) {
            // A propriedade para a senha deve ser 'senha_dono' (nome da coluna no DB)
            usuarioData.senha_dono = senha;
        }

        const url = isEdit ? `/api/usuarios/${idUsuario}` : '/api/usuarios';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuarioData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                Swal.fire('Erro!', errorData.error || `Erro ao salvar o usuário dono: ${response.status}`, 'error');
                return;
            }

            Swal.fire('Sucesso!', `Usuário dono ${isEdit ? 'atualizado' : 'adicionado'} com sucesso.`, 'success');
            usuarioModal.hide(); // Assumindo que usuarioModal é uma instância de Bootstrap.Modal
            await fetchUsuarios(); // Recarrega a lista
            fetchCounts(); // Atualiza as contagens
        } catch (error) {
            console.error('Erro ao salvar/atualizar usuário dono:', error);
            Swal.fire('Erro!', 'Erro interno ao salvar o usuário dono.', 'error');
        }
    });


    // Inicialmente, exibe o dashboard e oculta as outras seções
    dashboardContent.style.display = 'block';
    clientesContent.style.display = 'none';
    saloesContentEl.style.display = 'none';
    usuariosContent.style.display = 'none'; // Garante que a seção de usuários começa oculta

    // Adiciona event listener para exibir o dashboard ao clicar no link (se necessário)
    const dashboardLink = document.querySelector('.sidebar-menu a[href="#dashboard"]').parentElement;
    if (dashboardLink) {
        dashboardLink.addEventListener('click', (e) => {
            e.preventDefault();
            dashboardContent.style.display = 'block';
            clientesContent.style.display = 'none';
            saloesContentEl.style.display = 'none';
            usuariosContent.style.display = 'none'; // Oculta a seção de usuários
            // Não precisa refazer o fetch das contagens aqui, elas já foram carregadas
        });
    }

    fetchCounts(); // Chama a função para buscar as contagens quando a página carregar
    // fetchSaloes(); // Já está sendo chamado na exibição da seção, mas pode ser chamado aqui também se quiser carregar junto
    // fetchClientes(); // Já está sendo chamado na exibição da seção, mas pode ser chamado aqui também se quiser carregar junto

    // Torna as funções de formatação globais ou acessíveis de outra forma se você as mover
    window.formatarCPF = formatarCPF;
    window.formatarTelefone = formatarTelefone;
});
