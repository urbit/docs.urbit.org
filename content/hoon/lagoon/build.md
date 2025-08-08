## `+eye` {#eye}

Identity matrix of shape nxn.

#### Accepts

A `$meta`.

#### Produces

A `$ray`.

#### Source

```hoon
++  eye      ::  produces identity matrix of shape nxn.
  |=  =meta
  ^-  ray
  ~_  leaf+"lagoon-fail"
  ?>  =(2 (lent shape.meta))
  ?>  =((snag 0 shape.meta) (snag 1 shape.meta))
  =/  n  (snag 0 shape.meta)
  =<  +
  %^    spin
      (gulf 0 (dec n))
    ^-  ray  (zeros [~[n n] bloq.meta kind.meta ~])
  |=  [i=@ r=ray]
  :: [i (set-item r ~[i i] 1)]
  :-  i
  %^  set-item
      r
    ~[i i]
  ^-  @
  ?-    kind.meta
      %uint  `@`1
    ::
      %int2  !!
    ::
      %i754
    ?+  bloq.meta  ~|(bloq.meta !!)
      %7  .~~~1
      %6  .~1
      %5  .1
      %4  .~~1
    ==
  ==
```

---

## `+zeros` {#zeros}

An array containing only zeros as values.

#### Accepts

A `$meta` of the target shape and parameters.

#### Produces

A `$ray`.

#### Source

```hoon
++  zeros
  |=  =meta  ^-  ray
  ~_  leaf+"lagoon-fail"
  :-  meta
  (lsh [bloq.meta (roll shape.meta ^mul)] 1)
```

---

## `+ones` {#ones}

An array containing only ones as values.

#### Accepts

A `$meta` of the target shape and parameters.

#### Produces

A `$ray`.

#### Source

```hoon
++  ones
  |=  =meta  ^-  ray
  ~_  leaf+"lagoon-fail"
  =/  one
    ?-    kind.meta
        %uint  `@`1
      ::
        %int2  !!
      ::
        %i754
      ?+  bloq.meta  !!
        %7  .~~~1
        %6  .~1
        %5  .1
        %4  .~~1
      ==
    ==
  (fill meta one)
```

---

## `+iota` {#iota}

Produce a 1-dimensional index array. Only produces `%uint`. Note that this runs from 0 to $$n-1$$.  (The point of `+iota` is to be an index, so it needs to pattern-match the context rather than slavishly follow APL.)

#### Accepts

A `$meta` of the target shape and parameters.

#### Produces

A `$ray`.

#### Source

```hoon
++  iota
  |=  =meta
  ^-  ray
  ?>  =((lent shape.meta) 1)
  =/  n  (snag 0 shape.meta)
  =.  kind.meta  %uint
  (en-ray meta (gulf 0 (dec n)))
```

#### Discussion

The target shape is determined from the length of `.shape` in `.meta`.

---

## `+magic` {#magic}

Produce a magic square in $$n$$ dimensions.

#### Accepts

A `$meta` of the target shape and parameters.

#### Produces

A `$ray`.

#### Source

```hoon
++  magic
  |=  =meta
  ^-  ray
  =/  n  (roll shape.meta ^mul)
  %+  reshape
    (en-ray [~[n] bloq.meta %uint ~] (gulf 0 (dec n)))
  shape.meta
```

---

## `+range` {#range}

Produce a 1-dimensional range along one dimension as $$[a, b)$$ with interval $$d$$. Only produces `%i754`.

#### Accepts

A `$meta` of the target shape and parameters.

#### Produces

A `$ray`.

#### Source

```hoon
++  range
  ~/  %range
  |=  [=meta [a=@ b=@] d=@]
  ^-  ray
  =.  kind.meta  %i754
  %-  spac
  %-  en-ray
  ::
  ?+    bloq.meta  !!
      %7
    =/  ba  (~(sub rq rnd) b a)
    =/  bad  `(list @)`~[a]
    |-  ^-  baum
    ?:  (?:((~(lth rq rnd) ba .~~~0) ~(lte rq rnd) ~(gte rq rnd)) (~(add rq rnd) (snag 0 bad) d) b)
      =.  shape.meta  ~[(lent bad)]
      [meta (flop bad)]
    $(bad [(~(add rq rnd) (snag 0 bad) d) bad])
    ::
      %6
    =/  ba  (~(sub rd rnd) b a)
    =/  bad  `(list @)`~[a]
    |-  ^-  baum
    ?:  (?:((~(lth rd rnd) ba .~0) ~(lte rd rnd) ~(gte rd rnd)) (~(add rd rnd) (snag 0 bad) d) b)
      =.  shape.meta  ~[(lent bad)]
      [meta (flop bad)]
    $(bad [(~(add rd rnd) (snag 0 bad) d) bad])
    ::
      %5
    =/  ba  (~(sub rs rnd) b a)
    =/  bad  `(list @)`~[a]
    |-  ^-  baum
    ?:  (?:((~(lth rs rnd) ba .0) ~(lte rs rnd) ~(gte rs rnd)) (~(add rs rnd) (snag 0 bad) d) b)
      =.  shape.meta  ~[(lent bad)]
      [meta (flop bad)]
    $(bad [(~(add rs rnd) (snag 0 bad) d) bad])
    ::
      %4
    =/  ba  (~(sub rh rnd) b a)
    =/  bad  `(list @)`~[a]
    |-  ^-  baum
    ?:  (?:((~(lth rh rnd) ba .~~0) ~(lte rh rnd) ~(gte rh rnd)) (~(add rh rnd) (snag 0 bad) d) b)
      [meta (flop bad)]
    $(bad [(~(add rh rnd) (snag 0 bad) d) bad])
  ==
```

