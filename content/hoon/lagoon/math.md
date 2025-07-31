## `+max` {#max}

Operators

#### Accepts

A `ray`

#### Produces

See source for return type details.

#### Source

```hoon
++  max
    ~/  %max
    |=  a=ray
    ?>  (check a)
    =/  fun
      |:  [b=1 c=-:(ravel a)]
      ?.  =(((fun-scalar meta.a %gth) b c) 0)
        b  c
    (scalar-to-ray meta.a (reel (ravel a) fun))
  ::
```

---

## `+argmax` {#argmax}

Function: argmax

#### Accepts

A `ray`

#### Produces

A `@ud`

#### Source

```hoon
++  argmax :: Only returns first match
    ~/  %argmax
    |=  a=ray
    ^-  @ud
    ?>  (check a)
    +:(find ~[(get-item (max a) ~[0 0])] (ravel a))
  ::
```

---

## `+min` {#min}

Function: min

#### Accepts

A `ray`

#### Produces

See source for return type details.

#### Source

```hoon
++  min
    ~/  %min
    |=  a=ray
    ?>  (check a)
    =/  fun
      |:  [b=1 c=-:(ravel a)]
      ?.  =(((fun-scalar meta.a %lth) b c) 0)
        b  c
    (scalar-to-ray meta.a (reel (ravel a) fun))
  ::
```

---

## `+argmin` {#argmin}

Function: argmin

#### Accepts

A `ray`

#### Produces

A `@ud`

#### Source

```hoon
++  argmin :: Only returns first match
    ~/  %argmin
    |=  a=ray
    ^-  @ud
    ?>  (check a)
    +:(find ~[(get-item (min a) ~[0 0])] (ravel a))
  ::
```

---

## `+cumsum` {#cumsum}

Function: cumsum

#### Accepts

A `ray`

#### Produces

A `ray`

#### Source

```hoon
++  cumsum
    ~/  %cumsum
    |=  a=ray
    ^-  ray
    ?>  (check a)
    %+  scalar-to-ray  meta.a
    (reel (ravel a) |=([b=@ c=@] ((fun-scalar meta.a %add) b c)))
  ::
```

---

## `+prod` {#prod}

Function: prod

#### Accepts

A `ray`

#### Produces

A `ray`

#### Source

```hoon
++  prod
    |=  a=ray
    ^-  ray
    ?>  (check a)
    %+  scalar-to-ray  meta.a
    (reel (ravel a) |=([b=_1 c=_1] ((fun-scalar meta.a %mul) b c)))
  ::
```

---

## `+diag` {#diag}

Returns diagonal of an array.

#### Accepts

A `ray`

#### Produces

A `ray`

#### Source

```hoon
++  diag
    ~/  %diag
    |=  a=ray
    ^-  ray
    ?>  (check a)
    =,  meta.a
    ?>  =(2 (lent shape))
    ?>  =(-.shape +<.shape)
    ^-  ray
    %-  en-ray
    ^-  baum
    :-  `meta`[~[-.shape 1] bloq kind tail]
    ^-  ndray
    %+  turn
      `(list @)`(flop (gulf 0 (dec -.shape)))
    |=(i=@ (get-item a ~[i i]))
  ::
```

---

## `+trace` {#trace}

Function: trace

#### Accepts

A `ray`

#### Produces

A `ray`

#### Source

```hoon
++  trace
    ~/  %trace
    |=  a=ray
    ^-  ray
    (cumsum (diag a))
  ::
```

---

## `+dot` {#dot}

Function: dot

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  dot
    ~/  %dot
    |=  [a=ray b=ray]
    ^-  ray
    ?>  =(shape.meta.a shape.meta.b)
    (cumsum (mul a b))
  ::
