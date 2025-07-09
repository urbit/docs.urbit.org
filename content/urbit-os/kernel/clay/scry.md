---
description: "Clay scry reference - filesystem queries by care for reading files, directories, hashes, and metadata."
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

# Clay Scry Reference

The normal Clay scries are specified by a `$care`, which is a single character corresponding with a Clay submodule. Apart from `%s` they just take a `$path` to a desk, file or directory. All examples are dojo commands, the %'s in the path are automatically populated by the dojo like:

```
> %
[~.~zod ~.base ~.~2021.4.26..02.29.03..d31b ~]
```

In addition to the ordinary `$care`-based endpoints, there are also a few special endpoints described in the [Misc. Queries](scry.md#misc-queries) section below.

## Misc. queries <a href="#misc-queries" id="misc-queries"></a>

Clay exposes a few special "buc" scry endpoints. These all use a `%x` `$care` and must have a desk of `%$` (an empty string) in the `$beak`. They therefore have the basic form of:

```
.^([return type] %cx /=//=/[path])
```

Each of the possible `[path]`s are described below.

***

### `/sweep` - Cache check <a href="#sweep---cache-check" id="sweep---cache-check"></a>

A buc scry with a path of `/sweep` will check the global ford cache for refcount errors. It returns a `(list [need=@ud have=@ud leak])`, where a [`$leak`](data-types.md#leak) is a Ford cache key used internally by Clay.

Example:

```
> .^((list [need=@ud have=@ud *]) %cx /=//=/sweep)
~
```

***

### `/rang` - Get `$rang` <a href="#rang---get-rang" id="rang---get-rang"></a>

A buc scry with a path of `/rang` will return the full [`$rang`](data-types.md#rang) from Clay's state.

Example:

```
> =ran .^(rang:clay %cx /=//=/rang)
> ~(wyt by hut.ran)
31
```

***

### `/tomb/[path]` - Is accessible? <a href="#tombpath---is-accessible" id="tombpath---is-accessible"></a>

A buc scry with a path beginning with `/tomb` will return a `?` which is `%.y` if the file specified by `[path]` is accessible, and `%.n` otherwise. The `[path]` must be a full `$beam` like `/~zod/base/12/sys/kelvin`.

Note that `%.n` is returned either if the file has been tombstoned or if it doesn't exist at all, so it doubles as a tombstone check and existence check.

Example:

```
> .^(? %cx /=//=/tomb/(scot %p our)/base/(scot %da now)/sys/kelvin)
%.y
```

***

### `/cult/[desk]` - Subscribers <a href="#cultdesk---subscribers" id="cultdesk---subscribers"></a>

A buc scry with a path of `/cult/[desk]` will return the current subscriptions for the specified `$desk`.

The type returned is:

```hoon
(set [@p rave:clay])
```

See the [`$rave:clay`](data-types.md#rave) data type entry for more details of the `$rave` structure.

Example:

```
> .^((set [@p rave:clay]) %cx /=//=/cult/kids)
{ [~zod [%next mood=[care=%z case=[%da p=~2023.7.27..13.41.30..0536] path=/]]]
  [~zod [%next mood=[care=%z case=[%da p=~2023.7.27..13.41.30..0536] path=/desk/docket-0]]]
}
```

***

### `/flow` - Build cache <a href="#flow---build-cache" id="flow---build-cache"></a>

A buc scry with a path of `/flow` will return the global build cache. The type returned is a [`$flow:clay`](./data-types.md#flow).

Example:

```
> ~(wyt by .^(flow:clay %cx /=//=/flow))
960
```

***

### `/domes` - All domes <a href="#domes---all-domes" id="domes---all-domes"></a>

A buc scry with a path of `/domes` will return a [`$cone`](./data-types.md#cone) containing the `$dome`s and associated metadata for all desks, foreign and local.

Example:

```
> =domes .^(cone:clay %cx /=//=/domes)
> ~(key by domes)
{ [~zod %landscape]
  [~mister-dister-dozzod-dozzod %landscape]
  [~lander-dister-dozzod-dozzod %landscape]
  [~mister-dister-dozzod-dozzod %webterm]
  [~zod %bitcoin]
  [~zod %kids]
  [~zod %landscape]
  [~zod %base]
  [~zod %webterm]
  [~mister-dister-dozzod-dozzod %bitcoin]
}
```

***

### `/tire` - App state <a href="#tire---app-state" id="tire---app-state"></a>

A buc scry with a path of `/tire` will return the `$rock:tire:clay` for all domestic desks, which is a `(map desk [=zest wic=(set weft)])`. The [`$zest`](./data-types.md#zest) specifies whether apps on the desk are running or suspended. The `.wic` set contains the `$weft`s (kernel versions) of any queued updates.

Example:

```
> .^(rock:tire:clay %cx /=//=/tire)
{ [p=%bitcoin q=[zest=%live wic={}]]
  [p=%base q=[zest=%live wic={}]]
  [p=%landscape q=[zest=%live wic={}]]
  [p=%webterm q=[zest=%live wic={}]]
  [p=%landscape q=[zest=%live wic={}]]
  [p=%kids q=[zest=%dead wic={}]]
}
```

***

### `/tyre` - App state subs <a href="#tyre---app-state-subs" id="tyre---app-state-subs"></a>

A buc scry with a path of `/tyre` will return the `(set duct)` of all subscriptions to app states (those made via `%tire` tasks).

Example:

```
> .^((set duct) %cx /=//=/tyre)
{ ~[/gall/use/hark-system-hook/0w2.k8ns8/~zod/clay/tire /dill //term/1]
  ~[/gall/use/docket/0w2.k8ns8/~zod/tire /dill //term/1]
}
```

***

## `%a` - Build hoon <a href="#a---build-hoon" id="a---build-hoon"></a>

A scry with a `$care` of `%a` will build a `$hoon` file and return it as a `$vase`.

Example:

```
.^(vase %ca %/lib/strandio/hoon)
```

***

## `%b` - Dyn. mark core <a href="#b---dyn-mark-core" id="b---dyn-mark-core"></a>

A scry with a `$care` of `%b` will produce a `$dais` (processed mark core) for the specified `$mark`. The `$path` in the scry is a `$mark`.

Example:

```
.^(dais:clay %cb %/txt)
```

## %c - Dyn. mark convert <a href="#c---dyn-mark-convert" id="c---dyn-mark-convert"></a>

A scry with a `$care` of `%c` will produce a `$tube` (dynamically typed mark conversion gate). The `$path` specifies two `$mark`s - _from_ and _to_, like `/txt/noun`.

Example:

```
> =a .^(tube:clay %cc %/txt/mime)
> !<  mime  (a !>(~['foo']))
[p=/text/plain q=[p=3 q=7.303.014]]
```

***

## `%d` - List desks <a href="#d---list-desks" id="d---list-desks"></a>

A scry with a `$care` of `%d` will return a `(set desk)` of the desks that exist on your ship.

Note this scry should be performed with an empty `$desk` field (`%$`) in the `$beak` (e.g. `/=//=`). If it's not empty, it'll work but Clay will complain in the terminal.

Example:

```
> .^((set desk) %cd /=//=)
{%bitcoin %base %webterm %landscape %kids}
```

***

## `%e` - Static mark core <a href="#e---static-mark-core" id="e---static-mark-core"></a>

A scry with a `$care` of `%e` will return a statically typed `+nave` mark core. The `$path` in the scry specifies the `$mark`. The type returned is a `(nave:clay [type] [diff])`, where `[type]` is the type the mark takes and `[diff]` is the type taken by the mark specified in `+form:grad`.

Example:

```
.^((nave:clay noun noun) %ce %/noun)
```

***

## `%f` - Stat. mark convert <a href="#f---stat-mark-convert" id="f---stat-mark-convert"></a>

A scry with a `$care` of `%f` will return a static mark conversion gate. The `$path` specifies two `$mark`s - _from_ and _to_, like `/txt/mime`.

```
> =a .^($-(text mime) %cf %/txt/mime)
> (a ~['foo'])
[p=/text/plain q=[p=3 q=7.303.014]]
```

***

## `%p` - File permissions <a href="#p---file-permissions" id="p---file-permissions"></a>

A scry with a `$care` of `%p` will return the permissions of the file or directory in question. The type returned is a [`[dict:clay dict:clay]`](./data-types.md#dict) where the head is read permissions and the tail is write permissions.

If the specified file or directory has no permissions set, it will default to the permissions of its parent. If nothing above it has permissions set, it will default to empty whitelists. If the specified file or directory doesn't exist, it will also return the default empty whitelist.

Example:

```
> .^([dict:clay dict:clay] %cp %/gen)
[[src=/ rul=[mod=%white who=[p={} q={}]]] src=/ rul=[mod=%white who=[p={} q={}]]]
```

***

## `%r` - File as vase <a href="#r---file-as-vase" id="r---file-as-vase"></a>

A scry with a `$care` of `%r` will return the data of the given file wrapped in a `$vase` or crash if it's a directory. It's basically just a vase-wrapped `%x` scry.

Examples:

```
> .^(vase %cr %/gen/hood/hi/hoon)
[ #t/@
    q
  3.548.750.706.400.251.607.252.023.288.575.526.190.856.734.474.077.821.289.791.377.301.707.878.697.553.411.219.689.905.949.957.893.633.811.025.757.107.990.477.902.858.170.125.439.223.250.551.937.540.468.638.902.955.378.837.954.792.031.592.462.617.422.136.386.332.469.076.584.061.249.923.938.374.214.925.312.954.606.277.212.923.859.309.330.556.730.410.200.952.056.760.727.611.447.500.996.168.035.027.753.417.869.213.425.113.257.514.474.700.810.203.348.784.547.006.707.150.406.298.809.062.567.217.447.347.357.039.994.339.342.906
]
```

```
> !<  @t  .^(vase %cr %/gen/hood/hi/hoon)
'::  Helm: send message to an urbit\0a::\0a::::  /hoon/hi/hood/gen\0a  ::\0a/?    310\0a:-  %say\0a|=([^ [who=ship mez=$@(~ [a=tape ~])] ~] helm-send-hi+[who ?~(mez ~ `a.mez)])\0a'
```

```
> .^(vase %cr %/gen)
Crash!
```

***

## `%s` - Misc. scries <a href="#s---misc-scries" id="s---misc-scries"></a>

A scry with a `$care` of `%s` is for miscellaneous internal and debug functions and is liable to change in the future.

Rather than just a `$path` to a file, the head of the `$path` is tagged with one of `%yaki`, `%blob`, `%hash`, `%cage`, `%open`, `%late`, or `%base`, and the tail depends on which tag you use. We'll look at each in turn.

### `%yaki` - Commit <a href="#yaki---commit" id="yaki---commit"></a>

This will return the [`$yaki:clay`](./data-types.md#yaki) of the specified commit. It takes a [`$tako:clay`](./data-types.md#tako).

Example:

Here we scry the [`$dome:clay`](./data-types.md#dome) for `%`, get the latest `$tako` and the do a `%s` scry for the `$yaki` in question.

```
> =/  =dome:clay  .^(dome:clay %cv %)
  =/  =tako:clay  (~(got by hit.dome) let.dome)
  .^(yaki:clay %cs %/yaki/(scot %uv tako))
[ p=~[80.174.473.756.485.530.520.259.753.935.584.637.641.665.425.899.348.092.348.244.635.557.986.495.151.006]
    q
  { [p=/mar/hark/graph-hook-update/hoon q=0v5.ea0bj.21s5c.mjrop.ishic.fpkvl.e5bbs.91kc9.tdo41.ifi06.60v41]
    [p=/gen/hood/autocommit/hoon q=0v19.rh7jv.sa67o.t3jrb.4sdvs.7c45f.pv2u0.ragik.psp20.agqd8.8srkj]
    ...
    [p=/tests/lib/primitive-rsa/hoon q=0v1g.3qmq3.6i15q.arh6h.lfsqu.gvc9m.ql6m5.e2rdr.vnnt9.tptc6.mv9u7]
    [p=/tests/sys/vane/gall/hoon q=0va.alspc.qptqn.7tuj0.bgecg.1093t.gtsjs.up03k.d1fmk.4jrh8.2tdfa]
  }
  r=88.666.797.531.755.181.802.690.473.856.185.443.710.929.766.582.249.039.904.824.278.074.149.777.897.099
  t=~2021.4.16..10.41.57..3565
]
```

***

### `%blob` - File blob <a href="#blob---file-blob" id="blob---file-blob"></a>

This will return the [`$page:clay`](./data-types.md#page) of some file. It takes a [`$lobe:clay`](./data-types.md#lobe).

Example:

Here we grab the `$lobe` of `/gen/hood/hi/hoon` with a `%y` scry, then use it to do a `%s` scry for the `$blob` of the file.

```
> =/  =arch  .^(arch %cy %/gen/hood/hi/hoon)
  ?~  fil.arch
    ~
  .^(page:clay %cs %/blob/(scot %uv u.fil.arch))
[ p=%hoon
    q
  3.548.750.706.400.251.607.252.023.288.575.526.190.856.734.474.077.821.289.791.377.301.707.878.697.553.411.219.689.905.949.957.893.633.811.025.757.107.990.477.902.858.170.125.439.223.250.551.937.540.468.638.902.955.378.837.954.792.031.592.462.617.422.136.386.332.469.076.584.061.249.923.938.374.214.925.312.954.606.277.212.923.859.309.330.556.730.410.200.952.056.760.727.611.447.500.996.168.035.027.753.417.869.213.425.113.257.514.474.700.810.203.348.784.547.006.707.150.406.298.809.062.567.217.447.347.357.039.994.339.342.906
]
```

***

### `%hash` - Commit hash <a href="#hash---commit-hash" id="hash---commit-hash"></a>

This will return the `@uvI` (256-bit) content hash of the specified commit. It takes a [`$tako`](./data-types.md#tako).

Example:

Here we grab the [`$dome`](./data-types.md#dome) for `%` with a `%v` scry, get the latest [`$tako`](./data-types.md#tako) and then do a `%s` `%hash` scry for it.

```
> =/  =dome:clay  .^(dome:clay %cv %)
  =/  =tako:clay  (~(got by hit.dome) let.dome)
  .^(tako:clay %cs %/hash/(scot %uv tako))
0v16.er7uq.oke4u.cru7u.nglu9.q3su7.6ub1o.bh4qk.r5uav.ut12d.5rdl5
```

***

### `%cage` - File as cage <a href="#cage---file-as-cage" id="cage---file-as-cage"></a>

This will return a `$cage` of the data of some file. It takes a `$lobe`.

Example:

Here we grab the `$lobe` of `/gen/hood/hi/hoon` with a `%y` scry, then use it to do a `%s` scry for the `$cage` of the data.

```
> =/  =arch  .^(arch %cy %/gen/hood/hi/hoon)
  ?~  fil.arch
    ~
  .^(cage %cs %/cage/(scot %uv u.fil.arch))
[ p=%hoon
    q
  [ #t/@t
      q
3.548.750.706.400.251.607.252.023.288.575.526.190.856.734.474.077.821.289.791.377.301.707.878.697.553.411.219.689.905.949.957.893.633.811.025.757.107.990.477.902.858.170.125.439.223.250.551.937.540.468.638.902.955.378.837.954.792.031.592.462.617.422.136.386.332.469.076.584.061.249.923.938.374.214.925.312.954.606.277.212.923.859.309.330.556.730.410.200.952.056.760.727.611.447.500.996.168.035.027.753.417.869.213.425.113.257.514.474.700.810.203.348.784.547.006.707.150.406.298.809.062.567.217.447.347.357.039.994.339.342.906
  ]
]
```

***

### `%open` - Build prelude <a href="#open---build-prelude" id="open---build-prelude"></a>

This is like a `%a` scry but it only compiles the prelude to the file, e.g. the Ford rune imports. Proper documentation for this will be done as part of Ford documentaton at a later date.

***

### `%late` - Latest case <a href="#late---latest-case" id="late---latest-case"></a>

This will return the most recent revision number of a desk that has been fully downloaded. The type it returns is a [`$cass:clay`](./data-types.md#cass). The `$case` in the `$beak` must be a revision number rather than a date. You can just provide a case of `1` since it returns the latest regardless. If we have nothing for the specified `$desk`, this will just return the bunt of a `$cass` like `cass=[ud=0 da=~2000.1.1]`.

Example:

```
> .^(=cass:clay %cs /(scot %p (sein:title our now our))/base/1/late)
cass=[ud=50 da=~2021.4.22..10.38.50..57a8]
```

```
> .^(=cass:clay %cs /~sampel/base/1/late)
cass=[ud=0 da=~2000.1.1]
```

***

### `%base` - Merge-base <a href="#base---merge-base" id="base---merge-base"></a>

This will return the mergebase (i.e. most recent common ancestor) between two desks. The type it returns is a `(list tako:clay)`. The first `$desk` will just be the one in the `$beak` `$path` prefix and the second will be specified like `/ship/desk` at the end of the scry `$path`. If there is no common ancestor between the two desks, this will just produce an empty `+list`.

Examples:

```
> .^((list tako:clay) %cs %/base/(scot %p (sein:title our now our))/base)
~[102.787.244.596.033.419.950.995.540.301.493.841.569.518.772.322.508.085.465.561.801.703.148.627.263.473]
```

```
> .^((list tako:clay) %cs %/base/~sampel/base)
~
```

***

## `%t` - List files <a href="#t---list-files" id="t---list-files"></a>

A scry with a `$care` of `%t` will return a `(list path)` of all files in the given directory, or just a `(list path)` of the single file if it's a file. This is done recursively so will provide files in subdirectories as well. The paths will be fully qualified except for the `$ship`, `$desk` and `$case`. If the directory or file specified does not exist, it will return an empty `+list`.

Examples:

```
> .^((list path) %ct %/app/landscape)
~[
  /app/landscape/css/index/css
  /app/landscape/img/favicon/png
  /app/landscape/img/imageupload/png
  /app/landscape/img/touch_icon/png
  /app/landscape/index/html
  /app/landscape/js/channel/js
]
```

```
> .^((list path) %ct %/gen/group-store/add/hoon)
~[/gen/group-store/add/hoon]
```

```
> .^((list path) %ct %/foobar)
~
```

***

## `%u` - Check exists <a href="#u---check-exists" id="u---check-exists"></a>

A scry with a `$care` of `%u` will return a `?` depending on whether the file exists. It will produce `%.n` if it's a directory or doesn't exist and will produce `%.y` if it's a file and exists.

Examples:

```
> .^(? %cu %/app)
%.n
```

```
> .^(? %cu %/gen/code/hoon)
%.y
```

```
> .^(? %cu %/foobar)
%.n
```

***

## `%v` - Desk state <a href="#v---desk-state" id="v---desk-state"></a>

A scry with a care of `%v` will return the entire state of a desk as a [`$dome`](./data-types.md#dome).

Example:

```
> =a .^(dome:clay %cv %)
> let.a
1
```

Note: If you try printing this it will take forever and probably OOM your ship.

***

## `%w` - Revision number <a href="#w---revision-number" id="w---revision-number"></a>

A scry with a `$care` of `%w` will return the revision number and date of a given `$case`. The type returned is a [`$cass:clay`](./data-types.md#cass) like `[ud=@ud da=@da]` where `.ud` is the revision number and `.da` is the date.

Example:

```
> .^(cass:clay %cw %)
[ud=2 da=~2021.4.13..19.12.49..3389]
```

***

## `%x` - Read file <a href="#x---read-file" id="x---read-file"></a>

A scry with a `$care` of `%x` will return the data of a file or crash if it's a directory. The type returned will be whatever is defined by the `$mark` of the file.

Examples:

```
> .^(@t %cx %/gen/hood/hi/hoon)
'::  Helm: send message to an urbit\0a::\0a::::  /hoon/hi/hood/gen\0a  ::\0a/?    310\0a:-  %say\0a|=([^ [who=ship mez=$@(~ [a=tape ~])] ~] helm-send-hi+[who ?~(mez ~ `a.mez)])\0a'
```

```
> .^(waft:clay %cx %/sys/kelvin)
[lal=%zuse num=413]
```

```
> .^(@ %cx %/gen/hood)
Crash!
```

***

## `%y` - Read arch <a href="#y---read-arch" id="y---read-arch"></a>

A scry with a `$care` of `%y` will return the `$arch` of a file or directory.

An `$arch` is a `[fil=(unit lobe:clay) dir=(map @ta ~)]`. The `.fil` will contain the [`$lobe`](./data-types.md#lobe) hash if it's a file, otherwise it will be null. The `.dir` will contain a map of the files and directories it contains, otherwise it will be null.

It will return the bunt of an `$arch` if the file or directory is not found.

Examples:

```
> .^(arch %cy %/gen/group-store)
[ fil=~
    dir
  { [p=~.allow-ships q=~]
    [p=~.add q=~]
    [p=~.ban-ranks q=~]
    [p=~.remove q=~]
    [p=~.create q=~]
    [p=~.join q=~]
    [p=~.allow-ranks q=~]
    [p=~.ban-ships q=~]
  }
]
```

```
> .^(arch %cy %/gen/group-store/allow-ships)
[fil=~ dir={[p=~.hoon q=~]}]
```

```
> .^(arch %cy %/gen/group-store/allow-ships/hoon)
[fil=[~ 0vb.g8sqs.7gjm9.bl3vu.nk677.h5be1.g9eg3.4v1jo.00ivf.g8ndu.48a53] dir={}]
```

```
> .^(arch %cy %/foobar)
[fil=~ dir={}]
```

***

## `%z` - Content hash <a href="#z---content-hash" id="z---content-hash"></a>

A scry with a `$care` of `%z` will return the hash of a file or the recursive hash of a directory. If the file or directory doesn't exist it will return a null value.

The type returned is a `@uxI`.

Examples:

```
> .^(@uvI %cz %/gen)
0v5.itmhj.lt7ak.lgr1k.dr7vu.u7u9s.ko5rf.idfcr.ukrd2.t088n.3ml1k
```

```
> .^(@uvI %cz %/gen/code/hoon)
0v1t.vi1pf.3ba4n.87g6h.dcc1p.4t4l8.rm6a9.b4de4.v77qc.p9dc0.p8289
```

```
> .^(@uvI %cz %/foobar)
0v0
```

***
