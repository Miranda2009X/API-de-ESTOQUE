const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/produtos.json');

// Função auxiliar para ler o arquivo JSON
const readData = () => {
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
};

// Função auxiliar para salvar no arquivo JSON
const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// GET /produtos - Listar todos
router.get('/', (req, res) => {
    try {
        const produtos = readData();
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao ler os dados." });
    }
});

// GET /produtos/:id - Buscar por ID
router.get('/:id', (req, res) => {
    const produtos = readData();
    const produto = produtos.find(p => p.id === parseInt(req.params.id));
    
    if (!produto) return res.status(404).json({ mensagem: "Produto não encontrado." });
    
    res.json(produto);
});

// POST /produtos - Cadastrar novo
router.post('/', (req, res) => {
    const { nome, descricao, preco, quantidade, categoria } = req.body;
    const produtos = readData();

    // Validações obrigatórias
    if (!nome || preco === undefined) {
        return res.status(400).json({ mensagem: "Nome e preço são obrigatórios." });
    }
    if (typeof preco !== 'number' || preco <= 0) {
        return res.status(400).json({ mensagem: "Preço deve ser um número maior que zero." });
    }
    if (quantidade !== undefined && (typeof quantidade !== 'number' || quantidade < 0)) {
        return res.status(400).json({ mensagem: "Quantidade deve ser um número inteiro >= 0." });
    }

    const novoProduto = {
        id: produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1,
        nome,
        descricao: descricao || "",
        preco,
        quantidade: quantidade || 0,
        categoria: categoria || "Geral"
    };

    produtos.push(novoProduto);
    writeData(produtos);
    res.status(201).json(novoProduto);
});

// PUT /produtos/:id - Atualizar existente
router.put('/:id', (req, res) => {
    const produtos = readData();
    const index = produtos.findIndex(p => p.id === parseInt(req.params.id));

    if (index === -1) return res.status(404).json({ mensagem: "Produto não encontrado." });

    // Atualiza apenas os campos enviados, exceto o ID
    const { id, ...dadosNovos } = req.body;
    produtos[index] = { ...produtos[index], ...dadosNovos };

    writeData(produtos);
    res.json(produtos[index]);
});

// DELETE /produtos/:id - Remover
router.delete('/:id', (req, res) => {
    const produtos = readData();
    const index = produtos.findIndex(p => p.id === parseInt(req.params.id));

    if (index === -1) return res.status(404).json({ mensagem: "Produto não encontrado." });

    produtos.splice(index, 1);
    writeData(produtos);
    res.json({ mensagem: "Produto removido com sucesso!" });
});

module.exports = router;