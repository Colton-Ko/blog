import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to wrap math blocks in a container
 * The data-source attribute is already set by remark-math-source
 * This plugin just wraps .katex-display in a container div
 */
export default function rehypeKatexSource() {
    return (tree) => {
        visit(tree, 'element', (node, index, parent) => {
            // Only process display math (katex-display)
            if (!node.properties?.className?.includes('katex-display')) {
                return;
            }

            // Check if already wrapped
            if (parent?.properties?.className?.includes('math-block-container')) {
                return;
            }

            // Get data-source from the katex-display element (set by remarkMathSource)
            const dataSource = node.properties['data-source'] || node.properties.dataSource;

            // Wrap the katex-display in a container with data-source
            const wrapper = {
                type: 'element',
                tagName: 'div',
                properties: {
                    className: ['math-block-container'],
                    'data-source': dataSource
                },
                children: [node]
            };

            // Replace the katex-display with the wrapper
            if (parent && typeof index === 'number') {
                parent.children[index] = wrapper;
            }
        });
    };
}
