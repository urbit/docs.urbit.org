# Remote Scry

To [scry](../../../glossary/scry.md) is to perform a *read* from Urbit's referentially transparent namespace. In other words, it's a function from a `path` to a `noun` (although in some cases, the resulting type may be more constrained). Previously we only supported scrying within the same ship, but from Kernel version `[%zuse 413]`, it is possible to scry from *other* ships.

## Lifecycle of a scry {#lifecycle-of-a-scry}

When you think of scry, you probably think of `.^` [dotket](../../../language/hoon/reference/rune/dot.md#dotket). However, since networking is asynchronous, this is not a suitable interface for remote scry. Instead, a ship that wants to read from a remote part of the namespace will have to (directly or indirectly) ask Ames to perform the scry, which then cooperates with [Vere](../../../glossary/vere.md) to produce the desired data. In some future event when the result is available, Ames gives it back as a `%tune` gift. From the requester's perspective, this is the entire default lifecycle of a remote scry request.

Of course, you need to know how Ame's `%chum` and `%tune` look, as well as Gall's `%keen` note, to be able to use them. There are also a few exceptions to this default lifecycle. We'll go through all of this in a moment, but first, let's look at what kind of data is possible to scry.

## Publishing {#publishing}

At the moment, there are two vanes that can handle remote scry requests: [Clay](../../../glossary/clay.md) and [Gall](../../../glossary/gall.md). Clay uses it to distribute source code in a more efficient manner than is possible with conventional Ames, but conceptually it only extends its [local scries](../../../system/kernel/clay/reference/scry.md) over the network, with the notable difference that you can't scry at the *current* time, since the requester doesn't know when the request reaches the publisher. Additionally, the paths are modified so that the vane and care are specified separately, like so: `/c/x/1/base/sys/hoon/hoon`.

Gall is more interesting. First, let's clear up a possible misunderstanding that could easily come up: remote scry does *not* involve calling an agent's `+on-peek` arm. `+on-peek` scries always happen at the current time, and since the requester can't know at which time the publisher handles the request, these aren't possible to reliably serve.

Instead, agents *ask* Gall to `%grow` nouns to paths in the namespace on their behalf, and Gall stores the data in *its* state (not in the agent's state). Gall will take care of incrementing version numbers, so that the same path never maps to different nouns. The agent can also ask Gall to delete data, either at a specific version number, or everything up to and including a version number.

{% hint style="info" %}

Note: we'll only discuss the basic case of unencrypted and two-party encrypted scries here. Gall also supports multi-party encrypted scries with access control, which we'll look at in the next section.

{% endhint %}

`$note:agent:gall` includes the following cases:

{% code title="/sys/lull.hoon" overflow="nowrap" %}

```hoon
+$  note
  $%  ::  ...
      [%grow =spur =page]  ::  publish
      [%tomb =case =spur]  ::  delete one
      [%cull =case =spur]  ::  delete up to
      ::  ...
  ==
```

{% endcode %}

Here's an example sequence of cards that use these:

{% code overflow="nowrap" %}

```hoon
[%pass /call/back/path %grow /foo atom+'lorem']  ::  /foo version 0
[%pass /call/back/path %grow /foo atom+'ipsum']  ::  /foo version 1
[%pass /call/back/path %grow /foo atom+'dolor']  ::  /foo version 2
[%pass /call/back/path %grow /foo atom+'sit']    ::  /foo version 3

[%pass /call/back/path %tomb ud+3 /foo]          ::  delete /foo version 3
[%pass /call/back/path %cull ud+1 /foo]          ::  delete /foo 0 through 1

[%pass /call/back/path %grow /foo atom+'amet']   ::  /foo version 4
[%pass /call/back/path %grow /foo/bar atom+123]  ::  /foo/bar version 0
```

{% endcode %}

After this sequence of cards we would have the following mappings (assuming the agent that emits them is named `%test`):

{% code overflow="nowrap" %}

```
/g/x/2/test//foo     -> [%atom 'dolor']
/g/x/4/test//foo     -> [%atom 'amet']
/g/x/0/test//foo/bar -> [%atom 123]
```

{% endcode %}

Let's pick apart the first one of these paths.

{% code overflow="nowrap" %}

```hoon
/g     ::  g for Gall
/x     ::  a care of %x generally means "normal read"
/2     ::  version number
/test  ::  the agent that published the data
/      ::  ???
/foo   ::  the path that the data is published on
```

{% endcode %}

What's that lone `/` before the path? It signifies that this data is published by *Gall* itself, instead of the `+on-peek` arm in the `%test` agent. As part of the remote scry release, we have *reserved* part of the scry namespace for Gall, effectively *preventing* any agents from directly publishing at those paths. Though as we've seen, they can do it indirectly, by asking Gall to do it for them using `%grow`.

As long as the extra `/` is included, Gall will serve scries with care `%x` at both specific revision numbers and at arbitrary times. If the extra `/` is not included, the scry has to happen at the current time, since we don't cache old results of calling `+on-peek`.

### Additional Gall cares {#additional-gall-cares}

Apart from supporting reads using the `%x` care, Gall now also supports three new cares:

- `%t` lists all subpaths that are bound under a path (only supported at the current time, i.e. not remotely!).
- `%w` gives the latest revision number for a path (only supported at the current time, i.e. not remotely!).
- `%z` gives the hash identifier of the value bound at the path (supported at any time and at specific revisions, but not remotely).

All of these require the extra `/` to be present in the path, just as with `%x`.

## Encryption {#encryption}

As well as ordinary unencrypted scries, Ames also supports two-party and multi-party encrypted scries. Two-party encryption doesn't require any additional steps on the publisher's side, but multi-party encryption does:

1. A *security context* must be created.
2. You must implement an access-control scry handler for that security context in the `++on-peek` arm.
3. Data must be published to that security context.

A security context is called a `coop`, which is just a `path` of your choosing, like `/foo/bar/baz`.

`$note:agent:gall` includes the following two `note`s for managing security contexts and publishing data to them:

{% code overflow="nowrap" %}

```hoon
$%  ...
    [%tend =coop =path =page]
    [%germ =coop]
    ...
==
```

{% endcode %}

#### `%germ`

{% code title="/sys/lull.hoon" wrap="nowrap" %}

```hoon
[%germ =coop]
```

{% endcode %}

The `%germ` note creates the *security context* specified in the `coop`. It's just a `path` of your choice, like `/foo/bar/baz`. Once created, you can publish data to it with a [`%tend`](#tend) note.

Example:

{% code wrap="nowrap" %}

```hoon
[%pass /call/back/path %germ /foo/bar/baz]
```

{% endcode %}

#### `%tend`

{% code title="/sys/lull.hoon" wrap="nowrap" %}

```hoon
[%tend =coop =path =page]
```

{% endcode %}

The `%tend` note publishes the given `page` to the given `path` in the given `coop` security context. This is the same as a `%grow` note, just with the addition of the security context. The only difference is that access is limited to those allowed in the `coop`.

### Access control {#access-control}

For each security context created with the `%tend` task described above, the `++on-peek` arm of the agent should provide a scry handler for it, to decide whether a ship is allowed to access the resource or not. The scry path looks like:

{% code wrap="nowrap" %}

```hoon
/c/your/security/context/~sampel-palnet
```

{% endcode %}

It has a `%c` `care`, the security context (in this case `/your/security/context`), and then the ship in question (`~sampel-palnet`). It must return a `?` boolean in a `%noun` mark which is true if the ship is allowed to access that security context, and false if not. How you determine whether a ship is allowed is up to you. Here's a trivial example:

{% code wrap="nowrap" %}

```hoon
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?.  ?=([%c %your %security %context @ ~] path)
    ~
  =/  =ship  (slav %p i.t.t.t.t.path)
  ?:  =(~dinleb-rambep ship)  :: your whitelist logic here
    ``[%noun !>(%.y)]
  ``[%noun !>(%.n)]
```

{% endcode %}

Note this is unnecessary for unencrypted and two-party encrypted remote scries, only for files you publish in a security context with the [`%tend`](#tend) note.

## Scrying {#scrying}

Now we've looking at the publisher side, let's look at actually performing remote scries. There is one `$note:agent:gall` for performing unencrypted and multi-party encrypted remote scries, one Ames task for performing two-party encrypted remote scries, and two Ames tasks for cancelling pending remote scries. We'll look at each of these.

### Tasks and Notes {#tasks-and-notes}

#### `%keen`

{% code title="/sys/lull.hoon" wrap="nowrap" %}

```hoon
[%keen secret=? spar:ames]
```

{% endcode %}

The `%keen` note performs either an unencrypted scry or a multi-party encrypted scry.

{% hint style="info" %}

Note that this is a `$note:agent:gall`, and is not to be confused with the Ames task of the same name. Under the hood, Gall will still use the `%keen` Ames task, but this way you don't have to deal with encryption keys. You shouldn't use the Ames task directly.

{% endhint %}

The `secret` boolean specifies whether it should be a multi-party encrypted scry or an ordinary unencrypted scry. The `spar` is a pair of `ship` and scry `path`.

For an unencrypted remote scry to read (`%x` care) the `/sys/hoon/hoon` file from the `%base` desk at revision `4` in Clay (`%c`) on the `~sampel` ship, it would look like:

{% code wrap="nowrap" %}

```hoon
[%pass /your/wire %keen %.n ~sampel /c/x/4/base/sys/hoon/hoon]
```

{% endcode %}

For an unencrypted scry to the `%example` agent in Gall (`%g`) of the `~sampel` ship at `/foo` path, revision `4`, it would look like:

{% code wrap="nowrap" %}

```hoon
[%pass /your/wire %keen %.n ~sampel /g/x/4/example//1/foo]
```

{% endcode %}

{% hint style="info" %}

Notice the `//` empty path element differentiating an agent scry from a Gall vane scry.

Additionally, notice the `1` at the beginning of the path portion after the empty element. This is a path format version number introduced in `[%zuse 411]` to facilitate easier path format changes in the future. _All remote scries to Gall agents must include the path format version number._ Scries to places other than Gall agents are unaffected.

{% endhint %}

For a multi-party encrypted scry to the `%example` agent in Gall (`%g`) of the `~sampel` ship at the `/foo` path, revision `4` in the `/my/context` security context, it would look like:

{% code wrap="nowrap" %}

```hoon
[%pass /your/wire %keen %.y ~sampel /g/x/4/example//1/my/context/foo]
```

{% endcode %}

Notice the `/my/context` security context and `/foo` path are combined into a single continuous path.

You will receive a [`%tune`](#tune) gift from Ames with the response once completed.

#### `%chum`

{% code title="/sys/lull.hoon" wrap="nowrap" %}

```hoon
[%chum spar]
```

{% endcode %}

The Ames `%chum` task performs a two-party encrypted remote scry. It behaves exactly the same as an unencrypted remote scry except that it's encrypted. You don't need a security context for this kind of remote scry & an unencrypted `%keen` can be swapped out for this without the publisher having to change any of their app logic. For details of the `spar` format, see the [`%keen` note entry above](#keen).

Example:

{% code wrap="nowrap" %}

```hoon
[%pass /your/wire %arvo %a %chum ~sampel /g/x/4/example//1/foo]
```

{% endcode %}

You will receive a [`%tune`](#tune) gift from Ames with the response once completed.

#### `%yawn`

{% code title="/sys/lull.hoon" wrap="nowrap" %}

```hoon
[%yawn spar]
```

{% endcode %}

A `%yawn` Ames task tells Ames that *we're* no longer interest in a response from a pending request to the given `spar`. Ames uses the `duct` to determine which requests to cancel, which means the `wire` must be the same as the original `%chum` task or `%keen` note. Ames wi

Example:

{% code wrap="nowrap" %}

```hoon
[%pass /call/back/path %arvo %a %yawn ~sampel /g/x/4/test//foo]
```

{% endcode %}

You will receive a [`%tune`](#tune) gift from Ames with a null `roar` for any pending requests.

#### `%wham`

{% code title="/sys/lull.hoon" wrap="nowrap" %}

```hoon
[%wham spar]
```

{% endcode %}

A `%wham` task to Ames tells Ames to cancel all pending requests to the given `spar`, regardless of where it came from on our ship. This will cancel pending requests from other agents or vanes too, so be careful.

Example:

{% code wrap="nowrap" %}

```hoon
[%pass /call/back/path %arvo %a %wham ~sampel /g/x/4/test//foo]
```

{% endcode %}

Everything on the ship with pending requests to the given `spar` will receive a [`%tune`](#tune) gift from Ames with a null `roar`.

### Gifts {#gifts}

There is only one kind of response you can receive from Ames for any kind of remote scry: a [`%tune`](#tune) gift.

#### `%tune`

In response to any kind of remote scry, Ames returns a `%tune` gift, which looks like:

{% code title="/sys/lull.hoon" wrap="nowrap" %}

```hoon
[%tune spar roar=(unit roar)]
```

{% endcode %}

The `spar` is the `ship` and `path` the request was made to, and the `roar` is the response. The outer `unit` of `roar` will be `~` if Ames doesn't have a response, but may have one in the future. Otherwise, it will contain a signature and the data. The data in the [`$roar`](../../../system/kernel/ames/reference/data-types.md#roar) may be `~`, meaning that there is no value at this path and will never be one.

You'll receive a `%tune` whether it failed or succeeded on the target ship, as well as if the request was cancelled locally.

## `-keen` {#keen}

In addition to the above interface offered to agents, there is also support for making scry requests from threads using `+keen` in `lib/strandio`. It accepts a `[=ship =path]` and returns a `(unit page)`. There is also a [thread `ted/keen` that demonstrates this](https://github.com/urbit/urbit/blob/i/5788/remote-scry/pkg/arvo/ted/keen.hoon). You can run it from the dojo using `-keen [ship path]`. For example, this reads the `%noun` mark's source code out of `~zod`'s `%kids` desk, try it!

{% code title="Dojo" wrap="nowrap" %}

```
-keen [~zod /c/x/1/kids/mar/noun/hoon]
```

{% endcode %}

## Additional reading {#additional-reading}

- [Gall scry reference](../../../system/kernel/gall/reference/scry.md): Reference documentation of Gall's vane-level and agent-level scry interface.

- [Ames API reference](../../../system/kernel/ames/reference/tasks.md): Reference documentation of `task`s that can be passed to Ames, including those for remote scries.
