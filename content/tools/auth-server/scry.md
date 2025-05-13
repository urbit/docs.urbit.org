# Scry Paths {#scry-paths}

Below are all the scry paths you can query. All paths are `%x` scries.

## `/proof/[turf]` {#proofturf}

Make a [`proof`](types.md#proof) for the given [`turf`](types.md#turf) (domain). This is put in a [`manifest`](types.md#manifest) and published at `<domain>/.well-known/appspecific/org.urbit.auth.json`. Auth Client uses it to validate requests.

#### Returns {#returns}

A [`proof`](types.md#proof).

#### Example {#example}

```
/proof/example.com
```

---

## `/proof/wood/[turf]` {#proofwoodturf}

Make a [`proof`](types.md#proof) for the given [`++wood`-encoded](.#additional-note) [`turf`](types.md#turf) (domain). This is put in a [`manifest`](types.md#manifest) and published at `<domain>/.well-known/appspecific/org.urbit.auth.json`. Auth Client uses it to validate requests.

#### Returns {#returns}

A [`proof`](types.md#proof).

#### Example {#example}

```
/proof/example.com
```

---

## `/all` {#all}

Get the complete state of all existing requests.

#### Returns {#returns}

You'll receive an [`initAll`](types.md#initall) update containing the current state.

---

## `/all/since/[time]` {#allsincetime}

Get all requests later than the specified Unix millisecond time, and their statuses.

#### Returns {#returns}

You'll receive an [`initAll`](types.md#initall) update containing the current state of requests later than the one specified.

#### Example {#example}

```
/all/since/1678658855227
```

---

## `/all/before/[time]` {#allbeforetime}

Get all requests before the specified Unix millisecond time, and their statuses.

#### Returns {#returns}

You'll receive an [`initAll`](types.md#initall) update containing the current state of requests earlier than the one specified.

#### Example {#example}

```
/all/before/1678658855227
```

---

## `/ship/[ship]` {#shipship}

Get the state of all existing requests for the specifed [`ship`](types.md#ship).

#### Returns {#returns}

You'll receive an [`initShip`](types.md#initship) update containing all requests for the specified `ship`, and their statuses.

#### Example {#example}

Note the leading `~` is omitted:

```
/ship/sampel-palnet
```

---

## `/ship/[ship]/since/[time]` {#shipshipsincetime}

Get the state of all existing requests for the specifed [`ship`](types.md#ship) later than the specified Unix millisecond time.

#### Returns {#returns}

You'll receive an [`initShip`](types.md#initship) update containing all entries for the specified `ship` with `time `s later than the one specified.

#### Example {#example}

```
/ship/sampel-palnet/since/1678658855227
```

---

## `/ship/[ship]/before/[time]` {#shipshipbeforetime}

Get the state of all existing requests for the specifed [`ship`](types.md#ship) earlier than the specified Unix millisecond time.

#### Returns {#returns}

You'll receive an [`initShip`](types.md#initship) update containing all entries for the specified `ship` with `time `s before the one specified.

#### Example {#example}

```
/ship/sampel-palnet/before/1678658855227
```

---

## `/turf/[turf]` {#turfturf}
    
Get the state of all existing requests for the specifed [`turf`](types.md#turf) (domain).

{% hint style="info" %}

If your domain contains characters apart from `a-z`, `0-9`, `-` and `.` separators, see the `/turf/wood/[turf]` path instead.

{% endhint %}

#### Returns {#returns}

You'll receive an [`initTurf`](types.md#initturf) update containing all requests for the specified `turf`, and their statuses.

#### Example {#example}

```
/turf/example.com
```

---

## `/turf/[turf]/since/[time]` {#turfturfsincetime}

Get the state of all existing requests for the specifed [`turf`](types.md#turf) (domain) later than the specified Unix millisecond time.

{% hint style="info" %}

If your domain contains characters apart from `a-z`, `0-9`, `-` and `.` separators, see the `/turf/wood/[turf]/since/[time]` path instead.

{% endhint %}

#### Returns {#returns}

You'll receive an [`initTurf`](types.md#initturf) update containing all entries with timestamps later than the one specified.

#### Example {#example}

```
/turf/example.com/since/1678658855227
```

---

## `/turf/[turf]/before/[time]` {#turfturfbeforetime}

Get the state of all existing requests for the specifed [`turf`](types.md#turf) (domain) earlier than the specified Unix millisecond time.

{% hint style="info" %}

If your domain contains characters apart from `a-z`, `0-9`, `-` and `.` separators, see the `/turf/wood/[turf]/before/[time]` path instead.

{% endhint %}

#### Returns {#returns}

You'll receive an [`initTurf`](types.md#initturf) update containing all entries for the specified `turf` (domain) with timestamps earlier than the one specified.

#### Example {#example}

```
/turf/example.com/before/1678658855227
```

---

## `/turf/wood/[turf]` {#turfwoodturf}
    
Get the state of all existing requests for the specifed [`turf`](types.md#turf) (domain), with [`++wood` encoding](.#additonal-note).

#### Returns {#returns}

You'll receive an [`initTurf`](types.md#initturf) update containing all requests for the specified `turf`, and their statuses.

#### Example {#example}

```
/turf/wood/example~.com
```

---

## `/turf/wood/[turf]/since/[time]` {#turfwoodturfsincetime}

Get the state of all existing requests for the specifed [`turf`](types.md#turf) (domain) later than the specified Unix millisecond time. With [`++wood` encoding](.#additonal-note).

#### Returns {#returns}

You'll receive an [`initTurf`](types.md#initturf) update containing all entries with timestamps later than the one specified.

#### Example {#example}

```
/turf/wood/example~.com/since/1678658855227
```

---

## `/turf/wood/[turf]/before/[time]` {#turfwoodturfbeforetime}

Get the state of all existing requests for the specifed [`turf`](types.md#turf) (domain) earlier than the specified Unix millisecond time. With [`++wood` encoding](.#additonal-note).

#### Returns {#returns}

You'll receive an [`initTurf`](types.md#initturf) update containing all entries for the specified `turf` (domain) with timestamps earlier than the one specified.

#### Example {#example}

```
/turf/wood/example~.com/before/1678658855227
```

---

## `/id/[uuid]` {#iduuid}

Get a particular request and its current status, by UUID.

#### Returns {#returns}

An [`entry`](types.md#entry) update containing the request in question and its current status.

#### Example {#example}

```
/id/2321f509-316c-4545-a838-4740eed86584

```

---

## `/id/status/[time]` {#idstatustime}

Get the status of a particular request.

#### Returns {#returns}

A [`status`](types.md#status) update containing the status of the request with the specified [`id`](types.md#id).

#### Example {#example}

```
/x/id/status/01a618cc-0c65-4278-853b-21d9e1289b93
```

---
