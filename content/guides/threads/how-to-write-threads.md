+++
title = "How to Write Threads"
description = "Learn to write asynchronous I/O functions"
weight = 10
auto_expand = true
+++

This tutorial walks through all the basic concepts you need to know to
start writing threads.

## [Fundamentals](#fundamentals)

Basic explanation of threads and usage of the strand arms `form` and `pure`.

## [Bind](#bind)

Using micgal (`;<`) and the strand arm `bind` to chain strands together.

## [Input](#input)

Information on what a strand takes.

## [Output](#output)

Information on what a strand produces.

## [Summary](#summary)

Summary of this information.


## Fundamentals

A thread is like a transient gall agent. Unlike an agent, it can end and it can fail. The primary uses for threads are:

1. Complex IO, like making a bunch of external API calls where each call depends on the last. Doing this in an agent significantly increases its complexity and the risk of a mishandled intermediary state corrupting permanent state. If you spin the IO out into a thread, your agent only has to make one call to the thread and receive one response.
2. Testing - threads are very useful for writing complex tests for your agents.

Threads are managed by the gall agent called `spider`.

### Thread location

Threads live in the `ted` directory of each desk. For example, in a desk named `%sandbox`:

```
%sandbox
├──app
├──gen
├──lib
├──mar
├──sur
└──ted <-
   ├──foo
   │  └──bar.hoon
   └──baz.hoon
```

From the dojo, `ted/baz.hoon` can be run with `-sandbox!baz`, and `ted/foo/bar.hoon` with `-sandbox!foo-bar`. Threads in the `%base` desk can just be run like `-foo`, but all others must have the format `-desk!thread`.

**NOTE:** When the dojo sees the `-` prefix it automatically handles creating a thread ID, composing the argument, poking the `spider` gall agent and subscribing for the result. Running a thread from another context (eg. a gall agent) requires doing these things explicitly and is outside the scope of this particular tutorial.

### Libraries and Structures

There are three files that matter:

- `/sur/spider/hoon` - this contains a few simple structures used by spider. It's not terribly useful except it imports libstrand, so you'll typically get `strand` from `spider`.

- `/lib/strand/hoon` - this contains all the main functions and structures for strands (a thread is a running strand), and you'll refer to this fairly frequently.

- `/lib/strandio/hoon` - this contains a large collection of ready-made functions for use in threads. You'll likely use many of these when you write threads, so it's very useful.

### Thread definition

`/sur/spider/hoon` defines a thread as:

```hoon
+$  thread  $-(vase _*form:(strand ,vase))
```

That is, a gate which takes a `vase` and returns the `form` of a `strand` that produces a `vase`. This is a little confusing and we'll look at each part in detail later. For now, note that the thread doesn't just produce a result, it actually produces a strand that takes input and produces output from which a result can be extracted. It works something like this:

