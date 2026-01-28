import { visit } from 'unist-util-visit';
import type { Root, Code } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';
import fs from 'fs';

/**
 * Generic remark plugin to transform :::code-switcher directive
 * Collects code blocks and their switch values for rehype processing
 *
 * Usage:
 * :::code-switcher
 * ```bash npm
 * npm install
 * ```
 * ```bash pnpm
 * pnpm add
 * ```
 * :::
 *
 * Or with custom labels:
 * :::code-switcher label="Package Manager"
 * ```bash npm
 * npm install
 * ```
 * ```bash yarn label="Yarn Classic"
 * yarn add
 * ```
 * :::
 */
function remarkCodeSwitcher() {
  return (tree: Root) => {
    // #region agent log
    const logPath = '/Users/chinmay/code/agency/works-on-my-cloud/akasha-lekha/.cursor/debug.log';
    try {
      fs.appendFileSync(
        logPath,
        JSON.stringify({
          location: 'remarkCodeSwitcher.ts:30',
          message: 'Plugin started',
          data: { nodeCount: tree.children?.length || 0 },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'B',
        }) + '\n'
      );
    } catch {
      // Debug logging failed, ignore
    }
    // #endregion

    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const directive = node as ContainerDirective | LeafDirective | TextDirective;

        // #region agent log
        try {
          fs.appendFileSync(
            logPath,
            JSON.stringify({
              location: 'remarkCodeSwitcher.ts:40',
              message: 'Directive found',
              data: { name: directive.name, type: node.type },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'B',
            }) + '\n'
          );
        } catch {
          // Debug logging failed, ignore
        }
        // #endregion

        // Process code-switcher directive (or package-manager for backward compatibility)
        if (directive.name !== 'code-switcher' && directive.name !== 'package-manager') {
          return;
        }

        // #region agent log
        try {
          fs.appendFileSync(
            logPath,
            JSON.stringify({
              location: 'remarkCodeSwitcher.ts:45',
              message: 'Code-switcher directive matched',
              data: { name: directive.name },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'B',
            }) + '\n'
          );
        } catch {
          // Debug logging failed, ignore
        }
        // #endregion

        // Extract label from directive attributes if present
        let label = 'Switch';
        const attrs = directive.attributes as string | undefined;
        if (attrs && typeof attrs === 'string') {
          const labelMatch = attrs.match(/label="([^"]+)"/);
          if (labelMatch) {
            label = labelMatch[1];
          }
        }

        // Collect all code blocks with their switch values
        const codeBlocks: Array<{ node: Code; value: string; label?: string }> = [];

        visit(directive, 'code', (codeNode: Code) => {
          // Extract switch value from language (e.g., "bash npm" -> "npm")
          // Or from meta field (e.g., meta="value=npm")
          let switchValue: string | null = null;
          let switchLabel: string | undefined = undefined;

          // Check meta field first: value=xxx or switch=xxx
          const meta = codeNode.meta || '';
          const valueMatch = meta.match(/(?:value|switch)=([^\s]+)/);
          if (valueMatch) {
            switchValue = valueMatch[1];
          }

          // Check for label in meta: label="Custom Label"
          const labelMatch = meta.match(/label="([^"]+)"/);
          if (labelMatch) {
            switchLabel = labelMatch[1];
          }

          // If not in meta, extract from language (last word after space)
          if (!switchValue && codeNode.lang) {
            const langParts = codeNode.lang.trim().split(/\s+/);
            if (langParts.length > 1) {
              // Use the last part as the switch value
              switchValue = langParts[langParts.length - 1];
            } else {
              // If only one part, use it as the value
              switchValue = langParts[0];
            }
          }

          if (switchValue) {
            codeBlocks.push({ node: codeNode, value: switchValue, label: switchLabel });

            // Store switch value in meta field so it survives Shiki processing
            // Format: "switch=npm" or append to existing meta
            const existingMeta = codeNode.meta || '';
            const switchMeta = `switch=${switchValue}`;
            codeNode.meta = existingMeta ? `${existingMeta} ${switchMeta}` : switchMeta;

            // Also add to data attributes for rehype (may not survive Shiki, but try anyway)
            const data = codeNode.data || (codeNode.data = {});
            const hProperties = data.hProperties || (data.hProperties = {});
            hProperties['data-switch-value'] = switchValue;
            if (switchLabel) {
              hProperties['data-switch-label'] = switchLabel;
            }
          }
        });

        // If we found code blocks, store the data for rehype processing
        if (codeBlocks.length > 0) {
          // #region agent log
          try {
            fs.appendFileSync(
              logPath,
              JSON.stringify({
                location: 'remarkCodeSwitcher.ts:102',
                message: 'Code blocks found in directive',
                data: { count: codeBlocks.length, values: codeBlocks.map((cb) => cb.value) },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'B',
              }) + '\n'
            );
          } catch {
            // Debug logging failed, ignore
          }
          // #endregion

          const data = directive.data || (directive.data = {});
          data.hName = 'div';
          // Store switch values as comma-separated list for rehype to access
          // Format: "value1,value2,value3" (simple format that survives HTML)
          const switchValueList = codeBlocks.map((cb) => cb.value).join(',');
          const switchLabelList = codeBlocks.map((cb) => cb.label || '').join(',');
          data.hProperties = {
            class: 'code-switcher-container',
            'data-switch-container': 'true',
            'data-switch-label': label,
            'data-switch-values': switchValueList,
            'data-switch-labels': switchLabelList,
          };
          // Data attributes are already on code nodes, no need to store separately
        } else {
          // #region agent log
          try {
            fs.appendFileSync(
              logPath,
              JSON.stringify({
                location: 'remarkCodeSwitcher.ts:112',
                message: 'No code blocks found in directive',
                data: { name: directive.name },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'B',
              }) + '\n'
            );
          } catch {
            // Debug logging failed, ignore
          }
          // #endregion
        }
      }
    });
  };
}

export default remarkCodeSwitcher;
