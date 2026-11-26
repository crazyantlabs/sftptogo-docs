// What the API reference's pieces share: the site configuration, the page
// generators (scripts/api-page-markdown.js), the post-processing
// (scripts/postprocess-api-docs.js), the Markdown copies (plugins/api-markdown)
// and the theme components. Each value and sentence lives here once.
//
// The sentences take a `link(slug)` function, so the same text links to the
// sibling page in the generated MDX and to the absolute .md copy in the
// Markdown copies.

// The API reference's docs instance: its plugin id, its folder in the repo,
// and its route under the site's base URL.
const API_DOCS_ID = 'api';
const API_DIR = 'api';
const API_ROUTE = 'api';

// The introduction's slug. scripts/api-info-page.mustache sets the same slug
// (a template can't import it); the /docs/api/ redirect's build check fails if
// the two ever differ.
const INTRODUCTION_SLUG = 'introduction';

// The bundled spec, served as /docs/openapi/management.yaml.
const SPEC_PATH = 'static/openapi/management.yaml';

const PRICING_URL = 'https://sftptogo.com/pricing';

// The hand-written pages in API_DIR, by slug.
const HAND_WRITTEN_FILES = {
  authentication: 'authentication.mdx',
  errors: 'errors.md',
  pagination: 'pagination.mdx',
};

// A link from a generated page to a hand-written page beside it, which the
// build checks.
function siblingLink(slug) {
  return `./${HAND_WRITTEN_FILES[slug]}`;
}

// Where a page's Markdown copy is served.
function markdownCopyPath(pagePath) {
  return `${pagePath}.md`;
}

// A list operation is one that takes a paging cursor.
function isPaged(parameters) {
  return (parameters || []).some((p) => p && p.in === 'query' && (p.name === 'after' || p.name === 'before'));
}

function pricingSentence() {
  return `Read more about our different plans [here](${PRICING_URL}).`;
}

function paginationNote(link) {
  return `This list is paged: pass \`limit\` and follow the \`Link\` header. See [Pagination](${link('pagination')}).`;
}

function errorsSentence(link) {
  return `See [Errors](${link('errors')}) for the error body, the status codes and when to retry.`;
}

// The section that ends the introduction.
function referenceLinksSection(link) {
  return [
    '## Authentication, errors and pagination',
    '',
    `Send your API key with every request: see [Authentication](${link('authentication')}). For the status codes and error bodies the API returns, see [Errors](${link('errors')}). List endpoints return results a page at a time: see [Pagination](${link('pagination')}).`,
  ].join('\n');
}

module.exports = {
  API_DOCS_ID,
  API_DIR,
  API_ROUTE,
  INTRODUCTION_SLUG,
  SPEC_PATH,
  PRICING_URL,
  HAND_WRITTEN_FILES,
  siblingLink,
  markdownCopyPath,
  isPaged,
  pricingSentence,
  paginationNote,
  errorsSentence,
  referenceLinksSection,
};
