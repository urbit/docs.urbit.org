# Sets

While the developer documentation on `$set`s and the `+in` core is comprehensive, it is organized alphabetically which can make it difficult to see what's going on with set relations.  This article will describe [set identities and relations](https://en.wikipedia.org/wiki/List_of_set_identities_and_relations) through the Hoon standard library.

A `$set` is a tree with a particular internal order based on the hash of the value.  This tends to balance the values and make lookup and access more efficient over large sets.

##  Set Creation & Membership

### Define a Set

![](https://media.urbit.org/docs/hoon-syntax/set-identity.png)

[`++silt`](../reference/stdlib/2l#silt) produces a `$set` from a `$list`.

```
> `(set @tas)`(silt `(list @tas)`~[%a %b %c %a])
{%b %a %c}
```

### Add Members

![](https://media.urbit.org/docs/hoon-syntax/set-addition.png)

[`++put:in`](../reference/stdlib/2h#putin) adds an element _x_ to a set _A_.

```
> =/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c])
  `(set @tas)`(~(put in a) %d)
{%b %d %a %c}
```

[`++gas:in`](../reference/stdlib/2h#gasin) adds each element _x_, _y_, _z_ of a list to a set _A_.

```
> =/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c])
  =/  b  `(list @tas)`~[%d %e %f]
  `(set @tas)`(~(gas in a) b)
{%e %b %d %f %a %c}
```

### Remove Members

![](https://media.urbit.org/docs/hoon-syntax/set-deletion.png)

[`++del:in`](../reference/stdlib/2h#delin) removes an element _x_ from a set _A_.

```
> =/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c %d])
  `(set @tas)`(~(del in a) %d)
{%b %a %c}
```

### Membership

![](https://media.urbit.org/docs/hoon-syntax/set-membership.png)

[`++has:in`](../reference/stdlib/2h#hasin) checks if an element _x_ is in a set _A_.

```
> =/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c])
  (~(has in a) %a)
%.y

> =/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c])
  (~(has in a) %d)
%.n
```

### Size

[`++wyt:in`](../reference/stdlib/2h#wytin) produces the number of elements in _A_ as an atom (width).

```
> =/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c])
  ~(wyt in a)
3
```

### Export as List

[`++tap:in`](../reference/stdlib/2h#tapin) produces the elements of set _A_ as a `$list`.  The order is the same as a depth-first search of the `$set`'s representation as a `$tree`, reversed.

```
> =/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c])
  ~(tap in a)
~[%c %a %b]

> =/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c])
    =/  b  `(list @tas)`~[%d %e %f]
    ~(tap in `(set @tas)`(~(gas in a) b))
~[%c %a %f %d %b %e]
```

##  Set Relations

First we consider the elementary operations between two sets.

### Union (_A_ ∪ _B_)

$$
A \cup B \equiv \{ x : x \in A \text{ or } x \in B \}
$$

![](https://media.urbit.org/docs/hoon-syntax/set-union.png)

[`++uni:in`](../reference/stdlib/2h#uniin) produces a set containing all values from _A_ or _B_.  The types of _A_ and _B_ must match.

```
> =/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c])
  =/  b  `(set @tas)`(silt `(list @tas)`~[%c %d %e])
  `(set @tas)`(~(uni in a) b)
{%e %b %d %a %c}
```

### Intersection (_A_ ∩ _B_)

$$
A \cap B \equiv \{ x : x \in A \text{ and } x \in B \}
$$

![](https://media.urbit.org/docs/hoon-syntax/set-intersection.png)

[`++int:in`](../reference/stdlib/2h#intin) produces a set containing all values from _A_ and _B_.  The types of _A_ and _B_ must match.

```
> =/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c])
  =/  b  `(set @tas)`(silt `(list @tas)`~[%c %d %e])
  `(set @tas)`(~(int in a) b)
{%c}
```

If two sets are disjoint, then their intersection is ∅.

```
> =/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c])
  =/  b  `(set @tas)`(silt `(list @tas)`~[%d %e %f])
  `(set @tas)`(~(int in a) b)
{}
```

### Complement (_Aꟲ_)

$$
A^{\textrm{C}} = X \backslash A \equiv {x \in X; x \notin A}
$$

![](https://media.urbit.org/docs/hoon-syntax/set-complement.png)

The complement of a set _A_, _Aꟲ_, may be found using [`++dif`](../reference/stdlib/2h#difin) (difference).

For instance, if _X_ = {_a_, _b_, _c_, _d_} and A = {_c_, _d_}, then _Aꟲ_ = {_a_, _b_}.

```
> =/  x  `(set @tas)`(silt `(list @tas)`~[%a %b %c %d])
  =/  a  `(set @tas)`(silt `(list @tas)`~[%c %d])
  `(set @tas)`(~(dif in x) a)
{%b %a}
```


### Symmetric Difference (_A_ Δ _B_)

$$
A \bigtriangleup B \equiv \{x : x \text{ belongs to exactly one of } A \text{ and } B\}
$$

![](https://media.urbit.org/docs/hoon-syntax/set-symmetric-difference.png)

The symmetric difference of two sets _A_ and _B_ consists of those elements in exactly one of the sets.  Use `++uni:in` with `++dif:in` to identify this set.

For instance, if _A_ = {_a_, _b_, _c_} and _B_ = {_c_, _d_, _e_}, then _A_ Δ _B_ = {_a_, _b_, _d_, _e_}.

```hoon
=/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c])
=/  b  `(set @tas)`(silt `(list @tas)`~[%c %d %e])
=/  lhs  (~(dif in a) b)
=/  rhs  (~(dif in b) a)
`(set @tas)`(~(uni in lhs) rhs)
```


##  Set Operations

### Logical `AND` (∧)

[`++all:in`](../reference/stdlib/2h#allin) computes the logical `AND` on every element in set _A_ against a logical function _f_, producing  a flag.

```
> =/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c])
  (~(all in a) (curr gth 32))
%.y
```

### Logical `OR` (∨)

[`++any:in`](../reference/stdlib/2h#anyin) computes the logical `OR` on every element in set _A_ against a logical function _f_, producing a flag.

```
> =/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c])
  (~(any in a) (curr gth 32))
%.y
```

### Operate with Function

[`++run:in`](../reference/stdlib/2h#runin) applies a function _f_ to every member of set _A_.

```
> =/  a  `(set @tas)`(silt `(list @tas)`~[%a %b %c])
  (~(run in a) @ud)
{98 97 99}
```

### Accumulate with Function

[`++rep:in`](../reference/stdlib/2h#repin) applies a binary function _f_ to every member of set _A_ and accumulates the result.

```
=/  a  `(set @ud)`(silt `(list @ud)`~[1 2 3 4 5])
    (~(rep in a) mul)
b=120
```

While there are a few other set functions in `+in`, they are largely concerned with internal operations such as consistency checking.
