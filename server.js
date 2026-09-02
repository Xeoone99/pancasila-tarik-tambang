const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname)));

const questionsPool = [
    {
        q: "Gambar lambang Bintang di atas mewakili Pancasila sila ke-...",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Star_of_Pancasila.svg/200px-Star_of_Pancasila.svg.png",
        opts: ["Sila Pertama", "Sila Kedua", "Sila Ketiga", "Sila Keempat"],
        ans: 0
    },
    {
        q: "Gambar Rantai Emas di atas adalah lambang dari sila ke-...",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Chain_of_Pancasila.svg/200px-Chain_of_Pancasila.svg.png",
        opts: ["Sila Pertama", "Sila Kedua", "Sila Ketiga", "Sila Kelima"],
        ans: 1
    },
    {
        q: "Gambar Pohon Beringin di atas merupakan lambang Pancasila sila ke-...",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Banyan_tree_of_Pancasila.svg/200px-Banyan_tree_of_Pancasila.svg.png",
        opts: ["Sila Pertama", "Sila Kedua", "Sila Ketiga", "Sila Keempat"],
        ans: 2
    },
    {
        q: "Gambar Kepala Banteng ini melambangkan sila Pancasila ke-...",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Head_of_Banteng.svg/200px-Head_of_Banteng.svg.png",
        opts: ["Sila Kedua", "Sila Ketiga", "Sila Keempat", "Sila Kelima"],
        ans: 2
    },
    {
        q: "Lambang Padi dan Kapas di atas mewakili Pancasila sila ke-...",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Rice_and_Cotton_of_Pancasila.svg/200px-Rice_and_Cotton_of_Pancasila.svg.png",
        opts: ["Sila Kedua", "Sila Ketiga", "Sila Keempat", "Sila Kelima"],
        ans: 3
    },
    {
        q: "Makna hakiki dari semboyan 'Bhinneka Tunggal Ika' adalah...",
        opts: ["Berbeda-beda tetapi tetap satu jua", "Bersatu kita teguh, bercerai kita runtuh", "Keadilan sosial bagi seluruh rakyat", "Negara yang berdasarkan Ketuhanan"],
        ans: 0
    },
    {
        q: "Sila yang menjadi dasar persatuan bangsa Indonesia di tengah keberagaman etnis, suku, dan budaya adalah...",
        opts: ["Sila Pertama", "Sila Kedua", "Sila Ketiga", "Sila Kelima"],
        ans: 2
    },
    {
        q: "Berikut ini adalah wujud nyata pengamalan Sila Keempat (Kerakyatan) dalam kehidupan berbangsa...",
        opts: ["Menghormati perayaan agama orang lain", "Menyelesaikan masalah melalui musyawarah mufakat", "Gemar menabung dan hidup tidak boros", "Menjaga keamanan dan ketertiban lalu lintas"],
        ans: 1
    },
    {
        q: "Pancasila sebagai 'Ideologi Terbuka' memiliki arti bahwa...",
        opts: ["Dapat diubah kapan saja sesuai kemauan pemimpin", "Menyerap seluruh budaya asing secara bebas mutlak", "Mampu menyesuaikan dinamika zaman tanpa mengubah nilai dasar", "Hanya terbuka untuk golongan dan elit tertentu"],
        ans: 2
    },
    {
        q: "Salah satu pilar utama wawasan kebangsaan Indonesia adalah UUD 1945, yang kedudukannya sebagai...",
        opts: ["Buku sejarah pahlawan bangsa", "Hukum dasar tertulis yang menempati posisi tertinggi", "Kumpulan peraturan daerah", "Dokumen pakta internasional"],
        ans: 1
    },
    {
        q: "Membangun sikap toleransi antar umat beragama adalah perwujudan langsung dari...",
        opts: ["Sila Ketuhanan Yang Maha Esa", "Sila Persatuan Indonesia", "Sila Keadilan Sosial", "Sila Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan"],
        ans: 0
    },
    {
        q: "Sikap rela berkorban untuk kepentingan negara dan bangsa di atas kepentingan pribadi disebut...",
        opts: ["Chauvinisme", "Hedonisme", "Patriotisme", "Etnosentrisme"],
        ans: 2
    },
    {
        q: "Lembaga penyelenggara pemilihan umum di Indonesia yang bersifat nasional, tetap, dan mandiri adalah...",
        opts: ["Mahkamah Konstitusi", "Komisi Pemilihan Umum (KPU)", "Dewan Perwakilan Rakyat (DPR)", "Komisi Pemberantasan Korupsi (KPK)"],
        ans: 1
    },
    {
        q: "Berdasarkan amanat UUD 1945, kedaulatan tertinggi Negara Republik Indonesia berada di tangan...",
        opts: ["Presiden RI", "Majelis Permusyawaratan Rakyat", "Rakyat", "Mahkamah Agung"],
        ans: 2
    }
];

const rooms = {};
const MAX_QUESTIONS = 10;

function generateQuestions() {
    const imgQuestions = questionsPool.filter(q => q.img).sort(() => Math.random() - 0.5).slice(0, 5);
    const textQuestions = questionsPool.filter(q => !q.img).sort(() => Math.random() - 0.5).slice(0, 5);
    return [...imgQuestions, ...textQuestions].sort(() => Math.random() - 0.5);
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
                currentQIndex: 0,
                questions: generateQuestions(),
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
        
        let assignedRole = null;
        
        // Cek slot pemain yang kosong (A = player1, B = player2)
        if (room.players.A === null) {
            assignedRole = 'A';
            room.players.A = { id: socket.id, name: data.playerName, team: 'A' };
        } else if (room.players.B === null) {
            assignedRole = 'B';
            room.players.B = { id: socket.id, name: data.playerName, team: 'B' };
        } else {
            return callback({ success: false, message: 'Room sudah penuh (2 Pemain sudah masuk)!' });
        }

        socket.join(roomCode);
        callback({ success: true, roomCode, role: assignedRole });

        // Update Host and everyone else that someone joined
        io.to(roomCode).emit('playerJoined', {
            players: {
                A: room.players.A ? room.players.A.name : null,
                B: room.players.B ? room.players.B.name : null
            }
        });

        // HANYA mulai game (start_game) jika KEDUA slot terisi
        if (room.players.A !== null && room.players.B !== null && room.state.status === 'waiting') {
            room.state.status = 'playing';
            
            io.to(roomCode).emit('gameStart', {
                players: {
                    A: room.players.A.name,
                    B: room.players.B.name
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
            } else {
                room.state.scoreB += 10;
                room.state.ropePos += 10;
                room.state.totalTimeB += timeTaken;
            }
        } else {
            if (team === 'A') {
                room.state.ropePos += 10;
            } else {
                room.state.ropePos -= 10;
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

    let timeLeft = 15;
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
    io.to(roomCode).emit('gameOver', {
        ropePos: room.state.ropePos,
        scoreA: room.state.scoreA,
        scoreB: room.state.scoreB,
        totalTimeA: room.state.totalTimeA,
        totalTimeB: room.state.totalTimeB
    });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
