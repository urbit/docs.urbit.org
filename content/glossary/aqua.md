# Aqua {#aqua}

**Aqua** is something like Docker but for Urbit; it is a virtualization tool whose primary purpose is testing and development.

Aqua is a [Gall](gall.md) app that runs an [Arvo](arvo.md) instance or instances in userspace. It pretends to be [Vere](vere.md), and as such it loads [pills](pill.md) to boot up a virtual ship or fleet of ships and then manages them from within the parent Arvo instance. Running tests for a virtual fleet of Aqua ships is done using [pH](ph.md).

Aqua is jetted with the usual [Nock](nock.md) interpreter and thus virtual ships do not run any slower than the parent ship.
