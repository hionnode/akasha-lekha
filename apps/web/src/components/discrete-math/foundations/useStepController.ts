// Shared play/pause/step logic for step-based interactive components.

import { createSignal } from 'solid-js';
import type { StepState } from './types';

export interface StepControllerOptions {
  totalSteps: number;
  autoPlayInterval?: number; // ms between steps during auto-play (default: 1000)
  onStepChange?: (step: number) => void;
}

export function useStepController(options: StepControllerOptions) {
  const [currentStep, setCurrentStep] = createSignal(0);
  const [isPlaying, setIsPlaying] = createSignal(false);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const interval = options.autoPlayInterval ?? 1000;

  function clearAutoPlay() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function notifyChange(step: number) {
    options.onStepChange?.(step);
  }

  function goToStep(step: number) {
    const clamped = Math.max(0, Math.min(step, options.totalSteps - 1));
    setCurrentStep(clamped);
    notifyChange(clamped);
  }

  function stepForward() {
    if (currentStep() < options.totalSteps - 1) {
      goToStep(currentStep() + 1);
    } else {
      pause();
    }
  }

  function stepBack() {
    if (currentStep() > 0) {
      goToStep(currentStep() - 1);
    }
  }

  function goToFirst() {
    pause();
    goToStep(0);
  }

  function goToLast() {
    pause();
    goToStep(options.totalSteps - 1);
  }

  function play() {
    if (currentStep() >= options.totalSteps - 1) {
      goToStep(0);
    }
    setIsPlaying(true);
    clearAutoPlay();
    intervalId = setInterval(() => {
      if (currentStep() >= options.totalSteps - 1) {
        pause();
      } else {
        stepForward();
      }
    }, interval);
  }

  function pause() {
    setIsPlaying(false);
    clearAutoPlay();
  }

  function togglePlay() {
    if (isPlaying()) {
      pause();
    } else {
      play();
    }
  }

  function state(): StepState {
    return {
      currentStep: currentStep(),
      totalSteps: options.totalSteps,
      isPlaying: isPlaying(),
    };
  }

  function cleanup() {
    clearAutoPlay();
  }

  return {
    currentStep,
    isPlaying,
    stepForward,
    stepBack,
    goToFirst,
    goToLast,
    play,
    pause,
    togglePlay,
    goToStep,
    state,
    cleanup,
  };
}
