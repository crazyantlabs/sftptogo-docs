const fs = require('fs');
const path = require('path');

// Ketch consent management for Segment.
//
// docusaurus-plugin-segment renders the Segment snippet with `load: false`; this plugin
// must be listed after it so that its head tags land after the snippet: the Ketch tag,
// the consent gate (identical to the copies on sftptogo.com and the Auth0 login page),
// then analytics.load(), which the gate holds until Ketch reports consent.
const KETCH_TAG =
  '<script>!function(){window.semaphore=window.semaphore||[],window.ketch=function(){window.semaphore.push(arguments)};var e=document.createElement("script");e.type="text/javascript",e.src="https://global.ketchcdn.com/web/v3/config/crazy_ant_labs/website_smart_tag/boot.js",e.defer=e.async=!0,document.getElementsByTagName("head")[0].appendChild(e)}();</script>';

module.exports = function segmentConsent(context, { writeKey }) {
  const consentGate = fs.readFileSync(path.join(__dirname, 'consent-gate.html'), 'utf8');

  return {
    name: 'segment-consent',

    injectHtmlTags() {
      // Matches docusaurus-plugin-segment, which only renders the snippet in production builds.
      if (process.env.NODE_ENV !== 'production') {
        return {};
      }
      return {
        headTags: [
          KETCH_TAG,
          consentGate,
          {
            tagName: 'script',
            innerHTML: `analytics.load(${JSON.stringify(writeKey)});`,
          },
        ],
      };
    },
  };
};
