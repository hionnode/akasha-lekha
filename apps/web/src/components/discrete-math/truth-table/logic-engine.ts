// Formula parser and evaluator for propositional logic.
// Supports multiple operator syntaxes per operation.
// Pure logic — no UI dependencies.

// --- Token types ---

export type TokenType =
  | 'VAR'
  | 'TRUE'
  | 'FALSE'
  | 'NOT'
  | 'AND'
  | 'OR'
  | 'XOR'
  | 'IMPLIES'
  | 'BICONDITIONAL'
  | 'LPAREN'
  | 'RPAREN'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

// --- AST node types ---

export type ASTNode =
  | { type: 'var'; name: string }
  | { type: 'literal'; value: boolean }
  | { type: 'not'; operand: ASTNode }
  | {
      type: 'binary';
      operator: 'AND' | 'OR' | 'XOR' | 'IMPLIES' | 'BICONDITIONAL';
      left: ASTNode;
      right: ASTNode;
    };

// --- Operator aliases ---

const OPERATOR_MAP: Record<string, TokenType> = {
  '!': 'NOT',
  '¬': 'NOT',
  '~': 'NOT',
  not: 'NOT',
  '&&': 'AND',
  '&': 'AND',
  '∧': 'AND',
  and: 'AND',
  '||': 'OR',
  '∨': 'OR',
  or: 'OR',
  xor: 'XOR',
  '⊕': 'XOR',
  '->': 'IMPLIES',
  '=>': 'IMPLIES',
  '→': 'IMPLIES',
  '<->': 'BICONDITIONAL',
  '<=>': 'BICONDITIONAL',
  '↔': 'BICONDITIONAL',
};

// Sort multi-char operators longest-first for greedy matching
const SORTED_OPERATORS = Object.keys(OPERATOR_MAP).sort((a, b) => b.length - a.length);

