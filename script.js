import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue, update, remove, get, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ==========================================
// 1. MASUKKAN KONFIGURASI FIREBASE ANDA DI SINI
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyDkFaaq4Ey8WOK-gSUaGDztf4Cx7aZFVeM",
  authDomain: "game-tarik-tambang-11e67.firebaseapp.com",
  projectId: "game-tarik-tambang-11e67",
  storageBucket: "game-tarik-tambang-11e67.firebasestorage.app",
  messagingSenderId: "31237655152",
  appId: "1:31237655152:web:3b31f3b5a3d8b16effc2b5",
  // Karena Anda akan membuat Database di Singapore (Asia), URL-nya biasanya seperti ini:
  databaseURL: "https://game-tarik-tambang-11e67-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// ==========================================
// 2. INISIALISASI FIREBASE
// ==========================================
// Cek jika belum diisi agar tidak error
let app, db;
if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
} else {
    alert("PERHATIAN: Konfigurasi Firebase belum diisi di script.js! Game tidak akan berfungsi.");
}

// ==========================================
// 3. BANK SOAL (Pindah dari server.js)
// ==========================================
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

const MAX_QUESTIONS = 10;

function generateQuestions(selectedSet) {
    let pool = questionsPool.setA;
    if (questionsPool[selectedSet]) {
        pool = questionsPool[selectedSet];
    } else if (selectedSet === 'random') {
        const sets = ['setA', 'setB', 'setC', 'setD'];
        const randomSet = sets[Math.floor(Math.random() * sets.length)];
        pool = questionsPool[randomSet];
    }
    // Randomize
    return [...pool].sort(() => Math.random() - 0.5).slice(0, MAX_QUESTIONS);
}

// ==========================================
// 4. UI ELEMENTS
// ==========================================
const lobbyScreen = document.getElementById('lobby-screen');
const waitingScreen = document.getElementById('waiting-screen');
const countdownScreen = document.getElementById('countdown-screen');
const roomCodeInput = document.getElementById('room-code-input');
const schoolSelect = document.getElementById('school-select');
const btnCreateRoom = document.getElementById('btn-create-room');
const btnJoinRoom = document.getElementById('btn-join-room');
const lobbyMessage = document.getElementById('lobby-message');
const displayRoomCode = document.getElementById('display-room-code');
const vsText = document.getElementById('vs-text');
const countdownText = document.getElementById('countdown-text');
const waitPlayerA = document.getElementById('wait-player-a');
const waitPlayerB = document.getElementById('wait-player-b');

const headerArea = document.getElementById('header-area');
const ropeArea = document.getElementById('rope-area');
const quizArea = document.getElementById('quiz-area');
const nameAEl = document.getElementById('name-a');
const nameBEl = document.getElementById('name-b');
const scoreAEl = document.getElementById('score-a');
const scoreBEl = document.getElementById('score-b');
const timerText = document.getElementById('timer-text');
const indicator = document.getElementById('indicator');
const questionTextEl = document.getElementById('question-text');
const questionImgEl = document.getElementById('question-img');
const boxHost = document.getElementById('box-host');
const boxA = document.getElementById('box-a');
const boxB = document.getElementById('box-b');
const optionsHostContainer = document.getElementById('options-host');
const optionsAContainer = document.getElementById('options-a');
const optionsBContainer = document.getElementById('options-b');
const bgA = document.getElementById('bg-a');
const bgB = document.getElementById('bg-b');
const endOverlay = document.getElementById('end-overlay');
const endTitle = document.getElementById('end-title');

// Stats Elements
const postGameStats = document.getElementById('post-game-stats');
const statNameA = document.getElementById('stat-name-a');
const statCorrectA = document.getElementById('stat-correct-a');
const statTimeA = document.getElementById('stat-time-a');
const statAvgA = document.getElementById('stat-avg-a');
const statNameB = document.getElementById('stat-name-b');
const statCorrectB = document.getElementById('stat-correct-b');
const statTimeB = document.getElementById('stat-time-b');
const statAvgB = document.getElementById('stat-avg-b');

// History Elements
const btnSettings = document.getElementById('btn-settings');
const historyModal = document.getElementById('history-modal');
const closeHistory = document.getElementById('close-history');
const historyList = document.getElementById('history-list');

