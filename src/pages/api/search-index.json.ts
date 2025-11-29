import { getDefaultLanguage } from "../../../config.language";
import type { Post } from "../../types";

const DEFAULT_LANG = getDefaultLanguage();

export const prerender = true;

interface SearchIndexItem {
    title: string;
    content: string;
    slug: string;
    lang: string;
    url: string;
    headingLevel: number;
}

export async function GET() {
    // Import all markdown files from posts
    const postFiles = import.meta.glob('/src/content/posts/**/*.md', { eager: true });

    const searchIndex: SearchIndexItem[] = [];

    for (const [path, module] of Object.entries(postFiles)) {
        const post = module as Post; // Type assertion for glob imports
        const { frontmatter, compiledContent } = post;

        // Extract language from filename (e.g., sample_us.md -> us)
        const langMatch = path.match(/_([a-z]{2})\.md$/);
        const lang = langMatch ? langMatch[1] : DEFAULT_LANG;

        // Extract slug from path
        const slugMatch = path.match(/\/posts\/([^/]+)\//);
        const slug = slugMatch?.[1] ?? '';

        // Simple slugify function for headings
        const slugify = (text: string): string => {
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-');
        };

        // Add the main post (title only)
        searchIndex.push({
            title: frontmatter.title || '',
            content: frontmatter.description || '', // Use description for preview if available, but no body content
            slug: slug,
            lang: lang,
            url: `/posts/${slug}`,
            headingLevel: 0 // 0 for Title
        });

        // Process headings if we have raw content
        const rawContent = post.rawContent?.() ?? '';
        if (rawContent) {
            const lines = rawContent.split('\n');

            for (const line of lines) {
                // Match headings (h1-h6)
                const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
                if (headingMatch) {
                    const level = headingMatch[1].length; // 1-6
                    const headingText = headingMatch[2].trim();
                    if (headingText) {
                        const headingSlug = slugify(headingText);

                        searchIndex.push({
                            title: `${frontmatter.title}`,
                            content: headingText, // The heading itself is the content/preview
                            slug: slug,
                            lang: lang,
                            url: `/posts/${slug}#${headingSlug}`,
                            headingLevel: level
                        });
                    }
                }
            }
        }
    }

    return new Response(JSON.stringify(searchIndex), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
