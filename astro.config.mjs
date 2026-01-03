// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkDirective from 'remark-directive';
import remarkCallouts from './src/utils/remarkCallouts.ts';
import remarkCodeMeta from './src/utils/remarkCodeMeta.ts';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Static site generation
  output: 'static',

  markdown: {
    shikiConfig: {
      theme: 'tokyo-night',
      wrap: true,
    },
    remarkPlugins: [
      remarkDirective,
      remarkCallouts,
      remarkCodeMeta,
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: {
          class: 'heading-link',
        },
      }],
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});