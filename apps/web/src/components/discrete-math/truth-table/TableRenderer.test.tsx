import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { TableRenderer } from './TableRenderer';
import { generateTruthTable } from './logic-engine';

vi.mock('animejs', () => ({
  animate: vi.fn(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    cancel: vi.fn(),
  })),
  createTimeline: vi.fn(() => ({
    add: vi.fn().mockReturnThis(),
    play: vi.fn(),
    pause: vi.fn(),
    cancel: vi.fn(),
  })),
  stagger: vi.fn((val: number) => (_el: Element, i: number) => val * i),
}));

describe('TableRenderer', () => {
  it('renders table with variables and expressions', () => {
    const table = generateTruthTable({ 'p ∧ q': 'p && q' });
    render(() => <TableRenderer table={table} />);

    const renderer = screen.getByTestId('table-renderer');
    expect(renderer).toBeInTheDocument();
    expect(renderer.querySelector('table')).toBeInTheDocument();
  });

  it('renders correct number of rows', () => {
    const table = generateTruthTable({ 'p ∧ q': 'p && q' });
    render(() => <TableRenderer table={table} />);

    const rows = screen.getByTestId('table-renderer').querySelectorAll('tbody tr');
    expect(rows).toHaveLength(4);
  });

  it('renders variable headers', () => {
    const table = generateTruthTable({ 'p ∧ q': 'p && q' });
    render(() => <TableRenderer table={table} />);

    const headers = screen.getByTestId('table-renderer').querySelectorAll('th');
    // p, separator, q, separator, p ∧ q
    const headerTexts = Array.from(headers).map((h) => h.textContent?.trim()).filter(Boolean);
    expect(headerTexts).toContain('p');
    expect(headerTexts).toContain('q');
    expect(headerTexts).toContain('p ∧ q');
  });

  it('shows classification badges when enabled', () => {
    const table = generateTruthTable({ 'p ∨ ¬p': 'p || !p' });
    render(() => <TableRenderer table={table} showClassification />);

    const badges = screen.getByTestId('classification-badges');
    expect(badges).toBeInTheDocument();
    expect(badges.textContent).toContain('Tautology');
  });

  it('shows equivalence note when equivalences exist', () => {
    const table = generateTruthTable({
      '¬(p ∧ q)': '!(p && q)',
      '¬p ∨ ¬q': '!p || !q',
    });
    render(() => <TableRenderer table={table} highlightEquivalent />);

    const note = screen.getByTestId('equivalence-note');
    expect(note).toBeInTheDocument();
    expect(note.textContent).toContain('≡');
  });

  it('does not show equivalence note when no equivalences', () => {
    const table = generateTruthTable({ 'p': 'p' });
    render(() => <TableRenderer table={table} highlightEquivalent />);

    expect(screen.queryByTestId('equivalence-note')).not.toBeInTheDocument();
  });
});
