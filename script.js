// ========================================
// グローバル変数
// ========================================
let playerHand = null; // プレイヤーが選んだ手
let cpuHand = null; // CPUの手
let gameResult = null; // ゲーム結果（win/lose/draw）

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
const retryBtn = document.getElementById('retry-btn');
const backBtn = document.getElementById('back-btn');
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
    
    // 今日既にプレイしているかチェック
    if (savedData.lastPlayDate === today && savedData.hasPlayed === true) {
        return false; // プレイ不可
    }
    
    return true; // プレイ可能
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
    
    const hours = tomorrow.getHours().toString().padStart(2, '0');
    const minutes = tomorrow.getMinutes().toString().padStart(2, '0');
    
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
// キャラクターにランダムアニメーションを適用
// ========================================
function applyRandomAnimation() {
    const animations = ['random-move-1', 'random-move-2', 'random-move-3'];
    const randomIndex = Math.floor(Math.random() * animations.length);
    resultCharacter.className = 'character';
    resultCharacter.classList.add(animations[randomIndex]);
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
    
    // キャラクターアニメーション適用
    applyRandomAnimation();
    
    // すべての結果でプレイ記録を保存（1日1回制限）
    savePlayRecord();
    
    // 結果に応じて表示を切り替え
    if (gameResult === 'win') {
        resultTitle.textContent = '🎉 勝ち！ 🎉';
        winMessage.classList.add('active');
        updateCurrentTime();
        // 1秒ごとに時刻を更新
        setInterval(updateCurrentTime, 1000);
    } else if (gameResult === 'lose') {
        resultTitle.textContent = '😢 負け...';
        loseMessage.classList.add('active');
    } else {
        resultTitle.textContent = '🤝 あいこ！';
        drawMessage.classList.add('active');
    }
    
    // すべての結果でボタンを非表示
    retryBtn.style.display = 'none';
    backBtn.style.display = 'none';
    
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
// イベントリスナー設定
// ========================================

// スタートボタン
startBtn.addEventListener('click', () => {
    // プレイ制限チェック
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

// もう一度ボタン（使用しない）
retryBtn.addEventListener('click', () => {
    switchScreen(resultScreen, topScreen);
});

// トップへボタン
backBtn.addEventListener('click', () => {
    switchScreen(resultScreen, topScreen);
});

// 制限画面からトップへボタン
backFromLimitBtn.addEventListener('click', () => {
    switchScreen(limitScreen, topScreen);
});

// ========================================
// 初期化処理
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('じゃんけんゲームを読み込みました');
    
    // デバッグ用：ストレージをクリア（開発時のみ使用）
    // localStorage.removeItem(STORAGE_KEY);
});
