const fs = require('fs');
const path = require('path');

// Ketch consent management for Segment.
//
// docusaurus-plugin-segment renders the Segment snippet with `load: false`; this plugin
// must be listed after it so that its head tags land after the snippet: the Ketch tag,
// then segment-consent.html, which loads Segment once Ketch reports consent (the same
// snippet as on sftptogo.com/free-trial and the Auth0 login page).
const KETCH_TAG =
  '<script>!function(){window.semaphore=window.semaphore||[],window.ketch=function(){window.semaphore.push(arguments)};var e=document.createElement("script");e.type="text/javascript",e.src="https://global.ketchcdn.com/web/v3/config/crazy_ant_labs/sftp_to_go/boot.js",e.defer=e.async=!0,document.getElementsByTagName("head")[0].appendChild(e)}();</script>';

module.exports = function segmentConsent(context, { writeKey }) {
  const segmentConsentTag = fs
    .readFileSync(path.join(__dirname, 'segment-consent.html'), 'utf8')
    .replace('"__SEGMENT_WRITE_KEY__"', () => JSON.stringify(writeKey));

  return {
    name: 'segment-consent',

    injectHtmlTags() {
      // Matches docusaurus-plugin-segment, which only renders the snippet in production builds.
      if (process.env.NODE_ENV !== 'production') {
        return {};
      }
      return {
        headTags: [KETCH_TAG, segmentConsentTag],
      };
    },
  };
};
