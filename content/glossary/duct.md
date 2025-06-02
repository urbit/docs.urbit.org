# Duct

[Arvo](arvo.md) is designed to avoid the usual state of complex event networks: event spaghetti. It keeps track of every event's cause so that is has a clear causal chain for every computation. At the bottom of every chain is a Unix I/O event, such as a network request, terminal input, file sync, or timer event. It pushes every step in the path the request takes onto the chain until it gets to the terminal cause of the computation. Then it uses this causal stack to route results back to the caller.

The Arvo causal stack is called a **duct**. This is represented simply as a list of [paths](path.md), where each path represents a step in the causal chain. The first element in the path is the first letter of whichever [vane](vane.md) handled that step in the computation, or an empty element for Unix.

### Further Reading {#further-reading}

- [Arvo overview](../urbit-os/kernel): technical details of how Arvo works.
