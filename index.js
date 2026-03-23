const express = require('express');
const produtosRoutes = require('./routes/produtos');

const app = express();
const PORT = 3000;

app.use(express.json());


app.use('/produtos', produtosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

p
