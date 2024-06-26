+++
title = "11. Data Structures"
weight = 21
nodes = [183]
objectives = ["Identify units, sets, maps, and compound structures like jars and jugs.", "Explain why units and vases are necessary.", "Use helper arms and syntax:  `` ` ``, `biff`, `some`, etc."]
+++

_This module will introduce you to several useful data structures built
on the {% tooltip label="door" href="/glossary/door" /%}, then discuss
how the compiler handles types and the {% tooltip label="sample"
href="/glossary/sample" /%}._


##  Key Data Structures and Molds

{% tooltip label="++maps" href="/language/hoon/reference/stdlib/2o#map" /%} are
a versatile way to store and access data, but they are far from
the only useful pattern.  `++map`s were documented in [the previous
module](/courses/hoon-school/K-doors).

### `tree`

We use {% tooltip label="tree"
href="/language/hoon/reference/stdlib/1c#tree" /%} to make a binary tree
data structure in Hoon, e.g., `(tree @)` for a binary tree of atoms.

There are two kinds of `tree` in Hoon:

1. The null tree `~`.
2. A non-null tree which is a cell with three parts.
    1. The node value.
    2. The left child of the node.
    3. The right child of the node.
    
    Each child is itself a tree.  The node value has the {% tooltip
    label="face" href="/glossary/face" /%} `n`, the left child has the
    face `l`, and the right child has the face `r`. The following
    diagram provides an illustration of a `(tree @)` (without the
    faces):

```
          12
        /    \
      8       14
    /   \    /   \
   4     ~  ~     16
 /  \            /  \
~    ~          ~    ~
```

Hoon supports trees of any type that can be constructed in Hoon, e.g.:
`(tree @)`, `(tree ^)`, `(tree [@ ?])`, etc.  Let's construct the tree
in the diagram above in the dojo, casting it accordingly:

```hoon
> `(tree @)`[12 [8 [4 ~ ~] ~] [14 ~ [16 ~ ~]]]
{4 8 12 14 16}
```

Notice that we don't have to insert the faces manually; by casting the
{% tooltip label="noun" href="/glossary/noun" /%} above to a `(tree @)`
Hoon inserts the faces for us.  Let's put this noun in the dojo {%
tooltip label="subject" href="/glossary/subject" /%} with the face `b`
and pull out the tree at the left child of the `12` node:

```hoon
> =b `(tree @)`[12 [8 [4 ~ ~] ~] [14 ~ [16 ~ ~]]]

> b
{4 8 12 14 16}

> l.b
-find.l.b
find-fork
```

This didn't work because we haven't first proved to Hoon that `b` is a
non-null tree.  A null tree has no `l` in it, after all.  Let's try
again, using `?~` {% tooltip label="wutsig"
href="/language/hoon/reference/rune/wut#-wutsig" /%} to prove that `b`
isn't null.  We can also look at `r` and `n`:

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

```hoon {% copy=true %}
|=  [nedl=@ hay=(tree @) new=@]
^-  (tree @)
?~  hay  ~
:+  ?:  =(n.hay nedl)
      new
    n.hay
  $(hay l.hay)
$(hay r.hay)
```

`nedl` is the atom to be replaced, `hay` is the tree, and `new` is the
new atom with which to replace `nedl`.  Save this as
`findreplacetree.hoon` and run in the dojo:

```hoon
> b
{4 8 12 14 16}

> +findreplacetree [8 b 94]
{4 94 12 14 16}

> +findreplacetree [14 b 94]
{4 8 12 94 16}
```

### `set`

