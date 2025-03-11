import express from 'express';
import cors from 'cors'; // Permite que o front acesse o backend(Evita bloqueios de segurança do navegador)
import supabase from './supabase.js'

const app = express();
app.use(cors());
app.use(express.json());

app.get('/clientes', async (req, res) => {
    const {data, error} = await supabase.from('clientes').select('*');
    if(error) return res.status(500).json(error);
    res.json(data);
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'))

