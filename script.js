const GAS_URL = "https://script.google.com/macros/s/AKfycbwR7OwIAmzQikZxAOM2x4hYJNB_6MaBoFqrhdNnn_39GuqinipwFn1v8icxsc5II69-XQ/exec";
const AUTH_ID = "shinorail";
const AUTH_PASS = "12345";

document.addEventListener('DOMContentLoaded', () => {
    applySettings(); // 設定反映
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const statusArea = document.getElementById('status-area');
    const settingsNav = document.getElementById('settings-nav-btn');

    if (isLoggedIn) {
        document.body.classList.add('member-mode');
        if (settingsNav) settingsNav.style.display = 'inline-block';
        if (statusArea) statusArea.innerHTML = `<button onclick="logout()" class="nav-btn">ログアウト</button>`;
    } else {
        if (statusArea) statusArea.innerHTML = `<button onclick="location.href='login.html'" class="nav-btn-primary">会員ログイン</button>`;
    }

    if (document.getElementById('tool-grid')) renderToolGrid(isLoggedIn);
    if (document.getElementById('counter-input')) initCharCounter();
    if (document.getElementById('memo-area')) initMemo();
    if (document.getElementById('roulette-result')) initRoulette();
    if (document.getElementById('pass-result')) initPassGen();
});

// ログイン処理（処理中表示）
function checkAuth() {
    const btn = document.querySelector('.submit-btn');
    const id = document.getElementById('login-id').value;
    const pass = document.getElementById('login-pass').value;

    if (!id || !pass) { alert("全て入力してください"); return; }

    btn.disabled = true;
    const originalText = btn.innerText;
    btn.innerText = "認証処理中...";

    setTimeout(() => {
        if (id === AUTH_ID && pass === AUTH_PASS) {
            localStorage.setItem('isLoggedIn', 'true');
            location.href = 'index.html';
        } else {
            alert("IDまたはパスワードが正しくありません");
            btn.disabled = false;
            btn.innerText = originalText;
        }
    }, 1200);
}

// 文字数カウンター（フォント切替・色）
function initCharCounter() {
    const textarea = document.getElementById('counter-input');
    const charDisplay = document.getElementById('char-count');
    const colorPicker = document.getElementById('text-color-picker');

    textarea.addEventListener('input', () => {
        const text = textarea.value;
        charDisplay.innerText = text.length;
        textarea.style.fontFamily = /[ぁ-んァ-ヶー一-龠]/.test(text) ? "'Hiragino Sans', sans-serif" : "'Courier New', monospace";
    });
    if (colorPicker) {
        colorPicker.addEventListener('input', () => { textarea.style.color = colorPicker.value; });
    }
}

// DL機能
function downloadText() {
    const text = document.getElementById('counter-input').value;
    if (!text) return alert("空です");
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data_' + Date.now() + '.txt';
    a.click();
}

// 設定同期
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

// ルーレット
function runRoulette() {
    const res = document.getElementById('roulette-result');
    res.innerText = "抽選中...";
    setTimeout(() => {
        const items = ["大吉", "中吉", "小吉", "吉", "末吉", "凶"];
        res.innerText = items[Math.floor(Math.random() * items.length)];
    }, 600);
}

// パス生成
function generatePass() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 16; i++) { pass += chars.charAt(Math.floor(Math.random() * chars.length)); }
    document.getElementById('pass-result').value = pass;
}

// ツール一覧
function renderToolGrid(isLoggedIn) {
    const grid = document.getElementById('tool-grid');
    const tools = [
        { name: "📝 文字数カウント", page: "count.html", free: true },
        { name: "🎲 ルーレット", page: "roulette.html", free: isLoggedIn },
        { name: "🔐 パス生成", page: "pass.html", free: isLoggedIn },
        { name: "💾 メモ帳", page: "memo.html", free: isLoggedIn }
    ];
    grid.innerHTML = tools.map(t => `
        <div class="tool-card ${!t.free ? 'locked' : ''}">
            <h3>${t.name}</h3>
            <button onclick="${t.free ? `location.href='${t.page}'` : "location.href='login.html'"} " class="submit-btn">
                ${t.free ? '起動' : '会員限定'}
            </button>
        </div>
    `).join('');
}

function logout() { localStorage.clear(); location.href = 'index.html'; }
function initMemo() {
    const m = document.getElementById('memo-area');
    if (!m) return;
    m.value = localStorage.getItem('user-memo') || "";
    m.oninput = () => localStorage.setItem('user-memo', m.value);
}