// Client State
let myRoom = '';
let myRole = ''; // 'host', 'A', or 'B'
let isLocked = true; 
let hostTimerInterval = null;

// ==========================================
// 4.5. HISTORY MODAL LOGIC
// ==========================================
btnSettings.addEventListener('click', async () => {
    if (!db) return alert("Firebase belum dikonfigurasi!");
    historyModal.style.display = 'flex';
    historyList.innerHTML = '<p style="text-align:center; color:#aaa; margin-top:20px;">Memuat riwayat...</p>';
    
    try {
        const snap = await get(ref(db, 'history'));
        if (!snap.exists()) {
            historyList.innerHTML = '<p style="text-align:center; color:#aaa; margin-top:20px;">Belum ada riwayat pertandingan.</p>';
            return;
        }
        
        const historyData = snap.val();
        const historyArray = Object.values(historyData).sort((a, b) => b.timestamp - a.timestamp); // Sort by newest
        
        historyList.innerHTML = '';
        historyArray.forEach(match => {
            const dateStr = new Date(match.timestamp).toLocaleString('id-ID');
            let winnerClass = '';
            if (match.winner === match.teamA) winnerClass = 'win-a';
            else if (match.winner === match.teamB) winnerClass = 'win-b';
            
            historyList.innerHTML += `
                <div class="history-item ${winnerClass}">
                    <div class="history-info">
                        <p>${dateStr} - Room: ${match.roomCode}</p>
                        <strong>${match.teamA} (${match.scoreA}) vs ${match.teamB} (${match.scoreB})</strong>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size:14px; margin:0; color:#aaa;">Pemenang</p>
                        <strong style="color: #ffd700;">${match.winner}</strong>
                    </div>
                </div>
            `;
        });
    } catch (e) {
        historyList.innerHTML = '<p style="text-align:center; color:#ff4d4d; margin-top:20px;">Gagal memuat riwayat.</p>';
    }
});

closeHistory.addEventListener('click', () => {
    historyModal.style.display = 'none';
});

// Tutup modal jika klik di luar kotak
historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) historyModal.style.display = 'none';
});

// ==========================================
// 5. LOBBY LOGIC
// ==========================================

btnCreateRoom.addEventListener('click', async () => {
    if(!db) return alert("Firebase belum dikonfigurasi! Harap buka file script.js dan masukkan konfigurasi Anda.");
    
    const selectedSet = document.getElementById('question-set-select').value;
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    myRoom = roomCode;
    myRole = 'host';
    
    const initialState = {
        players: { A: null, B: null },
        state: {
            status: 'waiting',
            ropePos: 50,
            scoreA: 0,
            scoreB: 0,
            totalTimeA: 0,
            totalTimeB: 0,
            correctAnswersA: 0,
            correctAnswersB: 0,
            currentQIndex: 0,
            questions: generateQuestions(selectedSet),
            questionStartTime: 0,
            timeLeft: 20,
            actionTrigger: null // Untuk mentrigger animasi benar/salah
        },
        actions: { A: null, B: null }
    };

    await set(ref(db, 'rooms/' + roomCode), initialState);

    // Setup UI
    lobbyScreen.style.display = 'none';
    waitingScreen.style.display = 'flex';
    displayRoomCode.innerText = myRoom;
    
    headerArea.style.display = 'flex';
    ropeArea.style.display = 'flex';
    quizArea.style.display = 'flex';
    boxHost.style.display = 'block';

    listenToRoomAsHost(roomCode);
});

