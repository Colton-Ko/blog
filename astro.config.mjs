// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkDirective from 'remark-directive';
import remarkDesmos from './src/plugins/remark-desmos.mjs';
import remarkHighlight from './src/plugins/remark-highlight.mjs';
import remarkSubSup from './src/plugins/remark-subsup.mjs';
import remarkMathSource from './src/plugins/remark-math-source.mjs';
import rehypePreserveMermaid from './src/plugins/rehype-preserve-mermaid.mjs';
import reHypeMermaidClass from './src/plugins/rehype-mermaid-class.mjs';
import rehypeKatexSource from './src/plugins/rehype-katex-source.mjs';

// https://astro.build/config
export default defineConfig({
    integrations: [mdx()],
    markdown: {
        syntaxHighlight: false, // Disable Astro's default Shiki to let rehype plugins handle code blocks
        remarkPlugins: [
            remarkDirective,
            remarkDesmos,
            remarkMath,
            remarkMathSource, // Preserve LaTeX source before KaTeX processes it
            remarkHighlight,
            remarkSubSup,
        ],
        rehypePlugins: [
            rehypeRaw,
            [rehypeKatex, {
                // Use html output (no MathML) - LaTeX source preserved by remarkMathSource
                output: 'html',
                macros: {
                    '\\(': '\\mathsf{',
                    '\\)': '}',
                }
            }],
            // rehypeKatexSource,
            rehypeHighlight,
            rehypePreserveMermaid,
            [rehypeMermaid, { strategy: 'img-svg' }],
            reHypeMermaidClass,
        ],
    },
});
