import { visit } from 'unist-util-visit';
import type { Root, Code } from 'mdast';

/**
 * Remark plugin to parse code block metadata (title="..." or terminal)
 * and add them as data attributes that can be accessed in the HTML
 */
function remarkCodeMeta() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code) => {
      const meta = node.meta || '';

      // Parse title attribute: title="filename.ts"
      const titleMatch = meta.match(/title="([^"]+)"/);
      if (titleMatch) {
        const data = node.data || (node.data = {});
        const hProperties = data.hProperties || (data.hProperties = {});
        hProperties['data-title'] = titleMatch[1];
      }

      // Check for terminal flag
      if (meta.includes('terminal')) {
        const data = node.data || (node.data = {});
        const hProperties = data.hProperties || (data.hProperties = {});
        hProperties['data-terminal'] = 'true';
      }
    });
  };
}

export default remarkCodeMeta;