---

## `+linspace` {#linspace}

Produce a 1-dimensional range along one dimension as $$[a, b]$$ with number of steps $$n$$. Only produces `%i754`.

#### Accepts

A `$meta` of the target shape and parameters, a pair of left-hand and right-hand bounds, and a number of intervals.

#### Produces

A `$ray`.

#### Source

```hoon
++  linspace
  ~/  %linspace
  |=  [=meta [a=@ b=@] n=@ud]
  ^-  ray
  =.  shape.meta  ~[n]
  =.  kind.meta  %i754
  ?<  =(n 0)
  ?:  =(n 1)  (en-ray meta ~[a])
  %-  en-ray
  :-  meta
  ::
  ?+    bloq.meta  !!
      %7
    =/  ba  (~(sub rq rnd) b a)
    =/  d  (~(div rq rnd) ba (~(sun rq rnd) (dec n)))
    =|  bad=(list @)
    =|  i=@ud
    |-  ^-  ndray
    ?:  (^lte n +(i))  (flop [b bad])
    $(i +(i), bad [(~(add rq rnd) a (~(mul rq rnd) (~(sun rq rnd) i) d)) bad])
    ::
      %6
    =/  ba  (~(sub rd rnd) b a)
    =/  d  (~(div rd rnd) ba (~(sun rd rnd) (dec n)))
    =|  bad=(list @)
    =|  i=@ud
    |-  ^-  ndray
    ?:  (^lte n +(i))  (flop [b bad])
    $(i +(i), bad [(~(add rd rnd) a (~(mul rd rnd) (~(sun rd rnd) i) d)) bad])
    ::
      %5
    =/  ba  (~(sub rs rnd) b a)
    =/  d  (~(div rs rnd) ba (~(sun rs rnd) (dec n)))
    =|  bad=(list @)
    =|  i=@ud
    |-  ^-  ndray
    ?:  (^lte n +(i))  (flop [b bad])
    $(i +(i), bad [(~(add rs rnd) a (~(mul rs rnd) (~(sun rs rnd) i) d)) bad])
    ::
      %4
    =/  ba  (~(sub rh rnd) b a)
    =/  d  (~(div rh rnd) ba (~(sun rh rnd) (dec n)))
    =|  bad=(list @)
    =|  i=@ud
    |-  ^-  ndray
    ?:  (^lte n +(i))  (flop [b bad])
    $(i +(i), bad [(~(add rh rnd) a (~(mul rh rnd) (~(sun rh rnd) i) d)) bad])
  ==
```

#### Discussion

The number of intervals `n` overrides any size specified in the input `$meta`.

---

## `+urge` {#urge}

Coerce 1D array along specified dimension with given overall dimensionality.

#### Accepts

A `$ray`, a target dimension index `.i`, and a resulting overall dimensionality `.n`.

#### Produces

A `$ray`.

#### Source

```hoon
++  urge
  |=  [=ray [i=@ud n=@ud]]
  ^-  ^ray
  ?>  =(1 (lent shape.meta.ray))
  =.  shape.meta.ray  `(list @)`(zing (reap n ~[1]))
  =.  shape.meta.ray  (snap shape.meta.ray i n)
  |-
  ray
```

---

## `+scale` {#scale}

Produce an $$n$$-dimensional array containing a single value.

#### Accepts

A `$meta` of the target shape and parameters, and the single value as an atom.

#### Produces

A `$ray`.

#### Source

```hoon
++  scale
  |=  [=meta data=@]
  ^-  ray
  =.  shape.meta  `(list @)`(zing (reap (lent shape.meta) ~[1]))
  ?-    kind.meta
      %uint
    (spac [meta `@ux`data])
    ::
      %int2
    (spac [meta `@ux`data])
    ::
      %i754
    ::  convert date to fl to @r XXX TODO REVISIT whether we want to specify input type
    =/  fin
      ?+    bloq.meta  !!
        %7  (bit:ma:rq (sea:ma:rq data))
        %6  (bit:ma:rd (sea:ma:rd data))
        %5  (bit:ma:rs (sea:ma:rs data))
        %4  (bit:ma:rh (sea:ma:rh data))
      ==
    (spac [meta `@ux`fin])
  ==
```
