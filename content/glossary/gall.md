# Gall

**Gall** is the application-management [vane](vane.md) (kernel module). Userspace apps –⁠ daemons, really –⁠ are started, stopped, and sandboxed by Gall. Gall provides developers with a consistent interface for connecting their app to [Arvo](arvo.md). It allows applications and other vanes to send messages to applications and subscribe to data streams. Messages coming into Gall are routed to the intended application, and the response comes back along the same route. If the intended target is on another [ship](ship.md), Gall will route it behind the scenes through [Ames](ames.md) to the other ship.

Gall is located at `/base/sys/vane/gall.hoon` within Arvo.

### Further Reading

- [App School](../courses/app-school): Our guide to learning how to build apps on the Urbit platform using the Hoon programming language.
- [Gall vane documentation](../system/kernel/gall): Documentation of the Gall vane.
