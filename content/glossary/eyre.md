# Eyre

**Eyre** is the web-server [vane](urbit-docs/glossary/vane) (kernel module) that handles client-facing HTTP operations. Unix sends HTTP messages though to Eyre and Eyre produces HTTP messages in response. It is the counterpart to [Iris](urbit-docs/glossary/iris), which is the server-facing HTTP vane.

In general, apps and vanes do not call Eyre; rather, Eyre calls apps and vanes. Eyre uses [Gall](urbit-docs/glossary/gall) to facilitate communication with apps.

Eyre is located at `/base/sys/vane/eyre.hoon` within [Arvo](urbit-docs/glossary/arvo).

### Further Reading

- [The Eyre tutorial](urbit-docs/system/kernel/eyre): A technical guide to the Eyre vane.
