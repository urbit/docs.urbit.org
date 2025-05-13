# Lick

**Lick** is the interprocess communication (IPC) [vane](urbit-docs/glossary/vane) (kernel module). It allows for applications to open and close IPC ports to earth. For example, a [Gall](urbit-docs/glossary/gall) agent can send a `%spin` card to open an IPC port and allow for an earth process to communicate with it through `%spit` and `%soak` cards. 

Lick is located in `/base/sys/vane/lick.hoon` within [Arvo](urbit-docs/glossary/arvo).

### Further Reading

- [The Lick reference](urbit-docs/system/kernel/lick): A technical guide to the Lick vane.
