/*
 * ----------------------------------------
 * 広告挿入ロジック (ads.js)
 * ----------------------------------------
 */

function loadAds() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 共通の広告コード（このコードを更新するだけで全ページの広告が変わります）
    const adScript = '<script src="https://adm.shinobi.jp/o/b4938a5bb7d245347d3a4f3bf5b38328"></script>';

    // --- TOP広告エリア ---
    const adAreaTop = document.getElementById('ad-area-top');
    if (adAreaTop) {
        // PC版とSP版で表示する広告サイズや形式を変えたい場合はここで分岐
        if (isMobile) {
            // SP版トップ広告 (例: 320x50)
            adAreaTop.innerHTML = adScript; 
            adAreaTop.style.height = '50px';
        } else {
            // PC版トップ広告 (例: 728x90)
            adAreaTop.innerHTML = adScript;
        }
    }

    // --- BOTTOM広告エリア ---
    const adAreaBottom = document.getElementById('ad-area-bottom');
    if (adAreaBottom) {
        if (isMobile) {
            // SP版ボトム広告 (例: 320x50)
            adAreaBottom.innerHTML = adScript;
        } else {
            // PC版ボトム広告 (例: 300x250)
            adAreaBottom.innerHTML = adScript;
        }
    }
}

// ページロード時に広告を読み込む
document.addEventListener('DOMContentLoaded', loadAds);