```

---

## `+mmul` {#mmul}

Function: mmul

#### Accepts

Parameters as specified in source

#### Produces

See source for return type details.

#### Source

```hoon
++  mmul
    ~/  %mmul
    |=  [a=ray b=ray]
    ?>  (check a)
    ?>  (check b)
    =/  i  0
    =/  j  0
    =/  k  0
    =/  shape=(list @)  ~[(snag 0 shape.meta.a) (snag 1 shape.meta.b)]
    =/  prod=ray  =,(meta.a (zeros [^shape bloq kind ~]))
    ::
    ::  multiplication conditions
    ?>
    ?&  =(2 (lent shape.meta.b))
        =(2 (lent shape.meta.a))
        =((snag 1 shape.meta.a) (snag 0 shape.meta.b))
    ==
    |-
      ?:   =(i (snag 0 shape.meta.prod))
        prod
      %=    $
        i  +(i)
        prod
      |-
        ?:  =(j (snag 1 shape.meta.prod))
          prod
        =/  cume  0
        %=    $
            j  +(j)
            prod
          |-
          ?:   =(k (snag 1 shape.meta.a))
            (set-item prod `(list @)`~[i j] cume)
          %=    $
              k  +(k)
              cume
            %+  (fun-scalar meta.a %add)
              cume
            %+  (fun-scalar meta.a %mul)
              (get-item a ~[i k])
            (get-item b ~[k j])
          ==
        ==
      ==
::
```

---

## `+abs` {#abs}

Function: abs

#### Accepts

A `ray`

#### Produces

A `ray`

#### Source

```hoon
++  abs
    ~/  %abs
    |=  a=ray
    ^-  ray
    (el-wise-op a (trans-scalar bloq.meta.a kind.meta.a %abs))
::
```

---

## `+add-scalar` {#addscalar}

Function: add scalar

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  add-scalar
    ~/  %add-scal
    |=  [a=ray n=@]
    ^-  ray
    =/  b=ray  (fill meta.a n)
    (add a b)
  ::
```

---

## `+sub-scalar` {#subscalar}

Function: sub scalar

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  sub-scalar
    ~/  %sub-scal
    |=  [a=ray n=@]
    ^-  ray
    =/  b=ray  (fill meta.a n)
    (sub a b)
  ::
```

---

## `+mul-scalar` {#mulscalar}

Function: mul scalar

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  mul-scalar
    ~/  %mul-scal
    |=  [a=ray n=@]
    ^-  ray
    =/  b=ray  (fill meta.a n)
    (mul a b)
  ::
```

---

## `+div-scalar` {#divscalar}

Function: div scalar

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  div-scalar
    ~/  %div-scal
    |=  [a=ray n=@]
    ^-  ray
    =/  b=ray  (fill meta.a n)
    (div a b)
  ::
```

---

## `+mod-scalar` {#modscalar}

Function: mod scalar

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  mod-scalar
    ~/  %mod-scal
    |=  [a=ray n=@]
    ^-  ray
    =/  b=ray  (fill meta.a n)
    (mod a b)
  ::
```

---

## `+add` {#add}

Function: add

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  add
    ~/  %add-rays
    |=  [a=ray b=ray]
    ^-  ray
    (bin-op a b (fun-scalar meta.a %add))
  ::
```

---

## `+sub` {#sub}

Function: sub

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  sub
    ~/  %sub-rays
    |=  [a=ray b=ray]
    ^-  ray
    (bin-op a b (fun-scalar meta.a %sub))
  ::
```

---

## `+mul` {#mul}

Function: mul

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  mul
    ~/  %mul-rays
    |=  [a=ray b=ray]
    ^-  ray
    (bin-op a b (fun-scalar meta.a %mul))
  ::
```

---

## `+div` {#div}

Function: div

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  div
    ~/  %div-rays
    |=  [a=ray b=ray]
    ^-  ray
    (bin-op a b (fun-scalar meta.a %div))
  ::
```

---

## `+mod` {#mod}

Function: mod

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  mod
    ~/  %mod-rays
    |=  [a=ray b=ray]
    ^-  ray
    (bin-op a b (fun-scalar meta.a %mod))
  ::
