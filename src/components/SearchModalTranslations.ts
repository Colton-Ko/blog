// Translation strings for SearchModal component
// Organized by language code

export interface SearchModalTranslations {
    placeholder: string;
    emptyState: string;
    noResults: string;
    closeLabel: string;
}

export const searchModalTranslations: Record<string, SearchModalTranslations> = {
    us: {
        placeholder: "Search",
        emptyState: "Start typing to search.",
        noResults: "No results found.",
        closeLabel: "Close search"
    },
    tw: {
        placeholder: "搜尋",
        emptyState: "開始輸入以搜尋。",
        noResults: "沒有找到結果。",
        closeLabel: "關閉"
    },
    id: {
        placeholder: "Cari",
        emptyState: "Mulai mengetik untuk mencari.",
        noResults: "Tidak ada hasil.",
        closeLabel: "Tutup"
    },
    su: {
        placeholder: "Поиск",
        emptyState: "Начните вводить для поиска.",
        noResults: "Ничего не найдено.",
        closeLabel: "Закрыть поиск"
    },
    hk: {
        placeholder: "搵嘢",
        emptyState: "開始打字搵嘢。",
        noResults: "搵唔到有符合條件嘅結果。",
        closeLabel: "關閉"
    }
};

export function getSearchModalTranslation(lang: string): SearchModalTranslations {
    return searchModalTranslations[lang] || searchModalTranslations.us;
}
