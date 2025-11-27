// Central configuration for multi-language support

export interface LanguageConfig {
    code: string;
    name: string;
}

export const languages: Record<string, string> = {
    us: "American english",
    tw: "臺灣中文",
    id: "Bahasa Indonesia",
    su: "Русский язык",
    hk: "香港廣東話"
};

export const DEFAULT_LANGUAGE = "us";

// Helper functions
export function getLanguages(): Record<string, string> {
    return languages;
}

export function getLanguageCodes(): string[] {
    return Object.keys(languages);
}

export function getDefaultLanguage(): string {
    return DEFAULT_LANGUAGE;
}

export function getLanguageName(code: string): string | undefined {
    return languages[code];
}

export function isValidLanguageCode(code: string): boolean {
    return code in languages;
}

// Generate regex pattern for matching language suffixes
// e.g., "index_(us|tw|id|su|hk).md"
export function getLanguagePattern(): string {
    const codes = getLanguageCodes().join("|");
    return `(${codes})`;
}

// Generate glob pattern for file extensions
// e.g., "*.{md,mdx}"
export function getContentExtensions(): string {
    return "{md,mdx}";
}
