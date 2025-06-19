---
description: "Guide to Gall agent scry functionality covering read-only data requests with the .^ dotket rune, +on-peek arm implementation, endpoint patterns, and practical examples."
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

# 10. Scries

In this lesson we'll look at scrying agents, as well as how agents handle such scries. If you're not at all familiar with performing scries in general, have a read through the [Scry Guide](../../urbit-os/kernel/arvo/scry.md), as well as the [dotket rune documentation](../../hoon/rune/dot.md#dotket).

## Scrying {#scrying}

A scry is a read-only request to Arvo's global namespace. Vanes and agents define "scry endpoints" which allow data to be requested from their states. The endpoints can process the data in any way before returning it, but they cannot alter the actual state - scries can only read, not modify.

Gall itself defines some special vane-level endpoints [as described in its scry reference](../../urbit-os/kernel/gall/scry.md), but most scries to Gall are routed to particular agents and handled by them instead. Agent scries are what we'll focus on here. 

Scries are performed with the [dotket](../../hoon/rune/dot.md#dotket) (`.^`) rune. Here's a summary of their format:

![](https://media.urbit.org/docs/arvo/scry-diagram-v2.svg)

A note on `$care`s: Cares are most carefully implemented by Clay, where they specify submodules and have tightly defined behaviors. For Gall agents, most of these don't have any special behavior, and are just used to indicate the general kind of data produced by the endpoint, with the exception of the `%x` care:

#### `%x`

Gall handles `%x` specially, and expects an extra field at the end of the `$path` that specifies the `$mark` to return. Gall will take the data produced by the specified endpoint and try to convert it to the given mark, crashing if the mark conversion fails. The extra field specifying the mark is not passed through to the agent itself. Here's a couple of examples:

```
> =g -build-file /=groups=/sur/groups/hoon

> .^(groups:g %gx /=groups=/groups/noun)
[   n
  [ p=[p=~zod q=%test-group]
      q
    [ fleet=[n=[p=~zod q=[sects=[n=%admin l={} r={}] joined=~2000.1.1]] l=~ r=~]
        cabals
      ...

> (en:json:html .^(json %gx /=profile=/widgets/json/json))
'{"groups":{"profile":"Profile Header","profile-bio":"Profile Bio","join-button":"\\"Join me\\" button"}}'
```

The majority of Gall agents simply take `%x` `$care`s in their scry endpoints, but in principle it's possible for a Gall agent to define a scry endpoint that takes any one of the `$care`s listed in the diagram above. An agent's scry endpoints are defined in its `+on-peek` arm, which we'll look at next.

## Handling scries {#handling-scries}

When a scry is performed on a Gall agent, Gall will strip out some extraneous parts, and deliver it to the agent's `+on-peek` arm as a `$path`. The `$path` will only have two components from the diagram above: The "care" and the "path". For example, a scry of `.^(groups:g %gx /=groups=/groups/noun)` will come into the `+on-peek` arm of `%groups` as `/x/groups`.

The `+on-peek` arm produces a `(unit (unit cage))`. The reason for the double `+unit` is that Arvo interprets `~` to mean the scry path couldn't be resolved, and interprets `[~ ~]` to means it resolved to nothing. In either case the dotket expression which initiated the scry will crash. The `$cage` will contain the actual data to return.

An ordinary `+on-peek` arm, therefore, begins like so:

```hoon
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ....
```

Typically, you'd handle the `$path` similarly to `+on-watch`, as we discussed in the lesson on subscriptions. You'd use something like a [wutlus](../../hoon/rune/wut.md#wutlus) `?+` expression to test the value of the `$path`, defining your scry endpoints like so:

```hoon
?+    path  (on-peek:def path)
    [%x %some %path ~]  ....
    [%x %foo ~]    ....
    [%x %blah @ ~]
  =/  =ship  (slav %p i.t.t.path)
  .....
....
```

Each endpoint would then compose the `(unit (unit cage))`. The simplest way to format it is like:

```hoon
``noun+!>('some data')
```

If it requires a more complex expression to retrieve or compose the data, you can do something like:

```hoon
:^  ~  ~  %some-mark
!>  ^-  some-type
:+  'foo'
  'bar'
'baz'
```

Previously we discussed custom mark files. Such mark files are most commonly used when the data might be accessed through Eyre's HTTP API, and therefore require JSON conversion methods. We cover such things separately in the [Full-Stack Walkthrough](../app-school-full-stack), but note that if that's the case for your agent, you may wish to also have your scry endpoints return data with your custom `$mark` so it can easily be converted to JSON when accessed from the web.

In some cases, typically with scry `$path`s that contain wildcards like the `[%x %blah @ ~]` example above, your agent may not always be able to find the requested data. In such cases, you can just produce a cell of `[~ ~]` for the `(unit (unit cage))`. Keep in mind, however, that this will result in a crash for the dotket expression which initiated the scry. In some cases you may want that, but in other cases you may not, so instead you could wrap the data inside the `$vase` in a `+unit` and have _that_ be null instead. It all depends on the needs of your particular application and its clients.

## Example {#example}

Here's a simple example agent with three scry endpoints:

<details>
<summary>/app/peeker.hoon</summary>

```hoon
/+  default-agent, dbug
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 data=(map @p @t)]
+$  card  card:agent:gall
--
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %.n) bowl)
::
++  on-init
  ^-  (quip card _this)
  `this
::
++  on-save
  ^-  vase
  !>(state)
::
++  on-load
  |=  old-state=vase
  ^-  (quip card _this)
  =/  old  !<(versioned-state old-state)
  ?-  -.old
    %0  `this(state old)
  ==
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?>  =(src.bowl our.bowl)
  ?+    mark  (on-poke:def mark vase)
      %noun
    `this(data (~(put by data) !<([@p @t] vase)))
  ==
::
++  on-watch  on-watch:def
++  on-leave  on-leave:def
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+    path  (on-peek:def path)
      [%x %all ~]  ``noun+!>(data)
  ::
      [%x %has @ ~]
    =/  who=@p  (slav %p i.t.t.path)
    ``noun+!>(`?`(~(has by data) who))
  ::
      [%x %get @ ~]
    =/  who=@p  (slav %p i.t.t.path)
    =/  maybe-res  (~(get by data) who)
    ?~  maybe-res
      [~ ~]
    ``noun+!>(`@t`u.maybe-res)
  ==
::
++  on-agent  on-agent:def
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
```

</details>

The agent's `+on-poke` arm takes a cell of `[@p @t]` and saves it in the agent's state, which contains a `(map @p @t)` called `.data`. The `+on-peek` arm is:

```hoon
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+    path  (on-peek:def path)
      [%x %all ~]  ``noun+!>(data)
  ::
      [%x %has @ ~]
    =/  who=@p  (slav %p i.t.t.path)
    ``noun+!>(`?`(~(has by data) who))
  ::
      [%x %get @ ~]
    =/  who=@p  (slav %p i.t.t.path)
    =/  maybe-res  (~(get by data) who)
    ?~  maybe-res
      [~ ~]
    ``noun+!>(`@t`u.maybe-res)
  ==
```

It defines three scry endpoints, all using a `%x` `$care`: `/x/all`, `/x/has/[ship]`, and `/x/get/[ship]`. The first will simply return the entire `(map @p @t)` in the agent's state. The second will check whether the given ship is in the map and produce a `?`. The third will produce the `@t` for the given `@p` if it exists in the map, or else return `[~ ~]` to indicate the data doesn't exist, producing a crash in the dotket expression.

Let's try it out. Save the agent above as `/app/peeker.hoon` in the `%base` desk, `|commit %base` and start the agent with `|rein %base [& %peeker]`.

First, let's add some data to the map:

```
> :peeker [~zod 'foo']
>=
> :peeker [~nut 'bar']
>=
> :peeker [~wet 'baz']
>=
```

Now if we use `+dbug` to inspect the state, we'll see the data has been added:

```
>   [n=[p=~zod q='foo'] l=[n=[p=~wet q='baz'] l={} r={[p=~nut q='bar']}] r=~]
> :peeker +dbug [%state %data]
>=
```

Next, let's try the `/x/all` scry endpoint:

```
> .^((map @p @t) %gx /=peeker=/all/noun)
[n=[p=~zod q='foo'] l=[n=[p=~wet q='baz'] l={} r={[p=~nut q='bar']}] r=~]
```

The `/x/has/[ship]` endpoint:

```
> .^(? %gx /=peeker=/has/~zod/noun)
%.y
> .^(? %gx /=peeker=/has/~wet/noun)
%.y
> .^(? %gx /=peeker=/has/~nes/noun)
%.n
```

And finally, the `/x/get/[ship]` endpoint:

```
> .^(@t %gx /=peeker=/get/~zod/noun)
'foo'
> .^(@t %gx /=peeker=/get/~wet/noun)
'baz'
```

We'll now try scrying for a ship that doesn't exist in the map.

```
~zod:dojo> .^(@t %gx /=peeker=/get/~nes/noun)
bail: 4

bail: 2
dojo: failed to process input
```

## Summary {#summary}

- Scries are read-only requests to vanes or agents which can be done inside any code, during its evaluation.
- Scries are performed with the dotket (`.^`) rune.
- Scries will fail if the scry endpoint does not exist, the requested data does not exist, or the data does not nest in the return type specified.
- Scries can only be performed on the local ship, not on remote ships.
- Gall scries with an agent name in the `/[desk]` field and without an extra empty element at the beginning of the path will be passed to that agent's `+on-peek` arm for handling.
- Gall scries with a `%x` `$care` take a `$mark` at the end of the scry `$path`, telling Gall to convert the data returned by the scry endpoint to the mark specified.
- The `+on-peek` arm takes a `$path` with the `care` in the head and the `$path` part of the scry in the tail, like `/x/some/path`.
- The `+on-peek` arm produces a `(unit (unit cage))`. The outer `+unit` is null if the scry endpoint does not exist, and the inner `+unit` is null if the data does not exist.

## Exercises {#exercises}

- Have a read through the [Scry Guide](../../urbit-os/kernel/arvo/scry.md).
- Have a look at Gall's [scry reference](../../urbit-os/kernel/gall/scry.md).
- Have a read through the [dotket rune documentation](../../hoon/rune/dot.md#dotket).
- Run through the [Example](#example) yourself if you've not done so already.
- Try adding another scry endpoint to the `%peeker` agent, which uses a [`wyt:by`](../../hoon/stdlib/2i.md#wytby) map function to produce the number of items in the `.data` map.
- Have a look through the `+on-peek` arms of some other agents on your ship, and try performing some scries to some of the endpoints.
