import { visit } from 'unist-util-visit';
import type { Root, Code } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';

const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun', 'deno'];

/**
 * Extract package manager from code block language
 * Supports formats like: "bash npm", "npm", "bash pnpm", etc.
 */
function extractPackageManager(lang: string | null | undefined): string | null {
  if (!lang) return null;

  const langLower = lang.toLowerCase();
  for (const manager of PACKAGE_MANAGERS) {
    if (langLower.includes(manager)) {
      return manager;
    }
  }
  return null;
}

/**
 * Remark plugin to transform :::package-manager directive
 * Groups code blocks by package manager and adds data attributes for switching
 */
function remarkPackageManager() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const directive = node as ContainerDirective | LeafDirective | TextDirective;

        // Only process package-manager directive
        if (directive.name !== 'package-manager') {
          return;
        }

        // Find all code blocks inside the directive
        const codeBlocks: Array<{ node: Code; manager: string }> = [];
        visit(directive, 'code', (codeNode: Code) => {
          const manager = extractPackageManager(codeNode.lang);
          if (manager) {
            codeBlocks.push({ node: codeNode, manager });

            // Store manager in meta field so it survives Shiki processing
            // Format: "pm=npm" or append to existing meta
            const existingMeta = codeNode.meta || '';
            const pmMeta = `pm=${manager}`;
            codeNode.meta = existingMeta ? `${existingMeta} ${pmMeta}` : pmMeta;

            // Also add to data attributes for rehype
            const data = codeNode.data || (codeNode.data = {});
            const hProperties = data.hProperties || (data.hProperties = {});
            hProperties['data-package-manager'] = manager;
            hProperties['data-pm-block'] = 'true';
          }
        });

        // If we found code blocks, add data attributes
        if (codeBlocks.length > 0) {
          // Transform the directive container
          const data = directive.data || (directive.data = {});
          data.hName = 'div';
          data.hProperties = {
            class: 'package-manager-container',
            'data-pm-container': 'true',
          };
        }
      }
    });
  };
}

export default remarkPackageManager;
