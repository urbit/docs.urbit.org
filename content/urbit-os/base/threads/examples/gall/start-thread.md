---
description: "Gall agent examples for starting threads - inline vs file threads, Khan vs Spider APIs, thread IDs and subscription patterns."
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

# Start Thread

There are two kinds of threads you can run from a Gall agent: inline threads and thread files in the `/ted` directory of a desk. Additionally, there are two ways to run them: passing a task to the [Khan](../../../../kernel/khan) vane, and poking the `%spider` agent directly. Khan's API is typically easier to use and the correct choice most of the time. The only reason to poke `%spider` directly is because you want to specify the thread ID explicitly. This is only necessary if you want to be able to interact with it while it's running or cancel it prematurely.

## Inline thread via Khan

First we'll look at running an "inline thread" from a Gall agent. Save the following agent as `/app/inline-khan.hoon` in the `%base` desk of a fakezod:

<details>

<summary>/app/inline-khan.hoon code</summary>

{% code title="/app/inline-khan.hoon" overflow="nowrap" lineNumbers="true" %}

```hoon
/+  default-agent, dbug
=*  card  card:agent:gall
%-  agent:dbug
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
::
++  on-poke
  |=  [=mark vas=vase]
  ^-  (quip card _this)
  =+  !<  txt=@t  vas
  =/  =shed:khan
    =/  m  (strand:rand ,vase)
    ^-  form:m
    (pure:m !>(txt))
  :_  this
  [%pass /thread %arvo %k %lard %base shed]~
::
++  on-arvo
  |=  [=wire sign=sign-arvo]
  ^-  (quip card _this)
  ?.  ?=([%khan %arow *] sign)
    (on-arvo:def wire sign)
  ?:  ?=(%| -.p.sign)
    %-  (slog leaf+"Thread error: %{(trip mote.p.p.sign)}" tang.p.p.sign)
    `this
  =+  !<  txt=@t  q.p.p.sign
  %-  (slog leaf+"Thread success! Message: {(trip txt)}" ~)
  `this
::
++  on-agent  on-agent:def
++  on-init  on-init:def
++  on-save  on-save:def
++  on-load  on-load:def
++  on-watch  on-watch:def
++  on-leave  on-leave:def
++  on-peek   on-peek:def
++  on-fail   on-fail:def
--
```

{% endcode %}

</details>

In the dojo, run `|commit %base` then `|start %inline-khan`.

Now you can poke it from the Dojo with `:inline-khan 'foo'`. You should see:

{% code title="Dojo" overflow="nowrap" lineNumbers="false" %}
```
Thread success! Message: foo
```
{% endcode %}

### Analysis

In `+on-poke` we create a `$shed:khan` like so:

{% code overflow="nowrap" lineNumbers="false" %}
```hoon
=/  =shed:khan
  =/  m  (strand:rand ,vase)
  ^-  form:m
  (pure:m !>(txt))
```
{% endcode %}

Notice how we could directly reference the `txt` leg we'd pinned on a previous line in `+on-poke`. The thread can access anything in its subject, so an explicit starting argument is not required.

