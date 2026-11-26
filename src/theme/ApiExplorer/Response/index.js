import React from 'react';
import Response from '@theme-original/ApiExplorer/Response';
import Admonition from '@theme/Admonition';
import { translate } from '@docusaurus/Translate';
import { useTypedSelector } from '@theme/ApiItem/hooks';

// When a request fails before any status code arrives (a network error, or a
// response the browser blocks because it carries no CORS headers, such as a
// gateway 5xx), the theme stores its error message but shows only its idle
// prompt, as if nothing had been sent. Say that the request didn't complete,
// and why, above the panel.
export default function ResponseWithFailure(props) {
  const message = useTypedSelector((state) => state.response.value);
  const code = useTypedSelector((state) => state.response.code);
  const fetching = translate({ id: 'theme.openapi.request.fetchingMessage', message: 'Fetching...' });
  const failed = Boolean(message) && !code && message !== fetching;
  return (
    <>
      {failed && (
        <Admonition type="danger" title="The request didn't complete">
          <p>{message}</p>
          <p>
            The browser got no response it could read, so there's no status code to show. This
            happens when the network fails, when the API returns a server error, or when the request
            is sent from anywhere but sftptogo.com.
          </p>
        </Admonition>
      )}
      <Response {...props} />
    </>
  );
}
