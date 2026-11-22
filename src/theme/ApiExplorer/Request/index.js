import React from 'react';
import Request from '@theme-original/ApiExplorer/Request';
import Admonition from '@theme/Admonition';

// The request panel on API reference pages sends real requests. Warn above it
// that they run against the reader's live organization, and on anything but a
// read that the request can change real data for good.
const READ_METHODS = ['get', 'head', 'options'];

export default function RequestWithWarning(props) {
  const method = props.item?.method?.toLowerCase();
  const writes = Boolean(method) && !READ_METHODS.includes(method);
  return (
    <>
      <Admonition type="warning" title="Live organization">
        Requests you send from this panel run against your live organization.
        {writes && ' This one can create, change or delete real data, and that can’t be undone.'}
      </Admonition>
      <Request {...props} />
    </>
  );
}
