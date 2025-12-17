// --- APIエンドポイント設定 ---
const AUTH_API = "https://script.google.com/macros/s/AKfycbzcf3y3Htt-yXkaUFMacml5a2uN-QH6vfhOlF4tH--WbMubfV3cDroIXeIoBLmDM8rH/exec";
const CONTACT_API = "https://script.google.com/macros/s/AKfycbwXqfLkvUVaSVe1UGJCp1tgMBylQ739V58BZJbnarXMXvjnRjwMe8ZCPJoKY9FYbZvLCg/exec";

// --- 共通初期化処理 ---
document.addEventListener('DOMContentLoaded', () => {
    applySettings();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const statusArea = document.getElementById('status-area');
    
    // ログイン状態に応じたUI反映
    if (isLoggedIn) {
        document.body.classList.add('member-mode');
        if (statusArea) {
            statusArea.innerHTML = `<button onclick="logout()" class="nav-btn-logout">ログアウト</button>`;
        }
        if (document.getElementById('my-id-display')) {
            document.getElementById('my-id-display').innerText = localStorage.getItem('currentUser') || 'User';
        }
    } else {
        if (statusArea) {
            statusArea.innerHTML = `<button onclick="location.href='login.html'" class="nav-btn-primary">ログイン</button>`;
        }
    }

    // 各ページの要素がある場合のみ初期化を実行
    if (document.getElementById('tool-grid')) renderToolGrid(isLoggedIn);
    if (document.getElementById('counter-input')) initCounterLogic();
    if (document.getElementById('roulette-target')) initRouletteLogic();
    if (document.getElementById('contact-email')) {
        const savedEmail = localStorage.getItem('currentUser');
        if (savedEmail) document.getElementById('contact-email').value = savedEmail;
    }
});

// --- お問い合わせ送信 & サンキューページ遷移 ---
async function processContact() {
    const btn = document.getElementById('send-btn');
    const email = document.getElementById('contact-email').value;
    const type = document.getElementById('contact-type').value;
    const message = document.getElementById('contact-message').value;

    if (!email || !type || !message) {
        alert("すべての項目を入力してください");
        return;
    }

    btn.disabled = true;
    btn.innerText = "送信中...";

    try {
        const res = await fetch(CONTACT_API, {
            method: "POST",
            body: JSON.stringify({ method: "contact", email: email, type: type, message: message })
        });
        const json = await res.json();
        if (json.status === "success") {
            location.href = "thankyou.html";
        } else { throw new Error(); }
    } catch (e) {
        alert("送信に失敗しました");
        btn.disabled = false;
        btn.innerText = "送信する";
    }
}

// --- 文字数カウンター（日本語/英語フォント切替 & スマホ背景） ---
function initCounterLogic() {
    const input = document.getElementById('counter-input');
    const charD = document.getElementById('char-count');
    const byteD = document.getElementById('byte-count');
    const lineD = document.getElementById('line-count');

    input.addEventListener('input', () => {
        const v = input.value;
        charD.innerText = v.length;
        byteD.innerText = encodeURIComponent(v).replace(/%[0-9A-F]{2}/g, '*').length;
        lineD.innerText = v ? v.split('\n').length : 0;

        // フォント自動切替
        if (/[ぁ-んァ-ヶー一-龠]/.test(v)) {
            input.style.fontFamily = '"Hiragino Sans", "Meiryo", sans-serif';
        } else {
            input.style.fontFamily = '"SFMono-Regular", Consolas, monospace';
        }
    });
}

// --- ルーレット機能（全ロジック） ---
function initRouletteLogic() {
    const target = document.getElementById('roulette-target');
    const itemsInput = document.getElementById('roulette-items');
    const startBtn = document.getElementById('roulette-start');
    
    if (!startBtn) return;

    startBtn.addEventListener('click', () => {
        const items = itemsInput.value.split('\n').filter(i => i.trim() !== "");
        if (items.length < 2) return alert("項目を2つ以上入力してください");

        startBtn.disabled = true;
        let count = 0;
        const speed = 50;
        const duration = 2000;
        const interval = setInterval(() => {
            target.innerText = items[Math.floor(Math.random() * items.length)];
            count += speed;
            if (count >= duration) {
                clearInterval(interval);
                target.style.color = "var(--accent)";
                target.style.transform = "scale(1.2)";
                setTimeout(() => {
                    target.style.transform = "scale(1)";
                    startBtn.disabled = false;
                }, 500);
            }
        }, speed);
    });
}

// --- 認証系（ログイン・サインアップ） ---
async function checkAuth() {
    const btn = document.querySelector('.submit-btn');
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    if (!email || !pass) return alert("入力してください");
    btn.disabled = true;
    try {
        const res = await fetch(AUTH_API, { method: "POST", body: JSON.stringify({ method: "login", email, password: pass }) });
        const json = await res.json();
        if (json.status === "success") {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', email);
            location.href = 'index.html';
        } else { alert("認証失敗"); btn.disabled = false; }
    } catch (e) { alert("エラー"); btn.disabled = false; }
}

async function processSignup() {
    const btn = document.querySelector('.submit-btn');
    const email = document.getElementById('signup-email').value;
    const pass = document.getElementById('signup-pass').value;
    const news = document.getElementById('newsletter').checked;
    if (!email || !pass) return alert("すべて入力してください");
    btn.disabled = true;
    try {
        const res = await fetch(AUTH_API, { method: "POST", body: JSON.stringify({ method: "register", email, password: pass, newsletter: news }) });
        const json = await res.json();
        if (json.status === "success") {
            alert("登録完了！ログインしてください。");
            location.href = 'login.html';
        } else { alert(json.message || "失敗"); btn.disabled = false; }
    } catch (e) { alert("エラー"); btn.disabled = false; }
}

// --- ツールグリッド生成（会員限定ロック付） ---
function renderToolGrid(isLoggedIn) {
    const grid = document.getElementById('tool-grid');
    if (!grid) return;
    const tools = [
        { name: "📝 文字数カウント", page: "counter.html", free: true },
        { name: "📩 お問い合わせ", page: "contact.html", free: true },
        { name: "🎲 ルーレット", page: "roulette.html", free: isLoggedIn },
        { name: "👤 マイページ", page: "mypage.html", free: isLoggedIn },
        { name: "⚙️ 設定", page: "settings.html", free: true }
    ];
    grid.innerHTML = tools.map(t => `
        <div class="tool-card ${!t.free ? 'locked' : ''}">
            <h3>${t.name}</h3>
            <p style="font-size:0.75rem; opacity:0.6; margin-bottom:15px;">${t.free ? '誰でも使えます' : '会員限定'}</p>
            <button onclick="location.href='${t.free ? t.page : 'login.html'}'" class="submit-btn">${t.free ? 'ツールを開く' : 'ログインが必要'}</button>
        </div>
    `).join('');
}

// --- 設定適用（カラー・ダークモード） ---
function applySettings() {
    const color = localStorage.getItem('user-color') || '#4CAF50';
    const dark = localStorage.getItem('dark-mode') === 'true';
    document.documentElement.style.setProperty('--accent', color);
    if (dark) document.body.classList.add('member-mode');
    else document.body.classList.remove('member-mode');
}

function updateConfig(k, v) { localStorage.setItem(k, v); applySettings(); }
function logout() { localStorage.clear(); location.href = 'index.html'; }
