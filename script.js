// --- 1. お知らせデータ ---
const ANNOUNCEMENTS = [
    { date: "2025-12-16", text: "<a href='ads_policy.html' style='font-weight:bold;'>広告・利用規約・プライバシーポリシーを策定しました</a>" },
    { date: "2025-12-16", text: "会員システムを導入しました！Googleスプレッドシート連携開始。" }
];

// --- 2. ページガード (アクセス制限) ---
(function() {
    const restrictedPages = ['mypage.html', 'secret_tool.html'];
    const currentPage = window.location.pathname.split("/").pop();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (restrictedPages.includes(currentPage) && !isLoggedIn) {
        alert("🔓 会員限定機能です。ログインしてください。");
        window.location.href = "login.html";
    }
})();

// --- 3. ログイン状態の表示 & お知らせの挿入 ---
document.addEventListener('DOMContentLoaded', () => {
    // お知らせの描画
    const list = document.getElementById('announcement-list');
    if (list) {
        list.innerHTML = ANNOUNCEMENTS.map(a => `<li>[${a.date}] ${a.text}</li>`).join('');
    }

    // ログイン状態表示
    const statusArea = document.getElementById('user-status-area');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const email = localStorage.getItem('currentUser');

    if (isLoggedIn && statusArea) {
        document.body.classList.add('member-only-theme'); // 会員デザイン適用
        statusArea.innerHTML = `
            <div style="background:#fff9c4; border:1px solid #ffd700; padding:5px; border-radius:5px; font-size:0.8em;">
                <span style="color:#b8860b; font-weight:bold;">★Premium</span> | ${email}<br>
                <a href="secret_tool.html" style="color:blue;">🔓 限定ツール</a> | <a href="#" onclick="logout()">ログアウト</a>
            </div>
        `;
    } else if (statusArea) {
        statusArea.innerHTML = `<button onclick="location.href='login.html'">ログイン/会員登録</button>`;
    }
});

function logout() {
    localStorage.clear();
    location.href = "index.html";
}
