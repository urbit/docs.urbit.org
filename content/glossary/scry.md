# Scry

A **scry** is a read-only request to the namespace of a local [vane](vane.md) or [agent](agent.md). In [Hoon](hoon.md), scries are performed with the `.^` [rune](rune.md). Unlike other kinds of inter-vane or inter-agent communications, scries cannot alter the state of the ship or produce other side-effects. Additionally, scries are an exception to the purity of Hoon functions, and can be performed in-line. The scry interface is also exposed through [Eyre](eyre.md), the web-server vane, to web clients.

#### Further Reading

- [Scry reference](../system/kernel/arvo/guides/scry.md): developer documentation of how scries work and how to use them.
