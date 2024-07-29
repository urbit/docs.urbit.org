+++
title = "lib/map"
weight = 7
+++
Arms to rename kernel map functions with different names.

This file is not subject to kelvin versioning and the interface should
not be considered official.

To avoid shadowing the name `map`, import as `/+  *map`.

/lib/map

##  `++all`

Computes the logical AND on the results of slamming every element in `map` with `gate`.

### Accepts

A `pair` of `map` and `gate`

### Returns
A `loobean`

### Examples
```hoon
> =mymap (make `(list [@tas *])`~[a+1 b+[2 3]])
> (all mymap |=(a=* ?@(a & |)))
%.n
```

### Source
```hoon
++  all
  |*  [m=(map) g=$-(* ?)]
  ^-  ?
  (~(all by m) g)
```

##  `++and`

 Alias for [++all](#all).


##  `++any`

Computes the logical OR on the results of slamming every element in `map` with `gate`.

### Accepts
A `pair` of `map` and `gate`

### Returns
A `loobean`

### Examples

```hoon
> =mymap (make `(list [@tas *])`~[a+1 b+[2 3]])
> (any mymap |=(a=* ?@(a & |)))
%.y
```

### Source

```hoon
++  any
  |*  [m=(map) g=$-(* ?)]
  ^-  ?
  (~(any by m) g)
```

## `++apply`

Turn with key (Haskell map or apply-to-all). Produces a new `map` with the same keys as the input `map`, but with the values transformed by the `gate`.  Alias for [`++urn`](#urn)

### Examples

```hoon
> =mymap `(map @ @)`(make ~[[1 1] [2 2] [3 3]])
> mymap
{[p=1 q=1] [p=2 q=2] [p=3 q=3]}
> (apply mymap |=([k=@ v=@] (pow v 2)))
{[p=1 q=1] [p=2 q=4] [p=3 q=9]}
```

### Source
```hoon
++  apply  urn
```

##  `++apt`

Check correctness.  Computes whether input has a correct horizontal order and a correct vertical order.

### Accepts

A `map`

### Returns

A `loobean`

### Examples

```hoon
 > =a (make `(list [@tas @])`~[a+1 b+2 c+3 d+4 e+5])
 > ~(apt by a)
 %.y
 > =z ?~(a ~ a(p.n `@tas`%z))
 > z
 [n=[p=%z q=2] l={[p=%e q=5]} r={[p=%d q=4] [p=%a q=1] [p=%c q=3]}]
 > ~(apt by z)
 %.n
```
### Source

```hoon
++  apt
|*  [m=(map)]
^-  ?
~(apt by m)
```

##  `++bif`

Splits the `map` into two `map`s, each containing the items either side of the key but not including the key.

## Accepts

A triple of `map`, key (noun), value (noun).

### Returns

A pair of `map` and `map`



### Examples

```hoon
 > =a (make `(list [@tas @])`~[a+1 b+2 c+3 d+4 e+5])
 > (~(bif by a) b+2)
 [l=[n=[p=%e q=5] l=~ r=~] r=[n=[p=%d q=4] l=~ r=[n=[p=%c q=3] l={[p=%a q=1]} r={}]]]
 > `[(map @tas @) (map @tas @)]`(~(bif by a) b+2)
 [{[p=%e q=5]} {[p=%d q=4] [p=%a q=1] [p=%c q=3]}]
  bif
```


### Source
```hoon
|*  [m=(map) k=* v=*]
^+  [(map) (map)]
(~(bif by m) k v)
```

## `++del`

Returns a new map that does not contain the key

### Accepts

A `pair` of `map` and `noun` (key).

### Returns
A `map`


### Examples
```hoon
 > =/  mymap  (make `(list (pair @ud @ud))`~[[%1 1] [%2 2]])
   (del mymap %2)
 [n=[p=p=1 q=q=1] l=~ r=~]
```

### Source

```hoon
++  del
|*  [m=(map) k=*]
^+  m
(~(del by m) k)
```

## `++dif`

Computes the difference between two maps, producing the map that contains the items in the first map that are not in the second map.

### Accepts

A `pair` of `map` and `map`


### Returns

A `map`

### Examples

```hoon
 > =a `(map @tas @)`(make (limo ~[a+1 b+2 c+3 d+4]))
 > =b `(map @tas @)`(make (limo ~[c+3 d+4 e+5 f+6]))
 > a
 {[p=%b q=2] [p=%d q=4] [p=%a q=1] [p=%c q=3]}
 > b
 {[p=%e q=5] [p=%d q=4] [p=%f q=6] [p=%c q=3]}
 > `(map @tas @)`(dif a b)
 {[p=%b q=2] [p=%a q=1]}
```

### Source

```hoon
  dif
|*  [a=(map) b=(map)]
^+  a
(~(dif by a) b)
```

## `++diff-left`

Computes the difference between two maps, producing the map that contains the items in the first map that are not in the second map. Alias for [`++dif`](#dif)

###  `++dif-right`

Computes the difference between two maps, producing the map that contains the items in the second map that are not in the first map.

### Accepts

A `pair` of `map` and `map`

### Returns
A `map`


### Examples
```hoon
 > =a `(map @tas @)`(make (limo ~[a+1 b+2 c+3 d+4]))
 > =b `(map @tas @)`(make (limo ~[c+3 d+4 e+5 f+6]))
 > a
 {[p=%b q=2] [p=%d q=4] [p=%a q=1] [p=%c q=3]}
 > b
 {[p=%e q=5] [p=%d q=4] [p=%f q=6] [p=%c q=3]}
 > `(map @tas @)`(diff-right a b)
 {[p=%e q=5] [p=%f q=6]}
```

### Source

```hoon
++  diff-right
|*  [a=(map) b=(map)]
^+  a
(dif b a)
```

##  `++diff-symmetric`

Computes the difference between two maps, producing the map that contains all the items that are in one map but not in the other.

### Accepts

A `pair` of `map` and `map`

### Returns
A `map`

### Examples
```hoon
 > =a `(map @tas @)`(make (limo ~[a+1 b+2 c+3 d+4]))
 > =b `(map @tas @)`(make (limo ~[c+3 d+4 e+5 f+6]))
 > a
 {[p=%b q=2] [p=%d q=4] [p=%a q=1] [p=%c q=3]}
 > b
 {[p=%e q=5] [p=%d q=4] [p=%f q=6] [p=%c q=3]}
 > `(map @tas @)`(diff-symmetric a b)
 {[p=%b q=2] [p=%a q=1] [p=%e q=5] [p=%f q=6]}
```


### Source
```hoon
++  diff-symmetric
|*  [a=(map) b=(map)]
^+  a
%-  %~  uni  by
  (diff-left a b)
(diff-right a b)
```

## `++dig` 

Produce the address of key within map.

### Accepts

A `pair` of `map` and a noun that has type of the key of `map`.

### Returns
A `unit` of a noun (the address).



### Examples
```hoon
 > =mymap `(map @tas @)`(make (limo ~[a+1 b+2 c+3 d+4]))
 > (dig mymap %b)
 [~ 252]
 > (dig mymap %b)
 [~ 2]
 > (dig by mymap %e)
 ~
 ```

### Source

```hoon
++  dig
|*  [m=(map) k=*]
^+  (unit @)
(~(dig by m) k)
```

## `++filter`
penul
Produces a new `map` with only the key-value pairs for which the gate produces `%.y` against the value.

### Accepts

A `pair` of `map` and a gate.

### Returns
A `map`

### Examples

```hoon
 > =mymap `(map @tas @)`(make (limo ~[a+1 b+2 c+3 d+4]))
 > mymap
 {[p=%b q=2] [p=%d q=4] [p=%a q=1] [p=%c q=3]}
 > `(map @tas @)`(filter mymap (curr gth 2))
 {[p=%d q=4] [p=%c q=3]}
```

### Source
```hoon
++  filter
|*  [a=(map) b=$-(* ?)]
=/  kvl  ~(tap by a)
=|  res=(list _?>(?=(^ a) n.a))
|-  ^+  a
?~  kvl  (malt res)
?.  (b +.i.kvl)
  $(kvl t.kvl)
$(kvl t.kvl, res [i.kvl res])
```

## `++gas`


Insert list of key-value pairs into map.

### Accepts
A `pair` of a `map` and a `list` of key-value pairs whose types match the `map`

### Returns
A `map` 

### Examples

```hoon
 > =mymap `(map @tas @)`(make (limo ~[a+1 b+2 c+3 d+4]))
 > mymap
 {[p=%b q=2] [p=%d q=4] [p=%a q=1] [p=%c q=3]}
 > `(map @tas @)`(gas mymap ~[e+5 f+6 g+7])
 {[p=%e q=5] [p=%b q=2] [p=%d q=4] [p=%f q=6] [p=%g q=7] [p=%a q=1] [p=%c q=3]}
 > =a `(map @tas @)`(make (limo ~[a+1 b+2]))
 > a
 {[p=%b q=2] [p=%a q=1]}
 > `(map @tas @)`(gas mymap ~[a+100 b+200])
 {[p=%b q=200] [p=%a q=100]}
 > `(map @tas @)`(gas `(map @tas @)`~ ~[a+100 b+200])
 {[p=%b q=200] [p=%a q=100]}
```


### Source
```hoon
++  gas
|*  [m=(map) l=(list (pair))]
^+  m
(~(gas by m) l)
```
## `++get`

### Accepts

A `pair` of `map` and a `noun` of type matching the key.

### Returns

A `unit` of type matching the value.


### Examples

```hoon
 > =/  mymap  (make `(list (pair @ud @ud))`~[[%1 1] [%2 2]])
   (get mymap %2)
 [~ q=2]
 Source
  get
|*  [m=(map) k=*]
(~(get by m) k)
```

## `++got`

Returns the value at key in `map`; crash if nonexistent.

### Accepts

A `pair` of `map` and a `noun` whose type matches the key.

### Returns

A `noun` whose type matches the value, or crashes.


### Examples

```hoon
 > =/  mymap  (make `(list (pair @ud @ud))`~[[%1 1] [%2 2]])
   (got mymap %2)
 q=2
 Source
  got
|*  [m=(map) k=*]
(~(got by m) k)
```

##  `++gut`

Returns the value at key in map; default if nonexistent.

### Accepts

A triple of `map`, a `noun` (type of key), and a `noun` (type of value).

### Returns

A `noun` (type of value).


 +got: [(map) noun noun] -> noun


### Examples

```hoon
 > =/  mymap  (make `(list (pair @ud @ud))`~[[%1 1] [%2 2]])
   (gut mymap %2 q=5)
 q=2
   (gut mymap %3 q=5)
 q=5
```
### Source

```hoon
++  gut
|*  [m=(map) k=* d=*]
(~(gut by m) k d)
```

##  `++has`


 Returns whether map contains key.

### Accepts

A `pair` of `map` and `noun` (type of key).

### Returns

A `loobean`.

### Examples

```hoon
 > =mymap `(map @tas @)`(make (limo ~[a+1 b+2 c+3 d+4]))
 > mymap
 {[p=%b q=2] [p=%d q=4] [p=%a q=1] [p=%c q=3]}
 > (has mymap %a)
 %.y
 > (has mymap %z)
 %.n
```


### Source

```hoon
++  has
|*  [m=(map) k=*]
^-  ?
(~(has by m) k)
```

##  `++int`

Produces a map of the key intersection between two maps of the same type.  In case of conflict, the value from the first map is used.

### Accepts

A `pair` of two `map`s.

### Returns

A `map`.


### Examples

```hoon
 > =a `(map @tas @)`(make (limo ~[a+1 b+2 c+3 d+4]))
 > =b `(map @tas @)`(make (limo ~[c+3 d+4 e+5 f+6]))
 > a
 {[p=%b q=2] [p=%d q=4] [p=%a q=1] [p=%c q=3]}
 > b
 {[p=%e q=5] [p=%d q=4] [p=%f q=6] [p=%c q=3]}

 > `(map @tas @)`(int a b)
 {[p=%d q=4] [p=%c q=3]}
 > =a `(map @tas @)`(make (limo ~[a+1 b+2]))
 > =b `(map @tas @)`(make (limo ~[a+100 b+200]))
 > a
 {[p=%b q=2] [p=%a q=1]}
 > b
 {[p=%b q=200] [p=%a q=100]}

 > `(map @tas @)`(int a b)
 {[p=%b q=200] [p=%a q=100]}
```


### Source

```hoon
++  int
|*  [a=(map) b=(map)]
^+  a
(~(int by a) b)
```


## `++intersect`

Produces a map of the key intersection between two maps of the same type.  In case of conflict, the value from the first map is used. Alias for [`++int`](#int).
 
##  `++jab`

### Accepts

A triple of `map`, a `noun` (type of key), and a `gate`.

### Returns

A `noun` with type of the map's value.

### Examples

```hoon
 > =a `(map @tas @)`(make (limo ~[a+1 b+2 c+3 d+4]))
 > a
 {[p=%b q=2] [p=%d q=4] [p=%a q=1] [p=%c q=3]}
 
 > `(map @tas @)`(jab a %d |=(x=@ (pow x 2)))
 {[p=%b q=2] [p=%d q=16] [p=%a q=1] [p=%c q=3]}
 
 > (jab a %z |=(x=@ (pow x 2)))
 dojo: hoon expression failed
 
 > (jab a %d |=(a=@ [a a]))
 -need.?(%~ [n=[p=@tas q=@] l=nlr([p=@tas q=@]) r=nlr([p=@tas q=@])])
 -have.[n=[p=@tas q=[@ @]] l=nlr([p=@tas q=@]) r=nlr([p=@tas q=@])]
 nest-fail
 dojo: hoon expression failed
```

### Source

```hoon
++  jab
|*  [m=(map) k=* g=gate]
^+  m
(~(jab by m) k g)
```

## `++key`

Produces the set of all keys in the map.

### Accepts

A `map`

### Returns

A `set`


### Examples

```hoon
 > =mymap `(map @tas @)`(make (limo ~[a+1 b+2 c+3 d+4]))
 > (key mymap)
 {%b %d %a %c}
  key
```

### Source
```hoon
|*  [m=(map)]
^-  (set _?>(?=(^ m) p.n.m))
~(key by m)
```

## `++keys`

Produces the set of all keys in the `map`.  Alias for [`++key`](#key).

##  `++mar`

Produces map with the addition of key-value pair if the unit value is a nonempty.  Else delete the key.

### Accepts

A triple of `map`, a `noun` (type of key) and a `unit` containing type of the value.

### Returns

### Examples
```hoon
 > =mymap `(map @tas @)`(make (limo ~[a+1 b+2 c+3 d+4]))
 > mymap
 {[p=%b q=2] [p=%d q=4] [p=%a q=1] [p=%c q=3]}
 
 > `(map @tas @)`(mar mymap %e (some 5))
 {[p=%e q=5] [p=%b q=2] [p=%d q=4] [p=%a q=1] [p=%c q=3]}
 
 > `(map @tas @)`(mar mymap %a (some 10))
 {[p=%b q=2] [p=%d q=4] [p=%a q=10] [p=%c q=3]}
 
 > `(map @tas @)`(mar mymap %a ~)
 {[p=%b q=2] [p=%d q=4] [p=%c q=3]}
```

### Source
```hoon
  mar
|*  [m=(map) k=* v=(unit *)]
^+  m
(~(mar by m) k v)
```

##  `++make`

 Produces a map from a list of key-value pairs. Alias for [`++malt`](/language/hoon/reference/stdlib/2l#malt)
 
 ### Accepts

A `list` of `pair`s of keys and values

### Returns

A `map`


### Examples

```hoon
 > `(map @tas @)`(make ~[[a 1] [b 2] [c 3] [d 4]])
 {[p=%b q=2] [p=%d q=4] [p=%a q=1] [p=%c q=3]}
```

### `++or`

Computes the logical OR on the results of slamming every element in map a with gate b. Alias for [`+any`](#any).

### Accepts

A `pair` of `map` and a `gate`

### Returns

A `loobean`


### Examples

```hoon
 > =mymap (make `(list [@tas *])`~[a+1 b+[2 3]])
 > (or mymap |=(a=* ?@(a & |)))
 %.y
```

## `++pairs`

Produces a list of key-value pairs in the map.  Alias for [`++tap`](#tap).


### Accepts

A `map`

### Returns

A `list` of `pair`. In the `pair`, the first element has type of the `map`'s key and second element has type of the value.



### Examples

```hoon
 > =mymap `(map @ @)`(make ~[[1 1] [2 2] [3 3] [4 4] [5 5]])
 > (pairs mymap)
 ~[[p=4 q=4] [p=3 q=3] [p=2 q=2] [p=1 q=1] [p=5 q=5]]
 ```


### Source

```hoon
++  pairs  tap
```


## `++put`

Returns a new `map` that contains the new value at key.

### Accepts

A triple of `map`, `noun` (type of key), and `noun` (type of value)

### Returns

A `map`.

### Examples

```hoon
 > =/  mymap  (make `(list (pair @ud @ud))`~[[%1 1] [%2 2]])
   (put mymap %3 3)
 [n=[p=p=2 q=q=2] l=[n=[p=p=1 q=q=1] l=~ r=~] r=[n=[p=p=3 q=q=3] l=~ r=~]]
```

### Source

```hoon
++  put
|*  [m=(map) k=* v=*]
^+  m
(~(put by m) k v)
```

## `++reduce`

Reduce; accumulate the elements of `map` using `gate`. Alias for `[++rep]`(#rep)

### Accepts

A `pair` of `map` and `gate`

### Returns

A `noun`


### Examples

```hoon
 > =mymap `(map @tas @)`(make (limo ~[a+1 b+2 c+3 d+4]))
 > mymap
 {[p=%b q=2] [p=%d q=4] [p=%a q=1] [p=%c q=3]}
 > (rep mymap |=([p=[@tas @] q=@] ~&([p q] (add +.p q))))
 [[%b 2] 0]
 [[%d 4] 2]
 [[%c 3] 6]
 [[%a 1] 9]
 q=10
```

### Source

```hoon
++  reduce  rep
```

### `++rep`

Reduce; accumulate the elements of `map` using `gate`.

### Accepts

A `pair` of `map` and `gate`

### Returns

A `noun`

### Examples

```hoon
 > =mymap `(map @tas @)`(make (limo ~[a+1 b+2 c+3 d+4]))
 > mymap
 {[p=%b q=2] [p=%d q=4] [p=%a q=1] [p=%c q=3]}
 > (rep mymap |=([p=[@tas @] q=@] ~&([p q] (add +.p q))))
 [[%b 2] 0]
 [[%d 4] 2]
 [[%c 3] 6]
 [[%a 1] 9]
 q=10
```

### Source

```hoon
++  rep
|*  [m=(map) g=_=>(~ |=([* *] +<+))]
^-  *
(~(rep by m) g)
```

## `++rib`

Transform plus product.  Accumulate over each key-value pair and transform the map in place.  The input gate accepts a sample of the form [[key value] accumulator] and yields a product like [accumulator [key value]].

### Accepts

A triple of `map`, `noun` and `gate`

### Returns

A pair of `noun` and `map`

### Examples

```hoon
 > =mymap `(map @t @)`(make ~[['a' 1] ['b' 2] ['c' 3] ['d' 4] ['e' 5]])
 > mymap
 {[p='e' q=5] [p='b' q=2] [p='d' q=4] [p='a' q=1] [p='c' q=3]}
 
 > =c |=  [[k=@t v=@] acc=(list @t)]
      ?:  (lth v 3)
        [[k acc] [k 0]]
      [acc [k v]]
 
 > `[(list @t) (map @t @)]`(rib mymap *(list @t) c)
 [<|a b|> {[p='e' q=5] [p='b' q=0] [p='d' q=4] [p='a' q=0] [p='c' q=3]}]
```


### Source
```hoon
++  rib
|*  [m=(map) b=* g=gate]
^+  [b m]
(~(rib by m) b g)
```

## `++run`

Transform values in the `map` using the `gate`.

### Accepts

A `pair` of `map` and `gate`

### Returns

A `map`


### Examples

```hoon
 > =mymap `(map @t @)`(make ~[['a' 1] ['b' 2] ['c' 3] ['d' 4] ['e' 5]])
 > `(map @t @)`(run mymap dec)
 {[p='e' q=4] [p='b' q=1] [p='d' q=3] [p='a' q=0] [p='c' q=2]}
```

### Source

```hoon
++  run
|*  [m=(map) g=gate]
^+  m
(~(run by m) g)
```

## `++size`

Produces the depth (size) of the `map`.  Alias for [`++wyt`](#wyt).

### Accepts

A `map`

### Returns

An `atom`


### Examples

```hoon
 > =a `(map @ @)`(make ~[[1 1] [2 2] [3 3]])
 > =b `(map @ @)`(make ~[[1 1] [2 2] [3 3] [4 4] [5 5]])
 > a
 {[p=1 q=1] [p=2 q=2] [p=3 q=3]}
 > b
 {[p=5 q=5] [p=1 q=1] [p=2 q=2] [p=3 q=3] [p=4 q=4]}
 
 > (size a)
 3
 > (size b)
 5
```

### Source

```hoon
++  size  wyt
```

## `++tap`

Produces a `list` of key-value pairs in the `map`.

### Accepts

A `map`

### Returns

A `list` of `pair` (key-value pairs)

### Examples

```hoon
 > =mymap `(map @ @)`(make ~[[1 1] [2 2] [3 3] [4 4] [5 5]])
 > (tap mymap)
 ~[[p=4 q=4] [p=3 q=3] [p=2 q=2] [p=1 q=1] [p=5 q=5]]
```

### Source
```hoon
++  tap
|*  [m=(map)]
^-  (list _?>(?=(^ m) n.m))
~(tap by m)
```

## `++transform-value`

Transform values in the `map` using the `gate`. Alias for [`++run`](#run).

### Accepts

A `pair` of `map` and `gate`

### Returns

A `map`

### Examples

```hoon
 > =mymap `(map @t @)`(make ~[['a' 1] ['b' 2] ['c' 3] ['d' 4] ['e' 5]])
 > `(map @t @)`(transform-value mymap dec)
 {[p='e' q=4] [p='b' q=1] [p='d' q=3] [p='a' q=0] [p='c' q=2]}
```

### Source

```hoon
  ++transform-value  run
```

## `++transform-product`

Transform plus product. Accumulate over each key-value pair and transform the `map` in place.  The input `gate` accepts a sample of the form `[[key value] accumulator]` and yields a product like `[accumulator [key value]]`. Alias for [`++rib`](#rib).

### Accepts

A triple of `map`, `noun` and `gate`

### Returns

A `pair` of `noun` and `map`

### Examples

```hoon
 > =mymap `(map @t @)`(make ~[['a' 1] ['b' 2] ['c' 3] ['d' 4] ['e' 5]])
 > mymap
 {[p='e' q=5] [p='b' q=2] [p='d' q=4] [p='a' q=1] [p='c' q=3]}

 > =c |=  [[k=@t v=@] acc=(list @t)]
      ?:  (lth v 3)
        [[k acc] [k 0]]
      [acc [k v]]
 
 > `[(list @t) (map @t @)]`(transform-product mymap *(list @t) c)
 [<|a b|> {[p='e' q=5] [p='b' q=0] [p='d' q=4] [p='a' q=0] [p='c' q=3]}]

```

### Source

```hoon
++  transform-product  rib
```

## `++uni`

Produces a `map` of the union of two `map`s of the same type. In case of conflict, the value from the first `map` is used.

### Accepts

A `pair` of `map` and `map`

### Returns

A `map`


 +uni: [(map) (map)] -> (map)


### Examples
```hoon
 > =a `(map @ @)`(make ~[[1 1] [2 2] [3 3]])
 > =b `(map @ @)`(make ~[[3 300] [4 400] [5 500]])
 > a
 {[p=1 q=1] [p=2 q=2] [p=3 q=3]}
 > b
 {[p=5 q=500] [p=3 q=300] [p=4 q=400]}
 > `(map @ @)`(uni a b)
 {[p=5 q=500] [p=1 q=1] [p=2 q=2] [p=3 q=300] [p=4 q=400]}
```

### Source

```hoon
  uni
|*  [a=(map) b=(map)]
(~(uni by a) b)
```

## `++union`

Produces a `map` of the union of two `map`s of the same type. In case of conflict, the value from the first `map` is used. Alias for [`++uni`](#uni).

### Accepts

A `pair` of `map` and `map`

### Returns

A `map`


### Examples

```hoon
 > =a `(map @ @)`(make ~[[1 1] [2 2] [3 3]])
 > =b `(map @ @)`(make ~[[3 300] [4 400] [5 500]])
 > a
 {[p=1 q=1] [p=2 q=2] [p=3 q=3]}
 > b
 {[p=5 q=500] [p=3 q=300] [p=4 q=400]}
 > `(map @ @)`(union a b)
 {[p=5 q=500] [p=1 q=1] [p=2 q=2] [p=3 q=300] [p=4 q=400]}
```

### Source

```hoon
++  union  uni
```

## `++uno`

General union: Produces a `map` of the union between the keys of two `map`s. If they share a key, `gate` is applied to both and its product is used as the new value of the key in question.

### Accepts

A triple of `map`, `map`, and `gate`

### Returns

A `map`


### Examples

```hoon
 > =a `(map @ @)`(make ~[[1 1] [2 2] [3 3]])
 > =b `(map @ @)`(make ~[[3 3] [4 4] [5 5]])
 > a
 {[p=1 q=1] [p=2 q=2] [p=3 q=3]}
 > b
 {[p=5 q=5] [p=3 q=3] [p=4 q=4]}
 
 > `(map @ @)`(uno a b |=([k=@ v=@ w=@] (add v w)))
 {[p=5 q=5] [p=1 q=1] [p=2 q=2] [p=3 q=6] [p=4 q=4]}
```

### Source

```hoon
++  uno
|*  [a=(map) b=(map) g=gate]
((~(uno by a) b) g)
```

## `++unify`

General union: Produces a map of the union between the keys of a and b. If b shares a key with a, gate meg is applied to both and its product is used as the new value of the key in question.  Alias for [`++uno`](#uno).

### Accepts

A `pair` of `map` and `map`

### Returns

A `map`


### Examples

```hoon
 > =a `(map @ @)`(make ~[[1 1] [2 2] [3 3]])
 > =b `(map @ @)`(make ~[[3 3] [4 4] [5 5]])
 > a
 {[p=1 q=1] [p=2 q=2] [p=3 q=3]}
 > b
 {[p=5 q=5] [p=3 q=3] [p=4 q=4]}
 
 > `(map @ @)`(uno a b |=([k=@ v=@ w=@] (add v w)))
 {[p=5 q=5] [p=1 q=1] [p=2 q=2] [p=3 q=6] [p=4 q=4]}
```

### Source

```hoon
++  unify  uno
```

## `++urn`

Turn with key (Haskell map or apply-to-all). Produces a new `map` with the same keys as the input `map`, but with the values transformed by the `gate`.

### Accepts

A `pair` of `map` and `gate`

### Returns

A `map`
 +urn: [(map) gate] -> (map)


### Examples

```hoon
 > =mymap `(map @ @)`(make ~[[1 1] [2 2] [3 3]])
 > mymap
 {[p=1 q=1] [p=2 q=2] [p=3 q=3]}
 
 > (urn mymap |=([k=@ v=@] (pow v 2)))
 {[p=1 q=1] [p=2 q=4] [p=3 q=9]} 
```

### Source

```hoon
  urn
|*  [m=(map) g=gate]
(~(urn by m) g)
```

## `++val`

Produces the `list` of values in `map`.

### Accepts

A `map`

### Returns

A `list`

### Examples

```hoon
 > =mymap `(map @t @)`(make ~[['a' 1] ['b' 2] ['c' 3]])
 > mymap
 {[p='b' q=2] [p='a' q=1] [p='c' q=3]}
 > (val mymap)
 ~[3 1 2]
```


### Source

```hoon
++  val
|*  [m=(map)]
~(val by m)
```

## `++values`

Produces the `list` of values in `map`.  Alias for [`+val`](#val).

### Accepts

A `map`

### Returns

A `list`

### Examples

```hoon
 > =mymap `(map @t @)`(make ~[['a' 1] ['b' 2] ['c' 3]])
 > mymap
 {[p='b' q=2] [p='a' q=1] [p='c' q=3]}
 > (values mymap)
 ~[3 1 2]
```

### Source

```hoon
++  values  val
```

## `++wyt`

Produces the depth (size) of the map.

### Accepts

A `map`

### Returns

An `atom`

### Examples

```hoon
 > =a `(map @ @)`(make ~[[1 1] [2 2] [3 3]])
 > =b `(map @ @)`(make ~[[1 1] [2 2] [3 3] [4 4] [5 5]])
 > a
 {[p=1 q=1] [p=2 q=2] [p=3 q=3]}
 > b
 {[p=5 q=5] [p=1 q=1] [p=2 q=2] [p=3 q=3] [p=4 q=4]}

 > (wyt a)
 3
 > (wyt b)
 5
```


### Source

```hoon
++  wyt
|*  [m=(map)]
^-  @
  ~(wyt by m)
--
```