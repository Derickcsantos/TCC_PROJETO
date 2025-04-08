const express = require('express');
const cors = require('cors'); // Permite que o front acesse o backend
const supabase = require ('./supabase.js')
const bcrypt = require('bcrypt');
const path = require('path');
const { error } = require('console');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'FrontEnd', 'Views')));

app.post("/cadastro_usuario", async (req,res) => {
    const{nome_completo, email, CPF, telefone, usuario, senha}= req.body;

    console.log("Requisição recebida para /cadastro_usuario", req.body);

    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const userData = {
            nome_dono: nome_completo,
            email_dono: email,
            CPF: CPF,
            telefone_dono: telefone,
            senha_dono: senhaHash,
        };

        const {data, error} = await supabase
        .from("usuario_dono")
        .insert([userData])
        .select("id_dono");

        console.log("Resultado da inserção em usuario_dono", {data, error});

        if(error){
            console.log("Erro ao inserir dados em usuario_dono", error);
            return res.status(500).json({error: error.message});
        }

        // Verifica se o 'data' e 'data[0]' existe antes de acessar 'id_dono'
        const idDono = data && data[0] &&[0].id_dono ? data[0].id_dono: null

        if(idDono){
            res.status(201).json({message: "Usuário dono cadastrado com sucesso", id_dono: idDono})
        } else{
            console.error("Erro: não foi possivel obter o ID do dono após o cadastro");
            return res.status(500).json({error: "Erro ao cadastrar usuario dono: ID Não encontrado"})
        }
    } catch (error){
        console.error("Erro no servidor em cadastro_usuario:", error);
        res.status(500).json({error: error.message})
    }
})
 
app.post('/loginC', async(req, res) => {
    const {email, senhaHash} = req.body;

    console.log('Requisição de login recebidoa', {email, senhaHash})

    try{
        const {data: clientes, error} = await supabase
            .from('clientes')
            .select('senha_cliente')
            .eq('email_cliente', email)

        if (error){
            console.error('Erro do supabase', error);
            return res.status(500).json({error: error.message});
        }
        
        if (clientes.length === 0){
            console.log('Email ou senha incorretos');
            return res.status(401).json({error: 'Email ou senha incorretos'});
        }

        const senhaHasBanco = clientes[0].senha_cliente // Criptogranfo a senha

        const senhaCorreta = await bcrypt.compare(senhaHash, senhaHasBanco);

        if (!senhaCorreta){
            console.log('Email ou senha incorretos');
            return res.status(401).json({error: 'Email ou senha incorretos'});
        }

        console.log('Login realizado com sucesso')
        res.json ({message: 'Login realizado'});
    } catch (error){
        console.error('Erro no servidor', error)
        res.status(500).json({error: error.message});
    }
});

app.post('/clientes', async (req, res) => {
    const{nome_cliente, email_cliente, senha_cliente} = req.body;

    try{
        const senhaHash = await bcrypt.hash(senha_cliente, 10); 

        const {data, error} = await supabase
        .from('clientes')
        .insert([{nome_cliente, email_cliente, senha_cliente: senhaHash}]);

        if (error){
            return res.status(500).json({error: error.message});
        }

        res.status(201).json({message: 'Cliente cadastrado com sucesso'});
    }   catch(error){
        res.status(500).json({error: error.message})
    }
});

app.post("/cadastro_salao", async (req, res) => {
    const{
        nome_salao,
        telefone,
        endereco,
        imagem_url,
        localizacao,
        numero_salao,
        complemento_salao,
    } = req.body;

    console.log("Requisição recebida para /cadastro_salao com os seguintes dados:");
    console.log("req.body", req.body)

    try{
        const {data: localizacaoData, error: localizacaoError} = await supabase
        .from("localizacao")
        .select("id_localizacao")
        .eq("regiao", localizacao)

        console.log("4. Resultado da consulta em localizacao");
        console.log("localizacaoData:", localizacaoData);
        console.log("localizacaoError", localizacaoError);

        if(localizacaoError){
            console.log("Erro ao consultar dados em localizacao", localizacaoError);
            return res.status(500).json({error: localizacaoError.message});
        }

        if(!localizacaoData || localizacaoData.length === 0){
            const errorMessage = "Região não encontrada no banco de dados";
            console.error(errorMessage);
            return res.status(400).json({error: errorMessage});
        }

        const idLocalizacao = localizacaoData[0].id_localizacao;

        const salaoData = {
            nome_salao: nome_salao,
            telefone: telefone,
            endereco: endereco,
            numero_salao: numero_salao,
            complemento_salao: complemento_salao,
            imagem_url: imagem_url,
            dono: idDono,
            localizacao: idLocalizacao,
        };
        console.log("5. Dados para inserção em salão", salaoData);
        const {error: salaoError} = await supabase.from("salao").insert([salaoData]);

        console.log("6. Resultado da inserção em salão:");
        console.log("salaoError:", salaoError);

        if(salonError){
            console.log("Erro ao inserir dados em salão", salaoError);
            return res.status(500).json({error: salaoError.message});
        }

        res.status(201).json({message: "Salão cadastrado com sucesso"});
    } catch (error){
        console.error("Erro no servidor:", error);
        res.status(500).json({error: error.message})
    }

})


app.listen(3000, () =>{
    console.log('Servidor rodando na porta 3000')
})