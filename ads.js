// ===========================================
// ★★★ サービス全体メンテナンス中のリダイレクト処理 (本日よる10時まで) ★★★
// ---------------------------------------------------

// メンテナンスページ自体へのアクセスは許可する（無限ループを防ぐ）
const currentPath = window.location.pathname;

if (!currentPath.includes('/maintenance.html')) {
    
    // 現在のディレクトリレベルに応じてパスを調整
    let maintenanceUrl;
    if (currentPath.includes('/SP/')) {
        // SPディレクトリからのアクセスの場合
        maintenanceUrl = '../maintenance.html';
    } else {
        // ルートディレクトリからのアクセスの場合
        maintenanceUrl = './maintenance.html';
    }
    
    // 強制リダイレクト実行
    window.location.replace(maintenanceUrl);
}

// ===========================================
// ★★★ メンテナンス処理はここで終了 ★★★
// ※サービス再開時（本日よる10時以降）は、上記のブロック全体を削除してください。
// ---------------------------------------------------


// --- 実際の広告関連コード ---

// 広告エリアIDの定義
const AD_AREA_TOP_ID = 'ad-area-top';
const AD_AREA_BOTTOM_ID = 'ad-area-bottom';

// ユーザーから提供された広告スクリプトタグ
const AD_SCRIPT_TAG = '<script src="https://adm.shinobi.jp/o/b4938a5bb7d245347d3a4f3bf5b38328"></' + 'script>';

/**
 * 広告コードを特定のHTML要素に挿入する関数
 * @param {string} targetId 広告を挿入する要素のID
 */
function insertAdCode(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    // 広告スクリプトをDOMに追加
    targetElement.innerHTML = AD_SCRIPT_TAG;
}

document.addEventListener('DOMContentLoaded', () => {
    // data-ads="true" のページでのみ広告をロード
    const adsEnabled = document.body.parentElement.getAttribute('data-ads') === 'true';

    // メンテナンス処理が優先されるため、このコードはメンテナンス終了後に機能します。
    if (adsEnabled) {
        // TOPとBOTTOMのエリアに同じ広告コードを挿入
        insertAdCode(AD_AREA_TOP_ID);
        insertAdCode(AD_AREA_BOTTOM_ID);
    }
});
