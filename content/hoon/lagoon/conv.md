## `+lake` {#lake}

#### Accepts

Rounding mode, one of `?(%n %u %d %z)`.

#### Produces

Specialized version of `++la` core.

#### Source

```hoon
++  lake
  |=  [inrnd=rounding-mode]
  %*(. la rnd inrnd)
::
```

#### Discussion

Lagoon operators are accessed through the `++la` container core.  This is a door which supplies necessary mathematical details for the implementation (which may be ignored for certain types).

For instance, by default `++la` implements round-to-zero IEEE 754 behavior, much as the `++rs` etc. doors in vanilla Hoon.  This may be overridden using the `++lake` gate:

```
(lake %u)       :: resolve to round-upwards behavior
```

---

## `+print` {#print}

Pretty-print an array.

#### Accepts

A `$ray`.

#### Produces

A `$tank` `%slog` (as side effect) and `~`.

#### Source

```hoon
++  print  |=(a=ray ~>(%slog.1^(to-tank (ravel a) shape.meta.a kind.meta.a) ~))
```

---

## `+slog` {#slog}

Utility function to print an array.

#### Accepts

A `$ray`.

#### Produces

A `$tank` `%slog` (as side effect) and `~`.

#### Source

```hoon
++  slog   |=(a=ray (^slog (to-tank (ravel a) shape.meta.a kind.meta.a) ~))
```

---

## `+to-tank` {#totank}

Convert a `$ray` to a `$tank`.

#### Accepts

A list of data, a shape as a list of dimensions, and the scalar type as a `$kind`.

#### Produces

A `tank`.

#### Source

```hoon
++  to-tank
    |=  [dat=(list @) shape=(list @) =kind]
    ^-  tank
    ::  1D vector case
    ?:  =(1 (lent shape))
      :+  %rose  [" " "[" "]"]
      %+  turn  dat
      |=  i=@
      ^-  tank
      (sell [%atom kind ~] i)
    ::  general tensor case
    =/  width  (^div (lent dat) -.shape)
    :+  %rose  [" " "[" "]\0a"]
    ^-  (list tank)
    %+  turn  (gulf 0 (dec -.shape))
    |=  i=@
    (to-tank (swag [(^mul width i) width] dat) +.shape kind)
  ::
```

---

## `+get-term` {#getterm}

Utility function to get the term tag associated with a `$ray`'s metadata type.

#### Accepts

A `$meta` of the target shape and parameters.

#### Produces

A `%slog`-compatible tag as a `term`.

#### Source

```hoon
++  get-term
  |=  =meta
  ?-    kind.meta
      %uint
    %ud
    ::
      %int2
    !!
    ::
      %i754
    ?+    bloq.meta  ~|(bloq.meta !!)
      %7  %rq
      %6  %rd
      %5  %rs
      %4  %rh
    ==
  ==
```

---

## `+squeeze` {#squeeze}

Convert a noun into a typed list.

#### Accepts

See source for parameter details.

#### Produces

See source for return type details.

#### Source

```hoon
++  squeeze  |*(a=* `(list _a)`~[a])
```

---

## `+submatrix` {#submatrix}

