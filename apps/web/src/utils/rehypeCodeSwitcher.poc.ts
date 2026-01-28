import { visit } from 'unist-util-visit';
import type { Root, Element, Text } from 'hast';

/**
 * Simple POC rehype plugin for code switcher
 */
function rehypeCodeSwitcherPOC() {
  return (tree: Root) => {
    const containers: Array<{ container: Element; parent: Element | Root; index: number }> = [];

    // Find all containers
    visit(
      tree,
      'element',
      (node: Element, index: number | undefined, parent: Element | Root | undefined) => {
        if (node.tagName === 'div' && node.properties?.['data-switch-container'] === 'true') {
          if (parent && typeof index === 'number') {
            containers.push({ container: node, parent, index });
          }
        }
      }
    );

    // Process each container
    containers.forEach(({ container, parent, index: containerIndex }) => {
      // Collect pre elements in order
      const preElements: Element[] = [];
      visit(container, 'element', (child: Element) => {
        if (child.tagName === 'pre') {
          preElements.push(child);
        }
      });

      if (preElements.length <= 1) {
        return;
      }

      // Extract switch values from code content (first word of each code block)
      // This is more reliable than relying on language strings which may be truncated
      const finalSwitchValues: string[] = [];

      // Helper to extract text from HAST nodes
      function extractText(node: any): string {
        if (node.type === 'text') return node.value || '';
        if (node.children && Array.isArray(node.children)) {
          return node.children.map(extractText).join(' ');
        }
        return '';
      }

      preElements.forEach((preEl, idx) => {
        let value: string | null = null;

        // PRIMARY: Extract from code content (first word)
        visit(preEl, 'element', (codeEl: Element) => {
          if (codeEl.tagName === 'code' && !value) {
            const text = extractText(codeEl);
            const firstWord = text.trim().split(/\s+/)[0]?.toLowerCase() || '';
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
        });

        // Fallback to stored values or index
        if (!value) {
          const switchValuesStr = container.properties?.['data-switch-values'] as
            | string
            | undefined;
          const switchValues = switchValuesStr ? switchValuesStr.split(',').filter((v) => v) : [];
          if (switchValues.length > idx && switchValues[idx] && switchValues[idx] !== 'bash') {
            value = switchValues[idx];
          } else {
            value = `option-${idx}`;
          }
        }

        finalSwitchValues.push(value);
      });

      // Generate switcher tabs (use unique values only)
      const uniqueValues = Array.from(new Set(finalSwitchValues));
      const switcherTabs: Element[] = [];
      uniqueValues.forEach((value: string, tabIndex: number) => {
        const button: Element = {
          type: 'element',
          tagName: 'button',
          properties: {
            className: ['switch-tab', tabIndex === 0 ? 'active' : ''],
            'data-switch-value': value,
          },
          children: [
            {
              type: 'text',
              value: value.toUpperCase(),
            } as Text,
          ],
        };
        switcherTabs.push(button);
      });

      const switcher: Element = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: 'code-switcher',
        },
        children: switcherTabs,
      };

      // Add data-switch-value to pre elements and hide all but first
      preElements.forEach((preEl, idx) => {
        if (!preEl.properties) preEl.properties = {};
        const switchValue = finalSwitchValues[idx];
        preEl.properties['data-switch-value'] = switchValue;

        // Hide all but the first pre element with this value
        const isFirstWithThisValue = finalSwitchValues.indexOf(switchValue) === idx;
        if (!isFirstWithThisValue) {
          const existingClass = preEl.properties.className;
          if (Array.isArray(existingClass)) {
            preEl.properties.className = [...existingClass, 'hidden'];
          } else if (typeof existingClass === 'string') {
            preEl.properties.className = [existingClass, 'hidden'];
          } else {
            preEl.properties.className = ['hidden'];
          }
        }
      });

      // Insert switcher before container
      if (Array.isArray(parent.children)) {
        parent.children.splice(containerIndex, 0, switcher);
      }
    });
  };
}

export default rehypeCodeSwitcherPOC;
