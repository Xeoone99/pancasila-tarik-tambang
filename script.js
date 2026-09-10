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
        { q: "Pancasila bagi bangsa Indonesia berkedudukan sebagai ....", opts: ["dasar negara dan pandangan hidup bangsa", "peraturan pemerintah", "hukum daerah", "semboyan negara"], ans: 0 },
        { q: "Sikap yang sesuai dengan sila pertama Pancasila di lingkungan sekolah adalah ....", opts: ["memaksakan agama kepada teman", "menghormati teman yang sedang menjalankan ibadah", "memilih teman berdasarkan agama", "melarang teman menjalankan ibadah"], ans: 1 },
        { q: "Ketika terjadi perbedaan pendapat dalam kelompok, sikap yang sesuai dengan nilai Pancasila adalah ....", opts: ["memaksakan pendapat sendiri", "meninggalkan kelompok", "bermusyawarah untuk mencapai mufakat", "menyerahkan keputusan kepada satu orang"], ans: 2 },
        { q: "Semboyan Bhinneka Tunggal Ika memiliki arti ....", opts: ["bersatu kita teguh", "berbeda-beda tetapi tetap satu", "satu bangsa satu budaya", "bersama membangun negara"], ans: 1 },
        { q: "Indonesia memiliki banyak suku, agama, bahasa, dan budaya. Sikap yang tepat terhadap keberagaman tersebut adalah ....", opts: ["menganggap budaya sendiri paling unggul", "menghindari orang yang berbeda suku", "menghargai dan menghormati perbedaan", "memaksakan budaya sendiri kepada orang lain"], ans: 2 },
        { q: "Contoh perilaku yang dapat memperkuat persatuan di sekolah adalah ....", opts: ["membentuk kelompok berdasarkan suku", "memilih teman berdasarkan status sosial", "bekerja sama dalam kegiatan gotong royong", "mengejek budaya daerah lain"], ans: 2 },
        { q: "Negara Indonesia berbentuk ....", opts: ["kerajaan", "republik", "federasi", "monarki"], ans: 1 },
        { q: "Salah satu bentuk bela negara yang dapat dilakukan oleh pelajar adalah ....", opts: ["mengikuti tawuran", "menaati tata tertib dan belajar dengan sungguh-sungguh", "menyebarkan berita bohong", "merusak fasilitas umum"], ans: 1 },
        { q: "Menjaga keutuhan Negara Kesatuan Republik Indonesia merupakan tanggung jawab ....", opts: ["TNI saja", "pemerintah saja", "aparat keamanan saja", "seluruh warga negara"], ans: 3 },
        { q: "Perilaku yang menunjukkan rasa cinta tanah air adalah ....", opts: ["merusak fasilitas umum", "menghargai budaya dan produk dalam negeri", "merendahkan budaya daerah sendiri", "tidak peduli terhadap lingkungan"], ans: 1 },
        { q: "UUD Negara Republik Indonesia Tahun 1945 memiliki kedudukan sebagai ....", opts: ["hukum dasar negara", "peraturan sekolah", "hukum adat", "peraturan daerah"], ans: 0 },
        { q: "Contoh kewajiban seorang pelajar sebagai bagian dari warga negara adalah ....", opts: ["mendapatkan pendidikan", "mendapatkan perlindungan", "menaati peraturan yang berlaku", "memperoleh penghargaan"], ans: 2 },
        { q: "Seorang siswa menemukan informasi yang belum jelas kebenarannya di media sosial. Sikap yang tepat adalah ....", opts: ["langsung menyebarkannya", "menambahkan komentar provokatif", "memeriksa kebenarannya terlebih dahulu", "mengirimkannya ke semua grup"], ans: 2 },
        { q: "Berita palsu yang sengaja dibuat dan disebarkan untuk menyesatkan masyarakat disebut ....", opts: ["fakta", "opini", "hoaks", "aspirasi"], ans: 2 },
        { q: "Gotong royong merupakan salah satu sikap yang penting dalam kehidupan berbangsa karena ....", opts: ["menumbuhkan kerja sama dan persatuan", "membuat seseorang menjadi lebih berkuasa", "menghilangkan keberagaman", "mengutamakan kepentingan pribadi"], ans: 0 },
        { q: "Jika ada teman yang berbeda suku atau budaya diejek oleh teman lainnya, tindakan yang paling tepat adalah ....", opts: ["ikut mengejek", "membiarkannya", "menegur dan mengajak menghargai perbedaan", "membalas dengan mengejek suku pelaku"], ans: 2 },
        { q: "Dalam kehidupan demokratis, perbedaan pendapat sebaiknya diselesaikan melalui ....", opts: ["kekerasan", "musyawarah", "ancaman", "pemaksaan"], ans: 1 },
        { q: "Salah satu bentuk penggunaan kemerdekaan berpendapat yang bertanggung jawab adalah ....", opts: ["menyampaikan pendapat dengan sopan dan berdasarkan fakta", "menghina orang yang berbeda pendapat", "menyebarkan fitnah", "memaksakan pendapat kepada orang lain"], ans: 0 },
        { q: "Wawasan Nusantara mengajarkan bahwa wilayah Indonesia harus dipandang sebagai ....", opts: ["wilayah yang terpisah-pisah", "satu kesatuan wilayah dan bangsa", "kumpulan daerah yang berdiri sendiri", "wilayah yang hanya terdiri dari pulau-pulau besar"], ans: 1 },
        { q: "Perhatikan tindakan berikut: 1. Menghormati perbedaan agama. 2. Melaksanakan gotong royong. 3. Menyebarkan ujaran kebencian. 4. Menjaga fasilitas umum. Perilaku yang mencerminkan wawasan kebangsaan ditunjukkan oleh nomor ....", opts: ["1, 2, dan 4", "1, 3, dan 4", "2 dan 3", "3 dan 4"], ans: 0 }
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

