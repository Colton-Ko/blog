import { visit } from 'unist-util-visit';

/**
 * Remark plugin to convert ==highlighted text== to <mark>highlighted text</mark>
 */
export default function remarkHighlight() {
    return (tree) => {
        visit(tree, 'text', (node, index, parent) => {
            const { value } = node;
            const regex = /==([^=]+)==/g;

            if (!regex.test(value)) {
                return;
            }

            const children = [];
            let lastIndex = 0;

            value.replace(regex, (match, content, offset) => {
                // Add text before the match
                if (offset > lastIndex) {
                    children.push({
                        type: 'text',
                        value: value.slice(lastIndex, offset),
                    });
                }

                // Add the highlighted content
                children.push({
                    type: 'html',
                    value: `<mark>${content}</mark>`,
                });

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
            if (children.length > 0) {
                parent.children.splice(index, 1, ...children);
            }
        });
    };
}
