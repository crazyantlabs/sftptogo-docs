// @ts-check

// Sidebar of the API reference docs instance (api/). `yarn gen-api-docs`
// writes api/sidebar.ts from the spec: the introduction first, then the
// operations grouped by tag in the spec's tag order. The hand-written
// Authentication, Errors and Pagination pages go right after the introduction.

const { HAND_WRITTEN_FILES } = require('./scripts/api-reference');

const generated = require('./api/sidebar.ts').default;

const introduction = generated.findIndex((item) => item.type === 'doc');

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  apiSidebar: [
    ...generated.slice(0, introduction + 1),
    ...Object.keys(HAND_WRITTEN_FILES).map((id) => ({ type: 'doc', id })),
    ...generated.slice(introduction + 1),
  ],
};

module.exports = sidebars;
