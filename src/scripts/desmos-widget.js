/**
 * Shared Desmos widget initialization logic
 * Used by both remark-desmos plugin and DesmosBlock component
 */

import { animate } from 'https://cdn.skypack.dev/motion@12.23.24';
import { getDesmosTranslation } from '../components/DesmosTranslations.ts';

/**
 * Initialize a Desmos calculator widget
 * @param {string} containerId - Unique ID for the calculator container
 * @param {Object} config - Configuration object
 * @param {string} config.key - Desmos API key
 * @param {string} config.lang - Language code for Desmos UI
 * @param {string} [config.state] - JSON string of calculator state
 */
export function initDesmosWidget(containerId, config) {
    const container = document.getElementById(`${containerId}-container`);
    const placeholder = document.getElementById(`${containerId}-placeholder`);
    const placeholderTitle = document.getElementById(`${containerId}-placeholder-title`);
    const placeholderSubtitle = document.getElementById(`${containerId}-placeholder-subtitle`);
    const loading = document.getElementById(`${containerId}-loading`);
    const loadingText = document.getElementById(`${containerId}-loading-text`);
    const calculatorDiv = document.getElementById(containerId);

    if (!container || !placeholder || !calculatorDiv) return;

    // Function to update translations based on current language
    function updateTranslations() {
        const currentLang = localStorage.getItem('lang') || 'us';
        const t = getDesmosTranslation(currentLang);

        placeholderTitle.textContent = t.clickToLoad;
        placeholderSubtitle.textContent = t.poweredBy;
        loadingText.textContent = t.loading;
    }

    // Initial translation
    updateTranslations();

    // Listen for language changes (custom event pattern)
    window.addEventListener('languagechange', updateTranslations);

    // Also listen for storage events (when language changes from another tab)
    window.addEventListener('storage', function (e) {
        if (e.key === 'lang') {
            updateTranslations();
        }
    });

    // Hover effect
    container.addEventListener('mouseenter', function () {
        if (placeholder.style.display !== 'none') {
            container.style.filter = 'brightness(0.95)';
        }
    });
    container.addEventListener('mouseleave', function () {
        container.style.filter = 'none';
    });

    // Click effect (dimming)
    container.addEventListener('mousedown', function () {
        if (placeholder.style.display !== 'none') {
            container.style.transform = 'scale(0.995)';
            container.style.filter = 'brightness(0.9)';
        }
    });
    container.addEventListener('mouseup', function () {
        container.style.transform = 'none';
    });

    function loadAndRun() {
        container.style.cursor = 'default';
        container.style.filter = 'none';

        // Animate placeholder fade out
        animate(placeholder, { opacity: 0 }, { duration: 0.3, easing: 'ease-in-out' }).finished.then(() => {
            placeholder.style.display = 'none';
            loading.style.display = 'flex';
            // Animate loading fade in
            animate(loading, { opacity: 1 }, { duration: 0.3, easing: 'ease-in-out' });
        });

        function init() {
            if (typeof Desmos === 'undefined') {
                if (!document.getElementById('desmos-api-script')) {
                    const script = document.createElement('script');
                    script.id = 'desmos-api-script';
                    script.src = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${config.key}&lang=${config.lang}`;
                    script.async = true;
                    script.onload = function () {
                        document.dispatchEvent(new Event('desmos-ready'));
                        init();
                    };
                    document.head.appendChild(script);
                } else {
                    document.addEventListener('desmos-ready', init, { once: true });
                    const checkInterval = setInterval(function () {
                        if (typeof Desmos !== 'undefined') {
                            clearInterval(checkInterval);
                            init();
                        }
                    }, 100);
                }
                return;
            }

            const calculator = Desmos.GraphingCalculator(calculatorDiv);
            try {
                const state = config.state ? JSON.parse(config.state) : null;
                if (state) calculator.setState(state);
            } catch (e) {
                console.error('Failed to parse Desmos state', e);
            }

            // Animate loading fade out and calculator fade in
            animate(loading, { opacity: 0 }, { duration: 0.3, easing: 'ease-in-out' }).finished.then(() => {
                loading.style.display = 'none';
                calculatorDiv.style.display = 'block';
                animate(calculatorDiv, { opacity: 1 }, { duration: 0.4, easing: 'ease-in-out' });
            });
        }

        setTimeout(init, 50);
    }

    container.addEventListener('click', function () {
        if (placeholder.style.display !== 'none') {
            loadAndRun();
        }
    });
}
