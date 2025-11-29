import { visit } from 'unist-util-visit';

export default function remarkMathSource() {
  return (tree) => {
    visit(tree, ['math', 'inlineMath'], (node) => {
      // 1. Determine if this is inline ($...$) or block ($$...$$) math
      const isBlock = node.type === 'math';
      const wrapperTag = isBlock ? 'div' : 'span';

      // 'math-display' and 'math-inline' are the default classes rehype-katex looks for
      const mathClass = isBlock ? 'math-display' : 'math-inline';

      // 2. Create the inner HAST node that rehype-katex will target
      // This mimics what remark-rehype would normally create for a math node
      const innerMathNode = {
        type: 'element',
        tagName: wrapperTag,
        properties: {
          className: [mathClass]
        },
        children: [
          {
            type: 'text',
            value: node.value
          }
        ]
      };

      // 3. Transform the current node into a "Wrapper"
      // We explicitly set hName, hProperties, and hChildren.
      // remark-rehype will use these instructions to build the HTML.
      node.data = {
        ...node.data,
        hName: wrapperTag, // Outer tag (div or span)
        hProperties: {
          'data-source': node.value, // Keep the source here!
          className: ['math-block-container'] // Optional: class for the wrapper
        },
        hChildren: [innerMathNode] // Put the math node INSIDE
      };
    });
  };
}