const GAS_API = "https://script.google.com/macros/s/AKfycbzW2As0R3qr3maSCKTz5To2qt3hLYwfreykU6BjEcxqE1VOm8M_H9HyBS-G3K0HSmnN/exec";

document.addEventListener('DOMContentLoaded', () => {
    applySettings();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const statusArea = document.getElementById('status-area');
    
    // ログイン状態のグローバル反映
    if (isLoggedIn) {
        document.body.classList.add('member-mode');
        if (statusArea) statusArea.innerHTML = `<button onclick="logout()" class="nav-btn">ログアウト</button>`;
        const myName = document.getElementById('my-id-display');
        if (myName) myName.innerText = localStorage.getItem('currentUser') || '会員';
    } else {
        if (statusArea) statusArea.innerHTML = `<button onclick="location.href='login.html'" class="nav-btn-primary">会員ログイン</button>`;
    }

    // 各ページ固有の初期化
    if (document.getElementById('tool-grid')) renderToolGrid(isLoggedIn);
    if (document.getElementById('counter-input')) initCharCounter();
    if (document.getElementById('memo-area')) initMemo();
    if (document.getElementById('roulette-result')) initRouletteItems();
});

// GAS連携：新規会員登録（A:email, B:password, C:newsletter, D:dateに対応）
async function registerUser() {
    const btn = document.querySelector('.submit-btn');
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    const news = document.getElementById('reg-news').checked;

    if (!email || !pass) return alert("メールアドレスとパスワードを入力してください");

    btn.disabled = true;
    btn.innerText = "登録処理中...";

    try {
        await fetch(GAS_API, {
            method: "POST",
            body: JSON.stringify({
                method: "register",
                email: email,
                password: pass,
                newsletter: news
            })
        });
        alert("登録が完了しました。ログインページへ移動します。");
        location.href = 'login.html';
    } catch (e) {
        alert("エラー：GASのデプロイが正しく完了しているか確認してください。");
        btn.disabled = false;
        btn.innerText = "アカウント作成";
    }
}

// GAS連携：ログイン照合（処理中表示あり）
async function checkAuth() {
    const btn = document.querySelector('.submit-btn');
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    if (!email || !pass) return alert("入力してください");

    btn.disabled = true;
    btn.innerText = "認証中...";

    try {
        const res = await fetch(GAS_API, {
            method: "POST",
            body: JSON.stringify({
                method: "login",
                email: email,
                password: pass
            })
        });
        const json = await res.json();
        if (json.status === "success") {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', email);
            location.href = 'index.html';
        } else {
            alert("ログイン情報が正しくありません");
            btn.disabled = false;
            btn.innerText = "ログイン";
        }
    } catch (e) {
        alert("通信エラーが発生しました");
        btn.disabled = false;
        btn.innerText = "ログイン";
    }
}

// 高機能文字数カウンター（フォント自動切替・テキスト保存）
function initCharCounter() {
    const textarea = document.getElementById('counter-input');
    const charDisplay = document.getElementById('char-count');
    const colorPicker = document.getElementById('text-color-picker');

    textarea.addEventListener('input', () => {
        charDisplay.innerText = textarea.value.length;
        // 日本語判定：日本語があればサンセリフ、なければ等幅
        textarea.style.fontFamily = /[ぁ-んァ-ヶー一-龠]/.test(textarea.value) ? "sans-serif" : "monospace";
    });
    if (colorPicker) {
        colorPicker.addEventListener('input', () => { textarea.style.color = colorPicker.value; });
    }
}

function downloadText() {
    const text = document.getElementById('counter-input').value;
    if (!text) return alert("内容がありません");
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'text_' + Date.now() + '.txt';
    a.click();
}

// ルーレット生成機能
function initRouletteItems() {
    const area = document.getElementById('roulette-items');
    if (area && !area.value) area.value = "大吉\n中吉\n小吉\n吉\n末吉\n凶";
}

function runRoulette() {
    const res = document.getElementById('roulette-result');
    const items = document.getElementById('roulette-items').value.split('\n').filter(v => v.trim() !== "");
    if (!items.length) return alert("項目を入力してください");

    let count = 0;
    const timer = setInterval(() => {
        res.innerText = items[Math.floor(Math.random() * items.length)];
        if (count++ > 20) {
            clearInterval(timer);
            res.style.transform = "scale(1.2)";
            setTimeout(() => res.style.transform = "scale(1)", 200);
        }
    }, 60);
}

// 設定同期（色・ダークモード）
function updateConfig(type, value) {
    localStorage.setItem(type, value);
    applySettings();
}

function applySettings() {
    const color = localStorage.getItem('user-color') || '#4CAF50';
    const dark = localStorage.getItem('dark-mode') === 'true';
    document.documentElement.style.setProperty('--accent', color);
    if (dark) document.body.classList.add('member-mode');
    else document.body.classList.remove('member-mode');
}

// ツール一覧の動的生成
function renderToolGrid(isLoggedIn) {
    const grid = document.getElementById('tool-grid');
    const tools = [
        { name: "📝 文字数カウント", page: "count.html", free: true },
        { name: "🎲 ルーレット生成", page: "roulette.html", free: isLoggedIn },
        { name: "👤 マイページ", page: "mypage.html", free: isLoggedIn },
        { name: "📄 規約・ポリシー", page: "policy.html", free: true },
        { name: "⚙️ 設定", page: "settings.html", free: true }
    ];
    grid.innerHTML = tools.map(t => `
        <div class="tool-card ${!t.free ? 'locked' : ''}">
            <h3>${t.name}</h3>
            <button onclick="${t.free ? `location.href='${t.page}'` : "location.href='login.html'"} " class="submit-btn">
                ${t.free ? '起動する' : '会員限定機能'}
            </button>
        </div>
    `).join('');
}

function logout() { localStorage.clear(); location.href = 'index.html'; }
function initMemo() {
    const m = document.getElementById('memo-area');
    if (m) {
        m.value = localStorage.getItem('user-memo') || "";
        m.oninput = () => localStorage.setItem('user-memo', m.value);
    }
}
