# Mips (Maps of Maps) {#mips-maps-of-maps}

A `mip` is a map of maps. These can be constructed manually by nesting ordinary `map`s, but the `%landscape` desk contains a `/lib/mip.hoon` library which makes these a bit easier to deal with. You can copy the library into your own project. The various `mip` functions are documented below.

## `++mip` {#mip}

Mip (map of maps) mold builder

A `mip` is a map of maps. An outer `map` maps keys to inner `map`s, which themselves map keys to values.

A `(mip kex key value)` is equivalent to `(map kex (map key value))`.

#### Accepts {#accepts}

`kex` is a `mold`, the type of the outer map's key.

`key` is a `mold`, the type of the key of the inner maps.

`value` is a `mold`, the type of the value of the inner maps.

#### Produces {#produces}

A `mold`.

#### Source {#source}

```hoon
|%
++  mip                                                 ::  map of maps
  |$  [kex key value]
  (map kex (map key value))
```

#### Examples {#examples}

```
> =libmip -build-file /=landscape=/lib/mip/hoon

> *(mip:libmip @ @ @)
{}

> (~(put bi:libmip *(mip:libmip @ @ @)) 1 2 3) 
[n=[p=1 q=[n=[p=2 q=3] l=~ r=~]] l=~ r=~]
```

---

## `++bi` {#bi}

Mip engine

This is the container door for all the mip functions.

#### Accepts {#accepts}

