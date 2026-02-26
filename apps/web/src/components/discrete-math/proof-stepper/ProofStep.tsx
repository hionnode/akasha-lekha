import { Show } from 'solid-js';
import { InferenceRuleBadge } from './InferenceRuleBadge';
import type { ProofStep as ProofStepType } from '../foundations/types';

export interface ProofStepProps {
  step: ProofStepType;
  highlighted?: boolean;
  visible?: boolean;
  isConclusion?: boolean;
}

export function ProofStep(props: ProofStepProps) {
  const visible = () => props.visible ?? true;

  return (
    <Show when={visible()}>
      <div
        data-testid={`proof-step-${props.step.lineNumber}`}
        class={`flex items-start gap-3 px-3 py-2 rounded transition-all duration-300 ${
          props.highlighted
            ? 'bg-accent-blue/10 border border-accent-blue/20'
            : props.isConclusion
              ? 'bg-accent-green/10 border border-accent-green/20'
              : 'border border-transparent'
        }`}
      >
        {/* Line number */}
        <span class="flex-shrink-0 w-6 text-right text-xs text-fg-muted tabular-nums pt-0.5">
          {props.step.lineNumber}.
        </span>

        {/* Statement and justification */}
        <div class="flex-1 min-w-0">
          <div class="font-mono text-sm text-fg-primary">
            {props.step.statement}
          </div>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-xs text-fg-muted">
              {props.step.justification}
            </span>
            <Show when={props.step.rule}>
              {(rule) => <InferenceRuleBadge rule={rule()} />}
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
}

export default ProofStep;
