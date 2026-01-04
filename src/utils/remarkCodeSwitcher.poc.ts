import { visit } from 'unist-util-visit';
import type { Root, Code } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';

/**
 * Simple POC remark plugin for code switcher
 */
function remarkCodeSwitcherPOC() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective') {
        const directive = node as ContainerDirective;

        if (directive.name !== 'code-switcher') {
          return;
        }

        // Collect code blocks
        const codeBlocks: Code[] = [];
        visit(directive, 'code', (codeNode: Code) => {
          codeBlocks.push(codeNode);
        });

        if (codeBlocks.length === 0) {
          return;
        }

        // Extract switch values - prioritize code content over language
        const switchValues: string[] = [];
        codeBlocks.forEach((codeNode, idx) => {
          let value: string | null = null;

          // PRIMARY: Extract from code content (first word) - most reliable
          if (codeNode.value) {
            const firstLine = codeNode.value.split('\n')[0] || '';
            const firstWord = firstLine.trim().split(/\s+/)[0]?.toLowerCase() || '';
            if (
              firstWord === 'npm' ||
              firstWord === 'pnpm' ||
              firstWord === 'yarn' ||
              firstWord === 'bun'
            ) {
              value = firstWord;
            } else if (firstWord?.startsWith('aws')) {
              value = 'aws';
            } else if (firstWord?.startsWith('gcp') || firstWord === 'gsutil') {
              value = 'gcp';
            } else if (firstWord?.startsWith('az')) {
              value = 'azure';
            }
          }

          // FALLBACK: Try to extract from language (e.g., "bash npm" -> "npm")
          if (!value && codeNode.lang) {
            const parts = codeNode.lang.trim().split(/\s+/);
            // Use the last part as the switch value (e.g., "bash npm" -> "npm")
            if (parts.length > 1) {
              value = parts[parts.length - 1];
            } else if (
              parts[0] &&
              parts[0] !== 'bash' &&
              parts[0] !== 'sh' &&
              parts[0] !== 'shell'
            ) {
              // If only one part and it's not a shell language, use it
              value = parts[0];
            }
          }

          // Final fallback
          if (!value) {
            value = `option-${idx}`;
          }

          switchValues.push(value);
        });

        // Transform directive to div with data attributes
        const data = directive.data || (directive.data = {});
        data.hName = 'div';
        data.hProperties = {
          class: 'code-switcher-container',
          'data-switch-container': 'true',
          'data-switch-values': switchValues.join(','),
        };
      }
    });
  };
}

export default remarkCodeSwitcherPOC;
