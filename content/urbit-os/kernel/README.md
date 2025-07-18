---
description: "API documentation and guides for the Urbit OS kernel and its modules Ames, Behn, Clay, Dill, Eyre, Gall, Iris, Jael, Khan, and Lick."
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

# Kernel

Guides and API documentation for the Urbit OS kernel, including Arvo and the various modules.

- [Arvo](arvo) - The kernel itself. Implements the event loop and otherwise acts as air-traffic-control between the modules.
- [Ames](ames) - Ames is the name of our encrypted peer-to-peer networking protocol and the module that communicates over it.
- [Behn](behn) - Timer module. Allows Urbit OS and third-party applications to set and respond to timer events.
- [Clay](clay) - Revision-controlled filesystem.
- [Dill](dill) - Terminal driver. The Urbit runtime sends keyboard events to Dill from the terminal, and Dill produces terminal output.
- [Eyre](eyre) - HTTP server. The runtime sends HTTP requests to Eyre, and Eyre forms HTTP responses.
- [Gall](gall) - A framework for running state machines and third-party applications.
- [Iris](iris) - HTTP client.
- [Jael](jael) - Manages networking keys and Azimuth state.
- [Khan](khan) - Thread dispatcher, the kernel's alternative to spider.
- [Lick](lick) - IPC module for communicating with processes on the host machine.
