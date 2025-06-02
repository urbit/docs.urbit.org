# Agent

**Agents** are the main kind of userspace application on Urbit. They have a persistent state and API that handles events and produces effects. Agents are managed by the [Gall](gall.md) [vane](vane.md) (kernel module). Agents are sometimes just called "apps", though that is a little ambiguous as a single app installed in Landscape may have multiple agents working together in the background.

Gall agents can variously be treated as databases with developer-defined logic, services, daemons, or a kind of state machine.

### Further Reading {#further-reading}

- [App School](../build-on-urbit/app-school): A comprehensive guide to writing Gall agents.
