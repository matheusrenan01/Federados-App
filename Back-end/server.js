const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configurações básicas
app.use(cors()); // Permite acesso do frontend
app.use(express.json()); // Permite receber dados em formato JSON

// ==========================================
// BANCO DE DADOS FALSO (Apenas para testes)
// ==========================================
const usuariosDB = [
    { email: "gabriel@ufrpe.br", senha: "123", nome: "Gabriel Almeida", curso: "Engenharia da Computação" }
];

const feedDB = [
    { autor: "Prof. Carlos Augusto", tempo: "Postado agora", titulo: "Bem-vindo ao Federados!", conteudo: "Este é o seu feed de notícias." }
];

// ==========================================
// ROTAS DA API
// ==========================================

// Rota de Login (Recebe email e senha do frontend)
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;

    // Procura o usuário no banco falso
    const usuario = usuariosDB.find(u => u.email === email && u.senha === senha);

    if (usuario) {
        // Login com sucesso! Retorna os dados do usuário.
        res.json({ success: true, message: "Login aprovado!", user: usuario });
    } else {
        // Erro de login
        res.status(401).json({ success: false, message: "Email ou senha incorretos." });
    }
});

// Rota para buscar os posts do Feed
app.get('/api/feed', (req, res) => {
    res.json(feedDB);
});

// Rota para atualizar o Perfil
app.post('/api/perfil', (req, res) => {
    const { nome, curso, bio } = req.body;
    
    // Aqui você salvaria no banco de dados real.
    console.log(`Perfil atualizado: ${nome}, ${curso}`);
    
    res.json({ success: true, message: "Perfil atualizado com sucesso!" });
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});