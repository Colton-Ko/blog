import { visit } from 'unist-util-visit';

export default function rehypePreserveMermaid() {
    return (tree) => {
        visit(tree, 'element', (node, index, parent) => {
            // Find pre > code.language-mermaid
            if (node.tagName === 'pre' && node.children && node.children.length > 0) {
                const codeNode = node.children[0];
                if (
                    codeNode.tagName === 'code' &&
                    codeNode.properties &&
                    Array.isArray(codeNode.properties.className) &&
                    codeNode.properties.className.includes('language-mermaid')
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
                    parent.children[index] = wrapper;
                }
            }
        });
    };
}
