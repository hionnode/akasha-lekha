import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun', 'deno'];

/**
 * Extract package manager from language string or class
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
 * Check if an element is inside a package-manager container by checking ancestors
 * Since hast doesn't have parent pointers, we'll mark containers and check during visit
 */

function checkIfContainer(node: Element): boolean {
  if (node.tagName === 'div') {
    const classValue = node.properties?.className;
    return (
      classValue === 'package-manager-container' ||
      (Array.isArray(classValue) && classValue.includes('package-manager-container')) ||
      node.properties?.['data-pm-container'] === 'true'
    );
  }
  return false;
}

/**
 * Check if a code element is a descendant of a package-manager container
 */
function isCodeInContainer(codeNode: Element, tree: Root): boolean {
  let found = false;

  // First, find all containers
  visit(tree, 'element', (containerNode: Element) => {
    if (checkIfContainer(containerNode)) {
      // Check if codeNode is a descendant of this container
      visit(containerNode, 'element', (childNode: Element) => {
        if (childNode === codeNode) {
          found = true;
          return false; // Stop visiting
        }
      });
    }
  });

  return found;
}

/**
 * Rehype plugin to add package manager attributes to code blocks
 * Runs after Shiki to ensure attributes are preserved in final HTML
 */
function rehypePackageManager() {
  return (tree: Root) => {
    // First pass: mark all containers
    visit(tree, 'element', (node: Element) => {
      if (checkIfContainer(node)) {
        if (!node.properties) node.properties = {};
        node.properties['data-pm-container'] = 'true';
      }
    });

    // Second pass: process all code elements and check if they're in containers
    // Also check pre elements since Shiki wraps code in pre
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'code' || node.tagName === 'pre') {
        // Check if this element is inside a package-manager container
        const inContainer = isCodeInContainer(node, tree);

        if (inContainer) {
          // Get classes from both code and pre elements
          const className = node.properties?.className;
          const classList: string[] = [];

          if (Array.isArray(className)) {
            className.forEach((c: any) => {
              if (typeof c === 'string') {
                classList.push(...c.split(' '));
              }
            });
          } else if (typeof className === 'string') {
            classList.push(...className.split(' '));
          }

          // If it's a pre element, also check its code child
          if (node.tagName === 'pre') {
            visit(node, 'element', (codeChild: Element) => {
              if (codeChild.tagName === 'code') {
                const codeClassName = codeChild.properties?.className;
                if (Array.isArray(codeClassName)) {
                  codeClassName.forEach((c: any) => {
                    if (typeof c === 'string') {
                      classList.push(...c.split(' '));
                    }
                  });
                } else if (typeof codeClassName === 'string') {
                  classList.push(...codeClassName.split(' '));
                }
              }
            });
          }

          let manager: string | null = null;

          // First, check if manager is stored in data attributes (from remark plugin)
          if (node.properties?.['data-package-manager']) {
            manager = String(node.properties['data-package-manager']);
          }

          // Also check data-pm attribute (stored in meta field)
          if (!manager && node.properties?.['data-pm']) {
            manager = String(node.properties['data-pm']);
          }

          // If not found, check all classes for package manager
          if (!manager) {
            for (const cls of classList) {
              const clsLower = cls.toLowerCase();

              // Check if it's a language class
              if (clsLower.startsWith('language-')) {
                const langStr = clsLower.replace(/^language-/, '');
                manager = extractPackageManager(langStr);
                if (manager) break;
              }

              // Also check the class name directly for manager
              manager = extractPackageManager(clsLower);
              if (manager) break;
            }
          }

          if (manager) {
            // Add data attributes to code element (or pre if code not found)
            const targetElement =
              node.tagName === 'code'
                ? node
                : (node.children?.find((child: any) => child.tagName === 'code') as Element) ||
                  node;

            if (targetElement && targetElement.properties) {
              targetElement.properties['data-pm-block'] = 'true';
              targetElement.properties['data-package-manager'] = manager as string;
            }
          }
        }
      }
    });
  };
}

export default rehypePackageManager;
