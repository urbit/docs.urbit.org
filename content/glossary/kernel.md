+++
title = "Kernel"

[extra]
category = "arvo"

[glossaryEntry.kernel]
name = "kernel"
symbol = ""
usage = "arvo"
desc = "The core components of an operating system; Arvo and its vanes in Urbit."

+++

The **kernel** is the core, fundamental components of an operating system. In
the case of [Arvo](/glossary/arvo), it is `arvo.hoon`, its
[vanes](/glossary/vane) (kernel modules), and associated libraries.
The code for Arvo's kernel is located in the `/sys` directory of the `%base`
[desk](/glossary/desk). "Kernelspace" is contrasted with "userspace",
which includes [agents](/glossary/agent),
[threads](/glossary/thread),
[generators](/glossary/generator), front-end resources and other
non-kernel files in [Clay](/glossary/clay).

#### Further reading

- [Arvo overview](/system/kernel): Technical overview of Arvo.
