/**
 * Shared Desmos widget initialization logic
 * Used by both remark-desmos plugin and DesmosBlock component
 */

// Translations
const translations = {
    us: {
        clickToLoad: "Click to see graph",
        poweredBy: "(Graph powered by Desmos)",
        loading: "Loading Calculator..."
    },
    tw: {
        clickToLoad: "若要查看圖表，請點擊",
        poweredBy: "(圖表由 Desmos 提供)",
        loading: "正在載入圖形計算機..."
    },
    id: {
        clickToLoad: "Klik untuk melihat grafik",
        poweredBy: "(Grafik didukung oleh Desmos)",
        loading: "Memuat Kalkulator..."
    },
    su: {
        clickToLoad: "Нажмите, чтобы увидеть график",
        poweredBy: "(График на базе Desmos)",
        loading: "Загрузка калькулятора..."
    },
    hk: {
        clickToLoad: "撳掣睇圖",
        poweredBy: "(圖表由 Desmos 提供)",
        loading: "Load 緊圖形計數機..."
    }
};

/**
 * Initialize a Desmos calculator widget
 * @param {string} containerId - Unique ID for the calculator container
 * @param {Object} config - Configuration object
 * @param {string} config.key - Desmos API key
 * @param {string} config.lang - Language code for Desmos UI
 * @param {string} [config.state] - JSON string of calculator state
 */
export function initDesmosWidget(containerId, config = {}) {
    const container = document.getElementById(`${containerId}-container`);
    const placeholder = document.getElementById(`${containerId}-placeholder`);
    const placeholderTitle = document.getElementById(`${containerId}-placeholder-title`);
    const placeholderSubtitle = document.getElementById(`${containerId}-placeholder-subtitle`);
    const loading = document.getElementById(`${containerId}-loading`);
    const loadingText = document.getElementById(`${containerId}-loading-text`);
    const calculatorDiv = document.getElementById(containerId);

    if (!container || !placeholder || !calculatorDiv) return;

    // Read config from data attributes if not provided
    const apiKey = config.key || container.dataset.key;
    const lang = config.lang || container.dataset.defaultLang || 'us'; // Use defaultLang as fallback for API lang too
    const state = config.state || container.dataset.state;

    // Function to update translations based on current language
    function updateTranslations() {
        const currentLang = localStorage.getItem('lang') || 'us';
        const defaultLang = container.dataset.defaultLang || 'us';
        const t = translations[currentLang] || translations[defaultLang] || translations.us;

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

        // Fade out placeholder
        placeholder.style.transition = 'opacity 0.3s ease-in-out';
        placeholder.style.opacity = '0';

        setTimeout(() => {
            placeholder.style.display = 'none';
            loading.style.display = 'flex';
            // Fade in loading
            loading.style.transition = 'opacity 0.3s ease-in-out';
            loading.style.opacity = '1';
        }, 300);

        function init() {
            if (typeof Desmos === 'undefined') {
                if (!document.getElementById('desmos-api-script')) {
                    const script = document.createElement('script');
                    script.id = 'desmos-api-script';
                    script.src = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${apiKey}&lang=${lang}`;
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
                const calculatorState = state ? JSON.parse(state) : null;
                if (calculatorState) calculator.setState(calculatorState);
            } catch (e) {
                console.error('Failed to parse Desmos state', e);
            }

            // Fade out loading
            loading.style.transition = 'opacity 0.3s ease-in-out';
            loading.style.opacity = '0';

            setTimeout(() => {
                loading.style.display = 'none';
                calculatorDiv.style.display = 'block';
                // Fade in calculator
                calculatorDiv.style.transition = 'opacity 0.4s ease-in-out';
                calculatorDiv.style.opacity = '1';
            }, 300);
        }

        setTimeout(init, 50);
    }

    container.addEventListener('click', function () {
        if (placeholder.style.display !== 'none') {
            loadAndRun();
        }
    });
}

// Expose to window for Remark plugin usage
if (typeof window !== 'undefined') {
    window.initDesmosWidget = initDesmosWidget;
}
