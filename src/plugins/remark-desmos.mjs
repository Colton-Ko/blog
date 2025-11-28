import { visit } from 'unist-util-visit';

/**
 * Remark plugin to transform ::desmos{key="..." state="..."} directives into HTML.
 * 
 * Syntax:
 * ::desmos{key="API_KEY" state="JSON_STATE" lang="en"}
 */
export default function remarkDesmos() {
    return (tree) => {
        visit(tree, (node) => {
            if (
                node.type === 'textDirective' ||
                node.type === 'leafDirective' ||
                node.type === 'containerDirective'
            ) {
                if (node.name !== 'desmos') return;

                const data = node.data || (node.data = {});
                const attributes = node.attributes || {};
                const key = attributes.key;
                let state = attributes.state || '';
                const lang = attributes.lang || 'en';
                const height = attributes.height || '500px';
                const width = attributes.width || '100%';

                // If state is not in attributes and it's a container directive, try to get it from children
                if (!state && node.type === 'containerDirective' && node.children) {
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
<div id="${uniqueId}-container" class="desmos-container" style="width: ${width}; height: ${height}; position: relative; background: #f0f0f0; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;">
    <div id="${uniqueId}-placeholder" style="text-align: center; color: #666; font-family: system-ui, sans-serif;">
        <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 8px;">Click to run Desmos</div>
        <div style="font-size: 0.9em;">(Loads external script)</div>
    </div>
    <div id="${uniqueId}" style="width: 100%; height: 100%; display: none;"></div>
</div>
<script>
(function() {
    var container = document.getElementById('${uniqueId}-container');
    var placeholder = document.getElementById('${uniqueId}-placeholder');
    var calculatorDiv = document.getElementById('${uniqueId}');
    
    if (!container || !placeholder || !calculatorDiv) return;

    // Hover effect
    container.addEventListener('mouseenter', function() {
        if (placeholder.style.display !== 'none') {
            container.style.background = '#e0e0e0';
        }
    });
    container.addEventListener('mouseleave', function() {
        if (placeholder.style.display !== 'none') {
            container.style.background = '#f0f0f0';
        }
    });

    function loadAndRun() {
        // Show loading state if needed, or just switch visibility
        placeholder.style.display = 'none';
        calculatorDiv.style.display = 'block';
        container.style.background = 'transparent';
        container.style.border = 'none';
        container.style.cursor = 'default';
        
        function init() {
            if (typeof Desmos === 'undefined') {
                 // Load Desmos script if not present
                if (!document.getElementById('desmos-api-script')) {
                    var script = document.createElement('script');
                    script.id = 'desmos-api-script';
                    script.src = 'https://www.desmos.com/api/v1.11/calculator.js?apiKey=${key}&lang=${lang}';
                    script.async = true;
                    script.onload = function() {
                        // Dispatch a custom event so other pending calculators know it's loaded
                        document.dispatchEvent(new Event('desmos-ready'));
                        init();
                    };
                    document.head.appendChild(script);
                } else {
                    // Script is loading, wait for it
                     document.addEventListener('desmos-ready', init, { once: true });
                     // Fallback polling just in case
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
        }
        
        init();
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
            }
        });
    };
}