A {% tooltip label="set" href="/language/hoon/reference/stdlib/2o#set"
/%} is rather like a {% tooltip label="list" href="/glossary/list" /%}
except that each entry can only be represented once.  As with a {%
tooltip label="map" href="/language/hoon/reference/stdlib/2o#map" /%}, a
`set` is typically associated with a particular type, such as `(set
@ud)` for a collection of decimal values.  (`set`s also don't have an
order, so they're basically a bag of unique values.)

`set` operations are provided by {% tooltip label="++in"
href="/language/hoon/reference/stdlib/2h#in" /%}.  Most names are
similar to `map`/{% tooltip label="++by"
href="/language/hoon/reference/stdlib/2i#by" /%} operations when
applicable.

{% tooltip label="++silt" href="/language/hoon/reference/stdlib/2l#silt" /%} produces
a `set` from a `list`:

```hoon {% copy=true %}
=primes (silt ~[2 3 5 7 11 13])
```

{% tooltip label="++put:in" href="/language/hoon/reference/stdlib/2h#putin" /%} adds
a value to a `set` (and null-ops when the value is already present):

```hoon {% copy=true %}
=primes (~(put in primes) 17)
=primes (~(put in primes) 13)
```

{% tooltip label="++del:in" href="/language/hoon/reference/stdlib/2h#delin" /%} removes
a value from a `set`:

```hoon {% copy=true %}
=primes (~(put in primes) 18)
=primes (~(del in primes) 18)
```

{% tooltip label="++has:in" href="/language/hoon/reference/stdlib/2h#hasin" /%} checks
for existence:

```hoon
> (~(has in primes) 15)
%.n

> (~(has in primes) 17)
%.y
```

{% tooltip label="++tap:in" href="/language/hoon/reference/stdlib/2h#tapin" /%} yields
a `list` of the values:

```hoon
> ~(tap in primes)
~[3 2 7 5 11 13 17]

> (sort ~(tap in primes) lth)
~[2 3 5 7 11 13 17]
```

{% tooltip label="++run:in" href="/language/hoon/reference/stdlib/2h#runin" /%} applies
a function across all values:

```hoon
> (~(run in primes) dec)
{10 6 12 1 2 16 4}
```

#### Example:  Cartesian Product

Here's a program that takes two {% tooltip label="sets"
href="/language/hoon/reference/stdlib/2o#set" /%} of atoms and returns
the [Cartesian product](https://en.wikipedia.org/wiki/Cartesian_product)
of those sets.  A Cartesian product of two sets `a` and `b` is a set of
all the cells whose head is a member of `a` and whose tail is a member
of `b`.

```hoon {% copy=true %}
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

Save this as `cartesian.hoon` in your urbit's {% tooltip label="pier"
href="/glossary/pier" /%} and run in the dojo:

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

### `unit` Redux (and `vase`)

We encountered the {% tooltip label="unit"
href="/language/hoon/reference/stdlib/1c#unit" /%} briefly as a tool for
distinguishing null results from actual zeroes:  using a `unit` allows
you to specify something that may not be there.  For this reason,
`unit`s are commonly used for operations that sometimes fail, such as
search functions, database lookups, remote data requests, etc.

You can build a `unit` using the tic special notation or {% tooltip
label="++some" href="/language/hoon/reference/stdlib/2a#some" /%}:

```hoon
> `%mars
[~ %mars]

> (some %mars)
[~ u=%mars]
```

While {% tooltip label="++got:by"
href="/language/hoon/reference/stdlib/2i#gotby" /%} is one way to get a
value back without wrapping it in a `unit`, it's better practice to use
the [`unit` logic](/language/hoon/reference/stdlib/2a) gates to
manipulate gates to work correctly with `unit`s.

For example, use {% tooltip label="++need"
href="/language/hoon/reference/stdlib/2a#need" /%} to unwrap a `unit`,
or crash if the `unit` is `~` null.

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

Rather than unwrap a {% tooltip label="unit"
href="/language/hoon/reference/stdlib/1c#unit" /%}, one can modify gates
to work with `unit`s directly even if they're not natively set up that
way.  For instance, one cannot decrement a `unit` because {% tooltip
label="++dec" href="/language/hoon/reference/stdlib/1a#dec" /%} doesn't
accept a `unit`. {% tooltip label="++bind"
href="/language/hoon/reference/stdlib/2a#bind" /%} can bind a non-`unit`
function—another gate-building gate!.

```hoon
> (bind ((unit @ud) [~ 2]) dec)  
[~ 1]

> (bind (~(get by colors) %orange) red)  
[~ 0xff]
```

(There are several others tools listed [on that
page](/language/hoon/reference/stdlib/2a) which may be potentially
useful to you.)

A {% tooltip label="vase" href="/glossary/vase" /%} is a pair of type
and value, such as that returned by `!>` {% tooltip label="zapgar"
href="/language/hoon/reference/rune/zap#-zapgar" /%}.  A `vase` is
useful when transmitting data in a way that may lose its type
information.

### Containers of Containers

{% tooltip label="maps" href="/language/hoon/reference/stdlib/2o#map" /%} and
{% tooltip label="sets" href="/language/hoon/reference/stdlib/2o#set" /%} are
frequently used in the standard library and in the extended ecosystem.
There are other common patterns which recur often enough that
they have their own names:

- {% tooltip label="++jar" href="/language/hoon/reference/stdlib/2o#jar" /%} is
  a mold for a `map` of `list`s.  `++jar` uses the {% tooltip
  label="++ja" href="/language/hoon/reference/stdlib/2j#ja" /%} core.
  (Mnemonic: jars hold solid ordered things, like a {% tooltip
  label="list" href="/glossary/list" /%}.)

- {% tooltip label="++jug" href="/language/hoon/reference/stdlib/2o#jug" /%} is
  a {% tooltip label="mold" href="/glossary/mold" /%} for a `map`
  of `set`s.  `++jug` uses the {% tooltip label="++ju"
  href="/language/hoon/reference/stdlib/2j#ju" /%} core.  (Mnemonic:
  jugs hold liquids, evoking the unordered nature of a {% tooltip
  label="set" href="/language/hoon/reference/stdlib/2o#set" /%}.)

- {% tooltip label="++mip" href="/language/hoon/reference/mip#mip" /%} is
  a mold for a map of maps.  `++mip` lives in the `%landscape` desk in
  `/lib/mip.hoon`.  Affordances are still few but a short example
  follows:

    ```hoon
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

    > ~(tap bi:mip my-mip)
    ~[
      [x=%warm y=%yellow v=0xfb.e870]
      [x=%warm y=%red v=0xed.0a3f]
      [x=%cool y=%green v=0x1.a638]
      [x=%cool y=%blue v=0x66ff]
    ]
    ```

    `mip`s are unjetted and quite slow but serve as a proof of concept.

- {% tooltip label="++mop" href="/language/hoon/reference/zuse/2m#mop" /%} ordered
  maps are discussed in [the App School guides](/courses/app-school).


##  Molds and Samples

### Modifying Gate Behavior

Sometimes you need to modify parts of a {% tooltip label="core"
href="/glossary/core" /%} (like a {% tooltip label="gate"
href="/glossary/gate" /%}) on-the-fly to get the desired behavior.  For
instance, if you are using {% tooltip label="++roll"
href="/language/hoon/reference/stdlib/2b#roll" /%} to calculate the
multiplicative product of the elements of a list, this “just works”:

```hoon
> (roll `(list @ud)`~[10 12 14 16 18] mul)  
483.840
```

In contrast, if you do the same thing to a list of numbers with a
fractional part (`@rs` floating-point values), the naïve operation will
fail:

```hoon
> (roll `(list @rs)`~[.10 .12 .14 .16 .18] mul:rs)  
.0
```

Why is this?  Let's peek inside the gates and see.  Since we know a core
is a cell of `[battery payload]`, let's take a look at the {% tooltip
label="payload" href="/glossary/payload" /%}:

