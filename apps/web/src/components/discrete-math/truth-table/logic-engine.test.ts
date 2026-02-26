import { describe, it, expect } from 'vitest';
import {
  tokenize,
  parse,
  evaluate,
  extractVariables,
  generateTruthTable,
  astToString,
} from './logic-engine';

describe('tokenize', () => {
  it('tokenizes simple variable expression', () => {
    const tokens = tokenize('p');
    expect(tokens).toHaveLength(2); // VAR + EOF
    expect(tokens[0]).toMatchObject({ type: 'VAR', value: 'p' });
  });

  it('tokenizes AND with symbol', () => {
    const tokens = tokenize('p ∧ q');
    expect(tokens[0]).toMatchObject({ type: 'VAR', value: 'p' });
    expect(tokens[1]).toMatchObject({ type: 'AND' });
    expect(tokens[2]).toMatchObject({ type: 'VAR', value: 'q' });
  });

  it('tokenizes AND with &&', () => {
    const tokens = tokenize('p && q');
    expect(tokens[1]).toMatchObject({ type: 'AND' });
  });

  it('tokenizes AND with keyword', () => {
    const tokens = tokenize('p and q');
    expect(tokens[1]).toMatchObject({ type: 'AND' });
  });

  it('tokenizes NOT with !', () => {
    const tokens = tokenize('!p');
    expect(tokens[0]).toMatchObject({ type: 'NOT' });
    expect(tokens[1]).toMatchObject({ type: 'VAR', value: 'p' });
  });

  it('tokenizes implies with ->', () => {
    const tokens = tokenize('p -> q');
    expect(tokens[1]).toMatchObject({ type: 'IMPLIES' });
  });

  it('tokenizes biconditional with <->', () => {
    const tokens = tokenize('p <-> q');
    expect(tokens[1]).toMatchObject({ type: 'BICONDITIONAL' });
  });

  it('tokenizes parentheses', () => {
    const tokens = tokenize('(p || q)');
    expect(tokens[0]).toMatchObject({ type: 'LPAREN' });
    expect(tokens[4]).toMatchObject({ type: 'RPAREN' });
  });

  it('tokenizes boolean literals', () => {
    const tokens = tokenize('true && false');
    expect(tokens[0]).toMatchObject({ type: 'TRUE' });
    expect(tokens[2]).toMatchObject({ type: 'FALSE' });
  });

  it('throws on unexpected character', () => {
    expect(() => tokenize('p @ q')).toThrow('Unexpected character');
  });

  it('does not confuse "android" as containing "and"', () => {
    const tokens = tokenize('android');
    expect(tokens[0]).toMatchObject({ type: 'VAR', value: 'android' });
  });
});

describe('parse', () => {
  it('parses single variable', () => {
    const ast = parse('p');
    expect(ast).toEqual({ type: 'var', name: 'p' });
  });

  it('parses NOT', () => {
    const ast = parse('!p');
    expect(ast).toEqual({ type: 'not', operand: { type: 'var', name: 'p' } });
  });

  it('parses AND', () => {
    const ast = parse('p && q');
    expect(ast).toEqual({
      type: 'binary',
      operator: 'AND',
      left: { type: 'var', name: 'p' },
      right: { type: 'var', name: 'q' },
    });
  });

  it('respects operator precedence (AND before OR)', () => {
    const ast = parse('p || q && r');
    expect(ast).toEqual({
      type: 'binary',
      operator: 'OR',
      left: { type: 'var', name: 'p' },
      right: {
        type: 'binary',
        operator: 'AND',
        left: { type: 'var', name: 'q' },
        right: { type: 'var', name: 'r' },
      },
    });
  });

  it('respects parentheses over precedence', () => {
    const ast = parse('(p || q) && r');
    expect(ast.type).toBe('binary');
    if (ast.type === 'binary') {
      expect(ast.operator).toBe('AND');
      expect(ast.left.type).toBe('binary');
    }
  });

  it('parses implies as right-associative', () => {
    const ast = parse('p -> q -> r');
    if (ast.type === 'binary') {
      expect(ast.operator).toBe('IMPLIES');
      expect(ast.right.type).toBe('binary');
      if (ast.right.type === 'binary') {
        expect(ast.right.operator).toBe('IMPLIES');
      }
    }
  });

  it('parses double negation', () => {
    const ast = parse('!!p');
    expect(ast).toEqual({
      type: 'not',
      operand: { type: 'not', operand: { type: 'var', name: 'p' } },
    });
  });

  it('throws on empty input', () => {
    expect(() => parse('')).toThrow();
  });

  it('throws on mismatched parentheses', () => {
    expect(() => parse('(p && q')).toThrow();
  });
});

