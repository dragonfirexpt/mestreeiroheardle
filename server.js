const express = require('express');
const path = require('path');
const app = express();

// O Render define a porta automaticamente, se não houver, usa a 3000
const PORT = process.env.PORT || 3000;

// Serve os teus arquivos estáticos (html, css, js, musicas)
app.use(express.static(path.join(__dirname, '.')));

// Rota principal para carregar o jogo
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor do Mestre Eiro rodando na porta ${PORT}`);
});