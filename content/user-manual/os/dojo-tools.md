---
description: "Complete refernce for the Dojo, Urbit's CLI. Includes common actions self-hosted users will need to run their Urbit server."
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

# Dojo Tools

Below are the various generators, threads and other tools included with the `%base` desk and usable in the dojo. These are organized into rough categories for convenience.

These may be invoked in one of three ways:

- `+` means a generator (standalone computation) which changes nothing in the system
- `|` means a “Hood” generator which may make changes to the system
- `-` means a thread

## Apps and updates {#apps-and-updates}

These tools are for managing desks, apps and updates. Install, uninstall, suspend, resume, pause updates, etc.

### `+gall/agents` {#gallagents}

Print out the status of Gall agents on a desk.

Agents may either be `archived` or `running`. Nuked or unstarted agents which are not on the manifest are omitted.

#### Arguments

```
desk
```

#### Example

```
> +gall/agents %landscape
status: running   %hark-system-hook
status: running   %treaty
status: running   %docket
status: running   %settings-store
status: running   %hark-store
```

---

### `|bump` {#bump}

Apply a kernel update.

If `%zuse`'s kelvin version has decreased, try to apply the update. If any desks are incompatible with the new `%zuse` version, they'll be suspended pending a compatible update.

#### Examples

Try to apply update, suspending any incompatible desks:

```
|bump
```

---

### `|install` {#install}

Install a desk, starting its agents and listening for updates.

If it's a remote desk we don't already have, it will be fetched. The agents started will be those specified in the `desk.bill` manifest. If it has a docket file, its tile will be added to the homescreen and its glob fetched. If we already have the desk, the source for updates will be switched to the ship specified.

It takes a `$ship` and `$desk` as its mandatory arguments. The desk may be installed with a different name specified in the optional `.local` argument.

#### Arguments

```
ship desk, =local desk
```

#### Examples

```
|install ~zod %bitcoin
```

```
|install our %webterm
```

```
|install ~zod %bitcoin, =local %foo
```

---

### `|nuke` {#nuke}

Shut down an agent and permanently delete its state.

The default behaviour is to shut down the specified Gall agent and discard its state, similar to the now-deprecated `|fade` generator. **Note this irreversibly wipes the app's state**. Additionally, if the optional `$desk` argument is `%.y`, it takes a desk rather than an agent name and nukes every agent on the specified desk.

#### Arguments

```
@tas, =desk ?
```

#### Examples

Nuke a single agent:

```
|nuke %btc-wallet
```

Nuke every agent on a desk:

```
|nuke %bitcoin, =desk &
```

---

### `|ota` {#ota}

Set the source of updates for the `%base` desk (the kernel and core apps) to the specified ship. Automatic updates will be enabled, and any new updates available will be fetched and installed.

#### Arguments

```
ship
```

#### Examples

`|ota ~marzod` is equivalent to `|install ~marzod %kids, =local %base`.

---

### `|pause` {#pause}

Pause updates on a desk.

The specified desk will stop tracking updates from its upstream source.

#### Arguments

```
desk
```

#### Examples

```
|pause %bitcoin
```

---

### `|rein` {#rein}

Adjust the state of a desk.

This allows you to stop and start agents on a desk, regardless of whether they're on the manifest. Stopped agents have their states archived. It can also suspend and revive the whole desk with the optional `liv` argument.

#### Arguments

```
desk (list [? dude:gall]), =liv ?
```

#### Examples

Start an agent:

```
|rein %bitcoin [& %btc-provider]
```

Stop an agent, archiving its state:

```
|rein %bitcoin [| %btc-wallet]
```

Stop one agent, start another:

```
|rein %bitcoin [| %btc-wallet] [& %btc-provider]
```

Suspend a desk:

```
|rein %bitcoin, =liv |
```

Revive a desk:

```
|rein %bitcoin
```

---

### `|revive` {#revive}

Revive all agents on a desk, migrating archived states.

All agents specified in `desk.bill` which are suspended will be restarted. If updates to the agents have occurred since their states were archived, they'll be migrated with the state transition functions in the agent. This generator does the same thing as selecting "Resume App" from the app tile's hamburger menu.

#### Arguments

```
desk
```

#### Examples

```
|revive %bitcoin
```

---

### `|start` {#start}

Start an agent.

#### Arguments

```
term term
```

This first `$term` is mandatory, the second is optional. If two terms are provided, the first is the desk and the second is the agent on that desk to start. If only one term is provided, it's the name of the agent, and the desk is inferred to be the current desk (typically `%base`).

#### Example

```
> |start %landscape %chat-cli
>=
```

---

### `|suspend` {#suspend}

Shut down all agents on a desk, archiving their states.

The tile in the homescreen (if it has one) will turn gray and say "Suspended" in the top-left corner. This generator does the same thing as selecting "Suspend" from an app tile's hamburger menu.

#### Arguments

```
desk
```

#### Examples

```
|suspend %bitcoin
```

---

### `|uninstall` {#uninstall}

Uninstall a desk, suspending its agents and ignoring updates.