describe('evaluate', () => {
  it('evaluates variable', () => {
    expect(evaluate(parse('p'), { p: true })).toBe(true);
    expect(evaluate(parse('p'), { p: false })).toBe(false);
  });

  it('evaluates NOT', () => {
    expect(evaluate(parse('!p'), { p: true })).toBe(false);
    expect(evaluate(parse('!p'), { p: false })).toBe(true);
  });

  it('evaluates AND', () => {
    expect(evaluate(parse('p && q'), { p: true, q: true })).toBe(true);
    expect(evaluate(parse('p && q'), { p: true, q: false })).toBe(false);
  });

  it('evaluates OR', () => {
    expect(evaluate(parse('p || q'), { p: false, q: false })).toBe(false);
    expect(evaluate(parse('p || q'), { p: false, q: true })).toBe(true);
  });

  it('evaluates XOR', () => {
    expect(evaluate(parse('p xor q'), { p: true, q: true })).toBe(false);
    expect(evaluate(parse('p xor q'), { p: true, q: false })).toBe(true);
  });

  it('evaluates IMPLIES', () => {
    expect(evaluate(parse('p -> q'), { p: true, q: false })).toBe(false);
    expect(evaluate(parse('p -> q'), { p: false, q: false })).toBe(true);
  });

  it('evaluates BICONDITIONAL', () => {
    expect(evaluate(parse('p <-> q'), { p: true, q: true })).toBe(true);
    expect(evaluate(parse('p <-> q'), { p: true, q: false })).toBe(false);
  });

  it('throws on undefined variable', () => {
    expect(() => evaluate(parse('p'), {})).toThrow('Undefined variable: p');
  });

  it('evaluates De Morgan first law: !(p && q) === (!p || !q)', () => {
    for (const p of [true, false]) {
      for (const q of [true, false]) {
        expect(evaluate(parse('!(p && q)'), { p, q })).toBe(
          evaluate(parse('(!p || !q)'), { p, q })
        );
      }
    }
  });
});

describe('extractVariables', () => {
  it('extracts variables from simple expression', () => {
    expect(extractVariables(parse('p && q'))).toEqual(['p', 'q']);
  });

  it('extracts unique variables sorted', () => {
    expect(extractVariables(parse('q && p || q'))).toEqual(['p', 'q']);
  });

  it('returns empty for literal-only expression', () => {
    expect(extractVariables(parse('true && false'))).toEqual([]);
  });
});

describe('generateTruthTable', () => {
  it('generates table for single variable', () => {
    const result = generateTruthTable({ p: 'p' });
    expect(result.variables).toEqual(['p']);
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0].inputs).toEqual({ p: false });
    expect(result.rows[0].outputs).toEqual({ p: false });
    expect(result.rows[1].inputs).toEqual({ p: true });
    expect(result.rows[1].outputs).toEqual({ p: true });
  });

  it('generates table for AND with two variables', () => {
    const result = generateTruthTable({ 'p ∧ q': 'p && q' });
    expect(result.rows).toHaveLength(4);
    expect(result.rows[3].outputs['p ∧ q']).toBe(true); // T T
  });

  it('detects tautology', () => {
    const result = generateTruthTable({ 'p ∨ ¬p': 'p || !p' });
    expect(result.classification['p ∨ ¬p']).toBe('tautology');
  });

  it('detects contradiction', () => {
    const result = generateTruthTable({ 'p ∧ ¬p': 'p && !p' });
    expect(result.classification['p ∧ ¬p']).toBe('contradiction');
  });

  it('detects contingency', () => {
    const result = generateTruthTable({ 'p ∧ q': 'p && q' });
    expect(result.classification['p ∧ q']).toBe('contingency');
  });

  it('detects equivalences (De Morgan)', () => {
    const result = generateTruthTable({
      '¬(p ∧ q)': '!(p && q)',
      '¬p ∨ ¬q': '!p || !q',
    });
    expect(result.equivalences).toEqual([['¬(p ∧ q)', '¬p ∨ ¬q']]);
  });

  it('throws for more than 5 variables', () => {
    expect(() => generateTruthTable({ f: 'a && b && c && d && e && f' })).toThrow(
      'Maximum 5 variables'
    );
  });
});

describe('astToString', () => {
  it('converts simple expression', () => {
    expect(astToString(parse('p && q'))).toBe('p ∧ q');
  });

  it('converts NOT with parentheses for binary operand', () => {
    expect(astToString(parse('!(p && q)'))).toBe('¬(p ∧ q)');
  });

  it('converts NOT without parentheses for variable', () => {
    expect(astToString(parse('!p'))).toBe('¬p');
  });

  it('converts nested binary with parentheses', () => {
    const result = astToString(parse('(p || q) && r'));
    expect(result).toBe('(p ∨ q) ∧ r');
  });
});
