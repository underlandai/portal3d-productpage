import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'CoreSync',
      href: getPermalink('/'),
    },
    {
      text: 'Consulting',
      href: getPermalink('/consulting'),
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
  actions: [{ text: 'Contact us', href: getPermalink('/contact') }],
};

export const footerData = {
  links: [
    {
      title: 'CoreSync',
      links: [
        { text: 'Features', href: getPermalink('/') },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'Consulting', href: getPermalink('/consulting') },
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
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/lichen-com/' },
  ],
  footNote: `
    © ${new Date().getFullYear()} Lichen Commodities Pty Ltd. All rights reserved.
  `,
};
