const AUTH_API = "https://script.google.com/macros/s/AKfycbzcf3y3Htt-yXkaUFMacml5a2uN-QH6vfhOlF4tH--WbMubfV3cDroIXeIoBLmDM8rH/exec";
const CONTACT_API = "https://script.google.com/macros/s/AKfycbwXqfLkvUVaSVe1UGJCp1tgMBylQ739V58BZJbnarXMXvjnRjwMe8ZCPJoKY9FYbZvLCg/exec";

document.addEventListener('DOMContentLoaded', () => {
    applySettings();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const statusArea = document.getElementById('status-area');
    
    // ログイン状態のUI反映
    if (isLoggedIn) {
        document.body.classList.add('member-mode');
        if (statusArea) statusArea.innerHTML = `<button onclick="logout()" class="nav-btn-logout">ログアウト</button>`;
        if (document.getElementById('my-id-display')) {
            document.getElementById('my-id-display').innerText = localStorage.getItem('currentUser') || 'User';
        }
    } else {
        if (statusArea) statusArea.innerHTML = `<button onclick="location.href='login.html'" class="nav-btn-primary">ログイン</button>`;
    }

    // 各ページの初期化
    if (document.getElementById('tool-grid')) renderToolGrid(isLoggedIn);
    if (document.getElementById('counter-input')) initCounterLogic();
    
    // お問い合わせページのメール自動入力
    if (document.getElementById('contact-email')) {
        const user = localStorage.getItem('currentUser');
        if (user) document.getElementById('contact-email').value = user;
    }
});

// カウント機能（日本語・英語フォント自動判定）
function initCounterLogic() {
    const input = document.getElementById('counter-input');
    const charD = document.getElementById('char-count');
    const byteD = document.getElementById('byte-count');
    const lineD = document.getElementById('line-count');
    const fontL = document.getElementById('current-font-label');

    input.addEventListener('input', () => {
        const v = input.value;
        charD.innerText = v.length;
        byteD.innerText = encodeURIComponent(v).replace(/%[0-9A-F]{2}/g, '*').length;
        lineD.innerText = v ? v.split('\n').length : 0;

        // 日本語が含まれるか判定してフォントを切り替える
        if (/[ぁ-んァ-ヶー一-龠]/.test(v)) {
            input.style.fontFamily = '"Hiragino Sans", "Meiryo", sans-serif';
            if (fontL) fontL.innerText = "日本語フォント適用中";
        } else {
            input.style.fontFamily = '"SFMono-Regular", Consolas, monospace';
            if (fontL) fontL.innerText = "English Monospace";
        }
    });
}

// お問い合わせ送信（省略なし全機能）
async function processContact() {
    const btn = document.getElementById('send-btn');
    const status = document.getElementById('msg-status');
    const email = document.getElementById('contact-email').value;
    const type = document.getElementById('contact-type').value;
    const message = document.getElementById('contact-message').value;

    if (!email || !type || !message) {
        alert("すべての項目を入力してください");
        return;
    }

    btn.disabled = true;
    btn.innerText = "送信中...";
    if (status) {
        status.style.display = "block";
        status.innerText = "スプレッドシートに保存し、確認メールを送信しています...";
    }

    try {
        const res = await fetch(CONTACT_API, {
            method: "POST",
            body: JSON.stringify({ method: "contact", email, type, message })
        });
        const json = await res.json();
        if (json.status === "success") {
            if (status) {
                status.innerText = "送信完了しました。確認メールをご確認ください。";
                status.style.color = "var(--accent)";
            }
            document.getElementById('contact-message').value = "";
            btn.innerText = "送信済み";
        } else {
            throw new Error();
        }
    } catch (e) {
        if (status) {
            status.innerText = "エラーが発生しました。設定を確認してください。";
            status.style.color = "#e11d48";
        }
        btn.disabled = false;
        btn.innerText = "再送信";
    }
}

// ログイン認証
async function checkAuth() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    const btn = document.querySelector('.submit-btn');
    if (!email || !pass) return alert("入力してください");
    btn.disabled = true;
    try {
        const res = await fetch(AUTH_API, { method: "POST", body: JSON.stringify({ method: "login", email, password: pass }) });
        const json = await res.json();
        if (json.status === "success") {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', email);
            location.href = 'index.html';
        } else {
            alert("ログインに失敗しました");
            btn.disabled = false;
        }
    } catch (e) {
        alert("通信エラーが発生しました");
        btn.disabled = false;
    }
}

// ツール一覧の描画
function renderToolGrid(isLoggedIn) {
    const grid = document.getElementById('tool-grid');
    if (!grid) return;
    const tools = [
        { name: "📝 文字数カウント", page: "counter.html", free: true },
        { name: "📩 お問い合わせ", page: "contact.html", free: true },
        { name: "👤 マイページ", page: "mypage.html", free: isLoggedIn },
        { name: "⚙️ 設定", page: "settings.html", free: true }
    ];
    grid.innerHTML = tools.map(t => `
        <div class="tool-card ${!t.free ? 'locked' : ''}">
            <h3>${t.name}</h3>
            <p style="font-size:0.8rem; opacity:0.6; margin-bottom:15px;">
                ${t.free ? 'どなたでも利用可能です' : '会員登録が必要です'}
            </p>
            <button onclick="location.href='${t.free ? t.page : 'login.html'}'" class="submit-btn">
                ${t.free ? 'ツールを開く' : 'ログインして利用'}
            </button>
        </div>
    `).join('');
}

// 設定の適用
function applySettings() {
    const color = localStorage.getItem('user-color') || '#4CAF50';
    const dark = localStorage.getItem('dark-mode') === 'true';
    document.documentElement.style.setProperty('--accent', color);
    if (dark) {
        document.body.classList.add('member-mode');
    } else {
        document.body.classList.remove('member-mode');
    }
}

function updateConfig(k, v) {
    localStorage.setItem(k, v);
    applySettings();
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    location.href = 'index.html';
}