`a` is a [`mip`](#mip).

#### Source {#source}

```hoon
++  bi                                                  ::  mip engine
  =|  a=(map * (map))
  |@
```

#### Examples {#examples}

```
> =libmip -build-file /=landscape=/lib/mip/hoon

> ~(. bi:libmip *(mip:libmip @ @ @))
< 8.bql
  [ a=nlr([p=@ q=nlr([p=@ q=@])])
    <2.gtk 17.zfg 35.yza 14.oai 54.ecl 77.swa 232.sje 51.qbt 123.ppa 46.hgz 1.pnw %140>
  ]
>
```

---

### `++del:bi` {#delbi}

Delete item in `mip`

This takes two keys as its argument, `b` and `c`, and deletes `c` in the inner map that matches key `b` in the outer map . If this results in an empty inner map, then `b` is also deleted from the outer map.

#### Accepts {#accepts}

`a` is a [`mip`](#mip), and is the [`+bi`](#bi) door's sample.

`b` is a key matching the key type of the outer map.

`c` is a key matching the key type of the inner maps.

#### Produces {#produces}

A [`mip`](#mip) with `c` deleted from `b`, or `b` deleted from `a` if `c` ended up empty.

#### Source {#source}

```hoon
++  del
  |*  [b=* c=*]
  =+  d=(~(gut by a) b ~)
  =+  e=(~(del by d) c)
  ?~  e
    (~(del by a) b)
  (~(put by a) b e)
```

#### Examples {#examples}

```
> =libmip -build-file /=landscape=/lib/mip/hoon

> =mymip (~(put bi:libmip *(mip:libmip @ @ @)) 1 2 3)
> =mymip (~(put bi:libmip mymip) 1 3 4)

> mymip
[n=[p=1 q=[n=[p=2 q=3] l=~ r=[n=[p=3 q=4] l=~ r=~]]] l=~ r=~]

> =mymip (~(del bi:libmip mymip) 1 2)

> mymip
[n=[p=1 q=[n=[p=3 q=4] l=~ r=~]] l=~ r=~]

> =mymip (~(del bi:libmip mymip) 1 3)

> mymip
~
```

---

### `++get:bi` {#getbi}

Maybe get value in `mip`

Get the value of `c` in the map with key `b` in `mip` `a` as a unit. If there's no `c` in `b` or `b` in `a`, the unit is null.

#### Accepts {#accepts}

`a` is a [`mip`](#mip), and is the sample of the [`++bi`](#bi) door.

`b` is a key matching the key type of the outer map.

`c` is a key matching the key type of the inner maps.

#### Produces {#produces}

A `(unit [type])`, where `[type]` is the value type. The unit is null if there's no `c` in `b` or no `b` in `a`.

#### Source {#source}

```hoon
++  get
  |*  [b=* c=*]
  =>  .(b `_?>(?=(^ a) p.n.a)`b, c `_?>(?=(^ a) ?>(?=(^ q.n.a) p.n.q.n.a))`c)
  ^-  (unit _?>(?=(^ a) ?>(?=(^ q.n.a) q.n.q.n.a)))
  (~(get by (~(gut by a) b ~)) c)
```

#### Examples {#examples}

```
> =libmip -build-file /=landscape=/lib/mip/hoon

> =mymip (~(put bi:libmip *(mip:libmip @ @ @)) 1 2 3)

> (~(get bi:libmip mymip) 1 2)
[~ 3]

> (~(get bi:libmip mymip) 2 3)
~
```

---

#### `++got:bi` {#gotbi}

Get value in `mip` or crash

Get the value of `c` in the map with key `b` in `mip` `a`. If there's no `c` in `b` or `b` in `a`, crash.

#### Accepts {#accepts}

`a` is a [`mip`](#mip), and is the sample of the [`++bi`](#bi) door.

`b` is a key matching the key type of the outer map.

`c` is a key matching the key type of the inner maps.

#### Produces {#produces}

A noun of the type of the values in the `mip`, or else crashes.

#### Source {#source}

```hoon
++  got
  |*  [b=* c=*]
  (need (get b c))
```

#### Examples {#examples}

```
> =libmip -build-file /=landscape=/lib/mip/hoon

> =mymip (~(put bi:libmip *(mip:libmip @ @ @)) 1 2 3)

> (~(got bi:libmip mymip) 1 2)
3

> (~(got bi:libmip mymip) 2 3)
/lib/mip/hoon:<[25 5].[25 21]>
dojo: hoon expression failed
```

---

### `++gut:bi` {#gutbi}

Get value in `mip` or default

Get the value of `c` in the map with key `b` in `mip` `a`. If there's no `c` in `b` or `b` in `a`, produce default value `d`.

#### Accepts {#accepts}

`a` is a [`mip`](#mip), and is the sample of the [`++bi`](#bi) door.

`b` is a key matching the key type of the outer map.

`c` is a key matching the key type of the inner maps.

`d` is a default value, which is produced if the value cannot be found.

#### Produces {#produces}

A noun, either the type of the value in the map or `d`.

#### Source {#source}

```hoon
++  gut
  |*  [b=* c=* d=*]
  (~(gut by (~(gut by a) b ~)) c d)
```

#### Examples {#examples}

```
> =libmip -build-file /=landscape=/lib/mip/hoon

> =mymip (~(put bi:libmip *(mip:libmip @ @ @)) 1 2 3)

> (~(gut bi:libmip mymip) 1 2 42)
3

> (~(gut bi:libmip mymip) 2 3 42)
42
```

---

### `++has:bi` {#hasbi}

Check if `mip` contains

Check if `mip` `a` contains `c` in `b`.

#### Accepts {#accepts}

`a` is a [`mip`](#mip), and is the sample of the [`++bi`](#bi) door.

`b` is a key matching the key type of the outer map.

`c` is a key matching the key type of the inner maps.

#### Produces {#produces}

A `?` which is true if `c` in `b` exists, and false otherwise.

#### Source {#source}

```hoon
++  has
  |*  [b=* c=*]
  !=(~ (get b c))
```

#### Examples {#examples}

```
> =libmip -build-file /=landscape=/lib/mip/hoon

> =mymip (~(put bi:libmip *(mip:libmip @ @ @)) 1 2 3)

> (~(has bi:libmip mymip) 1 2)
%.y

> (~(has bi:libmip mymip) 2 3)
%.n
```

---

### `++key:bi` {#keybi}

Get keys of inner map in `mip`

Get the `set` of keys of the inner map matching key `b` in the outer map. If `b` doesn't exist, an empty set is returned.

#### Accepts {#accepts}

`a` is a [`mip`](#mip), and is the sample of the [`++bi`](#bi) door.

`b` is a key matching the key type of the outer map.

#### Produces {#produces}

A `(set [type])` where `[type]` is the type of the keys in the inner map.

#### Source {#source}

```hoon
++  key
  |*  b=*
  ~(key by (~(gut by a) b ~))
```

#### Examples {#examples}

```
> =libmip -build-file /=landscape=/lib/mip/hoon

> =mymip (~(put bi:libmip *(mip:libmip @ @ @)) 1 2 3)

> (~(key bi:libmip mymip) 1)
{2}

> (~(key bi:libmip mymip) 2)
{}
```

---

### `++put:bi` {#putbi}

Insert value in `mip`

Add value `d` with key `c` to the inner map with key `b` in the outer map. If `b` doesn't exist, an inner map is also added with that key. If `c` already exists, its value is replaced with `d`.

#### Accepts {#accepts}

`a` is a [`mip`](#mip), and is the sample of the [`++bi`](#bi) door.

`b` is a key matching the key type of the outer map.

`c` is a key matching the key type of the inner maps.

`d` is a noun matching the type of the values in the `mip`.

#### Produces {#produces}

A new, modified `mip`.

#### Source {#source}

```hoon
++  put
  |*  [b=* c=* d=*]
  %+  ~(put by a)  b
  %.  [c d]
  %~  put  by
  (~(gut by a) b ~)
```

#### Examples {#examples}

```
> =libmip -build-file /=landscape=/lib/mip/hoon

> =mymip (~(put bi:libmip *(mip:libmip @ @ @)) 1 2 3)
> =mymip (~(put bi:libmip mymip) 1 1 42)
> =mymip (~(put bi:libmip mymip) 2 12 99)

> ~(tap bi:libmip mymip)
~[[x=2 y=12 v=99] [x=1 y=2 v=3] [x=1 y=1 v=42]]
```

---

### `++tap:bi` {#tapbi}

Convert `mip` to `list`

The `mip` is flattened to a `list` of the triple `[x y v]`, where `x` is a key in the outer map, `y` is a key in an inner map, and `v` is its value.

#### Accepts {#accepts}

`a` is a [`mip`](#mip), and is the sample of the [`++bi`](#bi) door.

#### Produces {#produces}

A triple cell of `[x y v]`, where:

- `x` is a key in the outer map.
- `y` is a key in an inner map.
- `v` is its value.

#### Source {#source}

```hoon
++  tap
  ::NOTE  naive turn-based implementation find-errors ):
  =<  $
  =+  b=`_?>(?=(^ a) *(list [x=_p.n.a _?>(?=(^ q.n.a) [y=p v=q]:n.q.n.a)]))`~
  |.  ^+  b
  ?~  a
    b
  $(a r.a, b (welp (turn ~(tap by q.n.a) (lead p.n.a)) $(a l.a)))
--
```

#### Examples {#examples}

```
> =libmip -build-file /=landscape=/lib/mip/hoon

> =mymip (~(put bi:libmip *(mip:libmip @ @ @)) 1 2 3)
> =mymip (~(put bi:libmip mymip) 1 1 42)
> =mymip (~(put bi:libmip mymip) 2 12 99)

> ~(tap bi:libmip mymip)
~[[x=2 y=12 v=99] [x=1 y=2 v=3] [x=1 y=1 v=42]]
```

--- 