![thread diagram](https://media.urbit.org/site/thread-diagram.png "diagram of a thread")

This is because threads typically do a bunch of I/O so it can't just immediately produce a result and end. Instead the strand will get some input, produce output, get some new input, produce new output, and so forth, until they eventually produce a `%done` with the actual final result.

### Strands

Strands are the building blocks of threads. A thread will typically compose multiple strands.

A strand is a function of `strand-input:strand -> output:strand` and is defined in `/lib/strand/hoon`. You can see the details of `strand-input` [here](https://github.com/urbit/urbit/blob/master/pkg/arvo/lib/strand.hoon#L2-L21) and `output:strand` [here](https://github.com/urbit/urbit/blob/master/pkg/arvo/lib/strand.hoon#L23-L48). At this stage you don't need to know the nitty-gritty but it's helpful to have a quick look through. We'll discuss these things in more detail later.

A strand is a core that has three important arms:

- `form` - the mold of the strand
- `pure` - produces a strand that does nothing except return a value
- `bind` - monadic bind, like `then` in javascript promises

We'll discuss each of these arms later.

A strand must be specialised to produce a particular type like `(strand ,<type>)`. As previously mentioned, a `thread` produces a `vase` so is specialised like `(strand ,vase)`. Within your thread you'll likely compose multiple strands which produce different types like `(strand ,@ud)`, `(strand ,[path cage])`, etc, but the thread itself will always come back to a `(strand ,vase)`.

Strands are conventionally given the face `m` like:

```hoon
=/  m  (strand ,vase)
...
```

**NOTE:** a comma prefix as in `,vase` is the irregular form of [`^:` ketcol](/language/hoon/reference/rune/ket#-ketcol) which produces a gate that returns the sample value if it's of the correct type, but crashes otherwise.

### Form and Pure

#### `form`

The `form` arm is the mold of the strand, suitable for casting. The two other arms produce `form`s so you'll cast everything to this like:

```hoon
=/  m  (strand ,@ud)
^-  form:m
...
```

#### `pure`

Pure produces a strand that does nothing except return a value. So, `(pure:(strand ,@tas) %foo)` is a strand that produces `%foo` without doing any IO.

We'll cover `bind` later.

### A trivial thread

```hoon
/-  spider
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
(pure:m arg)
```

The above code is a simple thread that just returns its argument, and it's a good boilerplate to start from.

Save the above code as a file in `ted/mythread.hoon` and `|commit` it. Run it with `-mythread 'foo'`, you should see the following:

```
> -mythread 'foo'
[~ 'foo']
```

**NOTE:** The dojo wraps arguments in a unit so that's why it's `[~ 'foo']` rather than just `'foo'`.

### Analysis

We'll go through it line-by line.

```hoon
/-  spider
=,  strand=strand:spider
```

First we import `/sur/spider/hoon` which includes `/lib/strand/hoon` and give the latter the face `strand` for convenience.

```hoon
^-  thread:spider
```

We make it a thread by casting it to `thread:spider`

```hoon
|=  arg=vase
```

We create a gate that takes a vase, the first part of the previously mentioned thread definition.

```hoon
=/  m  (strand ,vase)
```

Inside the gate we create our `strand` specialised to produce a `vase` and give it the canonical face `m`.

```hoon
^-  form:m
```

We cast the output to `form` - the mold of the strand we created.

```hoon
(pure:m arg)
```

Finally we call `pure` with the gate input `arg` as its argument. Since `arg` is a `vase` it will return the `form` of a `strand` which produces a `vase`. Thus we've created a thread in accordance with its type definition.

Next we'll look at the third arm of a strand: `bind`.

Having looked at `form` and `pure`, we'll now look at the last `strand` arm `bind`. Bind is typically used in combination with micgal (`;<`).

### Micgal

Micgal takes four arguments like `spec hoon hoon hoon`. Given `;< a b c d`, it composes them like `((b ,a) c |=(a d))`. So, for example, these two expressions are equivalent:

```hoon
;<  ~  bind:m  (sleep:strandio ~s2)
(pure:m !>(~))
```

and

```hoon
((bind:m ,~) (sleep:strandio ~s2) |=(~ (pure:m !>(~))))
```

Micgal exists simply for readability. The above isn't too bad, but consider this:

```hoon
;<  a  b  c
;<  d  e  f
;<  g  h  i
j
```

...as opposed to this monstrosity: `((b ,a) c |=(a ((e ,d) f |=(d ((h ,g) i |=(g j))))))`

## bind

Bind by itself must be specialised like `(bind:m ,<type>)` and it takes two arguments:

- The first argument is a function that returns the `form` of a strand which produces `<type>`.
- The second argument is a gate whose sample is `<type>` and which returns a `form`.

Since you'll invariably use it in conjunction with micgal, the `<type>` in `;< <type> bind:m ...` will both specialise `bind` and specify the gate's sample.

Bind calls the first function then, if it succeeded, calls the second gate with the result of the first as its sample. If the first function failed, it will instead just return an error message and not bother calling the next gate. So it's essentially "strand A then strand B".

Since the second gate may itself contain another `;< <type> bind:m ...`, you can see how this allows you to glue together an arbitrarily large pipeline, where subsequent gates depend on the previous ones.

### strandio

`/lib/strandio/hoon` contains a large collection of useful, ready-made functions for use in threads. For example:

- `sleep` waits for the specified time.
- `get-time` gets the current time.
- `poke` pokes an agent.
- `watch` subscribes to an agent.
- `fetch-json` produces the JSON at a particular URL.
- `retry` tries a strand repeatedly with exponential backoff until it succeeds.
- `start-thread` starts another thread.
- `send-raw-card` sends any card.

...and many more.

### Putting it together

Here's a simple thread with a couple of `strandio` functions:

```hoon
/-  spider
/+  strandio
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
;<  t=@da   bind:m  get-time:strandio
;<  s=ship  bind:m  get-our:strandio
(pure:m !>([s t]))
```

Save it as `/ted/mythread.hoon` of `%base`, `|commit` it and run it with `-mythread`. You should see something like:

```
> -mythread
[~zod ~2021.3.8..14.52.15..bdfe]
```

### Analysis

To use `strandio` functions we've imported the library with `/+ strandio`.

`get-time` and `get-our` get the current time & ship from the bowl in `strand-input`. We'll discuss `strand-input` in more detail later.

Note how we've specified the face and return type of each strand like `t=@da`, etc.

You can see how `pure` has access to the results of previous strands in the pipeline. Note how we've wrapped `pure`'s argument in a `!>` because the thread must produce a `vase`.

Next we'll look at `strand-input` in more detail.

## Input

The input to a `strand` is defined in `/lib/strand/hoon` as:

```hoon
+$  strand-input  [=bowl in=(unit input)]
```

When a thread is first started, spider will populate the `bowl` and provide it along with an `input` of `~`. If/when new input comes in (such as a poke, sign or watch) it will provide a new updated bowl along with the new input.

For example, here's a thread that gets the time from the bowl, runs an IO-less function that takes one or two seconds to compute, and then gets the time again:

```hoon
/-  spider
/+  *strandio
=,  strand=strand:spider
|%
++  ackermann
  |=  [m=@ n=@]
  ?:  =(m 0)  +(n)
  ?:  =(n 0)  $(m (dec m), n 1)
  $(m (dec m), n $(n (dec n)))
--
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
;<  t1=@da  bind:m  get-time
=/  ack  (ackermann 3 8)
;<  t2=@da  bind:m  get-time
(pure:m !>([t1 t2]))
```

Since it never does any IO, `t1` and `t2` are the same: `[~2021.3.17..07.47.39..e186 ~2021.3.17..07.47.39..e186]`. However, if we replace the ackermann function with a 2 second `sleep` from strandio:

```hoon
/-  spider
/+  *strandio
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
;<  t1=@da  bind:m  get-time
;<  ~       bind:m  (sleep ~s2)
;<  t2=@da  bind:m  get-time
(pure:m !>([t1 t2]))
```

...and run it again we get different values for `t1` and `t2`: `[~2021.3.17..07.50.28..8a5d ~2021.3.17..07.50.30..8a66]`. This is because `sleep` gets a `%wake` sign back from `behn`, so spider updates the time in the bowl along with it.

Now let's look at the contents of `bowl` and `input` in detail:

### bowl

`bowl` is the following:

```hoon
+$  bowl
  $:  our=ship
      src=ship
      tid=tid
      mom=(unit tid)
      wex=boat:gall
      sup=bitt:gall
      eny=@uvJ
      now=@da
      byk=beak
  ==
```

- `our` - our ship
- `src` - ship where input is coming from
- `tid` - ID of this thread
- `mom` - parent thread if this is a child thread
- `wex` - outgoing subscriptions
- `sup` - incoming subscriptions
- `eny` - entropy
- `now` - current datetime
- `byk` - `[p=ship q=desk r=case]` path prefix

There are a number of functions in `strandio` to access the `bowl` contents like `get-bowl`, `get-beak`, `get-time`, `get-our` and `get-entropy`.

You can also write a function with a gate whose sample is `strand-input:strand` and access the bowl that way like:

```hoon
/-  spider
/+  strandio
=,  strand=strand:spider
=>
|%
++  bowl-stuff
  =/  m  (strand ,[boat:gall bitt:gall])
  ^-  form:m
  |=  tin=strand-input:strand
  `[%done [wex.bowl.tin sup.bowl.tin]]
--
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
;<  res=[boat:gall bitt:gall]  bind:m  bowl-stuff
(pure:m !>(res))
```

### input

`input` is defined in libstrand as:

```hoon
+$  input
  $%  [%poke =cage]
      [%sign =wire =sign-arvo]
      [%agent =wire =sign:agent:gall]
      [%watch =path]
  ==
```

- `%poke` incoming poke
- `%sign` incoming sign from arvo
- `%agent` incoming sign from a gall agent
- `%watch` incoming subscription

Various functions in `strandio` will check `input` and conditionally do things based on its contents. For example, `sleep` sets a `behn` timer and then calls `take-wake` to wait for a `%wake` sign from behn:

```hoon
++  take-wake
  |=  until=(unit @da)
  =/  m  (strand ,~)
  ^-  form:m
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~  `[%wait ~]
      [~ %sign [%wait @ ~] %behn %wake *]
    ?.  |(?=(~ until) =(`u.until (slaw %da i.t.wire.u.in.tin)))
      `[%skip ~]
    ?~  error.sign-arvo.u.in.tin
      `[%done ~]
    `[%fail %timer-error u.error.sign-arvo.u.in.tin]
  ==
```

## Output

A strand produces a `[(list card) <response>]`. The first part is a list of cards to be sent off immediately, and `<response>` is one of:

- `[%wait ~]`
- `[%skip ~]`
- `[%cont self=(strand-form-raw a)]`
- `[%fail err=(pair term tang)]`
- `[%done value=a]`

So, for example, if you feed `2 2` into the following function:

```hoon
  |=  [a=@ud b=@ud]
  =/  m  (strand ,vase)
  ^-  form:m
  =/  res  !>(`@ud`(add a b))
  (pure:m res)
```

The resulting strand won't just produce `[#t/@ud q=4]`, but rather `[~ %done [#t/@ud q=4]]`.

**Note:** that spider doesn't actually return the codes themselves to thread subscribers, they're only used internally to manage the flow of the thread.

Since a strand is a function from the previously discussed `strand-input` to the output discussed here, you can compose a valid strand like:

```hoon
|=  strand-input:strand
[~ %done 'foo']
```

So this is a valid thread:

```hoon
/-  spider
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
|=  strand-input:strand
[~ %done arg]
```

As is this:

```hoon
/-  spider
=,  strand=strand:spider
|%
++  my-function
  =/  m  (strand ,@t)
  ^-  form:m
  |=  strand-input:strand
  [~ %done 'foo']
--
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
;<  msg=@t  bind:m  my-function
(pure:m !>(msg))
```

As is this:

```hoon
/-  spider
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
|=  strand-input:strand
=/  umsg  !<  (unit @tas)  arg
?~  umsg
[~ %fail %no-arg ~]
=/  msg=@tas  u.umsg
?.  =(msg %foo)
[~ %fail %not-foo ~]
[~ %done arg]
```

Which works like:

```
> -mythread
thread failed: %no-arg
> -mythread %bar
thread failed: %not-foo
> -mythread %foo
[~ %foo]
```

Now let's look at the meaning of each of the response codes.

### wait

Wait tells spider not to move on from the current strand, and to wait for some new input. For example, `sleep:strandio` will return a `[%wait ~]` along with a card to start a behn timer. Spider passes the card to behn, and when behn sends a wake back to spider, the new input will be given back to `sleep` as a `%sign`. Sleep will then issue `[~ %done ~]` and (assuming it's in a `bind`) `bind` will proceed to the next strand.

### skip

Spider will normally treat a `%skip` the same as a `%wait` and just wait for some new input. When used inside a `main-loop:strandio`, however, it will instead tell `main-loop` to skip this function and try the next one with the same input. This is very useful when you want to call different functions depending on the mark of a poke or some other condition.

### cont

Cont means continue computation. When a `%cont` is issued, the issuing gate will be called again with the new value provided. Therefore `%cont` essentially creates a loop.

### fail

Fail says to end the thread here and don't call any subsequent strands. It includes an error message and optional traceback. When spider gets a `%fail` it will send a fact with mark `%thread-fail` containing the error and traceback to its subscribers, and then end the thread.

### done

Done means the computation was completed successfully and includes the result. When `spider` recieves a `%done` it will send the result it contains in a fact with a mark of `%thread-done` to subscribers and end the thread. When `bind` receives a `%done` it will extract the result and call the next gate with it.

## Summary

That's basically all you need to know to write threads. The best way to get a good handle on them is just to experiment with some `strandio` functions. For information on running threads from gall agents, see [here](/userspace/threads/examples/gall) and for some examples see [here](/userspace/threads/examples).

Now here's a quick recap of the main points covered:

### Spider

- is the gall agent that manages threads.
- Details of interacting with threads via spider can be seen [here](/userspace/threads/reference/api).

### Threads

- are like transient gall agents
- are used mostly to chain a series of IO operations
- can be used by gall agents to spin out IO operations
- live in the `ted` directory
- are managed by the gall agent `spider`
- take a `vase` and produce a `strand` which produces a `vase`

#### Example

```hoon
/-  spider
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
(pure:m arg)
```

### Strands

- are the building blocks of threads
- take [this](https://github.com/urbit/urbit/blob/master/pkg/base-dev/lib/strand.hoon#L2-L21) input and produce [this](https://github.com/urbit/urbit/blob/master/pkg/base-dev/lib/strand.hoon#L23-L48) output.
- must be specialised to produce a particular type like `(strand ,@ud)`.
- are conventionally given the face `m`.
- are a core that has three main arms - `form`, `pure` and `bind`:

#### form

- is the mold of the strand suitable for casting
- is the type returned by the other arms

#### pure

- simply returns the `form` of a `strand` that produces pure's argument without doing any IO

#### bind

- is used to chain strands together like javascript promises
- is used in conjunction with micgal (`;<`)
- must be specialised to a type like `;< <type> bind:m ...`
- takes two arguments. The first is a function that returns the `form` of a `strand` that produces `<type>`. The second is a gate whose sample is `<type>` and which returns a `form`.
- calls the first and then, if it succeeded, calls the second with the result of the first as its sample.

### Strand input

- looks like `[=bowl in=(unit input)]`
- `bowl` has things like `our`, `now`, `eny` and so forth
- `bowl` is populated once when the thread is first called and then every time it receives new input
- `input` contains any incoming pokes, signs and watches.

### Strand output

- contains `[cards=(list card:agent:gall) <response>]`
- `cards` are any cards to be sent immediately
- `<response>` is something like `[%done value]`, `[%fail err]`, etc.
- `%done` will contain the result
- responses are only used internally to manage the flow of the thread and are not returned to subscribers.

### Strandio

- is located in `/lib/strandio/hoon`
- contains a collection of ready-made functions for use in threads
- eg. `sleep`, `get-bowl`, `take-watch`, `poke`, `fetch-json`, etc.
