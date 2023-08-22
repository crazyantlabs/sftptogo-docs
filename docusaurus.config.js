// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
// If you are using dotenv (https://www.npmjs.com/package/dotenv)
require('dotenv').config();

const path = require('path')

const { themes } = require('prism-react-renderer');

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
  onBrokenMarkdownLinks: 'throw',
  favicon: '/img/favicon-96x96.png',
  organizationName: 'crazyantlabs',
  projectName: 'sftptogo-docs',
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
      
    ]
  ],
  plugins: [
    [
      'docusaurus-plugin-segment',
      {
        apiKey: process.env.SEGMENT_WRITE_KEY,
        page: {
          category: 'Docs',
        },
        // Add other options here.
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Uncomment when Algolia Docsearch is approved
      algolia: {
        // The application ID provided by Algolia
        appId: process.env.ALGOLIASEARCH_APPLICATION_ID,
        // Public API key: it is safe to commit it
        apiKey: process.env.ALGOLIASEARCH_API_KEY,
        // Index name
        indexName: process.env.ALGOLIASEARCH_INDEX_NAME,
        // Optional: see doc section below
        contextualSearch: true,
      },
      navbar: {
        hideOnScroll: true,
        title: 'SFTP To Go',
        logo: {
          alt: 'SFTP To Go Logo',
          src: '/img/logo.svg',
          srcDark: '/img/logo.svg',
          href: `${url}`,
        },
        items: [
          {
            type: 'doc',
            docId: 'overview',
            position: 'left',
            label: 'Docs',
          },
          {
            to: `${url}/blog/api-reference/`,
            label: 'API',
            position: 'left'
          },
          {to: `${url}/blog/`, label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/crazyantlabs/sftptogo-docs',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
          {
            to: `${url}/auth/login`,
            position: 'right',
            label: 'Sign in',
            className: 'nav-link',
          },
          {
            to: `${url}/register`,
            position: 'right',
            label: 'Free trial',
            className: 'nav-link cta-link',
          },
        ],
      },
      footer: {
          links: [
              {
                  label: 'Terms',
                  href: `${url}/terms-of-service`,
              },{
                  label: 'Privacy',
                  href: `${url}/privacy`,
              },{
                  label: 'Security',
                  href: `${url}/security`,
              },{
                  label: 'Status',
                  href: 'https://status.crazyantlabs.com/',
              },{
                  label: 'Docs',
                  href: '/',
              },{
                  label: 'Contact us',
                  href: 'mailto:support@crazyantlabs.com',
              },{
                  label: 'Integrations',
                  href: `${url}/integrations/`,
              },{
                  label: 'Pricing',
                  href: `${url}/pricing`,
              },{
                  label: 'Blog',
                  href: `${url}/blog/`,
              },{
                  label: 'About',
                  href: `${url}/about`,
              },
          ],
          copyright: `© ${new Date().getFullYear()} <a class="footer__link-item" href="https://crazyantlabs.com">Crazy Ant Labs</a>`,
      },
      prism: {
          theme: themes.github,
          darkTheme: themes.dracula,
      },
      docs: {
        sidebar: {
          hideable: false,
        }
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      image: 'img/logo.svg',
    }),
};

module.exports = config;
