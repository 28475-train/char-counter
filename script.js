const GAS_URL = "https://script.google.com/macros/s/AKfycbwR7OwIAmzQikZxAOM2x4hYJNB_6MaBoFqrhdNnn_39GuqinipwFn1v8icxsc5II69-XQ/exec";
const AUTH_ID = "shinorail";
const AUTH_PASS = "12345";

document.addEventListener('DOMContentLoaded', () => {
    // 1. 設定の反映（全ページ共通）
    applySettings();
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const statusArea = document.getElementById('status-area');
    const settingsNav = document.getElementById('settings-nav-btn');

    // 2. ログイン状態の反映
    if (isLoggedIn) {
        document.body.classList.add('member-mode');
        if (settingsNav) settingsNav.style.display = 'inline-block';
        if (statusArea) statusArea.innerHTML = `<button onclick="logout()" class="nav-btn">Logout</button>`;
    } else {
        if (statusArea) statusArea.innerHTML = `<button onclick="location.href='login.html'" class="nav-btn-primary">Login</button>`;
    }

    // 3. index.html: ツールグリッド描画
    const grid = document.getElementById('tool-grid');
    if (grid) renderToolGrid(isLoggedIn);

    // 4. count.html: 高機能文字数カウンター
    initCharCounter();

    // 5. roulette.html: ルーレット
    const runRoulette = document.getElementById('run-roulette-btn');
    if (runRoulette) {
        runRoulette.onclick = () => {
            const res = document.getElementById('roulette-result');
            res.innerText = "抽選中...";
            setTimeout(() => {
                const items = ["大吉", "中吉", "小吉", "吉", "末吉", "凶"];
                res.innerText = items[Math.floor(Math.random() * items.length)];
            }, 600);
        };
    }

    // 6. pass.html: パスワード生成
    const passBtn = document.getElementById('generate-pass-btn');
    if (passBtn) {
        passBtn.onclick = () => {
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
            let pass = "";
            for (let i = 0; i < 16; i++) { pass += chars.charAt(Math.floor(Math.random() * chars.length)); }
            document.getElementById('pass-result').value = pass;
        };
    }

    // 7. memo.html: メモ帳保存
    const memoArea = document.getElementById('memo-area');
    if (memoArea) {
        memoArea.value = localStorage.getItem('user-memo') || "";
        memoArea.addEventListener('input', () => {
            localStorage.setItem('user-memo', memoArea.value);
        });
    }

    // 8. contact.html: GAS送信
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.onsubmit = async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            btn.disabled = true; btn.innerText = "送信中...";
            const data = { 
                name: document.getElementById('name').value, 
                email: document.getElementById('email').value, 
                message: document.getElementById('message').value 
            };
            try {
                await fetch(GAS_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
                document.getElementById('form-wrapper').style.display = 'none';
                document.getElementById('form-success').style.display = 'block';
            } catch (err) { alert("エラー"); btn.disabled = false; }
        };
    }
});

// 高機能カウンターロジック
function initCharCounter() {
    const textarea = document.getElementById('counter-input');
    if (!textarea) return;

    const charDisplay = document.getElementById('char-count');
    const colorPicker = document.getElementById('text-color-picker');

    textarea.addEventListener('input', () => {
        const text = textarea.value;
        charDisplay.innerText = text.length;
        // 言語判定: 日本語があれば日本語用、なければ英語用フォント
        textarea.style.fontFamily = /[ぁ-んァ-ヶー一-龠]/.test(text) 
            ? "'Sawarabi Gothic', 'Hiragino Sans', sans-serif" 
            : "'Roboto', 'Segoe UI', sans-serif";
    });

    if (colorPicker) {
        colorPicker.addEventListener('input', () => {
            textarea.style.color = colorPicker.value;
        });
    }
}

// 保存・ダウンロード機能
function downloadText() {
    const text = document.getElementById('counter-input').value;
    if (!text) return alert("文字を入力してください");
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'shinorail_text_' + new Date().getTime() + '.txt';
    a.click();
}

// 設定変更用関数（settings.htmlなどで使用）
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
    
    if (dark) {
        document.body.classList.add('member-mode');
    } else {
        document.body.classList.remove('member-mode');
    }
}

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
                ${t.free ? 'ツールを起動' : 'Loginして開放'}
            </button>
        </div>
    `).join('');
}

function checkAuth() {
    const id = document.getElementById('login-id').value;
    const pass = document.getElementById('login-pass').value;
    if (id === AUTH_ID && pass === AUTH_PASS) {
        localStorage.setItem('isLoggedIn', 'true');
        location.href = 'index.html';
    } else { alert("IDまたはパスワードが違います"); }
}

function logout() { localStorage.clear(); location.href = 'index.html'; }
