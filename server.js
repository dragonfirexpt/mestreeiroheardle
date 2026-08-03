const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'mestre_eiro_secret_key_99';

// Garantir pasta de uploads
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://bomba:bombona@cluster0.2nsczvm.mongodb.net/mestre_eiro?retryWrites=true&w=majority")
    .then(() => console.log("✅ MongoDB Conectado"))
    .catch(err => console.error("❌ Erro Mongo:", err));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '.')));

// Modelo de Utilizador
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '/uploads/default-avatar.png' },
    wins: { type: Number, default: 0 }
}), 'jogadores_eiro');

// --- ROTAS API ---

app.post('/api/register', multer({ dest: './uploads/' }).single('avatar'), async (req, res) => {
    try {
        const { username, password } = req.body;
        const exists = await User.findOne({ username });
        if (exists) return res.status(400).json({ error: "Nome em uso" });
        
        const hashed = await bcrypt.hash(password, 10);
        const avatarPath = req.file ? `/uploads/${req.file.filename}` : '/uploads/default-avatar.png';
        
        await new User({ username, password: hashed, avatar: avatarPath }).save();
        res.status(201).json({ message: "Criado" });
    } catch (e) { res.status(500).json({ error: "Erro no servidor" }); }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) return res.status(401).json({ error: "Incorreto" });
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true }).json(user);
});

app.get('/api/me', async (req, res) => {
    try {
        const decoded = jwt.verify(req.cookies.token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(401).send();
        res.json(user);
    } catch (e) { res.status(401).send(); }
});

app.post('/api/logout', (req, res) => res.clearCookie('token').send());

// --- LÓGICA MULTIPLAYER ---
const rooms = {};

io.on('connection', (socket) => {
    socket.on('create_room', (data) => {
        const roomId = Math.random().toString(36).substring(2, 7).toUpperCase();
        rooms[roomId] = {
            players: [{ id: socket.id, name: data.username, score: 0 }],
            rondaAtual: 1,
            musicaIndex: null
        };
        socket.join(roomId);
        socket.emit('room_created', roomId);
    });

    socket.on('join_room', (data) => {
        const room = rooms[data.roomId];
        if (room && room.players.length < 2) {
            room.players.push({ id: socket.id, name: data.username, score: 0 });
            socket.join(data.roomId);
            io.to(data.roomId).emit('player_joined', room.players);
        } else {
            socket.emit('error_msg', 'Sala cheia ou inválida');
        }
    });

    socket.on('start_game', (roomId) => {
        if (rooms[roomId]) enviarNovaRonda(roomId);
    });

    socket.on('send_msg', (data) => {
        io.to(data.roomId).emit('receive_msg', data);
    });

    socket.on('correct_guess', (data) => {
        const room = rooms[data.roomId];
        if (!room) return;
        const player = room.players.find(p => p.id === socket.id);
        player.score++;
        
        if (room.rondaAtual >= 10) {
            io.to(data.roomId).emit('game_over', room.players);
            delete rooms[data.roomId];
        } else {
            room.rondaAtual++;
            io.to(data.roomId).emit('update_scores', { winner: player.name, players: room.players });
            setTimeout(() => enviarNovaRonda(data.roomId), 2500);
        }
    });

    function enviarNovaRonda(roomId) {
    const room = rooms[roomId];
    if (!room) return;

    // Usamos um número grande e o cliente faz o % (resto da divisão) 
    // com o tamanho da playlist dele. Assim nunca dá erro de "undefined"
    room.musicaIndex = Math.floor(Math.random() * 1000); 
    
    io.to(roomId).emit('new_round', { 
        index: room.musicaIndex, 
        ronda: room.rondaAtual 
    });
}
});

// Fallback
app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) return next();
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(PORT, () => console.log(`🚀 Servidor na porta ${PORT}`));