const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const kebabCase = require('lodash/kebabCase');

const { planText } = require('../../scripts/api-page-markdown');

// Writes a Markdown copy of every API reference page next to it in the build,
// so `/docs/api/<page>` is also served as `/docs/api/<page>.md`. Agents fetch
// these, and the "Copy page as Markdown" item in the Explore with AI menu
// copies them. They are built from the same sources as the pages: the bundled
// spec for the introduction, tag and operation pages, and the hand-written
// files in api/ for the guides.

const METHODS = ['get', 'put', 'post', 'patch', 'delete', 'head', 'options', 'trace'];

function createResolver(spec) {
  const resolve = (node, seen = new Set()) => {
    if (Array.isArray(node)) return node.map((item) => resolve(item, seen));
    if (!node || typeof node !== 'object') return node;
    if (typeof node.$ref === 'string' && node.$ref.startsWith('#/')) {
      if (seen.has(node.$ref)) return { description: `See ${node.$ref.split('/').pop()}.` };
      const target = node.$ref
        .slice(2)
        .split('/')
        .reduce((value, key) => (value ? value[key.replace(/~1/g, '/').replace(/~0/g, '~')] : undefined), spec);
      const { $ref, ...siblings } = node;
      return resolve({ ...target, ...siblings }, new Set([...seen, node.$ref]));
    }
    return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, resolve(value, seen)]));
  };
  return resolve;
}

function oneLine(text) {
  return (text || '').trim().replace(/\s*\n\s*/g, ' ');
}

function typeOf(input) {
  const schema = withoutNull(input);
  if (!schema) return 'any';
  if (schema.nullable && schema !== input) return `${typeOf({ ...schema, nullable: undefined })} or null`;
  if (Array.isArray(schema.type)) return schema.type.join(' or ');
  if (schema.type === 'array') return `array of ${typeOf(schema.items)}`;
  if (schema.type) return schema.format ? `${schema.type} (${schema.format})` : schema.type;
  const variants = schema.oneOf || schema.anyOf;
  if (variants) return variants.map(typeOf).join(' or ');
  if (schema.properties) return 'object';
  return 'any';
}

function constraints(schema) {
  if (!schema) return [];
  const notes = [];
  if (schema.enum) notes.push(`One of: ${schema.enum.map((value) => `\`${value}\``).join(', ')}.`);
  if (schema.default !== undefined) notes.push(`Default: \`${JSON.stringify(schema.default)}\`.`);
  if (schema.minLength !== undefined) notes.push(`At least ${schema.minLength} characters.`);
  if (schema.maxLength !== undefined) notes.push(`At most ${schema.maxLength} characters.`);
  if (schema.minimum !== undefined) notes.push(`Minimum ${schema.minimum}.`);
  if (schema.maximum !== undefined) notes.push(`Maximum ${schema.maximum}.`);
  if (schema.pattern) notes.push(`Pattern: \`${schema.pattern}\`.`);
  return notes;
}

// A nullable value written as anyOf/oneOf [X, null] is listed as X.
function withoutNull(schema) {
  const variants = schema && (schema.anyOf || schema.oneOf);
  if (!variants) return schema;
  const real = variants.filter((variant) => variant.type !== 'null');
  if (real.length !== 1 || real.length === variants.length) return schema;
  const { anyOf, oneOf, ...outer } = schema;
  return { ...real[0], ...outer, nullable: true };
}

function merged(input) {
  const schema = withoutNull(input);
  if (!schema || !schema.allOf) return schema;
  return schema.allOf.reduce(
    (all, part) => {
      const piece = merged(part) || {};
      return {
        ...all,
        ...piece,
        properties: { ...all.properties, ...piece.properties },
        required: [...(all.required || []), ...(piece.required || [])],
      };
    },
    { ...schema, allOf: undefined, properties: { ...schema.properties }, required: [...(schema.required || [])] },
  );
}

