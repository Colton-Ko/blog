import { visit } from 'unist-util-visit';

/**
 * Remark plugin to convert _subscript_ to <sub>subscript</sub>
 * and ^superscript^ to <sup>superscript</sup>
 * @returns {(tree: import('unist').Node) => void} Transformer function
 */
export default function remarkSubSup() {
    return (tree) => {
        visit(tree, 'text', (node, index, parent) => {
            if (!parent || index === null || index === undefined) {
                return;
            }

            const { value } = node;
            // Match _subscript_ or ^superscript^
            // We use _ for subscript, overriding standard markdown italics for _
            const regex = /(_([^_]+)_)|(\^([^^]+)\^)/g;

            if (!regex.test(value)) {
                return;
            }

            const children = [];
            let lastIndex = 0;

            // Reset regex lastIndex after test
            regex.lastIndex = 0;

            value.replace(regex, (match, subMatch, subContent, supMatch, supContent, offset) => {
                // Add text before the match
                if (offset > lastIndex) {
                    children.push({
                        type: 'text',
                        value: value.slice(lastIndex, offset),
                    });
                }

                // Add subscript or superscript
                if (subMatch) {
                    children.push({
                        type: 'html',
                        value: `<sub>${subContent}</sub>`,
                    });
                } else if (supMatch) {
                    children.push({
                        type: 'html',
                        value: `<sup>${supContent}</sup>`,
                    });
                }

                lastIndex = offset + match.length;
                return match;
            });

            // Add remaining text
            if (lastIndex < value.length) {
                children.push({
                    type: 'text',
                    value: value.slice(lastIndex),
                });
            }

            // Replace the node with the new children
            if (children.length > 0 && parent.children) {
                parent.children.splice(index, 1, ...children);
            }
        });
    };
}