const MAX_QUESTIONS = 20;

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
const hostPasswordInput = document.getElementById('host-password-input');
const schoolSelect = document.getElementById('school-select');
const btnCreateRoom = document.getElementById('btn-create-room');
const btnJoinRoom = document.getElementById('btn-join-room');
const lobbyMessage = document.getElementById('lobby-message');
const displayRoomCode = document.getElementById('display-room-code');
const vsText = document.getElementById('vs-text');
const countdownText = document.getElementById('countdown-text');
const waitPlayerA = document.getElementById('wait-player-a');
const waitPlayerB = document.getElementById('wait-player-b');
const hostControls = document.getElementById('host-controls');
const btnStartGame = document.getElementById('btn-start-game');

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
    
    if (hostPasswordInput.value !== 'kesbangumkt2026') {
        return lobbyMessage.innerText = "Password Host salah!";
    }

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
    boxHost.style.display = 'none';
    boxA.style.display = 'block';
    boxB.style.display = 'block';
    document.querySelector('.box-a h3').innerText = 'JAWABAN TIM MERAH';
    document.querySelector('.box-b h3').innerText = 'JAWABAN TIM PUTIH';

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
    
    if (myRole === 'A') { boxA.style.display = 'block'; boxB.style.display = 'none'; document.querySelector('.box-a h3').innerText = 'PILIHAN JAWABAN ANDA'; }
    if (myRole === 'B') { boxA.style.display = 'none'; boxB.style.display = 'block'; document.querySelector('.box-b h3').innerText = 'PILIHAN JAWABAN ANDA'; }

    listenToRoomAsPlayer(roomCode);
});

if (btnStartGame) {
    btnStartGame.addEventListener('click', async () => {
        if (myRole !== 'host') return;
        const snapshot = await get(ref(db, 'rooms/' + myRoom));
        const data = snapshot.val();
        if (data && data.players && data.players.A && data.players.B && data.state.status === 'waiting') {
            hostControls.style.display = 'none';
            startGameAsHost(myRoom, data);
        }
    });
}

