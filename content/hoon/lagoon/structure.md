---

## `+reshape` {#reshape}

Function: reshape

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  reshape
    |=  [a=ray shape=(list @)]
    ^-  ray
    ?>  (check a)
    =/  in-cnt  (reel shape.meta.a ^mul)
    =/  out-cnt  (reel shape ^mul)
    ?>  =(in-cnt out-cnt)
    =.  shape.meta.a  shape
    a
  ::  stack along dimension (0 row, 1 col, 2 lay, etc.)
```

---

## `+stack` {#stack}

stack along dimension (0 row, 1 col, 2 lay, etc.)

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  stack
    ~/  %stack
    |=  [a=ray b=ray dim=@ud]
    ^-  ray
    ?>  (check a)
    ?>  (check b)
    ::  check same dims overall
    ?>  =((lent shape.meta.a) (lent shape.meta.b))
    ::  check same dims other than target dim
    ?>  =/  idx  0
      |-  ^-  ?
      ?:  =(idx (lent shape.meta.a))  %.y
      ?:  =(dim idx)  $(idx +(idx))
      ?.  =((snag idx shape.meta.a) (snag idx shape.meta.b))
        %.n
      $(idx +(idx))
    ::  TODO revisit this assumption/requirement
    ?>  (^lte dim (lent shape.meta.a))
    =|  c=ray
    ?:  =(0 dim)
      =.  meta.c  meta.a
      =.  shape.meta.c
        :-  (^add (snag dim shape.meta.a) (snag dim shape.meta.b))
            +.shape.meta.a
      =.  data.c  (con (lsh [bloq.meta.a (roll shape.meta.a ^mul)] data.a) data:(unspac b))
      c
    ?:  =(1 dim)
      =.  meta.c  meta.a
      =.  shape.meta.c
        (snap shape.meta.c dim (^add (snag dim shape.meta.a) (snag dim shape.meta.b)))
      =/  c  (zeros meta.c)
      =/  idx  0
      |-  ^-  ray
      ?:  =((snag 0 (flop shape.meta.a)) idx)  c
      =/  off  (weld (snip (snip shape.meta.a)) ~[idx])
      =/  row-a  (get-row a off)
      =/  row-b  (get-row b off)
      =/  data-c  (con (lsh [bloq.meta.a (snag 1 shape.meta.row-a)] data.row-a) data:(unspac row-b))
      =/  meta-c=meta  meta.row-a
      =.  shape.meta-c  (snap shape.meta-c dim (^add (snag dim shape.meta.row-a) (snag dim shape.meta.row-b)))
      =/  row-c=ray  (spac [meta-c data-c])
      %=  $
        idx  +(idx)
        c    (set-row c off row-c)
      ==
    !!
  ::
```

---

## `+hstack` {#hstack}

Function: hstack

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  hstack
    |=  [a=ray b=ray]
    ^-  ray
    (stack a b 1)
  ::
```

---

## `+vstack` {#vstack}

Function: vstack

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  vstack
    |=  [a=ray b=ray]
    ^-  ray
    (stack a b 0)
  ::
  ::
```

---

## `+transpose` {#transpose}

Function: transpose

#### Accepts

A `ray`

#### Produces

A `ray`

#### Source

```hoon
++  transpose
    ~/  %transpose
    |=  a=ray  ^-  ray
    ?>  (check a)
    =,  meta.a
    ?>  =(2 (lent shape))
    =/  i  0
    =/  j  0
    =/  shape=(list @)  ~[(snag 1 shape) (snag 0 shape)]
    =/  prod=ray  (zeros [shape bloq kind ~])
    |-
      ?:  =(i (snag 0 shape.meta.a))
        prod
      %=  $
        i  +(i)
        prod
      |-
        ?:  =(j (snag 1 shape.meta.a))
          prod
        %=  $
          j  +(j)
          prod  (set-item prod ~[j i] (get-item a ~[i j]))
        ==
    ==
  ::  Returns diagonal of an array.
  ::
```

