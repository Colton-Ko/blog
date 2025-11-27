// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkHighlight from './src/plugins/remark-highlight.mjs';
import remarkSubSup from './src/plugins/remark-subsup.mjs';
import rehypePreserveMermaid from './src/plugins/rehype-preserve-mermaid.mjs';
import reHypeMermaidClass from './src/plugins/rehype-mermaid-class.mjs';

// https://astro.build/config
export default defineConfig({
    integrations: [mdx()],
    markdown: {
        syntaxHighlight: false, // Disable Astro's default Shiki to let rehype plugins handle code blocks
        remarkPlugins: [
            remarkMath,
            remarkHighlight,
            remarkSubSup,
        ],
        rehypePlugins: [
            rehypeRaw,
            [rehypeKatex, {
                macros: {
                    '\\(': '\\mathsf{',
                    '\\)': '}',
                }
            }],
            rehypeHighlight,
            rehypePreserveMermaid, // Add before mermaid to wrap and preserve source
            [rehypeMermaid, { strategy: 'img-svg' }],
            reHypeMermaidClass,
        ],
    },
});
