+++
title = "Threads"
description = "Learn to write asynchronous I/O functions"
weight = 101
auto_expand = true
+++

Urbit code lives in the following basic categories:

- Runtime (Nock interpreter, persistence engine, IO drivers, jets)
- Kernel vanes (managed by Arvo)
- Userspace agents (managed by Gall, permanent state)
- Userspace threads (managed by Spider, transient state)

This describes the last category: Threads.

A thread is a monadic function that takes arguments and produces a
result. It may perform input and output while running, so it is not a
pure function. It may fail.

An agent's strength is that it's permanent and bulletproof. All state
transitions are defined, and each action it performs is a transaction.
Code upgrades preserve existing state.

An agent's weakness is complex input and output. Since each state
transition must be explicitly handled, the complexity of an agent
explodes with the amount of IO it handles. At best, this results in
long and complex code; at worst, unexpected states are mishandled,
corrupting permanent state.

A thread's strength is that it can easily perform complex IO operations.
It uses what's often called the IO monad (plus the exception monad) to
provide a natural framework for IO.

A thread's weakness is that it's impermanent and may fail unexpectedly.
In most of its intermediate states, it expects only a small number of
events (usually one), so if it receives anything it didn't expect, it
fails. When code is upgraded, it's impossible to upgrade a running
thread, so it fails.

Thus, for anything that needs to be permament, use an agent. When you
need to do a long or complex sequence of IO operations, reduce that to a
single logical IO operation by spinning it out into a thread. If you
only change your agent's state in response to success of the thread, an
IO failure will never result in partially applied state changes.

A thread may also be run from the dojo by prefixing its name with `-`
and giving it any arguments it requires. If alone, any result will be
printed to the screen; else the output may be piped into an agent or
other sinks.

## Thread basics

This guide walks you through the fundamental things you need to know to write threads. They focus on basic thread composition and so don't touch on interacting with threads from gall agents and such. The included examples can all just be run from the dojo.

1. [Thread Fundamentals](/userspace/threads/tutorials/basics/fundamentals) - Basic information and overview of threads, strands, `form` & `pure`.
2. [Micgal and Bind](/userspace/threads/tutorials/basics/bind) - Covers using micgal and `bind` to chain strands.
3. [Strand Input](/userspace/threads/tutorials/basics/input) - What strands receive as input
4. [Strand Output](/userspace/threads/tutorials/basics/output) - What strands produce
5. [Summary](/userspace/threads/tutorials/basics/summary)

## Gall

These docs walk through the basics of interacting with threads from gall agents.

1. [Start a thread](/userspace/threads/examples/gall/start-thread)
2. [Subscribe for result](/userspace/threads/examples/gall/take-result)
3. [Subscribe for facts](/userspace/threads/examples/gall/take-facts)
4. [Stop a thread](/userspace/threads/examples/gall/stop-thread)
5. [Poke a thread](/userspace/threads/examples/gall/poke-thread)

## How-tos & Examples

- [Grab some JSON from a URL](/userspace/threads/examples/get-json) - Here's an example of chaining a couple of external http requests for JSON.
- [Start a child thread](/userspace/threads/examples/child-thread) - Starting and managing child threads.
- [Main Loop](/userspace/threads/examples/main-loop) - Some notes and examples of the `strandio` function `main-loop`.
- [Poke an agent](/userspace/threads/examples/poke-agent) - Example of poking an agent from a thread.
- [Scry](/userspace/threads/examples/scry) - Scry arvo or an agent.
- [Take a fact](/userspace/threads/examples/take-fact) - Subscribe to an agent and receive a fact.

## [Reference](/userspace/threads/reference/api)

Basic reference information. For usage of particular `strandio` functions just refer directly to `/lib/strandio/hoon` since they're largely self-explanatory.

## [Strandio](/userspace/threads/reference/strandio)

Reference documentation of the Strandio helper library.

