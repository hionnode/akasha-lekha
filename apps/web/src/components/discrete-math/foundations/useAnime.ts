// SSR-safe anime.js hook for Solid.js components.
// Dynamic import prevents anime.js from entering the server bundle.
// Module-level cache ensures a single import across all instances.

import { onCleanup } from 'solid-js';

type AnimeModule = typeof import('animejs');

let animeModulePromise: Promise<AnimeModule> | null = null;
let animeModule: AnimeModule | null = null;

function loadAnime(): Promise<AnimeModule> {
  if (animeModule) return Promise.resolve(animeModule);
  if (!animeModulePromise) {
    animeModulePromise = import('animejs').then((mod) => {
      animeModule = mod;
      return mod;
    });
  }
  return animeModulePromise;
}

export interface AnimeHandle {
  pause: () => void;
  cancel: () => void;
}

export function useAnime() {
  const instances: AnimeHandle[] = [];

  onCleanup(() => {
    for (const instance of instances) {
      instance.pause();
    }
    instances.length = 0;
  });

  async function animate(
    targets: string | Element | Element[] | NodeListOf<Element>,
    params: Record<string, unknown>
  ): Promise<AnimeHandle | null> {
    if (typeof window === 'undefined') return null;
    const mod = await loadAnime();
    const instance = mod.animate(
      targets as Parameters<typeof mod.animate>[0],
      {
        autoplay: false,
        ...params,
      } as Parameters<typeof mod.animate>[1]
    );
    const handle: AnimeHandle = {
      pause: () => instance.pause(),
      cancel: () => instance.cancel(),
    };
    instances.push(handle);
    instance.play();
    return handle;
  }

  async function timeline(params: Record<string, unknown> = {}) {
    if (typeof window === 'undefined') return null;
    const mod = await loadAnime();
    const tl = mod.createTimeline({
      autoplay: false,
      ...params,
    } as Parameters<typeof mod.createTimeline>[0]);
    const handle: AnimeHandle = {
      pause: () => tl.pause(),
      cancel: () => tl.cancel(),
    };
    instances.push(handle);
    return tl;
  }

  async function getStagger() {
    if (typeof window === 'undefined') return null;
    const mod = await loadAnime();
    return mod.stagger;
  }

  return { animate, timeline, getStagger };
}