```

---

## `+pow-n` {#pown}

Function: pow n

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  pow-n
    |=  [a=ray n=@ud]
    ^-  ray
    ?>  (check a)
    ?~  =(0 n)  (ones meta.a)
    =/  b=ray   a
    |-  ^-  ray
    ?~  =(1 n)  b
    $(b (mul a b), n (dec n))
  ::
```

---

## `+gth` {#gth}

Function: gth

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  gth
    ~/  %gth
    |=  [a=ray b=ray]
    ^-  ray
    (bin-op a b (fun-scalar meta.a %gth))
  ::
```

---

## `+gte` {#gte}

Function: gte

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  gte
    ~/  %gte
    |=  [a=ray b=ray]
    ^-  ray
    (bin-op a b (fun-scalar meta.a %gte))
  ::
```

---

## `+lth` {#lth}

Function: lth

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  lth
    ~/  %lth
    |=  [a=ray b=ray]
    ^-  ray
    (bin-op a b (fun-scalar meta.a %lth))
  ::
```

---

## `+lte` {#lte}

Function: lte

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  lte
    ~/  %lte
    |=  [a=ray b=ray]
    ^-  ray
    (bin-op a b (fun-scalar meta.a %lte))
  ::
```

---

## `+equ` {#equ}

Function: equ

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  equ
    :: ~/  %equ
    |=  [a=ray b=ray]
    ^-  ray
    (bin-op a b (fun-scalar meta.a %equ))
  ::
```

---

## `+neq` {#neq}

Function: neq

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  neq
    :: ~/  %equ
    |=  [a=ray b=ray]
    ^-  ray
    (bin-op a b (fun-scalar meta.a %neq))
  ::
```

---

## `+mpow-n` {#mpown}

Function: mpow n

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  mpow-n
    |=  [a=ray n=@ud]
    ^-  ray
    ?~  =(0 n)  (ones meta.a)
    =/  b=ray   a
    |-  ^-  ray
    ?~  =(1 n)  b
    $(b (mmul a b), n (dec n))
  ::  proximity check [abs rel]
  ::
```

---

## `+is-close` {#isclose}

proximity check [abs rel]

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  is-close
    |=  [a=ray b=ray tol=[@ @]]
    ^-  ray
    ?>  =(shape.meta.a shape.meta.b)
    =/  atol  (fill meta.a data:(scale meta.a -.tol))
    =/  rtol  (fill meta.a data:(scale meta.a +.tol))
    (lte (abs (sub a b)) (add atol (mul rtol (abs b))))
  ::
```

---

## `+any` {#any}

Function: any

#### Accepts

Parameters as specified in source

#### Produces

See source for return type details.

#### Source

```hoon
++  any
    |=  [a=ray]
    ^-  ?(%.y %.n)
    (^lth (get-item (cumsum a) ~[0]) (roll shape.meta.a ^mul))
  ::
```

---

## `+all` {#all}

Function: all

#### Accepts

Parameters as specified in source

#### Produces

See source for return type details.

#### Source

```hoon
++  all
    |=  [a=ray]
    ^-  ?(%.y %.n)
    =((get-item (cumsum a) ~[0]) 0)
  ::
  +$  ops   $?  %add
                %sub
                %mul
                %div
                %mod
                %pow
                %gth
                %gte
                %lth
                %lte
                %equ
                %neq
                %abs
            ==
  ::
```

---

## `+fun-scalar` {#funscalar}

Function: fun scalar

#### Accepts

Parameters as specified in source

#### Produces

A `$-(`

#### Source

