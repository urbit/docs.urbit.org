# Behn

**Behn** is the timing [vane](vane) (kernel module). It allows for applications to schedule events, which are managed in a simple priority queue. For example, [Clay](clay), the Urbit filesystem, uses Behn to keep track of time-specific file requests. [Eyre](eyre), the Urbit web vane, uses Behn for timing-out HTTP sessions.

Behn is located in `/base/sys/vane/behn.hoon` within [Arvo](arvo).

### Further Reading

- [The Behn reference](../system/kernel/behn): A technical guide to the Behn vane.
