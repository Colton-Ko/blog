import { visit } from 'unist-util-visit';

/**
 * Remark plugin to transform ::desmos{key="..." state="..."} directives into HTML.
 * 
 * Syntax:
 * ::desmos{key="API_KEY" state="JSON_STATE" lang="en"}
 */
export default function remarkDesmos() {
    return async (tree) => {
        const nodesToProcess = [];

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
            const key = attributes.key;
            let state = attributes.state || '';
            const link = attributes.link;
            const lang = attributes.lang || 'en';
            const height = attributes.height || '500px';
            const width = attributes.width || '100%';

            // Conflict Check: Check if both link and body exist
            const hasBody = node.children && node.children.some(child =>
                (child.type === 'text' && child.value.trim()) ||
                (child.type === 'paragraph' && child.children.some(c => c.value && c.value.trim())) || // Check for value in children of paragraph
                child.type === 'code'
            );

            if (link && hasBody) {
                throw new Error("You can only use either one of the link proprty or JSON state in code block for providing the state of the desmos graphing calculator.");
            }

            if (link) {
                try {
                    // Use corsproxy.io to bypass potential CORS issues if running in browser, 
                    // but here we are in Node.js build time, so we can fetch directly?
                    // Desmos might block direct requests without User-Agent or from non-browsers.
                    // Let's try direct fetch first, as we are server-side.
                    // Actually, the user's helper tool used corsproxy.io. 
                    // But for server-side build, we should try direct fetch.
                    // However, we need to ensure we get JSON.

                    const response = await fetch(link, {
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        // If response is not ok, it might be due to network issues or invalid URL
                        // The user specifically asked for "Using link property in desmos directive requires internet connection."
                        // We can try to be more specific if possible, but let's stick to the requested message for fetch failures generally
                        throw new Error(`Failed to fetch state from ${link}: ${response.statusText}`);
                    }

                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const jsonData = await response.json();
                        // The state might be wrapped in a 'state' property or be the root object depending on the endpoint?
                        // Based on user's helper tool: rawData = data.state;
                        if (jsonData && jsonData.state) {
                            state = JSON.stringify(jsonData.state);
                        } else {
                            console.warn(`[remark-desmos] JSON from ${link} does not contain 'state' property.`);
                        }
                    } else {
                        console.warn(`[remark-desmos] Response from ${link} was not JSON.`);
                    }
                } catch (error) {
                    // Check if it's a network error (e.g., offline)
                    if (error.cause && (error.cause.code === 'ENOTFOUND' || error.cause.code === 'EAI_AGAIN')) {
                        throw new Error("Using link property in desmos directive requires internet connection.");
                    }
                    // Also throw the specific message for other fetch errors as requested, or rethrow?
                    // The user said: "Throw an error ... if there is no internet connection ... The error message should say 'Using link property in desmos directive requires internet connection.'"
                    // Let's assume any fetch error implies connectivity issue or unreachable host in this context.
                    throw new Error("Using link property in desmos directive requires internet connection.");
                }
            }

            // If state is not in attributes (and fetch failed or no link), and it's a container directive, try to get it from children
            if (!state && node.type === 'containerDirective' && node.children && !link) {
                // First check if there is a code block, which preserves raw content (backslashes)
                const codeNode = node.children.find(child => child.type === 'code');
                if (codeNode) {
                    state = codeNode.value;
                } else {
                    // Fallback: Concatenate all text children to form the JSON string
                    state = node.children
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
            }

            if (!key) return;

            const uniqueId = `calculator-${Math.random().toString(36).substring(2, 9)}`;

            // Create the HTML structure for the calculator
            // We inject the script directly here since we are in a remark plugin processing markdown to HTML

            const html = `
<div id="${uniqueId}-container" class="desmos-container" style="width: ${width}; height: ${height}; position: relative; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.2s ease;">
    <!-- Graph Paper Background -->
    <div style="position: absolute; inset: 0; background-color: #f8f9fa; background-image: linear-gradient(#e9ecef 1px, transparent 1px), linear-gradient(90deg, #e9ecef 1px, transparent 1px); background-size: 20px 20px; z-index: 0;"></div>
    
    <!-- Placeholder Content -->
    <div id="${uniqueId}-placeholder" style="position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #495057; font-family: system-ui, sans-serif; transition: opacity 0.2s;">
        <div style="font-size: 1.2em; font-weight: 700; margin-bottom: 8px;">Click to see graph</div>
        <div style="font-size: 0.9em; opacity: 0.7;">(Graph powered by Desmos)</div>
    </div>

    <!-- Loading Overlay -->
    <div id="${uniqueId}-loading" style="display: none; position: absolute; inset: 0; z-index: 2; background: rgba(248, 249, 250, 0.9); align-items: center; justify-content: center; flex-direction: column; opacity: 0;">
        <div style="width: 24px; height: 24px; border: 3px solid #dee2e6; border-top-color: #495057; border-radius: 50%; animation: desmos-spin 1s linear infinite; margin-bottom: 12px;"></div>
        <div style="font-size: 0.9em; color: #495057; font-weight: 500;">Loading Calculator...</div>
    </div>

    <!-- Calculator Container -->
    <div id="${uniqueId}" style="position: relative; z-index: 3; width: 100%; height: 100%; display: none; opacity: 0;"></div>
</div>
<style>
@keyframes desmos-spin {
    to { transform: rotate(360deg); }
}
</style>
<script type="module">
import { animate } from 'https://cdn.skypack.dev/motion@12.23.24';

(function() {
    var container = document.getElementById('${uniqueId}-container');
    var placeholder = document.getElementById('${uniqueId}-placeholder');
    var loading = document.getElementById('${uniqueId}-loading');
    var calculatorDiv = document.getElementById('${uniqueId}');
    
    if (!container || !placeholder || !calculatorDiv) return;

    // Hover effect
    container.addEventListener('mouseenter', function() {
        if (placeholder.style.display !== 'none') {
            container.style.filter = 'brightness(0.95)';
        }
    });
    container.addEventListener('mouseleave', function() {
        container.style.filter = 'none';
    });

    // Click effect (dimming)
    container.addEventListener('mousedown', function() {
        if (placeholder.style.display !== 'none') {
            container.style.transform = 'scale(0.995)';
            container.style.filter = 'brightness(0.9)';
        }
    });
    container.addEventListener('mouseup', function() {
        container.style.transform = 'none';
    });

    function loadAndRun() {
        container.style.cursor = 'default';
        container.style.filter = 'none';
        
        // Animate placeholder fade out
        animate(placeholder, { opacity: 0 }, { duration: 0.3, easing: 'ease-in-out' }).finished.then(() => {
            placeholder.style.display = 'none';
            loading.style.display = 'flex';
            // Animate loading fade in
            animate(loading, { opacity: 1 }, { duration: 0.3, easing: 'ease-in-out' });
        });
        
        function init() {
            if (typeof Desmos === 'undefined') {
                if (!document.getElementById('desmos-api-script')) {
                    var script = document.createElement('script');
                    script.id = 'desmos-api-script';
                    script.src = 'https://www.desmos.com/api/v1.11/calculator.js?apiKey=${key}&lang=${lang}';
                    script.async = true;
                    script.onload = function() {
                        document.dispatchEvent(new Event('desmos-ready'));
                        init();
                    };
                    document.head.appendChild(script);
                } else {
                    document.addEventListener('desmos-ready', init, { once: true });
                    var checkInterval = setInterval(function() {
                        if (typeof Desmos !== 'undefined') {
                            clearInterval(checkInterval);
                            init();
                        }
                    }, 100);
                }
                return;
            }
            
            var calculator = Desmos.GraphingCalculator(calculatorDiv);
            try {
                var state = ${state ? JSON.stringify(JSON.parse(state)) : 'null'};
                if (state) calculator.setState(state);
            } catch(e) {
                console.error('Failed to parse Desmos state', e);
            }

            // Animate loading fade out and calculator fade in
            animate(loading, { opacity: 0 }, { duration: 0.3, easing: 'ease-in-out' }).finished.then(() => {
                loading.style.display = 'none';
                calculatorDiv.style.display = 'block';
                animate(calculatorDiv, { opacity: 1 }, { duration: 0.4, easing: 'ease-in-out' });
            });
        }
        
        setTimeout(init, 50);
    }

    container.addEventListener('click', function() {
        if (placeholder.style.display !== 'none') {
            loadAndRun();
        }
    });
})();
</script>
        `;

            data.hName = 'div';
            data.hProperties = {
                class: 'desmos-wrapper'
            };
            // We replace the node's children with a raw HTML node containing our script and div
            // This requires rehype-raw to be enabled in the Astro config (which it is)
            data.hChildren = [{
                type: 'raw',
                value: html
            }];
        }));
    };
}
