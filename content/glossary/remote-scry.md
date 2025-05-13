# Scry {#scry}

A **remote scry** is a read-only request to the namespace of a remote [vane](vane.md) or [agent](agent.md). These differ from ordinary [local scries](scry.md) and are not performed with the `.^` [rune](rune.md).

Remote scries reduce event log bloat on the publishing ship, allow the publisher's runtime to cache data, and especially improve performance when publishing the same data for many ships to retrieve.

At the the time of writing, Gall allows agents to bind data to remote scry paths and perform remote scries with `task`s to [Ames](ames.md). Additionally, Clay uses remote scries internally to sync remote desks.

#### Further Reading {#further-reading}

- [Remote scry guide](../userspace/apps/guides/remote-scry.md): developer documentation of how remote scries work and how to use them.
