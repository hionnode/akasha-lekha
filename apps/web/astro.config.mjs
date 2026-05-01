// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import remarkDirective from 'remark-directive';
import remarkCallouts from './src/utils/remarkCallouts.ts';
import remarkCodeMeta from './src/utils/remarkCodeMeta.ts';
import remarkSteps from './src/utils/remarkSteps.ts';
import remarkCodeSwitcher from './src/utils/remarkCodeSwitcher.ts';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeSwitcher from './src/utils/rehypeCodeSwitcher.ts';

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
      remarkCodeSwitcher,
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: {
          class: 'heading-link',
        },
      }],
      rehypeCodeSwitcher,
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});