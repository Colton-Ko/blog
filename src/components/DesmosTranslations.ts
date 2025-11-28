// Translation strings for Desmos components
// Organized by language code

export interface DesmosTranslations {
    clickToLoad: string;
    poweredBy: string;
    loading: string;
}

export const desmosTranslations: Record<string, DesmosTranslations> = {
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

export function getDesmosTranslation(lang: string): DesmosTranslations {
    return desmosTranslations[lang] || desmosTranslations.us;
}
