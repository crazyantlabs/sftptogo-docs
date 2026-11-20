// Runs after `docusaurus gen-api-docs` (see the gen-api-docs script).
//
// docusaurus-plugin-openapi-docs builds each operation page's `info_path` as
// <routeBasePath>/<outputDir relative to the docs folder>/<info page id>. Our
// output folder is the docs instance's own folder, so the middle segment is
// empty and the path comes out as `api//<id>`. The theme turns it into the
// link to the introduction's Authentication section on every operation page,
// which then points at a URL that does not exist.

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'api');

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith('.api.mdx')) continue;
  const fullPath = path.join(dir, file);
  const source = fs.readFileSync(fullPath, 'utf8');
  const fixed = source.replace(/^info_path: (.*)$/m, (_, p) => `info_path: ${p.replace(/\/{2,}/g, '/')}`);
  if (fixed !== source) fs.writeFileSync(fullPath, fixed);
}