btnJoinRoom.addEventListener('click', async () => {
    if(!db) return alert("Firebase belum dikonfigurasi! Harap buka file script.js dan masukkan konfigurasi Anda.");

    const roomCode = roomCodeInput.value.trim().toUpperCase();
    const school = schoolSelect.value;
    
    if (!roomCode) return lobbyMessage.innerText = "Masukkan kode room!";
    if (!school) return lobbyMessage.innerText = "Pilih sekolah Anda!";
    
    btnJoinRoom.disabled = true;
    
    const roomRef = ref(db, 'rooms/' + roomCode);
    const snapshot = await get(roomRef);
    
    if (!snapshot.exists()) {
        btnJoinRoom.disabled = false;
        return lobbyMessage.innerText = "Room tidak ditemukan!";
    }
    
    const roomData = snapshot.val();
    if (roomData.state.status !== 'waiting') {
        btnJoinRoom.disabled = false;
        return lobbyMessage.innerText = "Game sudah dimulai atau room penuh!";
    }

    let assignedRole = null;
    if (!roomData.players || !roomData.players.A) assignedRole = 'A';
    else if (!roomData.players.B) assignedRole = 'B';
    else {
        btnJoinRoom.disabled = false;
        return lobbyMessage.innerText = "Room sudah penuh (2 Pemain sudah masuk)!";
    }

    myRoom = roomCode;
    myRole = assignedRole;
    
    await update(ref(db, `rooms/${roomCode}/players/${assignedRole}`), { name: school });

    lobbyScreen.style.display = 'none';
    waitingScreen.style.display = 'flex';
    displayRoomCode.innerText = myRoom;

    headerArea.style.display = 'flex'; 
    ropeArea.style.display = 'none'; 
    quizArea.style.display = 'flex'; 
    
    if (myRole === 'A') { boxA.style.display = 'block'; boxB.style.display = 'none'; }
    if (myRole === 'B') { boxA.style.display = 'none'; boxB.style.display = 'block'; }

    listenToRoomAsPlayer(roomCode);
});

// ==========================================
// 6. HOST LOGIC (Bertindak sebagai Server)
// ==========================================
function listenToRoomAsHost(roomCode) {
    const roomRef = ref(db, 'rooms/' + roomCode);
    let hasStarted = false;
    let lastActionTimestamp = 0;

    onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if(!data) return;

        // Start Game if both players joined
        if (!hasStarted && data.players && data.players.A && data.players.B && data.state.status === 'waiting') {
            hasStarted = true;
            startGameAsHost(roomCode, data);
        }

        // Host Handles Answers
        if (data.state.status === 'playing' && data.actions) {
            handlePlayerAnswersAsHost(roomCode, data);
        }
        
        // Update UI Host
        renderState(data);

        // Tampilkan feedback jawaban di Host (Projector)
        if (data.state.actionTrigger && data.state.actionTrigger.timestamp > lastActionTimestamp) {
            lastActionTimestamp = data.state.actionTrigger.timestamp;
            renderFeedback(data.state.actionTrigger);
        }
    });
}

function startGameAsHost(roomCode, data) {
    update(ref(db, `rooms/${roomCode}/state`), { status: 'countdown' });
    
    setTimeout(() => {
        update(ref(db, `rooms/${roomCode}/state`), { 
            status: 'playing',
            questionStartTime: Date.now(),
            timeLeft: 20
        });
        startHostTimer(roomCode);
    }, 4000); // 4 detik countdown
}

function startHostTimer(roomCode) {
    clearInterval(hostTimerInterval);
    hostTimerInterval = setInterval(async () => {
        const snap = await get(ref(db, `rooms/${roomCode}/state`));
        if(!snap.exists()) return clearInterval(hostTimerInterval);
        
        let state = snap.val();
        if(state.status !== 'playing') return clearInterval(hostTimerInterval);

        let newTime = state.timeLeft - 1;
        
        if (newTime <= 0) {
            clearInterval(hostTimerInterval);
            handleTimeUpAsHost(roomCode, state);
        } else {
            update(ref(db, `rooms/${roomCode}/state`), { timeLeft: newTime });
        }
    }, 1000);
}

async function handlePlayerAnswersAsHost(roomCode, data) {
    const state = data.state;
    const actions = data.actions;
    const currentQ = state.questions[state.currentQIndex];

    let actionTrigger = null;

    if (actions.A) {
        clearInterval(hostTimerInterval); // Stop timer
        const isCorrect = (actions.A.answerIndex === currentQ.ans);
        const timeTaken = Date.now() - state.questionStartTime;
        
        if(isCorrect) {
            state.scoreA += 10; state.ropePos -= 10; state.totalTimeA += timeTaken; state.correctAnswersA++;
        }
        actionTrigger = { team: 'A', isCorrect, answerIndex: actions.A.answerIndex, correctAnswerIndex: currentQ.ans, timestamp: Date.now() };
        
        await update(ref(db, `rooms/${roomCode}/actions`), { A: null }); // Clear action
        proceedToNextQuestion(roomCode, state, actionTrigger);
    } 
    else if (actions.B) {
        clearInterval(hostTimerInterval);
        const isCorrect = (actions.B.answerIndex === currentQ.ans);
        const timeTaken = Date.now() - state.questionStartTime;
        
        if(isCorrect) {
            state.scoreB += 10; state.ropePos += 10; state.totalTimeB += timeTaken; state.correctAnswersB++;
        }
        actionTrigger = { team: 'B', isCorrect, answerIndex: actions.B.answerIndex, correctAnswerIndex: currentQ.ans, timestamp: Date.now() };
        
        await update(ref(db, `rooms/${roomCode}/actions`), { B: null }); // Clear action
        proceedToNextQuestion(roomCode, state, actionTrigger);
    }
}

