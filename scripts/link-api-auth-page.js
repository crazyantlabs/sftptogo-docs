// Runs after `docusaurus gen-api-docs` (see the gen-api-docs script).
//
// The theme turns each operation page's `info_path` front matter into the link
// in its Authorization box (`/<info_path>#authentication`). The generator
// points it at the introduction page, and writes it before any page generator
// can change it. Authentication has a page of its own (api/authentication.md),
// so every operation page is pointed there instead.

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'api');

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith('.api.mdx')) continue;
  const fullPath = path.join(dir, file);
  const source = fs.readFileSync(fullPath, 'utf8');
  const linked = source.replace(/^info_path: .*$/m, 'info_path: api/authentication');
  if (linked !== source) fs.writeFileSync(fullPath, linked);
}
