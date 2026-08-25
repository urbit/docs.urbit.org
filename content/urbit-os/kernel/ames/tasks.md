---
description: "Ames API reference - networking tasks for messaging, packet handling, remote scries, and ship communication."
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

# Ames API Reference

In this document we describe the public interface for Ames. Namely, we describe each task that Ames can be `%pass`ed, and which gift(s) Ames can `%give` in return.

Some tasks appear to have more than one arm associated to them, e.g. there are four `+on-hear` arms. We denote this where it occurs, but always refer to the `+on-hear:event-core` arm.

Ames tasks can be naturally divided into three categories: messaging tasks, system/lifecycle tasks, and remote scry tasks.

## Messaging Tasks <a href="#messaging-tasks" id="messaging-tasks"></a>

### `%hear` <a href="#hear" id="hear"></a>

```hoon
[%hear =lane =blob]
```

`%hear` handles raw packet receipt.

This task only ever originates from Unix. It does the initial processing of a packet, namely by passing the raw packet information to `+decode-packet` which deserializes the packet and giving that data and the origin of the packet to `+on-hear-packet`, which begins the transformation of the packet into a new event in the form of a `+event-core`.

There are multiple `+on-hear` arms in `ames.hoon`. Here we refer to `+on-hear:event-core`, as that is the one called by a `%hear` task. The other ones are used primarily for ack and nack processing, or receiving message fragments.

