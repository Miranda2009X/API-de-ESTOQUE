const express = require('express');
const produtosRoutes = require('./routes/produtos');

const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());

// Uso das rotas
app.use('/produtos', produtosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

p