The specified desk will be retained in Clay, but its agents will all be stopped and have their states archived like [`|suspend`](#suspend). This is the reverse of [`|install`](#install).

Note that this will not remove the tile or glob from the homescreen, so if the desk has a tile it should be uninstalled with the "Remove App" button in the tile's hamburger menu.

#### Arguments

```
desk
```

#### Examples

```
|uninstall %bitcoin
```

---

### `+vats` {#vats}

Print out the status of each installed desk.

Also see the related [`+vat`](#vat) command, which prints the status of a single desk rather than all desks.

Fields:

- `/sys/kelvin` - The kernel version(s) the desk is compatible with.
- `base hash` - The merge base (common ancestor) between the desk and its upstream source.
- `%cz hash` - The hash of the desk.
- `app status` - May be `suspended` or `running`.
- `force on` - The set of agents on the desk which have been manually started despite not being on the `desk.bill` manifest.
- `force off` - The set of agents on the desk which have been manually stopped despite being on the `desk.bill` manifest.
- `publishing ship` - The original publisher if the source ship is republishing the desk.
- `updates` - May be `local`, `remote` or `paused`. Local means it will receive updates via commits on the local ship. Remote means it will receive updates from the `source ship`. Paused means it will not receive updates.
- `source desk` - The desk on the `source ship`.
- `source aeon` - The revision number of the desk on the `source ship`.
- `pending updates` - Updates waiting to be applied due to kernel incompatibility.

#### Arguments

```
?(%suspended %running %blocking %nonexistent), =verb ?, =show-suspended ?, =show-running ?, =show-blocking ?, =show-nonexistent ?
```

All arguments are optional.

With no arguments, it prints verbose details for all desks. If the optional `.verb` argument is set to `|`, verbosity is reduced.

It may optionally take one of four filters as a primary argument:

- `%suspended`: filter for suspended desks only.
- `%running`: filter for desks that are installed and running.
- `%blocking`: filter for desks that are blocking a kernel update due to incompatibility.
- `%nonexistent`: filter for desks we should have but don't yet.

Alternatively, these filters can be *excluded* from the default output of everything by setting one or more of the `=show-*` arguments to `|`.


#### Examples

Print everything verbosely (no arguments):

```
> +vats
  %base                                                                                        
  /sys/kelvin:      [%zuse 414]                                                                
  base hash:        0v8.n40h1.hjn8c.e762q.ncgh0.e4gq3.6n3l5.5kt8l.6gtdr.ovbah.u3avd            
  %cz hash:         0v8.n40h1.hjn8c.e762q.ncgh0.e4gq3.6n3l5.5kt8l.6gtdr.ovbah.u3avd            
  app status:       running                                                                    
  force on:         ~                                                                          
  force off:        ~                                                                          
  publishing ship:  ~                                                                          
  updates:          local                                                                      
  source ship:      ~                                                                          
  source desk:      ~                                                                          
  source aeon:      ~                                                                          
  kids desk:        ~
  pending updates:  ~
::
  %landscape
  /sys/kelvin:      [%zuse 416] [%zuse 415] [%zuse 414]
  base hash:        ~
  %cz hash:         0v18.hnfi7.tps9t.0bv04.ikolg.ge98v.6f24v.a65m7.hlicn.rcl98.3skdu
  app status:       running
  force on:         ~
  force off:        ~
  publishing ship:  [~ ~lander-dister-dozzod-dozzod]
  updates:          remote
  source ship:      ~lander-dister-dozzod-dozzod
  source desk:      %landscape
  source aeon:      0
  kids desk:        ~
  pending updates:  ~
::
.......
```

Print suspended desks:

```
> +vats %suspended
  %foo
  /sys/kelvin:      [%zuse 415]
  base hash:        0vo.9f28r.java2.qnmqf.b3t1l.65mlu.8qsql.hq0cv.fpmdr.vuo1e.iehht
  %cz hash:         0vo.9f28r.java2.qnmqf.b3t1l.65mlu.8qsql.hq0cv.fpmdr.vuo1e.iehht
  app status:       suspended
  force on:         ~
  force off:        ~
  publishing ship:  ~
  updates:          local
  source ship:      ~
  source desk:      ~
  source aeon:      ~
  kids desk:        ~
  pending updates:  ~
::
```

Print suspended desks with low verbosity:

```
> +vats %suspended, =verb |
  %foo
  /sys/kelvin:      [%zuse 415]
  app status:       suspended
  publishing ship:  ~
  pending updates:  ~
::
```

Print everything with low verbosity except suspended desks and blocking desks:

```
> +vats, =verb |, =show-blocking |, =show-suspended |
  %groups
  /sys/kelvin:      [%zuse 417] [%zuse 416] [%zuse 415] [%zuse 414]
  app status:       running
  publishing ship:  [~ ~sogryp-dister-dozzod-dozzod]
  pending updates:  ~
::
  %base
  /sys/kelvin:      [%zuse 414]
  app status:       running
  publishing ship:  ~
  pending updates:  ~
::
  %landscape
  /sys/kelvin:      [%zuse 416] [%zuse 415] [%zuse 414]
  app status:       running
  publishing ship:  [~ ~lander-dister-dozzod-dozzod]
  pending updates:  ~
::
.........
```

---

### `+trouble` {#trouble}

Print out the status of each installed desk.

This is a synonym for [`+vats`](#vats).

#### Example

See [`+vats`](#vats).

---

## Azimuth {#azimuth}

Tools for managing PKI updates from Azimuth.

### `+azimuth/block` {#azimuthblock}

Print the most recent Ethereum block that has been processed.

This is a good way to check if your ship's somehow got behind on PKI state. If the block printed is substantially behind the most recent Ethereum block, it indicates a problem. Note it's normal for it to be a little behind.

#### Example

```
> +azimuth/block
15.664.748
```

---

### `:azimuth|listen` {#azimuthlisten}

Add a source for PKI updates for a list of ships.

Sets the source that the public keys for a set of ships should be obtained from. This can either be a Gall agent that communicates with an Ethereum node as in the case of galaxies, stars, and planets, or a ship, as in the case of moons.

#### Arguments

Either:

```
(list ship) %ship ship
```

Or:

```
(list ship) %app term
```

The list of ships are those for which you want Azimuth updates from the specified source. The source is either a ship (`%ship ~sampel`) or an agent (`%app %some-agent`).

#### Example

```
> :azimuth|listen ~[~sampel ~palnet] %ship ~wet
>=
```

---

### `-azimuth-load` {#azimuth-load}

Refetch and load Azimuth snapshot.

#### Example

```
> -azimuth-load
ship: loading azimuth snapshot (106.177 points)
[%eth-watcher 'overwriting existing watchdog on' /azimuth]
ship: processing azimuth snapshot (106.177 points)
```

---

### `+azimuth/sources` {#azimuthsources}

List all Azimuth sources.

This will print a [`state-eth-node:jael`](../../urbit-os/kernel/jael/data-types.md#state-eth-node) structure. Its contents is mostly other ships who are sources for updates about moons, but it will also include `%azimuth`.

#### Example

```
> +azimuth/sources
[ top-source-id=0
  sources={}
  sources-reverse={}
  default-source=0
  ship-sources={}
  ship-sources-reverse={}
]
```

---

### `:azimuth|watch` {#azimuthwatch}

Change node URL and network for Azimuth.

#### Arguments

```
cord ?(%mainnet %ropsten %local %default)
```

The first argument is the note URL in a cord like `'http://eth-mainnet.urbit.org:8545' `. The second argument specifies the network.

#### Example

```
> :azimuth|watch 'http://eth-mainnet.urbit.org:8545' %default
>=
```

---

## CLI Apps {#cli-apps}

These commands are for managing the dojo and other CLI apps.

### `:dojo|acl` {#dojoacl}

Show which ships you've allowed remote access to your dojo.

#### Example

```
~zod:dojo> :dojo|allow-remote-login ~bus
>=

~zod:dojo> :dojo|acl
>=
{~bus}
```

---

### `:dojo|allow-remote-login` {#dojoallow-remote-login}

Allow a ship to `|dojo/link` your dojo.

#### Arguments

The ship you want to allow remote access.

```
ship
```

#### Example

Allow ~bus to link ~zod's dojo:

```
~zod:dojo> :dojo|allow-remote-login ~bus
>=

~zod:dojo> :dojo|acl
>=
{~bus}
```

Link ~zod's dojo on ~bus:

```
~bus:dojo> |dojo/link ~zod %dojo
>=
[linked to [p=~zod q=%dojo]]

~zod:dojo>
```

---

### `:dojo|wipe` {#dojowipe}

Clear the dojo's subject.

This will clear all values pinned to the dojo's subject with commands like `=foo 42`.

#### Example

```
> =foo 42

> foo
42

> :dojo|wipe
>=

> foo
-find.foo
dojo: hoon expression failed
```

---

### `:dojo|revoke-remote-login` {#dojorevoke-remote-login}

Revoke permission for a remote ship to `|dojo/link` your dojo.

#### Arguments

The ship whose permission you wish to revoke.

```
ship
```

#### Example

```
~zod:dojo> :dojo|allow-remote-login ~bus
>=

~zod:dojo> :dojo|acl
>=
{~bus}

> :dojo|revoke-remote-login ~bus
>=

> :dojo|acl
>=
{}
```

---

### `|dojo/link` {#dojolink}

Connect a local or remote CLI app.

Note a ship's moons can automatically link its dojo, but other ships require explicit permission with [`:dojo|allow-remote-login`](#dojoallow-remote-login).

#### Arguments

```
ship term
```

The `$ship` is optional, it's only necessary if the app is on a remote ship. The `$term` is mandatory, and is the name of the CLI app to connect.

#### Example

Connect to the dojo on a remote ship (this is only possible if you have permission):

```
|dojo/link ~sampel-palnet %dojo
>=
[linked to [p=~sampel-palnet q=%dojo]]
~sampel-palnet:dojo>
```

Connect to the `%chat-cli` app locally:

```
|dojo/link %chat-cli
>=
[linked to [p=~zod q=%chat-cli]]
~zod:chat-cli/ 
```

Note you can cycle between CLI apps with `Ctrl+X`. You can disconnect a CLI app with the [|dojo/unlink](#dojounlink) command.

---

### `|dojo/unlink` {#dojounlink}

Disconnect a local or remote CLI app.

#### Arguments

```
ship term
```

The `$ship` is optional, it's only necessary if the app is on a remote ship. The `$term` is mandatory, and is the name of the CLI app to disconnect.

#### Example

Disconnect the local `%chat-cli` app:

```
> |dojo/unlink %chat-cli
>=
[unlinked from [p=~zod q=%chat-cli]]
```

Disconnect from a remote dojo session:

```
> |dojo/unlink ~sampel-palnet %dojo
>=
[unlinked from [p=~sampel-palnet q=%dojo]]
```

---

## Developer tools {#developer-tools}

These tools are mostly useful to developers or similarly technical people.

### `.` {#.}

Make a jamfile and write to disk. A noun is jammed and then written to `pier/.urb/put/path/extension` using a `%sag` `%blit`, saving it as a jamfile.

#### Arguments

```
path/extension noun
```

#### Example

This command is often used for writing pills to disk - see e.g. [`+pill/solid`](#pillsolid).

```
> .solid/pill +pill/solid %base
```

You can also jam arbitrary nouns, e.g.

```
> .decrement/atom [8 [1 0] 8 [1 6 [5 [0 7] 4 0 6] [0 6] 9 2 [0 2] [4 0 6] 0 7] 9 2 0 1]
```

This is the Nock formula for decrement. If you copy it from `/pier/.urb/put/decrement.atom` to `pier/base` then you can run it by scrying it from Clay and running `+cue` to reobtain the formula. 

```
> .*(100 (cue .^(@ %cx %/decrement/atom)))
99
```

### `@` {#@}

Write atom to a file in binary.

#### Arguments

```
path @
```

#### Example

```
> `@test/atom 123`
```

will create a file called `test.atom` in `pier/.urb/put/test.atom`. The contents of this file is a binary representation of the atom, `1111011`.

### `+ames/flows` {#amesflows}

Print details of Ames flows by ship.

#### Arguments

This argument is optional:

```
@ud
```

If no argument is provided, it will print details of Ames flows for all ships, sorted by the number of flows. If a number n is provided as an argument, it'll only print the top n results.

#### Example

All flows:

```
> +ames/flows
~[
  [ ship=~mister-dister-dozzod-dozzod
    open=[out-open=3 out-closing=0 in=0 nax=0]
    corked=0
  ]
  [ship=~nec open=[out-open=1 out-closing=0 in=0 nax=0] corked=0]
  [ ship=~dister-dozzod-dozzod
    open=[out-open=1 out-closing=1 in=0 nax=0]
    corked=0
  ]
  [ ship=~lander-dister-dozzod-dozzod
    open=[out-open=1 out-closing=0 in=0 nax=0]
    corked=0
  ]
]
```

Top 2 ships:

```
> +ames/flows 2
~[
  [ ship=~mister-dister-dozzod-dozzod
    open=[out-open=3 out-closing=0 in=0 nax=0]
    corked=0
  ]
  [ship=~nec open=[out-open=1 out-closing=0 in=0 nax=0] corked=0]
]
```

---

### `|ames/prod` {#amesprod}

Reset congestion control; re-send packets immediately.

Ames uses a backoff algorithm for congestion control. This can be inconvenient when debugging in certain cases, you may have to wait a couple of minutes before an unacknowledged packet is re-sent. This generator resets congestion control, causing at least one pending packet to be immediately re-sent for each flow.

#### Arguments

```
ship ship ship ...
```

If no argument is given, congestion control will be reset for all flows. Otherwise, you can specify a number of `$ship`s, and congestion control will only be reset for flows to those ships.

#### Example

```
> |ames/prod
>=

> |ames/prod ~bus ~wex
>=
```

---

### `|ames/sift` {#amessift}

Filter Ames debug printing by ship.

This filters the output controlled by [`|ames/verb`](#amesverb).

#### Arguments

```
ship ship ship ....
```

If no argument is given, filtering is disabled. Otherwise, Ames debug printing will be filter to only include the specified ships.

#### Example

Enable filtering:

```
> |ames/sift ~nec ~bus
>=
```

Disable filtering:

```
> |ames/sift
>=
```

---

### `|ames/snub` {#amessnub}

Blacklist/whitelist ships in Ames.

All packets from either the blacklisted ships or all non-whitelisted ships (as the case may be) will be dropped.

#### Arguments

```
?(%allow %deny) ship ship ship ship ....
```

(Either `%allow` or `%deny` then a list of ships.)

- `%allow` or `%deny` set whether the following ships are a whitelist or blacklist.

{% hint style="info" %}

Note that while `%deny` is ordinary blacklist blocking, `%allow` means *any* ships not on the list will be blocked.

Note also that this generator totally overrides existing snub settings - it doesn't just add or remove ships from an existing list.

{% endhint %}

#### Example

Create a blocklist:

```
> |ames/snub %deny ~wet ~sampel ~sampel-palnet
>=
```

Create a whitelist (and therefore block everyone else):

```
> |ames/snub %allow ~wet ~sampel ~sampel-palnet
>=
```

---

### `+ames/timers` {#amestimers}

Print Ames message-pump timers by ship.

#### Arguments

```
@ud
```

If no argument is provided, it will print details of Ames timers for all ships, sorted by the number of timers. If a number n is provided as an argument, it'll only print the top n results.

#### Example

Print all the Ames timers for all ships:

```
> +ames/timers
~[
  [~.~mister-dister-dozzod-dozzod 3]
  [~.~dister-dozzod-dozzod 2]
  [~.~lander-dister-dozzod-dozzod 1]
]
```

Print the top two ships:

```
> +ames/timers 2
~[[~.~mister-dister-dozzod-dozzod 3] [~.~dister-dozzod-dozzod 2]]
```

---

### `|ames/verb` {#amesverb}

Enable verbose Ames debug printing.

#### Arguments

```
verb verb verb...
```

A `$verb:ames` is one of `%snd`, `%rcv`, `%odd`, `%msg`, `%ges`, `%for`, or `%rot`. Each one enables printing of different kinds of events. You can enable as many as you want at one time. If `|ames/verb` is given no argument, it disables all Ames debug printing.

For details of the meaning of these `$verb`s, see its entry in the [Ames Data Types documentation](../../urbit-os/kernel/ames/data-types.md#verb).

#### Example

```
> |ames/verb %msg
>=

> |hi ~nec
>=
ames: ~nec: plea [[~zod 1] [~nec 1] bone=[0 %g /ge/hood]]

> |ames/verb
>=
```

---

### `|ames/wake` {#ameswake}

Clean up Ames timers.

Set timers for Ames flows that lack them, cancel timers for Ames flows that have them but shouldn't.

#### Example

```
> |ames/wake
>=
```

---

### `+pill/brass` {#pillbrass}

Build a brass pill.

A *brass* pill is a complete bootstrap sequence that recompiles the vanes, unlike a [`+pill/solid`](#pillsolid) pill which does not.

#### Arguments

```
%base-desk %extra-desk-1 %extra-desk-2 ...
```

The first argument is the desk to be used as "base", containing the kernel etc. Any extra desks are optional.

The base desk may alternatively be specified as a path to a `/sys` directory including the path prefix like `/=some-desk=/foo/bar/sys`. In that case, the path prefix from that path will be used to determine the base desk. This is only useful if you want the start-up events in the pill to use an alternative compiler or Arvo source.

#### Example

Export a brass pill containing just the `%base` desk:

```
> .brass/pill +pill/brass %base
%brass-parsing
%brass-parsed
%brass-compiling
%brass-compiled
[%user-files 420]
```

The pill will now be available in `<pier>/.urb/brass.pill` in the host filesystem.

Export a brass pill with multiple desks:

```
> .brass/pill +pill/brass %base %landscape %webterm
%brass-parsing
%brass-parsed
%brass-compiling
%brass-compiled
[%user-files 128]
[%user-files 93]
[%user-files 420]
```

---

### `-build-cast` {#build-cast}

Build a static mark conversion gate.

#### Arguments

```
path
```

The path is of the format `%/from-mark/to-mark`. It must being with the path prefix denoting the desk that contains the specified mark files.

#### Example

```
> =tape-to-json -build-cast %/tape/json
> (tape-to-json "foo")
[%s 'foo']
```

---

### `-build-file` {#build-file}

Build a Hoon file.

#### Arguments

```
path
```

The path points to a Hoon file in Clay It must begin with the path prefix.

#### Example

```
> =numbers -build-file %/lib/number-to-words/hoon
> (to-words:eng-us:numbers 42)
[~ "forty-two"]
```

---

### `-build-mark` {#build-mark}

Build a dynamic mark core.

A dynamic mark core is one that deals with `$vase`s rather direct values. Its type is a `$dais:clay`.

#### Arguments

```
path
```

The path is a path prefix followed by the mark, like `%/txt`. The mark in question must exist in the desk specified by the prefix.

#### Example

```
> =txt-dais -build-mark %/txt
> !<  (urge:clay cord)  (~(diff txt-dais !>(~['foo' 'bar'])) !>(~['foo' 'baz']))
~[[%.y p=1] [%.n p=<|bar|> q=<|baz|>]]
```

---

### `-build-nave` {#build-nave}

Build a static mark core.

A static mark core is one that deals with values directly rather than vases. Its type is a `$nave:clay`.

#### Arguments

```
path
```

The path is a path prefix followed by the mark, like `%/txt`. The mark in question must exist in the desk specified by the prefix.

#### Example

```
> =txt-nave -build-nave %/txt
> (diff:txt-nave ~['foo' 'bar' 'baz'] ~['foo' 'zoo' 'baz'])
~[[%.y p=1] [%.n p=<|bar|> q=<|zoo|>] [%.y p=1]]
```

---

### `-build-tube` {#build-tube}

Build a dynamic mark conversion gate.

A *dynamic* mark conversion gate is one that deals with `$vase`s rather that plain nouns. Its type is a `$tube:clay`.

#### Arguments

```
path
```

The path is of the format `%/from-mark/to-mark`. It must being with the path prefix denoting the desk that contains the specified mark files.

#### Example

```
> =txt-mime-tube -build-tube %/txt/mime
> !<  mime  (txt-mime-tube !>(~['foo']))
[p=/text/plain q=[p=3 q=7.303.014]]
```

---

### `+dbug` {#dbug}

Query the state or bowl of a running agent.

#### Arguments

See the [dbug section of App School lesson 3](../../build-on-urbit/app-school/3-imports-and-aliases.md#dbug) for details of usage.

#### Example

This is only used with an `:agent`, not by itself.

```
> :graph-store +dbug [%state '(~(got by graphs) ~zod %dm-inbox)']
>=
>   [p={} q=[~ %graph-validator-dm]]
```

---

### `|gall/sear` {#gallsear}

Clear pending `$move` queue from a ship.

#### Arguments

```
ship
```

The ship from which queued moves should be cleared.

#### Example

```
> |gall/sear ~nec
>=
```

---

### `|gall/sift` {#gallsift}

Set Gall verbosity by agent.

This filters the debug output toggled by [`|gall/verb`](#gallverb).

#### Arguments

```
%agent1 %agent2 %agent3....
```

If agents are specified, debug prints will be filtered to only those agents. If no arguments are given, filtering will be disabled.

#### Example

Filter to just these agents:

```
> |gall/sift %graph-store %dojo
>=
```

Disable filtering:

```
> |gall/sift
>=
```

---

### `|gall/verb` {#gallverb}

Toggle Gall debug printing.

#### Arguments

```
%odd
```

If the `%odd` argument is provided, Gall will print debug information about errors like duplicate `%watch` acks, subscriptions closing due to an agent crashing on a `%fact`, etc.

If no argument is given, such debug printing will be disabled.

#### Example

Turn on error messages:

```
> |gall/verb %odd
>=
```

Turn off error messages:

```
hi ~nec successful
> |gall/verb
>=
```

---

### `|pass` {#pass}

Pass a task to a vane.

{% hint style="warning" %}

**Warning**

This is a powerful command and has the potential to break things if you're not careful.

{% endhint %}

#### Arguments

```
note-arvo
```

A `$note-arvo` is defined in `/sys/lull.hoon` as:

```
+$  note-arvo
  $~  [%b %wake ~]
  $%  [%a task:ames]
      [%b task:behn]
      [%c task:clay]
      [%d task:dill]
      [%e task:eyre]
      [%g task:gall]
      [%i task:iris]
      [%j task:jael]
      [%k task:khan]
      [%$ %whiz ~]
      [@tas %meta vase]
  ==
```

It's a vane letter (`%a` for Ames, `%b` for Behn, etc) followed by one of that vane's tasks.

Note that you can't receive any gifts in response.

#### Example

Run `-hi our "foo"` via Khan:

```
> |pass [%k %fard %base %hi noun+!>([~ our "foo"])] 
>=
< ~zod: foo
```

Pass a `%text` task to Dill:

```
> |pass [%d %text "foo"]
>=
foo
```

---

### `-read` {#read}

Read a file, local or remote.

While [`+cat`](#cat) can only read text files, the `-read` thread can read any kind of file, directory or desk on any ship it has permission to read. This thread doesn't pretty-print the result like `+cat`, it just produces the data.

`-read` isn't limited to ordinary file reads, but can make requests using any care Some `$care`s might be useful, such as `%u` to check file existence. Others have obscure technical uses. The most common is `%x`, which is a normal read.

#### Arguments

```
care ship desk case path
```

- care One of `%a %b %c %d %e %f %p %r %s %t %u %v %w %x %y %z`, denoting a Clay submodule. For details of their meaning, see the [Clay data types documentation](../../urbit-os/kernel/clay/data-types.md#care) and [Clay scry reference](../../urbit-os/kernel/clay/scry.md).
- ship The target ship like `~sampel`, or `our` for the local ship.
- desk The desk like `%base`.
- case The revision you're requesting. This can be one of:
  - `ud+123` - A revision number.
  - `da+now` - The revision at that date-time. You can use `now` for the most recent or an `@da` for another time.
  - `tas+foobar`: A revision label, these are rarely used.
- path The filepath like `/gen/code/hoon`. Note the Clay path prefix is not included since that data was specified separately.

#### Example

Read `sys.kelvin` in the `%base` desk on the local ship at the current revision:

```
> -read %x our %base da+now /sys/kelvin
kel=[lal=%zuse num=418]
```

Check for the existence of that same file:

```
> -read %u our %base da+now /sys/kelvin
%.y
```

---

### `|eyre/serve` {#eyreserve}

Bind a generator to a URL path.

See the [Eyre Guide](../../urbit-os/kernel/eyre/guide.md#generators) for details of writing web-facing generators.

#### Arguments

```
path desk path
```

The first path is the URL path to bind like `/foo/bar/baz`. The second `$path` is the path to the generator in `$desk` like `/gen/who/hoon` (note it does not include the path prefix).

#### Example

Bind `/gen/who/hoon` in the `%base` desk to the `/who` URL path:

```
> |eyre/serve /who %base /gen/who/hoon
>=
bound: %.y
```

In a Unix terminal, try requesting it:

```
> curl http://localhost:8080/who
{"who":"zod"}
```

---

### `+pill/solid` {#pillsolid}

Build a solid pill

A *solid* pill is a partial [`+pill/brass`](#pillbrass) pill, it doesn't recompile the vanes and so boots faster. It is intended for development purposes, not production.

#### Arguments

```
%base-desk %extra-desk-1 %extra-desk-2 ...
```

The first argument is the desk to be used as "base", containing the kernel etc. Any extra desks are optional.

The base desk may alternatively be specified as a path to a `/sys` directory including the path prefix like `/=some-desk=/foo/bar/sys`. In that case, the path prefix from that path will be used to determine the base desk. This is only useful if you want the start-up events in the pill to use an alternative compiler or Arvo source.

#### Example

Export a solid pill containing just the `%base` desk:

```
> .solid/pill +pill/solid %base
%solid-start
%solid-loaded
%solid-parsed
%solid-arvo
[%solid-kernel 0x7c8c.3271]
lull: ~daptyl-fodsen
zuse: ~hadmel-rigrel
vane: %ames: ~podmex-soldef
vane: %behn: ~sartes-masnyl
vane: %clay: ~haptyv-natnev
vane: %dill: ~tindus-rabrys
vane: %eyre: ~wolsem-milsup
vane: %gall: ~folbex-mapfur
vane: %iris: ~macryl-midnyl
vane: %jael: ~molpec-rolhus
vane: %khan: ~mosryp-donleg
[%user-files 420]
```

The pill will now be available in `<pier>/.urb/solid.pill` in the host filesystem.

Export a solid pill with multiple desks:

```
> .solid/pill +pill/solid %base %landscape %webterm
%solid-start
%solid-loaded
%solid-parsed
%solid-arvo
[%solid-kernel 0x5ee.3781]
lull: ~daptyl-fodsen
zuse: ~hadmel-rigrel
vane: %ames: ~podmex-soldef
vane: %behn: ~sartes-masnyl
vane: %clay: ~haptyv-natnev
vane: %dill: ~tindus-rabrys
vane: %eyre: ~wolsem-milsup
vane: %gall: ~folbex-mapfur
vane: %iris: ~macryl-midnyl
vane: %jael: ~molpec-rolhus
vane: %khan: ~mosryp-donleg
[%user-files 128]
[%user-files 93]
[%user-files 420]
```

---

### `-test` {#test}

Run tests for a library.

#### Arguments

```
(list path)
```

Each path is a path to a file to test, and must include the path prefix.

#### Example

Refer to the [Unit Test Guide](../../build-on-urbit/userspace/unit-tests.md) for details of using the `-test` thread.

---

### `+behn/timers` {#behntimers}

Print out currently running Behn timers.

#### Examples

```
> +behn/timers
~[
  [ date=~2022.9.25..10.54.36..ac0c
    duct=~[/ames/pump/~pocwet/0 /ames]
  ]
  [date=~2022.9.25..10.54.36..af7c duct=~[/ames/pump/~wet/8 /ames]]
  [date=~2022.9.25..10.54.36..b166 duct=~[/ames/pump/~nus/4 /ames]]
  [date=~2022.9.25..10.54.36..b3cf duct=~[/ames/pump/~wet/4 /ames]]
.....(truncated for brevity).....
```

---

## Filesystem (Basic) {#filesystem-basic}

These are basic tools for things like copying files, navigating directories, etc.

### `+cat` {#cat}

Read a file at the given location and print its contents in the dojo.

If the specified path points to a directory rather than file, it will list the files in that directory like the [`+ls`](#ls) command documented below.

`+cat` can only print text-based files like `.hoon` source-code, `.txt`, `.html`, etc. It won't work for binary blobs or other non-text files.

#### Arguments

The `$path` is mandatory, the `$vane` is optional. 

```
path, =vane ?(%c %g)
```

The past must include a path prefix.

It *can* query Gall agents rather than Clay files if the optional `, =vase %g` argument is given. In that case, it will perform a `%gx` scry to the given scry path. The type returned must be some kind of text file, either a `@t` or a `$wain` (a `(list @t)`). Most agents do not have scry endpoints that produce text files so the `%g` feature is rarely useful.

#### Example

Read a hoon file:

```
> +cat %/gen/cat/hoon
/~zod/base/~2022.9.4..11.01.12..c392/gen/cat/hoon
::  ConCATenate file listings
::
::::  /hoon/cat/gen
  ::
/?    310
/+    pretty-file, show-dir
::
::::
  ::
:-  %say
|=  [^ [arg=(list path)] vane=?(%g %c)]
=-  tang+(flop `tang`(zing -))
.......(truncated for brevity)..........
```

List the files in a directory:

```
> +cat %/sys/vane
  * /~zod/base/~2022.9.4..11.02.01..5b0a/sys/vane
  ames/hoon
  behn/hoon
  clay/hoon
  dill/hoon
  eyre/hoon
  gall/hoon
  iris/hoon
  jael/hoon
  khan/hoon
```

---
### `|cp` {#cp}

Copy a file.

#### Arguments

The first path is to the file and the second is where to copy it.

```
input=path output=path
```

Both the input and output paths must include the full path prefix.

The output path must end with an explicit filename and mark you can't just point it at a directory.

#### Example

Copy the `code.hoon` generator to the root of `%base` with the name `foo.hoon`:

```
> |cp %/gen/code/hoon %/foo/hoon
>=
+ /~zod/base/9/foo/hoon
```

Let's list the files in the root of `%base`:

```
> +ls %
  app/
  desk/bill
  foo/hoon   <- new file with contents of %/gen/code/hoon
  gen/
  lib/
  mar/
  sur/
  sys/
  ted/
```

---

### `=dir` {#dir}

Change working directory.

Note this is not a generator or thread as are most other tools documented. Rather, it is a special command built directly into the dojo.

#### Arguments

```
path
```

The path must include the path prefix.

If no path is specified, it will switch back to the default location (the root of the `%base` desk at its most recent revision).

#### Example

Let's try changing to the root of the `%landscape` desk

```
> =dir /=landscape=
=% /~zod/landscape/~2022.9.4..13.15.48..5e81
```

The dojo prompt will now look like:

```
~zod:dojo/=/landscape/~2022.9.4..13.15.48..5e81>
```

`%` and `/===` now resolve to this location, so any commands like [`+ls %`](#ls), [`+tree %`](#tree), etc, will be run against this location.

The working directory doesn't need to be the root of a desk, you can also do `=dir /=base=/gen/hood`, etc.

If you specify a different case in the path prefix like `=dir /=base/1`, you will switch to that revision.

To switch back to the default location (the root of the `%base` desk at its most recent revision), you just run `=dir` without an argument.

---

### `+ls` {#ls}

List files and directories at the specified location.

#### Arguments

The `$path` is mandatory, the `$vane` is optional:

```
path, =vane ?(%c %g)
```

The path must include the path prefix.

The default behavior of `+ls` is to query Clay, but Gall agents can also be queried by specifying the optional `=vane %g` argument like `+ls /=some-agent=/foo/bar, =vane %g`. This will perform a scry of the form `.^(arch %gy /=some-agent=/foo/bar)`. Very few Gall agents implement `%y` scry endpoints that produce `$arch` types, so this feature is almost entirely useless.

#### Example

```
> +ls %/sys/vane
  ames/hoon
  behn/hoon
  clay/hoon
  dill/hoon
  eyre/hoon
  gall/hoon
  iris/hoon
  jael/hoon
  khan/hoon
```

Note the mark (file type/extension) is separated with a `/` rather than a `.` as is common in other systems: `/hoon` is not a sub-directory of `/ames` here, it is the mark. Directories can be distinguished from files by their lack of a mark; they'll just look like `app/`.

---

### `+mv` {#mv}

Move a file from one location to another.

#### Arguments

The first path is to the file and the second is where to move it.

```
input=path output=path
```

Both paths must include the path prefix.

The output path must end with an explicit filename and mark you can't just point it at a directory.

#### Example

Create a file:

```
> *foo/txt ~['foo' 'bar' 'baz']
+ /~zod/base/16/foo/txt
```

Move it:

```
> |mv %/foo/txt %/bar/txt
>=
- /~zod/base/17/foo/txt
+ /~zod/base/17/bar/txt
```

---

### `|rm` {#rm}

Delete a file.

Note you cannot delete a directory, but a directory will be disappear once all its files are gone.

#### Arguments

```
path
```

The path must include the path prefix.

#### Example

Create a file:

```
> *foo/txt ~['foo' 'bar' 'baz']
+ /~zod/base/22/foo/txt
```

Delete it:

```
> |rm %/foo/txt
>=
- /~zod/base/23/foo/txt
```

---

### `+tree` {#tree}

Display all files in the given directory and its sub-directories.

#### Arguments

```
path
```

The path must include the path prefix.

#### Example

```
> +tree %/sys
/sys/arvo/hoon
/sys/hoon/hoon
/sys/kelvin
/sys/lull/hoon
/sys/vane/ames/hoon
/sys/vane/behn/hoon
/sys/vane/clay/hoon
/sys/vane/dill/hoon
/sys/vane/eyre/hoon
/sys/vane/gall/hoon
/sys/vane/iris/hoon
/sys/vane/jael/hoon
/sys/vane/khan/hoon
/sys/zuse/hoon
```

---


## Filesystem (Advanced) {#filesystem-advanced}

These are more advanced desk and filesystem tools.

### `|clay/autocommit` {#clayautocommit}

Enable automatic commits for a mounted desk

Auto-commits can be disabled with [`|clay/cancel-autocommit`](#claycancelautocommit).

#### Arguments

```
desk
```

#### Example

In the dojo:


```
> |mount %landscape
>=

> |clay/autocommit %landscape
>=
```

In a separate Unix shell session:

```
echo "foo" > ~/piers/zod/landscape/foo.txt
```

Back in the dojo:

```
+ /~zod/landscape/8/foo/txt
```

---

### `|clay/cancel-autocommit` {#claycancel-autocommit}

Cancel automatic commits for all mounted desks

Note this will cancel automatic commits for all desks, it's not possible to target a single desk.

#### Examples

```
> |clay/cancel-autocommit
>=
```

---

### `|commit` {#commit}

Commit changes to mounted desk

#### Arguments

```
desk, =auto ?
```

The `$desk` is mandatory, the `.auto` is optional.

If `.auto` is `%.y`, auto-commits will be enabled, meaning changes to that desk on the host side will automatically be committed as soon as they happen.

Auto-commits can be disabled with [`|clay/cancel-autocommit`](#claycancelautocommit).

#### Example

In the dojo:

```
> |mount %landscape
>=
```

In a separate Unix shell session:

```
echo "foo" > ~/piers/zod/landscape/foo.txt
```

Back in the dojo:

```
> |commit %landscape
>=
+ /~zod/landscape/6/foo/txt
```

---

### `|clay/fuse` {#clayfuse}

Perform an octopus merge.

A `%fuse` request in Clay replaces the contents of `%destination-desk` with the merge of the specified `$beak`s according to their merge strategies. This has no dependence on the previous state of `%dest` so any commits/work there will be overwritten.

`|clay/fuse` extends this concept with the idea of a tracked source. When specifying beaks to include in your fuse, specify `%track` instead of a case This will tell `|clay/fuse` to retrieve the latest version of the source beak *and* to rerun the `%fuse` request whenever that tracked source changes. A fuse can have many tracked sources, or none. The base may be tracked as well.

#### Arguments

Either:

```
desk %cancel
```

Or:

```
desk path [germ path] [germ path]..., =overwrite ?
```

The first argument is the target `$desk` that will be overwritten. After that is either `%cancel` to cancel an existing tracked fuse, or else a `$path` followed by a series of `[germ path]`. The first `$path` is a `$beak` like `/~zod/foo/track` or `/~zod/foo/5`, and is the base of the octopus merge. For the remaining `[germ path]`, the `$germ` is the merge strategy (for details run `|merge` without arguments and read the help text it prints), and the `$path` is another `$beak`.

The optional `.overwrite` flag allows you to overwrite a currently ongoing fuse. Without this flag, attempting a fuse into a desk that you already `|clay/fuse`'d into will error.

For usage details, you can run `|clay/fuse` without arguments and it'll print out a help text.

#### Examples

```
|clay/fuse %dest /=kids= mate+/~nel/base= meet+/~zod/kids/track

|clay/fuse %old-desk /=kids= only-that+/~nus/test=, =overwrite &

|clay/fuse %desk-to-cancel-fuse-into %cancel
```

---

### `|clay/fuse-list` {#clayfuse-list}

Print tracked fuse sources for a desk.

See the [`|clay/fuse`](#clayfuse) command for details.

#### Example

```
> |clay/fuse-list %base
>=
no ongoing fuse for %base
```

---

### `|label` {#label}

Add a label to a desk revision.

Labels let you name particular commits, and then refer to them by that name rather than date or revision number.

#### Arguments

```
desk term, =aeon @ud
```

The `$desk` and `$term` are mandatory, the `.aeon` is optional. The `$term` is the label to give the revision. If an `$aeon` is not specified, it will default to the most recent revision.

#### Example

```
> |label %base %foo
>=
labeled /~zod/base/foo

> |label %base %bar, =aeon 1
>=
labeled /~zod/base/bar

> =<  lab  .^(dome:clay %cv %)
{[p=%bar q=1] [p=%foo q=9]}

> .^(? %cu /=base/bar/gen/code/hoon)
%.y
```

---

### `|merge` {#merge}

Merge one desk into another.

#### Arguments

```
desk ship desk, =cas case, =gem ?(germ %auto)
```

The first `$desk` is the local merge target. The second `$desk` is the merge source on the specified `$ship`. The optional `.cas` argument specifies a particular case (revision reference) like `ud+5`, `da+now`, etc. The optional `.gem` argument specifies a merge strategy. The default merge strategies is `%auto`, which does a fast-forward `%fine` merge if the target desk exists, and creates a new desk with `%init` if not.

For details of usage and all the different merge strategies, run `|merge` without arguments for a help text.

#### Example

```
> |merge %bitcoin ~bus %bitcoin, =gem %only-this
>=
merged with strategy %only-this
```

---

### `|mount` {#mount}

Mount a desk or directory to the host filesystem.

#### Arguments

A whole desk:

```
desk
```

A directory:

```
path
```

If it's a path it must include the full path prefix.

Note you can't mount a single file directly.

#### Example

Mount the whole `%base` desk:

```
> |mount %base
>=
```

The desk is now accessible at `<pier>/base` in the host filesystem.

Mount the `/gen` directory of the `%base` desk:

```
> |mount %/gen
>=
```

The `/gen` directory is now accessible at `<pier>/gen` in the host filesystem.

---

### `|new-desk` {#new-desk}

Create a new desk either from a blank template or from an existing desk.

#### Arguments

```
desk, =from desk, =hard ?, =gall ?
```

The first `$desk` is the name of the desk to be created.  The optional `.from` is the source desk if present.  The optional `.hard` specifies whether to overwrite an existing desk of the same name.  The optional `.gall` specifies whether to include common Gall support files like `/lib/skeleton`.

#### Example

Create a new desk:

```
> |new-desk %aa
>=
```

The desk is now created in Clay.

Create a new desk from the `%base` desk:

```
> |new-desk %pahoehoe, =from %base
>=
```

The desk is now created in Clay and filled with the contents of `%base`.  (Note that you would want to clear the `desk.bill` file or never `|install` such a desk, since the `%base` agents would be erroneously superseded.)

Create a new desk, overwriting any existing desk and including useful Gall files:

```
> |new-desk %aa, =hard &, =gall &
>=
+ /~zod/aa/2/lib/default-agent/hoon
+ /~zod/aa/2/mar/bill/hoon
+ /~zod/aa/2/lib/skeleton/hoon
+ /~zod/aa/2/mar/json/hoon
+ /~zod/aa/2/lib/dbug/hoon
+ /~zod/aa/2/mar/mime/hoon
```

The desk is now created in Clay.

---

### `|clay/norm` {#claynorm}

Add a tombstone policy rule.

Note that the policy will not be automatically applied when set, you'll need to run [`|pick`](#pick) for the garbage collection to occur.

#### Arguments

```
ship desk path keep=?
```

The path is to a file or directory on the given `$desk` on the given `$ship`. The `?` is `%.n` if it should be tombstoned, `%.y` if it should be kept.

#### Examples

```
> |clay/norm our %bitcoin /gen .n
>=

> |clay/norm our %bitcoin /app .y
>=

> |clay/norm our %webterm / .n
>=

> |clay/norm our %webterm /gen .y
>=

> +clay/norms
~tus/%bitcoin:
  /app: %.y
  /gen: %.n
~mister-dister-dozzod-dozzod/%bitcoin:
~tus/%base:
~tus/%webterm:
  /gen: %.y
  /: %.n
~tus/%kids:
~mister-dister-dozzod-dozzod/%webterm:
~tus/%landscape:
~mister-dister-dozzod-dozzod/%landscape:
```

---

### `+clay/norms` {#claynorms}

Print tombstone policies for all desks.

#### Example

```
> +clay/norms
~tus/%bitcoin:
  /app: %.y
  /gen: %.n
~mister-dister-dozzod-dozzod/%bitcoin:
~tus/%base:
~tus/%webterm:
  /gen: %.y
  /: %.n
~tus/%kids:
~mister-dister-dozzod-dozzod/%webterm:
~tus/%landscape:
~mister-dister-dozzod-dozzod/%landscape:
```

`%.y` means old revisions of the file or directory will be kept, `%.n` means they'll be tombstoned.

---

### `|pick` {#pick}

Apply tombtoning policies; collect garbage.

#### Example

```
> |pick
>=
```

---

### `|private` {#private}

Make a desk directory or file private (prevent remote ships from reading it).

Note that if a desk or directory is publicly readable, making any directories or files inside of it private will prevent remote ships from syncing the entire desk/directory. They'll still be able to read the individual parts that aren't private though, just not the whole thing.

Desks, files and directories can be made publicly readable again with [|public](#public).

#### Arguments

```
desk path
```

The `$desk` is mandatory, the path is optional. If specified, the `$path` is a directory or file in the given desk.

#### Example

```
> |private %landscape
>=

> |private %base /ted/dns
>=
```

---

### `|public` {#public}

Make a desk directory or file publicly readable (allow remote ships to read it).

Things can be made private again with [`|private`](#private).

#### Arguments

```
desk path
```

The `$desk` is mandatory, the path is optional. If specified, the `$path` is a directory or file in the given desk.

#### Example

```
> |public %landscape
>=

> |public %base /ted/dns
>=
```

---

### `|sync` {#sync}

Continuously merge into local desk from another local or remote desk.

Every change on the source desk will be merged into the local one. This tracking can be stopped with [`|unsync`](#unsync).

#### Arguments

```
desk ship desk
```

The first `$desk` is the local target, the second is the source on the specified `$ship`.

#### Example

```
> |sync %webterm ~bus %webterm
>=
kiln: finding ship and desk from %webterm on ~bus to %webterm
kiln: activated sync from %webterm on ~bus to %webterm
kiln: beginning sync from %webterm on ~bus to %webterm
kiln: sync succeeded from %webterm on ~bus to %webterm
```

---

### `|syncs` {#syncs}

List currently active desk syncs.

#### Example

```
> |syncs
>=
kiln: sync configured from %webterm on ~bus to %webterm
```

---

### `|tomb` {#tomb}

Tombstone a file at a particular revision.

Tombstoning means deleting a file's data in an old revision in Clay only leaving the file reference.

This can only tombstone a single file, it cannot recursively tombstone a directory. If a directory is specified, it will fail.

The desk revision number specified cannot be the current revision, it must be an old one. This will only tombstone the file at the specified revision, not any revisions before it.

Note this will also execute any other unapplied tombstone policies as it sends Clay a `%pick` garbage collection task.

#### Arguments

```
path, =dry ?
```

The path is mandatory, it's a path to a file including the full path prefix. If the optional `.dry` argument is `%.y`, it will perform a dry run and not actually tombstone the file.

#### Examples

```
> -read %x our %base ud+3 /foo/txt
bar

> |tomb /=base/3/foo/txt
>=
tomb: [~tus %base /foo/txt 0vr.46d5h.ocj13.age48.mnpnd.567me.1f6uc.9haq8.5ihru.b302i.agt4c [fil=~ dir={}] /foo/txt]

> -read %x our %base ud+3 /foo/txt
(fail)
```

---

### `|unmount` {#unmount}

Unmount a previously mounted desk or directory.

Note that any uncommitted changes on the host side will be discarded.

#### Arguments

```
term
```

If the thing you're unmount is a desk you'll just specify the desk name. If it's a sub-directory of a desk, you must specify the mount-point, which is whatever the directory is called in the host filesystem. For example, if you mounted `%/gen` and it's at `<pier>/gen`, you'd specify `%gen` here.

#### Example

Unmount the `%base` desk:

```
> |unmount %base
>=
```

---

### `|unsync` {#unsync}

Stop syncing a desk with another.

#### Arguments

```
desk ship desk
```

The first `$desk` is the local one receiving updates, the second `$desk` is the source for updates on the specified `$ship`.

#### Example

```
> |unsync %webterm ~bus %webterm
>=
kiln: ended autosync from %webterm on ~bus to %webterm
```

---
## Miscellaneous {#miscellaneous}

Miscellaneous utilities.

### `+hello` {#hello}

Hello, world.

#### Arguments

```
term
```

#### Example

```
> +hello %foo
'hello, foo'
```

---

### `+help` {#help}

Display information about generators.

#### Arguments

```
generator
```

#### Examples

Show help message for all generators in `%base`:

```
+help
```

Show help message for a specific generator in `%base`:

```
+help 'help'
+help %help
```

---

### `|hi` {#hi}

Ping another ship with an optional message.

The hi and message will be displayed in that ship's dojo. This is useful for testing connectivity.

#### Arguments

```
ship cord
```

The target `$ship` is mandatory, the `$cord` is an optional message.

#### Example

Without a message:

```
:: in ~zod's dojo:

> |hi ~bus
>=
hi ~bus successful

:: in ~bus's dojo:

< ~zod:
```

With a message:

```
:: in ~zod's dojo:

> |hi ~bus 'hello'
>=
hi ~bus successful

:: in ~bus's dojo:

< ~zod: hello
```

---

### `+sponsor` {#sponsor}

Print out the sponsor of this ship.

#### Examples

```
> +sponsor
~zod
```

---

### `+keys` {#keys}

Print the `$life` (key revision number) and `$rift` (continuity number aka factory reset number) for a ship.

#### Arguments

```
ship
```

#### Example

```
> +keys our
[life=[~ 1] rift=[~ 1]]

> +keys ~sampel-palnet
[life=[~ 1] rift=[~ 1]]
```

---

## Moons {#moons}

These tools are for spawning and managing moons.

### `|moon` {#moon}

Spawn a new moon.

#### Arguments

```
ship, =public-key pass
```

All arguments are optional. If the `$ship` is not specified, it'll spawn a random moon. If it's specified, it will spawn the given moon.

If `.public-key` is specified, it'll configure the moon with the given public key rather than generating a new key pair. This is useful if your planet has breached and forgotten about its moon.

If spawning a new moon, it will spit out the moon's private key, a long code which looks like `0wn6bMe.l1......`. You can copy this and save it in a `.key` file, then give the key file as an argument to the runtime when booting the moon like:

```
urbit -w sampel-sampel-sampel -k my-moon.key
```

You can also give the runtime the key directly by using `-G` rather than `-k`.

#### Example

Spawn a random moon:

```
> |moon
>=
moon: ~maglys-filted-dozzod-dozbus
0wn6bMe.l1~4K.KDRwj.rJMO1.4Km4h.xqXPo.0MNPP.HjyJF.5y6yc.vMYuc.6ZLW~.JOfLa.nVCm2.VH7sl.xTDAE.inSBu.EL7M5.gx0y0.1NPYe.57000.0mTU1
```

Spawn a specific moon:

```
> |moon ~sampel-dozzod-dozbus
>=
moon: ~sampel-dozzod-dozbus
0w1p.ihqFP.tIP1f.BhPf3.DLZDr.MomhE.~NyqB.wpkPN.KiYhA.rkTbo.OApoe.V0AIx.NI2-Q.Y-vBU.aKOMW.NwagX.iML~Q.mjFzE.g6w0s.oTw00.0mOU1
```

Register an existing moon with the given public key:

```
|moon ~sampel-dozzod-dozbus, =public-key 0w8H.oarut.wDiYO.P~5KZ.PFFtm.jpOVa.k2n6r.hsbbN.fBi9w.L4ftw.wlajH.-exB5.BdaRC.EVfD1.zfR~f.e73-W.KtaY-.Qdchy
>=
```

---

### `|moon-breach` {#moon-breach}

Breach (factory reset) a moon.

This is run on the moon's parent planet. Note that breaching a moon will require to you boot it from scratch with its original keys. Breaching a moon, unlike a planet, will not change its keys. If you no longer have its original keys you'll also need to run [`|moon-cycle-keys`](#moon-cycle-keys) to generate new ones.

#### Arguments

```
ship, =rift @ud
```

The `$ship` is mandatory, it's the moon to breach. The `.rift` is optional, it's the continuity number (factory reset number). You'd specify a `.rift` if you'd factory reset the parent planet and need to skip ahead to a particular rift to match the existing moon. Note you can't turn the rift backwards, only forwards.

#### Example

```
> +keys ~lisret-namdev-ralnup-ribsyr
[life=[~ 1] rift=[~ 0]]

> |moon-breach ~lisret-namdev-ralnup-ribsyr
>=

> +keys ~lisret-namdev-ralnup-ribsyr
[life=[~ 1] rift=[~ 1]]

> |moon-breach ~lisret-namdev-ralnup-ribsyr, =rift 5
>=

> +keys ~lisret-namdev-ralnup-ribsyr
[life=[~ 1] rift=[~ 5]]
```

---

### `|moon-cycle-keys` {#moon-cycle-keys}

Change the keys of a moon.

This is run on the moon's parent. Once you've cycled the moon's keys on its parent, you'll need to run [`|rekey`](#rekey) on the moon itself with the new keys that are printed.

#### Arguments

```
ship, =life life, =public-key pass
```

The `$ship` is mandatory, it's the moon to rekey. The `.life` and `.public-key` are optional.

You'd only specify a `.life` if you needed to jump ahead to a particular key revision. You'd only specify a `.public-key` if you need the moon to have a particular public key. The only time you'd need either of these optional arguments is if you've breach the moon's planet and need to get it back in sync with the existing moon. Note you can only go forward with the `.life`, not backwards.

#### Example

Change the keys for a moon:

```
> |moon-cycle-keys ~lisret-namdev-ralnup-ribsyr
moon: ~lisret-namdev-ralnup-ribsyr
0w1.Nqi99.2~xO3.XtTv8.PRR1N.j-Fxu.PqlYT.rgqdD.RVNCD.TQA9R.Chk-n.mKLsQ.oSgu1.6fc7j.8p7h1.BrKuE.5Wdc2.8j2h4
```

The long code beginning with `0w1.Nq...` are its new private keys. You'd give that code to the [`|rekey`](#rekey) command on the moon itself.

Rekey to a specific `$life` (key revision):

```
> |moon-cycle-keys ~lisret-namdev-ralnup-ribsyr, =life 5
>=
moon: ~lisret-namdev-ralnup-ribsyr
0w2.FP28W.93aWD.FMyO-.j0z4e.x2cLA.bDnbB.OQNJY.A5DdJ.PbnzU.bAPVr.nb6uF.i1HvF.jQYwS.TDLJf.oVMr4.c-WyM.JLcm3
```

Rekey to a specific `$life` and with a specific public key:

```
> |moon-cycle-keys ~lisret-namdev-ralnup-ribsyr, =life 10, =public-key 0w2.oLIwB.dH7BH.GCx3Y.ZQRZe.opK44.GK-HB.Mttqw.lz4FF.neRU3.SudC4.3l0we.UyMWg.dNmLx.rmT-i.SwZtg.nXy7o.wwzGC
>=
```

---

## Spider {#spider}

Tools for interacting with threads and Spider.

### `:spider|kill` {#spiderkill}

Kill all running threads.

#### Example

```
> :spider|kill
>=
```

---

### `:spider|poke` {#spiderpoke}

Poke a running thread.

#### Arguments

```
@ta mark vase
```

The `@ta` is a thread ID of a running thread. The `$mark` and `$vase` are the data to poke the thread with.

---

### `:spider|start` {#spiderstart}

Start a thread.

#### Arguments

```
term vase
```

The `$term` is mandatory, it's the name of a thread in `/ted` in the current desk. The `$vase` is optional, it's the start arguments for the thread if needed.

Note this tool looks for the thread in the *current desk*, so you'll have to change desk with `=dir` if you want to run one elsewhere.

#### Example

```
> :spider|start %hi !>([~ our "foo"])
>=
< ~zod: foo
```

---

### `:spider|stop` {#spiderstop}

Stop a running thread.

#### Arguments

```
@ta
```

The `@ta` is a thread ID of a running thread.

---

### `+spider/tree` {#spidertree}

List all currently running threads.

#### Example

```
> +spider/tree
/eth-watcher--0v2j.5is08.v2ukg.8h6mr.evgt4.o86mf.p3ujf.l2teu.v6q3v.uk1fm.shrog.0pc5o.82tq1.skve4.22nu8.gkr9d.j4tvd.k8bdg.43cgs.rjcvr.eb6lv
```

---

## System {#system}

System information and management tools.

### `|automass` {#automass}

Print memory reports periodically.

Automatic memory reports can be cancelled with [`|cancel-automass`](#cancel-automass).

#### Arguments

```
@dr
```

A `@dr` is a relative time, for example `~s30`, `~m5`, `~h1`, `~d1`, `~d1.h1.m5.s30`, etc.

#### Example

```
> |automass ~s30
>=
```

Thirty seconds later:

```
.....(truncated for brevity).....
total road stuff: B/376
space profile: KB/12.936
total marked: MB/176.019.156
free lists: MB/35.927.760
sweep: MB/176.019.156
```

(and every thirty seconds after)

---

### `|cancel-automass` {#cancel-automass}

Cancel periodic memory reports (enabled by [`|automass`](#automass)).

#### Example

```
> |cancel-automass
>=
```

---

### `+code` {#code}

Print out your web login code.

#### Example

```
> +code
lidlut-tabwed-pillex-ridrup
```

---

### `|code` {#code}

Change your web login code.

You'll be logged out of all existing web sessions when you change the code.

Note that [bridge.urbit.org](https://bridge.urbit.org) won't be able to automatically derive your web login code if you change it.

#### Arguments

```
%reset
```

With the `%reset` argument, the web login code will be changed. With no argument, it'll just print out your existing code and code revision number.

#### Example

With no argument:

```
> |code
riddec-bicrym-ridlev-pocsef
current step=0
use |code %reset to invalidate this and generate a new code
>=
```

With the `%reset` argument:

```
> |code %reset
warning: resetting your code closes all web sessions
continue?
eyre: code-changed: throwing away cookies and sessions
>=

> |code
toppub-dosres-mirres-larpex
current step=1
use |code %reset to invalidate this and generate a new code
>=
```

---

### `-code` {#code}

Print out your web login code (with leading `~`).

#### Example

```
> -code
~lidlut-tabwed-pillex-ridrup
```

---

### `|eyre/cors/approve` {#eyrecorsapprove}

Approve a CORS origin.

#### Arguments

```
@t
```

The argument is a cord containing the origin to approve.

#### Example

```
> |eyre/cors/approve 'http://example.com'
>=

> +eyre/cors/registry
[ requests={~~http~3a.~2f.~2f.localhost~3a.8081}
  approved={~~http~3a.~2f.~2f.example~.com}
  rejected={}
]

> |eyre/cors/approve 'http://localhost:8081'
>=

> +eyre/cors/registry
[ requests={}
    approved
  { ~~http~3a.~2f.~2f.localhost~3a.8081
    ~~http~3a.~2f.~2f.example~.com
  }
  rejected={}
]
```

---

### `+eyre/cors/registry` {#eyrecorsregistry}

Print approved, rejected and requested CORS origins.

#### Example

```
> +eyre/cors/registry
[ requests={~~http~3a.~2f.~2f.localhost~3a.8081}
  approved={}
  rejected={}
]
```

---

### `|eyre/cors/reject` {#eyrecorsreject}

Reject a CORS origin.

#### Arguments

```
@t
```

The argument is a cord containing the origin to reject.

#### Examples

```
> |eyre/cors/reject 'http://foo.com'
>=

> +eyre/cors/registry
[ requests={}
    approved
  { ~~http~3a.~2f.~2f.localhost~3a.8081
    ~~http~3a.~2f.~2f.example~.com
  }
  rejected={~~http~3a.~2f.~2f.foo~.com}
]
```

---

### `-dns-address` {#dns-address}

Request a `<ship>.arvo.network` subdomain and configure SSL.

Note this only works for stars and planets. Note your ship must be accessible on port 80.

If successful, you'll be able to access your ship's web interface at `https://<ship>.arvo.network`.

#### Arguments

```
[%if @if]
```

The `@if` is a *public* IPv4 address in the format `.x.x.x.x` like
`.192.168.1.254`.

#### Example

```
> -dns-address [%if .150.230.14.135]
dns: request for DNS sent to ~deg
dns: awaiting response from ~deg
dns: confirmed access via ralnup-ribsyr.arvo.network
0
```

---

### `|exit` {#exit}

Shut down this ship.

#### Example

```
> |exit
>=
%drum-exit
(ship is now shut down and you're back at the host shell)
```

---

### `|knob` {#knob}

Adjust vane error verbosity.

Note this only applies to `%crud` error messages that look something like:

```
crud: %foo event failed
```

#### Arguments

```
term ?(%hush %soft %loud)
```

The `$term` is an error tag like `%foo`. The verbosity level for the specified tag may be one of:

- `%hush` - Completely silent, print nothing.
- `%soft` - Just print `crud: %error-tag event failed`, ignore any `$tang` given in the `%crud`.
- `%loud` - Print the `%soft` message as well as the full `$tang` given in the `%crud` task.
  
#### Example

Loud:

```
> |knob %foo %loud
>=

> |pass [%d %crud %foo 'blah blah' ~]
>=
crud: %foo event failed
blah blah
```

Soft:

```
> |knob %foo %soft
>=

> |pass [%d %crud %foo 'blah blah' ~]
>=
crud: %foo event failed
```

Hush:

```
> |knob %foo %hush
>=
> |pass [%d %crud %foo 'blah blah' ~]
>=
```

---

### `|mass` {#mass}

Print a memory report.

#### Examples

```
~zod:dojo> |mass
.....(truncated for brevity).....
total road stuff: B/376
space profile: KB/12.936
total marked: MB/176.019.156
free lists: MB/35.927.760
sweep: MB/176.019.156
```

---

### `|meld` {#meld}

Deduplicate memory.

Note this can take a large amount of memory to complete if the ship's existing memory footprint is large. If the host OS has limited memory, it may be more efficient to shut down the ship and [run it directly from the runtime](../running/vere.md#meld).

#### Example

```
> |meld
>=
~zod:dojo> hash-cons arena:
  root: B/160
  atoms (41308):
    refs: KB/927.360
    data: MB/48.373.356
    dict: MB/1.416.880
  total: MB/50.717.596
  cells (3500719):
    refs: MB/70.491.560
    dict: MB/281.966.240
  total: MB/352.457.800
total: MB/403.175.556

pier: meld complete
```

---

### `|pack` {#pack}

Defragment memory.

This is lighter than [`|meld`](#meld) on memory usage but does not compact the ship's state as much.

#### Example

```
> |pack
>=
~zod:dojo> serf: pack: gained: MB/1.729.528
pier: pack complete
```

---


### `|rekey` {#rekey}

Rotate private keys.

**Note this should not be used unless you've changed your network keys on [bridge.urbit.org](https://bridge.urbit.org) first. Using this incorrectly will render your ship unable to communicate.**

Note also this is not for when you perform a factory reset, this is specifically for if you change your keys *without* a factory reset.

If your ship is a moon you'd do the key change on its parent planet rather than through [bridge.urbit.org](https://bridge.urbit.org), and then use `|rekey` on the moon itself.

#### Arguments

```
@t
```

This is the long code inside the `sampel-palnet-1.key` file you downloaded from [bridge.urbit.org](https://bridge.urbit.org) (or the code that your planet printed out in the dojo if a moon). It'll look like `0w9oBR.dfY5Z.LSxut.YHe3u....`. You must wrap it in single-quotes when giving it to this generator, like `'0w9oBR.dfY5Z.LSxut.YHe3u...'`.

#### Example

```
|rekey '0w3.N7qWC.LmuS5.rY6Rb.DQxmF.ta3vf.sOQvP.xOnhv.3P7sL.SjQqb.IbAKo.EU2vM.04S6U.VStzI.RNXij.YntkC.RRG29.AqaLf'
```

---

### `|verb` {#verb}

Toggle kernel event tracing verbose mode.

When enabled, this will print a move trace for every event in Arvo.

#### Example

Toggle on:

```
> |verb
>=
%helm-verb
[ "|||||"
  %give
  %gall
  [%unto %fact]
  i=/gall/use/hood/0w2.cKFc6/out/~tus/dojo/1/drum/phat/~tus/dojo
  t=~[/dill //term/1]
]
[ "|||||"
  %give
  %gall
  [%unto %fact]
  i=/gall/use/hood/0w2.cKFc6/out/~tus/dojo/1/drum/phat/~tus/dojo
  t=~[/dill //term/1]
]
........
```

Run `|verb` again to turn it off.

---

### `|trim` {#trim}

Trim kernel state.

This command is used to reduce memory pressure. Currently, the only two vanes that do anything with a `%trim` task are Eyre and Clay. Eyre closes inactive channels and Clay clears its build cache. Typically these things use little memory so the impact of `|trim` is minimal and it is not useful. For significant memory reduction, see [`|meld`](#meld) and [`|pack`](#pack).

#### Arguments

```
@ud
```

You may *optionally* give a trim priority number as an argument. The lower the number, the higher the priority. Currently, none of the vanes do anything with this so there's no point in specifying it.

#### Example

```
> |trim
>=
```

---

