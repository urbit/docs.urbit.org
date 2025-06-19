---
description: "Clay API reference - filesystem tasks for reading, writing, tracking changes, and managing desks."
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

# Clay API Reference

This document details all the `task`s you're likely to use to interact with Clay, as well as the `gift`s you'll receive in response. Most sections have a corresponding practical example in the [Examples](examples.md) document. Many of the types referenced are detailed in the [Data Types](data-types.md) document. It may also be useful to look at the `++ clay` section of `/sys/lull.hoon` in Arvo where these `task`s, `gift`s and data structures are defined.

The focus of this document is on interacting with Clay from userspace applications and threads, so it doesn't delve into the internal mechanics of Clay from a kernel development perspective.

## `%warp` - Read and track <a href="#warp---read-and-track" id="warp---read-and-track"></a>

```hoon
[%warp wer=ship rif=riff]
```

A `%warp` `task` is for reading and subscribing to files and directories.

The `wer` field is the target ship. The `(unit rave)` of the [riff](data-types.md#riff) is null to cancel an existing subscription, otherwise the [rave](data-types.md#rave) is tagged with one of:

* `%sing` - Read a single file or directory.
* `%next` - Subscribe for the next change to a file or directory.
* `%mult` - Subscribe for the next change to a set of files and/or directories.
* `%many` - Track changes to a desk for the specified range of revisions.

We'll look at each of these in more detail below.

#### Returns

Clay responds to a `%mult` request with a `%wris` `gift`, and the rest with a `%writ` `gift`.

A `%wris` `gift` looks like:

```hoon
[%wris p=[%da p=@da] q=(set (pair care path))]  ::  many changes
```

...and a `%writ` `gift` looks like:

```hoon
[%writ p=riot]  ::  response
```

The `unit` of the [riot](data-types.md#riot) will be null if the target file cannot be found or if a subscription has ended (depending on context). Otherwise it will have a [rant](data-types.md#riot) with a `cage` containing the data you requested. Its contents will vary depending on the kind of request and `care`.

Now we'll look at each of the `rave` request types in turn.

### `%sing` - Read <a href="#sing---read" id="sing---read"></a>

```hoon
[%sing =mood]
```

This `rave` is for reading a single file or directory immediately.

The `care` of the [mood](data-types.md#mood) will determine what you can read and what type of data will be returned. See the [care](data-types.md#care) documentation and [scry](scry.md) documentation for details on the various `care`s.

The [case](data-types.md#case) specifies the `desk` revision and you can use whichever kind you prefer. The `path` will usually be a path to a file or directory like `/gen/hood/hi/hoon` but may be something else depending on the `care`.

#### Example

[See here for an example of using %sing.](examples.md#sing)

***

### `%next` - Await next <a href="#next---await-next" id="next---await-next"></a>

```hoon
[%next =mood]  ::  await next version
```

This subscribes to the next version of the specified file. See [here](data-types.md#mood) for details of the `mood` structure.

If you subscribe to the current `case` of the `desk`, Clay will not respond until the file changes. If you subscribe to a previous `case` of the `desk` and the file has changed in between then and now, it will immediately return the first change it comes across in that range. For example, if you're currently at `case` `100`, subscribe to case `50` and the file in question has been modified at both `60` and `80`, clay will immediately return the version of the file at `case` `60`.

#### Example

[See here for an example of using %next.](examples.md#next)

***

### `%mult` - Next of any <a href="#mult---next-of-any" id="mult---next-of-any"></a>

```hoon
[%mult =mool]
```

This subscribes to the next version of a `set` of files or directories. Clay will only send a single response, and it will send it when _any_ of the specified files change. For example, if you subscribe to both `/foo/txt` and `/bar/txt`, and only `/foo/txt` changes, Clay will send a response indicating a change to `/foo/txt`. If `/bar/txt` changes subsequently, it will not tell you. If more than one file changes at once, it will tell you about each of the changes in the one response.

The behaviour with respect to requesting old `case`s is the same as explained in the [`%next`](tasks.md#next---await-next) section above.

The `mool` specified in the request is this structure:

```hoon
+$  mool  [=case paths=(set (pair care path))]  ::  requests in desk
```

You can use a different `care` for each of the files specified by the `path` if you like. Significantly, the `care` will determine whether Clay sends a response for a given change. For example, if you subscribe to an existing `/foo/txt` with a `%u` `care` and `/foo/txt` is modified but isn't deleted, Clay will _not_ tell you. However, if you subscribe with an `%x` `care`, it _will_ tell you.

#### Example

[See here for an example of using %mult.](examples.md#mult)

***

### `%many` - Track range <a href="#many---track-range" id="many---track-range"></a>

```hoon
[%many track=? =moat]
```

This subscribes to all changes to a `desk` for the specified range of `case`s. Note that you're unlikely to use this directly, it's mostly used implicitly if you make a `%sing` or `%next` request with a `%v` `care` to a foreign `desk`. Regardless, we'll have a look at it for completeness.

If the `track` is `%.y` it will just return a `%writ` like:

```hoon
[%writ p=[~ [p=[p=%w q=[%ud p=256] r=%base] q=/ r=[p=%null q=[#t/@n q=0]]]]]
```

...that merely informs you of a change. If you want the actual data you'll have to request it separately.

If the `track` is `%.n`, the `cage` of the `%writ` will contain a [nako](data-types.md#nako) with the relevant data for all changes to a desk between what you have and the `case` requested. It is very large and fairly complicated. The `nako` structure is defined in the `clay.hoon` source file itself rather than in `lull.hoon` or elsewhere since you're unlikely to work with it yourself.

The `from` and `to` fields of the [moat](data-types.md#moat) specify the range of `case`s for which to subscribe. The range is _inclusive_. It can be specified by date or by revision number, whichever you prefer.

The `path` in the `moat` is a path to a file or directory. If it's `~` it refers to the root of the `desk` in question. This lets you say "only inform me of changes to the `desk` if the specified file or directory exists". If it doesn't exist, Clay will not send you anything.

When you reach the end of the subscribed range of `case`s, Clay will send you a `%writ` with a null `riot` to inform you the subscription has ended like:

```hoon
[%writ p=~]
```

#### Example

[See here for an example of using %many.](examples.md#many)

***

### Cancel Subscription <a href="#cancel-subscription" id="cancel-subscription"></a>

To cancel a subscription, you just send a `%warp` with a null `(unit rave)` in the `riff`. Clay will cancel the subscription based on the `wire`. The request is exactly the same regardless of which type of `rave` you subscribed with originally.

#### Example

[See here for an example of cancelling a subscription.](examples.md#cancel-subscription)

***

## Write and Modify <a href="#write-and-modify" id="write-and-modify"></a>

### `%info` - Write <a href="#info---write" id="info---write"></a>

```hoon
[%info des=desk dit=nori]
```

To write or modify a file, we send Clay a `%info` `task`.

If the head of the [nori](data-types.md#nori) `dit` is `%|`, it's a request to add a label to a commit, and the `nori` looks like `[%| p=@tas q=(unit aeon)]` where `p` is the label and `q` is the [`aeon`](./data-types.md#aeon) (commit reference). If `q` is null, the label is applied to the latest commit in the desk.

If the head of the `nori` is `%&`, it's a request to add, delete or modify one or more files in the given desk, and looks like `[%& p=soba]`. The [soba](data-types.md#soba) in the `nori` is just a list of changes so you can make more than one change in one request. Its `path` is just the path to a file like `/gen/hood/hi/hoon` and the [miso](./data-types.md#miso) is one of these types of requests:

* `%del` - Delete a file.
* `%ins` - Insert file. This will also replace an existing file.
* `%dif` - This has not yet been implemented so will crash with a `%dif-not-implemented` error.
* `%mut` - Change a file. At the time of writing this behaves identically to `%ins` so its use merely informs the reader.

#### Returns

Clay does not give any response to an `%info` `task` so don't expect a `sign` back.

#### Example

Here are examples of using each of these as well as making multiple changes in one request:

* [%del](examples.md#del)
* [%ins](examples.md#ins)
* [%mut](examples.md#mut)
* [Multiple Changes](examples.md#multiple-changes)

***

## Apps and updates <a href="#apps-and-updates" id="apps-and-updates"></a>

### `%rein` - Force apps <a href="#rein---force-apps" id="rein---force-apps"></a>

```hoon
[%rein des=desk ren=rein]
```

Force on/off apps on a desk. A [`rein`](data-types.md#rein) is a `map` from Gall agent name to `?`, where `%.y` is _on_ and `%.n` is _off_. By default, a live desk will run the agents defined in its `desk.bill` manifest, so this is used to either stop agents in its manifest or start agents which aren't in its manifest.

Note that the given `rein` overrides the existing one set by a previous `%rein` task.

***

### `%tire` - App state sub <a href="#tire---app-state-sub" id="tire---app-state-sub"></a>

```hoon
[%tire p=(unit ~)]
```

A `%tire` task subscribes to, or unsubscribes from, updates to the state of apps. If `p` is non-null, it subscribes. If `p` is null, it unsubscribes.

Once subscribed, you'll immediately receive a `%tire` `gift`, which looks like:

```hoon
[%tire p=(each rock:tire wave:tire)]
```

You'll continue to receive `%tire` `gift`s each time app states change.

A `rock:tire` is a:

```hoon
+$  rock  (map desk [=zest wic=(set weft)])
```

The [`zest`](data-types.md#zest) says whether the desk is running (`%live`), suspended (`%dead`), or suspended pending a kernel-compatible update (`%held`). The `wic` set contains the `weft`s (kernel versions) of any queued updates.

A `wave:tire` is a:

```hoon
+$  wave                           ::
  $%  [%wait =desk =weft]          ::  blocked
      [%warp =desk =weft]          ::  unblocked
      [%zest =desk =zest]          ::  running
  ==                               ::
```

It's an app state delta for a particular desk.

***

### `%wick` - Bump kernel <a href="#wick---bump-kernel" id="wick---bump-kernel"></a>

```hoon
[%wick ~]
```

Try to apply a queued kernel update.

***

### `%zest` - App state <a href="#zest---app-state" id="zest---app-state"></a>

```hoon
[%zest des=desk liv=zest]
```

A `%zest` `task` suspends or unsuspends a desk. the [`zest`](data-types.md#zest) in `liv` is one of:

* `%live`: running.
* `%dead`: suspended.
* `%held`: suspended pending kernel update.

***

## `%tomb` - Tombstoning <a href="#tomb---tombstoning" id="tomb---tombstoning"></a>

```hoon
[%tomb =clue]
```

Tombstoning is the deletion of data for old desk revisions. Clay has a single `%tomb` `task`, but its [`clue`](data-types.md#clue) has a number of different possible actions:

```hoon
+$  clue                                              ::  murder weapon
  $%  [%lobe =lobe]                                   ::  specific lobe
      [%all ~]                                        ::  all safe targets
      [%pick ~]                                       ::  collect garbage
      [%norm =ship =desk =norm]                       ::  set default norm
      [%worn =ship =desk =tako =norm]                 ::  set commit norm
      [%seek =ship =desk =cash]                       ::  fetch source blobs
  ==                                                  ::
```

We'll look at each of these in turn.

### `%lobe` - Specific page <a href="#lobe---specific-page" id="lobe---specific-page"></a>

```hoon
[%lobe =lobe]
```

A `%tomb` `task` with a `%lobe` `clue` will tombstone the `page` matching the given [`lobe`](data-types.md#lobe). If the `page` in question is used in the current revision of any desks, it will fail. Otherwise, it will be tombstoned globally.

***

### `%all` - Everything <a href="#all---everything" id="all---everything"></a>

```hoon
[%all ~]
```

A `%tomb` `task` with an `%all` `clue` will tombstone everything that's not used by current desk revisions, globally. This should be used with caution.

***

### `%pick` - Collect garbage <a href="#pick---collect-garbage" id="pick---collect-garbage"></a>

```hoon
[%pick ~]
```

A `%tomb` `task` with a `%pick` `clue` will perform garbage collection, tombstoning any data that should be tombstoned according to current tombstoning policy ([`norm`](data-types.md#norm)s).

***

### `%norm` - Default policy <a href="#norm---default-policy" id="norm---default-policy"></a>

```hoon
[%norm =ship =desk =norm]
```

A `%tomb` `task` with a `%norm` `clue` will set the default tombstoning policy for the given `desk` and `ship`. A [`norm`](data-types.md#norm) is an `(axal ?)`. An `axal` is like a recursive `arch`, and is defined in `arvo.hoon`. The `?` says whether to _keep_ the given file or directory. You may want to look at the `+of` axal engine in `arvo.hoon` for constructing and manipulating the `norm`.

Note the given `norm` will overwrite the existing one for the the ship/desk in question. If you want to modify the existing one, you'll need to retrieve it and make your changes.

***

### `%worn` - Commit policy <a href="#worn---commit-policy" id="worn---commit-policy"></a>

```hoon
[%worn =ship =desk =tako =norm]
```

A `%tomb` `task` with a `%worn` `clue` is like [`%norm`](tasks.md#norm---default-policy), except it only applies to a specific commit for a ship/desk. The [`tako`](data-types.md#tako) denotes the commit to apply the policy.

***

### `%seek` - Backfill <a href="#seek---backfill" id="seek---backfill"></a>

```hoon
[%seek =ship =desk =cash]
```

A `%tomb` `task` with a `%seek` `clue` will attempt to retrieve missing, tombstoned data and integrate it into Clay's object store. The [`cash`](data-types.md#cash) is a reference to a commit on the given ship/desk as either a [`tako`](./data-types.md#tako) or a [`case`](./data-types.md#case).

***

## Manage Mounts <a href="#manage-mounts" id="manage-mounts"></a>

Here we'll look at managing Clay unix mounts programmatically.

There are four Clay `task`s relevant to mounts:

* [%boat](tasks.md#boat---list-mounts) - List mounts.
* [%mont](tasks.md#mont---mount) - Mount something.
* [%ogre](tasks.md#ogre---unmount) - Unmount something.
* [%dirk](tasks.md#dirk---commit) - Commit changes.

### `%boat` - List mounts <a href="#boat---list-mounts" id="boat---list-mounts"></a>

```hoon
[%boat ~]
```

A `%boat` `task` requests the list of existing mounts and does not take any arguments.

#### Returns

The type it returns is a `%hill` `gift`, which looks like:

```hoon
[%hill p=(list @tas)]
```

...where the `@tas` is the name of the mount point.

#### Example

[See here for an example of using %boat.](examples.md#boat)

***

### `%mont` - Mount <a href="#mont---mount" id="mont---mount"></a>

```hoon
[%mont pot=term bem=beam]
```

A `%mont` `task` mounts the specified `beam` to the specified `term` mount point.

A `beam` is the following structure:

```hoon
+$  beam  [[p=ship q=desk r=case] s=path]  ::  global name
```

You can mount the whole desk with a `path` of `/`, and you can also mount subdirectories or even individual files. If you want to mount an individual file, you must exclude its `mark` from the path. For example, if you want to mount `/gen/hood/hi/hoon`, you'd specify `/gen/hood/hi`. It will automatically be given the correct file extension when mounted. If you include the `hoon` mark it will crash (and currently crash your ship).

#### Returns

Clay does not return a `gift` in response to a `%mont` `%task`.

#### Example

[See here for an example of using %mont.](examples.md#mont)

***

### `%ogre` - Unmount <a href="#ogre---unmount" id="ogre---unmount"></a>

```hoon
[%ogre pot=$@(desk beam)]
```

A `%ogre` `task` unmounts the specified mount.

It's defined in `lull.hoon` as taking `$@(desk beam)` but in fact it will only unmount the target when specified as a `term` mount name. Passing it a `desk` will incidentally work if the mount is named the same as the `desk` but otherwise it won't work. Passing it a `beam` will simply not work.

#### Returns

Clay does not return a `gift` in response to a `%ogre` `task`.

#### Example

[See here for an example of using %ogre.](examples.md#ogre)

***

### `%dirk` - Commit <a href="#dirk---commit" id="dirk---commit"></a>

```hoon
[%dirk des=desk]
```

A `%dirk` `task` commits changes in the target mount.

It's defined in `lull.hoon` as taking a `desk` but like [%ogre](tasks.md#ogre---unmount), it actually takes the name of a mount point rather than a `desk` as is specified.

#### Returns

Clay does not return a `gift` in response to a `%dirk` `task`.

#### Example

[See here for an example of using %dirk.](examples.md#dirk)

***

## Merge Desks <a href="#merge-desks" id="merge-desks"></a>

### `%merg` - Merge <a href="#merg---merge" id="merg---merge"></a>

```hoon
$:  %merg
    des=desk                    ::  target
    her=@p  dem=desk  cas=case  ::  source
    how=germ                    ::  method
==
```

A `%merg` `task` will merge the specified source `desk` into the target local `desk`.

The `germ` specifies the merge strategy. You can refer to the [Strategies](using.md#strategies) section of the [Using Clay](using.md) document for details of each `germ`.

If you're merging into a new `desk` you must use `%init`, all other strategies will fail. If the desk already exists, you cannot use `%init`. Otherwise, you're free to use whichever you'd like.

#### Returns

Clay will respond to the request with a `%mere` `gift` which looks like:

```hoon
[%mere p=(each (set path) (pair term tang))]  ::  merge result
```

If the merge succeeded, `p` will look like `[%mere p=[%.y p={}]]` where `p.p` is the set of files which had a merge conflict. For example, `[%mere p=[%.y p={/foo/txt}]]` means there was a conflict with `/foo/txt`. An empty set means there were no conflicts.

If the merge failed, `p` will have a head of `%.n` and then a `[term tang]` where the `term` is an error message and the `tang` contains additional details, for example:

```hoon
[ %mere
    p
  [ %.n
    p=[p=%mate-conflict q=~[[%rose p=[p="/" q="/" r=""] q=~[[%leaf p="foo"] [%leaf p="txt"]]]]]
  ]
]
```

#### Example

[See here for an example of using %merg.](examples.md#merg)

***

## Permissions <a href="#permissions" id="permissions"></a>

For each file or directory, there is both a read permission and a write permission. Each may be set separately and is either a whitelist or a blacklist (but not both). The whitelist/blacklist contains a `set` of ships and/or groups which are allowed or banned respectively. If it's an empty whitelist it means all foreign ships are denied. If it's an empty blacklist it means all foreign ships are allowed.

If permissions are not set for a particular file, they will be inherited from the directory in which it resides. If _that_ directory has no permissions set, they will be inherited from another level up, and so on to the `desk`'s root directory. If the root directory has no permissions set, it will have the default permissions of an empty whitelist, meaning "deny all".

A group is called a `crew` and is just a `set` of ships with a `@ta` name.

The permissions for each file or directory are a pair of `dict` where the head is read permissions and the tail is write permissions.

A `dict` is this structure:

```hoon
+$  dict  [src=path rul=real]  ::  effective permission
```

The `src` path is where the permissions were inherited from and the `real` is this structure:

```hoon
  +$  real                                    ::  resolved permissions
    $:  mod=?(%black %white)                  ::
        who=(pair (set ship) (map @ta crew))  ::
    ==                                        ::
```

So if we scry for permissions with a `%p` `care`, it'll look like:

```hoon
> .^([r=dict:clay w=dict:clay] %cp %/lib/strandio/hoon)
[r=[src=/ rul=[mod=%white who=[p={} q={}]]] w=[src=/ rul=[mod=%white who=[p={} q={}]]]]
```

There are four permission-related `task`s which you can pass to Clay.

A `%perm` `task` is for setting permissions, and the other three are for managing groups:

* `%cred` - Add permission group.
* `%crew` - Get permission groups.
* `%crow` - Get group usage.

We'll look at each of these in turn.

### `%perm` - Set perms <a href="#perm---set-perms" id="perm---set-perms"></a>

```hoon
[%perm des=desk pax=path rit=rite]
```

A `%perm` `task` sets permissions for the target file or directory.

Note this will replace existing permissions rather than add to them, so if you want to add a ship to an existing whitelist or whatever you'll have to first read the existing permissions, add the ship, then send the whole lot back.

The `pax` path is the file or directory whose permissions you want to change, and the `rite` is this structure:

```hoon
+$  rite                                     ::  new permissions
  $%  [%r red=(unit rule)]                   ::  for read
      [%w wit=(unit rule)]                   ::  for write
      [%rw red=(unit rule) wit=(unit rule)]  ::  for read and write
  ==
```

Where a `rule` is this structure:

```hoon
+$  rule  [mod=?(%black %white) who=(set whom)]  ::  node permission
```

...and finally `whom` is this:

```hoon
+$  whom  (each ship @ta)  ::  ship or named crew
```

As the comment suggests, the `@ta` is the name of a `crew` (group).

#### Returns

Clay does not return a `gift` in response to a `%perm` `task`.

#### Example

[See here for an example of using %perm.](examples.md#perm)

***

### `%cred` - Add group <a href="#cred---add-group" id="cred---add-group"></a>

```hoon
[%cred nom=@ta cew=crew]
```

This simply creates a permission group.

The `nom` is a name for the group and the `crew` is just a `(set ship)`:

```hoon
+$  crew  (set ship)  ::  permissions group
```

#### Returns

Clay does not return a `gift` in response to a `%cred` `task`.

#### Example

[See here for an example of using %cred.](examples.md#cred)

***

### `%crew` - Get groups <a href="#crew---get-groups" id="crew---get-groups"></a>

```hoon
[%crew ~]
```

This retrieves all permission groups.

A `%crew` `task` takes no arguments.

#### Returns

Clay wil return a `%cruz` `gift`. It looks like:

```hoon
[%cruz cez=(map @ta crew)]  ::  permission groups
```

The `cez` is just a map from group name to `crew` which is just a `(set ship)`.

#### Example

[See here for an example of using %crew.](examples.md#crew)

***

### `%crow` - Group files <a href="#crow---group-files" id="crow---group-files"></a>

```hoon
[%crow nom=@ta]
```

A `%crow` `task` retrieves all files and directories in all `desk`s which have permissions set for the group in question. It will not return inherited permissions, only those explicitly set.

The `nom` is the name of a `crew`.

#### Returns

The `gift` you get back is a `%croz` which looks like:

```hoon
[%croz rus=(map desk [r=regs w=regs])]  ::  rules for group
```

...where `regs` is this structure:

```hoon
+$  regs  (map path rule)  ::  rules for paths
```

#### Example

[See here for an example of using %crow.](examples.md#crow)

***

## Foreign Ships <a href="#foreign-ships" id="foreign-ships"></a>

Here we'll looking at making Clay requests to a foreign ship.

As it currently stands, it's not possible to write to a foreign `desk`. Additionally, remote scries are not implemented. That leaves requests to read files (`%warp`) and merge desks (`%merg`), which we'll look at next.

### `%warp` - Remote <a href="#warp---remote" id="warp---remote"></a>

To read files on a foreign `desk`, you just send Clay a `%warp` `task` (as you would for a local read) and specify the target ship in the `wer` field. For details on making such requests, see the [Read and Subscribe](tasks.md#warp---read-and-track) section.

Clay only allows a subset of `care`s to be used remotely. They are:

* `%u` - Check for existence of file.
* `%v` - Get entire `dome` state of a desk.
* `%w` - Get revision number.
* `%x` - Get data of file.
* `%y` - Get `arch` of file or directory.
* `%z` - Get content hash of file or directory.

Any other `care` will crash with a `%clay-bad-foreign-request-care` error.

In addition, Clay only allows `%sing` and `%many` requests -- not `%next` or `%mult`. One way to get the next revision is to first `%sing` the current revision number using `%w` and case `da+now`, then `%sing` again with the next revision number using case `ud+<next-revision-number>`.

The foreign ship will respond only if correct permissions have been set. See the [Permissions](tasks.md#permissions) section for details.

Note that if you're reading a whole `desk` or directory, all subfolders and files must also permit reading. If even a single file does not permit you reading it, the foreign ship will not respond to the request.

***

#### Example

[See here for examples of requests to foreign ships.](examples.md#foreign-ships)

### `%merg` - Remote <a href="#merg---remote" id="merg---remote"></a>

To merge a foreign `desk` into a local one, you just send Clay a `%merg` `task` (as you would for a local merge) and specify the foreign ship in the `her` field. For details on making such requests, see the [Merge Desks](tasks.md#merge-desks) section.

The foreign ship will respond only if correct permissions have been set. See the [Permissions](tasks.md#permissions) section for details.

Note that all subfolders and individual files within the `desk` must permit your reading in order for the merge to succeed. If even one file does not permit you reading it, the remote ship will not respond to the request at all.

#### Example

[See here for examples of requests to foreign ships.](examples.md#foreign-ships)

***
