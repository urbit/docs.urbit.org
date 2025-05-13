# Scry

A **remote scry** is a read-only request to the namespace of a remote [vane](urbit-docs/glossary/vane) or [agent](urbit-docs/glossary/agent). These differ from ordinary [local scries](urbit-docs/glossary/scry) and are not performed with the `.^` [rune](urbit-docs/glossary/rune).

Remote scries reduce event log bloat on the publishing ship, allow the publisher's runtime to cache data, and especially improve performance when publishing the same data for many ships to retrieve.

At the the time of writing, Gall allows agents to bind data to remote scry paths and perform remote scries with `task`s to [Ames](urbit-docs/glossary/ames). Additionally, Clay uses remote scries internally to sync remote desks.

#### Further Reading

- [Remote scry guide](urbit-docs/userspace/apps/guides/remote-scry): developer documentation of how remote scries work and how to use them.