// ==========================================
// 6. HOST LOGIC (Bertindak sebagai Server)
// ==========================================
function listenToRoomAsHost(roomCode) {
    const roomRef = ref(db, 'rooms/' + roomCode);
    let lastActionTimestamp = 0;

    onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if(!data) return;

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
            status: 'reading',
            questionStartTime: Date.now(),
            timeLeft: 5
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
        if(state.status !== 'playing' && state.status !== 'reading') return clearInterval(hostTimerInterval);

        let newTime = state.timeLeft - 1;
        
        if (newTime <= 0) {
            clearInterval(hostTimerInterval);
            if (state.status === 'reading') {
                state.status = 'playing';
                state.timeLeft = 10;
                state.questionStartTime = Date.now();
                update(ref(db, `rooms/${roomCode}/state`), state);
                startHostTimer(roomCode);
            } else if (state.status === 'playing') {
                handleTimeUpAsHost(roomCode, state);
            }
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

    if (actions.A && !state.hasAnsweredA) {
        state.hasAnsweredA = true;
        const isCorrect = (actions.A.answerIndex === currentQ.ans);
        const timeTaken = Date.now() - state.questionStartTime;
        
        if(isCorrect) {
            clearInterval(hostTimerInterval); // Stop timer
            state.scoreA += 10; state.ropePos -= 10; state.totalTimeA += timeTaken; state.correctAnswersA++;
            actionTrigger = { team: 'A', isCorrect, answerIndex: actions.A.answerIndex, correctAnswerIndex: currentQ.ans, reveal: true, timestamp: Date.now() };
            await update(ref(db, `rooms/${roomCode}/actions`), { A: null }); // Clear action
            proceedToNextQuestion(roomCode, state, actionTrigger);
        } else {
            actionTrigger = { team: 'A', isCorrect, answerIndex: actions.A.answerIndex, correctAnswerIndex: currentQ.ans, reveal: !!state.hasAnsweredB, timestamp: Date.now() };
            state.actionTrigger = actionTrigger;
            await update(ref(db, `rooms/${roomCode}/actions`), { A: null });
            await update(ref(db, `rooms/${roomCode}/state`), state);
            
            if (state.hasAnsweredB) {
                clearInterval(hostTimerInterval);
                proceedToNextQuestion(roomCode, state, actionTrigger);
            }
        }
    } 
    else if (actions.B && !state.hasAnsweredB) {
        state.hasAnsweredB = true;
        const isCorrect = (actions.B.answerIndex === currentQ.ans);
        const timeTaken = Date.now() - state.questionStartTime;
        
        if(isCorrect) {
            clearInterval(hostTimerInterval); // Stop timer
            state.scoreB += 10; state.ropePos += 10; state.totalTimeB += timeTaken; state.correctAnswersB++;
            actionTrigger = { team: 'B', isCorrect, answerIndex: actions.B.answerIndex, correctAnswerIndex: currentQ.ans, reveal: true, timestamp: Date.now() };
            await update(ref(db, `rooms/${roomCode}/actions`), { B: null }); // Clear action
            proceedToNextQuestion(roomCode, state, actionTrigger);
        } else {
            actionTrigger = { team: 'B', isCorrect, answerIndex: actions.B.answerIndex, correctAnswerIndex: currentQ.ans, reveal: !!state.hasAnsweredA, timestamp: Date.now() };
            state.actionTrigger = actionTrigger;
            await update(ref(db, `rooms/${roomCode}/actions`), { B: null });
            await update(ref(db, `rooms/${roomCode}/state`), state);
            
            if (state.hasAnsweredA) {
                clearInterval(hostTimerInterval);
                proceedToNextQuestion(roomCode, state, actionTrigger);
            }
        }
    }
}

function handleTimeUpAsHost(roomCode, state) {
    const currentQ = state.questions[state.currentQIndex];
    const actionTrigger = { team: 'none', isCorrect: false, answerIndex: -1, correctAnswerIndex: currentQ.ans, reveal: true, timestamp: Date.now() };
    proceedToNextQuestion(roomCode, state, actionTrigger);
}

function proceedToNextQuestion(roomCode, state, actionTrigger) {
    state.currentQIndex++;
    state.actionTrigger = actionTrigger; // Beritahu client soal jawaban
    state.hasAnsweredA = false;
    state.hasAnsweredB = false;
    
    if (state.ropePos <= 0 || state.ropePos >= 100 || state.currentQIndex >= MAX_QUESTIONS) {
        state.status = 'ended';
        update(ref(db, `rooms/${roomCode}/state`), state);
    } else {
        state.status = 'transition';
        state.timeLeft = 5;
        update(ref(db, `rooms/${roomCode}/state`), state);
        
        clearInterval(hostTimerInterval);
        hostTimerInterval = setInterval(() => {
            state.timeLeft--;
            if (state.timeLeft <= 0) {
                clearInterval(hostTimerInterval);
                state.status = 'reading';
                state.questionStartTime = Date.now();
                state.timeLeft = 5;
                update(ref(db, `rooms/${roomCode}/state`), state);
                startHostTimer(roomCode);
            } else {
                update(ref(db, `rooms/${roomCode}/state`), { timeLeft: state.timeLeft });
            }
        }, 1000);
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
        
        if (myRole === 'host' && data.players && data.players.A && data.players.B) {
            if (hostControls) hostControls.style.display = 'block';
        } else {
            if (hostControls) hostControls.style.display = 'none';
        }
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
    // Sedang Bermain atau Membaca atau Transition
    else if (['reading', 'playing', 'transition'].includes(state.status)) {
        waitingScreen.style.display = 'none';
        countdownScreen.style.display = 'none';
        
        if (lastRenderedQIndex !== state.currentQIndex || window.lastRenderedStatus !== state.status) {
            if (state.status !== 'transition' || lastRenderedQIndex !== state.currentQIndex) {
                renderQuestion(state);
            }
        }
        
        if (state.status === 'transition' || state.status === 'reading') isLocked = true;
    }
    // Selesai
    else if (state.status === 'ended') {
        renderGameOver(data);
    }
}

let lastRenderedQIndex = -1;

function renderQuestion(state) {
    if (state.currentQIndex >= MAX_QUESTIONS) return;
    
    lastRenderedQIndex = state.currentQIndex;
    window.lastRenderedStatus = state.status;

    isLocked = (state.status === 'reading');
    const currentQ = state.questions[state.currentQIndex];
    
    questionTextEl.innerText = `Soal ${state.currentQIndex + 1}/${MAX_QUESTIONS}:\n${currentQ.q}`;
    if (currentQ.img) {
        questionImgEl.src = currentQ.img; questionImgEl.style.display = 'block';
    } else {
        questionImgEl.style.display = 'none';
    }

    const hints = ['A', 'B', 'C', 'D'];
    
    if (myRole === 'host') {
        optionsAContainer.innerHTML = '';
        optionsBContainer.innerHTML = '';
        currentQ.opts.forEach((opt, idx) => {
            const optContent = state.status === 'reading' ? '...' : opt;
            optionsAContainer.innerHTML += `
                <button class="option disabled-option" id="opt-host-a-${idx}" disabled="true">
                    <span class="key-hint hint-a">${hints[idx]}</span><span class="opt-text">${optContent}</span>
                </button>`;
            optionsBContainer.innerHTML += `
                <button class="option disabled-option" id="opt-host-b-${idx}" disabled="true">
                    <span class="key-hint hint-b">${hints[idx]}</span><span class="opt-text">${optContent}</span>
                </button>`;
        });
    } else {
        optionsAContainer.innerHTML = '';
        optionsBContainer.innerHTML = '';
        currentQ.opts.forEach((opt, idx) => {
            const optContent = state.status === 'reading' ? '...' : opt;
            const btnHTML = `
                <button class="option" id="opt-${idx}" onclick="handleMouseClick(${idx})">
                    <span class="key-hint ${myRole==='A' ? 'hint-a' : 'hint-b'}">${hints[idx]}</span>
                    <span class="opt-text">${optContent}</span>
                </button>`;
            if (myRole === 'A') optionsAContainer.innerHTML += btnHTML;
            if (myRole === 'B') optionsBContainer.innerHTML += btnHTML;
        });
    }
}

function renderFeedback(actionTrigger) {
    const { team, isCorrect, answerIndex, correctAnswerIndex, reveal } = actionTrigger;

    if (team === 'none') {
        // Waktu habis
        questionTextEl.innerText = "WAKTU HABIS! Soal Dilewati...";
        if (myRole === 'host') {
            const correctElA = document.getElementById(`opt-host-a-${correctAnswerIndex}`);
            const correctElB = document.getElementById(`opt-host-b-${correctAnswerIndex}`);
            if (correctElA) correctElA.classList.add('correct');
            if (correctElB) correctElB.classList.add('correct');
        } else {
            const correctEl = document.getElementById(`opt-${correctAnswerIndex}`);
            if (correctEl) correctEl.classList.add('correct');
        }
        return;
    }

    // Ada yang menjawab
    if (myRole === 'host') {
        const optEl = document.getElementById(`opt-host-${team.toLowerCase()}-${answerIndex}`);
        if (optEl) {
            optEl.classList.add(team === 'A' ? 'selected-a' : 'selected-b');
            if (isCorrect) optEl.classList.add('correct');
            else {
                optEl.classList.add('wrong');
                if (reveal) {
                    const correctElA = document.getElementById(`opt-host-a-${correctAnswerIndex}`);
                    const correctElB = document.getElementById(`opt-host-b-${correctAnswerIndex}`);
                    if (correctElA) correctElA.classList.add('correct');
                    if (correctElB) correctElB.classList.add('correct');
                }
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
                    if (reveal) {
                        const correctEl = document.getElementById('opt-' + correctAnswerIndex);
                        if (correctEl) correctEl.classList.add('correct');
                    }
                }
            }
            flashBg(myRole === 'A' ? bgA : bgB, isCorrect ? 'flash-green' : 'flash-red');
        } else {
            // Lawan menjawab
            if (isCorrect) {
                questionTextEl.innerText = "Lawan Menjawab Benar!";
                isLocked = true;
                const correctEl = document.getElementById('opt-' + correctAnswerIndex);
                if (correctEl) correctEl.classList.add('correct');
                flashBg(team === 'A' ? bgA : bgB, 'flash-green');
            } else {
                questionTextEl.innerText = "Lawan Menjawab Salah! Kesempatan Anda!";
                const optEl = document.getElementById('opt-' + answerIndex);
                if (optEl) optEl.classList.add('wrong');
                if (reveal) {
                    const correctEl = document.getElementById('opt-' + correctAnswerIndex);
                    if (correctEl) correctEl.classList.add('correct');
                }
                flashBg(team === 'A' ? bgA : bgB, 'flash-red');
            }
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
