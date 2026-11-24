import React from 'react';
import DocBreadcrumbs from '@theme-original/DocBreadcrumbs';
import { useActivePlugin, useDoc } from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ExploreWithAI from '@theme/ExploreWithAI';
import { API_DOCS_ID, markdownCopyPath } from '@site/scripts/api-reference';
import styles from './styles.module.css';

// On API reference pages (the `api` docs instance), the breadcrumb row also
// holds the Explore with AI menu. Guide pages are unchanged.
function ApiPageTools() {
  const { siteConfig } = useDocusaurusContext();
  const { metadata, frontMatter } = useDoc();
  const pageUrl = `${siteConfig.url}${metadata.permalink}`;
  const prompt = frontMatter.api
    ? `Read ${pageUrl}, the SFTP To Go API reference for ${metadata.title}, and help me call it from my code.`
    : `Read ${pageUrl}, the SFTP To Go API reference page on ${metadata.title}, and help me use the API from my code.`;
  return <ExploreWithAI prompt={prompt} markdownUrl={markdownCopyPath(metadata.permalink)} />;
}

export default function DocBreadcrumbsWrapper(props) {
  const plugin = useActivePlugin();
  if (plugin?.pluginId !== API_DOCS_ID) return <DocBreadcrumbs {...props} />;
  return (
    <div className={styles.row}>
      <DocBreadcrumbs {...props} />
      <ApiPageTools />
    </div>
  );
}
