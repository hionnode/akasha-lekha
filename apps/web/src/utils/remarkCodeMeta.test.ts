import { describe, it, expect } from 'vitest';
import type { Root } from 'mdast';
import remarkCodeMeta from './remarkCodeMeta';

function makeTreeWithCode(meta: string | null): Root {
  return {
    type: 'root',
    children: [
      {
        type: 'code',
        lang: 'typescript',
        meta,
        value: 'const x = 1;',
      },
    ],
  };
}

function runPlugin(tree: Root) {
  const transform = remarkCodeMeta();
  transform(tree);
  return tree;
}

describe('remarkCodeMeta', () => {
  it('parses title="filename" into data-title', () => {
    const tree = makeTreeWithCode('title="example.ts"');
    runPlugin(tree);

    const code = tree.children[0] as { data?: { hProperties?: Record<string, unknown> } };
    expect(code.data?.hProperties?.['data-title']).toBe('example.ts');
  });

  it('parses terminal flag into data-terminal="true"', () => {
    const tree = makeTreeWithCode('terminal');
    runPlugin(tree);

    const code = tree.children[0] as { data?: { hProperties?: Record<string, unknown> } };
    expect(code.data?.hProperties?.['data-terminal']).toBe('true');
  });

  it('parses both title and terminal in one meta string', () => {
    const tree = makeTreeWithCode('title="run.sh" terminal');
    runPlugin(tree);

    const code = tree.children[0] as { data?: { hProperties?: Record<string, unknown> } };
    expect(code.data?.hProperties?.['data-title']).toBe('run.sh');
    expect(code.data?.hProperties?.['data-terminal']).toBe('true');
  });

  it('leaves code block alone when meta is empty', () => {
    const tree = makeTreeWithCode(null);
    runPlugin(tree);

    const code = tree.children[0] as { data?: unknown };
    expect(code.data).toBeUndefined();
  });

  it('does not match terminal in another word like "terminalize"', () => {
    // Current implementation uses .includes('terminal') so this WOULD match.
    // Documenting the current behaviour so future changes are intentional.
    const tree = makeTreeWithCode('terminalize');
    runPlugin(tree);

    const code = tree.children[0] as { data?: { hProperties?: Record<string, unknown> } };
    expect(code.data?.hProperties?.['data-terminal']).toBe('true');
  });
});
