+++
title = "Bowl"

[glossaryEntry.bowl]
name = "bowl"
symbol = ""
usage = "arvo"
desc = "Useful data given to a Gall agent or thread."

+++

The **bowl** contains useful data about the current [ship](/glossary/ship) and context. It is given to a [thread](/glossary/thread) or [Gall](/glossary/gall) [agent](/glossary/agent) whenever it processes an event. It contains the current time, some entropy, the name of the ship, the source of the event, and other relevant information.

#### Further reading

- [Gall data-types reference](/system/kernel/gall/reference/data-types#bowl): Details of the `bowl` data structure used by Gall.
- [The threads guide](/userspace/threads/tutorials/basics/input#bowl): This includes details about the bowl given to threads.
