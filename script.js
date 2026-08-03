const socket = io();
let myName = "", myAvatar = "", currentRoom = null, isMulti = false;
let ronda = 1, erros = 0, musicaAtual = null, tempoLiberado = 3, tempoInicioAleatorio = 0;
const playlist = [
    { 
        nome: "Blica de ouro 2", 
        arquivo: "musicas/blica de ouro 2.mp3", 
        status: "Não Lançada",
        feat: "Nenhum", 
        album: "Nenhum" 
    },
    { 
        nome: "Contrato (feat. Patrícia Malícia)", 
        arquivo: "musicas/Contrato (feat. Patrícia Malícia).mp3", 
        status: "Não Lançada", 
        feat: "Patrícia Malícia", 
        album: "Nenhum" 
    },
    { 
        nome: "Dia Ensolarado (feat. Patrícia Malícia & Drezin)", 
        arquivo: "musicas/dia ensolarado.mp3", 
        status: "Não Lançada", 
        feat: "Patrícia Malícia & Drezin", 
        album: "Nenhum" 
    },
     { 
        nome: "Fanta (feat. Afonso Jesus)", 
        arquivo: "musicas/fanta feat afonso jesus pre mix.mp3", 
        status: "Lançada", 
        feat: "Afonso Jesus", 
        album: "CAOS DO EIRÓ" 
    },
    { 
        nome: "Jogador da Bola (feat. Patrícia Malícia)", 
        arquivo: "musicas/jogador da bola (feat. patricia malicia) v4.mp3", 
        status: "Lançada", 
        feat: "Patrícia Malícia", 
        album: "Sons e merdas assim" 
    },
     { 
        nome: "Louis Vuitton", 
        arquivo: "musicas/louis vuitton v3.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
      { 
        nome: "Boca Doce (feat. Pedradas)", 
        arquivo: "musicas/mestre eiro x pedradas.mp3", 
        status: "Lançada", 
        feat: "Pedradas", 
        album: "Sons e merdas assim" 
    },
     { 
        nome: "Roisana v2", 
        arquivo: "musicas/roisana  v2.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
     { 
        nome: "SWAG", 
        arquivo: "musicas/swag v3.mp3", 
        status: "Lançada", 
        feat: "Nenhum", 
        album: "Sons e merdas assim" 
    },
     { 
        nome: "Horta", 
        arquivo: "musicas/test mix.mp3", 
        status: "Lançada", 
        feat: "Nenhum", 
        album: "CAOS DO EIRÓ" 
    },
     { 
        nome: "Zaza (feat. Pedradas)", 
        arquivo: "musicas/zaZA pre mix.mp3", 
        status: "Lançada", 
        feat: "Pedradas", 
        album: "CAOS DO EIRÓ" 
    },
     { 
        nome: "Hannah Montana", 
        arquivo: "musicas/Hannah Montana.mp3", 
        status: "Lançada", 
        feat: "Nenhum", 
        album: "CAOS DO EIRÓ" 
    },
     { 
        nome: "Mesmo Assim (feat. Drezin)", 
        arquivo: "musicas/Mesmo Assim (feat. Drezin).mp3", 
        status: "Lançada", 
        feat: "Drezin", 
        album: "CAOS DO EIRÓ" 
    },
     { 
        nome: "Natal Freestyle (feat. Drezin)", 
        arquivo: "musicas/Natal Freestyle (feat. Drezin).mp3", 
        status: "Não Lançada", 
        feat: "Drezin", 
        album: "Nenhum" 
    },
      { 
        nome: "Falhou", 
        arquivo: "musicas/Falhou.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
     { 
        nome: "Roisana v1", 
        arquivo: "musicas/roisana v1.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
     { 
        nome: "Bistecone Freestyle", 
        arquivo: "musicas/Bistecone Freestyle.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
     { 
        nome: "Dinheiro nas Calças (feat. Drezin)", 
        arquivo: "musicas/Dinheiro nas Calças (feat. Drezin).mp3", 
        status: "Lançada", 
        feat: "Drezin", 
        album: "CAOS DO EIRÓ" 
    },
     { 
        nome: "Dinheiro", 
        arquivo: "musicas/Dinheiro.mp3", 
        status: "Lançada", 
        feat: "Nenhum", 
        album: "Só Sei Dizer Merda" 
    },
      { 
        nome: "Escola do Afonso", 
        arquivo: "musicas/Escola do Afonso.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
     { 
        nome: "O Tempo Vai Para A Frente Mas Tu Contas Para Trás", 
        arquivo: "musicas/O Tempo Vai Para A Frente Mas Tu Contas Para Trás.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
     { 
        nome: "Homem do Momento (feat. Pedradas)", 
        arquivo: "musicas/Homem do Momento (feat. Pedrão Canhão).mp3", 
        status: "Lançada", 
        feat: "Pedrão Canhão", 
        album: "Só Sei Dizer Merda" 
    },
     { 
        nome: "Cão da Rua", 
        arquivo: "musicas/Cão da Rua.mp3", 
        status: "Lançada", 
        feat: "Nenhum", 
        album: "Só Sei Dizer Merda" 
    },
      { 
        nome: "Cartaz (feat. Pedradas & Drezin)", 
        arquivo: "musicas/Cartaz (feat. Pedrão Canhão & Drezin).mp3", 
        status: "Não Lançada", 
        feat: "Pedrão Canhão & Drezin", 
        album: "Nenhum" 
    },
      { 
        nome: "Vida Desgraçada (feat. Drezin & Patrícia Malícia)", 
        arquivo: "musicas/Casa da Porra (feat. Drezin & Patrícia Malícia).mp3", 
        status: "Lançada", 
        feat: "Drezin & Patrícia Malícia", 
        album: "Só Sei Dizer Merda" 
    },
      { 
        nome: "Diss Quim (feat. Drezin)", 
        arquivo: "musicas/Diss Quim (feat. Drezin).mp3", 
        status: "Não Lançada", 
        feat: "Drezin", 
        album: "Nenhum" 
    },
        { 
        nome: "Droga Vazada (feat. Patrícia Malícia)", 
        arquivo: "musicas/Droga Vazada (feat. Patrícia Malícia).mp3", 
        status: "Lançada", 
        feat: "Patrícia Malícia", 
        album: "Só Sei Dizer Merda" 
    },
      { 
        nome: "Menores", 
        arquivo: "musicas/Menores.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
      { 
        nome: "Barras e Barras (feat. Patrícia Malícia)", 
        arquivo: "musicas/Bistecone (feat. Patrícia Malícia).mp3", 
        status: "Lançada", 
        feat: "Patrícia Malícia", 
        album: "Só Sei Dizer Merda" 
    },
     { 
        nome: "Melinda", 
        arquivo: "musicas/Melinda.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
     { 
        nome: "Safada (feat. Pedradas)", 
        arquivo: "musicas/Safada (feat. Pedrão Canhão).mp3", 
        status: "Lançada", 
        feat: "Pedrão Canhão", 
        album: "Só Sei Dizer Merda" 
    },
      { 
        nome: "Bagdá (feat. Patrícia Malícia)", 
        arquivo: "musicas/MESTRE EIRÓ - BAGDÁ (FEAT. PATRÍCIA MALÍCIA).mp3", 
        status: "Lançada", 
        feat: "Patricia Malícia", 
        album: "CAOS DO EIRÓ" 
    },
     { 
        nome: "Sono", 
        arquivo: "musicas/por ai.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
      { 
        nome: "Fome Freestyle", 
        arquivo: "musicas/Fome Freestyle.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
      { 
        nome: "Tyler Freestyle", 
        arquivo: "musicas/Tyler Freestyle.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
      { 
        nome: "Blica de ouro", 
        arquivo: "musicas/blica de ouro.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
      { 
        nome: "roisana v3", 
        arquivo: "musicas/roisana v3.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
      { 
        nome: "Por cima de mim", 
        arquivo: "musicas/por cima de mim.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
      { 
        nome: "Fortuna", 
        arquivo: "musicas/Fortuna.mp3", 
        status: "Lançada", 
        feat: "Nenhum", 
        album: "Sons e merdas assim" 
    },
    { 
        nome: "Bem Saúde", 
        arquivo: "musicas/bemsaude.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
    { 
        nome: "Larica", 
        arquivo: "musicas/larica.mp3", 
        status: "Não Lançada", 
        feat: "Mc China", 
        album: "Nenhum" 
    },
    { 
        nome: "Metanfetamina", 
        arquivo: "musicas/metanfetamina.mp3", 
        status: "Lançada", 
        feat: "Nenhum", 
        album: "Sons e merdas assim" 
    },
    { 
        nome: "Esbanjo", 
        arquivo: "musicas/esbanjo.mp3", 
        status: "Lançada", 
        feat: "Nenhum", 
        album: "Sons e merdas assim" 
    },
    { 
        nome: "Japão", 
        arquivo: "musicas/japao.mp3", 
        status: "Lançada", 
        feat: "Nenhum", 
        album: "Sons e merdas assim" 
    },
    { 
        nome: "Droga pa comprar", 
        arquivo: "musicas/drogapacomprar.mp3", 
        status: "Não Lançada", 
        feat: "Nenhum", 
        album: "Nenhum" 
    },
    
];
const audio = document.getElementById('audioPlayer');

// --- SISTEMA DE AUTENTICAÇÃO ---

async function checkAuth() {
    try {
        const res = await fetch('/api/me');
        if (res.ok) {
            const user = await res.json();
            myName = user.username;
            myAvatar = user.avatar;
            
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('game-screen').style.display = 'flex';
            document.getElementById('main-nav').style.display = 'flex';
            
            document.getElementById('userName').innerText = myName;
            document.getElementById('userAvatar').src = myAvatar;
            
            if(!isMulti) configurarNovaRonda();
        } else {
            document.getElementById('auth-screen').style.display = 'flex';
            document.getElementById('game-screen').style.display = 'none';
            document.getElementById('main-nav').style.display = 'none';
        }
    } catch (e) { console.error("Erro auth"); }
}
checkAuth();

async function login() {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    if (res.ok) window.location.reload();
    else alert("Credenciais erradas!");
}

async function register() {
    const formData = new FormData();
    formData.append('username', document.getElementById('regUser').value);
    formData.append('password', document.getElementById('regPass').value);
    formData.append('avatar', document.getElementById('regAvatar').files[0]);
    
    const res = await fetch('/api/register', { method: 'POST', body: formData });
    if (res.ok) { alert("Conta criada!"); toggleAuth(); }
    else alert("Erro ao criar conta!");
}

function toggleAuth() {
    const l = document.getElementById('login-form');
    const r = document.getElementById('register-form');
    l.style.display = l.style.display === 'none' ? 'block' : 'none';
    r.style.display = r.style.display === 'none' ? 'block' : 'none';
}

async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.reload();
}

// --- LÓGICA DE MULTIPLAYER ---

function createRoom() { socket.emit('create_room', { username: myName }); }
function joinRoom() { 
    const code = document.getElementById('roomInput').value.toUpperCase();
    socket.emit('join_room', { roomId: code, username: myName }); 
}
function startMultiGame() { socket.emit('start_game', currentRoom); }

socket.on('room_created', id => {
    currentRoom = id;
    document.getElementById('displayRoomCode').innerText = id;
    document.getElementById('waiting-room').style.display = 'block';
    document.getElementById('p1').innerText = myName;
});

socket.on('player_joined', p => {
    currentRoom = document.getElementById('displayRoomCode').innerText || currentRoom;
    document.getElementById('waiting-room').style.display = 'block';
    document.getElementById('p1').innerText = p[0].name;
    document.getElementById('p2').innerText = p[1] ? p[1].name : "...";
    if(p.length === 2 && p[0].id === socket.id) document.getElementById('startMultiBtn').style.display = 'block';
});

socket.on('new_round', data => {
    isMulti = true;
    ronda = data.ronda;
    musicaAtual = playlist[data.index % playlist.length];
    document.getElementById('multiplayer-lobby').style.display = 'none';
    document.getElementById('multiplayer-chat').style.display = 'block';
    document.getElementById('duel-score').style.display = 'flex';
    document.getElementById('nameP1').innerText = document.getElementById('p1').innerText;
    document.getElementById('nameP2').innerText = document.getElementById('p2').innerText;
    resetRondaUI();
});

socket.on('update_scores', data => {
    document.getElementById('scoreP1').innerText = data.players[0].score;
    document.getElementById('scoreP2').innerText = data.players[1].score;
    document.getElementById('feedback').innerHTML = `<p style="color:var(--primary)">${data.winner} acertou!</p>`;
});

socket.on('game_over', p => {
    alert(`FIM DE JOGO!\n${p[0].name}: ${p[0].score}\n${p[1].name}: ${p[1].score}`);
    window.location.reload();
});

// --- CHAT ---

function sendChatMessage() {
    const msg = document.getElementById('chatInput').value;
    if(msg && currentRoom) {
        socket.emit('send_msg', { roomId: currentRoom, user: myName, text: msg });
        document.getElementById('chatInput').value = "";
    }
}
socket.on('receive_msg', data => {
    const logs = document.getElementById('chat-messages');
    logs.innerHTML += `<p><b>${data.user}:</b> ${data.text}</p>`;
    logs.scrollTop = logs.scrollHeight;
});

// --- GAMEPLAY CORE ---

function configurarNovaRonda() {
    musicaAtual = playlist[Math.floor(Math.random() * playlist.length)];
    resetRondaUI();
}

function resetRondaUI() {
    erros = 0; tempoLiberado = 3;
    document.getElementById('roundCount').innerText = ronda;
    document.getElementById('timerVal').innerText = "3s";
    document.getElementById('feedback').innerHTML = "";
    document.getElementById('guessInput').value = "";
    document.getElementById('guessBtn').disabled = false;
    document.getElementById('nextBtn').style.display = "none";
    document.getElementById('roundProgressBar').style.width = (ronda * 10) + "%";
    
    audio.src = musicaAtual.arquivo;
    audio.onloadedmetadata = () => {
        tempoInicioAleatorio = Math.random() * (audio.duration - 15);
    };
}

document.getElementById('playBtn').onclick = () => {
    audio.currentTime = tempoInicioAleatorio;
    audio.play();
    document.getElementById('visualizer').classList.add('playing');
    setTimeout(() => {
        audio.pause();
        document.getElementById('visualizer').classList.remove('playing');
    }, tempoLiberado * 1000);
};

document.getElementById('guessInput').oninput = () => {
    const termo = document.getElementById('guessInput').value.toLowerCase();
    const list = document.getElementById('suggestionList');
    list.innerHTML = "";
    if (termo.length > 0) {
        const filtradas = playlist.filter(m => m.nome.toLowerCase().includes(termo));
        filtradas.slice(0, 5).forEach(m => {
            const li = document.createElement('li');
            li.textContent = m.nome;
            li.onclick = () => { 
                document.getElementById('guessInput').value = m.nome; 
                list.style.display = "none"; 
            };
            list.appendChild(li);
        });
        list.style.display = filtradas.length ? "block" : "none";
    } else { list.style.display = "none"; }
};

document.getElementById('guessBtn').onclick = () => {
    const palpite = document.getElementById('guessInput').value.trim();
    if (palpite.toLowerCase() === musicaAtual.nome.toLowerCase()) {
        if (isMulti) socket.emit('correct_guess', { roomId: currentRoom });
        else vencerSolo();
    } else {
        processarErro();
    }
};

function vencerSolo() {
    document.getElementById('feedback').innerHTML = "<p style='color:var(--primary)'>Acertaste!</p>";
    document.getElementById('guessBtn').disabled = true;
    if (ronda < 10) document.getElementById('nextBtn').style.display = "block";
    else alert("Fim do desafio de 10 rondas!");
}

function proximaRondaSolo() {
    ronda++;
    configurarNovaRonda();
}

function processarErro() {
    erros++;
    if (erros < 4) {
        tempoLiberado += 3;
        document.getElementById('timerVal').innerText = tempoLiberado + "s";
        document.getElementById('feedback').innerHTML = "<p style='color:#ffb142'>Errado! Mais tempo liberado.</p>";
    } else {
        document.getElementById('feedback').innerHTML = `<p style='color:#ff4d4d'>Perdeste! A música era: ${musicaAtual.nome}</p>`;
        document.getElementById('guessBtn').disabled = true;
        if (!isMulti) document.getElementById('nextBtn').style.display = "block";
    }
}
