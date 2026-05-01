import { describe, it, expect } from 'vitest';
import type { Root } from 'mdast';
import remarkCallouts from './remarkCallouts';

function makeContainerDirective(name: string) {
  const tree: Root = {
    type: 'root',
    children: [
      {
        type: 'containerDirective',
        name,
        attributes: {},
        children: [{ type: 'paragraph', children: [{ type: 'text', value: 'body' }] }],
        // mdast-util-directive carries this through but it is not on the Root type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    ],
  };
  return tree;
}

function runPlugin(tree: Root) {
  const transform = remarkCallouts();
  transform(tree);
  return tree;
}

describe('remarkCallouts', () => {
  it.each(['tip', 'note', 'warning', 'caution', 'info'])(
    'transforms :::%s into a styled div with header + content',
    (name) => {
      const tree = makeContainerDirective(name);
      runPlugin(tree);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const directive = tree.children[0] as any;
      expect(directive.data?.hName).toBe('div');
      expect(directive.data?.hProperties?.class).toBe(`callout callout-${name}`);

      // Children replaced with [iconNode, contentNode]
      expect(directive.children).toHaveLength(2);
      expect(directive.children[0].type).toBe('html');
      expect(directive.children[0].value).toContain('callout-header');
      expect(directive.children[0].value).toContain('callout-icon');
      expect(directive.children[0].value).toContain('callout-label');

      expect(directive.children[1].data.hName).toBe('div');
      expect(directive.children[1].data.hProperties.class).toBe('callout-content');
    }
  );

  it('ignores unknown directive names', () => {
    const tree = makeContainerDirective('unknown');
    runPlugin(tree);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const directive = tree.children[0] as any;
    expect(directive.data).toBeUndefined();
    expect(directive.children).toHaveLength(1);
    expect(directive.children[0].type).toBe('paragraph');
  });

  it('uses span tagName for textDirective variant', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'textDirective',
          name: 'tip',
          attributes: {},
          children: [{ type: 'text', value: 'inline' }],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      ],
    };
    runPlugin(tree);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const directive = tree.children[0] as any;
    expect(directive.data?.hName).toBe('span');
  });
});
