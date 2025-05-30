const express = require('express');
const app = express();
const cors = require('cors'); // Permite que o front acesse o backend
const supabase = require('./supabase.js');
const bcrypt = require('bcrypt');
const path = require('path');
const { error } = require('console');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../FrontEnd')));


// Rota para cliente logado
app.get('/logadoC', async (req, res) =>{
    const filePath = path.join(__dirname, '../../FrontEnd/Views/cliente_logado/logadoC.html')
    res.sendFile(filePath)
});



// Rota para obter a contagem de clientes
app.get('/api/clientes/count', async (req, res) => {
    try {
        const { count, error } = await supabase
            .from('clientes')
            .select('*', { count: 'exact' });

        if (error) {
            console.error('Erro ao obter contagem de clientes:', error);
            return res.status(500).json({ error: 'Erro ao obter a contagem de clientes' });
        }

        res.json({ count });
    } catch (error) {
        console.error('Erro no servidor ao obter a contagem de clientes', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para obter a contagem de salões
app.get('/api/saloes/count', async (req, res) => {
    try {
        const { count, error } = await supabase
            .from('salao')
            .select('*', { count: 'exact' })

        if (error) {
            console.error('Erro ao obter a contagem de salões:', error);
            return res.status(500).json({ error: 'Erro ao obter contagem de salões' });
        }

        res.json({ count });
    } catch (error) {
        console.error('Erro no servidor ao obter contagem de salões:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para obter a contagem de usuários
app.get('/api/usuarios/count', async (req, res) => {
    try {
        const { count, error } = await supabase
            .from('usuario_dono')
            .select('*', { count: 'exact' });

        if (error) {
            console.error('Erro ao obter contagem de usuários donos:', error);
            return res.status(500).json({ error: 'Erro ao obter contagem de usuários donos' });
        }

        res.json({ count });
    } catch (error) {
        console.error('Erro no servidor ao obter contagem de usuários donos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


// Rota para servir o formulário de cadastro de administrador
app.get('/cadastro_adm', (req, res) => {
    const filePath = path.join(__dirname, '../../FrontEnd/Views/cadastro_adm/cadastro_adm.html');
    res.sendFile(filePath);
});

// Rota para lidar com o envio do formulário de cadastro de administrador
app.post('/cadastro_adm', async (req, res) => {
    const { email_adm, senha_adm } = req.body;

    try {
        // Criptografa a senha usando bcrypt
        const senhaHash = await bcrypt.hash(senha_adm, 10);

        // Insere o novo administrador no banco de dados
        const { data, error } = await supabase
            .from('adm')
            .insert([{ email_adm, senha_adm: senhaHash }]);

        if (error) {
            console.error('Erro ao cadastrar administrador:', error);
            return res.status(500).json({ error: 'Erro ao cadastrar administrador no banco de dados.' });
        }

        res.status(201).json({ message: 'Administrador cadastrado com sucesso!' });

    } catch (error) {
        console.error('Erro durante o cadastro de administrador:', error);
        res.status(500).json({ error: 'Erro interno ao processar o cadastro.' });
    }
});
// Rotas GET
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../../FrontEnd/Views/Home/home.html');
    console.log('acessando:', filePath);
    res.sendFile(filePath);
});

// Rota para servir o HTML de cadastro (CORRIGIDA)
app.get('/cadastro_usuario', (req, res) => {
    const filePath = path.join(__dirname, '../../FrontEnd/Views/cadastro_usuario/cadastro_usuario.html');
    console.log('Tentando acessar:', filePath); // Debug
    res.sendFile(filePath);
});
app.post("/cadastro_usuario", async (req, res) => {
    const { nome_completo, email, CPF, telefone, usuario, senha } = req.body;

    console.log("Requisição recebida para /cadastro_usuario", req.body);

    try {

        // Verifica se o usuario já existe
        const { data: usuarioExistente, error: erroConsulta } = await supabase
            .from("usuario_dono")
            .select("id_dono")
            .or(`email_dono.eq.${email},CPF.eq.${CPF},usuario.eq.${usuario}`)
            .maybeSingle();

        if (erroConsulta) throw erroConsulta;
        if (usuarioExistente) {
            return res.status(400).json({ error: "Usuario, e-mail ou CPF já cadastrado" });
        }

        // Cria hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Insere no banco
        const { data, error } = await supabase
            .from("usuario_dono")
            .insert([{
                nome_dono: nome_completo,
                email_dono: email,
                CPF: CPF,
                telefone_dono: telefone,
                usuario: usuario,
                senha_dono: senhaHash
            }])
            .select("id_dono");

        if (error) {
            console.log("Erro Supabase", error);
            return res.status(500).json({ error: "Erro ao cadastrar", datails: error.message });
        }

        res.status(201).json({
            message: "Dono cadastrado com sucesso",
            id_dono: data[0].id_dono
        });

    } catch (error) {
        console.error("Erro no servidor", error);
        res.status(500).json({
            error: "Erro interno",
            details: error.message
        })
    }
})

app.get('/loginC', (req, res) => {
    const filePath = path.join(__dirname, '../../FrontEnd/Views/login__cliente/login_cliente.html');
    console.log('Tentando acessar:', filePath); // Debug
    res.sendFile(filePath);
})

app.post('/loginC', async (req, res) => {
    const { email, senha } = req.body;

    console.log("Email recebido no login:", email);
    console.log("Senha recebida no login:", senha);

    try {
        // --- 1. TENTATIVA DE LOGIN COMO ADMINISTRADOR ---
        // Busca o usuário na tabela 'adm'
        const { data: administrador, error: errorAdm } = await supabase
            .from('adm')
            .select('*')
            .eq('email_adm', email)
            .single();

        // Se encontrou um possível ADM (sem erro de "no rows" direto do Supabase)
        if (administrador) {
            console.log("Dados do administrador encontrado:", administrador);
            // Verifica se a senha_adm existe (hash)
            if (administrador.senha_adm) {
                try {
                    // Compara a senha fornecida com a senha hash do ADM
                    const senhaValidaAdm = await bcrypt.compare(senha, administrador.senha_adm);
                    if (senhaValidaAdm) {
                        console.log("Senha do administrador VÁLIDA - Login ADM bem-sucedido!");
                        // Se for ADM válido, retorna uma resposta JSON específica
                        return res.status(200).json({
                            success: true,
                            message: 'Login de administrador bem-sucedido',
                            userType: 'admin' // Indica que é um ADM
                        });
                    } else {
                        console.log("Senha do administrador inválida. Tentando como cliente...");
                    }
                } catch (bcryptError) {
                    console.error("Erro ao comparar senha do administrador:", bcryptError);
                    // Continua para tentar como cliente se houver erro no bcrypt
                }
            } else {
                console.log("Administrador encontrado, mas sem senha hash. Tentando como cliente...");
            }
        } else {
            console.log("Administrador não encontrado para este email. Tentando como cliente...");
        }

        // --- 2. TENTATIVA DE LOGIN COMO CLIENTE (USANDO SUPABASE AUTH) ---
        // Se não foi autenticado como ADM (ou a senha do ADM estava errada),
        // tenta autenticar como cliente usando o sistema de autenticação do Supabase.
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: senha,
        });

        if (authError) {
            console.error("Erro no login do cliente via Supabase Auth:", authError.message);
            // Verifica se o erro é de credenciais inválidas
            if (authError.message.includes('Invalid login credentials') || authError.message.includes('Email not confirmed')) {
                return res.status(401).json({ success: false, error: 'Email ou senha incorretos, ou email não confirmado.' });
            }
            return res.status(500).json({ success: false, error: 'Erro no serviço de autenticação do cliente.' });
        }

        // Se a autenticação Supabase foi bem-sucedida para o cliente
        if (authData && authData.session && authData.user) {
            console.log("Login CLIENTE bem-sucedido via Supabase Auth!");
            console.log("Sessão do Supabase:", authData.session);
            console.log("Usuário do Supabase:", authData.user);

            // Opcional: Você pode querer verificar se este usuário também existe na sua tabela 'clientes'
            // se houver dados adicionais do cliente que você armazena lá.
            // const { data: clienteDB, error: errorClienteDB } = await supabase
            //     .from('clientes')
            //     .select('*')
            //     .eq('email_cliente', authData.user.email)
            //     .single();

            // if (errorClienteDB) {
            //     console.warn("Usuário autenticado no Supabase Auth, mas não encontrado na tabela 'clientes'.");
            //     // Decida como lidar com isso: pode permitir o login, ou exigir que esteja na tabela.
            // }

            return res.status(200).json({
                success: true,
                message: 'Login de cliente bem-sucedido',
                userType: 'cliente',
                session: authData.session // Envia o objeto de sessão do Supabase para o frontend
            });
        }

        // Se chegou até aqui, significa que não foi ADM nem Cliente autenticado via Supabase Auth
        // (por exemplo, se authData.session ou authData.user não vierem, o que é incomum em sucesso)
        return res.status(401).json({ error: 'Email ou senha incorretos.' });

    } catch (error) {
        console.error('Erro geral no login (catch principal):', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// Rota para servir o arquivo adm.html
app.get('/adm', (req, res) => {
    const filePath = path.join(__dirname, '../../FrontEnd/Views/adm/adm.html');
    res.sendFile(filePath);
});

app.get('/clientes', async (req, res) => {
    const filePath = path.join(__dirname, '../../Frontend/Views/Cadastro_cliente/Cadastro_cliente.html')
    res.sendFile(filePath)
})
app.post('/clientes', async (req, res) => {
    const {
        nome_cliente,
        email_cliente,
        telefone_cliente,
        região_cliente,
        senha_cliente // A senha virá em texto puro do frontend
    } = req.body;

    // Adicione validações básicas para os campos
    if (!email_cliente || !senha_cliente || !nome_cliente) {
        return res.status(400).json({ error: 'Email, senha e nome são campos obrigatórios.' });
    }

    try {
        // --- 1. Registrar o usuário no sistema de AUTENTICAÇÃO do Supabase ---
        // O Supabase Auth vai lidar com o hashing da senha automaticamente.
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email_cliente,
            password: senha_cliente,
            options: {
                data: {
                    // Opcional: Você pode passar metadados adicionais para o usuário do Supabase Auth
                    // Mas para dados que serão consultados frequentemente, é melhor armazenar na sua tabela 'clientes'.
                    nome_cliente_auth: nome_cliente // Exemplo: para fins de registro no Auth
                }
            }
        });

        if (authError) {
            console.error('Erro ao cadastrar cliente no Supabase Auth:', authError.message);
            // Tratar erros comuns de cadastro, como email já cadastrado
            if (authError.message.includes('User already registered')) {
                return res.status(409).json({ error: 'Este e-mail já está cadastrado. Por favor, tente outro ou faça login.' });
            }
            return res.status(500).json({ error: `Erro ao cadastrar usuário: ${authError.message}` });
        }

        // --- 2. Inserir dados adicionais na sua tabela 'clientes' ---
        // Usamos o ID do usuário gerado pelo Supabase Auth para linkar.
        // Não armazenamos a senha aqui, pois ela é gerenciada pelo Supabase Auth.
        const { data: newClientData, error: insertError } = await supabase
            .from('clientes')
            .insert([{
                id_cliente: authData.user.id, // MUITO IMPORTANTE: Usar o ID do usuário do Supabase Auth
                nome_cliente: nome_cliente,
                email_cliente: email_cliente, // Pode duplicar, mas é bom para consultas rápidas na tabela
                telefone_cliente: telefone_cliente,
                região_cliente: região_cliente,
                // Remova 'senha_cliente' daqui! A senha é gerenciada pelo Supabase Auth.
            }])
            .select();

        if (insertError) {
            console.error('Erro ao salvar dados adicionais na tabela clientes:', insertError.message);
            // Considere o que fazer aqui:
            // 1. Você pode querer apagar o usuário recém-criado no Supabase Auth se a inserção na tabela falhar,
            //    para evitar usuários "órfãos". Isso é mais complexo e requer lógica de reversão.
            //    await supabase.auth.admin.deleteUser(authData.user.id); // Requer chave de serviço (service_role key)
            // 2. Ou simplesmente informar ao usuário que houve um problema e ele pode tentar novamente.
            return res.status(500).json({ error: 'Erro ao salvar dados adicionais do cliente. Por favor, tente novamente.' });
        }

        // --- 3. Sucesso no Cadastro ---
        // Se o e-mail de confirmação estiver ativado no Supabase, o usuário precisará confirmá-lo.
        let successMessage = 'Cliente cadastrado com sucesso!';
        if (authData.user && !authData.user.confirmed_at) { // Ou verifique se require_email_confirmation está ativo
             successMessage += ' Por favor, verifique seu e-mail para confirmar a conta.';
        }

        res.status(201).json({ success: true, message: successMessage, user: authData.user, profile: newClientData ? newClientData[0] : null });

    } catch (error) {
        console.error('Erro geral no cadastro de cliente:', error);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

app.get('/cadastro_salao', (req, res) => {
    const filePath = path.join(__dirname, '../../FrontEnd/Views/cadastro_saloes/cadastro_salao.html');
    console.log('Tentando acessar:', filePath); // Debug
    res.sendFile(filePath);
})
app.post("/cadastro_salao", async (req, res) => {
    console.log("Dados recebidos no backend:", req.body);

    if (typeof req.body.localizacao === 'undefined' || req.body.localizacao === null) {
        return res.status(400).json({ error: "Localização é obrigatória" });
    }

    try {
        console.log("Buscando id_localizacao para a região:", req.body.localizacao); 

        const { data: localizacaoData, error: localizacaoError } = await supabase
            .from('localizacao')
            .select('id_localizacao')
            .eq('regiao', req.body.localizacao)
            .single();

        console.log("Resultado da busca de localizacaoData:", localizacaoData);
        console.log("Erro na busca de localizacaoError:", localizacaoError); 

        if (localizacaoError || !localizacaoData) {
            return res.status(400).json({ error: "Localização inválida" });
        }

        const idLocalizacao = localizacaoData.id_localizacao;

        const { data: salaoData, error: salaoError } = await supabase
            .from('salao')
            .insert([{
                nome_salao: req.body.nome_salao,
                telefone: req.body.telefone,
                endereco: req.body.endereco,
                numero_salao: req.body.numero_salao,
                complemento_salao: req.body.complemento_salao,
                localizacao: idLocalizacao, // <---- CORREÇÃO AQUI: Use idLocalizacao
                dono: Number(req.body.id_dono)
            }])
            .select(); // Adicione o .select() para retornar os dados inseridos

        if (salaoError) throw salaoError;

        res.json({ success: true, id_salao: salaoData ? salaoData[0].id : null }); // Retorne os dados
    } catch (error) {
        console.error('Erro ao cadastrar salão:', error);
        res.status(500).json({ error: "Erro ao cadastrar salão", details: error.message });
    }
});

// Rota para obter todos os clientes
app.get('/api/clientes', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('clientes')
            .select('*');

        if (error) {
            console.error("Erro ao obter clientes:", error);
            return res.status(500).json({ error: 'Erro ao obter clientes' });
        }

        res.json(data);
    } catch (error) {
        console.error("Erro no servidor ao obter clientes:", error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para obter um cliente por ID
app.get('/api/clientes/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`Recebida requisição para /api/clientes/${id}`);
    try {
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .eq('id_cliente', id)
            .single();

        if (error) {
            console.error("Erro ao obter cliente por ID:", error);
            if (error.message === "No rows found") {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }
            return res.status(500).json({ error: 'Erro ao obter cliente' });
        }

        if (!data) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.json(data);
    } catch (error) {
        console.error("Erro no servidor ao obter cliente por ID:", error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/clientes', async (req, res) => {
    const { nome_cliente, email_cliente, telefone_cliente, região_cliente, senha_cliente } = req.body;

    // Console log para debug
    console.log("Dados recebidos para POST /api/clientes:", req.body);

    if (!nome_cliente || !email_cliente || !telefone_cliente || !região_cliente || !senha_cliente) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." }); // Melhore a resposta de erro
    }

    try {
        const senhaHash = await bcrypt.hash(senha_cliente, 10);
        const { data, error } = await supabase
            .from('clientes')
            .insert([{
                nome_cliente,
                email_cliente,
                telefone_cliente,
                região_cliente,
                senha_cliente: senhaHash,
            }])
            .select(); // Adicione o .select() para retornar os dados inseridos

        if (error) {
            console.error("Erro ao inserir cliente no banco de dados:", error);
            return res.status(500).json({ error: 'Erro ao cadastrar cliente no banco de dados', details: error.message }); // Inclua detalhes do erro
        }
        if (!data || data.length === 0) {
            return res.status(500).json({ error: "Falha ao inserir o cliente" });
        }
        // Console log de sucesso
        console.log("Cliente cadastrado com sucesso:", data);
        res.status(201).json({ message: 'Cliente cadastrado com sucesso', data: data[0] }); // Retorne os dados do cliente criado
    } catch (error) {
        console.error("Erro no servidor ao cadastrar cliente:", error);
        res.status(500).json({ error: 'Erro interno do servidor', details: error.message }); // Inclua detalhes do erro
    }
});


// Rota para atualizar um cliente por ID
app.put('/api/clientes/:id', async (req, res) => {
    const id = req.params.id;
    const {
        nome_cliente,
        email_cliente,
        telefone_cliente,
        região_cliente,
        senha_cliente
    } = req.body;

    try {
        let updateData = {
            nome_cliente,
            email_cliente,
            telefone_cliente,
            região_cliente,
        };

        if (senha_cliente) {
            const senhaHash = await bcrypt.hash(senha_cliente, 10);
            updateData.senha_cliente = senhaHash;
        }
        const { data, error } = await supabase
            .from('clientes')
            .update(updateData)
            .eq('id_cliente', id)
            .select(); // Adicione .select() para retornar os dados atualizados

        if (error) {
            console.error("Erro ao atualizar cliente:", error);
            return res.status(500).json({ error: 'Erro ao atualizar cliente' });
        }
        if (!data || data.length === 0) { // Verifique se data é null ou vazio
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.json({ message: 'Cliente atualizado com sucesso', data: data ? data[0] : null }); // Retorne os dados atualizados
    } catch (error) {
        console.error("Erro no servidor ao atualizar cliente:", error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para deletar um cliente por ID
app.delete('/api/clientes/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { data, error } = await supabase
            .from('clientes')
            .delete()
            .eq('id_cliente', id)
            .select();  // Adicione .select() para retornar os dados deletados

        if (error) {
            console.error("Erro ao deletar cliente:", error);
            return res.status(500).json({ error: 'Erro ao deletar cliente' });
        }
        if (!data || data.length === 0) { // Verifique se data é null ou vazio.
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.json({ message: 'Cliente deletado com sucesso', data: data ? data[0] : null }); //retorne os dados deletados
    } catch (error) {
        console.error("Erro no servidor ao deletar cliente:", error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para obter todos os salões
app.get('/api/saloes', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('salao')
            .select('*');

        if (error) {
            console.error("Erro ao obter salões:", error);
            return res.status(500).json({ error: 'Erro ao obter salões', details: error.message });
        }

        res.json(data);
    } catch (error) {
        console.error("Erro no servidor ao obter salões:", error);
        res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
});

// Rota para obter um salão por ID
app.get('/api/saloes/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { data, error } = await supabase
            .from('salao')
            .select('*')
            .eq('id_salao', id) // Use o nome correto da coluna de ID
            .single();

        if (error) {
            console.error("Erro ao obter salão por ID:", error);
            if (error.message === "No rows found") {
                return res.status(404).json({ error: 'Salão não encontrado' });
            }
            return res.status(500).json({ error: 'Erro ao obter salão', details: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: 'Salão não encontrado' });
        }

        res.json(data);
    } catch (error) {
        console.error("Erro no servidor ao obter salão por ID:", error);
        res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
});

// Rota para criar um novo salão
app.post('/api/saloes', async (req, res) => {
    const { nome, endereco, telefone, horario_funcionamento, servicos } = req.body;

    // Validar dados
    if (!nome || !endereco || !telefone || !horario_funcionamento) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    try {
        // Inserir no banco de dados
        const { data, error } = await supabase
            .from('salao')
            .insert([{
                nome,
                endereco,
                telefone,
                horario_funcionamento,
                servicos, // Assumindo que 'servicos' é um array ou string
                data_cadastro: new Date()
            }])
            .select(); // Retorna os dados inseridos

        if (error) {
            console.error("Erro ao cadastrar salão:", error);
            return res.status(500).json({ error: "Erro ao cadastrar salão", details: error.message });
        }
        if (!data || data.length === 0) {
            return res.status(500).json({ error: "Falha ao inserir salão" });
        }

        res.status(201).json({ message: "Salão cadastrado com sucesso", data: data[0] });
    } catch (error) {
        console.error("Erro no servidor:", error);
        res.status(500).json({ error: "Erro interno do servidor", details: error.message });
    }
});

// Rota para atualizar um salão por ID
app.put('/api/saloes/:id', async (req, res) => {
    const id = req.params.id;
    const {nome_salao, endereco, telefone} = req.body;

    console.log('ID do salão', id);
    console.log('Valores antes do update', {nome_salao, endereco, telefone});

    try {
        const { data, error } = await supabase
            .from('salao')
            .update({ nome_salao: nome_salao,
                    endereco: endereco,
                    telefone: telefone }) //campos que podem ser atualizados
            .eq('id_salao', id) // Use o nome correto da coluna de ID
            .select('id_salao, nome_salao, endereco, telefone, descricao, imagem_url, dono, localizacao, numero_salao, complemento_salao');  // Retorna os dados atualizados

        console.log('Retorno do supabase', {data, error});

        if (error) {
            console.error("Erro ao atualizar salão:", error);
            return res.status(500).json({ error: 'Erro ao atualizar salão', details: error.message });
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Salão não encontrado' });
        }

        res.json({ message: 'Salão atualizado com sucesso', data: data ? data[0] : null });
    } catch (error) {
        console.error("Erro no servidor ao atualizar salão:", error);
        res.status(500).json({ error: "Erro interno do servidor", details: error.message });
    }
});

// Rota para deletar um salão por ID
app.delete('/api/saloes/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { data, error } = await supabase
            .from('salao')
            .delete()
            .eq('id_salao', id) // Use o nome correto da coluna de ID
            .select();       // Retorna os dados deletados

        if (error) {
            console.error("Erro ao deletar salão:", error);
            return res.status(500).json({ error: 'Erro ao deletar salão', details: error.message });
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Salão não encontrado' });
        }

        res.json({ message: 'Salão deletado com sucesso', data: data ? data[0] : null });
    } catch (error) {
        console.error("Erro no servidor ao deletar salão:", error);
        res.status(500).json({ error: "Erro interno do servidor", details: error.message });
    }
});

// Rota para obter a contagem de usuários donos
app.get('/api/usuarios/count', async (req, res) => {
    try {
        const { count, error } = await supabase
            .from('usuario_dono')
            .select('*', { count: 'exact', head: true }); // Contagem exata

        if (error) {
            console.error('Erro ao obter contagem de usuários donos:', error);
            return res.status(500).json({ error: 'Erro ao obter contagem de usuários donos', details: error.message });
        }

        res.json({ count: count });
    } catch (error) {
        console.error('Erro no servidor ao obter contagem de usuários donos:', error);
        res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
});

// Rota para obter todos os usuários donos (READ - All)
// A rota foi alterada de '/api/usuarios_dono' para '/api/usuarios'
app.get('/api/usuarios', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('usuario_dono')
            .select('*');

        if (error) {
            console.error('Erro ao obter usuários donos:', error);
            return res.status(500).json({ error: 'Erro ao obter usuários donos', details: error.message });
        }

        res.json(data);
    } catch (error) {
        console.error('Erro no servidor ao obter usuários donos:', error);
        res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
});

// Rota para obter um usuário dono por ID (READ - Single)
// A rota foi alterada de '/api/usuarios_dono/:id' para '/api/usuarios/:id'
app.get('/api/usuarios/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { data, error } = await supabase
            .from('usuario_dono')
            .select('*')
            .eq('id_dono', id) // Mantém 'id_dono' como a chave primária no DB
            .single();

        if (error) {
            console.error('Erro ao obter usuário dono por ID:', error);
            if (error.code === 'PGRST116' || error.message.includes('rows found')) {
                return res.status(404).json({ error: 'Usuário dono não encontrado' });
            }
            return res.status(500).json({ error: 'Erro ao obter usuário dono', details: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: 'Usuário dono não encontrado' });
        }

        res.json(data);
    } catch (error) {
        console.error('Erro no servidor ao obter usuário dono por ID:', error);
        res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
});

// Rota para criar um novo usuário dono (CREATE)
// A rota foi alterada de '/api/usuarios_dono' para '/api/usuarios'
app.post('/api/usuarios', async (req, res) => {
    // Ajuste nos nomes das variáveis para corresponder ao frontend
    const { nome_completo, email, nome_usuario, cpf, telefone, senha_hash } = req.body;

    // Validação básica dos campos obrigatórios (ajustada para os novos nomes)
    if (!nome_completo || !email || !nome_usuario || !cpf || !telefone || !senha_hash) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios para o cadastro de usuário dono.' });
    }

    try {
        // Criptografa a senha antes de inserir no banco de dados
        const senhaCriptografada = await bcrypt.hash(senha_hash, 10); // Usa senha_hash do frontend

        const { data, error } = await supabase
            .from('usuario_dono')
            .insert([{
                nome_completo, // Corrigido para nome_completo
                email,         // Corrigido para email
                senha_dono: senhaCriptografada, // Mantém o nome da coluna do DB
                nome_usuario,  // Corrigido para nome_usuario
                cpf,           // Corrigido para cpf
                telefone       // Corrigido para telefone
            }])
            .select('*');

        if (error) {
            console.error('Erro ao criar usuário dono:', error);
            if (error.code === '23505') {
                let field = 'campo';
                if (error.message.includes('email')) field = 'e-mail';
                else if (error.message.includes('cpf')) field = 'CPF'; // Assumindo que a coluna é 'cpf' em minúsculas
                else if (error.message.includes('nome_usuario')) field = 'nome de usuário';
                return res.status(409).json({ error: `Este ${field} já está cadastrado.` });
            }
            return res.status(500).json({ error: 'Erro ao criar usuário dono', details: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(500).json({ error: 'Falha ao inserir o usuário dono' });
        }

        res.status(201).json({ message: 'Usuário dono criado com sucesso!', data: data[0] });
    } catch (error) {
        console.error('Erro no servidor ao criar usuário dono:', error);
        res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
});

// Rota para atualizar um usuário dono (UPDATE)
// A rota foi alterada de '/api/usuarios_dono/:id' para '/api/usuarios/:id'
app.put('/api/usuarios/:id', async (req, res) => {
    const id = req.params.id;
    // Ajuste nos nomes das variáveis para corresponder ao frontend
    const { nome_completo, email, nome_usuario, cpf, telefone, senha_hash } = req.body;

    let updateData = {
        nome_completo,
        email,
        nome_usuario,
        cpf,
        telefone
    };

    try {
        // Se uma nova senha for fornecida, criptografa e adiciona aos dados de atualização
        if (senha_hash) { // Usa senha_hash do frontend
            updateData.senha_dono = await bcrypt.hash(senha_hash, 10); // Mantém o nome da coluna do DB
        }

        const { data, error } = await supabase
            .from('usuario_dono')
            .update(updateData)
            .eq('id_dono', id) // Mantém 'id_dono' como a chave primária no DB
            .select('*');

        if (error) {
            console.error('Erro ao atualizar usuário dono:', error);
            if (error.code === 'PGRST116' || error.message.includes('rows found')) {
                return res.status(404).json({ error: 'Usuário dono não encontrado para atualização' });
            }
            if (error.code === '23505') {
                let field = 'campo';
                if (error.message.includes('email')) field = 'e-mail';
                else if (error.message.includes('cpf')) field = 'CPF'; // Assumindo que a coluna é 'cpf' em minúsculas
                else if (error.message.includes('nome_usuario')) field = 'nome de usuário';
                return res.status(409).json({ error: `Este ${field} já está em uso por outro usuário.` });
            }
            return res.status(500).json({ error: 'Erro ao atualizar usuário dono', details: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Usuário dono não encontrado ou nenhum dado para atualizar.' });
        }

        res.json({ message: 'Usuário dono atualizado com sucesso!', data: data[0] });
    } catch (error) {
        console.error('Erro no servidor ao atualizar usuário dono:', error);
        res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
});

// Rota para deletar um usuário dono (DELETE)
// A rota foi alterada de '/api/usuarios_dono/:id' para '/api/usuarios/:id'
app.delete('/api/usuarios/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { data, error } = await supabase
            .from('usuario_dono')
            .delete()
            .eq('id_dono', id) // Mantém 'id_dono' como a chave primária no DB
            .select('*');

        if (error) {
            console.error('Erro ao deletar usuário dono:', error);
            if (error.code === 'PGRST116' || error.message.includes('rows found')) {
                return res.status(404).json({ error: 'Usuário dono não encontrado para exclusão' });
            }
            return res.status(500).json({ error: 'Erro ao deletar usuário dono', details: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Usuário dono não encontrado para exclusão.' });
        }

        res.json({ message: 'Usuário dono deletado com sucesso!', data: data[0] });
    } catch (error) {
        console.error('Erro no servidor ao deletar usuário dono:', error);
        res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
