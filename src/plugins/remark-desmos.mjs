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
                const state = attributes.state || '';
                const lang = attributes.lang || 'en';
                const height = attributes.height || '500px';
                const width = attributes.width || '100%';

                if (!key) return;

                const uniqueId = `calculator-${Math.random().toString(36).substring(2, 9)}`;

                // Create the HTML structure for the calculator
                // We inject the script directly here since we are in a remark plugin processing markdown to HTML

                const html = `
<div id="${uniqueId}" class="desmos-calculator" style="width: ${width}; height: ${height};"></div>
<script>
(function() {
    function init() {
        var elt = document.getElementById('${uniqueId}');
        if (!elt) return;
        
        if (typeof Desmos === 'undefined') {
            // Load Desmos script if not present
            if (!document.getElementById('desmos-api-script')) {
                var script = document.createElement('script');
                script.id = 'desmos-api-script';
                script.src = 'https://www.desmos.com/api/v1.11/calculator.js?apiKey=${key}&lang=${lang}';
                script.async = true;
                script.onload = init;
                document.head.appendChild(script);
            } else {
                setTimeout(init, 100);
            }
            return;
        }
        
        var calculator = Desmos.GraphingCalculator(elt);
        try {
            var state = ${state ? JSON.stringify(JSON.parse(state)) : 'null'};
            if (state) calculator.setState(state);
        } catch(e) {
            console.error('Failed to parse Desmos state', e);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
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
