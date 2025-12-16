// ========================================
// グローバル変数
// ========================================
let playerHand = null;
let cpuHand = null;
let gameResult = null;

// ========================================
// DOM要素の取得
// ========================================
const topScreen = document.getElementById('top-screen');
const selectScreen = document.getElementById('select-screen');
const jankenScreen = document.getElementById('janken-screen');
const resultScreen = document.getElementById('result-screen');
const limitScreen = document.getElementById('limit-screen');

const startBtn = document.getElementById('start-btn');
const handBtns = document.querySelectorAll('.hand-btn');
const backFromLimitBtn = document.getElementById('back-from-limit-btn');

const playerHandDisplay = document.getElementById('player-hand');
const cpuHandDisplay = document.getElementById('cpu-hand');
const resultTitle = document.getElementById('result-title');
const currentTimeDisplay = document.getElementById('current-time');
const nextPlayTimeDisplay = document.getElementById('next-play-time');
const resultCharacter = document.getElementById('result-character');

const winMessage = document.getElementById('win-message');
const loseMessage = document.getElementById('lose-message');
const drawMessage = document.getElementById('draw-message');

// 求人情報関連
const jobInfoBtn = document.getElementById('job-info-btn');
const jobInfoSection = document.getElementById('job-info-section');

// ========================================
// ローカルストレージキー
// ========================================
const STORAGE_KEY = 'janken_game_data';

// ========================================
// 手の絵文字マッピング
// ========================================
const handEmoji = {
    rock: '✊',
    scissors: '✌️',
    paper: '✋'
};

// ========================================
// 画面切り替え関数
// ========================================
function switchScreen(hideScreen, showScreen) {
    hideScreen.classList.remove('active');
    showScreen.classList.add('active');
    window.scrollTo(0, 0);
}

// ========================================
// プレイ制限チェック（1日1回）
// ========================================
function checkPlayLimit() {
    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const today = new Date().toDateString();
    
    if (savedData.lastPlayDate === today && savedData.hasPlayed === true) {
        return false;
    }
    
    return true;
}

// ========================================
// プレイ記録を保存
// ========================================
function savePlayRecord() {
    const today = new Date().toDateString();
    const data = {
        lastPlayDate: today,
        hasPlayed: true
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ========================================
// 次回プレイ可能時刻を表示
// ========================================
function showNextPlayTime() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    nextPlayTimeDisplay.textContent = `次回チャレンジは明日0時以降に可能です`;
}

// ========================================
// CPUの手をランダムに決定（難読化）
// ========================================
function _0x1a2b() {
    const _0x3c4d = ['rock', 'scissors', 'paper'];
    const _0x5e6f = Math.floor(Math.random() * _0x3c4d.length);
    return _0x3c4d[_0x5e6f];
}

// ========================================
// 勝敗判定（難読化）
// ========================================
function _0x7g8h(p, c) {
    if (p === c) return 'draw';
    const _0x9i0j = {
        'rock': 'scissors',
        'scissors': 'paper',
        'paper': 'rock'
    };
    return _0x9i0j[p] === c ? 'win' : 'lose';
}

// ========================================
// 現在時刻を更新（リアルタイム表示）
// ========================================
function updateCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    currentTimeDisplay.textContent = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}


// ========================================
// 結果画面を表示
// ========================================
function showResult() {
    // 手を表示
    playerHandDisplay.textContent = handEmoji[playerHand];
    cpuHandDisplay.textContent = handEmoji[cpuHand];
    
    // 結果メッセージを非表示
    winMessage.classList.remove('active');
    loseMessage.classList.remove('active');
    drawMessage.classList.remove('active');
    jobInfoBtn.classList.remove('show');
    jobInfoSection.classList.remove('active');
    
    // キャラクターアニメーション適用
    applyRandomAnimation();
    
    // プレイ記録を保存（1日1回制限）
    savePlayRecord();
    
    // 結果に応じて表示を切り替え
    if (gameResult === 'win') {
        // 勝ち：プレゼント画面 + 求人情報ボタンを表示
        resultTitle.textContent = '🎉 勝ち！ 🎉';
        winMessage.classList.add('active');
        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);
        jobInfoBtn.classList.add('show');
    } else if (gameResult === 'lose') {
        // 負け：求人情報ボタンを表示
        resultTitle.textContent = '😢 負け...';
        loseMessage.classList.add('active');
        jobInfoBtn.classList.add('show');
    } else {
        // あいこ：求人情報ボタンを表示
        resultTitle.textContent = '🤝 あいこ！';
        drawMessage.classList.add('active');
        jobInfoBtn.classList.add('show');
    }
    
    switchScreen(jankenScreen, resultScreen);
}

// ========================================
// じゃんけんアニメーション実行
// ========================================
function playJanken() {
    switchScreen(selectScreen, jankenScreen);
    
    // CPUの手を決定
    cpuHand = _0x1a2b();
    
    // 勝敗判定
    gameResult = _0x7g8h(playerHand, cpuHand);
    
    // 3秒後に結果画面へ
    setTimeout(() => {
        showResult();
    }, 3000);
}

// ========================================
// 求人情報アコーディオンのトグル
// ========================================
function toggleJobInfo() {
    jobInfoSection.classList.toggle('active');
    
    // ボタンテキストを変更
    if (jobInfoSection.classList.contains('active')) {
        jobInfoBtn.textContent = '✕ 閉じる';
        // スムーズにスクロール
        setTimeout(() => {
            jobInfoSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } else {
        jobInfoBtn.textContent = '💼 急募！薬剤師求人を見る';
    }
}

// ========================================
// イベントリスナー設定
// ========================================

// スタートボタン
startBtn.addEventListener('click', () => {
    if (!checkPlayLimit()) {
        showNextPlayTime();
        switchScreen(topScreen, limitScreen);
        return;
    }
    
    switchScreen(topScreen, selectScreen);
});

// 手選択ボタン
handBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        playerHand = btn.getAttribute('data-hand');
        playJanken();
    });
});

// 制限画面からトップへボタン
backFromLimitBtn.addEventListener('click', () => {
    switchScreen(limitScreen, topScreen);
});

// 求人情報ボタン
jobInfoBtn.addEventListener('click', toggleJobInfo);

// ========================================
// 初期化処理
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('じゃんけんゲームを読み込みました（求人情報機能付き）');
    
    // デバッグ用：ストレージをクリア（開発時のみ使用）
    // localStorage.removeItem(STORAGE_KEY);
});
