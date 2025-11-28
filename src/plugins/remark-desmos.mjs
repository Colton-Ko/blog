import { visit } from 'unist-util-visit';
import dotenv from 'dotenv';
import { generateDesmosHTML } from '../components/desmos-template.ts';

// Load environment variables from .env file
dotenv.config();

/**
 * Remark plugin to transform :::desmos directives into interactive Desmos calculators.
 * 
 * @usage
 * This plugin is for use in Markdown (.md) files. For MDX or Astro files,
 * use the <DesmosBlock> component directly (see components/DesmosBlock.astro).
 * 
 * @example Using link attribute with .env API key
 * :::desmos{lang="en" link="https://www.desmos.com/calculator/abc123"}
 * :::
 * 
 * @example Using JSON code block with explicit key
 * :::desmos{key="API_KEY" lang="en"}
 * ```json
 * {"version": 11, "graph": {...}}
 * ```
 * :::
 * 
 * @features
 * - Environment variable: Reads API key from DESMOS_API_KEY in .env
 * - Click-to-load: Defers script loading until user interaction
 * - Link fetching: Automatically fetches graph state from Desmos URLs
 * - Graph paper UI: Polished placeholder with animations
 * - i18n: Multi-language support via localStorage
 * - Error handling: Validates mutually exclusive options
 */

/**
 * Checks if a directive node has body content (text or code block).
 */
function hasBodyContent(node) {
    if (!node.children) return false;
    return node.children.some(child =>
        (child.type === 'text' && child.value.trim()) ||
        (child.type === 'paragraph' && child.children.some(c => c.value?.trim())) ||
        child.type === 'code'
    );
}

/**
 * Extracts JSON state from directive children (code block or text).
 */
function extractStateFromBody(node) {
    if (!node.children) return '';

    // Prefer code blocks (preserves backslashes for LaTeX)
    const codeNode = node.children.find(child => child.type === 'code');
    if (codeNode) return codeNode.value;

    // Fallback to concatenating text children
    return node.children
        .filter(child => child.type === 'text' || child.type === 'paragraph')
        .map(child => {
            if (child.type === 'paragraph') {
                return child.children.map(c => c.value).join('');
            }
            return child.value;
        })
        .join('\n')
        .trim();
}

/**
 * Fetches Desmos graph state from a URL.
 */
async function fetchStateFromLink(link) {
    const response = await fetch(link, {
        headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch state from ${link}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
        console.warn(`[remark-desmos] Response from ${link} was not JSON.`);
        return '';
    }

    const jsonData = await response.json();
    if (jsonData?.state) {
        return JSON.stringify(jsonData.state);
    }

    console.warn(`[remark-desmos] JSON from ${link} does not contain 'state' property.`);
    return '';
}

export default function remarkDesmos() {
    return async (tree) => {
        const nodesToProcess = [];
        // Load API key from environment variable
        const envApiKey = process.env.DESMOS_API_KEY;

        visit(tree, (node) => {
            if (
                node.type === 'textDirective' ||
                node.type === 'leafDirective' ||
                node.type === 'containerDirective'
            ) {
                if (node.name !== 'desmos') return;
                nodesToProcess.push(node);
            }
        });

        await Promise.all(nodesToProcess.map(async (node) => {
            const data = node.data || (node.data = {});
            const attributes = node.attributes || {};
            const markdownKey = attributes.key;
            const link = attributes.link;
            const lang = attributes.lang || 'en';
            const height = attributes.height || '500px';
            const width = attributes.width || '100%';
            let state = attributes.state || '';

            // Validate: API key cannot be provided in both .env and markdown
            if (envApiKey && markdownKey) {
                throw new Error("API key found in both .env (DESMOS_API_KEY) and markdown attribute. Please use only one source.");
            }

            // Use env key or markdown key
            const key = markdownKey || envApiKey;

            if (!key) {
                throw new Error("Desmos API key is required. Provide it either in .env as DESMOS_API_KEY or as a 'key' attribute in the directive.");
            }

            // Validate: link and body are mutually exclusive
            if (link && hasBodyContent(node)) {
                throw new Error("You can only use either one of the link proprty or JSON state in code block for providing the state of the desmos graphing calculator.");
            }

            // Fetch state from link if provided
            if (link) {
                try {
                    state = await fetchStateFromLink(link);
                } catch {
                    throw new Error("Using link property in desmos directive requires internet connection.");
                }
            }

            // Extract state from body if no link
            if (!state && node.type === 'containerDirective' && !link) {
                state = extractStateFromBody(node);
            }

            const uniqueId = `calculator-${Math.random().toString(36).substring(2, 9)}`;

            // Generate HTML using shared template
            const htmlContent = generateDesmosHTML({ uniqueId, width, height });

            // Add initialization script that uses the shared widget module
            const html = `
${htmlContent}
<script type="module">
import { initDesmosWidget } from '/src/scripts/desmos-widget.js';

initDesmosWidget('${uniqueId}', {
    key: '${key}',
    lang: '${lang}',
    state: ${state ? JSON.stringify(state) : 'null'}
});
</script>
        `;

            data.hName = 'div';
            data.hProperties = {
                class: 'desmos-wrapper'
            };
            data.hChildren = [{
                type: 'raw',
                value: html
            }];
        }));
    };
}
