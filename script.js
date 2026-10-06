// --- NAVIGASI & TAB LOGIC ---
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    
    const activeBtns = document.querySelectorAll(`button[onclick="openTab('${tabId}')"]`);
    activeBtns.forEach(btn => btn.classList.add('active'));

    const mobileSidebar = document.getElementById("mobileSidebar");
    if (mobileSidebar.classList.contains("open")) {
        mobileSidebar.classList.remove("open");
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    const sidebar = document.getElementById("mobileSidebar");
    sidebar.classList.toggle("open");
}

// --- LOGIKA BACKGROUND MUSIC ---
let isPlaying = false;
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicToggle");

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.innerHTML = "🎵";
        musicBtn.style.color = "var(--text-muted)";
        musicBtn.style.textShadow = "none";
        isPlaying = false;
    } else {
        bgMusic.play();
        musicBtn.innerHTML = "🎶";
        musicBtn.style.color = "var(--primary)";
        musicBtn.style.textShadow = "0 0 10px rgba(139, 92, 246, 0.8)";
        isPlaying = true;
    }
}

// --- POP-UP MODAL ENSIKLOPEDIA ---
function bukaPopup(kartu) {
    const gambar = kartu.querySelector('img').src;
    const judul = kartu.querySelector('h3').innerText;
    const deskripsi = kartu.querySelector('p').innerText;

    document.getElementById('gambarPopup').src = gambar;
    document.getElementById('judulPopup').innerText = judul;
    document.getElementById('teksPopup').innerText = deskripsi;

    document.getElementById('kotakPopup').style.display = 'flex';
}

function tutupPopup() {
    document.getElementById('kotakPopup').style.display = 'none';
}

// --- TERMINAL GAME ENGINE: TIME ATTACK ---
const bankSoal = [
    { q: "Standar urutan pin TIA/EIA-568B dimulai dengan warna?", o: ["Putih Hijau", "Putih Orange", "Biru", "Coklat"], a: 1 },
    { q: "Perangkat Layer 3 yang menghubungkan IP berbeda secara dinamis adalah?", o: ["Switch", "Hub", "Router", "Modem"], a: 2 },
    { q: "Protokol yang mendistribusikan IP secara otomatis ke klien disebut?", o: ["DNS", "DHCP", "FTP", "BGP"], a: 1 },
    { q: "Media transmisi data berbasis cahaya dengan redaman paling kecil?", o: ["Kabel Coaxial", "UTP Cat6", "Fiber Optik", "Wireless 5GHz"], a: 2 },
    { q: "Ping atau pengecekan konektivitas menggunakan protokol?", o: ["TCP", "UDP", "ICMP", "ARP"], a: 2 },
    { q: "Tools simulasi infrastruktur visual resmi dari Cisco?", o: ["GNS3", "Packet Tracer", "EVE-NG", "Wireshark"], a: 1 },
    { q: "OS Router yang dikembangkan di Latvia dan populer di ISP/RT-RW Net?", o: ["Cisco IOS", "Junos", "MikroTik RouterOS", "OpenWRT"], a: 2 }
];

let gameTimer;
let timeLeft = 30;
let currentScore = 0;
let activeQuestion = {};

document.addEventListener("DOMContentLoaded", renderLeaderboard);

function startGame() {
    document.getElementById("game-menu").style.display = "none";
    document.getElementById("game-over").style.display = "none";
    document.getElementById("game-play").style.display = "block";
    
    timeLeft = 30;
    currentScore = 0;
    document.getElementById("timer-bar").style.width = "100%";
    document.getElementById("timer-bar").style.backgroundColor = "var(--accent)";
    
    nextQuestion();
    
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById("time-text").innerText = timeLeft + "s";
        
        let percentage = (timeLeft / 30) * 100;
        document.getElementById("timer-bar").style.width = percentage + "%";
        
        if (timeLeft <= 10) {
            document.getElementById("timer-bar").style.backgroundColor = "#EF4444"; 
            document.getElementById("time-text").classList.add("text-red");
        } else {
            document.getElementById("time-text").classList.remove("text-red");
        }
        
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function nextQuestion() {
    const randomIndex = Math.floor(Math.random() * bankSoal.length);
    activeQuestion = bankSoal[randomIndex];
    
    document.getElementById("question-text").innerText = activeQuestion.q;
    const btns = document.querySelectorAll(".btn-terminal");
    
    const labelAbjad = ["A. ", "B. ", "C. ", "D. "];
    for (let i = 0; i < 4; i++) {
        btns[i].innerText = labelAbjad[i] + activeQuestion.o[i];
    }
}

function checkAnswer(selectedIndex) {
    if (selectedIndex === activeQuestion.a) {
        currentScore += 100; 
    } else {
        currentScore -= 20; 
        if (currentScore < 0) currentScore = 0;
    }
    nextQuestion(); 
}

function endGame() {
    clearInterval(gameTimer);
    document.getElementById("game-play").style.display = "none";
    document.getElementById("game-over").style.display = "block";
    document.getElementById("final-score").innerText = currentScore;
}

function saveScore() {
    const name = document.getElementById("playerName").value || "SysAdmin_Anon";
    
    let leaderboard = JSON.parse(localStorage.getItem("netMasterScores")) || [
        { name: "Root_Admin", score: 900 },
        { name: "Cisco_CCNA", score: 750 },
        { name: "MikroTik_MTCNA", score: 500 }
    ];
    
    leaderboard.push({ name: name, score: currentScore });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    
    localStorage.setItem("netMasterScores", JSON.stringify(leaderboard));
    
    resetGameMenu();
}

function resetGameMenu() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("game-menu").style.display = "block";
    document.getElementById("playerName").value = "";
    renderLeaderboard();
}

function renderLeaderboard() {
    const tbody = document.getElementById("leaderboard-body");
    const leaderboard = JSON.parse(localStorage.getItem("netMasterScores")) || [
        { name: "Root_Admin", score: 900 },
        { name: "Cisco_CCNA", score: 750 },
        { name: "MikroTik_MTCNA", score: 500 }
    ];
    
    tbody.innerHTML = "";
    leaderboard.forEach((entry, index) => {
        let rankStr = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;
        tbody.innerHTML += `
            <tr>
                <td>${rankStr}</td>
                <td>${entry.name}</td>
                <td class="text-accent">${entry.score} pts</td>
            </tr>
        `;
    });
}
// --- FITUR PENCARIAN GLOBAL (LIVE SEARCH) ---
function cariKonten(inputId) {
    let input = document.getElementById(inputId).value.toLowerCase();
    let semuaKartu = document.querySelectorAll('.glass-card');
    
    semuaKartu.forEach(kartu => {
        let teksKartu = kartu.innerText.toLowerCase();
        
        if (teksKartu.includes(input)) {
            kartu.style.display = ""; 
        } else {
            kartu.style.display = "none"; 
        }
    });

    if (inputId === 'desktopSearch') {
        document.getElementById('mobileSearch').value = document.getElementById('desktopSearch').value;
    } else if (inputId === 'mobileSearch') {
        document.getElementById('desktopSearch').value = document.getElementById('mobileSearch').value;
    }
}
