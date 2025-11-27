// Translation strings for Code Block Header Bar
// Organized by language code

export interface CodeBlockHandlerTranslations {
    ariaLabel: string;
}

export const codeBlockHandlerTranslations: Record<string, CodeBlockHandlerTranslations> = {
    us: {
        ariaLabel: "Copy code to clipboard"
    },
    tw: {
        ariaLabel: "複製代碼到剪貼簿"
    },
    id: {
        ariaLabel: "Salin kode ke clipboard"
    },
    su: {
        ariaLabel: "Копировать код в буфер обмена"
    },
    hk: {
        ariaLabel: "複製代碼去剪貼簿"
    }
};

export function getCodeBlockHandlerTranslation(lang: string): CodeBlockHandlerTranslations {
    return codeBlockHandlerTranslations[lang] || codeBlockHandlerTranslations.us;
}
