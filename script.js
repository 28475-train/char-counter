/* ============================================
   1. 会員ランク・システム定義
   ============================================ */
const USER_GRADES = {
    FREE: 'free',
    MEMBER: 'member',
    VIP: 'vip'
};

document.addEventListener('DOMContentLoaded', () => {
    // 状態の取得
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userGrade = localStorage.getItem('userGrade') || USER_GRADES.FREE;
    
    const currentPage = window.location.pathname.split("/").pop();
    const body = document.body;

    /* ============================================
       2. 自動転送ロジック (ランクによるアクセス制限)
       ============================================ */
    // VIP会員がTOPに来たら、自動でVIP専用ページへ転送
    if (isLoggedIn && userGrade === USER_GRADES.VIP && (currentPage === 'index.html' || currentPage === '')) {
        window.location.href = 'vip_top.html';
        return;
    }

    // 非会員が会員専用ページにアクセスしようとしたらTOPへ戻す
    if (!isLoggedIn && (currentPage === 'vip_top.html' || currentPage === 'member_only.html')) {
        window.location.href = 'index.html';
        return;
    }

    /* ============================================
       3. UI・デザイン制御
       ============================================ */
    const adWrapper = document.getElementById('ad-wrapper');
    const toolGrid = document.getElementById('tool-grid');

    if (!isLoggedIn) {
        // --- 非会員モード ---
        if (adWrapper) {
            adWrapper.style.display = 'block';
            loadAdMax(); // 忍者アドマックス読み込み
        }
        renderFreeTools(toolGrid);
    } else {
        // --- ログイン会員・VIPモード ---
        body.classList.add('member-mode');
        if (userGrade === USER_GRADES.VIP) body.classList.add('vip-mode');
        
        if (adWrapper) adWrapper.style.display = 'none'; // 広告非表示
        renderAllTools(toolGrid, userGrade === USER_GRADES.VIP);
    }

    updateStatusArea(isLoggedIn, userGrade);
});

/* ============================================
   4. ツール生成・ユーティリティ関数
   ============================================ */

// 忍者アドマックスの動的発火
function loadAdMax() {
    const space = document.getElementById('ad-space');
    if (!space) return;
    const script = document.createElement('script');
    script.src = "https://adm.shinobi.jp/o/b4938a5bb7d245347d3a4f3bf5b38328";
    space.appendChild(script);
}

// 非会員：文字数カウントのみ
function renderFreeTools(container) {
    if (!container) return;
    container.innerHTML = `
        <div class="tool-card">
            <h3>📝 文字数カウント</h3>
            <p>標準ツール。どなたでもご利用いただけます。</p>
            <button onclick="location.href='counter.html'">起動</button>
        </div>
        <div class="tool-card locked-card">
            <h3>🔒 会員限定機能</h3>
            <p>ログインすると全ての広告が消え、機能が開放されます。</p>
            <button disabled>ロック中</button>
        </div>
    `;
}

// 会員・VIP：全ツール表示
function renderAllTools(container, isVip) {
    if (!container) return;
    const tools = [
        {name: "📝 文字数カウント", url: "counter.html"},
        {name: "🎲 プレミアムルーレット", url: "roulette.html"},
        {name: "🔐 高度なパスワード生成", url: "pass_gen.html"},
        {name: "💾 クラウド保存メモ", url: "memo.html"},
        {name: "🔍 テキスト比較ツール", url: "diff.html"}
    ];
    container.innerHTML = tools.map(t => `
        <div class="tool-card ${isVip ? 'vip-card' : ''}">
            <h3>${t.name}</h3>
            <button onclick="location.href='${t.url}'">起動する</button>
        </div>
    `).join('');
}

function updateStatusArea(isLoggedIn, grade) {
    const area = document.getElementById('user-status-area');
    if (!area) return;
    if (isLoggedIn) {
        area.innerHTML = `
            ${grade === 'vip' ? '<span class="member-badge">VIP</span>' : '<span class="member-badge" style="color:#4CAF50; border-color:#4CAF50;">MEMBER</span>'}
            <button onclick="logout()" class="nav-btn" style="background:#ff4757; color:white; border:none;">ログアウト</button>
        `;
    } else {
        area.innerHTML = `<button onclick="location.href='login.html'" class="nav-btn" style="background:var(--main-green); color:white; border:none;">ログイン</button>`;
    }
}

function logout() { localStorage.clear(); window.location.href = 'index.html'; }
