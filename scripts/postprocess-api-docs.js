// Runs after `docusaurus gen-api-docs` (see the gen-api-docs script) and
// adjusts each generated operation page (api/*.api.mdx).

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const { API_DIR, API_ROUTE } = require('./api-reference');

const dir = path.join(__dirname, '..', API_DIR);

// The theme turns `info_path` into the link in the page's Authorization box
// (`/<info_path>#authentication`). The generator points it at the introduction
// and sets it only after page generators have run, so it is repointed here, at
// the hand-written Authentication page (api/authentication.mdx).
function linkAuthenticationPage(source) {
  return source.replace(/^info_path: .*$/m, `info_path: ${API_ROUTE}/authentication`);
}

// The request panel ("Try it") reads the compressed `api:` front matter, and
// pre-fills its fields from the spec's example and default values: parameters
// (including an example organization ID and paging cursors) and a request body
// sampled from the schema. A reader who clicks Send without editing would send
// those values to their live organization. The panel starts empty instead; the
// examples stay on the page, which renders from the separate JSON files.
function stripParameter(parameter) {
  const { example, examples, ...rest } = parameter;
  if (rest.schema) {
    const { default: _default, example: _example, examples: _examples, ...schema } = rest.schema;
    rest.schema = schema;
  }
  return rest;
}

function emptyTryIt(source) {
  return source.replace(/^api: (.+)$/m, (line, encoded) => {
    const api = JSON.parse(zlib.inflateSync(Buffer.from(encoded, 'base64')).toString());
    if (Array.isArray(api.parameters)) api.parameters = api.parameters.map(stripParameter);
    delete api.jsonRequestBodyExample;
    for (const media of Object.values(api.requestBody?.content ?? {})) {
      delete media.schema;
      delete media.example;
      delete media.examples;
    }
    return `api: ${zlib.deflateSync(JSON.stringify(api)).toString('base64')}`;
  });
}

// The page description is plain text in link previews, search results and the
// Credentials page's cards, where Markdown backticks show up literally.
function plainDescription(source) {
  return source.replace(/^description: "(.*)"$/m, (line, text) => `description: "${text.replace(/`/g, '')}"`);
}

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith('.api.mdx')) continue;
  const fullPath = path.join(dir, file);
  const source = fs.readFileSync(fullPath, 'utf8');
  const processed = plainDescription(emptyTryIt(linkAuthenticationPage(source)));
  if (processed !== source) fs.writeFileSync(fullPath, processed);
}
