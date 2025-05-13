# Delegated Sending

The **Delegated Sending** [Azimuth](urbit-docs/glossary/azimuth) contract is a way that a [star](urbit-docs/glossary/star ) distributes [L1](urbit-docs/glossary/azimuth) [planets](urbit-docs/glossary/planet). After a star configures the Delegated Sending contract as its [spawn proxy](urbit-docs/glossary/proxies) it can give invites to planets, and those invitees can subsequently send additional planets from that star to their friends, and pass on this invite power indefinitely. This contract keeps track of those operations in the form of the [Invite Tree](urbit-docs/glossary/invite-tree), so the relationship between inviters and invitees is publicly known.

With the introduction of the [L2](urbit-docs/glossary/rollups) invite system, delegated sending is less commonly used.
