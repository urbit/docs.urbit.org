+++
title = "lib/list"
weight = 7
+++

Arms to rename kernel list functions with different names.

This file is not subject to kelvin versioning and the interface should
not be considered official.

To avoid shadowing the name `list`, import as `/+  *list`.

## `++after`

Suffix

Accepts an atom `a` and list `b`, producing the remaining elements from `b` starting at `a`. Alias for [`++slag`](/language/hoon/reference/stdlib/2b#slag)

#### Accepts

`a` is an atom.

`b` is an list.

#### Produces

A list of the same type as `b`



## `++and-each`

Logical "and" on list.

Computes the Boolean logical "and" on the results of gate `b` applied to each individual element in list `a`. Alias for [`++levy`](/language/hoon/reference/stdlib/2b#levy)

#### Accepts

`a` is a list.

`b` is a gate.

#### Produces

A boolean.


## `++any-each`


Logical "or" on list

Computes the Boolean logical "or" on the results of applying `gate` `b` to every element of `++list` `a`. Alias for [`++lien`](/language/hoon/reference/stdlib/2b#lien)

#### Accepts

`a` is a list.

`b` is a gate.

#### Produces

A boolean.



## `++append`

Accepts a `++list` `a` and a noun `b`, producing the list of `b` appended to `a`. Alias for [`++snoc`](/language/hoon/reference/stdlib/2b#snoc)

#### Accepts

`a` is a list.

`b` is a noun.

#### Produces

Produces a list of `b` appended to `a`.

## `++apply`

Gate to list

Accepts a `++list` `a` and a gate `b`. Produces a list with the gate applied
to each element of the original list. Alias for [`++turn`](/language/hoon/reference/stdlib/2b#turn)

#### Accepts

`a` is a list.

`b` is a gate.

#### Produces

A list.


## `++before`

Prefix

Accepts an atom `a` and `list` `b`, producing the first `a` elements of
the front of the list. Alias for [`++scag`](/language/hoon/reference/stdlib/2b#scag)

#### Accepts

`a` is an atom.

`b` is a list.

#### Produces

A list of the same type as `b`.


##  `++concat`

Concatenate two `++list`s `a` and `b`. Alias for [`++weld`](/language/hoon/reference/stdlib/2b#weld)

#### Accepts

`a` and `b` are lists.


##  `++except`

Cycles through the members of `list` `a`, passing them to a gate `b`.
Produces a list of all of the members that produce `%.n`. Inverse of
`++filter`. Alias for [`++skip`](/language/hoon/reference/stdlib/2b#skip)

#### Accepts

`a` is a list.

`b` is a gate that accepts one argument and produces a flag.

#### Produces

A list of the same type as `a`.



##  `++filter`


Cycles through the members of a list `a`, passing them to a gate `b` and
producing a list of all of the members that produce `%.y`. Inverse of
`++except`. Alias for [`++skim`](/language/hoon/reference/stdlib/2b#skim)

#### Accepts

`a` is a list.

`b` is a gate that accepts one argument and produces a boolean.

#### Produces

A list.


## `++find-all`

All indices in `list`

Produces the indices of all occurrences of `nedl` in `hstk` as a `list` of
atoms. Alias for [`++fand`](/language/hoon/reference/stdlib/2b#fand)

#### Accepts

`nedl` is a list.

`hstk` is a list.

#### Produces

A `list`.


##  `++flatten`

Turns a `++list` of lists into a single list by promoting the elements of
each sublist into the higher. Alias for [`++zing`](/language/hoon/reference/stdlib/2b#zing)

#### Accepts

A list of lists.

#### Produces

A list.



## `++fold-l`

Left fold

Left fold: moves left to right across a list `a`, recursively slamming a
binary gate `b` with an element from the `list` and an accumulator,
producing the final value of the accumulator. Alias for [`++roll`](/language/hoon/reference/stdlib/2b#roll)

#### Accepts

`a` is a list.

`b` is a binary gate.

#### Produces

The accumulator, which is a noun.




## `++fold-r`

Right fold

Right fold: moves right to left across a `list` `a`, recursively slamming
a binary gate `b` with an element from `a` and an accumulator, producing
the final value of the accumulator. Alias for [`++reel`](/language/hoon/reference/stdlib/2b#reel)

#### Accepts

`a` is a list.

`b` is a binary gate.

#### Produces

The accumulator, which is a noun.



##  `++insert`

Insert item at index

Accepts a `list` `a`, an atom `b`, and a noun `c`, producing the list of `a` with the item `c` inserted at index `b`. Alias for [`++into`](/language/hoon/reference/stdlib/2b#into)

#### Accepts

`a` is a list.

`b` is a atom.

`c` is a noun.

#### Produces

the list of `a` with the item `c` inserted at index `b`.



## `++item`

Index

Accepts an atom `a` and a `++list` `b`, producing the element at the index
of `a`and failing if the list is null. Lists are 0-indexed.  Alias for [`++snag`](/language/hoon/reference/stdlib/2b#snag)

#### Accepts

`a` is an atom.

`b` is a list.

#### Produces

Produces an element of `b`, or crashes if no element exists at that index.


## `++length`

List length

Produces the length of any `list` `a` as an atom.  Alias for [`++lent`](/language/hoon/reference/stdlib/2b#lent)

#### Accepts

`a` is a `list`.

#### Produces

An atom.



## `++maybe`

Maybe transform

Passes each member of `list` `a` to gate `b`, which must produce a
`unit`. Produces a new list with all the results that do not produce
`~`. Alias for [`++murn](/language/hoon/reference/stdlib/2b#murn)

#### Accepts

`a` is a list.

`b` is a gate that produces a unit.

#### Produces

A list.


## `++range`

List from range

Produces a `list` composed of each consecutive integer starting from `a` and
ending with `b`. `a` and `b` are themselves included. Alias for [`++gulf](/language/hoon/reference/stdlib/2b#gulf)

#### Accepts

`a` is an atom.

`b` is an atom.

#### Produces

a `list`.


## `++remove`

Remove

Removes elements from list `c` beginning at inclusive index `a`, removing `b`
number of elements. Alias for [`++oust](/language/hoon/reference/stdlib/2b#oust)

#### Accepts

`c` is a list.

#### Produces

A `++list`.


## `++repeat`

Replicate

Replicate: produces a `list` containing `a` copies of `b`. Alias for [`++reap](/language/hoon/reference/stdlib/2b#reap)

#### Accepts

`a` is an atom.

`b` is a noun.

#### Produces

A list.


## `++reverse`

Produces the `list` `a` in reverse order. Alias for [`++flop] (/language/hoon/reference/stdlib/2b#flop)

#### Accepts

`a` is a `list`.

#### Produces

A `list`.


## `++split-at`

Separates a `list` `a` into two lists - Those elements of `a` who produce
true when slammed to gate `b` and those who produce `%.n`.

(To "slam" means to call a gate and give it a sample/samples. In this instance,
`a` is the list of samples that are given to the gate `b`.)

Alias for [`++skid] (/language/hoon/reference/stdlib/2b#skid)

#### Accepts

`a` is a list.

`b` is a gate that accepts one argument and produces a flag.

#### Produces

A cell of two lists.


## `++substring`

Similar to `substr` in Javascript: extracts a string infix, beginning at
inclusive index `a`, producing `b` number of characters. Alias for [`++swag] (/language/hoon/reference/stdlib/2b#swag)


#### Accepts

`a` is an atom.

`b` is an atom.

`c` is a list.



## `++swap`

Replace item at index

Accepts a `list` `a`, an atom `b`, and a noun `c`, producing the list of `a` with the item at index `b` replaced with `c`. Alias for [`++snap] (/language/hoon/reference/stdlib/2b#snap)

#### Accepts

`a` is a list.

`b` is a atom.

`c` is a noun.

#### Produces

the list of `a` with the item at index `b` replaced with `c`.