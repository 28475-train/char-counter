// 共通設定：GASのURL
const GAS_URL = "https://script.google.com/macros/s/AKfycbwR7OwIAmzQikZxAOM2x4hYJNB_6MaBoFqrhdNnn_39GuqinipwFn1v8icxsc5II69-XQ/exec";

document.addEventListener('DOMContentLoaded', () => {
    // 1. 設定の適用（カラー、フォント、ダークモード）
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
        if (statusArea) statusArea.innerHTML = `<button onclick="login()" class="nav-btn-primary">Login</button>`;
    }

    // 3. ツールグリッドの描画 (index.html用)
    const grid = document.getElementById('tool-grid');
    if (grid) renderToolGrid(isLoggedIn);

    // 4. 文字数カウント機能 (count.html用)
    const counterInput = document.getElementById('counter-input');
    if (counterInput) {
        const charDisplay = document.getElementById('char-count');
        counterInput.addEventListener('input', () => {
            charDisplay.innerText = counterInput.value.length;
        });
    }

    // 5. ルーレット機能 (roulette.html用)
    const runRoulette = document.getElementById('run-roulette-btn');
    if (runRoulette) {
        runRoulette.onclick = () => {
            const resultDisplay = document.getElementById('roulette-result');
            resultDisplay.innerText = "抽選中...";
            setTimeout(() => {
                const items = ["大吉", "中吉", "小吉", "吉", "末吉", "凶"];
                const res = items[Math.floor(Math.random() * items.length)];
                resultDisplay.innerText = res;
            }, 500);
        };
    }

    // 6. パスワード生成機能 (pass.html用)
    const passBtn = document.getElementById('generate-pass-btn');
    if (passBtn) {
        passBtn.onclick = () => {
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
            let pass = "";
            for (let i = 0; i < 16; i++) {
                pass += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            document.getElementById('pass-result').value = pass;
        };
    }

    // 7. メモ帳機能 (memo.html用)
    const memoArea = document.getElementById('memo-area');
    if (memoArea) {
        memoArea.value = localStorage.getItem('user-memo') || "";
        memoArea.addEventListener('input', () => {
            localStorage.setItem('user-memo', memoArea.value);
        });
    }

    // 8. お問い合わせ送信 (contact.html用)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.onsubmit = async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            btn.disabled = true;
            btn.innerText = "送信中...";
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            try {
                await fetch(GAS_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
                document.getElementById('form-wrapper').style.display = 'none';
                document.getElementById('form-success').style.display = 'block';
            } catch (err) {
                alert("送信失敗");
                btn.disabled = false;
            }
        };
    }
});

/* --- 管理・共通関数 --- */

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
            <button onclick="${t.free ? `location.href='${t.page}'` : 'login()'}" class="submit-btn">
                ${t.free ? 'ツールを起動' : 'Loginして開放'}
            </button>
        </div>
    `).join('');
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

function login() { localStorage.setItem('isLoggedIn', 'true'); location.reload(); }
function logout() { localStorage.clear(); location.href = 'index.html'; }

// 設定変更用（settings.htmlから呼ぶ）
function setTheme(c) { localStorage.setItem('user-color', c); applySettings(); }
function setFontSize(s) { localStorage.setItem('user-font', s); applySettings(); }
function toggleDark() { 
    const d = localStorage.getItem('dark-mode') === 'true';
    localStorage.setItem('dark-mode', !d); applySettings();
}
