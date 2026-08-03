const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// 1. Primeiro, tenta servir os arquivos que existem (HTML, CSS, JS, MP3)
app.use(express.static(path.join(__dirname, '.')));

// 2. Se o Express não encontrou o arquivo acima, ele cairá neste "middleware"
// Isso substitui o app.get('*') e evita o erro do path-to-regexp
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});