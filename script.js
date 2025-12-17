const GAS_API = "https://script.google.com/macros/s/AKfycbzcf3y3Htt-yXkaUFMacml5a2uN-QH6vfhOlF4tH--WbMubfV3cDroIXeIoBLmDM8rH/exec";

document.addEventListener('DOMContentLoaded', () => {
    applySettings();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const statusArea = document.getElementById('status-area');
    
    if (isLoggedIn) {
        document.body.classList.add('member-mode');
        if (statusArea) statusArea.innerHTML = `<button onclick="logout()" class="nav-btn-logout">ログアウト</button>`;
        const myId = document.getElementById('my-id-display');
        if (myId) myId.innerText = localStorage.getItem('currentUser') || '会員';
    } else {
        if (statusArea) statusArea.innerHTML = `<button onclick="location.href='login.html'" class="nav-btn-primary">ログイン</button>`;
    }

    if (document.getElementById('tool-grid')) renderToolGrid(isLoggedIn);
    if (document.getElementById('counter-input')) initCounterLogic();
    if (document.getElementById('roulette-result')) initRouletteLogic();
});

async function registerUser() {
    const btn = document.querySelector('.submit-btn');
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    const news = document.getElementById('reg-news').checked;
    if (!email || !pass) return alert("情報を入力してください");
    btn.disabled = true; btn.innerText = "登録中...";
    try {
        const res = await fetch(GAS_API, { method: "POST", body: JSON.stringify({ method: "register", email, password: pass, newsletter: news }) });
        const json = await res.json();
        if (json.status === "success") { alert("登録完了！"); location.href = 'login.html'; }
    } catch (e) { alert("通信エラーが発生しました"); btn.disabled = false; btn.innerText = "登録する"; }
}

async function checkAuth() {
    const btn = document.querySelector('.submit-btn');
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    if (!email || !pass) return alert("入力してください");
    btn.disabled = true; btn.innerText = "認証中...";
    try {
        const res = await fetch(GAS_API, { method: "POST", body: JSON.stringify({ method: "login", email, password: pass }) });
        const json = await res.json();
        if (json.status === "success") { localStorage.setItem('isLoggedIn', 'true'); localStorage.setItem('currentUser', email); location.href = 'index.html'; }
        else { alert("IDまたはパスワードが違います"); btn.disabled = false; btn.innerText = "ログイン"; }
    } catch (e) { alert("通信エラー：GASの公開設定を確認してください"); btn.disabled = false; btn.innerText = "ログイン"; }
}

function initCounterLogic() {
    const input = document.getElementById('counter-input');
    const charD = document.getElementById('char-count');
    const byteD = document.getElementById('byte-count');
    const lineD = document.getElementById('line-count');
    const colorP = document.getElementById('text-color-picker');
    input.addEventListener('input', () => {
        const v = input.value;
        charD.innerText = v.length;
        byteD.innerText = encodeURI(v).replace(/%[0-9A-F]{2}/g, '*').length;
        lineD.innerText = v ? v.split(/\n/).length : 0;
        input.style.fontFamily = /[ぁ-んァ-ヶー一-龠]/.test(v) ? "sans-serif" : "monospace";
    });
    if (colorP) colorP.addEventListener('input', () => { input.style.color = colorP.value; });
}

function initRouletteLogic() {
    const area = document.getElementById('roulette-items');
    if (area && !area.value) area.value = "大吉\n中吉\n小吉\n吉\n末吉\n凶";
}

function runRoulette() {
    const res = document.getElementById('roulette-result');
    const items = document.getElementById('roulette-items').value.split('\n').filter(v => v.trim());
    if (!items.length) return alert("項目を入力してください");
    let i = 0;
    const timer = setInterval(() => {
        res.innerText = items[Math.floor(Math.random() * items.length)];
        if (i++ > 15) clearInterval(timer);
    }, 80);
}

function renderToolGrid(isLoggedIn) {
    const grid = document.getElementById('tool-grid');
    const tools = [
        { name: "📝 文字数カウント", page: "counter.html", free: true },
        { name: "🎲 ルーレット", page: "roulette.html", free: isLoggedIn },
        { name: "👤 マイページ", page: "mypage.html", free: isLoggedIn },
        { name: "⚙️ 設定", page: "settings.html", free: true }
    ];
    grid.innerHTML = tools.map(t => `<div class="tool-card ${!t.free ? 'locked' : ''}"><h3>${t.name}</h3><button onclick="location.href='${t.free ? t.page : 'login.html'}'" class="submit-btn">${t.free ? '開く' : '会員限定'}</button></div>`).join('');
}

function applySettings() {
    const color = localStorage.getItem('user-color') || '#4CAF50';
    const dark = localStorage.getItem('dark-mode') === 'true';
    document.documentElement.style.setProperty('--accent', color);
    if (dark) document.body.classList.add('member-mode'); else document.body.classList.remove('member-mode');
}

function updateConfig(k, v) { localStorage.setItem(k, v); applySettings(); }
function logout() { localStorage.clear(); location.href = 'index.html'; }
