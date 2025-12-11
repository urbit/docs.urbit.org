---
description: "Troubleshooting guide for common issues with the Bridge web application for Urbit ID management."
layout:
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# Bridge Troubleshooting

This page covers common issues encountered with the [Bridge](https://bridge.urbit.org) application. If you are having trouble, please ensure you are using a recommended browser (either Chrome or Brave) and a supported wallet connection. If you still encounter issues, send us an email at support@urbit.org and we will point you in the right direction.

### Canvas Issues {#canvas-issues}

Bridge uses an HTML element called canvas to create your wallets. Unfortunately malicious websites can use canvas to identify and track users. As a result, some browsers and anti-tracking extensions can interfere with Bridge's ability to generate wallets. 

If there are no instructions for your browser, or the instructions don't work, please file a ticket on the [issue tracker](https://github.com/urbit/bridge/issues)

#### Brave Users

To fix canvas issues on Brave:

- Click on the Brave logo on the right edge of your URL bar
- Click `Advanced View`
- Set the bottom dropdown to `Cross-site device recognition blocked`
- Click on Retry in Bridge

The warning box should disappear.

