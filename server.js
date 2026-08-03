const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// 1. Servir arquivos estáticos (CSS, JS, Músicas)
app.use(express.static(path.join(__dirname, '.')));

// 2. Rota Curinga (Sintaxe para Express 5.0+)
// O ":slug" dá um nome ao parâmetro, e o "*" diz que pode ser qualquer coisa.
app.get('/:slug*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});