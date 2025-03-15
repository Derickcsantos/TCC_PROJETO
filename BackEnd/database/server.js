const express = require('express');
const cors = require('cors'); // Permite que o front acesse o backend
const supabase = require ('./supabase.js')

const app = express();
app.use(cors());
app.use(express.json());

app.post('/clientes', async (req, res) => {
    const {nome_cliente, email_cliente, telefone_cliente, senha_cliente, região_cliente} = req.body

    // Logando os dados para ver no terminal
    console.log("Dados recebidos do front-end:", {nome_cliente, email_cliente, telefone_cliente, senha_cliente, região_cliente});

    const { data, error } = await supabase
        .from('clientes')
        .insert([{nome_cliente, email_cliente, telefone_cliente, senha_cliente, região_cliente}])

    if(error){
        console.error("Erro ao salvar no banco de dados", error);
        return res.status(500).json({message: 'Erro ao salvar no banco de dados', error})
    }

    res.status(200).json({ message: 'Cadastro realizado com sucesso!', data });
});

app.listen(3000, () =>{
    console.log('Servidor rodando na porta 3000')
})