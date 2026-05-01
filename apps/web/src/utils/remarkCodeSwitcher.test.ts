import { describe, it, expect } from 'vitest';
import type { Root, Code } from 'mdast';
import remarkCodeSwitcher from './remarkCodeSwitcher';

function makeSwitcher(blocks: Array<{ lang?: string; value: string }>): Root {
  const code: Code[] = blocks.map((b) => ({
    type: 'code',
    lang: b.lang,
    value: b.value,
  }));
  return {
    type: 'root',
    children: [
      {
        type: 'containerDirective',
        name: 'code-switcher',
        attributes: {},
        children: code,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    ],
  };
}

function run(tree: Root) {
  const transform = remarkCodeSwitcher();
  transform(tree);
  return tree;
}

interface DirectiveLike {
  data?: { hName?: string; hProperties?: Record<string, unknown> };
}

describe('remarkCodeSwitcher', () => {
  it('detects npm/pnpm/yarn/bun from code content first word', () => {
    const tree = makeSwitcher([
      { lang: 'bash', value: 'npm install foo' },
      { lang: 'bash', value: 'pnpm add foo' },
      { lang: 'bash', value: 'yarn add foo' },
      { lang: 'bash', value: 'bun add foo' },
    ]);
    run(tree);
    const dir = tree.children[0] as DirectiveLike;
    expect(dir.data?.hProperties?.['data-switch-values']).toBe('npm,pnpm,yarn,bun');
    expect(dir.data?.hProperties?.class).toBe('code-switcher-container');
  });

  it('detects cloud providers from command prefix', () => {
    // Note: matcher is startsWith('gcp') || === 'gsutil', so `gcloud` does
    // NOT match (likely an implementation gap, but tested as-is to lock the
    // current behaviour).
    const tree = makeSwitcher([
      { lang: 'bash', value: 'aws s3 ls' },
      { lang: 'bash', value: 'gcp-something' },
      { lang: 'bash', value: 'gsutil ls' },
      { lang: 'bash', value: 'az vm list' },
    ]);
    run(tree);
    const dir = tree.children[0] as DirectiveLike;
    expect(dir.data?.hProperties?.['data-switch-values']).toBe('aws,gcp,gcp,azure');
  });

  it('falls back to lang attribute when content has no known prefix', () => {
    const tree = makeSwitcher([
      { lang: 'typescript', value: 'const x = 1;' },
      { lang: 'python', value: 'x = 1' },
    ]);
    run(tree);
    const dir = tree.children[0] as DirectiveLike;
    expect(dir.data?.hProperties?.['data-switch-values']).toBe('typescript,python');
  });

  it('uses second part of lang for "bash npm" syntax', () => {
    const tree = makeSwitcher([
      { lang: 'bash npm', value: '$INSTALL package' },
      { lang: 'bash pnpm', value: '$INSTALL package' },
    ]);
    run(tree);
    const dir = tree.children[0] as DirectiveLike;
    expect(dir.data?.hProperties?.['data-switch-values']).toBe('npm,pnpm');
  });

  it('falls back to option-N when nothing else matches', () => {
    const tree = makeSwitcher([
      { lang: 'bash', value: 'echo hi' },
      { lang: 'sh', value: 'echo hi' },
    ]);
    run(tree);
    const dir = tree.children[0] as DirectiveLike;
    expect(dir.data?.hProperties?.['data-switch-values']).toBe('option-0,option-1');
  });

  it('does nothing when directive has no code blocks', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'containerDirective',
          name: 'code-switcher',
          attributes: {},
          children: [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      ],
    };
    run(tree);
    const dir = tree.children[0] as DirectiveLike;
    expect(dir.data).toBeUndefined();
  });

  it('ignores directives with other names', () => {
    const tree = makeSwitcher([{ lang: 'bash', value: 'npm i' }]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tree.children[0] as any).name = 'tip';
    run(tree);
    const dir = tree.children[0] as DirectiveLike;
    expect(dir.data).toBeUndefined();
  });
});
