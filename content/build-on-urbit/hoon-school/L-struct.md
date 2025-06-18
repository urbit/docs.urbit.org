---
description: Guide to Hoon data structures including trees, sets, jars, and jugs. Covers mold builders, type system handling, compiler type checking, and practical manipulation operations.
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

# 11. Data Structures

_This module will introduce you to several useful data structures built on the door, then discuss how the compiler handles types and the sample._


## Key Data Structures and Molds {#key-data-structures-and-molds}

[`+map`s](../../hoon/stdlib/2o.md#map) are a versatile way to store and access data, but they are far from the only useful pattern. `+map`s were documented in [the previous module](K-doors.md).

### `+tree` {#tree}

We use [tree](../../hoon/stdlib/1c.md#tree) to make a binary tree data structure in Hoon, e.g., `(tree @)` for a binary tree of atoms.

There are two kinds of `+tree` in Hoon:

1. The null tree `~`.
2. A non-null tree which is a cell with three parts.
    1. The node value.
    2. The left child of the node.
    3. The right child of the node.

Each child is itself a tree. The node value has the face `n`, the left child has the face `l`, and the right child has the face `r`. The following diagram provides an illustration of a `(tree @)` (without the faces):

```
          12
        /    \
      8       14
    /   \    /   \
   4     ~  ~     16
 /  \            /  \
~    ~          ~    ~
```

Hoon supports trees of any type that can be constructed in Hoon, e.g.: `(tree @)`, `(tree ^)`, `(tree [@ ?])`, etc. Let's construct the tree in the diagram above in the dojo, casting it accordingly:

```hoon
> `(tree @)`[12 [8 [4 ~ ~] ~] [14 ~ [16 ~ ~]]]
{4 8 12 14 16}
```

Notice that we don't have to insert the faces manually; by casting the noun above to a `(tree @)` Hoon inserts the faces for us. Let's put this noun in the Dojo subject with the face "b" and pull out the tree at the left child of the `12` node:

```hoon
> =b `(tree @)`[12 [8 [4 ~ ~] ~] [14 ~ [16 ~ ~]]]

> b
{4 8 12 14 16}

> l.b
-find.l.b
find-fork
```

This didn't work because we haven't first proved to Hoon that `.b` is a non-null tree. A null tree has no `.l` in it, after all. Let's try again, using `?~` [wutsig](../../hoon/rune/wut.md#wutsig) to prove that `.b` isn't null. We can also look at `.r` and `.n`:

```hoon
> ?~(b ~ l.b)
{4 8}

> ?~(b ~ r.b)
{14 16}

> ?~(b ~ n.b)
12
```

#### Find and Replace

Here's a program that finds and replaces certain atoms in a `(tree @)`.

```hoon
|=  [nedl=@ hay=(tree @) new=@]
^-  (tree @)
?~  hay  ~
:+  ?:  =(n.hay nedl)
      new
    n.hay
  $(hay l.hay)
$(hay r.hay)
```

The `.nedl` is the atom to be replaced, `.hay` is the tree, and `.new` is the new atom with which to replace `.nedl`. Save this as `findreplacetree.hoon` and run in the dojo:

```hoon
> b
{4 8 12 14 16}

> +findreplacetree [8 b 94]
{4 94 12 14 16}

> +findreplacetree [14 b 94]
{4 8 12 94 16}
```

### `+set` {#set}

A [set](../../hoon/stdlib/2o.md#set) is rather like a list except that each entry can only be represented once. As with a [map](../../hoon/stdlib/2o.md#map), a `+set` is typically associated with a particular type, such as `(set @ud)` for a collection of decimal values. (`+set`s also don't have an order, so they're basically a bag of unique values.)

`+set` operations are provided by [`+in`](../../hoon/stdlib/2h.md#in). Most names are similar to `+map`/[`+by`](../../hoon/stdlib/2i.md#by) operations when applicable.

[`+silt`](../../hoon/stdlib/2l.md#silt) produces a `+set` from a `+list`:

```hoon
=primes (silt ~[2 3 5 7 11 13])
```

[+put:in](../../hoon/stdlib/2h.md#putin) adds a value to a `+set` (and null-ops when the value is already present):

```hoon
=primes (~(put in primes) 17)
=primes (~(put in primes) 13)
```

[+del:in](../../hoon/stdlib/2h.md#delin) removes a value from a `+set`:

```hoon
=primes (~(put in primes) 18)
=primes (~(del in primes) 18)
```

[+has:in](../../hoon/stdlib/2h.md#hasin) checks for existence:

```hoon
> (~(has in primes) 15)
%.n

> (~(has in primes) 17)
%.y
```

[+tap:in](../../hoon/stdlib/2h.md#tapin) yields a `+list` of the values:

```hoon
> ~(tap in primes)
~[3 2 7 5 11 13 17]

> (sort ~(tap in primes) lth)
~[2 3 5 7 11 13 17]
```

[+run:in](../../hoon/stdlib/2h.md#runin) applies a function across all values:

```hoon
> (~(run in primes) dec)
{10 6 12 1 2 16 4}
```

#### Example: Cartesian Product

Here's a program that takes two [sets](../../hoon/stdlib/2o.md#set) of atoms and returns the [Cartesian product](https://en.wikipedia.org/wiki/Cartesian_product) of those sets. A Cartesian product of two sets `.a` and `.b` is a set of all the cells whose head is a member of `.a` and whose tail is a member of `.b`.

```hoon
|=  [a=(set @) b=(set @)]
=/  c=(list @)  ~(tap in a)
=/  d=(list @)  ~(tap in b)
=|  acc=(set [@ @])
|-  ^-  (set [@ @])
?~  c  acc
%=  $
  c  t.c
  acc  |-  ?~  d  acc
       %=  $
         d  t.d
         acc  (~(put in acc) [i.c i.d])
       ==
==
```

Save this as `cartesian.hoon` in your urbit's pier and run in the dojo:

```hoon
> =c `(set @)`(sy ~[1 2 3])

> c
{1 2 3}

> =d `(set @)`(sy ~[4 5 6])

> d
{5 6 4}

> +cartesian [c d]
{[2 6] [1 6] [3 6] [1 4] [1 5] [2 4] [3 5] [3 4] [2 5]}
```

### `+unit` Redux (and `$vase`) {#unit-redux-and-vase}

We encountered the [unit](../../hoon/stdlib/1c.md#unit) briefly as a tool for distinguishing null results from actual zeroes: using a `+unit` allows you to specify something that may not be there. For this reason, `+unit`s are commonly used for operations that sometimes fail, such as search functions, database lookups, remote data requests, etc.

You can build a `+unit` using the tic special notation or [`+some`](../../hoon/stdlib/2a.md#some):

```hoon
> `%mars
[~ %mars]

> (some %mars)
[~ u=%mars]
```

While [+got:by](../../hoon/stdlib/2i.md#gotby) is one way to get a value back without wrapping it in a `+unit`, it's better practice to use the [`+unit` logic](../../hoon/stdlib/2a.md) gates to manipulate gates to work correctly with `+unit`s.

For example, use [`+need`](../../hoon/stdlib/2a.md#need) to unwrap a `+unit`, or crash if the `+unit` is `~` null.

```hoon
> =colors (malt `(list (pair @tas @ux))`~[[%red 0xed.0a3f] [%yellow 0xfb.e870] [%green 0x1.a638] [%blue 0x66ff]])

> (~(get by colors) %yellow)
[~ q=0xfb.e870]

> (need (~(get by colors) %yellow))
0xfb.e870

> (~(get by colors) %teal)
~

> (need (~(get by colors) %teal))
dojo: hoon expression failed
```

Rather than unwrap a [unit](../../hoon/stdlib/1c.md#unit), one can modify gates to work with `+unit`s directly even if they're not natively set up that way. For instance, one cannot decrement a `+unit` because [`+dec`](../../hoon/stdlib/1a.md#dec) doesn't accept a `+unit`. [`+bind`](../../hoon/stdlib/2a.md#bind) can bind a non-`+unit` function, another gate-building gate!.

```hoon
> (bind ((unit @ud) [~ 2]) dec)  
[~ 1]

> (bind (~(get by colors) %orange) red)  
[~ 0xff]
```

(There are several others tools listed [on that page](../../hoon/stdlib/2a.md) which may be potentially useful to you.)

A vase is a pair of type and value, such as that returned by `!>` [zapgar](../../hoon/rune/zap.md#zapgar). A `$vase` is useful when transmitting data in a way that may lose its type information.

### Containers of Containers {#containers-of-containers}

[maps](../../hoon/stdlib/2o.md#map) and [sets](../../hoon/stdlib/2o.md#set) are frequently used in the standard library and in the extended ecosystem. There are other common patterns which recur often enough that they have their own names:

[`+jar`](../../hoon/stdlib/2o.md#jar) is a mold for a `+map` of `+list`s. `+jar` uses the [`+ja`](../../hoon/stdlib/2j.md#ja) core. (Mnemonic: jars hold solid ordered things, like a list.)

[`+jug`](../../hoon/stdlib/2o.md#jug) is a mold for a `+map` of `+set`s. `+jug` uses the [`+ju`](../../hoon/stdlib/2j.md#ju) core. (Mnemonic: jugs hold liquids, evoking the unordered nature of a [set](../../hoon/stdlib/2o.md#set).)

[`+mip`](../../hoon/mip.md) is a mold for a map of maps. `+mip` lives in the `%landscape` desk in `/lib/mip.hoon`. Affordances are still few but a short example follows:

```
> =mip -build-file /=landscape=/lib/mip/hoon

> =my-map-warm (malt `(list (pair @tas @ux))`~[[%red 0xed.0a3f] [%yellow 0xfb.e870]])

> =my-map-cool (malt `(list (pair @tas @ux))`~[[%green 0x1.a638] [%blue 0x66ff]])

> =my-mip *(mip:mip @tas (map @tas @ux))

> =my-mip (~(put bi:mip my-mip) %cool %blue 0x66ff)

> =my-mip (~(put bi:mip my-mip) %cool %green 0x1.a638)

> =my-mip (~(put bi:mip my-mip) %warm %red 0xed.0a3f)

> =my-mip (~(put bi:mip my-mip) %warm %yellow 0xfb.e870)

> my-mip
[ n=[p=%warm q=[n=[p=%yellow q=0xfb.e870] l=[n=[p=%red q=0xed.0a3f] l=~ r=~] r=~]]
  l=[n=[p=%cool q=[n=[p=%green q=0x1.a638] l=[n=[p=%blue q=0x66ff] l=~ r=~] r=~]] l=~ r=~]
  r=~
]

> (~(got bi:mip my-mip) %cool %green)
0x1.a638

> ~(tap bi:mip my-mip) ~[ [x=%warm y=%yellow v=0xfb.e870] [x=%warm
y=%red v=0xed.0a3f] [x=%cool y=%green v=0x1.a638] [x=%cool y=%blue
v=0x66ff] ]
```

Note that `+mip`s are unjetted and quite slow, but serve as a proof of concept.

[`+mop`](../../hoon/zuse/2m.md#mop) ordered maps are discussed in [the App School guides](../app-school).


## Molds and Samples {#molds-and-samples}

### Modifying Gate Behavior {#modifying-gate-behavior}

Sometimes you need to modify parts of a core (like a gate) on-the-fly to get the desired behavior. For instance, if you are using [`+roll`](../../hoon/stdlib/2b.md#roll) to calculate the multiplicative product of the elements of a list, this “just works”:

```hoon
> (roll `(list @ud)`~[10 12 14 16 18] mul)  
483.840
```

In contrast, if you do the same thing to a list of numbers with a fractional part (`@rs` floating-point values), the naïve operation will fail:

```hoon
> (roll `(list @rs)`~[.10 .12 .14 .16 .18] mul:rs)  
.0
```

Why is this?  Let's peek inside the gates and see. Since we know a core
is a cell of \[battery payload], let's take a look at the
payload:

```hoon
> +:mul
[[a=1 b=1] <33.uof 1.pnw %138>]

> +:mul:rs
[[a=.0 b=.0] <21.ezj [r=?(%d %n %u %z) <51.njr 139.oyl 33.uof 1.pnw %138>]>]
```

The correct behavior for [+mul:rs](../../hoon/stdlib/3b.md#mulrs) is really to multiply starting from one, not zero, so that [`+roll`](../../hoon/stdlib/2b.md#roll) doesn't wipe out the entire product.

### Custom Samples {#custom-samples}

In an earlier exercise we created a door with sample `[a=@ud b=@ud c=@ud]`. If we investigated, we would find that the initial value of each is `0`, the bunt value of `@ud`.

```hoon
> +6:poly
[a=0 b=0 c=0]
```

What if we wish to define a door with a chosen sample value directly? We can make use of the `$_` [buccab](../../hoon/rune/buc.md#buccab) rune, whose irregular form is simply `_`. To create the door "poly" with the sample set to have certain values in the Dojo, we would write

```hoon
> =poly |_  [a=_5 b=_4 c=_3]
++  quad
  |=  x=@ud
  (add (add (mul a (mul x x)) (mul b x)) c)
--

> (quad:poly 2)  
31
```

For our earlier example with [`+roll`](../../hoon/stdlib/2b.md#roll), if we wanted to set the default sample to have a different value than the bunt of the type, we could use `_` cab:

```hoon
> =mmul |=([a=_.1 b=_.1] (mul:rs a b))

> (roll `(list @rs)`~[.10 .12 .14 .16 .18] mmul)
.483840
```

### Named Tuples {#named-tuples}

A named tuple is a structured collection of values with faces. The `$:` [buccol](../../hoon/rune/buc.md#buccol) rune forms a named tuple. We use these implicitly in an irregular form when we specify the sample of a gate, as `|=([a=@ b=@] (add a b))` expands to a `$:` [buccol](../../hoon/rune/buc.md#buccol) expression for `[a=@ b=@]`. Otherwise, we only need these if we are building a special type like a vector (e.g. with two components like an _x_ and a _y_).

### Structure Mode {#structure-mode}

Most Hoon expressions evaluate normally (that's what “normal” means), what we'll call "noun mode" (or "normal mode"). However, sample definitions and `+$` [lusbuc](../../hoon/rune/lus.md#lusbuc) mold specification arms evaluate in what is called "structure mode". (You may occasionally see this the older term “spec mode”.)  Structure mode expressions use a similar syntax to regular Hoon expressions but create structure definitions instead.

For instance, in eval mode if you use the irregular form `p=1` this is an irregular form of the `^=` [kettis](../../hoon/rune/ket.md#kettis) rune. This is one way to define a variable using a `=+` [tislus](../../hoon/rune/tis.md#tislus); these are equivalent statements:

```hoon
> =+(hello=1 hello)
1

> =+(^=(hello 1) hello)
1
```

(Normally we have preferred `=/` [tisfas](../../hoon/rune/tis.md#tisfas) in the Hoon School docs, but that is just for consistency.)

In a sample definition, such as in a gate, the statement is evaluated in structure mode; these are equivalent statements:

```hoon
|=(hello=@ hello)

|=($=(hello @) hello)
```

There are several other subtle cases where normal mode and structure mode diverge, but most of the time structure mode is invisible to you. The [`$` buc runes](../../hoon/rune/buc.md) are typically invoked in structure mode.
