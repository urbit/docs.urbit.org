---
description: >-
  Documentation for Behn: Arvo's timer module for scheduling and managing timers.
---

# Behn

Behn is Arvo's timer module.

Behn manages timers in a simple priority queue. Other modules and applications ask Behn to set a timer to go off at the given time, and Behn produces effects that start the timers in Unix.

When the timer goes off, Unix sends an event to Behn, and Behn notifies the original requester.

A timer event is a request to not be woken until _after_ the given time. We don't guarantee that a timer event will happen at exactly the time it was set for, or even that it'll be particularly close.