// --- Tokenizer ---

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;

  while (pos < input.length) {
    // Skip whitespace
    if (/\s/.test(input[pos])) {
      pos++;
      continue;
    }

    // Parentheses
    if (input[pos] === '(') {
      tokens.push({ type: 'LPAREN', value: '(', position: pos });
      pos++;
      continue;
    }
    if (input[pos] === ')') {
      tokens.push({ type: 'RPAREN', value: ')', position: pos });
      pos++;
      continue;
    }

    // Check for operators (longest match first)
    let matched = false;
    for (const op of SORTED_OPERATORS) {
      const slice = input.slice(pos, pos + op.length).toLowerCase();
      const originalSlice = input.slice(pos, pos + op.length);
      if (slice === op.toLowerCase()) {
        // For word operators, ensure they're not part of a longer word
        if (/^[a-z]+$/.test(op)) {
          const nextChar = input[pos + op.length];
          if (nextChar && /[a-zA-Z0-9_]/.test(nextChar)) {
            continue;
          }
        }
        tokens.push({ type: OPERATOR_MAP[op], value: originalSlice, position: pos });
        pos += op.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Boolean literals
    if (input.slice(pos, pos + 4).toLowerCase() === 'true') {
      const nextChar = input[pos + 4];
      if (!nextChar || !/[a-zA-Z0-9_]/.test(nextChar)) {
        tokens.push({ type: 'TRUE', value: 'true', position: pos });
        pos += 4;
        continue;
      }
    }
    if (input.slice(pos, pos + 5).toLowerCase() === 'false') {
      const nextChar = input[pos + 5];
      if (!nextChar || !/[a-zA-Z0-9_]/.test(nextChar)) {
        tokens.push({ type: 'FALSE', value: 'false', position: pos });
        pos += 5;
        continue;
      }
    }

    // 1 and 0 as boolean literals
    if (input[pos] === '1' || input[pos] === '0') {
      const nextChar = input[pos + 1];
      if (!nextChar || !/[a-zA-Z0-9_]/.test(nextChar)) {
        tokens.push({
          type: input[pos] === '1' ? 'TRUE' : 'FALSE',
          value: input[pos],
          position: pos,
        });
        pos++;
        continue;
      }
    }

    // Variables (single letter or word starting with letter)
    if (/[a-zA-Z]/.test(input[pos])) {
      let name = '';
      const start = pos;
      while (pos < input.length && /[a-zA-Z0-9_]/.test(input[pos])) {
        name += input[pos];
        pos++;
      }
      tokens.push({ type: 'VAR', value: name, position: start });
      continue;
    }

    throw new Error(`Unexpected character '${input[pos]}' at position ${pos}`);
  }

  tokens.push({ type: 'EOF', value: '', position: pos });
  return tokens;
}

// --- Parser (recursive descent) ---
// Precedence (low to high): BICONDITIONAL, IMPLIES, OR, XOR, AND, NOT

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.pos];
  }

  private advance(): Token {
    return this.tokens[this.pos++];
  }

  private expect(type: TokenType): Token {
    const token = this.peek();
    if (token.type !== type) {
      throw new Error(
        `Expected ${type} but got ${token.type} ('${token.value}') at position ${token.position}`
      );
    }
    return this.advance();
  }

  parse(): ASTNode {
    const node = this.parseBiconditional();
    this.expect('EOF');
    return node;
  }

  private parseBiconditional(): ASTNode {
    let left = this.parseImplication();
    while (this.peek().type === 'BICONDITIONAL') {
      this.advance();
      const right = this.parseImplication();
      left = { type: 'binary', operator: 'BICONDITIONAL', left, right };
    }
    return left;
  }

  private parseImplication(): ASTNode {
    const left = this.parseOr();
    // Right-associative
    if (this.peek().type === 'IMPLIES') {
      this.advance();
      const right = this.parseImplication();
      return { type: 'binary', operator: 'IMPLIES', left, right };
    }
    return left;
  }

  private parseOr(): ASTNode {
    let left = this.parseXor();
    while (this.peek().type === 'OR') {
      this.advance();
      const right = this.parseXor();
      left = { type: 'binary', operator: 'OR', left, right };
    }
    return left;
  }

  private parseXor(): ASTNode {
    let left = this.parseAnd();
    while (this.peek().type === 'XOR') {
      this.advance();
      const right = this.parseAnd();
      left = { type: 'binary', operator: 'XOR', left, right };
    }
    return left;
  }

  private parseAnd(): ASTNode {
    let left = this.parseNot();
    while (this.peek().type === 'AND') {
      this.advance();
      const right = this.parseNot();
      left = { type: 'binary', operator: 'AND', left, right };
    }
    return left;
  }

  private parseNot(): ASTNode {
    if (this.peek().type === 'NOT') {
      this.advance();
      const operand = this.parseNot();
      return { type: 'not', operand };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): ASTNode {
    const token = this.peek();
    switch (token.type) {
      case 'VAR':
        this.advance();
        return { type: 'var', name: token.value };
      case 'TRUE':
        this.advance();
        return { type: 'literal', value: true };
      case 'FALSE':
        this.advance();
        return { type: 'literal', value: false };
      case 'LPAREN': {
        this.advance();
        const node = this.parseBiconditional();
        this.expect('RPAREN');
        return node;
      }
      default:
        throw new Error(
          `Unexpected token ${token.type} ('${token.value}') at position ${token.position}`
        );
    }
  }
}

export function parse(input: string): ASTNode {
  const tokens = tokenize(input);
  return new Parser(tokens).parse();
}

// --- Evaluator ---

export function evaluate(node: ASTNode, env: Record<string, boolean>): boolean {
  switch (node.type) {
    case 'var':
      if (!(node.name in env)) {
        throw new Error(`Undefined variable: ${node.name}`);
      }
      return env[node.name];
    case 'literal':
      return node.value;
    case 'not':
      return !evaluate(node.operand, env);
    case 'binary': {
      const left = evaluate(node.left, env);
      const right = evaluate(node.right, env);
      switch (node.operator) {
        case 'AND':
          return left && right;
        case 'OR':
          return left || right;
        case 'XOR':
          return left !== right;
        case 'IMPLIES':
          return !left || right;
        case 'BICONDITIONAL':
          return left === right;
      }
    }
  }
}

// --- Variable extraction ---

