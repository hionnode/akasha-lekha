// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import remarkDirective from 'remark-directive';
import remarkCallouts from './src/utils/remarkCallouts.ts';
import remarkCodeMeta from './src/utils/remarkCodeMeta.ts';
import remarkSteps from './src/utils/remarkSteps.ts';
import remarkCodeSwitcherPOC from './src/utils/remarkCodeSwitcher.poc.ts';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeSwitcherPOC from './src/utils/rehypeCodeSwitcher.poc.ts';

import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

import solidJs from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  site: 'https://works-on-my.cloud',

  // Static site generation
  output: 'static',

  integrations: [mdx(), solidJs(), sitemap()],

  markdown: {
    shikiConfig: {
      theme: 'tokyo-night',
      wrap: true,
    },
    remarkPlugins: [
      remarkDirective,
      remarkCallouts,
      remarkCodeMeta,
      remarkSteps,
      remarkCodeSwitcherPOC, // POC code switcher
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: {
          class: 'heading-link',
        },
      }],
      rehypeCodeSwitcherPOC, // POC code switcher
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});