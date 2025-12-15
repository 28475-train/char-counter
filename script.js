/* script.js - 共通機能（テーマ設定、文字数カウントロジック、アニメーション制御、ルーレット制御） */

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
        applyAnimations();
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

document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = showLoadingScreen();

    // 1. テーマ設定の初期化と制御
    const body = document.body;
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

    // 2. 文字数カウント機能と拡張機能
    const textInput = document.getElementById('text-input');
    const charCountDisplay = document.getElementById('char-count');
    const downloadButton = document.getElementById('download-button');
    const fontSizeSelector = document.getElementById('font-size-selector');
    const fontColorSelector = document.getElementById('font-color-selector');

    if (textInput && charCountDisplay) {
        // カウントロジック
        const updateCount = () => { charCountDisplay.textContent = textInput.value.length; };
        updateCount();
        textInput.addEventListener('input', updateCount);

        // ダウンロード機能
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
        
        // サイズ・色変更機能
        const applyTextStyles = () => {
            const size = localStorage.getItem('textFontSize') || '16px';
            const color = localStorage.getItem('textFontColor') || '#333333';
            textInput.style.fontSize = size;
            textInput.style.color = color;
            if (fontSizeSelector) fontSizeSelector.value = size;
            if (fontColorSelector) fontColorSelector.value = color;
        };

        if (fontSizeSelector) {
            fontSizeSelector.addEventListener('change', (e) => {
                localStorage.setItem('textFontSize', e.target.value);
                textInput.style.fontSize = e.target.value;
            });
        }
        if (fontColorSelector) {
            fontColorSelector.addEventListener('input', (e) => {
                localStorage.setItem('textFontColor', e.target.value);
                textInput.style.color = e.target.value;
            });
        }
        applyTextStyles(); 
        textInput.focus();
    }

    // 3. ルーレット機能と拡張機能
    const startButton = document.getElementById('start-button');
    const rouletteDisplay = document.getElementById('roulette-display');
    const itemInput = document.getElementById('item-input');
    const addItemButton = document.getElementById('add-item-button');
    const rouletteItemsContainer = document.getElementById('roulette-items');
    const itemCountStatus = document.getElementById('item-count-status');
    let rouletteItems = JSON.parse(localStorage.getItem('rouletteItems')) || [];

    const saveItems = () => {
        localStorage.setItem('rouletteItems', JSON.stringify(rouletteItems));
        renderItems();
        updateRouletteStatus();
    };

    const renderItems = () => {
        if (!rouletteItemsContainer) return;
        rouletteItemsContainer.innerHTML = '';
        if (rouletteItems.length === 0) {
            rouletteItemsContainer.innerHTML = '<p style="color: #777;">（項目を3つ以上追加してください）</p>';
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
        if (startButton) {
            const count = rouletteItems.length;
            const statusStyle = count >= 2 ? 'none' : 'block';
            startButton.disabled = count < 2;
            if (itemCountStatus) itemCountStatus.style.display = statusStyle;
        }
    };

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

    if (startButton && rouletteDisplay) {
        const startRoulette = () => {
            if (rouletteItems.length < 2) return;
            startButton.disabled = true;
            rouletteDisplay.textContent = '回転中...';
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * rouletteItems.length);
                const result = rouletteItems[randomIndex];
                rouletteDisplay.textContent = `結果: ${result} に決定しました！`;
                startButton.disabled = false;
            }, 2000); 
        };
        startButton.addEventListener('click', startRoulette);
    }
    renderItems();
    updateRouletteStatus();

    // 4. ローディング画面を非表示にする
    setTimeout(() => {
        hideLoadingScreen(loadingOverlay);
    }, 500); 
});
