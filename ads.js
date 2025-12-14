/*
 * ----------------------------------------
 * ads.js (広告挿入ロジック)
 * ----------------------------------------
 */

function loadAds() {
    // URLに基づいて、SP版フォルダ内かどうかを判定
    const isMobilePage = window.location.pathname.includes('/SP/');

    // 共通の広告コード（ここで広告タグ全体を定義）
    const adScript = '<script src="https://adm.shinobi.jp/o/b4938a5bb7d245347d3a4f3bf5b38328"></script>';

    // --- TOP広告エリア ---
    const adAreaTop = document.getElementById('ad-area-top');
    if (adAreaTop) {
        adAreaTop.innerHTML = adScript; 
        if (isMobilePage) {
            adAreaTop.parentElement.style.height = '50px'; // SP版ヘッダー直下の高さを設定
        }
    }

    // --- BOTTOM広告エリア ---
    const adAreaBottom = document.getElementById('ad-area-bottom');
    if (adAreaBottom) {
        adAreaBottom.innerHTML = adScript;
        if (isMobilePage) {
            adAreaBottom.parentElement.style.height = '50px'; // SP版フッター直上の高さを設定
        }
    }
}

// ページロード時に広告を読み込む
document.addEventListener('DOMContentLoaded', loadAds);