```hoon
> +:mul
[[a=1 b=1] <33.uof 1.pnw %138>]

> +:mul:rs
[[a=.0 b=.0] <21.ezj [r=?(%d %n %u %z) <51.njr 139.oyl 33.uof 1.pnw %138>]>]
```

The correct behavior for {% tooltip label="++mul:rs"
href="/language/hoon/reference/stdlib/3b#mulrs" /%} is really to
multiply starting from one, not zero, so that {% tooltip label="++roll"
href="/language/hoon/reference/stdlib/2b#roll" /%} doesn't wipe out
the entire product.

### Custom Samples

In an earlier exercise we created a {% tooltip label="door"
href="/glossary/door" /%} with {% tooltip label="sample"
href="/glossary/sample" /%} `[a=@ud b=@ud c=@ud]`.  If we investigated,
we would find that the initial value of each is `0`, the bunt value of
`@ud`.

```hoon
> +6:poly
[a=0 b=0 c=0]
```

What if we wish to define a door with a chosen sample value directly? We
can make use of the `$_` {% tooltip label="buccab"
href="/language/hoon/reference/rune/buc#_-buccab" /%} rune, whose
irregular form is simply `_`. To create the door `poly` with the sample
set to have certain values in the {% tooltip label="Dojo"
href="/glossary/dojo" /%}, we would write

