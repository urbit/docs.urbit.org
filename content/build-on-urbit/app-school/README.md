---
description: "Contents page for the guide to building Gall agents on Urbit, covering state management, subscriptions, and inter-agent communication for Urbit app development."
layout:
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# App School I

This guide will walk through everything you need to know to write your own Gall agents.

App School I is suitable for anyone with an intermediate knowledge of Hoon. If you've worked through [Hoon School](../hoon-school) or something equivalent, you should be fine.

## What are Gall agents? {#what-are-gall-agents}

Gall is one of the nine vanes (kernel modules) of Arvo, Urbit's operating system. Gall's purpose is to manage userspace applications called "agents".

An agent is a piece of software that is primarily focused on maintaining and distributing a piece of state with a defined structure. It exposes an interface that lets programs read, subscribe to, and manipulate the state. Every event happens in an atomic transaction, so the state is never inconsistent. Since the state is permanent, when the agent is upgraded with a change to the structure of the state, the developer provides a migration function from the old state type to the new state type.

It's not too far off to think of an agent as simply a database with developer-defined logic. But an agent is significantly less constrained than a database. Databases are usually tightly constrained in one or more ways because they need to provide certain guarantees (like atomicity) or optimizations (like indexes). Arvo is a [single-level store](../../urbit-os/kernel/arvo#single-level-store), so atomicity comes for free. Many applications don't use databases because they need relational indices; rather, they use them for their guarantees around persistence. Some do need the indices, though, and it's not hard to imagine an agent which provides a SQL-like interface.

On the other hand, an agent is also a lot like what many systems call a "service". An agent is permanent and addressable -- a running program can talk to an agent just by naming it. An agent can perform [IO](https://urbit.org/blog/io-in-hoon), unlike most databases. This is a critical part of an agent: it performs IO along the same transaction boundaries as changes to its state, so if an effect happens, you know that the associated state change has happened.

But the best way to think about an agent is as a state machine. Like a state machine, any input could happen at any time, and it must react coherently to that input. Output (effects) and the next state of the machine are a pure function of the previous state and the input event.

## Table of Contents {#table-of-contents}

#### Lessons

1. [Arvo](1-arvo.md) - This lesson provides an overview of the Arvo operating system, and some other useful background information.
2. [The Agent Core](2-agent.md) - This lesson goes over the basic structure of a Gall agent.
3. [Imports and Aliases](3-imports-and-aliases.md) - This lesson covers some useful libraries, concepts and boilerplate commonly used when writing Gall agents.
4. [Lifecycle](4-lifecycle.md) - This lesson introduces the state management arms of an agent.
5. [Cards](5-cards.md) - This lesson covers `$card`s - the structure used to pass messages to other agents and vanes.
6. [Pokes](6-pokes.md) - This lesson covers sending and receiving one-off messages called "pokes" between agents.
7. [Structures and Marks](7-sur-and-marks.md) - This lesson talks about importing type defintions, and writing mark files.
8. [Subscriptions](8-subscriptions.md) - This lesson goes through the mechanics of subscriptions - both inbound and outbound.
9. [Vanes](9-vanes.md) - This lesson explains how to interact with vanes (kernel modules) from an agent.
10. [Scries](10-scry.md) - This lesson gives an overview of scrying Gall agents, and how scry endpoints are defined in agents.
11. [Failure](11-fail.md) - This lesson covers how Gall handles certain errors and crashes, as well as the concept of a helper core.
12. [Next Steps](12-next-steps.md) - App School I is now complete - here are some things you can look at next.

#### Appendix

- [Types](types.md) - A reference for a few of the types used in App School.
