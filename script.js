const socket = io();

// Lobby Elements
const lobbyScreen = document.getElementById('lobby-screen');
const waitingScreen = document.getElementById('waiting-screen');
const countdownScreen = document.getElementById('countdown-screen');
const playerNameInput = document.getElementById('player-name');
const roomCodeInput = document.getElementById('room-code-input');
const btnCreateRoom = document.getElementById('btn-create-room');
const btnJoinRoom = document.getElementById('btn-join-room');
const lobbyMessage = document.getElementById('lobby-message');
const displayRoomCode = document.getElementById('display-room-code');
const vsText = document.getElementById('vs-text');
const countdownText = document.getElementById('countdown-text');
const waitPlayerA = document.getElementById('wait-player-a');
const waitPlayerB = document.getElementById('wait-player-b');

// Game Elements
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

// Client State
let myRoom = '';
let myRole = ''; // 'host', 'A', or 'B'
let isLocked = true; 

// -- LOBBY LOGIC --

btnCreateRoom.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim() || 'Host';
    socket.emit('createRoom', { playerName }, (response) => {
        if (response.success) {
            myRoom = response.roomCode;
            myRole = response.role; // 'host'
            lobbyScreen.style.display = 'none';
            waitingScreen.style.display = 'flex';
            displayRoomCode.innerText = myRoom;
            
            // Setup UI for Host
            headerArea.style.display = 'flex';
            ropeArea.style.display = 'flex';
            quizArea.style.display = 'flex';
            boxHost.style.display = 'block';
            
            // Hapus H3 PILIHAN JAWABAN jika ada (sudah dihapus di html tapi amankan di sini)
            const h3Host = boxHost.querySelector('h3');
            if(h3Host) h3Host.style.display = 'none';
        }
    });
});

btnJoinRoom.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    const roomCode = roomCodeInput.value.trim();
    if (!playerName || !roomCode) {
        lobbyMessage.innerText = "Masukkan nama dan kode room!";
        return;
    }
    socket.emit('joinRoom', { playerName, roomCode }, (response) => {
        if (response.success) {
            myRoom = response.roomCode;
            myRole = response.role; // 'A' or 'B'
            lobbyScreen.style.display = 'none';
            waitingScreen.style.display = 'flex';
            displayRoomCode.innerText = myRoom;

            // Setup UI for Players
            headerArea.style.display = 'none'; 
            ropeArea.style.display = 'none'; 
            quizArea.style.display = 'flex'; 
            
            if (myRole === 'A') {
                boxA.style.display = 'block';
                boxB.style.display = 'none';
            } else if (myRole === 'B') {
                boxA.style.display = 'none';
                boxB.style.display = 'block';
            }
        } else {
            lobbyMessage.innerText = response.message;
        }
    });
});

// -- SOCKET EVENT LISTENERS --

socket.on('playerJoined', (data) => {
    if (data.players.A) {
        waitPlayerA.innerText = data.players.A;
        waitPlayerA.style.color = '#ff7777';
    }
    if (data.players.B) {
        waitPlayerB.innerText = data.players.B;
        waitPlayerB.style.color = '#ffffff';
    }
});

socket.on('gameStart', (data) => {
    waitingScreen.style.display = 'none';
    countdownScreen.style.display = 'flex';
    
    nameAEl.innerText = `${data.players.A} (MERAH)`;
    nameBEl.innerText = `${data.players.B} (PUTIH)`;
    vsText.innerText = `${data.players.A} VS ${data.players.B}`;

    let count = 3;
    countdownText.innerText = count;
    countdownText.style.display = 'block';
    
    // Trigger animation awal
    countdownText.classList.remove('animate-pop');
    void countdownText.offsetWidth; // Reflow
    countdownText.classList.add('animate-pop');
    
    const countInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownText.innerText = count;
            countdownText.classList.remove('animate-pop');
            void countdownText.offsetWidth; // Reflow
            countdownText.classList.add('animate-pop');
        } else if (count === 0) {
            countdownText.innerText = "MULAI!";
            countdownText.style.color = "#28a745"; // Ubah warna jadi hijau saat mulai
            countdownText.classList.remove('animate-pop');
            void countdownText.offsetWidth;
            countdownText.classList.add('animate-pop');
        } else {
            clearInterval(countInterval);
            countdownScreen.style.display = 'none';
            countdownText.style.color = "#ffd700"; // Kembalikan ke warna emas
        }
    }, 1000);
});

socket.on('newQuestion', (data) => {
    isLocked = false;
    
    // Update Question
    if (data.img && data.img !== null) {
        questionImgEl.src = data.img;
        questionImgEl.style.display = 'block';
    } else {
        questionImgEl.removeAttribute('src');
        questionImgEl.style.display = 'none';
    }
    
    questionTextEl.innerText = `Soal ${data.questionNumber}/${data.totalQuestions}:\n${data.q}`;

    const hints = ['A', 'B', 'C', 'D'];

    if (myRole === 'host') {
        // RENDER HOST (DISABLED)
        optionsHostContainer.innerHTML = '';
        data.opts.forEach((opt, idx) => {
            optionsHostContainer.innerHTML += `
                <button class="option disabled-option" id="opt-host-${idx}" disabled="true">
                    <span class="key-hint hint-b">${hints[idx]}</span>
                    <span class="opt-text">${opt}</span>
                </button>
            `;
        });
    } else {
        // RENDER PEMAIN (INTERAKTIF)
        optionsAContainer.innerHTML = '';
        optionsBContainer.innerHTML = '';
        
        data.opts.forEach((opt, idx) => {
            if (myRole === 'A') {
                optionsAContainer.innerHTML += `
                    <button class="option" id="opt-${idx}" onclick="handleMouseClick(${idx})">
                        <span class="key-hint hint-a">${hints[idx]}</span>
                        <span class="opt-text">${opt}</span>
                    </button>
                `;
            } else if (myRole === 'B') {
                optionsBContainer.innerHTML += `
                    <button class="option" id="opt-${idx}" onclick="handleMouseClick(${idx})">
                        <span class="key-hint hint-b">${hints[idx]}</span>
                        <span class="opt-text">${opt}</span>
                    </button>
                `;
            }
        });
    }
});

