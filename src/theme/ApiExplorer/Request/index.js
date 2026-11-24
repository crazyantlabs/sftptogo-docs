import React from 'react';
import Request from '@theme-original/ApiExplorer/Request';
import Admonition from '@theme/Admonition';

// The request panel on API reference pages sends real requests with the key
// the reader pastes. Warn above it that they act on the live organization with
// the key's full access, that a request other than a read can change real data
// for good, that the key isn't kept, and that responses can show passwords.
const READ_METHODS = ['get', 'head', 'options'];

export default function RequestWithWarning(props) {
  const method = props.item?.method?.toLowerCase();
  const writes = Boolean(method) && !READ_METHODS.includes(method);
  return (
    <>
      <Admonition type="warning" title="Live organization">
        <p>
          Requests you send from this panel run against your live organization, with your key&apos;s full access.
          {writes && ' This request can create, change or delete real data, and that can’t be undone.'}
        </p>
        <p>
          The key stays on this page only: it isn&apos;t saved, and it&apos;s gone when you leave. Responses can show
          passwords in clear text, so don&apos;t use the panel on a shared or untrusted computer.
        </p>
      </Admonition>
      <Request {...props} />
    </>
  );
}
