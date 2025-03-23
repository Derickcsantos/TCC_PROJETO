const express = require('express');
const cors = require('cors'); // Permite que o front acesse o backend
const supabase = require ('./supabase.js')
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('FrontEnd'))

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



app.listen(3000, () =>{
    console.log('Servidor rodando na porta 3000')
})