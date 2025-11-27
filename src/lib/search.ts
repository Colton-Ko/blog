// Client-side search functionality using Fuse.js
import Fuse from 'fuse.js';

let searchIndex = [];
let fuse: Fuse<string> | null = null;

export async function initializeSearch() {
    try {
        const response = await fetch('/api/search-index.json');
        searchIndex = await response.json();

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

export function performSearchQuery(query: string) {
    if (!fuse || !query) {
        return [];
    }
    return fuse.search(query);
}