```hoon
> =poly |_  [a=_5 b=_4 c=_3]
++  quad
  |=  x=@ud
  (add (add (mul a (mul x x)) (mul b x)) c)
--

> (quad:poly 2)  
31
```

For our earlier example with {% tooltip label="++roll"
href="/language/hoon/reference/stdlib/2b#roll" /%}, if we wanted to set
the default sample to have a different value than the {% tooltip
label="bunt" href="/glossary/bunt" /%} of the type, we could use `_`
cab:

```hoon
> =mmul |=([a=_.1 b=_.1] (mul:rs a b))

> (roll `(list @rs)`~[.10 .12 .14 .16 .18] mmul)
.483840
```

### Named Tuples

A named tuple is a structured collection of values with {% tooltip
label="faces" href="/glossary/face" /%}.  The `$:` {% tooltip
label="buccol" href="/language/hoon/reference/rune/buc#-buccol" /%} rune
forms a named tuple.  We use these implicitly in an irregular form when
we specify the sample of a gate, as `|=([a=@ b=@] (add a b))` expands to
a `$:` {% tooltip label="buccol"
href="/language/hoon/reference/rune/buc#-buccol" /%} expression for
`[a=@ b=@]`.  Otherwise, we only need these if we are building a special
type like a vector (e.g. with two components like an _x_ and a _y_).

### Structure Mode

Most Hoon expressions evaluate normally (that's what “normal” means),
what we'll call _noun mode_ (or _normal mode_).  However, sample
definitions and `+$` {% tooltip label="lusbuc"
href="/language/hoon/reference/rune/lus#-lusbuc" /%} mold specification
arms evaluate in what is called _structure mode_.  (You may occasionally
see this the older term “spec mode”.)  Structure mode expressions use a
similar syntax to regular Hoon expressions but create structure
definitions instead.

For instance, in eval mode if you use the irregular form `p=1` this is
an irregular form of the `^=` {% tooltip label="kettis"
href="/language/hoon/reference/rune/ket#-kettis" /%} rune.  This is one
way to define a variable using a `=+` {% tooltip label="tislus"
href="/language/hoon/reference/rune/tis#-tislus" /%}; these are
equivalent statements:

```hoon
> =+(hello=1 hello)
1

> =+(^=(hello 1) hello)
1
```

(Normally we have preferred `=/` {% tooltip label="tisfas"
href="/language/hoon/reference/rune/tis#-tisfas" /%} in the Hoon School
docs, but that is just for consistency.)

In a {% tooltip label="sample" href="/glossary/sample" /%} definition,
such as in a {% tooltip label="gate" href="/glossary/gate" /%}, the
statement is evaluated in structure mode; these are equivalent
statements:

```hoon {% copy=true %}
|=(hello=@ hello)

|=($=(hello @) hello)
```

There are several other subtle cases where normal mode and structure
mode diverge, but most of the time structure mode is invisible to you.
The [`$` buc runes](/language/hoon/reference/rune/buc) are typically
invoked in structure mode.
