// Page generators for the API reference (markdownGenerators in
// docusaurus.config.js), wrapping the plugin's own:
// - createApiPageMDWithPlan renders each operation page, adds a plan box when
//   the operation has an `x-plan` extension and a pointer to Pagination on list
//   operations, and ends the page with a link to the Errors page;
// - createInfoPageMDWithLinks ends the introduction with links to the
//   hand-written pages.
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

const { createApiPageMD, createInfoPageMD } = require('docusaurus-plugin-openapi-docs/lib/markdown');
const { siblingLink, isPaged, pricingSentence, paginationNote, errorsSentence, referenceLinksSection } = require('./api-reference');

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
  return `${lines.join(' ')} ${pricingSentence()}`;
}

function planNotice(xPlan) {
  return `:::info\n\n${planText(xPlan)}\n\n:::`;
}

function createApiPageMDWithPlan(pageData) {
  const xPlan = (pageData.api.extensions || []).find((extension) => extension.key === 'x-plan');
  const hasPlan = Boolean(xPlan) && xPlan.value !== undefined && xPlan.value !== null;
  const notes = [
    isPaged(pageData.api.parameters) ? paginationNote(siblingLink) : null,
    hasPlan ? planNotice(xPlan.value) : null,
  ].filter(Boolean);
  const page = notes.length
    ? { ...pageData, api: { ...pageData.api, description: [pageData.api.description, ...notes].filter(Boolean).join('\n\n') } }
    : pageData;
  return `${createApiPageMD(page)}\n\n${errorsSentence(siblingLink)}\n`;
}

function createInfoPageMDWithLinks(pageData) {
  return `${createInfoPageMD(pageData)}\n\n${referenceLinksSection(siblingLink)}`;
}

module.exports = { createApiPageMDWithPlan, createInfoPageMDWithLinks, planNotice, planText };
