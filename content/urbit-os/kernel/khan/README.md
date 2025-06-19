---
description: Guide to Khan, Arvo's thread-runner vane.
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

# Khan

Khan is Arvo's thread-runner module. Its main purpose is to provide an interface for running [threads](../../base/threads) that can be used by Urbit apps, Arvo itself, or external applications using a Unix socket.

At this stage, Khan's external interface is still experimental and there are not yet proper libraries for other languages that can make use of it. Therefore, the current documentation only touches on Khan's internal interface for the rest of Arvo. Khan's internal interface provides a more ergonomic way for Arvo and Urbit apps to run threads than using [Spider](../../base/threads/api.md).