Produce a submatrix from a `$ray` using [slice](README.md#slice) notation.

#### Accepts

A `$slice` and a `$ray`.

#### Produces

A `$ray`.

#### Source

```hoon
++  submatrix
  ::
  ::  +submatrix: grab a submatrix using numpy slice notation, except indices are inclusive.
  ::  If you aren't slicing the last few dimensions, you can omit them.
  ::
  ~/  %submatrix
  |=  [sli=(list slice) a=ray]
  ::
  ::  example: sli=~[`[`1 `3] `[`1 ~] ~] is equivalent to a[1:3,1:,:]
  ::
  ^-  ray
  ::
  ::  pad slice with sigs if necessary
  =?  sli  (^lth (lent sli) (lent shape.meta.a))
    (weld sli (reap (^sub (lent shape.meta.a) (lent sli)) *(unit [(unit @) (unit @)])))
  ::
  ::  calculate indices to grab using cartesian product
  =/  out-indices=(list (list (list @)))
  %+  turn
    (gulf 0 (dec (lent shape.meta.a)))
  |=  i=@
  =/  s  (snag i sli)
  =/  dim  (snag i shape.meta.a)
  ?~  s
    (turn (gulf 0 (dec dim)) squeeze)
  =/  s2=[(unit @) (unit @)]  (need s)
  =/  c=^  [(fall -.s2 ~) (fall +.s2 ~)]
  ^-  (list (list @))
  ?+    c  !!
      [j=@ k=~]  (turn (gulf j.c (dec dim)) squeeze)
      [j=@ k=@]  (turn (gulf j.c k.c) squeeze)
      [j=~ k=@]  (turn (gulf 0 k.c) squeeze)
      [~ ~]  (turn (gulf 0 (dec dim)) squeeze)
  ==
  ::
  ::  calculate the shape of the result
  =/  out-shape=(list @)
  %+  turn
    out-indices
  |=(inds=(list (list @)) (lent inds))
  ::
  ::  grab submatrix entries from cartesian product
  =/  new-dat=@ux
  %+  rep  bloq.meta.a
  %+  turn
    (gather out-indices)
  |=  dex=(list @)
  (get-item a dex)
  ::
  ::  construct new ray
  %-  spac
  =,  meta.a
  :-  [out-shape bloq kind ~]
  new-dat
```

---

## `+product` {#product}

Produce the cartesian product of two lists.

#### Accepts

A pair of lists.

#### Produces

The cartesian product as a list of pairs.

#### Source

```hoon
++  product  ::  cartesian product
  |*  [a=(list) b=(list)]
  ?~  a
    b
  %-  zing
  %+  turn  a
  |=  ai=_-.a
  (turn b |=(bi=_-.b (welp ai bi)))
```

---

## `+gather` {#gather}

Utility function to gather indices for submatrix extraction.

#### Accepts

A `(list (list (list @)))`.

#### Produces

A `(list (list @))`

#### Source

```hoon
++  gather
  |=  [a=(list (list (list @)))]
  ^-  (list (list @))
  =/  i  0
  =|  c=(list (list @))
  |-
  ?:  =(i (lent a))
    c
  $(i +(i), c `(list (list @))`(product c (snag i a)))
```

---

## `+get-item` {#getitem}

Get item at index from a `$ray`.

#### Accepts

A `$ray` and target index as a list of multi-dimensional indices.  Crashes if index is out of bounds.

#### Produces

A `@ux`.

#### Source

```hoon
++  get-item  ::  extract item at index .dex
  |=  [=ray dex=(list @)]
  ^-  @ux
  =/  len  (^sub (roll shape.meta.ray ^mul) 1)
  %^    cut
      bloq.meta.ray
    [(get-bloq-offset meta.ray dex) 1]
  data.ray
```

---

## `+set-item` {#setitem}

Set item at index in a `$ray`.

#### Accepts

A `$ray`, target index as a list of multi-dimensional indices, and the value to set.

#### Produces

A `$ray`.

#### Source

```hoon
++  set-item  ::  set item at index .dex to .val
  |=  [=ray dex=(list @) val=@]
  ^+  ray
  =/  len  (^sub (roll shape.meta.ray ^mul) 1)
  :-  meta.ray
  %^    sew
      bloq.meta.ray
    :: [(^sub len (get-bloq-offset meta.ray dex)) 1 val]
    [(get-bloq-offset meta.ray dex) 1 val]
  data.ray
```

---

## `+get-row` {#getrow}

Get row at index from a `$ray`.

#### Accepts

A `$ray` and target index as a single-entry list of multi-dimensional indices.

#### Produces

A `$ray` of dimension $$n-1$$.

#### Source

```hoon
++  get-row
  |=  [a=ray dex=(list @)]
  ^-  ray
  =,  meta.a
  ?:  =(1 (lent shape))
    (spac [~[1] bloq kind ~] (get-item a dex))
  ?>  =(+((lent dex)) (lent shape))
  =/  res
    %-  zeros
    :*  ~[1 (snag 0 (flop shape))]
        bloq
        kind
        ~
    ==
  =/  idx  0
  |-  ^-  ray
  ?:  =((snag 0 (flop shape.meta.res)) idx)  res
  =/  val  (get-item a (weld dex ~[idx]))
  $(idx +(idx), res (set-item res ~[0 idx] val))
