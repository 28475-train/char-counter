/* script.js - 共通機能（テーマ設定、文字数カウントロジック、アニメーション制御、ルーレット制御、アクセシビリティ制御、お知らせ） */

const THEME_OPTIONS = [
    { value: 'light_green', name: 'ライトグリーン (初期)' },
    { value: 'deep_blue', name: 'ディープブルー' },
    { value: 'sunset_orange', name: 'サンセットオレンジ' },
    { value: 'modern_grey', name: 'モダングレイ (ダーク)' },
    { value: 'classic_red', name: 'クラシックレッド' }
];

// ====================================
// お知らせデータ
// ====================================
const ANNOUNCEMENTS = [
    { date: "2025-12-16", text: "📢 トップページに『お知らせ』エリアを追加しました。" },
    { date: "2025-12-16", text: "⚙️ 設定ページにアクセシビリティ設定（文字サイズ、色の反転、アニメ無効化）を追加しました。" },
    { date: "2025-12-15", text: "📝 文字数カウント機能のダウンロードボタンを追加しました。" },
    { date: "2025-12-10", text: "🎨 新しいテーマ「モダングレイ（ダーク）」を追加しました。" },
    { date: "2025-12-01", text: "🌐 サイト全体をレスポンシブデザインに最適化しました。" }
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
    
    // settings.html のフォーム要素の状態を更新
    const textZoomSelector = document.getElementById('text-zoom-selector');
    const invertColorsToggle = document.getElementById('invert-colors-toggle');
    const grayscaleToggle = document.getElementById('grayscale-toggle');
    const noAnimationToggle = document.getElementById('no-animation-toggle');
    
    if (textZoomSelector) textZoomSelector.value = zoomLevel;
    if (invertColorsToggle) invertColorsToggle.checked = invertColors;
    if (grayscaleToggle) grayscaleToggle.checked = grayscale;
    if (noAnimationToggle) noAnimationToggle.checked = noAnimation;
}

// ====================================
// お知らせのレンダリング
// ====================================
function renderAnnouncements() {
    const listContainer = document.getElementById('announcement-list');
    if (!listContainer) return;

    listContainer.innerHTML = ''; 
    
    ANNOUNCEMENTS.forEach(announcement => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="date">[${announcement.date}]</span> ${announcement.text}`;
        listContainer.appendChild(li);
    });
}


// ====================================
// 文字数カウント機能
// ====================================
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

// ====================================
// ルーレット機能
// ====================================
let rouletteItems = JSON.parse(localStorage.getItem('rouletteItems')) || [];

const saveItems = () => {
    localStorage.setItem('rouletteItems', JSON.stringify(rouletteItems));
    renderItems();
    updateRouletteStatus();
};

const renderItems = () => {
    const rouletteItemsContainer = document.getElementById('roulette-items');
    if (!rouletteItemsContainer) return;
    
    rouletteItemsContainer.innerHTML = '';
    if (rouletteItems.length === 0) {
        rouletteItemsContainer.innerHTML = '<p style="color: #777;">（項目を2つ以上追加してください）</p>';
        return;
    }
    rouletteItems.forEach((item, index) => {
        const tag = document.createElement('span');
        tag.className = 'item-tag';
        tag.innerHTML = `${item} <button data-index="${index}">×</button>`;
        rouletteItemsContainer.appendChild(tag);
    });
    rouletteItemsContainer.querySelectorAll('.item-tag button').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            rouletteItems.splice(index, 1);
            saveItems();
        });
    });
};

const updateRouletteStatus = () => {
    const startButton = document.getElementById('start-button');
    const itemCountStatus = document.getElementById('item-count-status');
    
    if (startButton) {
        const count = rouletteItems.length;
        // 2つ未満の場合は非表示
        const statusStyle = count >= 2 ? 'none' : 'block'; 
        startButton.disabled = count < 2;
        if (itemCountStatus) itemCountStatus.style.display = statusStyle;
    }
};

const startRoulette = () => {
    const startButton = document.getElementById('start-button');
    const rouletteDisplay = document.getElementById('roulette-display');
    
    if (rouletteItems.length < 2 || startButton.disabled) return;
    
    startButton.disabled = true;
    rouletteDisplay.textContent = '回転中...';
    
    // 2秒間のランダムな演出
    let spinCount = 0;
    const interval = setInterval(() => {
        const spinningItem = rouletteItems[Math.floor(Math.random() * rouletteItems.length)];
        rouletteDisplay.textContent = spinningItem;
        spinCount++;
        if (spinCount > 30) { 
             clearInterval(interval);
        }
    }, 50);

    setTimeout(() => {
        clearInterval(interval);
        const randomIndex = Math.floor(Math.random() * rouletteItems.length);
        const result = rouletteItems[randomIndex];
        rouletteDisplay.textContent = `結果: ${result} に決定しました！`;
        startButton.disabled = false;
    }, 2000); 
};


// ====================================
// DOMContentLoaded (メイン処理)
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = showLoadingScreen();
    const body = document.body;
    
    // 0. お知らせのレンダリング
    renderAnnouncements(); 

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
    
    // 4. 文字数カウント機能の初期化
    const textInput = document.getElementById('text-input');
    const downloadButton = document.getElementById('download-button');
    const fontSizeSelector = document.getElementById('font-size-selector');
    const fontColorSelector = document.getElementById('font-color-selector');

    if (textInput) {
        updateCount();
        textInput.addEventListener('input', updateCount);

        if (downloadButton) {
            downloadButton.addEventListener('click', () => {
                const textToSave = textInput.value;
                const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'multi-toolbox_text_data.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        }
        
        applyTextStyles(); 
        
        if (fontSizeSelector) {
            fontSizeSelector.addEventListener('change', (e) => {
                localStorage.setItem('textFontSize', e.target.value);
                applyTextStyles(); 
            });
        }
        if (fontColorSelector) {
            fontColorSelector.addEventListener('input', (e) => {
                localStorage.setItem('textFontColor', e.target.value);
                applyTextStyles();
            });
        }
        textInput.focus();
    }

    // 5. ルーレット機能の初期化
    const startButton = document.getElementById('start-button');
    const addItemButton = document.getElementById('add-item-button');
    const itemInput = document.getElementById('item-input');

    if (itemInput && addItemButton) {
        addItemButton.addEventListener('click', () => {
            const newItem = itemInput.value.trim();
            if (newItem && !rouletteItems.includes(newItem)) {
                rouletteItems.push(newItem);
                itemInput.value = '';
                saveItems();
            } else if (newItem) {
                alert('その項目は既に追加されています。');
            }
        });
        itemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); addItemButton.click(); }
        });
    }

    if (startButton) {
        startButton.addEventListener('click', startRoulette);
    }
    
    // ルーレット項目の初期描画と状態更新
    renderItems();
    updateRouletteStatus();


    // 99. ローディング画面を非表示にする
    setTimeout(() => {
        hideLoadingScreen(loadingOverlay);
    }, 500); 
});
