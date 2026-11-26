import React, { useEffect, useRef, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import assistants from './assistants';
import styles from './styles.module.css';

// "Explore with AI": a menu that opens the page in an AI assistant with a
// ready-made prompt, and copies the page as Markdown.
//
//   <ExploreWithAI prompt="Read https://…, and help me …" markdownUrl="/docs/api/x.md" />
//
// - prompt: the text sent to the assistant; it should name the page's public URL.
// - markdownUrl: optional; where the page's Markdown copy is served. Without it
//   the copy item is left out.
//
// Clicks send the homepage's Segment event, `Ask AI Clicked` with `assistant`
// and `language`, plus `page` (the path it came from). Segment loads only with
// the visitor's consent (plugins/segment-consent); until then calls queue.
// Shown at the foot of the menu: what never to share with an assistant.
const PRIVACY_NOTE = "Don't paste API keys, passwords or customer data into an assistant.";

function track(assistant, language) {
  if (typeof window === 'undefined' || !window.analytics) return;
  window.analytics.track('Ask AI Clicked', { assistant, language, page: window.location.pathname });
}

export default function ExploreWithAI({ prompt, markdownUrl }) {
  const { i18n } = useDocusaurusContext();
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState('idle');
  const root = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (root.current && !root.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Safari only lets a click write to the clipboard straight away, so where the
  // browser supports it the write starts at once with the fetch as a promise.
  const copyMarkdown = async () => {
    const text = fetch(markdownUrl).then((response) => {
      if (!response.ok) throw new Error(String(response.status));
      return response.text();
    });
    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
        const blob = text.then((value) => new Blob([value], { type: 'text/plain' }));
        await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })]);
      } else {
        await navigator.clipboard.writeText(await text);
      }
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    setTimeout(() => setCopyState('idle'), 2500);
  };

  const encoded = encodeURIComponent(prompt);
  const copyLabel = { idle: 'Copy page as Markdown', copied: 'Copied', failed: "Couldn't copy the page" }[copyState];

  return (
    <div className={styles.root} ref={root}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Explore with AI
        <svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      {open && (
        <ul className={styles.menu} role="menu">
          {markdownUrl && (
            <li role="none">
              <button type="button" role="menuitem" className={styles.item} onClick={copyMarkdown}>
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"
                  />
                </svg>
                <span aria-live="polite">{copyLabel}</span>
              </button>
            </li>
          )}
          {assistants.map((assistant) => (
            <li role="none" key={assistant.name}>
              <a
                role="menuitem"
                className={styles.item}
                href={`${assistant.url}${encoded}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track(assistant.name, i18n.currentLocale);
                  setOpen(false);
                }}
              >
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d={assistant.path} />
                </svg>
                <span>Open in {assistant.name}</span>
              </a>
            </li>
          ))}
          <li role="none" className={styles.note}>
            {PRIVACY_NOTE}
          </li>
        </ul>
      )}
    </div>
  );
}
