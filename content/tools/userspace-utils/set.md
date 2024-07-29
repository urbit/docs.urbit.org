+++
title = "lib/set"
weight = 7
+++

Utilities to replicate ++in behavior via gates.

This file is not subject to kelvin versioning and the interface should
not be considered official.

To avoid shadowing the name `set`, import as `/+  *set`.

## `++all`

Computes the logical AND on the results of slamming every element in a `set` with a `gate`.

### Accepts

A `pair` of `set` and `gate`

### Returns

A `loobean`

### Examples

```hoon
 > (all (make ~[1 2 3 4]) |=(a=@ (lth a 5)))
 %.y
 > (all (make ~[1 2 3 4 5]) |=(a=@ (lth a 5)))
 %.n
```

### Source

```hoon
++  all
|*  [s=(set) g=$-(* ?)]
^-  ?
(~(all in s) g)
```

## `++and`

Computes the logical AND on the results of slamming every element in `set` with `gate`.  Alias for [`++all`](#and).

### Accepts

A `pair` of `set` and `gate`

### Returns

A `loobean`

### Examples

```hoon
 > (all (make ~[1 2 3 4]) |=(a=@ (lth a 5)))
 %.y
 > (all (make ~[1 2 3 4 5]) |=(a=@ (lth a 5)))
 %.n
```

### Source

```hoon
++  and  all
```

## `++any`

Computes the logical OR on the results of slamming every element in `set` with `gate`.

### Accepts

A `pair` of `set` and `gate`

### Returns

A `loobean`


##  `++any`

Computes the logical OR on every element of `set` slammed with `gate`, producing a `loobean`

### Accepts

A `pair` of `set` and `gate`

### Returns

A `loobean`

### Examples

```hoon
 > (any (make ~[2 3 4 5]) |=(a=@ (lth a 3)))
 %.y
 > (any (make ~[3 4 5]) |=(a=@ (lth a 3)))
 %.n
```

### Source

```hoon
++  any
|*  [s=(set) g=$-(* ?)]
^-  ?
(~(any in s) g)
```


## `++apply`

Turn with key (Haskell map or apply-to-all). Produces a new `set` transformed by the `gate`.  Alias for [`++run`](#run).

### Accepts

A `pair` of `set` and `gate`

### Returns

A `set`

### Examples

```hoon
 > =s (make ~["a" "A" "b" "c"])
 > `(set tape)`s
 {"A" "a" "c" "b"}
 > (apply s cuss)
 {"A" "C" "B"}
```


### Source

```hoon
++  apply  run
```

## `++apt`

Check correctness. Computes whether input has a correct horizontal order and a correct vertical order.

### Accepts

A `set`

### Returns

A `loobean`

### Examples

```hoon
 > (apt ~)
 %.y
 > =a (make ~[1 2 3])
 > a
 [n=2 l={1} r={3}]
 > (apt a)
 %.y
 
 > =z ?~(a ~ a(n 10))
 > z
 [n=10 l={1} r={3}]
 > (apt z)
 %.n
```

### Source

```
++  apt
|*  [s=(set)]
^-  ?
~(apt in s)
```

## `++bif`

Splits the `set` into two `set`s, each containing the items either side of the value but not including the value.

### Accepts

A `pair` of `set`, `noun`

### Returns

A `pair` of `set` and `set`

### Examples

```hoon
 > =a `(set @)`(make (gulf 1 20))
 > a
 {17 8 20 13 11 5 19 7 15 10 18 14 6 12 9 1 2 3 16 4}
 
 > (bif a 10)
 [l=[n=11 l={17 8 20 13} r={5 19 7 15}] r=[n=12 l={18 14 6} r={9 1 2 3 16 4}]]
 
 > `[(set @) (set @)]`(bif a 10)
 [{17 8 20 13 11 5 19 7 15} {18 14 6 12 9 1 2 3 16 4}]
```

### Source

```hoon
++  bif
|*  [s=(set) k=*]
^+  [(set) (set)]
(~(bif in s) k)
```

## `++del`

Returns a new `set` that does not contain the element.


### Accepts

A `pair` of `set` and `noun` 

### Returns

A `set`


### Examples

```hoon
 > `(set @)`(del (make ~[1 2 3 4 5]) 3)
 {5 1 2 4}
 > `(set @t)`(del (make ~['foo' 'bar' 'baz']) 'bar')
 {'baz' 'foo'}
 > `(set @)`(del (make ~[1 2 3 4 5]) 10)
 {5 1 2 3 4}
 > `(set @)`(del ~ 10)
 {}
```

### Source

```hoon
++  del
|*  [s=(set) k=*]
^+  s
(~(del in s) k)
```

## `+dif`

Computes the difference between two `sets`, producing the `set` that contains the items in the first `set` that are not in the second `set`.

### Accepts

A `pair` of `set` and `set`

### Returns

A `set`

### Examples

```hoon
 > =a (make ~[1 2 3 4 5])
 > =b (make ~[3 4])
 > `(set @)`(dif a b)
 {5 1 2}
```

### Source

```hoon
++  dif
|*  [a=(set) b=(set)]
^+  a
(~(dif in a) b)
```

## `++diff-left`

Computes the difference between two `sets`, producing the `set` that contains the items in the first `set` that are not in the second `set`.  Alias for [`+dif`](#dif).

### Accepts

A `pair` of `set` and `set`

### Returns

A `set`


### Examples

```hoon
 > =a (make ~[1 2 3 4 5])
 > =b (make ~[3 4])
 > `(set @)`(diff=left a b)
 {5 1 2}
```

### Source

```hoon
++  diff-left  dif
```

## `++diff-right`

Computes the difference between two `set`s, producing the `set` that contains the items in the second `set` that are not in the first `set`.

### Accepts

A `pair` of `set` and `set`

### Returns

A `set`



### Examples

```hoon
 > =a (make ~[1 2 3 4 5])
 > =b (make ~[3 4 6])
 > `(set @)`(diff-right a b)
 {6}
```

### Source

```hoon
++  diff-right
|*  [a=(set) b=(set)]
^+  a
(dif b a)
```

## `++diff-symmetric`

Computes the difference between two sets, producing the `set` that contains the items that are in one `set` but not in the other.

### Accepts

A `pair` of `set` and `set`

### Returns

A `set`

### Examples

```hoon
 > =a (make ~[1 2 3 4 5])
 > =b (make ~[3 4 6])
 > `(set @)`(diff-symmetric a b)
 {1 2 5 6}
```

### Source

```hoon
++  diff-symmetric
|*  [a=(set) b=(set)]
^+  a
%-  %~  uni  in
  (diff-left a b)
(diff-right a b)
```

## `++dig`

Produces the tree address of element within `set`.


### Accepts

A `pair` of `set` and `noun`

### Returns

A `(unit atom)`

### Examples

```hoon
 > =a (make ~[1 2 3 4 5 6 7])
 > -.a
 n=6
 > (dig a 7)
 [~ 12]
 > (dig a 2)
 [~ 60]
 > (dig a 6)
 [~ 2]
 > (dig a 10)
 ~
```


### Source

```hoon
++  dig
|*  [s=(set) k=*]
^+  (unit @)
(~(dig in s) k)
```

## `++filter`

Produces a new `set` with only the elements for which the `gate` produces `%.y` against the element.

### Accepts

A `pair` of `set` and `gate`

### Returns

A `set`


### Examples

```hoon
 > =myset `(set @)`(make (limo ~[1 2 3 4]))
 > myset
 {1 2 3 4}
 > `(set @)`(filter myset (curr gth 2))
 {3 4}
```
### Source

```hoon
++  filter
|*  [a=(set) b=$-(* ?)]
=/  vl  ~(tap in a)
=|  res=(list _?>(?=(^ a) n.a))
|-  ^+  a
?~  vl  (silt res)
?.  (b i.vl)
  $(vl t.vl)
$(vl t.vl, res [i.vl res])
```

## `++gas`

Insert `list` of elements into `set`.

### Accepts

A `pair` of `set` and `list`

### Returns

A `set`


### Examples

```hoon
 > =a (make ~['foo' 'bar' 'baz'])
 > `(set @t)`a
 {'bar' 'baz' 'foo'}
 > `(set @t)`(gas a ~['foo' 'foo' 'foo' 'foo'])
 {'bar' 'baz' 'foo'}
 > `(set @t)`(gas a ~['abc' 'xyz' '123'])
 {'xyz' 'bar' 'baz' 'foo' 'abc' '123'}
```


### Source

```hoon
++  gas
|*  [s=(set) l=(list (pair))]
^+  s
(~(gas in s) l)
```

## `++has`

Returns whether a `set` contains an element.


### Accepts

A `pair` of `set` and `noun`


### Returns

A `loobean`

### Examples

```hoon
 > =myset `(set @)`(make (limo ~[1 2 3 4]))
 > myset
 {1 2 3 4}
 > (has myset 1)
 %.y
 > (has myset 5)
 %.n
```

### Source

```hoon
  has
|*  [s=(set) k=*]
^-  ?
(~(has in s) k)
```

## `++int`


Produces a `set` of the intersection between two `set`s of the same type.  In case of conflict, the value from the first `set` is used.

### Accepts

A `pair` of `set` and `set`

### Returns

A `set`

### Examples

```hoon
 > `(set @tD)`(int (silt "foobar") (silt "bar"))
 {'r' 'b' 'a'}
 > `(set @tD)`(int (silt "foobar") ~)
 {}
 > `(set @tD)`(int (silt "foobar") (silt "baz"))
 {'b' 'a'}
```

### Source

```hoon
++  int
|*  [a=(set) b=(set)]
^+  a
(~(int in a) b)
```

## `++int`

Produces a `set` of the intersection between two `sets` of the same type.  In case of conflict, the value from the first `set` is used.  Alias for [`++int`](#int).

### Accepts

A `pair` of `set` and `set`

### Returns

A `set`



### Examples

```hoon
 > `(set @tD)`(intersect (silt "foobar") (silt "bar"))
 {'r' 'b' 'a'}
 > `(set @tD)`(intersect (silt "foobar") ~)
 {}
 > `(set @tD)`(intersect (silt "foobar") (silt "baz"))
 {'b' 'a'}
```

### Source

```hoon
++  intersect  int
```

## `++make`

Produces a `set` from a `list` of elements. Alias for [`++silt`](/language/hoon/reference/stdlib/2l#silt)

### Accepts

A `list`

### Returns

A `set`

### Examples

```hoon
 > `(set @tas)`(make `(list @tas)`~[%a %b %c %d])
 {%b %d %a %c}
```

### Source

```hoon
++  make  silt
```

## `++or`

Computes the logical OR on the results of slamming every element in `set` with `gate`.  Alias for [`++any`](#any).

### Accepts

A `pair` of `set` and `gate`


### Returns

A `loobean`

### Examples

```hoon
 > (or (make ~[2 3 4 5]) |=(a=@ (lth a 3)))
 %.y
 > (or (make ~[3 4 5]) |=(a=@ (lth a 3)))
 %.n
```

### Source

```hoon
++  or  any
```


## `++put`

Returns a new `set` that contains the new element.

### Accepts

A `pair` of `set` and `noun`

### Returns

A `set`

### Examples

```hoon
 > `(set @)`(put (make ~[1 2 3]) 4)
 {1 2 3 4}
 > `(set @)`(put `(set @)`~ 42)
 {42}
```

### Source

```hoon
++  put
|*  [s=(set) v=*]
^+  s
(~(put in s) v)
```

## `++reduce`

Reduce; accumulate the elements of `set` using `gate`. Applies `gate` iteratively to the elements of `set`, returning a result. Alias for [`++rep`](#rep).

### Accepts

A `pair` of `set` and `gate`

### Returns

A `noun`

### Examples

```hoon
 > (reduce (make ~[1 2 3 4 5]) add)
 b=15
 > `@t`(reduce (silt ~['foo' 'bar' 'baz']) |=(a=[@ @] (cat 3 a)))
 'foobarbaz'
```

### Source
```hoon
++  reduce  rep
```

## `++rep`

Reduce; accumulate the elements of `set` using `gate`. Applies `gate` iteratively to the elements of `set`, returning a result.

### Accepts

A `pair` of `set` and `gate`

### Returns

A `noun`
 +rep: [(set) gate] -> noun

### Examples

```hoon
 > (rep (make ~[1 2 3 4 5]) add)
 b=15
 > `@t`(rep (silt ~['foo' 'bar' 'baz']) |=(a=[@ @] (cat 3 a)))
 'foobarbaz'
```

### Source

```hoon
++  rep
|*  [s=(set) g=_=>(~ |=([* *] +<+))]
^-  *
(~(rep in s) g)
```

## `++run`

Turn with key (Haskell map or apply-to-all). Produces a new `set` transformed by `gate`.  Alias for [`++run`](#run).

### Accepts

A `pair` of `set` and `gate`

### Returns

A `set`

### Examples

```hoon
 > =s (make ~["a" "A" "b" "c"])
 > `(set tape)`s
 {"A" "a" "c" "b"}
 > (run s cuss)
 {"A" "C" "B"}
```

### Source

```hoon
++  run
|*  [s=(set) g=gate]
^+  s
(~(run in s) g)
```

## `++size`

Produces the number of elements in the set.  Alias for [`++wyt`](#wyt).

### Accepts

A `set`

### Returns

An `atom`


### Examples

```hoon
 > =a `(set @)`(make ~[1 2 3])
 > =b `(set @)`(make ~[1 2 3 4 5])
 > a
 {1 2 3}
 > b
 {5 1 2 3 4}
 
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

### Accepts

A `set`

### Returns

A `list`


## `++tap`

Produces the `list` of values in `set`.


### Accepts

A `set`

### Returns

A `list`


### Examples

```hoon
 > =myset `(set @t)`(make ~['a' 'b' 'c'])
 > myset
 {'b' 'a' 'c'}
 > (tap myset)
 ~['b' 'a' 'c']
```

### Source

```hoon
++  tap
|*  [s=(set)]
^-  (list _?>(?=(^ s) n.s))
~(tap in s)
```

## `++uni`

Produces a `set` of the union of two `set`s of the same type.

### Accepts

A `pair` of `set` and `set`

### Returns

A `set`

### Examples

```hoon
 > =a (silt ~[1 2 3 4 5])
 > =b (silt ~[4 5 6 7 8])
 
 > `(set @)`(uni a b)
 {8 5 7 6 1 2 3 4}
 > `(set @)`(uni a ~)
 {5 1 2 3 4}
 > `(set @)`(uni `(set @)`~ b)
 {8 5 7 6 4}
```


### Source

```hoon
++  uni
|*  [a=(set) b=(set)]
(~(uni in a) b)
```

## `++union`

Produces a `set` of the union of two `sets` of the same type. Alias for [`++uni`](#uni).

### Accepts

A `pair` of `set` and `set`

### Returns

A `set`


 +union: [(set) (set)] -> (set)


### Examples

```hoon
 > =a (silt ~[1 2 3 4 5])
 > =b (silt ~[4 5 6 7 8])
 
 > `(set @)`(uni a b)
 {8 5 7 6 1 2 3 4}
 > `(set @)`(uni a ~)
 {5 1 2 3 4}
 > `(set @)`(uni `(set @)`~ b)
 {8 5 7 6 4}
```

### Source

```hoon
++  union  uni
```

## `++values`

Produces the `list` of values in `set`.  Alias for [`+tap`](#tap).

### Accepts

A `set`

### Returns

A `list`

### Examples

```hoon
 > =myset `(set @t)`(make ~['a' 'b' 'c'])
 > myset
 {'b' 'a' 'c'}
 > (values myset)
 ~['b' 'a' 'c']
```

### Source

```hoon
++  values  tap
```

## `++wyt`

Produces the size, or number of elements in the `set`.

### Accepts

A `set`

### Returns

An `atom`

### Examples

```hoon
 > =a `(set @)`(make ~[1 2 3])
 > =b `(set @)`(make ~[1 2 3 4 5])
 > a
 {1 2 3}
 > b
 {5 1 2 3 4}
 
 > (wyt a)
 3
 > (wyt b)
 5
```

### Source

```hoon
++  wyt
|*  [s=(set)]
^-  @
~(wyt in s)
```
