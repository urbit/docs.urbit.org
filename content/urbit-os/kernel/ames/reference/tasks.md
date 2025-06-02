# API Reference

In this document we describe the public interface for Ames. Namely, we describe each `task` that Ames can be `%pass`ed, and which `gift`(s) Ames can `%give` in return.

Some `task`s appear to have more than one arm associated to them, e.g. there are four `+on-hear` arms. We denote this where it occurs, but always refer to the `+on-hear:event-core` arm.

Ames `task`s can be naturally divided into three categories: messaging tasks, system/lifecycle tasks, and remote scry tasks.

## Messaging Tasks {#messaging-tasks}

### `%hear` {#hear}

```hoon
[%hear =lane =blob]
```

`%hear` handles raw packet receipt.

This `task` only ever originates from Unix. It does the initial processing of a packet, namely by passing the raw packet information to `+decode-packet` which deserializes the packet and giving that data and the origin of the packet to `+on-hear-packet`, which begins the transformation of the packet into a new event in the form of a `+event-core`.

There are multiple `+on-hear` arms in `ames.hoon`. Here we refer to `+on-hear:event-core`, as that is the one called by a `%hear` `task`. The other ones are used primarily for ack and nack processing, or receiving message fragments.

`%hear` takes in a [$blob](data-types.md#blob), which is essentially a large atom (around 1kB or less) that is the raw data of the message, and a [$lane](data-types.md#lane), which is the origin of the message (typically an IP address).

#### Returns

`%hear` can trigger a number of possible returns. It can trigger the release of zero or more additional packets via `%send` `gift`s. It may also trigger a `%boon` or `%plea` `gift` (collectively referred to as a `%memo` within Ames) to a local vane in the case of a completed message.

---

### `%heed` {#heed}

```hoon
[%heed =ship]
```

A vane can pass Ames a `%heed` `task` to request Ames track a peer's responsiveness. If our `%boon`s to it start backing up locally, Ames will `give` a `%clog` back to the requesting vane containing the unresponsive peer's Urbit address.

Stop tracking a peer by sending Ames a [%jilt](#jilt) `task`.

The `ship` field specifies the peer to be tracked.

#### Returns

If the `ship` is indeed being unresponsive, as measured by backed up `%boon`s, Ames will `give` a `%clog` `gift` to the requesting vane containing the unresponsive peer's urbit address.

---

### `%jilt` {#jilt}

```hoon
[%jilt =ship]
```

`%jilt` stops tracking a potentially unresponsive peer that was previously being tracked as a result of the [%heed](#heed) `task`.

There are two `+on-jilt` arms, this `task` utilizes `+on-hear:event-core`.

The `ship` field specifies the peer we want to stop tracking.

#### Returns

This `task` returns no `gift`s.

---

### `%plea` {#plea}

```hoon
[%plea =ship =plea:ames]
```

`%plea` is the `task` used to instruct Ames to send a message. It extends the `%pass`/`%give` semantics across the network. As such, it is the most fundamental `task` in Ames and the primary reason for its existence.

Ames also `pass`es a `%plea` `note` to another vane when it receives a message on a "forward flow" from a peer, originally passed from one of the peer's vanes to the peer's Ames.

Ultimately `%plea` causes `%send` `gift`(s) to be sent to Unix, which tells Unix to send packets. In terms of `%pass`/`%give` semantics, this is in response to the `%born` `task`, which came along the Unix `duct`, rather than a response to the `%plea`.

A `%plea` `task` takes in the `ship` the `plea` is addressed to, and a [$plea](data-types.md#plea).

#### Returns

This `task` returns no `gift`s.

---

## System Tasks {#system-tasks}

### `%born` {#born}

```hoon
[%born ~]
```

Each time you start your Urbit, the Arvo kernel calls the `%born` `task` for Ames.

#### Returns

In response to a `%born` `task`, Ames `%give`s Jael a `%turf` `gift`.

The `duct` along which `%born` comes is Ames' only duct to Unix, so `%send` `gift`s (which are instructions for Unix to send a packet) are also returned in response to `%born`.

---

### `%init` {#init}

```hoon
[%init ~]
```

`%init` is called a single time during the very first boot process, immediately after the [larval stage](../../arvo#larval-stage-core) is completed. This initializes the vane. Jael is initialized first, followed by other vanes such as Ames.

In response to receiving the `%init` `task`, Ames subscribes to the information contained by Jael.

#### Returns

```hoon
=~  (emit duct %pass /turf %j %turf ~)
    (emit duct %pass /private-keys %j %private-keys ~)
```

`%init` sends two moves that subscribe to `%turf` and `%private-keys` in Jael.

---

### `%sift` {#sift}

```hoon
[%sift ships=(list ship)]
```

This `task` filters debug output by ship. This `task` is used internally when the `|ames/sift` `hood` generator is run from the dojo.

The `ships` field specifies the ships for which debug output is desired.

#### Returns

This `task` returns no `gift`s.

---

### `%snub` {#snub}

```hoon
[%snub form=?(%allow %deny) ships=(list ship)]
```

This `task` blacklists/whitelists ships in Ames.

The `form` field specifies whether the given ships should be blacklisted or whitelisted. The `ships` field are the ships to blacklist/whitelist.

The Ames `snub` settings can only have one form at a time: an `%allow` list or `%deny` list. If an `%allow` form is set, packets from **all ships not on the list will be blocked**. If a `%deny` form is set, packets from **any ship on the list will be blocked, and all others allowed**.

{% hint style="info" %}

Note: a `%snub` `task` overrides the existing snub list and form entirely, it does not merely add/remove ships from the existing list.

If you just want to add/remove a ship from an existing blacklist/whitelist, you'll need to first [scry out the existing snub settings](scry.md#snubbed), make your changes, and send the whole modified list and form in a new `%snub` `task`. 

{% endhint %}

#### Returns

This `task` returns no `gift`s.

---

### `%spew` {#spew}

```hoon
[%spew veb=(list verb)]
```

Sets verbosity toggles on debug output. This `task` is used internally when the `|ames/verb` `hood` generator is run from the dojo.

`%spew` takes in a `list` of [$verb](data-types.md#verb), which are verbosity flags for Ames.

`%spew` flips each toggle given in `veb`.

#### Returns

This `task` returns no `gift`s.

---

### `%stir` {#stir}

```hoon
[%stir arg=@t]
```

A `%stir` `task` starts timers for any flows that lack them.

The `arg` field is unused.

#### Returns

This `task` returns no `gift`s.

---

### `%vega` {#vega}

```hoon
[%vega ~]
```

`%vega` is called whenever the kernel is updated. Ames currently does not do anything in response to this.

#### Returns

This `task` returns no `gift`s.

---

## Remote scry tasks {#remote-scry-tasks}

### `%keen` {#keen}

Perform an unencrypted or multi-party encrypted remote scry.

```hoon
[%keen sec=(unit [idx=@ key=@]) spar]
```

A `%keen` `task` asks Ames to perform a remote scry, retrieving the value of `path` on the given `ship` in the `spar`. The `sec` field provides optional encryption details for multi-party encrypted scries.

The `path` has the general format of `/[vane-letter]/[care]/[revision]/[rest-of-path]`. For a regular read into Gall, it's `/g/x/[revision]/[agent]//[rest-of-path]`. Note the empty element in between the agent and the rest of the path.

Note that you would not use this task directly from userspace. For unencrypted or multi-party encrypted scries you'd use a [Gall `%keen` note](../../gall/reference/gall-api.md#keen) and for two-party encrypted scries you'd use a [`%chum`](#chum) task.

#### Returns

A `%tune` gift. A `%tune` gift looks like:

```hoon
[%tune spar roar=(unit roar)]
```

It represents a *result*. The `roar` field is null if Ames doesn't have a response, but may have one in the future. The [`$roar`](data-types.md#roar) contains a signature and the data. The data in the `$roar` will be null if there is no value at the path in question and will never be. These two cases are equivalent to `~` and `[~ ~]` of a local scry.

---

### `%chum` {#chum}

Perform a two-party encrypted remote scry.

```hoon
[%chum spar]
```

A `spar` is a pair of `ship` and remote scry `path` like `/c/x/4/base/sys/hoon/hoon`.

The `path` has the general format of `/[vane-letter]/[care]/[revision]/[rest-of-path]`. For a regular read into Gall, it's `/g/x/[revision]/[agent]//[rest-of-path]`. Note the empty element in between the agent and the rest of the path.

Note this is for two-party encrypted remote scries only. For unencrypted or multi-party encrypted scries you'd use a [Gall `%keen` note](../../gall/reference/gall-api.md#keen).

#### Returns

A `%tune` gift. A `%tune` gift looks like:

```hoon
[%tune spar roar=(unit roar)]
```

It represents a *result*. The `roar` field is null if Ames doesn't have a response, but may have one in the future. The [`$roar`](data-types.md#roar) contains a signature and the data. The data in the `$roar` will be null if there is no value at the path in question and will never be. These two cases are equivalent to `~` and `[~ ~]` of a local scry.

---

### `%yawn` {#yawn}

Cancel a remote scry request.

```hoon
[%keen =ship =path]
```

A `%yawn` task asks Ames to cancel an existing remote scry request to the given `path` on the given `ship`.

#### Returns

This `task` returns no `gift`s.

---

### `%wham` {#wham}

```hoon
[%wham =ship =path]
```

A `%wham` task asks Ames to cancel all existing remote scry requests from all vanes on all ducts for the given `path` on the given `ship`.

#### Returns

A `%tune` gift with a null `data` is given to all listeners. See the [`%keen`](#keen) entry for more details of the `%tune` gift.

---
