import { createSignal, For, Show, onMount, onCleanup, createEffect } from 'solid-js';
import { useAnime } from '../foundations/useAnime';
import { useStepController } from '../foundations/useStepController';
import { StepController } from '../foundations/StepController';
import { ProofStep } from './ProofStep';
import type { ProofDefinition } from '../foundations/types';

export interface ProofStepperProps {
  proof: ProofDefinition;
  showRules?: boolean;
  animate?: boolean;
}

export function ProofStepper(props: ProofStepperProps) {
  const shouldAnimate = () => props.animate ?? true;
  const totalSteps = () => props.proof.steps.length + 1; // +1 for conclusion
  const { animate } = useAnime();

  const [highlightedLines, setHighlightedLines] = createSignal<Set<number>>(new Set());

  const controller = useStepController({
    totalSteps: totalSteps(),
    autoPlayInterval: 1500,
    onStepChange: (step) => {
      animateStep(step);
    },
  });

  async function animateStep(stepIndex: number) {
    // Determine which previous lines to highlight
    const newHighlights = new Set<number>();
    if (stepIndex < props.proof.steps.length) {
      const step = props.proof.steps[stepIndex];
      if (step.highlightPrevious) {
        for (const ln of step.highlightPrevious) {
          newHighlights.add(ln);
        }
      }
    }
    setHighlightedLines(newHighlights);

    // Animate the new step in
    if (shouldAnimate()) {
      const selector = `[data-proof-step-idx="${stepIndex}"]`;
      const el = document.querySelector(selector);
      if (el) {
        await animate(el, {
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 300,
        });
      }
    }
  }

  onCleanup(() => {
    controller.cleanup();
  });

  const isStepVisible = (idx: number) => idx <= controller.currentStep();
  const isConclusion = (idx: number) => idx === props.proof.steps.length;

  return (
    <div data-testid="proof-stepper" class="rounded-lg border border-border bg-bg-primary p-4 space-y-3">
      {/* Title and statement */}
      <div class="space-y-1">
        <h4 class="text-sm font-medium text-accent-cyan">{props.proof.title}</h4>
        <p class="text-sm text-fg-secondary font-mono">{props.proof.statement}</p>
      </div>

      {/* Premises */}
      <Show when={props.proof.premises.length > 0}>
        <div class="space-y-1 pb-2 border-b border-border">
          <span class="text-xs text-fg-muted font-medium">Premises:</span>
          <For each={props.proof.premises}>
            {(premise) => (
              <div class="font-mono text-sm text-fg-secondary pl-3">• {premise}</div>
            )}
          </For>
        </div>
      </Show>

      {/* Steps */}
      <div class="space-y-1">
        <For each={props.proof.steps}>
          {(step, idx) => (
            <div
              data-proof-step-idx={idx()}
              style={shouldAnimate() && !isStepVisible(idx()) ? { opacity: 0 } : {}}
            >
              <Show when={isStepVisible(idx())}>
                <ProofStep
                  step={step}
                  highlighted={highlightedLines().has(step.lineNumber)}
                  isConclusion={false}
                />
              </Show>
            </div>
          )}
        </For>

        {/* Conclusion */}
        <Show when={isStepVisible(props.proof.steps.length)}>
          <div
            data-proof-step-idx={props.proof.steps.length}
            class="mt-2 pt-2 border-t border-border"
            style={shouldAnimate() ? {} : {}}
          >
            <div class="flex items-center gap-2 px-3 py-2 rounded bg-accent-green/10 border border-accent-green/20">
              <span class="font-mono text-sm text-accent-green font-medium">
                {props.proof.conclusion}
              </span>
              <Show when={props.proof.qed}>
                <span class="text-accent-green font-bold text-base ml-auto" aria-label="QED">∎</span>
              </Show>
            </div>
          </div>
        </Show>
      </div>

      {/* Step controller */}
      <StepController
        currentStep={controller.currentStep()}
        totalSteps={totalSteps()}
        isPlaying={controller.isPlaying()}
        onStepForward={controller.stepForward}
        onStepBack={controller.stepBack}
        onGoToFirst={controller.goToFirst}
        onGoToLast={controller.goToLast}
        onTogglePlay={controller.togglePlay}
      />

      <noscript>
        <div class="text-center py-4 text-fg-muted text-sm">
          Enable JavaScript for the interactive proof walkthrough.
        </div>
      </noscript>
    </div>
  );
}

export default ProofStepper;