function handleTimeUpAsHost(roomCode, state) {
    const currentQ = state.questions[state.currentQIndex];
    const actionTrigger = { team: 'none', isCorrect: false, answerIndex: -1, correctAnswerIndex: currentQ.ans, timestamp: Date.now() };
    proceedToNextQuestion(roomCode, state, actionTrigger);
}

function proceedToNextQuestion(roomCode, state, actionTrigger) {
    state.currentQIndex++;
    state.actionTrigger = actionTrigger; // Beritahu client soal jawaban
    
    if (state.ropePos <= 0 || state.ropePos >= 100 || state.currentQIndex >= MAX_QUESTIONS) {
        state.status = 'ended';
        update(ref(db, `rooms/${roomCode}/state`), state);
    } else {
        state.status = 'transition';
        update(ref(db, `rooms/${roomCode}/state`), state);
        
        setTimeout(() => {
            state.status = 'playing';
            state.questionStartTime = Date.now();
            state.timeLeft = 20;
            update(ref(db, `rooms/${roomCode}/state`), state);
            startHostTimer(roomCode);
        }, 2500); // 2.5 detik jeda antar soal
    }
}

// ==========================================
// 7. PLAYER LOGIC
// ==========================================
function listenToRoomAsPlayer(roomCode) {
    const roomRef = ref(db, 'rooms/' + roomCode);
    let lastActionTimestamp = 0;

    onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if(!data) return;

        renderState(data);

        // Handle feedback jawaban dari Host (menggunakan actionTrigger)
        if (data.state.actionTrigger && data.state.actionTrigger.timestamp > lastActionTimestamp) {
            lastActionTimestamp = data.state.actionTrigger.timestamp;
            renderFeedback(data.state.actionTrigger);
        }
    });
}

window.handleMouseClick = function(idx) {
    if (isLocked || myRole === 'host') return;
    isLocked = true;
    
    // Matikan semua tombol sementara
    const btns = document.querySelectorAll('.option');
    btns.forEach(btn => btn.disabled = true);
    
    // Kirim aksi ke Firebase
    update(ref(db, `rooms/${myRoom}/actions`), {
        [myRole]: { answerIndex: idx, timestamp: Date.now() }
    });
};

