const express = require('express');
const app = express();
const cors = require('cors'); // Permite que o front acesse o backend
const supabase = require ('./supabase.js')
const bcrypt = require('bcrypt');
const path = require('path');
const { error } = require('console');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../FrontEnd/Views')));

// Rotas GET
app.get('/', (req, res) => {
    res.send('Servidor está rodando!');
});

// Rota para servir o HTML de cadastro (CORRIGIDA)
app.get('/cadastro_usuario', (req, res) => {
    const filePath = path.join(__dirname, '../../FrontEnd/Views/cadastro_usuario/cadastro_usuario.html');
    console.log('Tentando acessar:', filePath); // Debug
    res.sendFile(filePath);
});
app.post("/cadastro_usuario", async (req,res) => {
    const{nome_completo, email, CPF, telefone, usuario, senha}= req.body;

    console.log("Requisição recebida para /cadastro_usuario", req.body);

    try {

        // Verifica se o usuario já existe
        const {data: usuarioExistente, error: erroConsulta} = await supabase

        .from("usuario_dono")
        .select("id_dono")
        .or(`email_dono.eq.${email},CPF.eq.${CPF},usuario.eq.${usuario}`)
        .maybeSingle();

        if(erroConsulta) throw erroConsulta;
        if(usuarioExistente){
            return res.status(400).json({error: "Usuario, e-mail ou CPF já cadastrado"});
        }

        // Cria hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);
        
        // Insere no banco
        const {data, error} = await supabase
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

        if(error){
            console.log("Erro Supabase", error);
            return res.status(500).json({error: "Erro ao cadastrar", datails: error.message});
        }

        res.status(201).json({
            message: "Dono cadastrado com sucesso",
            id_dono: data[0].id_dono
        });

    } catch (error){
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
app.post('/loginC', async (req, res) => {qq
    const { email, senha } = req.body; // Recebe 'senha' em vez de 'senhaHash'

    try {
        // 1. Busca o usuário no banco
        const { data: cliente, error } = await supabase
            .from('clientes')
            .select('*')
            .eq('email_cliente', email)
            .single(); // Garante que retorna apenas 1 registro

        if (error) {
            console.error("Erro no Supabase:", error);
            return res.status(500).json({èrror: "Erro ao consultar o banco de dados"});
        }

        if (!cliente) {
            return res.status(401).json({ error: 'Email não cadastrado' });
        }

        // 2. Compara a senha com bcrypt
        const senhaValida = await bcrypt.compare(senha, cliente.senha_cliente);
        
        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        // 3. Se tudo ok, retorna sucesso
        const {senha_cliente, ...dadosCliente} = cliente;
        res.status(200).json({
            message: 'Login válido',
            cliente: dadosCliente
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.get('/clientes', (req, res) => {
    const filePath = path.join(__dirname, '../../FrontEnd/Views/cadastro_cliente/cadastro_cliente.html');
    console.log('Tentando acessar:', filePath); // Debug
    res.sendFile(filePath);
});
app.post('/clientes', async (req, res) => {
    const{
        nome_cliente,
        email_cliente,
        telefone_cliente,
        região_cliente,
        senha_cliente
    } = req.body;

    try{
        const senhaHash = await bcrypt.hash(senha_cliente, 10); 

        const {data, error} = await supabase
        .from('clientes')
        .insert([{
            nome_cliente,
            email_cliente,
            telefone_cliente,
            região_cliente,
            senha_cliente: senhaHash
        }]);

        if (error){
            return res.status(500).json({error: error.message});
        }

        res.status(201).json({message: 'Cliente cadastrado com sucesso'});
    }   catch(error){
        res.status(500).json({error: error.message})
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
        console.log("Buscando id_localizacao para a região:", req.body.localizacao); // ADICIONE ESTE LOG

        const { data: localizacaoData, error: localizacaoError } = await supabase
            .from('localizacao')
            .select('id_localizacao')
            .eq('regiao', req.body.localizacao)
            .single();

        console.log("Resultado da busca de localizacaoData:", localizacaoData); // ADICIONE ESTE LOG
        console.log("Erro na busca de localizacaoError:", localizacaoError); // ADICIONE ESTE LOG

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
                localizacao: idLocalizacao,
                dono: Number(req.body.id_dono)
            }])
            .select();

        if (salaoError) throw salaoError;

        res.json({ success: true, id_salao: salaoData[0].id });

    } catch (error) {
        console.error('Erro ao cadastrar salão:', error);
        res.status(500).json({ error: "Erro ao cadastrar salão", details: error.message });
    }
});

app.listen(3000, () =>{
    console.log('Servidor rodando na porta 3000')
})