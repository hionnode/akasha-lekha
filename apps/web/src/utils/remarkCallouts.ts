import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';

// Icon SVGs for each callout type
const icons = {
  tip: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  note: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  caution: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
};

const labels = {
  tip: 'Tip',
  note: 'Note',
  warning: 'Warning',
  caution: 'Caution',
  info: 'Info',
};

/**
 * Remark plugin to transform ::: directives into callout boxes
 * Transforms :::tip, :::note, :::warning, :::caution, :::info
 * into styled HTML divs with icons and labels
 */
function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const directive = node as ContainerDirective | LeafDirective | TextDirective;
        const directiveName = directive.name;

        // Only process known callout types
        if (!['tip', 'note', 'warning', 'caution', 'info'].includes(directiveName)) {
          return;
        }

        const icon = icons[directiveName as keyof typeof icons];
        const label = labels[directiveName as keyof typeof labels];

        // Transform the directive into HTML
        const data = directive.data || (directive.data = {});
        const tagName = node.type === 'textDirective' ? 'span' : 'div';

        data.hName = tagName;
        data.hProperties = {
          class: `callout callout-${directiveName}`,
        };

        // Add the icon and label as the first child
        const iconNode = {
          type: 'html',
          value: `<div class="callout-header"><span class="callout-icon">${icon}</span><span class="callout-label">${label}</span></div>`,
        };

        const contentNode = {
          type: 'div',
          data: {
            hName: 'div',
            hProperties: {
              class: 'callout-content',
            },
          },
          children: directive.children,
        };

        // Replace the directive's children with icon + content
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        directive.children = [iconNode as any, contentNode as any];
      }
    });
  };
}

export default remarkCallouts;
