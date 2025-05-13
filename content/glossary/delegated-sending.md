# Delegated Sending

The **Delegated Sending** [Azimuth](azimuth) contract is a way that a [star](star ) distributes [L1](azimuth) [planets](planet). After a star configures the Delegated Sending contract as its [spawn proxy](proxies) it can give invites to planets, and those invitees can subsequently send additional planets from that star to their friends, and pass on this invite power indefinitely. This contract keeps track of those operations in the form of the [Invite Tree](invite-tree), so the relationship between inviters and invitees is publicly known.

With the introduction of the [L2](rollups) invite system, delegated sending is less commonly used.