// A bullet list of an object's fields, nested for objects and arrays of objects.
function fieldList(schema, depth = 0) {
  const object = merged(schema);
  if (!object) return [];
  const target = object.type === 'array' ? merged(object.items) : object;
  if (!target) return [];
  const indent = '  '.repeat(depth);
  if (!target.properties && !isObject(target.additionalProperties)) {
    const variants = target.oneOf || target.anyOf;
    if (!variants) return [];
    return variants.flatMap((variant, index) => [
      `${indent}- Option ${index + 1}${variant.title ? ` (${variant.title})` : ''}, ${typeOf(variant)}: ${oneLine(variant.description)}`.trimEnd(),
      ...fieldList(variant, depth + 1),
    ]);
  }
  const required = new Set(target.required || []);
  const lines = Object.entries(target.properties || {}).flatMap(([name, property]) => {
    const field = merged(property);
    const text = [oneLine(field.description), ...constraints(field)].filter(Boolean).join(' ');
    const line = `${indent}- \`${name}\` (${typeOf(property)}, ${required.has(name) ? 'required' : 'optional'})${text ? `: ${text}` : ''}`;
    return [line, ...(hasFields(field) ? fieldList(field, depth + 1) : [])];
  });
  // Properties not named in the schema, such as one entry per rejected field.
  if (isObject(target.additionalProperties)) {
    const extra = merged(target.additionalProperties);
    const text = [oneLine(extra.description), ...constraints(extra)].filter(Boolean).join(' ');
    lines.push(`${indent}- Any other property (${typeOf(target.additionalProperties)})${text ? `: ${text}` : ''}`);
    if (hasFields(extra)) lines.push(...fieldList(extra, depth + 1));
  }
  return lines;
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

// Whether a field has sub-fields worth listing under it.
function hasFields(field) {
  if (!field) return false;
  const variants = field.oneOf || field.anyOf;
  return Boolean(
    field.type === 'object' ||
      field.properties ||
      isObject(field.additionalProperties) ||
      (field.type === 'array' && field.items) ||
      field.allOf ||
      (variants && variants.some((variant) => hasFields(merged(variant)) || variant.type === 'array')),
  );
}

function firstExample(media) {
  if (!media) return undefined;
  if (media.example !== undefined) return media.example;
  const examples = Object.values(media.examples || {});
  return examples.length ? examples[0].value : undefined;
}

function jsonBlock(value) {
  return ['```json', JSON.stringify(value, null, 2), '```'];
}

function operationMarkdown({ operation, method, route, server, pageUrl, link }) {
  const lines = [`# ${operation.summary}`, '', `\`${method.toUpperCase()} ${server}${route}\``, ''];
  if (operation.description) lines.push(operation.description.trim(), '');
  const xPlan = operation['x-plan'];
  if (xPlan !== undefined && xPlan !== null) lines.push(`> ${planText(xPlan)}`, '');
  const paged = (operation.parameters || []).some((p) => p.in === 'query' && (p.name === 'after' || p.name === 'before'));
  if (paged) lines.push(`This list is paged: pass \`limit\` and follow the \`Link\` header. See [Pagination](${link('pagination')}).`, '');
  lines.push(`Authenticate with your API key as a bearer token: see [Authentication](${link('authentication')}).`, '');

  for (const location of ['path', 'query', 'header']) {
    const parameters = (operation.parameters || []).filter((parameter) => parameter.in === location);
    if (!parameters.length) continue;
    lines.push(`## ${location[0].toUpperCase()}${location.slice(1)} parameters`, '');
    for (const parameter of parameters) {
      const text = [oneLine(parameter.description), ...constraints(parameter.schema)].filter(Boolean).join(' ');
      lines.push(`- \`${parameter.name}\` (${typeOf(parameter.schema)}, ${parameter.required ? 'required' : 'optional'})${text ? `: ${text}` : ''}`);
    }
    lines.push('');
  }

  const body = operation.requestBody;
  if (body && body.content) {
    for (const [type, media] of Object.entries(body.content)) {
      lines.push(`## Request body (\`${type}\`, ${body.required ? 'required' : 'optional'})`, '');
      if (body.description) lines.push(body.description.trim(), '');
      const fields = fieldList(media.schema);
      if (fields.length) lines.push(...fields, '');
      const example = firstExample(media);
      if (example !== undefined) lines.push('Example:', '', ...jsonBlock(example), '');
    }
  }

  lines.push('## Responses', '');
  for (const [status, response] of Object.entries(operation.responses || {})) {
    lines.push(`### ${status}`, '');
    if (response.description) lines.push(response.description.trim(), '');
    const headers = Object.entries(response.headers || {});
    if (headers.length) {
      lines.push('Headers:', '');
      for (const [name, header] of headers) lines.push(`- \`${name}\`: ${oneLine(header.description)}`);
      lines.push('');
    }
    for (const [type, media] of Object.entries(response.content || {})) {
      const fields = fieldList(media.schema);
      if (fields.length) lines.push(`Body (\`${type}\`):`, '', ...fields, '');
      const example = firstExample(media);
      if (example !== undefined) lines.push('Example:', '', ...jsonBlock(example), '');
    }
  }
  lines.push(`See [Errors](${link('errors')}) for the error body, the status codes and when to retry.`, '', `Source: ${pageUrl}`, '');
  return lines.join('\n');
}

// A hand-written page as plain Markdown: front matter, imports and the tab
// components go; links to other API pages point at their .md copies.
function handWrittenMarkdown(source, pageUrl, link) {
  const frontMatter = source.match(/^---\n([\s\S]*?)\n---\n/);
  const title = frontMatter ? (frontMatter[1].match(/^title:\s*(.+)$/m) || [])[1] : null;
  const body = frontMatter ? source.slice(frontMatter[0].length) : source;
  // MDX lines (imports, tab components) and links are rewritten only outside
  // fenced code, so code examples keep their own import lines.
  const converted = body
    .split(/(^```[^\n]*\n[\s\S]*?^```[ \t]*$)/m)
    .map((part) => {
      if (part.startsWith('```')) return part.replace(/^```(\w+)[^\n]*/, '```$1');
      return part
        .replace(/^import .*$\n?/gm, '')
        .replace(/^<\/?Tabs[^>]*>\s*$\n?/gm, '')
        .replace(/^<TabItem[^>]*label="([^"]+)"[^>]*>\s*$/gm, '**$1**\n')
        .replace(/^<\/TabItem>\s*$\n?/gm, '')
        .replace(/\]\(\.\/([a-z0-9-]+)(?:\.api)?\.mdx?(#[^)]*)?\)/g, (match, slug, anchor) => `](${link(slug)}${anchor || ''})`);
    })
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return `${title ? `# ${title.replace(/^"|"$/g, '')}\n\n` : ''}${converted}\n\nSource: ${pageUrl}\n`;
}

// Every name an operation page shows (schema properties, parameters, response
// headers), read from the JSON files the page renders from (api/<slug>.*.json).
function namesShownOnPage(dir, slug) {
  const names = new Set();
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;
    if (node.properties && typeof node.properties === 'object' && !Array.isArray(node.properties)) {
      Object.keys(node.properties).forEach((name) => names.add(name));
    }
    if (node.headers && typeof node.headers === 'object' && !Array.isArray(node.headers)) {
      Object.keys(node.headers).forEach((name) => names.add(name));
    }
    if (typeof node.name === 'string' && typeof node.in === 'string') names.add(node.name);
    Object.values(node).forEach(walk);
  };
  for (const part of ['ParamsDetails', 'RequestSchema', 'StatusCodes']) {
    const file = path.join(dir, `${slug}.${part}.json`);
    if (fs.existsSync(file)) walk(JSON.parse(fs.readFileSync(file, 'utf8')));
  }
  return names;
}

module.exports = function apiMarkdown(context, options) {
  const { siteDir, siteConfig } = context;
  const { specPath, docsDir, routeBasePath } = options;

  return {
    name: 'api-markdown',

    async postBuild({ outDir }) {
      const spec = yaml.load(fs.readFileSync(path.join(siteDir, specPath), 'utf8'));
      const resolve = createResolver(spec);
      const publicBase = `${siteConfig.url}${siteConfig.baseUrl}${routeBasePath}`;
      const pageUrl = (slug) => `${publicBase}/${slug}`;
      const link = (slug) => `${pageUrl(slug)}.md`;
      const server = (spec.servers && spec.servers[0] && spec.servers[0].url) || '';
      const pages = new Map();

      // Introduction (served at <routeBasePath>/introduction by its template).
      pages.set(
        'introduction',
        [
          `# ${spec.info.title}`,
          '',
          (spec.info.description || '').trim(),
          '',
          '## Authentication, errors and pagination',
          '',
          `Send your API key with every request: see [Authentication](${link('authentication')}). For the status codes and error bodies the API returns, see [Errors](${link('errors')}). List endpoints return results a page at a time: see [Pagination](${link('pagination')}).`,
          '',
          `Source: ${pageUrl('introduction')}`,
          '',
        ].join('\n'),
      );

      // Operations, and the tag pages that list them.
      const byTag = new Map();
      const operationSlugs = [];
      for (const [route, item] of Object.entries(spec.paths || {})) {
        for (const method of METHODS) {
          if (!item[method]) continue;
          const operation = resolve({ ...item[method], parameters: [...(item.parameters || []), ...(item[method].parameters || [])] });
          const slug = kebabCase(operation.operationId || operation.summary);
          operationSlugs.push(slug);
          pages.set(slug, operationMarkdown({ operation, method, route, server, pageUrl: pageUrl(slug), link }));
          for (const tag of operation.tags || []) {
            if (!byTag.has(tag)) byTag.set(tag, []);
            byTag.get(tag).push({ slug, method, route, summary: operation.summary });
          }
        }
      }
      for (const tag of spec.tags || []) {
        const operations = byTag.get(tag.name);
        if (!operations) continue;
        const slug = kebabCase(tag.name);
        pages.set(
          slug,
          [
            `# ${tag.name}`,
            '',
            (tag.description || '').trim(),
            '',
            '## Operations',
            '',
            ...operations.map((operation) => `- [${operation.summary}](${link(operation.slug)}): \`${operation.method.toUpperCase()} ${operation.route}\``),
            '',
            `Source: ${pageUrl(slug)}`,
            '',
          ].join('\n'),
        );
      }

      // Hand-written pages.
      const dir = path.join(siteDir, docsDir);
      for (const file of fs.readdirSync(dir)) {
        if (!/\.mdx?$/.test(file) || /\.(api|info|tag)\.mdx$/.test(file)) continue;
        const slug = file.replace(/\.mdx?$/, '');
        pages.set(slug, handWrittenMarkdown(fs.readFileSync(path.join(dir, file), 'utf8'), pageUrl(slug), link));
      }

      // Every copy must sit next to a page the site built, and no API page may
      // go without a copy.
      const builtDir = path.join(outDir, routeBasePath);
      const built = fs
        .readdirSync(builtDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(builtDir, entry.name, 'index.html')))
        .map((entry) => entry.name);
      const missingPages = [...pages.keys()].filter((slug) => !built.includes(slug));
      const missingCopies = built.filter((slug) => !pages.has(slug));
      if (missingPages.length || missingCopies.length) {
        throw new Error(
          `api-markdown: Markdown copies and API pages disagree. No page for: ${missingPages.join(', ') || 'none'}. No copy for: ${missingCopies.join(', ') || 'none'}.`,
        );
      }
      // Each operation's copy must name every field its page shows.
      const missingFields = [];
      for (const slug of operationSlugs) {
        const markdown = pages.get(slug);
        for (const name of namesShownOnPage(dir, slug)) {
          if (!markdown.includes(`\`${name}\``)) missingFields.push(`${slug}: ${name}`);
        }
      }
      if (missingFields.length) {
        throw new Error(`api-markdown: fields shown on a page are missing from its Markdown copy: ${missingFields.join('; ')}.`);
      }
      for (const [slug, markdown] of pages) fs.writeFileSync(path.join(builtDir, `${slug}.md`), markdown);
    },
  };
};
