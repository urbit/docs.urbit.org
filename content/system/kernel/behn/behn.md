+++
title = "Overview"
weight = 1
+++

Urbit's timer vane.

Behn manages timers in a simple priority queue. Other vanes and applications ask Behn to set a timer to go off at the given time, and Behn produces effects that start the timers on Unix. When the timer goes off, Unix sends an event to Behn, which then notifies the original requester. We don't gurantee that a timer event will happen at exactly the time it was set for, or even that it'll be particularly close. A timer event is a request to not be woken until after the given time.

## Sections

[API Reference](/system/kernel/behn/reference/tasks) - The `task`s Behn takes and the `gift`s it returns.

[Scry Reference](/system/kernel/behn/reference/scry) - The scry endpoints of Behn.

[Examples](/system/kernel/behn/examples/examples) - Practical examples of using Behn's `task`s.
