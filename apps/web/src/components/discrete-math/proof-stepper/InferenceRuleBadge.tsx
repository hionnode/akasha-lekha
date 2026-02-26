import type { InferenceRule } from '../foundations/types';

export interface InferenceRuleBadgeProps {
  rule: InferenceRule;
  class?: string;
}

const RULE_DISPLAY: Record<InferenceRule, { label: string; category: 'propositional' | 'algebraic' | 'structural' }> = {
  'modus-ponens': { label: 'Modus Ponens', category: 'propositional' },
  'modus-tollens': { label: 'Modus Tollens', category: 'propositional' },
  'hypothetical-syllogism': { label: 'Hyp. Syllogism', category: 'propositional' },
  'disjunctive-syllogism': { label: 'Disj. Syllogism', category: 'propositional' },
  'addition': { label: 'Addition', category: 'propositional' },
  'simplification': { label: 'Simplification', category: 'propositional' },
  'conjunction': { label: 'Conjunction', category: 'propositional' },
  'resolution': { label: 'Resolution', category: 'propositional' },
  'double-negation': { label: 'Double Negation', category: 'algebraic' },
  'de-morgans': { label: "De Morgan's", category: 'algebraic' },
  'distributive': { label: 'Distributive', category: 'algebraic' },
  'commutative': { label: 'Commutative', category: 'algebraic' },
  'associative': { label: 'Associative', category: 'algebraic' },
  'identity': { label: 'Identity', category: 'algebraic' },
  'complement': { label: 'Complement', category: 'algebraic' },
  'absorption': { label: 'Absorption', category: 'algebraic' },
  'premise': { label: 'Premise', category: 'structural' },
  'assumption': { label: 'Assumption', category: 'structural' },
};

const CATEGORY_COLORS: Record<string, string> = {
  propositional: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
  algebraic: 'text-accent-green bg-accent-green/10 border-accent-green/20',
  structural: 'text-accent-purple bg-accent-purple/10 border-accent-purple/20',
};

export function InferenceRuleBadge(props: InferenceRuleBadgeProps) {
  const info = () => RULE_DISPLAY[props.rule];
  const colorClass = () => CATEGORY_COLORS[info().category];

  return (
    <span
      data-testid={`rule-badge-${props.rule}`}
      class={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${colorClass()} ${props.class ?? ''}`}
    >
      {info().label}
    </span>
  );
}

export default InferenceRuleBadge;
