# Behn

**Behn** is the timing [vane](vane.md) (kernel module). It allows for applications to schedule events, which are managed in a simple priority queue. For example, [Clay](clay.md), the Urbit filesystem, uses Behn to keep track of time-specific file requests. [Eyre](eyre.md), the Urbit web vane, uses Behn for timing-out HTTP sessions.

Behn is located in `/base/sys/vane/behn.hoon` within [Arvo](arvo.md).

### Further Reading {#further-reading}

- [The Behn reference](../urbit-os/kernel/behn): A technical guide to the Behn vane.
