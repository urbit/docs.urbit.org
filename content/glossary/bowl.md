# Bowl

The **bowl** contains useful data about the current [ship](ship.md) and context. It is given to a [thread](thread.md) or [Gall](gall.md) [agent](agent.md) whenever it processes an event. It contains the current time, some entropy, the name of the ship, the source of the event, and other relevant information.

#### Further reading

- [Gall data-types reference](../urbit-os/kernel/gall/reference/data-types.md#bowl) - Details of the `bowl` data structure used by Gall.
- [The threads guide](../urbit-os/base/threads/tutorials/basics/input.md#bowl): This includes details about the bowl given to threads.
