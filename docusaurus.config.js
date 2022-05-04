// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
// If you are using dotenv (https://www.npmjs.com/package/dotenv)
require('dotenv').config();

const path = require('path')

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const url = process.env.URL ?? '';
const baseUrl = path.join('/', process.env.BASE_PATH ?? '');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SFTP To Go Documentation',
  titleDelimiter: ':',
  tagline: 'Explore our guides and examples to integrate SFTP To Go.',
  url,
  baseUrl,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: '/img/favicon-96x96.png',
  organizationName: 'crazyantlabs',
  projectName: 'sftptogo-docs',
  trailingSlash: true,
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/crazyantlabs/sftptogo-docs/tree/main/',
          showLastUpdateTime: false
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        hideOnScroll: true,
        title: 'SFTP To Go',
        logo: {
          alt: 'SFTP To Go Logo',
          src: '/img/logo.svg',
          srcDark: '/img/logo.svg'
        },
        items: [
          {
            type: 'doc',
            docId: 'overview',
            position: 'left',
            label: 'Docs',
          },
          {
            to: 'https://sftptogo.com/blog/api-reference/',
            label: 'API',
            position: 'left'
          },
          {to: 'https://sftptogo.com/blog/', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/crazyantlabs/sftptogo-docs',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
          {
            to: 'https://sftptogo.com/login',
            position: 'right',
            label: 'Sign in',
            className: 'nav-link',
          },
          {
            to: 'https://sftptogo.com/register',
            position: 'right',
            label: 'Free trial',
            className: 'nav-link cta-link',
          },
        ],
      },
      footer: {
        links: [],
        logo: {
          alt: 'SFTP To Go Logo',
          src: 'img/logo.svg',
          width: 32,
          height: 32,
          href: 'https://sftptogo.com',
        },
        copyright: `© ${new Date().getFullYear()} <Link>Crazy Ant Labs</Link>`,
      },
      prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
      },
      segment: {
        apiKey: process.env.SEGMENT_WRITE_KEY,
      },
      hideableSidebar: false,
      colorMode: {
        respectPrefersColorScheme: true,
      },
      image: 'img/logo.svg',
    }),
};

module.exports = config;
