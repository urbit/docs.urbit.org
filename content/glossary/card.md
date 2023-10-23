+++
title = "Card"

[extra]
category = "hoon-nock"

[glossaryEntry.card]
name = "card"
symbol = ""
usage = "hoon-nock"
desc = "The type of effects produced by agents and threads."

+++

A **card** is the data type for effects produced by
[Gall](/glossary/gall) [agents](/glossary/agent) and
[threads](/glossary/thread). It may contain things like requests to
[vanes](/glossary/vane) (kernel modules),
[pokes](/glossary/poke) to other agents,
[facts](/glossary/fact) for subscribers, etc.

### Further Reading

- [Gall data types reference](/system/kernel/gall/reference/data-types#cardagent):
  Documentation of the `card` type.
- [App school: cards lesson](/courses/app-school/5-cards): A lesson on cards.