```

---

## `+set-row` {#setrow}

Set row at index in a `$ray`.

#### Accepts

A `$ray`, target index as a list of multi-dimensional indices, and the row to set.

#### Produces

A `$ray`.

#### Source

```hoon
++  set-row
  |=  [a=ray dex=(list @) row=ray]
  ^-  ray
  ?:  &(=(1 (lent dex)) =(1 (lent shape.meta.row)))  (set-item a dex (get-item row ~[0]))
  ?>  =(+((lent dex)) (lent shape.meta.a))
  ?>  =((lent shape.meta.row) 2)
  ?>  =(1 (snag 0 shape.meta.row))
  ?>  =((snag 1 shape.meta.row) (snag 0 (flop shape.meta.a)))
  =/  idx  0
  |-  ^-  ray
  ?:  =((snag 1 shape.meta.row) idx)  a
  %=  $
    idx  +(idx)
    a    (set-item a (weld dex ~[idx]) (get-item row ~[0 idx]))
  ==
```

---

## `+get-col` {#getcol}

Get column at index from a `$ray`.

#### Accepts

A `$ray` and target index as a single-entry list of multi-dimensional indices.

#### Produces

A `$ray` of dimension $$n-1$$.

#### Source

```hoon
++  get-col
  |=  [a=ray dex=(list @)]
  ^-  ray
  (get-row (transpose a) dex)
```

---

## `+set-col` {#setcol}

Set column at index in a `$ray`.

#### Accepts

A `$ray`, target index as a list of multi-dimensional indices, and the column to set.

#### Produces

A `$ray`.

#### Source

```hoon
++  set-col
  |=  [a=ray dex=(list @) col=ray]
  ^-  ray
  (transpose (set-row (transpose a) dex col))
```

---

## `+get-bloq-offset` {#getbloqoffset}

Utility function to get the bloq offset of an n-dimensional index.

#### Accepts

A `$ray` and target index as a list of multi-dimensional indices.

#### Produces

A `$bloq` offset `@`.

#### Source

```hoon
++  get-bloq-offset  ::  get bloq offset of n-dimensional index
  |=  [=meta dex=(list @)]
  ^-  @
  (get-item-number shape.meta dex)
```

---

## `+get-item-number` {#getitemnumber}

Utility function to convert an n-dimensional index to a scalar index.

#### Accepts

A shape as a list of dimensions and a scalar index as a list of multi-dimensional indices.

#### Produces

A scalar index `@`.

#### Source

```hoon
++  get-item-number  ::  convert n-dimensional index to scalar index
  |=  [sap=(list @) dex=(list @)]
  ^-  @
  =/  cof  1
  =/  ret  0
  =.  sap  (flop sap)
  =.  dex  (flop dex)
  |-  ^+  ret
  ?~  sap  ret :: out of indices, return
  ?~  dex  !!  :: no indices past size
  ?>  (^lth i.dex i.sap)  :: index must be less than size
  %=  $
    sap  t.sap
    dex  t.dex
    cof  (^mul cof i.sap)
    ret  (^add ret (^mul i.dex cof))
  ==
```

---

## `+strides` {#strides}

Return the stride in each dimension:  row, col, layer, etc.

#### Accepts

A `$meta` of the target shape and parameters.

#### Produces

A `(list @)`.

#### Source

```hoon
++  strides
  |=  =meta
  ^-  (list @)
  =/  idx  0
  =|  res=(list @)
  |-  ^-  (list @)
  ?~  shape.meta  (flop res)
  =/  stride  (roll (scag idx `(list @)`shape.meta) ^mul)
  %=  $
    idx         +(idx)
    shape.meta  t.shape.meta
    res         [(^mul (pow 2 bloq.meta) stride) res]
  ==
