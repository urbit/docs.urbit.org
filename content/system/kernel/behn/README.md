# Behn

Urbit's timer vane.

Behn manages timers in a simple priority queue. Other vanes and applications ask Behn to set a timer to go off at the given time, and Behn produces effects that start the timers on Unix. When the timer goes off, Unix sends an event to Behn, which then notifies the original requester. We don't gurantee that a timer event will happen at exactly the time it was set for, or even that it'll be particularly close. A timer event is a request to not be woken until after the given time.
