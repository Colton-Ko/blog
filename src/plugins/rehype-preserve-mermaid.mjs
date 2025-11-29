import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to preserve Mermaid code blocks and wrap them for client-side rendering
 * @returns {(tree: import('hast').Root) => void} Transformer function
 */
export default function rehypePreserveMermaid() {
    return (tree) => {
        visit(tree, 'element', (node, index, parent) => {
            if (!parent || index === null || index === undefined) {
                return;
            }

            // Find pre > code.language-mermaid
            if (node.tagName === 'pre' && node.children && node.children.length > 0) {
                const codeNode = node.children[0];
                if (
                    codeNode.type === 'element' &&
                    codeNode.tagName === 'code' &&
                    codeNode.properties &&
                    Array.isArray(codeNode.properties.className) &&
                    codeNode.properties.className.includes('language-mermaid') &&
                    codeNode.children?.[0]?.type === 'text'
                ) {
                    // Extract source code
                    const source = codeNode.children[0].value;

                    // Create a wrapper div that replaces the pre element
                    const wrapper = {
                        type: 'element',
                        tagName: 'div',
                        properties: {
                            className: ['mermaid-wrapper'],
                            'data-source': source
                        },
                        children: [node] // Put the pre inside the wrapper
                    };

                    // Replace the pre with the wrapper in the parent
                    if (parent.children) {
                        parent.children[index] = wrapper;
                    }
                }
            }
        });
    };
}
