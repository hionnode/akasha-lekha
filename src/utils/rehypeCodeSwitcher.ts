import { visit } from 'unist-util-visit';
import type { Root, Element, Text } from 'hast';
import fs from 'fs';

/**
 * Rehype plugin to generate complete code switcher HTML during build
 * Generates switcher tabs and wraps code blocks with proper attributes
 */
function rehypeCodeSwitcher() {
  return (tree: Root, _file: unknown) => {
    try {
      // #region agent log
      const logPath = '/Users/chinmay/code/agency/works-on-my-cloud/akasha-lekha/.cursor/debug.log';
      try {
        fs.appendFileSync(
          logPath,
          JSON.stringify({
            location: 'rehypeCodeSwitcher.ts:9',
            message: 'Plugin started',
            data: { nodeCount: tree.children?.length || 0 },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'C',
          }) + '\n'
        );
      } catch {
        // Debug logging failed, ignore
      }
      // #endregion

      // Also log to console for visibility
      console.log(
        '[rehypeCodeSwitcher] Plugin started, tree children:',
        tree.children?.length || 0
      );

      const containersToProcess: Array<{
        container: Element;
        parent: Element | Root;
        index: number;
      }> = [];

      // First pass: find all containers and collect their code blocks
      visit(
        tree,
        'element',
        (node: Element, index: number | undefined, parent: Element | Root | undefined) => {
          // Find code-switcher containers
          // Check data-switch-container attribute first (most reliable)
          const hasDataAttr =
            node.properties?.['data-switch-container'] === 'true' ||
            node.properties?.['data-switch-container'] === true;

          // Also check className (can be string, array, or space-separated string)
          const className = node.properties?.className;
          let hasContainerClass = false;
          if (typeof className === 'string') {
            hasContainerClass = className.includes('code-switcher-container');
          } else if (Array.isArray(className)) {
            hasContainerClass = className.some(
              (c: any) => typeof c === 'string' && c.includes('code-switcher-container')
            );
          }

          if (node.tagName === 'div' && (hasDataAttr || hasContainerClass)) {
            // #region agent log
            try {
              fs.appendFileSync(
                logPath,
                JSON.stringify({
                  location: 'rehypeCodeSwitcher.ts:30',
                  message: 'Container found',
                  data: {
                    tagName: node.tagName,
                    className: node.properties?.className,
                    hasDataAttr: !!node.properties?.['data-switch-container'],
                  },
                  timestamp: Date.now(),
                  sessionId: 'debug-session',
                  runId: 'run1',
                  hypothesisId: 'C',
                }) + '\n'
              );
            } catch {
              // Debug logging failed, ignore
            }
            // #endregion

            if (parent && typeof index === 'number') {
              containersToProcess.push({ container: node, parent, index });
            }
          }
        }
      );

      // #region agent log
      try {
        fs.appendFileSync(
          logPath,
          JSON.stringify({
            location: 'rehypeCodeSwitcher.ts:36',
            message: 'Containers collected',
            data: { count: containersToProcess.length },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'C',
          }) + '\n'
        );
      } catch {
        // Debug logging failed, ignore
      }
      // #endregion

      console.log('[rehypeCodeSwitcher] Containers found:', containersToProcess.length);

      // Second pass: process each container
      console.log(`[rehypeCodeSwitcher] Processing ${containersToProcess.length} containers`);
      containersToProcess.forEach(({ container, parent, index: containerIndex }) => {
        console.log(`[rehypeCodeSwitcher] Processing container ${containerIndex}`);
        // Get label from container
        const label = (container.properties?.['data-switch-label'] as string) || 'Switch';

        // Get switch values from container data attribute (stored by remark plugin)
        // Format: "value1,value2,value3" (comma-separated)
        const switchValuesStr = container.properties?.['data-switch-values'] as string | undefined;
        const switchLabelsStr = container.properties?.['data-switch-labels'] as string | undefined;
        const switchValues = switchValuesStr ? switchValuesStr.split(',').filter((v) => v) : [];
        const switchLabels = switchLabelsStr ? switchLabelsStr.split(',') : [];

        // Collect all pre elements (code blocks) inside this container in order
        const preElements: Array<{ element: Element; value: string; label?: string }> = [];
        let preIndex = 0;

        visit(container, 'element', (child: Element) => {
          if (child.tagName === 'pre') {
            // Try to find switch value from stored data (by index) or from attributes
            let switchValue: string | null = null;
            let switchLabel: string | undefined = undefined;

            // First, try to get from stored switch values by index
            if (switchValues.length > preIndex) {
              switchValue = switchValues[preIndex];
              if (switchLabels.length > preIndex && switchLabels[preIndex]) {
                switchLabel = switchLabels[preIndex];
              }
            }

            // Fallback: Check if pre has data-switch-value attribute
            if (!switchValue && child.properties?.['data-switch-value']) {
              switchValue = String(child.properties['data-switch-value']);
            }

            // Fallback: Check data-language attribute on pre (set by Shiki)
            // Note: Shiki only preserves first part, so "bash npm" becomes "bash"
            if (!switchValue && child.properties?.['data-language']) {
              const langStr = String(child.properties['data-language']);
              const parts = langStr.trim().split(/\s+/);
              if (parts.length > 1) {
                // Use the last part as the switch value (e.g., "bash npm" -> "npm")
                switchValue = parts[parts.length - 1];
              }
            }

            // Fallback: Check the code element inside
            if (!switchValue) {
              visit(child, 'element', (codeEl: Element) => {
                if (codeEl.tagName === 'code') {
                  // Check data attributes
                  if (codeEl.properties?.['data-switch-value']) {
                    switchValue = String(codeEl.properties['data-switch-value']);
                  }
                  if (codeEl.properties?.['data-switch-label']) {
                    switchLabel = String(codeEl.properties['data-switch-label']);
                  }

                  // If still not found, try to extract from language class
                  if (!switchValue) {
                    const className = codeEl.properties?.className;
                    const classList: string[] = [];

                    if (Array.isArray(className)) {
                      className.forEach((c: string | unknown) => {
                        if (typeof c === 'string') {
                          classList.push(...c.split(' '));
                        }
                      });
                    } else if (typeof className === 'string') {
                      classList.push(...className.split(' '));
                    }

                    for (const cls of classList) {
                      const clsLower = cls.toLowerCase();
                      if (clsLower.startsWith('language-')) {
                        const langStr = clsLower.replace(/^language-/, '');
                        const parts = langStr.split(/\s+/);
                        if (parts.length > 1) {
                          switchValue = parts[parts.length - 1];
                        } else {
                          switchValue = parts[0];
                        }
                        break;
                      }
                    }
                  }

                  // Final fallback: extract from code content (first word)
                  // This works for package managers: npm, pnpm, yarn, etc.
                  if (!switchValue && codeEl.children) {
                    // Recursively extract all text from nested structure (handles Shiki's span structure)
                    function extractAllText(node: Element | Text): string {
                      if (node.type === 'text') {
                        return (node.value || '').trim();
                      }
                      if (
                        node.type === 'element' &&
                        node.children &&
                        Array.isArray(node.children)
                      ) {
                        return node.children
                          .filter(
                            (child): child is Element | Text =>
                              child.type === 'element' || child.type === 'text'
                          )
                          .map(extractAllText)
                          .filter(Boolean)
                          .join(' ');
                      }
                      return '';
                    }

                    const textContent = codeEl.children
                      .filter(
                        (child): child is Element | Text =>
                          child.type === 'element' || child.type === 'text'
                      )
                      .map(extractAllText)
                      .filter(Boolean)
                      .join(' ')
                      .trim();

                    // Extract first word (package manager command) - remove any special chars
                    const firstWord = textContent
                      .split(/\s+/)[0]
                      ?.toLowerCase()
                      .replace(/[^a-z0-9]/g, '');
                    // Common package managers
                    if (
                      firstWord === 'npm' ||
                      firstWord === 'pnpm' ||
                      firstWord === 'yarn' ||
                      firstWord === 'bun'
                    ) {
                      switchValue = firstWord;
                    } else if (firstWord?.startsWith('aws')) {
                      switchValue = 'aws';
                    } else if (firstWord?.startsWith('gcp') || firstWord === 'gsutil') {
                      switchValue = 'gcp';
                    } else if (firstWord?.startsWith('az') || firstWord === 'azure') {
                      switchValue = 'azure';
                    } else if (firstWord && firstWord.length > 0) {
                      // Use first word as fallback (but only if it's meaningful)
                      switchValue = firstWord;
                    }
                  }
                }
              });
            }

            // Always add the pre element, even if we don't have a switch value yet
            // We'll use the index as a fallback
            if (!switchValue) {
              switchValue = `option-${preIndex}`;
            }
            preElements.push({ element: child, value: switchValue, label: switchLabel });
            preIndex++;
          }
        });

        // #region agent log
        try {
          fs.appendFileSync(
            logPath,
            JSON.stringify({
              location: 'rehypeCodeSwitcher.ts:107',
              message: 'Pre elements collected',
              data: {
                count: preElements.length,
                values: preElements.map((p) => p.value),
                containerIndex: containerIndex,
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'C',
            }) + '\n'
          );
        } catch {
          // Debug logging failed, ignore
        }
        // #endregion

        console.log(
          `[rehypeCodeSwitcher] Container ${containerIndex}: ${preElements.length} pre elements, values:`,
          preElements.map((p) => p.value)
        );

        // Only proceed if we have multiple code blocks
        if (preElements.length <= 1) {
          // #region agent log
          try {
            fs.appendFileSync(
              logPath,
              JSON.stringify({
                location: 'rehypeCodeSwitcher.ts:110',
                message: 'Skipping - not enough pre elements',
                data: { count: preElements.length, containerIndex: containerIndex },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'C',
              }) + '\n'
            );
          } catch {
            // Debug logging failed, ignore
          }
          // #endregion
          return;
        }

        // Filter out pre elements without valid switch values
        const validPreElements = preElements.filter(
          (_p, idx) => preElements[idx].value && preElements[idx].value !== `option-${idx}`
        );

        // If we don't have valid switch values, try to extract from all pre elements again
        if (validPreElements.length === 0 && preElements.length > 1) {
          // Force extraction from content for all pre elements
          preElements.forEach((preEl) => {
            if (!preEl.value || preEl.value.startsWith('option-')) {
              // Try to extract from the pre element's text content directly
              function extractTextFromElement(el: Element | Text): string {
                if (el.type === 'text') return el.value || '';
                if (el.type === 'element' && el.children) {
                  return el.children
                    .filter(
                      (child): child is Element | Text =>
                        child.type === 'element' || child.type === 'text'
                    )
                    .map(extractTextFromElement)
                    .join('')
                    .trim();
                }
                return '';
              }

              const allText = extractTextFromElement(preEl.element);
              const firstWord = allText
                .split(/\s+/)[0]
                ?.toLowerCase()
                .replace(/[^a-z0-9]/g, '');
              if (
                firstWord === 'npm' ||
                firstWord === 'pnpm' ||
                firstWord === 'yarn' ||
                firstWord === 'bun'
              ) {
                preEl.value = firstWord;
              } else if (firstWord?.startsWith('aws')) {
                preEl.value = 'aws';
              } else if (firstWord?.startsWith('gcp') || firstWord === 'gsutil') {
                preEl.value = 'gcp';
              } else if (firstWord?.startsWith('az') || firstWord === 'azure') {
                preEl.value = 'azure';
              } else if (firstWord && firstWord.length > 0) {
                preEl.value = firstWord;
              }
            }
          });
        }

        // Extract unique switch values and sort them
        const values = new Set<string>();
        preElements.forEach(({ value }) => {
          if (value && !value.startsWith('option-')) {
            values.add(value);
          }
        });

        // If we don't have valid switch values, try one more time with direct text extraction
        if (values.size === 0) {
          preElements.forEach((preEl, idx) => {
            // Direct text extraction from the entire pre element - handle Shiki's nested span structure
            function extractAllTextRecursive(node: Element | Text): string {
              if (node.type === 'text') return (node.value || '').trim();
              if (node.type === 'element' && node.children && Array.isArray(node.children)) {
                return node.children
                  .filter(
                    (child): child is Element | Text =>
                      child.type === 'element' || child.type === 'text'
                  )
                  .map(extractAllTextRecursive)
                  .filter(Boolean)
                  .join(' ');
              }
              return '';
            }

            const fullText = extractAllTextRecursive(preEl.element);
            const firstWord = fullText
              .split(/\s+/)[0]
              ?.toLowerCase()
              .replace(/[^a-z0-9]/g, '');

            if (
              firstWord === 'npm' ||
              firstWord === 'pnpm' ||
              firstWord === 'yarn' ||
              firstWord === 'bun'
            ) {
              preEl.value = firstWord;
              values.add(firstWord);
            } else if (firstWord?.startsWith('aws')) {
              preEl.value = 'aws';
              values.add('aws');
            } else if (firstWord?.startsWith('gcp') || firstWord === 'gsutil') {
              preEl.value = 'gcp';
              values.add('gcp');
            } else if (firstWord?.startsWith('az') || firstWord === 'azure') {
              preEl.value = 'azure';
              values.add('azure');
            } else if (firstWord && firstWord.length > 0 && firstWord.length < 20) {
              preEl.value = firstWord;
              values.add(firstWord);
            } else {
              // Last resort: use index-based value
              preEl.value = `opt${idx}`;
              values.add(`opt${idx}`);
            }
          });
        }

        const valueArray = Array.from(values).sort();

        // #region agent log
        try {
          fs.appendFileSync(
            logPath,
            JSON.stringify({
              location: 'rehypeCodeSwitcher.ts:300',
              message: 'Before switcher generation',
              data: {
                valueCount: valueArray.length,
                values: valueArray,
                preCount: preElements.length,
                allPreValues: preElements.map((p) => p.value),
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'C',
            }) + '\n'
          );
        } catch {
          // Debug logging failed, ignore
        }
        // #endregion

        // FORCE generation if we have multiple pre elements, even without valid switch values
        // This is a test to see if the plugin is running at all
        if (valueArray.length === 0 && preElements.length > 1) {
          // Use simple indices
          preElements.forEach((preEl, idx) => {
            preEl.value = `val${idx}`;
          });
          valueArray.push(...preElements.map((_p, idx) => `val${idx}`));
        }

        // #region agent log
        try {
          fs.appendFileSync(
            logPath,
            JSON.stringify({
              location: 'rehypeCodeSwitcher.ts:240',
              message: 'Switch values extracted',
              data: {
                count: valueArray.length,
                values: valueArray,
                preCount: preElements.length,
                allValues: preElements.map((p) => p.value),
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'C',
            }) + '\n'
          );
        } catch {
          // Debug logging failed, ignore
        }
        // #endregion

        // If we still don't have valid values, skip
        if (valueArray.length === 0) {
          console.log(
            `[rehypeCodeSwitcher] Container ${containerIndex}: No switch values - skipping`
          );
          // #region agent log
          try {
            fs.appendFileSync(
              logPath,
              JSON.stringify({
                location: 'rehypeCodeSwitcher.ts:250',
                message: 'No switch values found - skipping',
                data: { preCount: preElements.length },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'C',
              }) + '\n'
            );
          } catch {
            // Debug logging failed, ignore
          }
          // #endregion
          return;
        }

        console.log(
          `[rehypeCodeSwitcher] Container ${containerIndex}: Generating switcher with ${valueArray.length} values:`,
          valueArray
        );

        // Generate switcher tabs HTML
        const switcherTabs: Element[] = [];
        valueArray.forEach((value: string, tabIndex: number) => {
          // Find label for this value
          const blockData = preElements.find((b) => b.value === value);
          const displayLabel = blockData?.label || value.toUpperCase();

          const button: Element = {
            type: 'element',
            tagName: 'button',
            properties: {
              className: ['switch-tab', tabIndex === 0 ? 'active' : ''],
              role: 'tab',
              'aria-selected': tabIndex === 0 ? 'true' : 'false',
              'data-switch-value': value,
            },
            children: [
              {
                type: 'text',
                value: displayLabel,
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
            role: 'tablist',
            'aria-label': label,
          },
          children: switcherTabs,
        };

        // Wrap each pre element with data-switch-value and hidden class (except first)
        preElements.forEach(({ element: preEl, value }, blockIndex) => {
          if (!preEl.properties) preEl.properties = {};
          preEl.properties['data-switch-value'] = value;
          if (blockIndex > 0) {
            // Add hidden class to all but the first
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

        // Insert switcher before container in parent
        if (Array.isArray(parent.children)) {
          parent.children.splice(containerIndex, 0, switcher);
          // #region agent log
          try {
            fs.appendFileSync(
              logPath,
              JSON.stringify({
                location: 'rehypeCodeSwitcher.ts:175',
                message: 'Switcher inserted',
                data: { tabCount: switcherTabs.length, values: valueArray },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'C',
              }) + '\n'
            );
          } catch {
            // Debug logging failed, ignore
          }
          // #endregion

          console.log(
            `[rehypeCodeSwitcher] Switcher inserted with ${switcherTabs.length} tabs, values:`,
            valueArray
          );
        }
      });
    } catch (error) {
      // #region agent log
      try {
        const logPath =
          '/Users/chinmay/code/agency/works-on-my-cloud/akasha-lekha/.cursor/debug.log';
        fs.appendFileSync(
          logPath,
          JSON.stringify({
            location: 'rehypeCodeSwitcher.ts:error',
            message: 'Plugin error',
            data: {
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : '',
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'C',
          }) + '\n'
        );
      } catch {
        // Debug logging failed, ignore
      }
      // #endregion
      // Don't throw - let the build continue
      console.error('rehypeCodeSwitcher error:', error);
    }
  };
}

export default rehypeCodeSwitcher;
