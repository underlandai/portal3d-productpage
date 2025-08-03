import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Features',
      href: getPermalink('/#features'),
    },
    {
      text: 'Pricing',
      href: getPermalink('/pricing'),
    },
    {
      text: 'API',
      href: getPermalink('/api'),
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
    {
      text: 'Careers',
      href: 'https://lichen.com.au',
      target: '_blank',
    },
  ],
  actions: [{ text: 'Portal', href: 'https://coresync.dev'}],
};

export const footerData = {
  links: [
    {
      title: 'Underland Cloud',
      links: [
        { text: 'Features', href: getPermalink('/#features') },
        { text: 'Pricing', href: getPermalink('/pricing') },
        { text: 'API', href: getPermalink('/api') },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/underland/' },
  ],
  footNote: `
    © ${new Date().getFullYear()} Underland Pty Ltd. All rights reserved. A <a href="https://lichen.com.au" target="_blank" rel="noopener noreferrer" class="hover:underline">Lichen Commodities</a> company.
  `,
};
