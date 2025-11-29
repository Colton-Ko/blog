// Client-side search functionality using Fuse.js
import Fuse, { type FuseResult } from 'fuse.js';

interface SearchIndexItem {
    title: string;
    content: string;
    slug: string;
    lang: string;
    url: string;
    headingLevel: number;
}

let searchIndex: SearchIndexItem[] = [];
let fuse: Fuse<SearchIndexItem> | null = null;

export async function initializeSearch(): Promise<boolean> {
    try {
        const response = await fetch('/api/search-index.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch search index: ${response.statusText}`);
        }

        searchIndex = await response.json() as SearchIndexItem[];

        // Initialize Fuse.js
        fuse = new Fuse(searchIndex, {
            keys: ['title', 'content'],
            threshold: 0.3,
            includeScore: true,
            ignoreLocation: true,
        });

        return true;
    } catch (error) {
        console.error('Failed to load search index:', error);
        return false;
    }
}

export function performSearchQuery(query: string): FuseResult<SearchIndexItem>[] {
    if (!fuse || !query.trim()) {
        return [];
    }
    return fuse.search(query);
}
