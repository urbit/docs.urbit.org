# Subscriptions

Below are all the paths you can subscribe to in Auth Server.

## `/new/...` {#new}

Subscription paths beginning with `/new` will not give you any initial state, you'll just get events that happen after you've subscribed.

### `/new/all` {#newall}

Subscribe for all new updates.

#### Returns

You'll receive [`entry`](types.md#entry) and [`status`](types.md#status) updates as they occur.

---

### `/new/all/since/[time]` {#newallsincetime}

Subscribe for all new updates since the given Unix millisecond time.

#### Returns

You'll receive [`entry`](types.md#entry) and [`status`](types.md#status) updates for requests as the occur, but only for those with timestamps later than the one specified.

#### Example

```
/new/all/since/1678658855227
```

---

### `/new/turf/[turf]` {#newturfturf}

Subscribe for all new updates for the given [`turf`](types.md#turf) (domain).

{% hint style="info" %}

If your domain contains characters apart from `a-z`, `0-9`, `-` and `.` separators, see the `/new/turf/wood/[turf]` path instead.

{% endhint %}

#### Returns

You'll receive [`entry`](types.md#entry) and [`status`](types.md#status) updates for requests as they occur, as long as they're for the specified `turf`.

#### Example

For `example.com`:

```
/new/turf/example.com
```

For `foo.bar-baz.com`:

```
/new/turf/foo.bar-baz.com
```

---

### `/new/turf/[turf]/since/[time]` {#newturfturfsincetime}

Subscribe for all new updates for the given [`turf`](types.md#turf) (domain), since the given Unix millisecond time.

{% hint style="info" %}

If your domain contains characters apart from `a-z`, `0-9`, `-` and `.` separators, see the `/new/turf/wood/[turf]/since/[time]` path instead.

{% endhint %}

#### Returns

You'll receive [`entry`](types.md#entry) and [`status`](types.md#status) updates for requests as they occur, as long as they're for the specified `turf` and their timestamp is sooner than the one specified in the path.

#### Example

```
/new/turf/example.com/since/1678658855227
```

---

### `/new/turf/wood/[turf]` {#newturfwoodturf}

Subscribe for all new updates for the given [`turf`](types.md#turf) (domain), with [`++wood` encoding](.#additonal-note).


#### Returns

You'll receive [`entry`](types.md#entry) and [`status`](types.md#status) updates for requests as they occur, as long as they're for the specified `turf`.

#### Example

For `example.com`:

```
/new/turf/example~.com
```

For `foo.bar-baz.com`:

```
/new/turf/foo~.bar-baz~.com
```

---

### `/new/turf/wood/[turf]/since/[time]` {#newturfwoodturfsincetime}

Subscribe for all new updates for the given [`turf`](types.md#turf) (domain), since the given Unix millisecond time. With [`++wood` encoding](.#additonal-note).

#### Returns

You'll receive [`entry`](types.md#entry) and [`status`](types.md#status) updates for requests as they occur, as long as they're for the specified `turf` and their timestamp is sooner than the one specified in the path.

#### Example

```
/new/turf/example~.com/since/1678658855227
```

---

### `/new/ship/[ship]` {#newshipship}

Subscribe for all new updates for the given [`ship`](types.md#ship).

#### Returns

You'll receive [`entry`](types.md#entry) and [`status`](types.md#status) updates for requests as the occur, but only for those that pertain to the specified ship.

#### Example

Note that the ship does not include the leading `~`:

```
/new/ship/sampel-palnet
```

---

### `/new/ship/[ship]/since/[time]` {#newshipshipsincetime}

Subscribe for all new updates for the given [`ship`](types.md#ship), since the given Unix millisecond time.

#### Returns

You'll receive [`entry`](types.md#entry) and [`status`](types.md#status) updates for requests as they occur, as long as they're for the specified `ship` and their timestamp is sooner than the one specified in the path.

#### Example


Note that the ship does not include the leading `~`:

```
/new/ship/sampel-palnet/since/1678658855227
```

---

### `/new/id/[uuid]` {#newiduuid}

Subscribe for all new updates for the given [`id`](types.md#id).

#### Returns

You'll receive [`entry`](types.md#entry) updates and any [`status`](types.md#status) updates for the request with the given `id` as they occur.

#### Example

```
/new/id/01a618cc-0c65-4278-853b-21d9e1289b93
```

---

## `/init/...` {#init}

Subscription paths beginning with `/init` do the same as [`/new`](#new) except they also give you initial state when you first subscribe.

### `/init/all` {#initall}

Subscribe for all new updates, and get the complete existing state of all requests.

#### Returns

You'll initially receive an [`initAll`](types.md#initall) update containing the current state, and then you'll continue to receive [`entry`](types.md#entry) and [`status`](types.md#status) updates as they occur.

---

### `/init/all/since/[time]` {#initallsincetime}

Subscribe to updates for requests that occurred after the specified Unix millisecond time, and get the existing state of all requests with timestamps later than the one specified.

#### Returns

You'll initially receive an [`initAll`](types.md#initall) update containing the current state of requests later than the one specified. After that, you'll continue to receive [`entry`](types.md#entry) and [`status`](types.md#status) updates as they occur, as long as they're for requests whose timestamps are later than the one given.

#### Example

```
/init/all/since/1678658855227

```

---

### `/init/turf/[turf]` {#initturfturf}

Get existing request state and subscribe to updates pertaining to the given [`turf`](types.md#turf).

{% hint style="info" %}

If your domain contains characters apart from `a-z`, `0-9`, `-` and `.` separators, see the `/init/turf/wood/[turf]` path instead.

{% endhint %}

#### Returns

You'll initially receive an [`initTurf`](types.md#initturf) update containing the current state of requests for the given `turf`. After that, you'll continue to receive [`entry`](types.md#entry) and [`status`](types.md#status) updates as they occur, as long as they're for that `turf`.

#### Example

```
/init/turf/example.com
```

---

### `/init/turf/[turf]/since/[time]` {#initturfturfsincetime}

Get existing request state and subscribe to updates pertaining to the given [`turf`](types.md#turf), for requests whose timestamps are later than the Unix millisecond time given.

{% hint style="info" %}

If your domain contains characters apart from `a-z`, `0-9`, `-` and `.` separators, see the `/init/turf/wood/[turf]/since/[time]` path instead.

{% endhint %}

#### Returns

You'll initially receive an [`initTurf`](types.md#initturf) update containing the current state of requests for the given `turf` with times later than the given one. After that, you'll continue to receive [`entry`](types.md#entry) and [`status`](types.md#status) updates as they occur, as long as they're for that `turf` and have timestamps later than the one specified.

#### Example

```
/init/turf/example.com/since/1678658855227
```

---

### `/init/turf/wood/[turf]` {#initturfwoodturf}

Get existing state request state and subscribe to updates pertaining to the given [`turf`](types.md#turf).  With [`++wood` encoding](.#additonal-note).

#### Returns

You'll initially receive an [`initTurf`](types.md#initturf) update containing the current state of requests for the given `turf`. After that, you'll continue to receive [`entry`](types.md#entry) and [`status`](types.md#status) updates as they occur, as long as they're for that `turf`.

#### Example

```
/init/turf/wood/example~.com
```

---

### `/init/turf/wood/[turf]/since/[time]` {#initturfwoodturfsincetime}

Get existing request state and subscribe to updates pertaining to the given [`turf`](types.md#turf), for requests whose timestamps are later than the Unix millisecond time given.  With [`++wood` encoding](.#additonal-note).

#### Returns

You'll initially receive an [`initTurf`](types.md#initturf) update containing the current state of requests for the given `turf` with timestamps later than the given one. After that, you'll continue to receive [`entry`](types.md#entry) and [`status`](types.md#status) updates as they occur, as long as they're for that `turf` and have timestamps later than the one specified.

#### Example

```
/init/turf/example~.com/since/1678658855227
```

---
### `/init/ship/[ship]` {#initshipship}

Subscribe to updates for requests pertaining to the given [`ship`](types.md#ship), and get the existing state of all requests pertaining to that `ship`.

#### Returns

You'll initially receive an [`initShip`](types.md#initship) update containing the current state of requests for the given `ship`. After that, you'll continue to receive [`entry`](types.md#entry) and [`status`](types.md#status) updates as they occur, as long as they're for that `ship`.

#### Example

```
/init/ship/sampel-palnet
```

---

### `/init/ship/[ship]/since/[time]` {#initshipshipsincetime}

Subscribe to updates for requests pertaining to the given [`ship`](types.md#ship), and get the existing state of all requests pertaining to that `ship`, as long as the timestamp is later than the Unix millisecond time given.

#### Returns

You'll initially receive an [`initShip`](types.md#initship) update containing the current state of requests for the given `ship` with `stamp`s later than the `stamp` given. After that, you'll continue to receive [`entry`](types.md#entry) and [`status`](types.md#status) updates as they occur, as long as they're for that `ship` and have timestamps later than the one specified.

#### Example

```
/init/ship/sampel-palnet/since/1678658855227
```

---
