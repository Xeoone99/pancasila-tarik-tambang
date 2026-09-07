const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const questionsPool = {
    setA: [
        { q: "Sila pertama Pancasila dilambangkan dengan...", opts: ["Bintang", "Rantai", "Pohon Beringin", "Kepala Banteng"], ans: 0 },
        { q: "Sila kedua berbunyi...", opts: ["Ketuhanan Yang Maha Esa", "Kemanusiaan yang adil dan beradab", "Persatuan Indonesia", "Keadilan sosial"], ans: 1 },
        { q: "Lambang Pohon Beringin memiliki makna...", opts: ["Kekuatan otot", "Tempat berteduh dan persatuan", "Kekayaan alam", "Kejayaan masa lalu"], ans: 1 },
        { q: "Sila keempat dipimpin oleh...", opts: ["Hikmat kebijaksanaan", "Presiden dan Wakil", "Rakyat", "MPR dan DPR"], ans: 0 },
        { q: "Keadilan sosial bagi seluruh rakyat Indonesia dilambangkan dengan...", opts: ["Padi dan Kapas", "Pohon Beringin", "Bintang Emas", "Rantai Baja"], ans: 0 },
        { q: "Pancasila lahir pada tanggal...", opts: ["1 Juni 1945", "17 Agustus 1945", "18 Agustus 1945", "10 November 1945"], ans: 0 },
        { q: "Siapakah penggali Pancasila?", opts: ["Moh. Hatta", "Soekarno", "Ki Hajar Dewantara", "Ahmad Yani"], ans: 1 },
        { q: "Semboyan Bhinneka Tunggal Ika terdapat pada kitab...", opts: ["Sutasoma", "Negarakertagama", "Arjuna Wiwaha", "Ramayana"], ans: 0 },
        { q: "Bhinneka Tunggal Ika berarti...", opts: ["Berbeda-beda tapi satu", "Bersatu kita teguh", "Merdeka atau mati", "Satu nusa satu bangsa"], ans: 0 },
        { q: "Pancasila sebagai dasar negara disahkan pada...", opts: ["18 Agustus 1945", "1 Juni 1945", "22 Juni 1945", "17 Agustus 1945"], ans: 0 }
    ],
    setB: [
        { q: "Dasar negara Indonesia adalah...", opts: ["UUD 1945", "Pancasila", "Bhinneka Tunggal Ika", "Tap MPR"], ans: 1 },
        { q: "Sila ketiga berbunyi...", opts: ["Persatuan Indonesia", "Keadilan Sosial", "Kemanusiaan yang adil", "Ketuhanan yang Maha Esa"], ans: 0 },
        { q: "Lambang sila ke-4 adalah...", opts: ["Bintang", "Kepala Banteng", "Rantai", "Padi dan Kapas"], ans: 1 },
        { q: "Warna latar pada lambang Bintang (Sila ke-1) adalah...", opts: ["Hitam", "Merah", "Putih", "Kuning"], ans: 0 },
        { q: "Rantai pada sila kedua melambangkan...", opts: ["Pengekangan", "Hubungan manusia yang saling membantu", "Kekuatan militer", "Ikatan ekonomi"], ans: 1 },
        { q: "Piagam Jakarta dirumuskan pada tanggal...", opts: ["22 Juni 1945", "1 Juni 1945", "18 Agustus 1945", "17 Agustus 1945"], ans: 0 },
        { q: "Padi pada lambang sila kelima bermakna...", opts: ["Kecukupan pangan", "Kecukupan sandang", "Kekayaan hutan", "Kemakmuran laut"], ans: 0 },
        { q: "Jumlah bulu pada masing-masing sayap Garuda Pancasila adalah...", opts: ["17", "8", "19", "45"], ans: 0 },
        { q: "Jumlah bulu pada ekor Garuda Pancasila adalah...", opts: ["8", "17", "19", "45"], ans: 0 },
        { q: "Garuda Pancasila dirancang oleh...", opts: ["Soekarno", "Sultan Hamid II", "Moh Yamin", "Soepomo"], ans: 1 }
    ],
    setC: [
        { q: "Panitia yang merumuskan Piagam Jakarta disebut...", opts: ["Panitia Sembilan", "PPKI", "BPUPKI", "Panitia Delapan"], ans: 0 },
        { q: "Kata 'Pancasila' diambil dari bahasa...", opts: ["Sanskerta", "Jawa Kuno", "Melayu", "Sunda"], ans: 0 },
        { q: "Burung Garuda menengok ke arah...", opts: ["Kiri", "Kanan", "Depan", "Atas"], ans: 1 },
        { q: "Kapas pada lambang sila kelima bermakna...", opts: ["Kecukupan pangan", "Kecukupan sandang", "Kekayaan alam", "Kelembutan hati"], ans: 1 },
        { q: "Sila yang menekankan musyawarah mufakat adalah...", opts: ["Sila 2", "Sila 3", "Sila 4", "Sila 5"], ans: 2 },
        { q: "Menjaga kerukunan antar umat beragama adalah pengamalan sila ke...", opts: ["1", "2", "3", "5"], ans: 0 },
        { q: "Gotong royong merupakan cerminan dari sila...", opts: ["1", "2", "3", "4"], ans: 2 },
        { q: "Membela tanah air adalah kewajiban yang sesuai dengan sila ke...", opts: ["1", "2", "3", "5"], ans: 2 },
        { q: "Sikap adil terhadap sesama adalah pengamalan sila ke...", opts: ["2", "3", "4", "5"], ans: 3 },
        { q: "Pancasila berkedudukan sebagai...", opts: ["Sumber dari segala sumber hukum", "Hukum adat", "Aturan internasional", "Kebijakan presiden"], ans: 0 }
    ],
    setD: [
        { q: "Tidak memaksakan agama kepada orang lain adalah nilai sila ke...", opts: ["1", "2", "3", "4"], ans: 0 },
        { q: "Suka menabung dan tidak boros adalah pengamalan sila ke...", opts: ["2", "3", "4", "5"], ans: 3 },
        { q: "Berani membela kebenaran dan keadilan mencerminkan sila ke...", opts: ["1", "2", "3", "4"], ans: 1 },
        { q: "Cinta tanah air dan bangsa mencerminkan sila ke...", opts: ["1", "2", "3", "4"], ans: 2 },
        { q: "Menghargai hasil karya orang lain adalah nilai dari sila...", opts: ["2", "3", "4", "5"], ans: 3 },
        { q: "Menerima dan melaksanakan hasil musyawarah adalah wujud sila ke...", opts: ["2", "3", "4", "5"], ans: 2 },
        { q: "Rantai pada sila kedua terdiri atas mata rantai berbentuk...", opts: ["Bulat dan Kotak", "Segitiga dan Bulat", "Persegi dan Lingkaran", "Segilima dan Lingkaran"], ans: 2 },
        { q: "Bintang emas bersudut...", opts: ["4", "5", "6", "8"], ans: 1 },
        { q: "Teks Pancasila dibacakan saat upacara bendera oleh...", opts: ["Pembina upacara", "Pemimpin upacara", "Peserta upacara", "Ajudan"], ans: 0 },
        { q: "Pancasila berfungsi sebagai pandangan hidup bangsa, artinya...", opts: ["Pedoman aktivitas sehari-hari", "Alat pengekang kebebasan", "Simbol negara semata", "Hafalan anak sekolah"], ans: 0 }
    ]
};