```hoon
++  fun-scalar
    |=  [=meta fun=ops]
    ^-  $-([@ @] @)
    =,  meta
    ?-    `^kind`kind
        %uint
      ?+  fun  !!
        %add  ~(sum fe bloq)
        %sub  ~(dif fe bloq)
        %mul  |=([b=_1 c=_1] (~(sit fe bloq) (^mul b c)))
        %div  |=([b=_1 c=_1] (~(sit fe bloq) (^div b c)))
        %mod  |=([b=@ c=@] (~(sit fe bloq) (^mod b c)))
        %pow  |=([b=@ c=@] (~(sit fe bloq) (pow b c)))
        ::%exp  |=([b=@ c=@] (~(sit fe bloq) (^pow b c)))
        ::%log  |=([b=@ c=@] (~(sit fe bloq) (^pow b c)))
        %gth  |=([b=@ c=@] !(^gth b c))
        %gte  |=([b=@ c=@] !(^gte b c))
        %lth  |=([b=@ c=@] !(^lth b c))
        %lte  |=([b=@ c=@] !(^lte b c))
        %equ  |=([b=@ c=@] ?:(.=(b c) 1 0))
        %neq  |=([b=@ c=@] ?:(.=(b c) 0 1))
      ==
      ::
        %int2  !!
      ::
        %i754
      ?+    `^bloq`bloq  !!
          %7
        ?+  fun  !!
          %add  ~(add rq rnd)
          %sub  ~(sub rq rnd)
          %mul  ~(mul rq rnd)
          %div  ~(div rq rnd)
          %mod  |=([a=@rq b=@rq] (~(sub rq rnd) a (~(mul rq rnd) b (~(san rq rnd) (need (~(toi rq rnd) (~(div rq rnd) a b)))))))
          %gth  |=([a=@rq b=@rq] ?:((~(gth rq rnd) a b) .~~~1 .~~~0))
          %gte  |=([a=@rq b=@rq] ?:((~(gte rq rnd) a b) .~~~1 .~~~0))
          %lth  |=([a=@rq b=@rq] ?:((~(lth rq rnd) a b) .~~~1 .~~~0))
          %lte  |=([a=@rq b=@rq] ?:((~(lte rq rnd) a b) .~~~1 .~~~0))
          %equ  |=([a=@rq b=@rq] ?:(.=(a b) .~~~1 .~~~0))
          %neq  |=([a=@rq b=@rq] ?:(.=(a b) .~~~0 .~~~1))
        ==
          %6
        ?+  fun  !!
          %add  ~(add rd rnd)
          %sub  ~(sub rd rnd)
          %mul  ~(mul rd rnd)
          %div  ~(div rd rnd)
          %mod  |=([a=@rd b=@rd] (~(sub rd rnd) a (~(mul rd rnd) b (~(san rd rnd) (need (~(toi rd rnd) (~(div rd rnd) a b)))))))
          %gth  |=([a=@rd b=@rd] ?:((~(gth rd rnd) a b) .~1 .~0))
          %gte  |=([a=@rd b=@rd] ?:((~(gte rd rnd) a b) .~1 .~0))
          %lth  |=([a=@rd b=@rd] ?:((~(lth rd rnd) a b) .~1 .~0))
          %lte  |=([a=@rd b=@rd] ?:((~(lte rd rnd) a b) .~1 .~0))
          %equ  |=([a=@rd b=@rd] ?:(.=(a b) .~1 .~0))
          %neq  |=([a=@rd b=@rd] ?:(.=(a b) .~0 .~1))
        ==
          %5
        ?+  fun  !!
          %add  ~(add rs rnd)
          %sub  ~(sub rs rnd)
          %mul  ~(mul rs rnd)
          %div  ~(div rs rnd)
          %mod  |=([a=@rs b=@rs] (~(sub rs rnd) a (~(mul rs rnd) b (~(san rs rnd) (need (~(toi rs rnd) (~(div rs rnd) a b)))))))
          %gth  |=([a=@rs b=@rs] ?:((~(gth rs rnd) a b) .1 .0))
          %gte  |=([a=@rs b=@rs] ?:((~(gte rs rnd) a b) .1 .0))
          %lth  |=([a=@rs b=@rs] ?:((~(lth rs rnd) a b) .1 .0))
          %lte  |=([a=@rs b=@rs] ?:((~(lte rs rnd) a b) .1 .0))
          %equ  |=([a=@rs b=@rs] ?:(.=(a b) .1 .0))
          %neq  |=([a=@rs b=@rs] ?:(.=(a b) .0 .1))
        ==
          %4
        ?+  fun  !!
          %add  ~(add rh rnd)
          %sub  ~(sub rh rnd)
          %mul  ~(mul rh rnd)
          %div  ~(div rh rnd)
          %mod  |=([a=@rh b=@rh] (~(sub rh rnd) a (~(mul rh rnd) b (~(san rh rnd) (need (~(toi rh rnd) (~(div rh rnd) a b)))))))
          %gth  |=([a=@rh b=@rh] ?:((~(gth rh rnd) a b) .~~1 .~~0))
          %gte  |=([a=@rh b=@rh] ?:((~(gte rh rnd) a b) .~~1 .~~0))
          %lth  |=([a=@rh b=@rh] ?:((~(lth rh rnd) a b) .~~1 .~~0))
          %lte  |=([a=@rh b=@rh] ?:((~(lte rh rnd) a b) .~~1 .~~0))
          %equ  |=([a=@rh b=@rh] ?:(.=(a b) .~~1 .~~0))
          %neq  |=([a=@rh b=@rh] ?:(.=(a b) .~~0 .~~1))
        ==
      ==  :: bloq real
    ==  :: kind
  ::
```

