const express = require("express");
const cors = require("cors");
const supabase = require("./supabase.js");
const bcrypt = require("bcrypt");
const path = require("path");
const { sql } = require("@supabase/supabase-js");
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.static(
    path.join(__dirname, "..", "..", "FrontEnd", "Views", "cadastro_saloes")
  )
);

app.post("/loginC", async (req, res) => {
  const { email, senhaHash } = req.body;

  console.log("Requisição de login recebida para /loginC:", {
    email,
    senhaHash,
  });

  try {
    const { data: clientes, error } = await supabase
      .from("clientes")
      .select("senha_cliente")
      .eq("email_cliente", email);

    if (error) {
      console.error("Erro do Supabase em /loginC:", error);
      return res.status(500).json({ error: error.message });
    }

    if (clientes.length === 0) {
      console.log("Email ou senha incorretos em /loginC");
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const senhaHasBanco = clientes[0].senha_cliente;

    const senhaCorreta = await bcrypt.compare(senhaHash, senhaHasBanco);

    if (!senhaCorreta) {
      console.log("Senha incorreta em /loginC");
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    console.log("Login realizado com sucesso em /loginC");
    res.json({ message: "Login realizado" });
  } catch (error) {
    console.error("Erro no servidor em /loginC:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/clientes", async (req, res) => {
  const { nome_cliente, email_cliente, senha_cliente } = req.body;

  console.log("Requisição recebida para /clientes:", req.body);

  try {
    const senhaHash = await bcrypt.hash(senha_cliente, 10);

    const { data, error } = await supabase
      .from("clientes")
      .insert([{ nome_cliente, email_cliente, senha_cliente: senhaHash }]);

    console.log("Resultado da inserção em /clientes:", { data, error });

    if (error) {
      console.error("Erro do Supabase em /clientes:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: "Cliente cadastrado com sucesso" });
  } catch (error) {
    console.error("Erro no servidor em /clientes:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/cadastro_salao", async (req, res) => {
  const {
    name,
    email,
    CPF,
    "salon-name": salonName,
    username,
    phone,
    address,
    "salon-number": salonNumber,
    complement,
    "salon-phone": salonPhone,
    region,
    password_dono,
  } = req.body;

  console.log("Requisição recebida para /cadastro_salao:", req.body);
  console.log("CPF recebido em /cadastro_salao:", CPF);

  try {
    if (CPF && CPF.length > 20) {
      console.log("Erro: CPF maior que 20 caracteres em /cadastro_salao:", CPF);
      return res.status(400).json({
        error: "CPF muito longo. O tamanho máximo é de 20 caracteres.",
      });
    }

    const senhaHash = await bcrypt.hash(password_dono, 10);
    const donoDataInsert = {
      nome_dono: name,
      email_dono: email,
      CPF: CPF,
      usuario: username,
      senha_dono: senhaHash,
    };
    console.log("Dados para inserção em usuario_dono:", donoDataInsert);

    const { data: donoData, error: donoError } = await supabase
      .from("usuario_dono")
      .insert([donoDataInsert])
      .select("id_dono");

    console.log("Resultado da inserção em usuario_dono:", {
      donoData,
      donoError,
    });

    if (donoError) {
      console.error("Erro ao inserir dados em usuario_dono:", donoError);
      return res.status(500).json({ error: donoError.message });
    }

    const idDono = donoData && donoData[0] ? donoData[0].id_dono : null;

    console.log("Consulta na tabela localizacao com regiao:", region);
    const { data: localizacaoData, error: localizacaoError } = await supabase
      .from("localizacao")
      .select("id_localizacao")
      .eq("regiao", region);

    console.log("Resultado da consulta em localizacao:", {
      localizacaoData,
      localizacaoError,
    });
    if (localizacaoError) {
      console.error(
        "Erro ao consultar dados em localizacao:",
        localizacaoError
      );
      return res.status(500).json({ error: localizacaoError.message });
    }

    const idLocalizacao =
      localizacaoData && localizacaoData[0]
        ? localizacaoData[0].id_localizacao
        : null;

    const salaoDataInsert = {
      nome_salao: salonName,
      telefone: phone,
      endereco: address,
      numero_salao: salonNumber,
      complemento: complement,
      "salon-phone": salonPhone,
      dono: idDono,
      localizacao: idLocalizacao,
    };
    console.log("Dados para inserção em salao:", salaoDataInsert);
    const { error: salaoError } = await supabase
      .from("salao")
      .insert([salaoDataInsert]);

    console.log("Resultado da inserção em salao:", { salaoError });
    if (salonError) {
      console.error("Erro ao inserir dados em salao:", salaoError);
      return res.status(500).json({ error: salaoError.message });
    }

    res.status(201).json({ message: "Salão/Usuário cadastrado com sucesso" });
  } catch (error) {
    console.error("Erro no servidor em /cadastro_salao:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