const rooms = {};
const MAX_QUESTIONS = 10;
const matchHistory = [];

function generateQuestions(selectedSet) {
    if (selectedSet === 'random') {
        const sets = ['setA', 'setB', 'setC', 'setD'];
        const randomSet = sets[Math.floor(Math.random() * sets.length)];
        return [...questionsPool[randomSet]].sort(() => Math.random() - 0.5);
    }
    if (questionsPool[selectedSet]) {
        return [...questionsPool[selectedSet]].sort(() => Math.random() - 0.5);
    }
    return [...questionsPool.setA].sort(() => Math.random() - 0.5);
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Host creates the room (Kapasitas: 1 Host + 2 Pemain)
    socket.on('createRoom', (data, callback) => {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        rooms[roomCode] = {
            id: roomCode,
            players: {
                host: { id: socket.id, name: data.playerName || 'Host', role: 'host' }, // Entitas terpisah
                A: null, // player1 (Tim Merah)
                B: null  // player2 (Tim Putih)
            },
            state: {
                ropePos: 50,
                scoreA: 0,
                scoreB: 0,
                totalTimeA: 0,
                totalTimeB: 0,
                correctAnswersA: 0,
                correctAnswersB: 0,
                currentQIndex: 0,
                questions: generateQuestions(data.selectedSet || 'random'),
                status: 'waiting', // waiting, playing, ended
                questionStartTime: null
            },
            timers: {}
        };

        socket.join(roomCode);
        callback({ success: true, roomCode, role: 'host' });
    });

    // Players join the room
    socket.on('joinRoom', (data, callback) => {
        const roomCode = data.roomCode.toUpperCase();
        const room = rooms[roomCode];

        if (!room) {
            return callback({ success: false, message: 'Room tidak ditemukan!' });
        }
        
        // 1. Mencegah HOST ikut gabung menjadi pemain
        if (room.players.host.id === socket.id) {
            return callback({ success: false, message: 'Host (Proyektor) tidak boleh ikut bermain sebagai Tim Merah/Putih!' });
        }

        // 2. Mencegah pemain yang sama mengklik "Gabung" berkali-kali (double-join)
        // Ini yang menyebabkan 1 orang menempati 2 slot sekaligus dan game langsung mulai
        if ((room.players.A && room.players.A.id === socket.id) || 
            (room.players.B && room.players.B.id === socket.id)) {
            return callback({ success: false, message: 'Anda sudah masuk ke dalam room ini!' });
        }
        
        let assignedRole = null;
        
        // Cek slot pemain yang kosong (A = player1, B = player2)
        if (room.players.A === null) {
            assignedRole = 'A';
            room.players.A = { id: socket.id, name: data.school || 'Tim Merah', team: 'A' };
        } else if (room.players.B === null) {
            assignedRole = 'B';
            room.players.B = { id: socket.id, name: data.school || 'Tim Putih', team: 'B' };
        } else {
            return callback({ success: false, message: 'Room sudah penuh (2 Pemain sudah masuk)!' });
        }

        socket.join(roomCode);
        callback({ success: true, roomCode, role: assignedRole });

        // Update Host and everyone else that someone joined
        io.to(roomCode).emit('playerJoined', {
            players: {
                A: room.players.A ? { name: room.players.A.name } : null,
                B: room.players.B ? { name: room.players.B.name } : null
            }
        });

        // HANYA mulai game (start_game) jika KEDUA slot terisi
        if (room.players.A !== null && room.players.B !== null && room.state.status === 'waiting') {
            room.state.status = 'playing';
            
            io.to(roomCode).emit('gameStart', {
                players: {
                    A: { name: room.players.A.name },
                    B: { name: room.players.B.name }
                }
            });
            
            setTimeout(() => {
                sendQuestion(roomCode);
            }, 4000); // Wait 4 seconds for countdown
        }
    });

    socket.on('answer', (data) => {
        const { roomCode, team, answerIndex } = data;
        const room = rooms[roomCode];
        
        if (!room || room.state.status !== 'playing') return;

        clearInterval(room.timers.questionTimer);

        const currentQ = room.state.questions[room.state.currentQIndex];
        const isCorrect = (answerIndex === currentQ.ans);
        const timeTaken = room.state.questionStartTime ? (Date.now() - room.state.questionStartTime) : 0;

        // Calculate state change
        if (isCorrect) {
            if (team === 'A') {
                room.state.scoreA += 10;
                room.state.ropePos -= 10;
                room.state.totalTimeA += timeTaken;
                room.state.correctAnswersA++;
            } else {
                room.state.scoreB += 10;
                room.state.ropePos += 10;
                room.state.totalTimeB += timeTaken;
                room.state.correctAnswersB++;
            }
        }

        // Broadcast result to everyone (termasuk host)
        io.to(roomCode).emit('answerResult', {
            team,
            answerIndex,
            isCorrect,
            correctAnswerIndex: currentQ.ans,
            newState: {
                scoreA: room.state.scoreA,
                scoreB: room.state.scoreB,
                ropePos: room.state.ropePos
            }
        });

        room.state.currentQIndex++;

        setTimeout(() => {
            if (room.state.ropePos <= 0 || room.state.ropePos >= 100 || room.state.currentQIndex >= MAX_QUESTIONS) {
                endGame(roomCode);
            } else {
                sendQuestion(roomCode);
            }
        }, 2000);
    });

    socket.on('requestHistory', (callback) => {
        callback({ success: true, history: matchHistory });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

function sendQuestion(roomCode) {
    const room = rooms[roomCode];
    if (!room) return;

    const currentQ = room.state.questions[room.state.currentQIndex];
    // Pastikan event dikirim ke SELURUH KLIEN
    io.to(roomCode).emit('newQuestion', {
        questionNumber: room.state.currentQIndex + 1,
        totalQuestions: MAX_QUESTIONS,
        q: currentQ.q,
        img: currentQ.img || null, // null jika tidak ada
        opts: currentQ.opts
    });

    room.state.questionStartTime = Date.now();

    let timeLeft = 10;
    io.to(roomCode).emit('timerUpdate', timeLeft);
    
    room.timers.questionTimer = setInterval(() => {
        timeLeft--;
        io.to(roomCode).emit('timerUpdate', timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(room.timers.questionTimer);
            handleTimeUp(roomCode);
        }
    }, 1000);
}

function handleTimeUp(roomCode) {
    const room = rooms[roomCode];
    if (!room) return;
    
    const currentQ = room.state.questions[room.state.currentQIndex];

    io.to(roomCode).emit('timeUp', {
        correctAnswerIndex: currentQ.ans,
        newState: {
            scoreA: room.state.scoreA,
            scoreB: room.state.scoreB,
            ropePos: room.state.ropePos
        }
    });

    room.state.currentQIndex++;

    setTimeout(() => {
        if (room.state.ropePos <= 0 || room.state.ropePos >= 100 || room.state.currentQIndex >= MAX_QUESTIONS) {
            endGame(roomCode);
        } else {
            sendQuestion(roomCode);
        }
    }, 3000);
}

function endGame(roomCode) {
    const room = rooms[roomCode];
    if (!room) return;
    
    room.state.status = 'ended';
    
    const nameA = room.players.A ? room.players.A.name : "Tim Merah";
    const nameB = room.players.B ? room.players.B.name : "Tim Putih";
    
    let winner = "Seri";
    if (room.state.correctAnswersA > room.state.correctAnswersB) winner = nameA;
    else if (room.state.correctAnswersB > room.state.correctAnswersA) winner = nameB;
    else if (room.state.totalTimeA < room.state.totalTimeB) winner = nameA;
    else if (room.state.totalTimeB < room.state.totalTimeA) winner = nameB;

    const matchResult = {
        date: new Date().toLocaleString(),
        nameA: nameA,
        nameB: nameB,
        scoreA: room.state.scoreA,
        scoreB: room.state.scoreB,
        correctAnswersA: room.state.correctAnswersA,
        correctAnswersB: room.state.correctAnswersB,
        winner: winner
    };
    
    matchHistory.unshift(matchResult);
    if (matchHistory.length > 20) matchHistory.pop(); // Keep only last 20
    
    io.to(roomCode).emit('gameOver', {
        ropePos: room.state.ropePos,
        scoreA: room.state.scoreA,
        scoreB: room.state.scoreB,
        totalTimeA: room.state.totalTimeA,
        totalTimeB: room.state.totalTimeB,
        correctAnswersA: room.state.correctAnswersA,
        correctAnswersB: room.state.correctAnswersB,
        nameA: nameA,
        nameB: nameB
    });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