We pass the whole `$shed:khan` to Khan in a [`%lard`](../../../../kernel/khan/tasks.md#lard) task card:

{% code overflow="nowrap" lineNumbers="false" %}
```hoon
[%pass /thread %arvo %k %lard %base shed]~
```
{% endcode %}

Khan will handle creating a thread ID, poking Spider to start it, and waiting for the result. Once done, Khan will return an [`%arow`](../../../../kernel/khan/tasks.md#arow) gift back to our agent in `+on-arvo`, where we check if it succeeded and print the result:

{% code overflow="nowrap" lineNumbers="false" %}
```hoon
++  on-arvo
  |=  [=wire sign=sign-arvo]
  ^-  (quip card _this)
  ?.  ?=([%khan %arow *] sign)
    (on-arvo:def wire sign)
  ?:  ?=(%| -.p.sign)
    %-  (slog leaf+"Thread error: %{(trip mote.p.p.sign)}" tang.p.p.sign)
    `this
  =+  !<  txt=@t  q.p.p.sign
  %-  (slog leaf+"Thread success! Message: {(trip txt)}" ~)
  `this
```
{% endcode %}

---

## Thread file via Khan

Here's an example of a barebones Gall agent that runs a thread file rather than an inline one.

<details>

<summary>/app/thread-starter.hoon code</summary>

{% code title="/app/thread-starter.hoon" overflow="nowrap" lineNumbers="true" %}
```hoon
/+  default-agent, dbug
=*  card  card:agent:gall
%-  agent:dbug
^-  agent:gall
|_  =bowl:gall
+*  this      .
    def   ~(. (default-agent this %|) bowl)
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  =+  !<  [ted=@tas txt=@tas]  vase
  :_  this
  [%pass /thread %arvo %k %fard %base ted noun+!>(txt)]~
::
++  on-arvo
  |=  [=wire sign=sign-arvo]
  ^-  (quip card _this)
  ?.  ?=([%khan %arow *] sign)
    (on-arvo:def wire sign)
  ?:  ?=(%| -.p.sign)
    %-  (slog leaf+"Thread error: %{(trip mote.p.p.sign)}" tang.p.p.sign)
    `this
  %-  (slog leaf+"Thread success!" ~)
  `this
::
++  on-agent  on-agent:def
++  on-init  on-init:def
++  on-save  on-save:def
++  on-load  on-load:def
++  on-watch  on-watch:def
++  on-leave  on-leave:def
++  on-peek   on-peek:def
++  on-fail   on-fail:def
--
```
{% endcode %}

</details>

And here's a minimal thread to test it with:

{% code title="/ted/test-thread.hoon" overflow="nowrap" lineNumbers="true" %}
```hoon
|=  arg=vase
=/  m  (strand:rand ,vase)
^-  form:m
|=  strand-input:rand
?+    q.arg  [~ %fail %not-foo ~]
    %foo
  [~ %done arg]
==
```
{% endcode %}

Save them as `/app/thread-starter.hoon` and `/ted/test-thread.hoon` respectively in the `%base` desk, `|commit %base`, and start the app with `|start %thread-starter`.

Now you can poke it with a pair of thread name and argument like:

```
:thread-starter [%test-thread %foo]
```

You should see `Thread success!`.

Now try poking it with `[%fake-thread %foo]`, you should see something like:

```
Thread error: %poke-ack
/app/spider/hoon:<[445 7].[445 52]>
[%no-file-for-thread %fake-thread]
/app/spider/hoon:<[444 7].[445 52]>
/app/spider/hoon:<[443 5].[449 57]>
/app/spider/hoon:<[442 5].[449 57]>
/app/spider/hoon:<[439 3].[450 5]>
/app/spider/hoon:<[438 3].[450 5]>
/app/spider/hoon:<[435 3].[450 5]>
/app/spider/hoon:<[431 3].[450 5]>
/app/spider/hoon:<[428 3].[450 5]>
/app/spider/hoon:<[426 3].[450 5]>
/app/spider/hoon:<[417 3].[450 5]>
/app/spider/hoon:<[413 3].[450 5]>
/app/spider/hoon:<[412 3].[450 5]>
/app/spider/hoon:<[401 3].[401 49]>
/app/spider/hoon:<[244 27].[244 78]>
/app/spider/hoon:<[242 7].[249 9]>
/app/spider/hoon:<[241 5].[250 17]>
/app/spider/hoon:<[239 5].[250 17]>
/app/spider/hoon:<[238 5].[250 17]>
/app/spider/hoon:<[237 5].[250 17]>
/sys/vane/gall/hoon:<[1.854 9].[1.854 37]>
```

### Analysis

In `+on-poke` we simply take `.ted` (the thread to run) and `.txt` (the starting argument string) and pass them to Khan in a [`%fard`](../../../../kernel/khan/tasks.md#fard) task card:

{% code overflow="nowrap" lineNumbers="false" %}
```hoon
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  =+  !<  [ted=@tas txt=@tas]  vase
  :_  this
  [%pass /thread %arvo %k %fard %base ted noun+!>(txt)]~
```
{% endcode %}

## Inline thread via Spider

In this example we'll start an inline thread via Spider and manually specify its ID. We'll not make use of its ID but it's useful to know how to do it. The process is similar when running a thread file from `/ted` too.

Save the following agent as `/app/inline-spider.hoon` in the `%base` desk of a fakezod:

<details>

<summary>/app/inline-spider.hoon code</summary>

{% code title="/app/inline-spider.hoon" overflow="nowrap" lineNumbers="true" %}

```hoon
/-  spider
/+  default-agent, dbug
=*  card  card:agent:gall
%-  agent:dbug
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
::
++  on-poke
  |=  [=mark vas=vase]
  ^-  (quip card _this)
  =+  !<  txt=@t  vas
  =/  =shed:khan
    =/  m  (strand:rand ,vase)
    ^-  form:m
    (pure:m !>(txt))
  =/  tid  `@ta`(cat 3 'thread_' (scot %uv (sham eny.bowl)))
  =/  args=inline-args:spider
    :*  parent=~
        use=(some tid)
        beak=byk.bowl(r da+now.bowl)
        shed=shed
    ==
  =/  =dock  [our.bowl %spider]
  :_  this
  :~  [%pass /thread/result/[tid] %agent dock %watch /thread-result/[tid]]
      [%pass /thread/start/[tid] %agent dock %poke %spider-inline !>(args)]
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?+    -.sign  (on-agent:def wire sign)
      %poke-ack
    ?~  p.sign
      %-  (slog leaf+"Thread started successfully" ~)
      `this
    %-  (slog leaf+"Thread failed to start" u.p.sign)
    `this
  ::
      %fact
    ?+    p.cage.sign  (on-agent:def wire sign)
        %thread-fail
      =/  err  !<  (pair term tang)  q.cage.sign
      %-  (slog leaf+"Thread failed: %{(trip p.err)}" q.err)
      `this
    ::
        %thread-done
      =+  !<  txt=@t  q.cage.sign
      %-  (slog leaf+"Thread success! Message: {(trip txt)}" ~)
      `this
    ==
  ==
::
++  on-arvo   on-arvo:def
++  on-init   on-init:def
++  on-save   on-save:def
++  on-load   on-load:def
++  on-watch  on-watch:def
++  on-leave  on-leave:def
++  on-peek   on-peek:def
++  on-fail   on-fail:def
--
```

{% endcode %}

</details>

In the dojo, run `|commit %base` then `|start %inline-spider`.

Now you can poke it from the Dojo with `:inline-spider 'foo'`. You should see:

{% code title="Dojo" overflow="nowrap" lineNumbers="false" %}
```
Thread started successfully
Thread success! Message: foo
```
{% endcode %}

### Analysis

The thread and behaviour is largely the same as the [Inline Thread via Khan](#inline-thread-via-khan) example, so instead we'll just focus on the parts that are pecular to using `%spider` directly.

The thread ID is created on this line in `+on-poke`:

```hoon
=/  tid  `@ta`(cat 3 'thread_' (scot %uv (sham eny.bowl)))
```

It just needs to be a unique `$knot`. Using `eny.bowl` is a good idea to ensure there are no name collisions.

Then we create the [`$inline-args`](../../api.md#run-inline-thread) starting arguments. If you were running a thread file rather than an inline thread you'd use `$start-args` instead, which is very similarly structured, but specifies a thread filename and argument in a vase instead of the `$shed:khan`.

```hoon
=/  args=inline-args:spider
  :*  parent=~
      use=(some tid)
      beak=byk.bowl(r da+now.bowl)
      shed=shed
  ==
```

The fields are:

- `.parent`: the parent thread ID if it's a child thread (a thread started by another thread). This isn't a child thread so it's just null.
- `.use`: this thread's ID, which we create earlier.
- `.beak`: we just use the agent's beak
- `.shed`: the inline thread itself.

We have to explicitly subscribe to Spider for the thread result. The path is just `/thread-result/[tid]`. It's important this is done *before* the poke that actually starts the thread, or the thread could be run before the subscription is processed:

```hoon
=/  =dock  [our.bowl %spider]
:_  this
:~  [%pass /thread/result/[tid] %agent dock %watch /thread-result/[tid]]
    [%pass /thread/start/[tid] %agent dock %poke %spider-inline !>(args)]
==
```

Then, in `+on-agent`, we handle the poke ack/nack and thread result `%fact`:

```hoon
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?+    -.sign  (on-agent:def wire sign)
      %poke-ack
    ?~  p.sign
      %-  (slog leaf+"Thread started successfully" ~)
      `this
    %-  (slog leaf+"Thread failed to start" u.p.sign)
    `this
  ::
      %fact
    ?+    p.cage.sign  (on-agent:def wire sign)
        %thread-fail
      =/  err  !<  (pair term tang)  q.cage.sign
      %-  (slog leaf+"Thread failed: %{(trip p.err)}" q.err)
      `this
    ::
        %thread-done
      =+  !<  txt=@t  q.cage.sign
      %-  (slog leaf+"Thread success! Message: {(trip txt)}" ~)
      `this
    ==
  ==
```

The thread can either succeed with a `%thread-done` mark and a `$vase` of the result, or fail with a `%thread-fail` mark and a `$goof`.

Note that poking spider directly with an explicitly provided thread ID is only useful if you want to interact with the thread while it's running, such as subscribing for facts, poking it, or prematurely killing it. We don't do any of that in our example, but the basic setup process used here would be the same.

