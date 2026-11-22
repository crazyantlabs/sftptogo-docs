<a href="https://sftptogo.com/"><img alt="SFTP To Go logo" src="https://sftptogo.com/images/logo.svg" height="80" /></a>

_SFTP To Go: Managed cloud storage as a Service_

*Secure cloud storage with SFTP / FTPS / S3 / HTTP file access designed for smooth and easy data transfer and storage.*

SFTP To Go Documentation
========================

Documentation for [SFTP To Go](https://sftptogo.com).

[![Deploy](https://github.com/crazyantlabs/sftptogo-docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/crazyantlabs/sftptogo-docs/actions/workflows/deploy.yml)

# Introduction

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

Like `yarn start`, it reads `URL`, `BASE_PATH`, `SEGMENT_WRITE_KEY` and the `ALGOLIASEARCH_*` variables from the environment or a `.env` file (see `.env.example`). Any non-empty value works locally; CI builds with `URL=https://sftptogo.com`, `BASE_PATH=docs/` and placeholders for the rest.

### API reference

The API reference at `/docs/api/` is generated from the bundled OpenAPI spec of the Management API. To update it:

1. Bundle the spec in the api repo (`npm run openapi-bundle`) and copy the bundle over `static/openapi/management.yaml`.
2. Regenerate the pages (this needs the same environment as `yarn build`):

   ```
   $ yarn gen-api-docs
   ```

3. Commit the spec together with the regenerated files in `api/`. Never edit the generated files by hand: fix the spec instead.

`yarn gen-api-docs` renders the introduction with `scripts/api-info-page.mustache` (served at `/docs/api/introduction`) and operation pages through `scripts/api-page-markdown.js`, which adds a box with a link to the pricing page when an operation has an `x-plan` extension in the spec. It then runs `scripts/postprocess-api-docs.js`, which points each operation's Authorization box at the Authentication page, empties the request panel's pre-filled example values (so nothing is sent unless the reader types it), and strips Markdown from page descriptions. `api/authentication.mdx` is written by hand and survives regeneration; `sidebarsApi.js` places it after the introduction.

### Deployment

This site is deployed when merged to upstream main branch using GitHub actions.
