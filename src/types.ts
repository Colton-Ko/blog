import type { MarkdownInstance } from 'astro';

export interface Frontmatter {
    title: string;
    description?: string;
    [key: string]: unknown;
}

export type Post = MarkdownInstance<Frontmatter>;
