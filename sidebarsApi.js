// @ts-check

// Sidebar of the API reference docs instance (api/). `yarn gen-api-docs`
// writes api/sidebar.ts from the spec, grouped by tag in the spec's tag order.

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  apiSidebar: require('./api/sidebar.ts').default,
};

module.exports = sidebars;
