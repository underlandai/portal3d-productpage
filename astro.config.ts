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
        if (item.url === 'https://portal3d.underlandex.com/') {
          item.priority = 1.0;
          item.changefreq = 'daily' as const;
        } else if (item.url.includes('/blog/') || item.url === 'https://portal3d.underlandex.com/blog') {
          item.priority = 0.8;
          item.changefreq = 'weekly' as const;
        } else if (item.url === 'https://portal3d.underlandex.com/pricing' || item.url === 'https://portal3d.underlandex.com/api') {
          item.priority = 0.9;
          item.changefreq = 'weekly' as const;
        } else if (item.url === 'https://portal3d.underlandex.com/contact') {
          item.priority = 0.7;
          item.changefreq = 'monthly' as const;
        } else {
          item.priority = 0.6;
          item.changefreq = 'monthly' as const;
        }

        // Add lastmod for all pages
        item.lastmod = new Date().toISOString();
        
        return item;
      },
      filter: (page) => {
        // Include key pages and blog posts
        const allowedPages = [
          'https://portal3d.underlandex.com/', // Home page
          'https://portal3d.underlandex.com/pricing',
          'https://portal3d.underlandex.com/api',
          'https://portal3d.underlandex.com/blog',
          'https://portal3d.underlandex.com/contact',
          'https://portal3d.underlandex.com/terms',
          'https://portal3d.underlandex.com/privacy'
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
