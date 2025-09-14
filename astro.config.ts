import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';
import vercel from '@astrojs/vercel'; 

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      serialize(item) {
        // Add proper metadata for each page
        if (item.url === 'https://underlandportal.com/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (item.url.includes('/blog/') || item.url === 'https://underlandportal.com/blog') {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (item.url === 'https://underlandportal.com/pricing' || item.url === 'https://underlandportal.com/api') {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (item.url === 'https://underlandportal.com/contact') {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        }
        
        // Add lastmod for all pages
        item.lastmod = new Date();
        
        return item;
      },
      filter: (page) => {
        // Include key pages and blog posts
        const allowedPages = [
          'https://underlandportal.com/', // Home page
          'https://underlandportal.com/pricing',
          'https://underlandportal.com/api',
          'https://underlandportal.com/blog',
          'https://underlandportal.com/contact',
          'https://underlandportal.com/terms',
          'https://underlandportal.com/privacy'
        ];
        
        // Also include all blog posts - simplified logic
        const isBlogPost = page.includes('/blog/') && !page.endsWith('/blog');
        
        const shouldInclude = allowedPages.includes(page) || isBlogPost;
        return shouldInclude;
      }
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
