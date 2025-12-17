const GAS_URL = "https://script.google.com/macros/s/AKfycbwR7OwIAmzQikZxAOM2x4hYJNB_6MaBoFqrhdNnn_39GuqinipwFn1v8icxsc5II69-XQ/exec";
const AUTH_ID = "shinorail";
const AUTH_PASS = "12345";

document.addEventListener('DOMContentLoaded', () => {
    // ページ読み込み時に設定を反映（背景色・フォントサイズ同期）
    applySettings();
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const statusArea = document.getElementById('status-area');
    const settingsNav = document.getElementById('settings-nav-btn');

    // ログイン状態によるヘッダー表示の切り替え
    if (isLoggedIn) {
        document.body.classList.add('member-mode');
        if (settingsNav) settingsNav.style.display = 'inline-block';
        if (statusArea) statusArea.innerHTML = `<button onclick="logout()" class="nav-btn">ログアウト</button>`;
    } else {
        if (statusArea) statusArea.innerHTML = `<button onclick="location.href='login.html'" class="nav-btn-primary">会員ログイン</button>`;
    }

    // 各ツールの初期化
    if (document.getElementById('tool-grid')) renderToolGrid(isLoggedIn);
    if (document.getElementById('counter-input')) initCharCounter();
    if (document.getElementById('roulette-result')) initRoulette();
    if (document.getElementById('pass-result')) initPasswordGen();
    if (document.getElementById('memo-area')) initMemo();
});

// ログイン処理（処理中表示付き）
function checkAuth() {
    const btn = document.querySelector('.submit-btn');
    const id = document.getElementById('login-id').value;
    const pass = document.getElementById('login-pass').value;

    if (!id || !pass) { alert("IDとパスワードを入力してください"); return; }

    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "処理中...";

    setTimeout(() => {
        if (id === AUTH_ID && pass === AUTH_PASS) {
            localStorage.setItem('isLoggedIn', 'true');
            location.href = 'index.html';
        } else {
            alert("IDまたはパスワードが違います");
            btn.disabled = false;
            btn.innerText = originalText;
        }
    }, 1000);
}

// 文字数カウンター（フォント自動切替・色変更）
function initCharCounter() {
    const textarea = document.getElementById('counter-input');
    const charDisplay = document.getElementById('char-count');
    const colorPicker = document.getElementById('text-color-picker');

    textarea.addEventListener('input', () => {
        const text = textarea.value;
        charDisplay.innerText = text.length;
        // 日本語判定によるフォント自動切替
        textarea.style.fontFamily = /[ぁ-んァ-ヶー一-龠]/.test(text) 
            ? "'Hiragino Sans', 'Meiryo', sans-serif" 
            : "'Courier New', Courier, monospace";
    });
    if (colorPicker) {
        colorPicker.addEventListener('input', () => { textarea.style.color = colorPicker.value; });
    }
}

// ファイルダウンロード機能
function downloadText() {
    const text = document.getElementById('counter-input').value;
    if (!text) { alert("保存する内容がありません"); return; }
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tool_data_' + new Date().getTime() + '.txt';
    a.click();
}

// 設定の同期と反映
function updateConfig(type, value) {
    localStorage.setItem(type, value);
    applySettings();
}

function applySettings() {
    const color = localStorage.getItem('user-color') || '#4CAF50';
    const font = localStorage.getItem('user-font') || '16px';
    const dark = localStorage.getItem('dark-mode') === 'true';

    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.fontSize = font;
    if (dark) document.body.classList.add('member-mode');
    else document.body.classList.remove('member-mode');
}

// ツール一覧の動的生成
function renderToolGrid(isLoggedIn) {
    const grid = document.getElementById('tool-grid');
    const tools = [
        { name: "📝 文字数カウント", page: "count.html", free: true, icon: "📋" },
        { name: "🎲 ルーレット", page: "roulette.html", free: isLoggedIn, icon: "🎯" },
        { name: "🔐 パスワード生成", page: "pass.html", free: isLoggedIn, icon: "🛡️" },
        { name: "💾 メモ帳", page: "memo.html", free: isLoggedIn, icon: "📁" }
    ];
    grid.innerHTML = tools.map(t => `
        <div class="tool-card ${!t.free ? 'locked' : ''}">
            <div style="font-size: 2rem; margin-bottom: 10px;">${t.icon}</div>
            <h3>${t.name}</h3>
            <button onclick="${t.free ? `location.href='${t.page}'` : "location.href='login.html'"} " class="submit-btn">
                ${t.free ? '起動する' : '会員限定で解放'}
            </button>
        </div>
    `).join('');
}

// ルーレット機能
function runRoulette() {
    const res = document.getElementById('roulette-result');
    res.innerText = "抽選中...";
    setTimeout(() => {
        const items = ["大吉", "中吉", "小吉", "吉", "末吉", "凶"];
        res.innerText = items[Math.floor(Math.random() * items.length)];
    }, 600);
}

// パスワード生成機能
function generatePass() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 16; i++) { pass += chars.charAt(Math.floor(Math.random() * chars.length)); }
    document.getElementById('pass-result').value = pass;
}

// メモ帳保存機能
function initMemo() {
    const memo = document.getElementById('memo-area');
    memo.value = localStorage.getItem('user-memo') || "";
    memo.oninput = () => localStorage.setItem('user-memo', memo.value);
}

// ログアウト処理
function logout() {
    localStorage.clear();
    location.href = 'index.html';
}
