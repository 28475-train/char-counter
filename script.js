/* script.js - 共通機能（テーマ設定、文字数カウントロジック、アニメーション制御、ルーレット制御、アクセシビリティ制御） */

const THEME_OPTIONS = [
    // ... (テーマ定義は変更なし) ...
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
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `<div class="loader"></div><div id="loading-text">データを読み込み中...</div>`;
    body.appendChild(loadingOverlay);
    body.style.overflow = 'hidden';
    body.style.opacity = 1; 
    return loadingOverlay;
}
function hideLoadingScreen(loadingOverlay) {
    if (!loadingOverlay) return;
    loadingOverlay.style.opacity = 0;
    setTimeout(() => {
        if (loadingOverlay.parentNode) {
            loadingOverlay.parentNode.removeChild(loadingOverlay);
        }
        document.body.style.overflow = '';
        
        // アニメーション無効設定がONでなければ、アニメーションを適用
        const noAnimation = localStorage.getItem('accessibility_no_animation') === 'true';
        if (!noAnimation) {
            applyAnimations();
        } else {
             document.querySelectorAll('header, footer, main, section').forEach(el => {
                el.style.opacity = 1;
            });
        }
    }, 500); 
}
// ====================================
// アニメーションの適用 (スライドイン)
// ====================================
function applyAnimations() {
    const animatedElements = document.querySelectorAll('header, footer, main, section');
    animatedElements.forEach((el, index) => {
        el.style.opacity = 0; 
        setTimeout(() => {
            el.style.animation = `slideInFromLeft 0.5s ease-out ${index * 0.1}s forwards`;
        }, 10);
    });
}

// ====================================
// アクセシビリティ設定の適用
// ====================================
function applyAccessibilitySettings() {
    const body = document.body;
    
    // 1. 文字サイズズーム
    const zoomLevel = localStorage.getItem('accessibility_text_zoom') || '1.0';
    body.style.setProperty('--global-zoom', zoomLevel);
    
    // 2. 色の反転 (invert)
    const invertColors = localStorage.getItem('accessibility_invert_colors') === 'true';
    body.classList.toggle('invert-colors', invertColors);
    
    // 3. グレースケール (grayscale)
    const grayscale = localStorage.getItem('accessibility_grayscale') === 'true';
    body.classList.toggle('grayscale', grayscale);
    
    // 4. アニメーション無効化 (no-animation)
    const noAnimation = localStorage.getItem('accessibility_no_animation') === 'true';
    body.classList.toggle('no-animation', noAnimation);
    
    // settings.html 以外でトグルとセレクタの要素は存在しないため、ここで終了
    if (document.getElementById('text-zoom-selector') === null) return;

    // 設定ページの場合、フォーム要素の状態を更新
    document.getElementById('text-zoom-selector').value = zoomLevel;
    document.getElementById('invert-colors-toggle').checked = invertColors;
    document.getElementById('grayscale-toggle').checked = grayscale;
    document.getElementById('no-animation-toggle').checked = noAnimation;
}


document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = showLoadingScreen();
    const body = document.body;
    
    // 0. アクセシビリティ設定の初期適用
    applyAccessibilitySettings();

    // 1. テーマ設定の初期化と制御
    const savedTheme = localStorage.getItem('theme') || 'light_green';
    body.setAttribute('data-theme', savedTheme);
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        THEME_OPTIONS.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.value;
            option.textContent = theme.name;
            themeSelector.appendChild(option);
        });
        themeSelector.value = savedTheme;
        themeSelector.addEventListener('change', (event) => {
            const newTheme = event.target.value;
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 2. アクセシビリティ設定のリスナー
    const textZoomSelector = document.getElementById('text-zoom-selector');
    const invertColorsToggle = document.getElementById('invert-colors-toggle');
    const grayscaleToggle = document.getElementById('grayscale-toggle');
    const noAnimationToggle = document.getElementById('no-animation-toggle');
    
    if (textZoomSelector) {
        textZoomSelector.addEventListener('change', (e) => {
            localStorage.setItem('accessibility_text_zoom', e.target.value);
            applyAccessibilitySettings();
        });
    }
    if (invertColorsToggle) {
        invertColorsToggle.addEventListener('change', (e) => {
            localStorage.setItem('accessibility_invert_colors', e.target.checked);
            applyAccessibilitySettings();
        });
    }
    if (grayscaleToggle) {
        grayscaleToggle.addEventListener('change', (e) => {
            localStorage.setItem('accessibility_grayscale', e.target.checked);
            applyAccessibilitySettings();
        });
    }
    if (noAnimationToggle) {
        noAnimationToggle.addEventListener('change', (e) => {
            localStorage.setItem('accessibility_no_animation', e.target.checked);
            applyAccessibilitySettings();
        });
    }

    // 3. データ管理 (リセットボタン)
    const resetButton = document.getElementById('reset-settings-button');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('全ての設定と保存されたデータ（ルーレット項目など）をリセットしてもよろしいですか？')) {
                localStorage.clear();
                alert('設定がリセットされました。ページをリロードします。');
                location.reload();
            }
        });
    }
    
    // 4. 文字数カウント機能 (変更なし)
    const textInput = document.getElementById('text-input');
    // ... (文字数カウントロジックは変更なし) ...

    // 5. ルーレット機能 (変更なし)
    const startButton = document.getElementById('start-button');
    // ... (ルーレットロジックは変更なし) ...

    // 99. ローディング画面を非表示にする
    setTimeout(() => {
        hideLoadingScreen(loadingOverlay);
    }, 500); 
});

/* --- 省略された文字数カウントとルーレットの関数は前バージョンから変更ありません --- */

// --- (前バージョンの文字数カウント、ルーレットロジックをここに挿入) ---
/* 以下、前バージョンから変更なし */
const updateCount = () => { 
    const textInput = document.getElementById('text-input');
    const charCountDisplay = document.getElementById('char-count');
    if (textInput && charCountDisplay) charCountDisplay.textContent = textInput.value.length; 
};
const applyTextStyles = () => {
    const textInput = document.getElementById('text-input');
    const fontSizeSelector = document.getElementById('font-size-selector');
    const fontColorSelector = document.getElementById('font-color-selector');
    if (!textInput) return;
    
    const size = localStorage.getItem('textFontSize') || '16px';
    const color = localStorage.getItem('textFontColor') || '#333333';
    textInput.style.fontSize = size;
    textInput.style.color = color;
    if (fontSizeSelector) fontSizeSelector.value = size;
    if (fontColorSelector) fontColorSelector.value = color;
};

let rouletteItems = JSON.parse(localStorage.getItem('rouletteItems')) || [];
const saveItems = () => {
    localStorage.setItem('rouletteItems', JSON.stringify(rouletteItems));
    // renderItems(); // DOMContentLoadedで実行されるためここでは省略
    // updateRouletteStatus(); // DOMContentLoadedで実行されるためここでは省略
};
// ... (ルーレットの renderItems, updateRouletteStatus, startRoulette は全て前バージョンと同一のロジックを使用) ...
// (ただし、DOMContentLoaded内の実行ロジックは上記で書き換えられている)
