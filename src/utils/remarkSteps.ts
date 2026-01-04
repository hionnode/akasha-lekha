import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';

/**
 * Remark plugin to transform :::steps directive into styled ordered list
 * Transforms :::steps with ordered list inside into a styled steps container
 */
function remarkSteps() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const directive = node as ContainerDirective | LeafDirective | TextDirective;

        // Only process steps directive
        if (directive.name !== 'steps') {
          return;
        }

        // Transform the directive into HTML
        const data = directive.data || (directive.data = {});
        data.hName = 'div';
        data.hProperties = {
          class: 'steps-container',
          role: 'list',
        };
      }
    });
  };
}

export default remarkSteps;
