/* TOOLBOX PREMIUM - INTEGRATED LOGIC
   1. 会員判定 & UI動的生成
   2. アクセシビリティ & 設定保存
   3. 全4ツールのロジック
   4. GAS お問い合わせ送信
*/

const GAS_URL = "https://script.google.com/macros/s/AKfycbwR7OwIAmzQikZxAOM2x4hYJNB_6MaBoFqrhdNnn_39GuqinipwFn1v8icxsc5II69-XQ/exec";

document.addEventListener('DOMContentLoaded', () => {
    // 0. 初期設定の適用
    initApp();

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const grid = document.getElementById('tool-grid');
    
    // 1. UIの描画（index.html用）
    if (grid) {
        renderTools(isLoggedIn);
    }

    // 2. お問い合わせフォーム送信
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        handleContactForm(contactForm);
    }
});

/* ==========================================
   APP 初期化
   ========================================== */
function initApp() {
    // 設定読み込み
    const color = localStorage.getItem('user-color') || '#4CAF50';
    const font = localStorage.getItem('user-font') || '16px';
    const isDark = localStorage.getItem('dark-mode') === 'true';

    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.fontSize = font;
    
    if (isDark || (localStorage.getItem('isLoggedIn') === 'true')) {
        document.body.classList.add('member-mode');
    }

    // スマホ用タブバーの「active」制御
    const path = window.location.pathname;
    document.querySelectorAll('.tab-item').forEach(el => {
        if (path.includes(el.getAttribute('href'))) el.classList.add('active');
    });
}

/* ==========================================
   ツール描画 & ツール機能 (文字数・ルーレット等)
   ========================================== */
function renderTools(isLoggedIn) {
    const grid = document.getElementById('tool-grid');
    
    const tools = [
        { id: 'count', name: '文字数カウント', icon: '📝', free: true },
        { id: 'roulette', name: '抽選ルーレット', icon: '🎲', free: isLoggedIn },
        { id: 'pass', name: '強固なパス作成', icon: '🔐', free: isLoggedIn },
        { id: 'memo', name: 'クラウドメモ', icon: '💾', free: isLoggedIn }
    ];

    grid.innerHTML = tools.map(t => `
        <div class="tool-card ${!t.free ? 'locked' : ''}">
            <div style="font-size: 3rem; margin-bottom:15px;">${t.icon}</div>
            <h3 style="margin:0;">${t.name}</h3>
            <p style="font-size:0.8rem; opacity:0.7;">${t.free ? '起動可能です' : '会員限定機能'}</p>
            <button class="submit-btn" style="margin-top:20px; padding:12px;" 
                onclick="${t.free ? `runTool('${t.id}')` : 'login()'}">
                ${t.free ? 'ツールを開く' : 'ログインして開放'}
            </button>
        </div>
    `).join('');
}

// 簡易ツール実行エンジン
function runTool(id) {
    if (id === 'count') {
        const val = prompt("文字数を数えるテキストを入力してください:");
        if (val) alert(`文字数: ${val.length}文字です！`);
    } else if (id === 'roulette') {
        const items = ["大吉", "中吉", "小吉", "凶"];
        const res = items[Math.floor(Math.random() * items.length)];
        alert(`運勢結果: ${res}`);
    } else if (id === 'pass') {
        const pass = Math.random().toString(36).slice(-10) + "!";
        alert(`生成されたパスワード: ${pass}\n(安全に保管してください)`);
    } else if (id === 'memo') {
        const memo = localStorage.getItem('user-memo') || "メモはまだありません";
        const newMemo = prompt("メモを保存します:", memo);
        if (newMemo) localStorage.setItem('user-memo', newMemo);
    }
}

/* ==========================================
   お問い合わせ送信
   ========================================== */
function handleContactForm(form) {
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submit-btn');
        btn.disabled = true;
        btn.innerHTML = "📡 通信中...";

        const payload = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            await fetch(GAS_URL, {
                method: 'POST',
                mode: 'no-cors', // 重要
                body: JSON.stringify(payload)
            });
            document.getElementById('form-wrapper').style.display = 'none';
            document.getElementById('form-success').style.display = 'block';
        } catch (err) {
            alert("送信に失敗しました。ネット環境を確認してください。");
            btn.disabled = false;
            btn.innerText = "メールを送信する";
        }
    };
}

/* ==========================================
   認証 & 設定
   ========================================== */
function login() {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('dark-mode', 'true');
    location.reload();
}

function logout() {
    localStorage.clear();
    location.href = 'index.html';
}