// ==========================================
// 8. RENDERER UMUM (Untuk Host & Player)
// ==========================================
function renderState(data) {
    const state = data.state;

    // Update Lobby Player Names untuk Semua Layar
    if (data.players) {
        if(data.players.A) { waitPlayerA.innerText = data.players.A.name; waitPlayerA.style.color = '#ff7777'; }
        if(data.players.B) { waitPlayerB.innerText = data.players.B.name; waitPlayerB.style.color = '#ffffff'; }
    }

    // Nama & Skor
    if(data.players) {
        nameAEl.innerText = `${data.players.A ? data.players.A.name : 'Tim Merah'} (MERAH)`;
        nameBEl.innerText = `${data.players.B ? data.players.B.name : 'Tim Putih'} (PUTIH)`;
    }
    scoreAEl.innerText = state.scoreA;
    scoreBEl.innerText = state.scoreB;
    indicator.style.left = Math.max(0, Math.min(100, state.ropePos)) + '%';
    
    timerText.innerText = state.timeLeft;
    if (state.timeLeft <= 5) timerText.classList.add('danger');
    else timerText.classList.remove('danger');

    // Layar Menunggu
    if (state.status === 'waiting') {
        waitingScreen.style.display = 'flex';
        countdownScreen.style.display = 'none';
    } 
    // Countdown Awal
    else if (state.status === 'countdown') {
        waitingScreen.style.display = 'none';
        countdownScreen.style.display = 'flex';
        vsText.innerText = `${nameAEl.innerText} VS ${nameBEl.innerText}`;
        
        if (!countdownText.dataset.started) {
            countdownText.dataset.started = "true";
            let count = 3;
            countdownText.innerText = count;
            countdownText.style.display = 'block';
            
            countdownText.classList.remove('animate-pop');
            void countdownText.offsetWidth; // Reflow
            countdownText.classList.add('animate-pop');
            
            const countInterval = setInterval(() => {
                count--;
                if (count > 0) {
                    countdownText.innerText = count;
                    countdownText.classList.remove('animate-pop');
                    void countdownText.offsetWidth;
                    countdownText.classList.add('animate-pop');
                } else if (count === 0) {
                    countdownText.innerText = "MULAI!";
                    countdownText.style.color = "#28a745";
                    countdownText.classList.remove('animate-pop');
                    void countdownText.offsetWidth;
                    countdownText.classList.add('animate-pop');
                } else {
                    clearInterval(countInterval);
                    countdownText.dataset.started = ""; // Reset
                    countdownText.style.color = "#ffd700";
                }
            }, 1000);
        }
    } 
    // Sedang Bermain
    else if (state.status === 'playing') {
        waitingScreen.style.display = 'none';
        countdownScreen.style.display = 'none';
        renderQuestion(state);
    } 
    // Jeda antar soal
    else if (state.status === 'transition') {
        isLocked = true;
    }
    // Selesai
    else if (state.status === 'ended') {
        renderGameOver(data);
    }
}

let lastRenderedQIndex = -1;

function renderQuestion(state) {
    if (state.currentQIndex >= MAX_QUESTIONS) return;
    
    // Hindari render ulang opsi jika soal belum berubah
    if (lastRenderedQIndex === state.currentQIndex) return;
    lastRenderedQIndex = state.currentQIndex;

    isLocked = false;
    const currentQ = state.questions[state.currentQIndex];
    
    questionTextEl.innerText = `Soal ${state.currentQIndex + 1}/${MAX_QUESTIONS}:\n${currentQ.q}`;
    if (currentQ.img) {
        questionImgEl.src = currentQ.img; questionImgEl.style.display = 'block';
    } else {
        questionImgEl.style.display = 'none';
    }

    const hints = ['A', 'B', 'C', 'D'];
    
    if (myRole === 'host') {
        optionsHostContainer.innerHTML = '';
        currentQ.opts.forEach((opt, idx) => {
            optionsHostContainer.innerHTML += `
                <button class="option disabled-option" id="opt-host-${idx}" disabled="true">
                    <span class="key-hint hint-b">${hints[idx]}</span><span class="opt-text">${opt}</span>
                </button>`;
        });
    } else {
        optionsAContainer.innerHTML = '';
        optionsBContainer.innerHTML = '';
        currentQ.opts.forEach((opt, idx) => {
            const btnHTML = `
                <button class="option" id="opt-${idx}" onclick="handleMouseClick(${idx})">
                    <span class="key-hint ${myRole==='A' ? 'hint-a' : 'hint-b'}">${hints[idx]}</span>
                    <span class="opt-text">${opt}</span>
                </button>`;
            if (myRole === 'A') optionsAContainer.innerHTML += btnHTML;
            if (myRole === 'B') optionsBContainer.innerHTML += btnHTML;
        });
    }
}

