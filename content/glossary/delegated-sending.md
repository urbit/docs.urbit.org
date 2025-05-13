# Delegated Sending

The **Delegated Sending** [Azimuth](azimuth.md) contract is a way that a [star](star .md) distributes [L1](azimuth.md) [planets](planet.md). After a star configures the Delegated Sending contract as its [spawn proxy](proxies.md) it can give invites to planets, and those invitees can subsequently send additional planets from that star to their friends, and pass on this invite power indefinitely. This contract keeps track of those operations in the form of the [Invite Tree](invite-tree.md), so the relationship between inviters and invitees is publicly known.

With the introduction of the [L2](rollups.md) invite system, delegated sending is less commonly used.
