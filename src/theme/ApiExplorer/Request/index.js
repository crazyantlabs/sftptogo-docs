import React from 'react';
import Request from '@theme-original/ApiExplorer/Request';
import Admonition from '@theme/Admonition';

// The request panel on API reference pages sends real requests. Warn above it
// that they run against the reader's live organization, and that a write
// operation (anything but a read) changes real data for good.
const READ_METHODS = ['get', 'head', 'options'];

export default function RequestWithWarning(props) {
  const method = props.item?.method?.toLowerCase();
  const writes = Boolean(method) && !READ_METHODS.includes(method);
  return (
    <>
      <Admonition type="warning" title="Live organization">
        Requests you send from this panel run against your live organization.
        {writes && ' This one creates, changes or deletes real data, and can’t be undone.'}
      </Admonition>
      <Request {...props} />
    </>
  );
}