socket.on('timerUpdate', (timeLeft) => {
    timerText.innerText = timeLeft;
    if (timeLeft <= 5) {
        timerText.classList.add('danger');
    } else {
        timerText.classList.remove('danger');
    }
});

socket.on('answerResult', (data) => {
    const { team, answerIndex, isCorrect, correctAnswerIndex, newState } = data;
    updateGameState(newState);

    if (myRole === 'host') {
        const optEl = document.getElementById('opt-host-' + answerIndex);
        if (optEl) {
            if (isCorrect) {
                optEl.classList.add('correct');
            } else {
                optEl.classList.add('wrong');
                const correctEl = document.getElementById('opt-host-' + correctAnswerIndex);
                if (correctEl) correctEl.classList.add('correct');
            }
        }

        if (isCorrect) {
            if (team === 'A') flashBg(bgA, 'flash-green');
            else flashBg(bgB, 'flash-green');
        } else {
            if (team === 'A') flashBg(bgA, 'flash-red');
            else flashBg(bgB, 'flash-red');
        }
    } 
    else {
        // Disable tombol setelah menjawab
        isLocked = true; 
        
        if (team === myRole) {
            const optEl = document.getElementById('opt-' + answerIndex);
            if (optEl) {
                if (myRole === 'A') optEl.classList.add('selected-a');
                if (myRole === 'B') optEl.classList.add('selected-b');
                
                if (isCorrect) {
                    optEl.classList.add('correct');
                    flashBg(myRole === 'A' ? bgA : bgB, 'flash-green');
                } else {
                    optEl.classList.add('wrong');
                    flashBg(myRole === 'A' ? bgA : bgB, 'flash-red');
                    const correctEl = document.getElementById('opt-' + correctAnswerIndex);
                    if (correctEl) correctEl.classList.add('correct');
                }
            }
        }
    }
});

socket.on('timeUp', (data) => {
    isLocked = true;
    questionImgEl.style.display = 'none';
    questionTextEl.innerText = "WAKTU HABIS! Soal Dilewati...";
    updateGameState(data.newState);
    
    // Show correct answer
    if (myRole === 'host') {
        const correctEl = document.getElementById('opt-host-' + data.correctAnswerIndex);
        if (correctEl) correctEl.classList.add('correct');
    } else {
        const correctEl = document.getElementById('opt-' + data.correctAnswerIndex);
        if (correctEl) correctEl.classList.add('correct');
    }
});

socket.on('gameOver', (data) => {
    endOverlay.classList.add('active');
    updateGameState(data);
    
    if (data.ropePos < 50) {
        endTitle.innerHTML = "Selamat Tim A (MERAH) Menang!<br><span style='font-size:36px; font-weight:normal; color:#fff;'>Tarik Tambang Dimenangkan!</span>";
        endTitle.className = 'win-a';
    } else if (data.ropePos > 50) {
        endTitle.innerHTML = "Selamat Tim B (PUTIH) Menang!<br><span style='font-size:36px; font-weight:normal; color:#ddd;'>Tarik Tambang Dimenangkan!</span>";
        endTitle.className = 'win-b';
    } else {
        // Draw logic - compare time
        if (data.totalTimeA < data.totalTimeB) {
            endTitle.innerHTML = "Selamat Tim A (MERAH) Menang!<br><span style='font-size:36px; font-weight:normal; color:#fff;'>Menang Waktu Tercepat!</span>";
            endTitle.className = 'win-a';
        } else if (data.totalTimeB < data.totalTimeA) {
            endTitle.innerHTML = "Selamat Tim B (PUTIH) Menang!<br><span style='font-size:36px; font-weight:normal; color:#ddd;'>Menang Waktu Tercepat!</span>";
            endTitle.className = 'win-b';
        } else {
            endTitle.innerHTML = "PERTANDINGAN SERI!<br><span style='font-size:36px; font-weight:normal; color:#ffd700;'>Skor dan Waktu Imbang!</span>";
            endTitle.className = 'win-draw';
        }
    }
});

// -- INPUT HANDLING --

function handleMouseClick(idx) {
    if (isLocked || myRole === 'host') return;
    isLocked = true;
    
    // Disable semua tombol secara visual sesaat setelah di-klik (sebelum nunggu balasan server)
    const btns = document.querySelectorAll('.option');
    btns.forEach(btn => btn.disabled = true);
    
    socket.emit('answer', { roomCode: myRoom, team: myRole, answerIndex: idx });
}

// -- HELPERS --

function updateGameState(state) {
    scoreAEl.innerText = state.scoreA;
    scoreBEl.innerText = state.scoreB;
    indicator.style.left = Math.max(0, Math.min(100, state.ropePos)) + '%';
}

function flashBg(element, className) {
    if(!element) return;
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, 600);
}