export function extractVariables(node: ASTNode): string[] {
  const vars = new Set<string>();
  function walk(n: ASTNode) {
    switch (n.type) {
      case 'var':
        vars.add(n.name);
        break;
      case 'not':
        walk(n.operand);
        break;
      case 'binary':
        walk(n.left);
        walk(n.right);
        break;
    }
  }
  walk(node);
  return [...vars].sort();
}

export function extractVariablesFromFormula(formula: string): string[] {
  try {
    return extractVariables(parse(formula));
  } catch {
    return [];
  }
}

// --- Truth table generation ---

export interface TruthTableRow {
  inputs: Record<string, boolean>;
  outputs: Record<string, boolean>;
}

export interface TruthTableResult {
  variables: string[];
  expressions: string[];
  rows: TruthTableRow[];
  classification: Record<string, 'tautology' | 'contradiction' | 'contingency'>;
  equivalences: [string, string][];
}

function generateInputCombinations(variables: string[]): Record<string, boolean>[] {
  const count = variables.length;
  const total = 1 << count;
  const combinations: Record<string, boolean>[] = [];

  for (let i = 0; i < total; i++) {
    const combo: Record<string, boolean> = {};
    for (let j = 0; j < count; j++) {
      combo[variables[j]] = Boolean((i >> (count - 1 - j)) & 1);
    }
    combinations.push(combo);
  }

  return combinations;
}

export function generateTruthTable(
  expressions: Record<string, string>,
  variables?: string[]
): TruthTableResult {
  // Parse all expressions
  const parsed: Record<string, ASTNode> = {};
  const allVars = new Set<string>();

  for (const [label, formula] of Object.entries(expressions)) {
    parsed[label] = parse(formula);
    for (const v of extractVariables(parsed[label])) {
      allVars.add(v);
    }
  }

  const vars = variables ?? [...allVars].sort();
  if (vars.length > 5) {
    throw new Error('Maximum 5 variables supported (32 rows)');
  }

  const combinations = generateInputCombinations(vars);
  const expressionLabels = Object.keys(expressions);

  // Evaluate all rows
  const rows: TruthTableRow[] = combinations.map((inputs) => {
    const outputs: Record<string, boolean> = {};
    for (const label of expressionLabels) {
      outputs[label] = evaluate(parsed[label], inputs);
    }
    return { inputs, outputs };
  });

  // Classify each expression
  const classification: Record<string, 'tautology' | 'contradiction' | 'contingency'> = {};
  for (const label of expressionLabels) {
    const values = rows.map((r) => r.outputs[label]);
    if (values.every(Boolean)) {
      classification[label] = 'tautology';
    } else if (values.every((v) => !v)) {
      classification[label] = 'contradiction';
    } else {
      classification[label] = 'contingency';
    }
  }

  // Find equivalences
  const equivalences: [string, string][] = [];
  for (let i = 0; i < expressionLabels.length; i++) {
    for (let j = i + 1; j < expressionLabels.length; j++) {
      const a = expressionLabels[i];
      const b = expressionLabels[j];
      const isEquiv = rows.every((r) => r.outputs[a] === r.outputs[b]);
      if (isEquiv) {
        equivalences.push([a, b]);
      }
    }
  }

  return {
    variables: vars,
    expressions: expressionLabels,
    rows,
    classification,
    equivalences,
  };
}

// --- Pretty print AST to formula string ---

const OPERATOR_SYMBOLS: Record<string, string> = {
  AND: '∧',
  OR: '∨',
  XOR: '⊕',
  IMPLIES: '→',
  BICONDITIONAL: '↔',
};

export function astToString(node: ASTNode): string {
  switch (node.type) {
    case 'var':
      return node.name;
    case 'literal':
      return node.value ? 'T' : 'F';
    case 'not': {
      const inner = astToString(node.operand);
      return node.operand.type === 'binary' ? `¬(${inner})` : `¬${inner}`;
    }
    case 'binary': {
      const left =
        node.left.type === 'binary' ? `(${astToString(node.left)})` : astToString(node.left);
      const right =
        node.right.type === 'binary' ? `(${astToString(node.right)})` : astToString(node.right);
      return `${left} ${OPERATOR_SYMBOLS[node.operator]} ${right}`;
    }
  }
}
