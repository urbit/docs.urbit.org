---
description: >-
  Summary and recap of thread concepts including %spider agent management, strand composition, +form/+pure/+bind operations, input/output patterns, and strandio utility functions.
---

# Summary

That's basically all you need to know to write threads. The best way to get a good handle on them is just to experiment with some `strandio` functions. For information on running threads from gall agents, see [here](/userspace/threads/examples/gall) and for some examples see [here](/userspace/threads/examples).

Now here's a quick recap of the main points covered:

## Spider

- is the Gall agent that manages threads.
- Details of interacting with threads via Spider can be seen [here](/userspace/threads/reference/api).

## Threads

- are like transient Gall agents
- are used mostly to chain a series of IO operations
- can be used by Gall agents to spin out IO operations
- live in the `/ted` directory or, in the case of inline threads, inside a Gall agent
- are managed by the Gall agent `spider`, but run via the Khan vane
- take a `$vase` (unless they're an inline thread) and produce a `+strand` which produces a `$vase`

#### Example

```hoon
|=  arg=vase
=/  m  (strand:rand ,vase)
^-  form:m
(pure:m arg)
```

## Strands

- are the building blocks of threads
- take `$strand-input:rand` and produce `$output:strand:rand`.
- must be specialised to produce a particular type like `(strand:rand ,@ud)`.
- are conventionally given the face `m`.
- are a core that has three main arms - `+form`, `+pure` and `+bind`:

### form

- is the mold of the strand suitable for casting
- is the type returned by the other arms

### pure

- simply returns the `+form` of a strand that produces pure's argument without doing any IO

### bind

- is used to chain strands together like javascript promises
- is used in conjunction with micgal (`;<`)
- must be specialised to a type like `;< <type> bind:m ...`
- takes two arguments. The first is a function that returns the `+form` of a strand that produces `<type>`. The second is a gate whose sample is `<type>` and which returns a `+form`.
- calls the first and then, if it succeeded, calls the second with the result of the first as its sample.

## Strand input

- looks like `[=bowl in=(unit input)]`
- `bowl` has things like `our`, `now`, `eny` and so forth
- `bowl` is populated once when the thread is first called and then every time it receives new input
- `input` contains any incoming pokes, signs and watches.

## Strand output

- contains `[cards=(list card:agent:gall) <response>]`
- `cards` are any cards to be sent immediately
- `<response>` is something like `[%done value]`, `[%fail err]`, etc.
- `%done` will contain the result
- responses are only used internally to manage the flow of the thread and are not returned to subscribers.

## Strandio

- is located in `/lib/strandio/hoon`
- contains a collection of ready-made functions for use in threads
- eg. `+sleep`, `+get-bowl`, `+take-watch`, `+poke`, `+fetch-json`, etc.
