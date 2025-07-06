import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Features',
      href: getPermalink('/#features'),
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
  ],
  actions: [{ text: 'Portal', href: 'https://coresync.dev' }],
};

export const footerData = {
  links: [
    {
      title: 'Underworlds',
      links: [
        { text: 'Features', href: getPermalink('/#features') },
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
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/subsurfo/' },
  ],
  footNote: `
    © ${new Date().getFullYear()} Underworlds Pty Ltd. All rights reserved.
  `,
};
