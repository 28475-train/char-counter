/* script.js - 共通機能（テーマ設定、文字数カウントロジック、アニメーション制御） */

const THEME_OPTIONS = [
    { value: 'light_green', name: 'ライトグリーン (初期)' },
    { value: 'deep_blue', name: 'ディープブルー' },
    { value: 'sunset_orange', name: 'サンセットオレンジ' },
    { value: 'modern_grey', name: 'モダングレイ (ダーク)' },
    { value: 'classic_red', name: 'クラシックレッド' }
];

// ====================================
// ローディング画面の制御
// ====================================
function showLoadingScreen() {
    const body = document.body;
    
    // ローディングオーバーレイを挿入
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loader"></div>
        <div id="loading-text">データを読み込み中...</div>
    `;
    body.appendChild(loadingOverlay);

    // 強制的にスクロールバーを非表示にし、ボディの初期不透明度をリセット
    body.style.overflow = 'hidden';
    body.style.opacity = 1; 

    return loadingOverlay;
}

function hideLoadingScreen(loadingOverlay) {
    if (!loadingOverlay) return;

    // フェードアウト
    loadingOverlay.style.opacity = 0;
    
    setTimeout(() => {
        if (loadingOverlay.parentNode) {
            loadingOverlay.parentNode.removeChild(loadingOverlay);
        }
        document.body.style.overflow = ''; // スクロールバーを元に戻す
        applyAnimations(); // アニメーションを適用
    }, 500); // CSSのtransition時間に合わせて0.5秒後に削除
}

// ====================================
// アニメーションの適用 (スライドイン)
// ====================================
function applyAnimations() {
    const animatedElements = document.querySelectorAll('header, footer, main, section');
    animatedElements.forEach((el, index) => {
        el.style.opacity = 0; // 念のため非表示を保証
        setTimeout(() => {
            el.style.animation = `slideInFromLeft 0.5s ease-out ${index * 0.1}s forwards`;
        }, 10); // 短い遅延を設けてCSSアニメーションを起動
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = showLoadingScreen(); // 最初にローディング画面を表示

    // ====================================
    // 1. テーマ設定の初期化と制御
    // ====================================
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'light_green';
    body.setAttribute('data-theme', savedTheme);

    const themeSelector = document.getElementById('theme-selector');
    
    if (themeSelector) {
        // セレクタにテーマオプションを追加
        THEME_OPTIONS.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.value;
            option.textContent = theme.name;
            themeSelector.appendChild(option);
        });

        // 現在の選択肢を設定
        themeSelector.value = savedTheme;

        // 変更時の処理
        themeSelector.addEventListener('change', (event) => {
            const newTheme = event.target.value;
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            // テーマ変更時はリロードせず即時反映
        });
    }

    // ====================================
    // 2. 文字数カウント機能 (既存ロジック)
    // ====================================
    const textInput = document.getElementById('text-input');
    const charCountDisplay = document.getElementById('char-count');

    if (textInput && charCountDisplay) {
        const updateCount = () => {
            const text = textInput.value;
            const count = text.length; 
            charCountDisplay.textContent = count;
        };
        updateCount();
        textInput.addEventListener('input', updateCount);
        textInput.focus();
    }

    // ====================================
    // 3. ルーレット機能 (既存ロジック)
    // ====================================
    const startButton = document.getElementById('start-button');
    const rouletteDisplay = document.getElementById('roulette-display');

    if (startButton && rouletteDisplay) {
        const startRoulette = () => {
            const items = ['選択肢A', '選択肢B', '選択肢C', '選択肢D']; // 設定から取得予定
            if (items.length === 0) {
                rouletteDisplay.textContent = '設定ページで項目を設定してください。';
                return;
            }
            startButton.disabled = true;
            rouletteDisplay.textContent = '回転中...';

            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * items.length);
                const result = items[randomIndex];
                rouletteDisplay.textContent = `結果: ${result}`;
                startButton.disabled = false;
            }, 2000); 
        };
        startButton.addEventListener('click', startRoulette);
    }
    
    // ====================================
    // 4. ローディング画面を非表示にする
    // ====================================
    // すべてのコンテンツが準備できたと見なし、短い時間後にローディングを非表示にする
    setTimeout(() => {
        hideLoadingScreen(loadingOverlay);
    }, 500); // 0.5秒後に非表示を開始
});
