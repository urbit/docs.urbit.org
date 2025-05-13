# Scry

A **scry** is a read-only request to the namespace of a local [vane](vane) or [agent](agent). In [Hoon](hoon), scries are performed with the `.^` [rune](rune). Unlike other kinds of inter-vane or inter-agent communications, scries cannot alter the state of the ship or produce other side-effects. Additionally, scries are an exception to the purity of Hoon functions, and can be performed in-line. The scry interface is also exposed through [Eyre](eyre), the web-server vane, to web clients.

#### Further Reading

- [Scry reference](../system/kernel/arvo/guides/scry): developer documentation of how scries work and how to use them.