function renderFeedback(actionTrigger) {
    const { team, isCorrect, answerIndex, correctAnswerIndex } = actionTrigger;

    if (team === 'none') {
        // Waktu habis
        questionTextEl.innerText = "WAKTU HABIS! Soal Dilewati...";
        const correctEl = document.getElementById(myRole === 'host' ? `opt-host-${correctAnswerIndex}` : `opt-${correctAnswerIndex}`);
        if (correctEl) correctEl.classList.add('correct');
        return;
    }

    // Ada yang menjawab
    if (myRole === 'host') {
        const optEl = document.getElementById('opt-host-' + answerIndex);
        if (optEl) {
            if (isCorrect) optEl.classList.add('correct');
            else {
                optEl.classList.add('wrong');
                const correctEl = document.getElementById('opt-host-' + correctAnswerIndex);
                if (correctEl) correctEl.classList.add('correct');
            }
        }
        flashBg(team === 'A' ? bgA : bgB, isCorrect ? 'flash-green' : 'flash-red');
    } else {
        if (team === myRole) {
            const optEl = document.getElementById('opt-' + answerIndex);
            if (optEl) {
                optEl.classList.add(myRole === 'A' ? 'selected-a' : 'selected-b');
                if (isCorrect) optEl.classList.add('correct');
                else {
                    optEl.classList.add('wrong');
                    const correctEl = document.getElementById('opt-' + correctAnswerIndex);
                    if (correctEl) correctEl.classList.add('correct');
                }
            }
            flashBg(myRole === 'A' ? bgA : bgB, isCorrect ? 'flash-green' : 'flash-red');
        } else {
            // Lawan menjawab duluan (tampilkan jawaban yang benar saja)
            questionTextEl.innerText = "Lawan Menjawab Duluan!";
            const correctEl = document.getElementById('opt-' + correctAnswerIndex);
            if (correctEl) correctEl.classList.add('correct');
            flashBg(team === 'A' ? bgA : bgB, isCorrect ? 'flash-green' : 'flash-red');
        }
    }
}

function renderGameOver(data) {
    const state = data.state;
    endOverlay.classList.add('active');
    
    const nameA = data.players.A ? data.players.A.name : "Tim Merah";
    const nameB = data.players.B ? data.players.B.name : "Tim Putih";
    
    if (state.correctAnswersA > state.correctAnswersB) {
        endTitle.innerHTML = `Selamat ${nameA} Menang!`; endTitle.className = 'win-a';
    } else if (state.correctAnswersB > state.correctAnswersA) {
        endTitle.innerHTML = `Selamat ${nameB} Menang!`; endTitle.className = 'win-b';
    } else {
        if (state.totalTimeA < state.totalTimeB) {
            endTitle.innerHTML = `Selamat ${nameA} Menang (Tercepat)!`; endTitle.className = 'win-a';
        } else if (state.totalTimeB < state.totalTimeA) {
            endTitle.innerHTML = `Selamat ${nameB} Menang (Tercepat)!`; endTitle.className = 'win-b';
        } else {
            endTitle.innerHTML = "SERI!"; endTitle.className = 'win-draw';
        }
    }

    statNameA.innerText = nameA; statNameB.innerText = nameB;
    statCorrectA.innerText = state.correctAnswersA; statCorrectB.innerText = state.correctAnswersB;
    
    const timeSecA = Math.round(state.totalTimeA / 1000); const timeSecB = Math.round(state.totalTimeB / 1000);
    statTimeA.innerText = `${timeSecA}s`; statTimeB.innerText = `${timeSecB}s`;
    
    statAvgA.innerText = state.correctAnswersA > 0 ? (timeSecA / state.correctAnswersA).toFixed(1) + 's' : '0s';
    statAvgB.innerText = state.correctAnswersB > 0 ? (timeSecB / state.correctAnswersB).toFixed(1) + 's' : '0s';
    
    postGameStats.style.display = 'flex';

    // Host pushes to history
    if (myRole === 'host') {
        let winnerName = 'SERI';
        if (state.correctAnswersA > state.correctAnswersB) winnerName = nameA;
        else if (state.correctAnswersB > state.correctAnswersA) winnerName = nameB;
        else {
            if (state.totalTimeA < state.totalTimeB) winnerName = nameA;
            else if (state.totalTimeB < state.totalTimeA) winnerName = nameB;
        }

        const matchRecord = {
            timestamp: Date.now(),
            roomCode: myRoom,
            teamA: nameA,
            teamB: nameB,
            scoreA: state.scoreA,
            scoreB: state.scoreB,
            winner: winnerName
        };

        // Hindari push berulang jika renderGameOver dipanggil lebih dari sekali
        if (!window.hasPushedHistory) {
            window.hasPushedHistory = true;
            push(ref(db, 'history'), matchRecord);
        }
    }
}

function flashBg(element, className) {
    if(!element) return;
    element.classList.add(className);
    setTimeout(() => element.classList.remove(className), 600);
}