`%hear` takes in a [$blob](data-types.md#blob), which is essentially a large atom (around 1kB or less) that is the raw data of the message, and a [$lane](data-types.md#lane), which is the origin of the message (typically an IP address).

#### Returns

`%hear` can trigger a number of possible returns. It can trigger the release of zero or more additional packets via `%send` gifts. It may also trigger a `%boon` or `%plea` gift (collectively referred to as a `%memo` within Ames) to a local vane in the case of a completed message.

***

### `%halt` <a href="#halt" id="halt"></a>

```hoon
$>(%halt deep)
```

where the relevant case of [`$deep`](data-types.md#deep) is:

```hoon
[%halt =ship agent=term =bone]
```

`%halt` stops a flow after we hear a remote `%flub` — that is, after the peer's
Gall has told us the destination agent will not currently accept the `$plea`. A
halted flow stops re-sending; no new timers are started for it.

Ames also passes a `%halt` task *to Gall* in the other direction, which is how
the remote `%flub` gets emitted: Gall's `+mo-halt` gives a `%boon` carrying
`%flub` back to the `$plea` sender.

The flow's `halt` flag is set in either direction:

- forward: Gall passes a `%flub` to Ames.
- backward: a `$plea` gets `%flub`bed over the wire.

#### Returns

This task returns no gifts.

***

### `%goad` <a href="#goad" id="goad"></a>

```hoon
[%goad =ship]
```

`%goad` restarts flows to `.ship` that were previously halted, once the remote
agent is live again. Halted flows do not start new timers, so a `%goad` is what
gets them moving.

The `$ship` field specifies the peer whose flows should be restarted.

#### Returns

This task returns no gifts.

***

### `%plea` <a href="#plea" id="plea"></a>

```hoon
[%plea =ship =plea:ames]
```

`%plea` is the task used to instruct Ames to send a message. It extends the `%pass`/`%give` semantics across the network. As such, it is the most fundamental task in Ames and the primary reason for its existence.

Ames also `+pass`es a `%plea` `$note` to another vane when it receives a message on a "forward flow" from a peer, originally passed from one of the peer's vanes to the peer's Ames.

Ultimately `%plea` causes `%send` gift(s) to be sent to Unix, which tells Unix to send packets. In terms of `%pass`/`%give` semantics, this is in response to the `%born` task, which came along the Unix `$duct`, rather than a response to the `%plea`.

A `%plea` task takes in the `$ship` the `$plea` is addressed to, and a [`$plea`](data-types.md#plea).

#### Returns

This task returns no gifts.

***

## System Tasks <a href="#system-tasks" id="system-tasks"></a>

### `%born` <a href="#born" id="born"></a>

```hoon
[%born ~]
```

Each time you start your Urbit, the Arvo kernel calls the `%born` task for Ames.

#### Returns

In response to a `%born` task, Ames `%give`s Jael a `%turf` gift.

The `$duct` along which `%born` comes is Ames' only duct to Unix, so `%send` gifts (which are instructions for Unix to send a packet) are also returned in response to `%born`.

***

### `%init` <a href="#init" id="init"></a>

```hoon
[%init ~]
```

`%init` is called a single time during the very first boot process, immediately after the [larval stage](../arvo/README.md#larval-stage-core) is completed. This initializes the vane. Jael is initialized first, followed by other vanes such as Ames.

In response to receiving the `%init` task, Ames subscribes to the information contained by Jael.

#### Returns

```hoon
=~  (emit duct %pass /turf %j %turf ~)
    (emit duct %pass /private-keys %j %private-keys ~)
```

`%init` sends two moves that subscribe to `%turf` and `%private-keys` in Jael.

***

### `%sift` <a href="#sift" id="sift"></a>

```hoon
[%sift ships=(list ship)]
```

This task filters debug output by ship. This task is used internally when the `|ames/sift` `hood` generator is run from the Dojo.

The `.ships` field specifies the ships for which debug output is desired.

#### Returns

This task returns no gifts.

***

### `%snub` <a href="#snub" id="snub"></a>

```hoon
[%snub form=?(%allow %deny) ships=(list ship)]
```

This task blacklists/whitelists ships in Ames.

The `form` field specifies whether the given ships should be blacklisted or whitelisted. The `ships` field are the ships to blacklist/whitelist.

The Ames `snub` settings can only have one form at a time: an `%allow` list or `%deny` list. If an `%allow` form is set, packets from **all ships not on the list will be blocked**. If a `%deny` form is set, packets from **any ship on the list will be blocked, and all others allowed**.

{% hint style="info" %}
Note: a `%snub` task overrides the existing snub list and form entirely, it does not merely add/remove ships from the existing list.

If you just want to add/remove a ship from an existing blacklist/whitelist, you'll need to first [scry out the existing snub settings](scry.md#snubbed), make your changes, and send the whole modified list and form in a new `%snub` task.
{% endhint %}

#### Returns

This task returns no gifts.

***

### `%spew` <a href="#spew" id="spew"></a>

```hoon
[%spew veb=(list verb)]
```

Sets verbosity toggles on debug output. This task is used internally when the `|ames/verb` hood generator is run from the dojo.

`%spew` takes in a `+list` of [$verb](data-types.md#verb), which are verbosity flags for Ames.

`%spew` flips each toggle given in `veb`.

#### Returns

This task returns no gifts.

***

### `%stir` <a href="#stir" id="stir"></a>

```hoon
[%stir arg=@t]
```

A `%stir` task starts timers for any flows that lack them.

The `arg` field is unused.

#### Returns

This task returns no gifts.

***

### `%vega` <a href="#vega" id="vega"></a>

```hoon
[%vega ~]
```

`%vega` is called whenever the kernel is updated. Ames currently does not do anything in response to this.

#### Returns

This task returns no gifts.

***

## Remote scry tasks <a href="#remote-scry-tasks" id="remote-scry-tasks"></a>

### `%keen` <a href="#keen" id="keen"></a>

Perform an unencrypted or multi-party encrypted remote scry.

```hoon
[%keen sec=(unit [idx=@ key=@]) spar]
```

A `%keen` task asks Ames to perform a remote scry, retrieving the value of `$path` on the given `$ship` in the `$spar`. The `.sec` field provides optional encryption details for multi-party encrypted scries.

The `$path` has the general format of `/[vane-letter]/[care]/[revision]/[rest-of-path]`. For a regular read into Gall, it's `/g/x/[revision]/[agent]//[rest-of-path]`. Note the empty element in between the agent and the rest of the path.

Note that you would not use this task directly from userspace. For unencrypted or multi-party encrypted scries you'd use a [Gall `%keen` note](../gall/gall-api.md#keen) and for two-party encrypted scries you'd use a [`%chum`](tasks.md#chum) task.

#### Returns

A `%tune` gift. A `%tune` gift looks like:

```hoon
[%tune spar roar=(unit roar)]
```

It represents a _result_. The `$roar` field is null if Ames doesn't have a response, but may have one in the future. The [`$roar`](data-types.md#roar) contains a signature and the data. The data in the `$roar` will be null if there is no value at the path in question and will never be. These two cases are equivalent to `~` and `[~ ~]` of a local scry.

***

### `%chum` <a href="#chum" id="chum"></a>

Perform a two-party encrypted remote scry.

```hoon
[%chum spar]
```

A `$spar` is a pair of `$ship` and remote scry `$path` like `/c/x/4/base/sys/hoon/hoon`.

The `$path` has the general format of `/[vane-letter]/[care]/[revision]/[rest-of-path]`. For a regular read into Gall, it's `/g/x/[revision]/[agent]//[rest-of-path]`. Note the empty element in between the agent and the rest of the path.

Note this is for two-party encrypted remote scries only. For unencrypted or multi-party encrypted scries you'd use a [Gall `%keen` note](../gall/gall-api.md#keen).

#### Returns

A `%tune` gift. A `%tune` gift looks like:

```hoon
[%tune spar roar=(unit roar)]
```

It represents a _result_. The `$roar` field is null if Ames doesn't have a response, but may have one in the future. The [`$roar`](data-types.md#roar) contains a signature and the data. The data in the `$roar` will be null if there is no value at the path in question and will never be. These two cases are equivalent to `~` and `[~ ~]` of a local scry.

***

### `%yawn` <a href="#yawn" id="yawn"></a>

Cancel a remote scry request.

```hoon
[%keen =ship =path]
```

A `%yawn` task asks Ames to cancel an existing remote scry request to the given `$path` on the given `$ship`.

#### Returns

This task returns no gifts.

***

### `%wham` <a href="#wham" id="wham"></a>

```hoon
[%wham =ship =path]
```

A `%wham` task asks Ames to cancel all existing remote scry requests from all vanes on all ducts for the given `$path` on the given `$ship`.

#### Returns

A `%tune` gift with a null `$data` is given to all listeners. See the [`%keen`](tasks.md#keen) entry for more details of the `%tune` gift.

***
