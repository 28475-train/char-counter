/* ads.js - 広告表示の制御 */

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const allowsAds = body.getAttribute('data-ads') === 'true';

    if (!allowsAds) {
        console.log("Ad display is disabled on this page.");
        return;
    }

    function displayAd(elementId, adType) {
        const adElement = document.getElementById(elementId);
        if (adElement) {
            // ここに実際の広告ネットワークのタグを挿入します。
            adElement.innerHTML = `
                <div style="width: 100%; height: 50px; background-color: #ffe0b2; color: #e65100; line-height: 50px; font-size: 0.9em; border: 1px dashed #e65100; margin: auto;">
                    [広告エリア: ${adType}] - 篠ノ井乗務区提供
                </div>
            `;
            adElement.style.display = 'block';
        }
    }

    displayAd('ad-area-top', '上部バナー');
    displayAd('ad-area-bottom', '下部バナー');
});
