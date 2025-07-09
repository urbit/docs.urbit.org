---
description: "Gall scry reference - agent queries and vane-level endpoints for agent state, subscriptions, and metadata."
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

# Gall Scry Reference

Gall's scry interface is mainly used to scry into the individual agents it's running. The vane itself does have its own interface, however. Both [agent scries](#agent-scries) and [vane scries](#vane-scries) are documented below.

Note that for all agent scries and most vane scries, `q.beak`, where there'd usually be a `$desk`, will be the agent name instead, like:

```
.^(some-type %gx /=agent-name-here=/some/path/noun)
```

{% hint style="warning" %}

**Important:** Vane scries are differentiated from agent scries by an extra empty (`%$`) element at the beginning of the `$spur` (the path after the `$beak`), like: `/=agent-name/$` or `/=agent-name=//some/more/fields`. Without that empty element, Gall will try route the scry to an agent instead.

{% endhint %}

## Agent scries {#agent-scries}

In order to hit the `+on-peek` arm of a Gall agent, you need to:

1. Put the agent in `q.beak` of the scry path (where the `$desk` usually goes), like `/=some-agent=`.
2. Make sure the beginning of the `$spur` is *not* an empty `%$` element, as that will route the scry to the [vane endpoints](#vane-scries) instead. An agent scry must be `/=some-agent=/some/path` not `/=some-agent=//some/path`.

Any `$care` can be used (dependent on what the agent accepts, of course). The most common is `%x`.

{% hint style="info" %}

Note that `%x` cares alone must include an extra `$mark` field at the end of the `$spur`. This mark field lets Gall perform any necessary mark conversions before returning your data. For plain unmarked data, you can just use the `%noun` mark. As an example, if an agent specifies an endpoint `/x/some/path` and just returns ordinary data, you'd do `.^(some-type %gx /=some-agent=/some/path/noun)`. If the endpoint returns a `%json` mark or whatever (and that's what you want), you'd put that at the end instead.

{% endhint %}

---

## Vane scries {#vane-scries}

Gall itself provides the special vane-level endpoints listed below. They are organized by the `$care`. In order to hit the vane-level endpoints, the beginning of the the `$spur` (e.g. the `$path` after the `$beak`) *must* be a `%$` empty element. For example:

```hoon
.^(desk %gd /=acme=/$)
.^((set [=dude:gall live=?]) %ge /=base=/$)
.^((list path) %gt /=acme=//foo)
```

Note you can use `$` to make the last element empty since it won't allow a trailing `/`. Note how in the third example, the empty element is at the *beginning* of the `$spur` and *after* the `$beak`. If you fail to include this empty element, Gall will try route the scry to an agent for handling instead.

### `%d`: get desk of app {#d-get-desk-of-app}

A scry with a `%d` care and an agent in `q.beak` will give you the desk that agent is on.

#### Produces

A `$desk`

#### Example

```
> .^(desk %gd /=acme=/$)
%base
```

---

### `%e`: running apps {#e-running-apps}

A scry with an `%e` care will give you the agents on the desk given in `q.beak`.

#### Produces

A `(set [=dude live=?])`, where `live` is true if running and false if not.

#### Examples

```
> .^((set [=dude:gall live=?]) %ge /=base=/$)
{ [dude=%acme live=%.y]
  [dude=%hood live=%.y]
  [dude=%lens live=%.y]
  [dude=%dbug live=%.y]
  [dude=%azimuth live=%.y]
  [dude=%ping live=%.y]
  [dude=%dojo live=%.y]
  [dude=%eth-watcher live=%.y]
  [dude=%spider live=%.y]
  [dude=%herm live=%.y]
}
```

---

### `%f`: nonces of apps {#f-nonces-of-apps}

A scry with a care of `%f` and anything in `q.beak` will produce the subscription nonces of all apps. You are unlikely to use this, it's mostly for kernel debugging.

#### Produces

A `(map dude @)` where the `@` is the nonce.

#### Examples

```
> .^((map dude:gall @) %gf /=//=/$)
[ n=[p=%treaty q=2]
    l
  [ n=[p=%metadata-hook q=1]
    l={[p=%contacts q=1] [p=%notify q=2] [p=%groups q=1] [p=%dm-hook q=1] [p=%spider q=1]}
      r
    { [p=%docket q=9]
      [p=%bait q=1]
      [p=%hood q=15]
      [p=%hark-graph-hook q=2]
      [p=%s3-store q=1]
      [p=%hark-system-hook q=1]
......(truncated for brevity)......
```

---

### `%n`: get nonce of subscription {#n-get-nonce-of-subscription}

A scry with a care of `%n`, an agent in `q.beak` and a path of `//[ship]/[agent]/[wire]` will produce the nonce for that subscription. You are unlikely to use this, it's mostly for kernel debugging.

#### Produces

A `@`.

---

### `%t`: remote scry subpaths {#t-remote-scry-subpaths}

A scry with a `%t` care, an agent in `q.beak` and a path of `//1/some/path` will give you the list of remote scry subpaths bound under the given path.

Note the version number `1` for scries to Gall's remote scry namespace.

See the [remote scry guide](../../../build-on-urbit/userspace/remote-scry.md) for more details.

#### Produces

A `(list path)`

#### Examples

```
> .^((list path) %gt /=acme=//1/foo)
~
```

---

### `%u`: check if installed {#u-check-if-installed}

A scry with a `%u` care will check whether the given agent is installed and running.

#### Produces

A `?`

#### Examples


```
> .^(? %gu /=acme=/$)
%.y
```

```
> .^(? %gu /=doesnt-exist=/$)
%.n
```

---

### `%v`: get agent state {#v-get-agent-state}

A scry with a `%v` care will return the data of an agent whether it is running or not.  The agent is supplied as the `$dude` (second) position of the `$beak`.

#### Produces

A `$egg-any` (versioned passthrough to `$egg`)

#### Examples


```
> .^(egg-any:gall %gv /=dbug=/$)
[ %16
  [ %live
      control-duct
    [ i=/gall/use/hood/0wCu9kI/~zod/kiln/vats/base/jolt/dbug
      t=[i=/dill t=~[//term/1]]
    ]
    run-nonce='0w1.iS8Gu'
    sub-nonce=1
      stats
    [ change=1.213
        eny
      0v1bl.j3urf.0mnnv.lit30.svf8h.rhql4.8f2mu.ausa3.sj19t.mimp1.oeefb.1p6qt.htqts.d147f.7qi4s.nf8jh.h0ng2.bb6ao.8fgnh.vhk42.gkio4
      time=~2024.6.5..16.18.39..c0d8
    ]
    bitt=~
    boat=~
    boar=~
    code=~
    old-state=[%.n #t/[%0 passcode=u(@t)] q=[0 0]]
    beak=[p=~zod q=%base r=[%da p=~2024.6.5..16.18.39..c0d8]]
    marks=~
    sky=[%plot p=~ q=~]
    ken=~
    pen=~
    gem=~
  ]
]
```

---

### `%w`: latest revision of path {#w-latest-revision-of-path}

A scry with a `%w` care and an agent in `q.beak` will get the latest revision number of the bound remote scry path given in the `$spur`.

As with `%gt` and `%gz` scries, this requires a version number `1` after the `//`.

See the [remote scry guide](../../../build-on-urbit/userspace/remote-scry.md) for more details.

#### Produces

A `cass:clay`, specifically the `%ud` kind.

---

### `%x`: remote scry file {#x-remote-scry-file}

A scry with a `%x` care and an agent in `q.beak` will get the value bound at the remote scry path given in the `$spur`. The revision of the file must be given in the `$beak` portion of the scry path. The general format is therefore:

```hoon
[%gx /[ship]/[agent]/[file revision]//[file path]
```

See the [remote scry guide](../../../build-on-urbit/userspace/remote-scry.md) for more details.

#### Produces

The type returned is the raw `$noun` from the `$page`. If the file has been tombstoned or does not exist, the scry will fail.

---

### `%z`: hash of value at path {#z-hash-of-value-at-path}

A scry with a `%z` care and an agent in `q.beak` will get the hash identifier of the value bound at the remote scry path given in the `$spur`.

As with `%gt` and `%gw` scries, this requires a version number `1` after the `//`.

See the [remote scry guide](../../../build-on-urbit/userspace/remote-scry.md) for more details.

#### Produces

A `@uvI`.

---
