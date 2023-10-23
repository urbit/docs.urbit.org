+++
title = "Delegated Sending"

[extra]
category = "azimuth"

[glossaryEntry."delegated sending"]
name = "delegated sending"
symbol = ""
usage = "azimuth"
desc = "A method by which a star can distribute planets, assigning them to a delegated planet."

+++

The **Delegated Sending** [Azimuth](/glossary/azimuth) contract is a way that a [star](/glossary/star ) distributes [L1](/glossary/azimuth) [planets](/glossary/planet). After a star configures the Delegated Sending contract as its [spawn proxy](/glossary/proxies) it can give invites to planets, and those invitees can subsequently send additional planets from that star to their friends, and pass on this invite power indefinitely. This contract keeps track of those operations in the form of the [Invite Tree](/glossary/invite-tree), so the relationship between inviters and invitees is publicly known.

With the introduction of the [L2](/glossary/rollups) invite system,
delegated sending is less commonly used.
