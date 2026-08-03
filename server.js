const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// 1. Serve os arquivos estáticos primeiro
app.use(express.static(path.join(__dirname, '.')));

// 2. Rota de captura (ajustada para a nova sintaxe)
// Mudamos de '*' para '/*' ou usamos uma regex para evitar o erro do path-to-regexp
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor do Mestre Eiro rodando na porta ${PORT}`);
});