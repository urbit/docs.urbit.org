# Arvo {#arvo}

The `arvo.hoon` file primarily contains the basic event processing and routing machinery of Arvo, but it also defines a number of useful types and other functions. Some of these have been excluded as they're obscure types only used internally by Arvo, but the rest are documented below.

## `+$arch` {#arch}

Node identity

This represents a node in Clay, which may be a file or a directory.

#### Source {#source}

```hoon
+$  arch  (axil @uvI)
```

#### Examples {#examples}

```
> *arch
[fil=~ dir={}]

> .^(arch %cy %/sys)
[ fil=~
    dir
  { [p=~.hoon q=~]
    [p=~.lull q=~]
    [p=~.kelvin q=~]
    [p=~.vane q=~]
    [p=~.arvo q=~]
    [p=~.zuse q=~]
  }
]

> .^(arch %cy %/sys/arvo/hoon)
[   fil
  [ ~
    0v1s.31due.jlkt7.btvob.bhil7.fusae.55huv.7pghe.2ql6f.l495n.pi6ah
  ]
  dir={}
]
```

---

## `++axal` {#axal}

Fundamental node, recursive

This mold builder creates a representation of a node in Clay like an [`arch`](#arch) or [`axil`](#axil), but the directory map contains more `axal`s, so it contains the entire subtree rather than just one level.

#### Source {#source}

```hoon
++  axal
  |$  [item]
  [fil=(unit item) dir=(map @ta $)]
```

#### Examples {#examples}

```
> *(axal @uvI)
[fil=~ dir={}]

> =/  =path  /sys/vane
  |-
  =+  .^(=arch %cy (en-beam [our %base da+now] path))
  ^-  (axal @uvI)
  :-  fil.arch
  (~(urn by dir.arch) |=([name=@ta ~] ^$(path (snoc path name))))
[ fil=~
    dir
  { [p=~.iris q=[fil=~ dir={[p=~.hoon q=[fil=[~ 0v15.r0nos.81rq5.8t24j.vfnll.8ej0n.knuej.maetm.vr9ja.s3opn.5gtpd] dir={}]]}]]
    [p=~.clay q=[fil=~ dir={[p=~.hoon q=[fil=[~ 0v12.hdbo4.a9j11.amut0.76dvc.cd69g.djmv9.nl9gi.e8m2t.jjfjl.i6sj3] dir={}]]}]]
    [p=~.eyre q=[fil=~ dir={[p=~.hoon q=[fil=[~ 0v1a.l7oim.58p0r.j3qc6.jqce6.r1frb.2jc7u.oqs4f.cf14o.aucva.7vv43] dir={}]]}]]
    [p=~.dill q=[fil=~ dir={[p=~.hoon q=[fil=[~ 0vq.r959f.eiqhv.0ujnq.4eb0r.3qtjq.lcsqt.ef8bu.lul18.abngb.1dbgl] dir={}]]}]]
    [p=~.ames q=[fil=~ dir={[p=~.hoon q=[fil=[~ 0vb.va2dn.8ue5p.5bqal.tn08n.ce2k9.g2c55.dd4tc.5tv9d.7kru2.vvsh1] dir={}]]}]]
    [p=~.gall q=[fil=~ dir={[p=~.hoon q=[fil=[~ 0v13.ovi2q.3vcok.4pn5v.470rl.msg6p.oo5rn.neoai.allbh.8ora9.h26it] dir={}]]}]]
    [p=~.khan q=[fil=~ dir={[p=~.hoon q=[fil=[~ 0v1j.dnfbn.l5cts.4us65.cct40.2urng.hchvv.s2nvs.8pmnp.p7l3l.tqqer] dir={}]]}]]
    [p=~.behn q=[fil=~ dir={[p=~.hoon q=[fil=[~ 0vu.4qadi.sar0t.rbp15.5n8o9.o6ifv.f52bj.nhof9.cl2nr.3osck.8d4ie] dir={}]]}]]
    [p=~.jael q=[fil=~ dir={[p=~.hoon q=[fil=[~ 0v5.4gubl.1bpjb.rnbrq.mir68.c25tq.euqfm.vqvg7.esv65.gp2in.r03op] dir={}]]}]]
  }
]
```

---

## `++axil` {#axil}

Fundamental node

This is the mold builder used to create a representation of a node in Clay. It's used by [`arch`](#arch).

#### Source {#source}

```hoon
++  axil
  |$  [item]
  [fil=(unit item) dir=(map @ta ~)]
```

#### Examples {#examples}

```
> *(axil @uvI)
[fil=~ dir={}]

> .^((axil @uvI) %cy %/sys/vane)
[ fil=~
    dir
  { [p=~.iris q=~]
    [p=~.clay q=~]
    [p=~.eyre q=~]
    [p=~.dill q=~]
    [p=~.ames q=~]
    [p=~.gall q=~]
    [p=~.khan q=~]
    [p=~.behn q=~]
    [p=~.jael q=~]
  }
]
```

---

## `+$beak` {#beak}

Global context

This is the unencoded global path prefix for a node in Clay. It's a triple of a [`ship`](#ship), [`desk`](#desk) and [`case`](#case). The `case` is a revision reference.

#### Source {#source}

```hoon
+$  beak  (trel ship desk case)
```

#### Examples {#examples}

```
> *beak
[p=~zod q=%$ r=[%ud p=0]]

> `beak`[our %base da+now]
[p=~zod q=%base r=[%da p=~2022.11.8..10.16.14..757a]]

> `beak`[our %base ud+1]
[p=~zod q=%base r=[%ud p=1]]

> `beak`[our %base tas+'foo']
[p=~zod q=%base r=[%tas p=%foo]]
```

---

## `+$beam` {#beam}

Global name

An unencoded global path to a node in Clay. The [`beak`](#beak) denotes the [`ship`](#ship), [`desk`](#desk) and [`case`](#case) (revision reference), and then `s` is the path to the node therein.

#### Source {#source}

```hoon
+$  beam  [beak s=path]
```

#### Examples {#examples}

```
> *beam
[[p=~zod q=%$ r=[%ud p=0]] s=/]

> `beam`[[our %base ud+1] /foo/bar]
[[p=~zod q=%base r=[%ud p=1]] s=/foo/bar]
```

---

## `+$bone` {#bone}

Opaque duct handle

This is used by Ames to identify a particular message flow over the network.

#### Source {#source}

```hoon
+$  bone  @ud
```

#### Examples {#examples}

```
> *bone
0

> .^([snd=(set bone) rcv=(set bone)] %ax /=//=/bones/~nes)
[snd={0} rcv={}]
```

---

## `+$case` {#case}

Global version

A reference to a particular revision in Clay. It may be one of:

- `%da`: a date.
- `%tas`: a label (these are seldom used).
- `%ud`: a revision number. The initial commit is 1, and then each subsequent commit increments it.

```hoon
+$  case
  $%  [%da p=@da]
      [%tas p=@tas]
      [%ud p=@ud]
  ==
```

#### Examples {#examples}

```
> *case
[%ud p=0]

> `case`ud+123
[%ud p=123]

> `case`tas+'foo'
[%tas p=%foo]

> `case`da+now
[%da p=~2022.11.8..10.57.44..0e31]
```

---

## `+$cage` {#cage}

Marked vase

A pair of a [`mark`](#mark) and a [`vase`](stdlib/4o.md#vase) (type-value pair). These are extensively used for passing data around between vanes and agents.

#### Source {#source}

```hoon
+$  cage  (cask vase)
```

#### Example {#example}

```
> *cage
[p=%$ q=[#t/* q=0]]

> `cage`[%noun !>('foo')]
[p=%noun q=[#t/@t q=7.303.014]]
```

---

## `++cask` {#cask}

Marked data builder

Like a [`cage`](#cage) except rather than a `vase`, the tail is whatever type was given to the mold builder. These are most frequently used for sending data over the network, as vases can only be used locally.

#### Source {#source}

```hoon
++  cask  |$  [a]  (pair mark a)
```

#### Examples {#examples}

```
> *(cask)
[p=%$ q=0]

> *(cask @t)
[p=%$ q='']

> `(cask @t)`[%noun 'foobar']
[p=%noun q='foobar']

> `(cask)`[%noun 'foobar']
[p=%noun q=125.762.588.864.358]
```

---

## `+$desk` {#desk}

Local workspace

The name of a desk in Clay.

#### Source {#source}

```hoon
+$  desk  @tas
```

#### Examples {#examples}

```
> *desk
%$

> `desk`%base
%base
```

---

## `+$dock` {#dock}

Message target

A pair of a [`ship`](#ship) and Gall agent name. This is most frequently used when composing cards to other agents in a Gall agent.

#### Source {#source}

```hoon
+$  dock  (pair @p term)
```

#### Examples {#examples}

```
> *dock
[p=~zod q=%$]

> `dock`[our %dojo]
[p=~zod q=%dojo]
```

---

## `+$gang` {#gang}

Infinite set of peers

This is used internally by the Scry interfaces in Arvo and its vanes.

#### Source {#source}

```hoon
+$  gang  (unit (set ship))
```

#### Examples {#examples}

```
> *gang
~

> `gang`[~ (silt ~zod ~nec ~)]
[~ {~nec ~zod}]
```

---

## `+$mark` {#mark}

Symbolic content type

The name of a mark file. It will typically correspond to a file in the `/mar` directory of a desk.

#### Source {#source}

```hoon
+$  mark  @tas
```

#### Examples {#examples}

```
> *mark
%$

> `mark`%json
%json
```

---

## `+$mien` {#mien}

Orientation

Some basic information given to Arvo: the local ship's name, the current time, and some entropy.

#### Source {#source}

```hoon
+$  mien  [our=ship now=@da eny=@uvJ]
```

#### Examples {#examples}

```
> *mien
[our=~zod now=~2000.1.1 eny=0v0]
```

---

## `+$page` {#page}

Untyped cage

A pair of a [mark](#mark) and a raw, untyped noun. This is primarily used in Clay.

#### Source {#source}

```hoon
+$  page  (cask)
```

#### Examples {#examples}

```
> *page
[p=%$ q=0]

> `page`[%noun [123 'abc']]
[p=%noun q=[123 6.513.249]]
```

---

## `++omen` {#omen}

Namespace path and data

#### Source {#source}

```hoon
++  omen  |$  [a]  (pair path (cask a))
```

#### Examples {#examples}

```
> *(omen @t)
[p=/ q=[p=%$ q='']]
```

---

## `+$ship` {#ship}

Network identity

Another name for an `@p`.

#### Source {#source}

```hoon
+$  ship  @p
```

#### Examples {#examples}

```
> *ship
~zod

> `ship`~sampel
~sampel
```

---

## `+$sink` {#sink}

Subscription

A triple of a [`bone`](#bone), [`ship`](#ship) and `path`.

#### Source {#source}

```hoon
+$  sink  (trel bone ship path)
```

#### Examples {#examples}

```
> *sink
[p=0 q=~zod r=/]
```

---

## `++hypo` {#hypo}

Type-associated builder

A pair of a type and some value.

#### Source {#source}

```hoon
++  hypo
  |$  [a]
  (pair type a)
```

#### Example {#example}

```
> *(hypo)
[#t/* q=0]
```

---

## `+$meta` {#meta}

Meta-vase

#### Source {#source}

```hoon
+$  meta  (pair)
```

#### Examples {#examples}

```
> *meta
[p=0 q=0]
```

---

## `+$maze` {#maze}

Vase, or [meta-vase](#meta)

#### Source {#source}

```hoon
+$  maze  (each vase meta)
```

#### Examples {#examples}

```
> *maze
[%.y p=[#t/* q=0]]
```

---

## `+$ball` {#ball}

Dynamic kernel action

This contains the action or response in a kernel [`move`](#move). One of:

- `[%hurl [%error-tag stack-trace] wite=pass-or-gift]`: action failed; error.
- `[%pass wire=/vane-name/etc note=[vane=%vane-name task=[%.y p=vase]]]`: advance; request.
- `[%slip note=[vane=%vane-name task=[%.y p=vase]]]`: lateral; make a request as though you're a different vane.
- `[%give gift=[%.y vase]`: retreat; response.

#### Source {#source}

```hoon
+$  ball  (wite [vane=term task=maze] maze)
```

#### Examples {#examples}

```
> *ball
[%give gift=[%.y p=[#t/* q=0]]]
```

---

## `+$card` {#card}

Tagged, untyped event

Note this is not the same as a `card:agent:gall` used in Gall agents.

#### Source {#source}

```hoon
+$  card  (cask)
```

#### Examples {#examples}

```
> *card
[p=%$ q=0]
```

---

## `+$duct` {#duct}

Causal history

Arvo is designed to avoid the usual state of complex event networks: event spaghetti. We keep track of every event's cause so that we have a clear causal chain for every computation. At the bottom of every chain is a Unix I/O event, such as a network request, terminal input, file sync, or timer event. We push every step in the path the request takes onto the chain until we get to the terminal cause of the computation. Then we use this causal stack to route results back to the caller.

The Arvo causal stack is called a `duct`. This is represented simply as a list of [`wire`](#wire)s (paths), where each path represents a step in the causal chain. The first element in the path is the vane handled that step in the computation, or an empty string for Unix.

#### Source {#source}

```hoon
+$  duct  (list wire)
```

#### Examples {#examples}

```
> `duct`-:~(tap in .^((set duct) %cx /=//=/tyre))
~[/gall/use/docket/0w3.kF2UY/~zod/tire /dill //term/1]
```

---

## `++hobo` {#hobo}

`%soft` task builder

#### Source {#source}

```hoon
++  hobo
  |$  [a]
  $?  $%  [%soft p=*]
      ==
      a
  ==
```

#### Examples {#examples}

```
> *(hobo maze)
[%.y p=[#t/* q=0]]
```

---

## `+$goof` {#goof}

Crash label and trace

#### Source {#source}

```hoon
+$  goof  [mote=term =tang]
```

#### Examples {#examples}

```
> *goof
[mote=%$ tang=~]
```

---

## `+$mass` {#mass}

Memory usage

`+whey` produces a `(list mass)` for its memory report.

#### Source {#source}

```hoon
+$  mass  $~  $+|+~
          (pair cord (each * (list mass)))
```

#### Examples {#examples}

```
> *mass
[p='' q=[%.n p=~]]
```

---

## `+$move` {#move}

Cause and action

Arvo makes calls and produces results by processing `move`s. The [`duct`](#duct) is a call stack, and the [`ball`](#ball) contains the action or response.

#### Source {#source}

```hoon
+$  move  [=duct =ball]
```

#### Example {#example}

```
> *move
[duct=~ ball=[%give gift=[%.y p=[#t/* q=0]]]]
```

---

## `+$ovum` {#ovum}

[card](#card) with cause

#### Source {#source}

```hoon
+$  ovum  [=wire =card]
```

#### Examples {#examples}

```
> *ovum
[wire=/ card=[p=%$ q=0]]
```

---

## `+$roof` {#roof}

Namespace

#### Source {#source}

```hoon
+$  roof  (room vase)                                   ::  namespace
```

---

## `+$rook` {#rook}

Meta-namespace (super advanced)

#### Source {#source}

```hoon
+$  rook  (room meta)                                   ::  meta-namespace
```

---

## `++room` {#room}

Generic namespace

This is used internally for scry handlers.

#### Source {#source}

```hoon
++  room                                                ::  either namespace
  |$  [a]
  $~  =>(~ |~(* ~))
  $-  $:  lyc=gang                                      ::  leakset
          vis=view                                      ::  perspective
          bem=beam                                      ::  path
      ==                                                ::
  %-  unit                                              ::  ~: unknown
  %-  unit                                              ::  ~ ~: invalid
  (cask a)
```

---

## `+$roon` {#roon}

Partial namespace

#### Source {#source}

```hoon
+$  roon                                                ::  partial namespace
  $~  =>(~ |~(* ~))
  $-  [lyc=gang car=term bem=beam]
  (unit (unit cage))
```

---

## `+$root` {#root}

Raw namespace

#### Source {#source}

```hoon
+$  root  $-(^ (unit (unit)))
```

---

## `+$view` {#view}

Namespace perspective

#### Source {#source}

```hoon
+$  view  $@(term [way=term car=term])
```

---

## `++wind` {#wind}

Kernel action builder

This is similar to [`wite`](#wite) but without the error case. It's most commonly used in the type of a `card:agent:gall`.

#### Source {#source}

```hoon
::
++  wind
  |$  ::  a: forward
      ::  b: reverse
      ::
      [a b]
  $%  ::  %pass: advance
      ::  %slip: lateral
      ::  %give: retreat
      ::
      [%pass p=path q=a]
      [%slip p=a]
      [%give p=b]
  ==
```

#### Examples {#examples}

```
> *(wind note:agent:gall gift:agent:gall)
[%give p=[%poke-ack p=~]]
```

---

## `+$wire` {#wire}

Event pretext

Type-wise, a `wire` is the same as a [`path`](stdlib/2q.md#path); a `list` of [`knot`](stdlib/2q.md#knot)s with the syntax of `/foo/bar/baz`. While a `path` is typically used in requests to denote a scry or subscription endpoint, a `wire` is used for responses.

On the kernel-level, `wire`s are used in [`duct`](#duct)s to represent a causal step in a call stack for routing purposes. In userspace, they're used the same way under the hood, but practically speaking, they can be thought of as "tags" for responses. That is, when you make a request to a vane of Gall agent, you provide a `wire` for any responses you get back, and you can use this to identity what the response is for.

#### Source {#source}

```hoon
+$  wire  path
```

#### Examples {#examples}

```
> *wire
/

> `wire`/foo/bar/baz
/foo/bar/baz
```

---

## `++wite` {#wite}

Kernel action/error builder

This is used by the kernel in [`move`](#move)s. See the [`ball`](#ball) entry for further details.

#### Source {#source}

```hoon
++  wite
  |$  ::  note: a routed $task
      ::  gift: a reverse action
      ::
      ::    NB:  task: a forward action
      ::         sign: a sourced $gift
      ::
      [note gift]
  $%  ::  %hurl: action failed
      ::  %pass: advance
      ::  %slip: lateral
      ::  %give: retreat
      ::
      [%hurl =goof wite=$;($>(?(%pass %give) $))]
      [%pass =wire =note]
      [%slip =note]
      [%give =gift]
  ==
```

#### Examples {#examples}

```
> *(wite [vane=term task=maze] maze)
[%give gift=[%.y p=[#t/* q=0]]]
```

---

## `++en-beam` {#en-beam}

Encode a [`beam`](#beam) in a `path`

#### Accepts {#accepts}

A [`beam`](#beam)

#### Produces {#produces}

A `path`

#### Source {#source}

```hoon
++  en-beam
  |=(b=beam =*(s scot `path`[(s %p p.b) q.b (s r.b) s.b]))
```

#### Examples {#examples}

```
> (en-beam [~zod %base da+now] /foo/bar)
/~zod/base/~2023.1.9..10.35.30..f55a/foo/bar
```

---

## `++de-beam` {#de-beam}

Decode a [`beam`](#beam) from a `path`

#### Accepts {#accepts}

A `path`

#### Produces {#produces}

A `beam` in a `unit`, which is null if parsing failed.

#### Source {#source}

```hoon
++  de-beam
  ~/  %de-beam
  |=  p=path
  ^-  (unit beam)
  ?.  ?=([@ @ @ *] p)  ~
  ?~  who=(slaw %p i.p)  ~
  ?~  des=?~(i.t.p (some %$) (slaw %tas i.t.p))  ~  :: XX +sym ;~(pose low (easy %$))
  ?~  ved=(de-case i.t.t.p)  ~
  `[[`ship`u.who `desk`u.des u.ved] t.t.t.p]
```

#### Examples {#examples}

```
> (de-beam /~zod/base/~2023.1.9..10.35.30..f55a/foo/bar)
[~ [[p=~zod q=%base r=[%da p=~2023.1.9..10.35.30..f55a]] s=/foo/bar]]
```

---

## `++de-case` {#de-case}

Parse a [`case`](#case)

#### Accepts {#accepts}

A `knot`

#### Produces {#produces}

A [`case`](#case) in a `unit`, which is null if parsing failed.

#### Source {#source}

```hoon
++  de-case
  ~/  %de-case
  |=  =knot
  ^-  (unit case)
  ?^  num=(slaw %ud knot)  `[%ud u.num]
  ?^  wen=(slaw %da knot)  `[%da u.wen]
  ?~  lab=(slaw %tas knot)  ~
  `[%tas u.lab]
```

#### Example {#example}

```
> (de-case '2')
[~ [%ud p=2]]

> (de-case '~2023.1.9..10.31.15..58ea')
[~ [%da p=~2023.1.9..10.31.15..58ea]]

> (de-case 'foo')
[~ [%tas p=%foo]]

> (de-case '!!!')
~
```

---
