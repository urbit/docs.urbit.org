---
description: "Jael API reference - PKI tasks and gifts for key management, subscriptions, domains, and ship identity operations."
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

# Jael API Reference

This document details all the tasks you may wish to send Jael, as well as the gifts you'll receive in response.

You may also wish to reference the [Data Types](data-types.md) document for details of the types referenced here, and the [Examples](examples.md) document for practical examples of using these tasks.

## Tasks <a href="#tasks" id="tasks"></a>

### `%dawn` <a href="#dawn" id="dawn"></a>

Boot from keys.

```hoon
[%dawn dawn-event]
```

This task is called once per ship during the vane initialization phase immediately following the beginning of the [adult stage](../arvo/README.md#structural-interface-core). This task is `%pass`ed to Jael by Dill, as Dill is the first vane to be loaded for technical reasons, though we consider Jael to be the true "first" vane. This task is only used for ships that will join the Ames network - fake ships (i.e. made with `./urbit -F zod`) use the [%fake](tasks.md#fake) task instead.

`%dawn` is used to perform a sequence of initialization tasks related to saving information about Azimuth and the Ames network and booting other vanes for the first time. Upon receipt of a `%dawn` task, Jael will:

* record the Ethereum block the public key is registered to,
* record the URL of the Ethereum node used,
* save the signature of the parent planet (if the ship is a moon),
* load the initial public and private keys for the ship,
* set the DNS suffix(es) used by the network (currently just `urbit.org`),
* save the public keys of all galaxies,
* set Jael to subscribe to `%azimuth-tracker`,
* `%slip` a `%init` task to Ames, Clay, Gall, Dill, and Eyre, and `%give` an `%init` gift to Arvo, which then informs Unix that the initialization process has concluded.

This task takes a [$dawn-event](data-types.md#dawn-event) as its argument.

You would not use this task manually.

#### Returns

Jael `%give`s an `%init` gift to Unix. This occurs after the Dill `%slip` init.

***

### `%fake` <a href="#fake" id="fake"></a>

Boot fake ship.

```hoon
[%fake =ship]
```

This task is used instead of [%dawn](tasks.md#dawn) when creating a fake ship via the `-F` flag when calling the Urbit binary. It performs a subset of the actions that `%dawn` performs, modified to accommodate the fake ship.

`%fake` endows the ship with a private key and a public key deterministically derived from the ship's `@p`. It sets `fak.own.pki` to `%.y`, which is the bit that determines whether or not a ship is fake. Other parts of the Jael state, such as the sponsorship chain and galaxy public keys are left at their bunted values.

The `$ship` field specifies the `@p` of the fake ship being created.

You would not use this task manually.

#### Returns

Jael `%give`s a `%init` gift to Unix.

***

### `%listen` <a href="#listen" id="listen"></a>

Set Ethereum source.

```hoon
[%listen whos=(set ship) =source]
```

Sets the source that the public keys for a set of `$ship`s should be obtained from. This can either be a Gall app that communicates with an Ethereum node such as `%azimuth-tracker`, as in the case of galaxies, stars, and planets, or a ship, as in the case of moons.

The `.whos` set is the set of ships whose key data source is to be monitored. The [`$source`](data-types.md#source) is either a ship or the name of a Gall app to use as a source. A `%listen` task with empty `whos` will set the default source. When the `$source` is a ship, Jael will obtain public keys for ships in `(set ship)` from the given ship. By default, the `$source` for a moon will be the planet that spawned that moon.

You are unlikely to use this task manually.

#### Returns

Jael will not return any gifts in response to a `%listen` task.

***

### `%meet` <a href="#meet" id="meet"></a>

This task is deprecated and does not perform any actions.

```hoon
[%meet =ship =life =pass]
```

***

### `%moon` <a href="#moon" id="moon"></a>

Register moon keys or otherwise administer a moon.

```hoon
[%moon =ship =udiff:point]
```

This is what is sent to Jael by `%hood` behind the scenes when you run `|moon`, `|moon-breach` or `|moon-cycle-keys`. The `$ship` field is the moon's `@p`. The [`$udiff:point`](data-types.md#udiffpoint) will contain the bunt of an [`$id:block`](data-types.md#idblock) (since moons aren't registered in Azimuth) and one of the `$udiff` actions depending on what you want to do.

#### Returns

Jael does not return any gifts in response to a `%moon` task.

***

### `%nuke` <a href="#nuke" id="nuke"></a>

Cancel subscription to public or private key updates.

```hoon
[%nuke whos=(set ship)]
```

If you've subscribed to public or private key updates from Jael with a [`%private-keys`](tasks.md#private-keys) or [`%public-keys`](tasks.md#public-keys) task, you can unsubscribe and stop receiving updates with a `%nuke` task. The `(set ship)` is the `+set` of `$ship`s which you want to stop tracking. Jael organises subscriptions based on `$duct`s, and will determine which subscription to cancel implicitly based on the `$duct` the `%nuke` task came from. This means a `%nuke` task only works from the same thread or agent and on the same `$path` as the original subscription request.

To cancel a subscription to the ship's private keys you must leave `whos` empty like `[%nuke ~]`.

#### Returns

Jael does not return a gift in response to a `%nuke` task.

#### Examples

See the [%public-keys and %nuke](examples.md#public-keys-and-nuke) section of the Examples document for an example of using `%nuke` to cancel a `%public-keys` subscription. See the thread in the [%private-keys](examples.md#private-keys) example for cancelling a `%private-keys` subscription.

***

### `%private-keys` <a href="#private-keys" id="private-keys"></a>

Subscribe to private key updates.

```hoon
[%private-keys ~]
```

Subscribe to be notified of private key updates for the local ship. The subscription will continue until Jael receives a [%nuke](tasks.md#nuke) task to cancel it.

#### Returns

Jael responds to a `%private-keys` task with a [`%private-keys` gift](examples.md#private-keys).

Jael will immediately respond with a `%private-keys` gift. Then, whenever the ship's private keys are changed, it'll send a new and updated `%private-keys` gift.

#### Example

See the [%private-keys](examples.md#private-keys) section of the Examples document for a practical example.

***

### `%public-keys` <a href="#public-keys" id="public-keys"></a>

Subscribe to public key (and related) updates from Jael.

```hoon
[%public-keys ships=(set ship)]
```

An agent or thread can subscribe to be notified of public key updates, sponsorship changes and continuity breaches for the `+set` of `$ship`s specified in the `.ships` field. The subscription will continue until Jael receives a [`%nuke`](tasks.md#nuke) task to cancel it.

#### Returns

Jael responds to a `%public-keys` task with [`%public-keys` gift](examples.md#public-keys-and-nuke).

Upon subscription, Jael will immeditely respond with a `%public-keys` gift containing a `%full` `$public-keys-result` with the public key for each `$life` up until the current one for each `$ship` specified in the original task. After than, Jael will send a `%public-keys` gift with either a `%diff` or `%breach` [`$public-keys-result`](data-types.md#public-keys-result) each time a change occurs for any of the `$ship`s to which you're subscribed.

#### Example

See the [%public-keys and %nuke](examples.md#public-keys-and-nuke) section of the Examples document for a practical example.

***

### `%rekey` <a href="#rekey" id="rekey"></a>

Update private keys.

```hoon
[%rekey =life =ring]
```

This is what is sent to Jael by `%hood` when you run `|rekey`, as you must after setting new Azimuth keys or running `|cycle-moon-keys` on a moon's parent. It will update your `$life` (key revision number) and private keys. The `$life` field is the new `$life` (typically an increment of the current `$life`) and the `$ring` is a private key `@`.

#### Returns

Jael does not return any gift in response to a `%rekey` task.

***

### `%resend` <a href="#resend" id="resend"></a>

Resend private keys.

```hoon
[%resend ~]
```

This task asks Jael to resend our private keys to subscribers who have subscribed with a [`%private-keys` task](tasks.md#private-keys).

#### Returns

Jael doesn't return any gifts in response to a `%rekey` task, but `%private-keys` subscribers will receive a [`%private-keys` gift](examples.md#private-keys).

***

### `%ruin` <a href="#ruin" id="ruin"></a>

Pretend breach.

```hoon
[%ruin ships=(set ship)]
```

This simulates a breach locally for the given `+set` of `$ship`s. Jael will blast out a `%breach` [`%public-keys` gift](examples.md#private-keys) to all subscribers. Ames will delete all message state for the ships in question in response to the `%breach` gift.

{% hint style="warning" %}
**WARNING**

This will break communications with the given ships, and is not reversible until they actually breach. **Use with extreme caution.**

Note it's better to use the [`%snub` Ames task](../ames/tasks.md#snub) if you want to block packets from ships.
{% endhint %}

#### Returns

Jael doesn't return any gifts in response to a `%ruin` task.

***

### `%turf` <a href="#turf" id="turf"></a>

View domains.

```hoon
[%turf ~]
```

The domains returned by a `%turf` task are used as the base for individual galaxy domain names (e.g. from `urbit.org` you get `zod.urbit.org`, `bus.urbit.org`, etc). Jael gets these from Azimuth, then Ames gets them from Jael and passes them to the runtime, which will perform the DNS lookups and give Ames back the galaxy IP addresses. A `%turf` task takes no additional arguments. You're unlikely to use this manually - if you want the current `$turf`s you'd likely want to do a [turf scry](scry.md#turf) instead.

#### Returns

Jael will respond to a `%turf` task with a [`%turf` gift](#turf).

#### Example

See the [%turf section of the Examples\
document](../examples/examples.md#turf) for a practical example.

***

### `%step` <a href="#step" id="step"></a>

Reset web login code.

```hoon
[%step ~]
```

Jael maintains a `$step` value that represents the web login code revision number, and uses it to derive the code itself. It begins at `0` and is incremented each time the code is changed. When Jael updates the web login code, it sends Eyre a `%code-changed` `$task:eyre` so that Eyre can throw away all of its current cookies and sessions. A `%step` task takes no additional argument.

#### Returns

Jael does not return a gift in response to a `%step` task.

#### Example

See the [%step](examples.md#step) section of the Examples document for a practical example.

***

## Gifts <a href="#gifts" id="gifts"></a>

### `%done` <a href="#done" id="done"></a>

Ames message (n)ack.

```hoon
[%done error=(unit error:ames)]
```

This is given in response to a `%plea` from Ames. You would not use this from userspace.

***

### `%boon` <a href="#boon" id="boon"></a>

Ames response.

```hoon
[%boon payload=*]
```

This is given in response to a request from Ames. You would not use this from userspace.

***

### `%private-keys` <a href="#private-keys" id="private-keys"></a>

Private keys.

```hoon
[%private-keys =life vein=(map life ring)]
```

This is given to those who have subscribed with a [`%private-keys` task](tasks.md#private-keys) whenever our keys change.

The `$life` is our current key revision number, and the `$vein` contains a map from current and previous `$life`s to private keys as `$ring`s.

***

### `%public-keys` <a href="#public-keys" id="public-keys"></a>

Ethereum changes.

```hoon
[%public-keys =public-keys-result]
```

Public key information, diffs, and breach notifications. This is given to those who have subscribed with a [`%public-keys` task](tasks.md#public-keys).

See the [`$public-keys-result`](data-types.md#public-keys-result) entry in the data types reference for details of the data this gift contains.

***

### `%turf` <a href="#turf" id="turf"></a>

Domains.

```hoon
[%turf turf=(list turf)]
```

This is given in response to a [`%turf` task](tasks.md#turf), and contains the list of domains used for galaxies (the `urbit.org` part in `zod.urbit.org`).

A `$turf` is a `(list @t)` of domain components, TLD-first. For example, `urbit.org` would be `~['org' 'urbit']`.

***
