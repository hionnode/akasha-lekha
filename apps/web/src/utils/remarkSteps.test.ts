import { describe, it, expect } from 'vitest';
import type { Root } from 'mdast';
import remarkSteps from './remarkSteps';

function runPlugin(tree: Root) {
  const transform = remarkSteps();
  transform(tree);
  return tree;
}

describe('remarkSteps', () => {
  it('transforms :::steps into a div with role=list', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'containerDirective',
          name: 'steps',
          attributes: {},
          children: [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      ],
    };

    runPlugin(tree);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const directive = tree.children[0] as any;
    expect(directive.data?.hName).toBe('div');
    expect(directive.data?.hProperties?.class).toBe('steps-container');
    expect(directive.data?.hProperties?.role).toBe('list');
  });

  it('ignores other directive names', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'containerDirective',
          name: 'tip',
          attributes: {},
          children: [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      ],
    };

    runPlugin(tree);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((tree.children[0] as any).data).toBeUndefined();
  });
});
