// Page generator for the API reference (markdownGenerators.createApiPageMD in
// docusaurus.config.js). It renders each operation page with the plugin's own
// generator, adds a plan box when the operation has an `x-plan` extension and a
// pointer to Pagination on list operations, and ends the page with a link to
// the Errors page.
//
// The box follows the guides' convention for plan-gated features: an `:::info`
// admonition linking to the pricing page. It goes under the operation's
// description. `x-plan` is an object (or a list of them), for example:
//
//   x-plan:
//     feature: inbound-rules                 # "Only some plans include inbound rules (`Settings...`)."
//     appliesTo: Settings.Network.InboundRules
//
//   x-plan:
//     limit: credentials                     # "Counts against your plan's credentials limit."
//
// An entry with both `feature` and `limit` gets both sentences.
//
// Any other shape still gets a box with a general sentence, so a change to the
// extension in the spec never breaks the build or hides that a plan applies.

const { createApiPageMD } = require('docusaurus-plugin-openapi-docs/lib/markdown');

const PRICING = 'Read more about our different plans [here](https://sftptogo.com/pricing).';

// Spec values become prose inside MDX: keep letters, digits and spaces only.
function words(value) {
  return typeof value === 'string'
    ? value.replace(/[-_]+/g, ' ').replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, ' ').trim()
    : '';
}

// A field path in backticks: keep the characters a path or name can contain.
function codeSpan(value) {
  const text = typeof value === 'string' ? value.replace(/[^A-Za-z0-9_.\-[\]]/g, '') : '';
  return text ? `\`${text}\`` : '';
}

function sentences(entry) {
  const found = [];
  if (entry && typeof entry === 'object') {
    const feature = words(entry.feature);
    if (feature) {
      const field = codeSpan(entry.appliesTo);
      found.push(`Only some plans include ${feature}${field ? ` (${field})` : ''}.`);
    }
    const limit = words(entry.limit);
    if (limit) found.push(`Counts against your plan's ${limit} limit.`);
  }
  return found.length ? found : ['What this operation can do depends on your plan.'];
}

// The plan sentences followed by the pricing link, as plain Markdown.
function planText(xPlan) {
  const entries = Array.isArray(xPlan) ? xPlan : [xPlan];
  const lines = [...new Set(entries.flatMap(sentences))];
  return `${lines.join(' ')} ${PRICING}`;
}

function planNotice(xPlan) {
  return `:::info\n\n${planText(xPlan)}\n\n:::`;
}

// Every operation page ends by pointing at the Errors page, which explains the
// error responses listed above it.
const ERRORS_LINK = '\n\nSee [Errors](./errors.md) for the error body, the status codes and when to retry.\n';

// A list operation (one that takes an `after` or `before` cursor) gets a line
// under its description pointing at the Pagination page.
const PAGINATION_NOTE = 'This list is paged: pass `limit` and follow the `Link` header. See [Pagination](./pagination.mdx).';

function isPaged(parameters) {
  return (parameters || []).some((p) => p && p.in === 'query' && (p.name === 'after' || p.name === 'before'));
}

function createApiPageMDWithPlan(pageData) {
  const xPlan = (pageData.api.extensions || []).find((extension) => extension.key === 'x-plan');
  const hasPlan = Boolean(xPlan) && xPlan.value !== undefined && xPlan.value !== null;
  const notes = [
    isPaged(pageData.api.parameters) ? PAGINATION_NOTE : null,
    hasPlan ? planNotice(xPlan.value) : null,
  ].filter(Boolean);
  const page = notes.length
    ? { ...pageData, api: { ...pageData.api, description: [pageData.api.description, ...notes].filter(Boolean).join('\n\n') } }
    : pageData;
  return createApiPageMD(page) + ERRORS_LINK;
}

module.exports = { createApiPageMDWithPlan, planNotice, planText };