```

#### Discussion

The stride is reported in units of bits.

---

## `+get-dim` {#getdim}

Utility function to convert a scalar index to an n-dimensional index.

#### Accepts

A shape as a list of dimensions and a scalar index.

#### Produces

The $$n$$-dimensional index as a `(list @)`.

#### Source

```hoon
++  get-dim  :: convert scalar index to n-dimensional index
  |=  [shape=(list @) ind=@]
  =/  shape  (flop shape)
  =/  i=@  0
  =|  res=(list @)
  ?>  (^lth ind (roll shape ^mul))
  |-  ^-  (list @)
  ?:  (^gte i (lent shape))  (flop res)
  %=    $
    res  `(list @)`(snoc res (^mod ind (snag i shape)))
    ind  (^div ind (snag i shape))
    i    (^add i 1)
  ==
```

---

## `+get-item-index` {#getitemindex}

Utility function to get the item index from a multi-dimensional index.

#### Accepts

A shape as a list of dimensions and a scalar index.

#### Produces

An index `@`.

#### Source

```hoon
++  get-item-index
  |=  [shape=(list @) num=@]
  ^-  @
  =/  len  (roll shape ^mul)
  =-  (roll - ^add)
  ^-  (list @)
  %+  turn  shape
  |=  wid=@
  (^mod (^div len wid) num)
```

---

## `+ravel` {#ravel}

Utility function to flatten a `$ray` into a list of atoms.

#### Accepts

A `$ray`.

#### Produces

A `(list @)`.

#### Source

```hoon
++  ravel
  |=  a=ray
  ^-  (list @)
  (snip (rip bloq.meta.a data.a))
```

---

## `+en-ray` {#enray}

Convert a `$baum` to a `$ray`.

#### Accepts

A `$baum` (or unwrapped `$ray`).

#### Produces

A `$ray`.

#### Source

```hoon
++  en-ray    :: baum to ray
  |=  =baum
  ^-  ray
  =/  a=ray  (zeros meta.baum)
  =/  i  0
  =/  n  (roll shape.meta.a ^mul)
  |-
  ?:  =(i n)  a
  %=  $
    i  +(i)
    data.a
      %+  con
        data.a
      %+  lsh
        [bloq.meta.a i]
      (get-item-baum baum (get-dim shape.meta.a i))
  ==
```

---

## `+de-ray` {#deray}

Utility function to convert a `$ray` to a `$baum`.

#### Accepts

A `$ray`.

#### Produces

A `$baum` (or unwrapped `$ray`).

#### Source

```hoon
++  de-ray    :: ray to baum
  |=  =ray
  ^-  baum
  |^
  :-  meta.ray
  ^-  ndray
  ::
  =,  meta.ray
  ?:  =(1 (lent shape))
    ::  Snip off tail which is the pinned 0x1 MSB
    (snip (rip bloq data.ray))
  ::
  ?:  =(2 (lent shape))
    =/  dims  (flop shape)
    =|  fin=(list ndray)
    =|  els=ndray
    |-
    ?:  =(0x1 data.ray)  (welp ;;((list ndray) fin) ~[;;((list ndray) els)])
    %=  $
      els   (snip (rip bloq (cut bloq [0 +((snag 0 dims))] data:(spac `^ray`[[~[(snag 0 dims) 1] bloq kind tail] `@ux`data.ray]))))
      fin   ?~  els  fin  :: skip on first row
            ?~  fin  `(list (list ndray))`~[;;((list ndray) els)]
            (welp ;;((list (list ndray)) fin) ~[;;((list ndray) els)])
      data.ray  (rsh [bloq (snag 0 dims)] data.ray)
    ==
  !!
```

---

## `+rip` {#rip}

Utility function to recursively rip a bite into a list of atoms.

#### Accepts

A target `$bite` and an atom to rip `.b`.

#### Produces

A `(list @)`.

#### Source

```hoon
++  rip
  |=  [a=bite b=@]
  ^-  (list @)
  =/  cnt  ?@(a 1 +.a)
  ?~  (^rip a b)  (reap cnt 0)
  (^rip a b)
--
```

---

## `+check` {#check}

Check if a `$ray` is valid according to its metadata.

#### Accepts

A `$ray`.

#### Produces

A `$flag`.

#### Source

```hoon
++  check
  |=  =ray
  ^-  ?
  .=  (roll shape.meta.ray ^mul)
  (dec (met bloq.meta.ray data.ray))
