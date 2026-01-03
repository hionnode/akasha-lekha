// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkDirective from 'remark-directive';
import remarkCallouts from './src/utils/remarkCallouts.ts';
import remarkCodeMeta from './src/utils/remarkCodeMeta.ts';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
  output: 'static', // Static site generation
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
});