---

## `+trans-scalar` {#transscalar}

Function: trans scalar

#### Accepts

Parameters as specified in source

#### Produces

A `$-(@`

#### Source

```hoon
++  trans-scalar
    |=  [=bloq =kind fun=ops]
    ^-  $-(@ @)
    ?-    kind
        %uint
      ?+  fun  !!
        %abs  |=(b=@ b)
      ==
      ::
        %int2  !!
      ::
        %i754
      ?+    bloq  !!
          %7
        ?+  fun  !!
          %abs  |=(b=@ ?:((~(gte rq rnd) b .~~~0) b (~(mul rq rnd) b .~~~-1)))
        ==
          %6
        ?+  fun  !!
          %abs  |=(b=@ ?:((~(gte rd rnd) b .~0) b (~(mul rd rnd) b .~-1)))
        ==
          %5
        ?+  fun  !!
          %abs  |=(b=@ ?:((~(gte rs rnd) b .0) b (~(mul rs rnd) b .-1)))
        ==
          %4
        ?+  fun  !!
          %abs  |=(b=@ ?:((~(gte rh rnd) b .~~0) b (~(mul rh rnd) b .~~-1)))
        ==
      ==
    ==
  ::
```

---

## `+el-wise-op` {#elwiseop}

Function: el wise op

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  el-wise-op
    |=  [a=ray fun=$-(@ @)]
    ^-  ray
    ?>  (check a)
    %-  spac
    :-  meta.a
    =/  ali  (flop (ravel a))  :: compensate for LSB
    %+  rep  bloq.meta.a
    %+  turn
      ali
    |=(e=@ (fun e))
 ::
```

---

## `+bin-op` {#binop}

Function: bin op

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  bin-op
    |=  [a=ray b=ray op=$-([@ @] @)]
    ^-  ray
    ?>  =(meta.a meta.b)
    ?>  (check a)
    ?>  (check b)
    %-  spac
    :-  meta.a
    =/  ali  (ravel a)
    =/  bob  (ravel b)
    %+  rep  bloq.meta.a
    %+  turn
      (gulf 0 (dec (lent ali)))
    |=  i=@
    (op (snag i ali) (snag i bob))
  ::
```

---

## `+ter-op` {#terop}

Function: ter op

#### Accepts

Parameters as specified in source

#### Produces

A `ray`

#### Source

```hoon
++  ter-op
    |=  [a=ray b=ray c=ray op=$-([@ @ @] @)]
    ^-  ray
    ?>  =(meta.a meta.b)
    ?>  =(meta.c meta.b)
    ?>  (check a)
    ?>  (check b)
    ?>  (check c)
    %-  spac:la
    :-  meta.a
    =/  ali  (ravel:la a)
    =/  bob  (ravel:la b)
    =/  car  (ravel:la c)
    %+  rep  bloq.meta.a
    %+  turn
      (gulf 0 (dec (lent ali)))
    |=  i=@
    (op (snag i ali) (snag i bob) (snag i car))
  --
--
```