```

---

## `+get-item-baum` {#getitembaum}

Utility function to get an item from a `$baum` at a multi-dimensional index.

#### Accepts

Parameters as specified in source.

#### Produces

An item as raw `@`.

#### Source

```hoon
++  get-item-baum
  |=  [=baum dex=(list @)]
  ^-  @
  =/  a=ndray  data.baum
  |-
  ?~  a  !!
  ?@  (snag -.dex ;;((list ndray) a))
    ;;(@ (snag -.dex ((list ndray) a)))
  %=  $
    dex  +.dex
    a    (snag -.dex ;;((list ndray) a))
  ==
```

---

## `+fill` {#fill}

Fill a `$ray` with a scalar value.

#### Accepts

A target `$meta` and a value to fill the array with.

#### Produces

A `$ray`.

#### Source

```hoon
++  fill
  |=  [=meta x=@]
  ^-  ray
  =/  len  (roll shape.meta ^mul)
  :-  meta
  (con +:(zeros meta) (fil bloq.meta len x))
```

---

## `+spac` {#spac}

Utility function to add a pinned `0x1` MSB to an in-flight `$ray`'s data to preserve leading zeros.  For internal library use only.

#### Accepts

A `$ray`.

#### Produces

A `$ray`.

#### Source

```hoon
++  spac
  |=  =ray
  ^-  ^ray
  :-  meta.ray
  (con data:(zeros meta.ray) data.ray)
```

---

## `+unspac` {#unspac}

Utility function to remove the pinned `0x1` MSB from an in-flight `$ray`'s data.  For internal library use only.

#### Accepts

A `$ray`.

#### Produces

An in-flight `$ray`.

#### Source

```hoon
++  unspac
  |=  =ray
  ^-  ^ray
  :-  meta.ray
  (cut bloq.meta.ray [0 (roll shape.meta.ray ^mul)] data.ray)
```

---

## `+scalar-to-ray` {#scalartoray}

Convert a scalar value to an $n$-dimensional `$ray`.

#### Accepts

A `$meta` of the target shape and parameters, and the single value as an atom `.data`.

#### Produces

A `$ray`.

#### Source

```hoon
++  scalar-to-ray
  |=  [=meta data=@]
  ^-  ray
  =.  shape.meta  (reap (lent shape.meta) 1)
  %-  spac
  [meta data]
```

---

## `+change` {#change}

Utility function to change the type of a `$ray`'s metadata.

#### Accepts

Parameters as specified in source

#### Produces

A `$ray`.

#### Source

```hoon
++  change
  |=  [=ray =kind =bloq]
  ^-  ^ray
  ?+    kind.meta.ray  !!
      %uint
    ?+    kind  !!
        :: %uint -> %uint
        %uint
      %-  en-ray
      :-  [shape.meta.ray bloq %uint tail.meta.ray]
      data:(de-ray ray)
        :: %uint -> %i754
        %i754
      %-  en-ray
      :-  [shape.meta.ray bloq %i754 tail.meta.ray]
      %+  turn  (ravel ray)
      ?+  bloq  !!
        %7  ~(sun rq rnd)
        %6  ~(sun rd rnd)
        %5  ~(sun rs rnd)
        %4  ~(sun rh rnd)
      ==
    ==
    ::
      %i754
    ?+    kind  !!
        :: %i754 -> %uint
        :: XXX will incorrectly convert negative values to %uint
        %uint
      %-  en-ray
      :-  [shape.meta.ray bloq %uint tail.meta.ray]
      %+  turn  (ravel ray)
      ?+  bloq.meta.ray  !!
        %7  |=(a=@rq ^-(@u (^div (need (~(toi rq rnd) a)) 2)))
        %6  |=(a=@rd ^-(@u (^div (need (~(toi rd rnd) a)) 2)))
        %5  |=(a=@rs ^-(@u (^div (need (~(toi rs rnd) a)) 2)))
        %4  |=(a=@rh ^-(@u (^div (need (~(toi rh rnd) a)) 2)))
      ==
        :: %i754 -> %i754
        %i754
      ?>  &((^gte bloq %4) (^lte bloq %7))
      %-  en-ray
      :-  [shape.meta.ray bloq %i754 tail.meta.ray]
      data:(de-ray ray)
    ==
  ==
```
