const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'teu_segredo_super_secreto'; // Mude isto em produção

// Conexão ao MongoDB (Cole sua string aqui ou use variável de ambiente)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://bomba:bombona@cluster0.2nsczvm.mongodb.net/?appName=Cluster0";
mongoose.connect(MONGO_URI).then(() => console.log("MongoDB Conectado"));

// Configuração de Armazenamento de Fotos de Perfil
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '.')));

// Modelo de Utilizador
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '/uploads/default-avatar.png' }
});
const User = mongoose.model('User', UserSchema);

// --- ROTAS DE AUTENTICAÇÃO ---

// Registro
app.post('/api/register', upload.single('avatar'), async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
        
        const newUser = new User({ username, password: hashedPassword, avatar });
        await newUser.save();
        res.status(201).json({ message: "Utilizador criado!" });
    } catch (err) {
        res.status(400).json({ error: "Erro ao registrar. Nome talvez já exista." });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Credenciais inválidas" });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true });
    res.json({ username: user.username, avatar: user.avatar });
});

// Validar Sessão
app.get('/api/me', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Não logado" });
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        res.json(user);
    } catch (err) { res.status(401).json({ error: "Sessão expirada" }); }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Saiu com sucesso" });
});

// Middleware de Fallback
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));