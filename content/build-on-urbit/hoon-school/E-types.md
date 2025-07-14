---
description: "Guide to Hoon's type system, covering atoms with auras, molds for data structures, type-checking and type inference, core variance, nesting relationships, and type safety."
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

# 4. Molds (Types)

*This module will introduce the Hoon type system and illustrate how type checking and type inference work.*

## The Hoon Type System {#the-hoon-type-system}

Programming languages use data types to distinguish different kinds of data and associated rules. For instance, what does it mean to add 3 to the letter A?  Depending on your programming language, you could see `A3`, `D`, or an error.

Like most modern high-level programming languages, Hoon has a type system. Because Hoon is a functional programming language, its type system differs somewhat from those of non-functional languages. In this lesson we'll introduce Hoon's type system and point out some of its distinctive features. Certain advanced topics (e.g. type polymorphism) won't be addressed until a later chapter.

A type is ordinarily understood to be a set of values. Examples: the set of all atoms is a type, the set of all cells is a type, and so on.

Type systems provide type safety, in part by making sure functions produce values of the correct type. When you write a function whose product is intended to be an atom, it would be nice to know that the function is guaranteed to produce an atom. Hoon's type system provides such guarantees with _type checking_ and _type inference_.

A "type" is really a rule for interpretation. But for our Hoonish purposes, it's rather too broad a notion and we need to clarify some different kinds of things we could refer to as “type”. It is instructive for learners to distinguish three kinds of types in Hoon:

1. **Auras:** atoms with type metadata. (e.g. `0` as a `@t` is `''`)
2. **Molds:** typed nouns. Think of cells, lists, and sets.
3. **Marks:** file types. Compare to conventional files distinguished by extension and definite internal structure.

To employ a chemical metaphor, an atom is an atom; a cell is a molecule; a mold is an molecule definition, a template or structural representation; a mark is like a protein, a more complex transformation rule. **All of these are molds, or Hoon types. We are simply separating them by complexity as you learn.**

You have seen and worked with the trivial atoms and cells. We will leave marks until a later discussion of Gall agents or the Clay filesystem, which use marks to type file data. For now, we focus on molds.

This lesson will talk about atoms, cells, then molds in a general sense. We allude to several topics which will be explored in Data Structures.


## Atoms and Auras {#atoms-and-auras}

In the most straightforward sense, atoms simply are unsigned integers. But they can also be interpreted as representing signed integers, ASCII symbols, floating-point values, dates, binary numbers, hexadecimal numbers, and more. Every atom is, in and of itself, just an unsigned integer; but Hoon keeps track of type information about each atom, and this bit of metadata tells Hoon how to interpret the atom in question.

The piece of type information that determines how Hoon interprets an atom is called an aura. The set of all atoms is indicated with the symbol `@`. An aura is indicated with `@` followed by some letters, e.g., `@ud` for unsigned decimal. Accordingly, the Hoon type system does more than track sets of values. It also tracks certain other relevant metadata about how those values are to be interpreted.

How is aura information generated so that it can be tracked?  One way involves **type inference**. In certain cases Hoon's type system can infer the type of an expression using syntactic clues. The most straightforward case of type inference is for a [literal](https://en.wikipedia.org/wiki/Literal_%28computer_programming%29) expression of data, such as `0x1000` for `@ux`. Hoon recognizes the aura literal syntax and infers that the data in question is an atom with the aura associated with that syntax.

To see the inferred type of a literal expression in the Dojo, use the `?` operator. (This operator isn't part of the Hoon programming language; it's a Dojo-only tool.)

The `?` Dojo operator shows both the product and the inferred type of an expression. Let's try `?` on `15`:

```
> 15
15

> ? 15
  @ud
15
```

`@ud` is the inferred type of `15` (and of course `15` is the product). The `@` is for “atom” and the `ud` is for “unsigned decimal”. The letters after the `@` indicate the “aura” of the atom.

One important role played by the type system is to make sure that the output of an expression is of the intended data type. If the output is of the wrong type then the programmer did something wrong. How does Hoon know what the intended data type is?  The programmer must specify this explicitly by using a "cast". To cast for an unsigned decimal atom, you can use the `^-` kethep rune along with the `@ud` from above.

What exactly does the `^-` [kethep](../../hoon/rune/ket.md#kethep) rune do?  It compares the inferred type of some expression with the desired cast type. If the expression's inferred type "nests" under the desired type, then the product of the expression is returned.

Let's try one in the Dojo.

```
> ^-(@ud 15)
15
```

Because `@ud` is the inferred type of `15`, the cast succeeds. Notice that the `^-` kethep expression never does anything to modify the underlying noun of the second subexpression. It's used simply to mandate a type-check on that expression. This check occurs at compile-time (when the expression is compiled to Nock).

What if the inferred type doesn't fit under the cast type?  You will see a "nest-fail" crash at compile-time:

```
> ^-(@ud [13 14])
nest-fail
[crash message]
```

Why "nest-fail"?  The inferred type of `[13 14]` doesn't nest under the cast type `@ud`. It's a cell, not an atom. But if we use the symbol for nouns, `*`, then the cast succeeds:

```
> ^-(* [13 14])
[13 14]
```

A cell of atoms is a noun, so the inferred type of `[13 14]` nests under `*`. Every product of a Hoon expression nests under `*` because every product is a noun.

### What Auras are There? {#what-auras-are-there}

Hoon has a wide (but not extensible) variety of atom literal syntaxes. Each literal syntax indicates to the Hoon type checker which predefined aura is intended. Hoon can also pretty-print any aura literal it can parse. Because atoms make great path nodes and paths make great URLs, all regular atom literal syntaxes use only URL-safe characters. The pretty-printer is convenient when you are used to it, but may surprise you occasionally as a learner.

Here's a non-exhaustive list of auras, along with examples of corresponding literal syntax:

| Aura   | Meaning                      | Example Literal Syntax |
|:-------|:-----------------------------|:-----------------------|
| `@d`   | date                         | no literal |
| `@da`  | absolute date                | `~2018.5.14..22.31.46..1435` |
| `@dr`  | relative date (ie, timespan) | `~h5.m30.s12` |
| `@p`   | phonemic base (ship name)    | `~sampel-palnet` |
| `@r`   | [IEEE-754](https://en.wikipedia.org/wiki/IEEE_754) floating-point |  |
| `@rd`  | double precision  (64 bits)  | `.~6.02214085774e23` |
| `@rh`  | half precision (16 bits)     | `.~~3.14` |
| `@rq`  | quad precision (128 bits)    | `.~~~6.02214085774e23` |
| `@rs`  | single precision (32 bits)   | `.6.022141e23` |
| `@s`   | signed integer, sign bit low | no literal |
| `@sb`  | signed binary                | `--0b11.1000` |
| `@sd`  | signed decimal               | `--1.000.056` |
| `@sv`  | signed base32                | `-0v1df64.49beg` |
| `@sw`  | signed base64                | `--0wbnC.8haTg` |
| `@sx`  | signed hexadecimal           | `-0x5f5.e138` |
| `@t`   | UTF-8 text (`$cord`)          | `'howdy'` |
| `@ta`  | ASCII text (subset) (`$knot`)          | `~.howdy` |
| `@tas` | ASCII text symbol (subset) (`$term`)   | `%howdy` |
| `@u`   | unsigned integer             | no literal |
| `@ub`  | unsigned binary              | `0b11.1000` |
| `@ud`  | unsigned decimal             | `1.000.056` |
| `@uv`  | unsigned base32              | `0v1df64.49beg` |
| `@uw`  | unsigned base64              | `0wbnC.8haTg` |
| `@ux`  | unsigned hexadecimal         | `0x5f5.e138` |

Some of these auras nest under others. For example, `@u` is for all unsigned auras. But there are other, more specific auras; `@ub` for unsigned binary numbers, `@ux` for unsigned hexadecimal numbers, etc. (For a more complete list of auras, see [Auras](../../hoon/auras.md).)

Note that `$knot` and `$term` values each use a URL-safe subset of ASCII which excludes characters like spaces.

### Aura Inference in Hoon {#aura-inference-in-hoon}

Let's work a few more examples in the Dojo using the `?` operator. We'll focus on just the unsigned auras for now:

```
> 15
15

> ? 15
  @ud
15

> 0x15
0x15

> ? 0x15
  @ux
0x15
```

When you enter just `15`, the Hoon type checker infers from the syntax that its aura is `@ud` because you typed an unsigned integer in decimal notation. Hence, when you use `?` to check the aura, you get `@ud`.

And when you enter `0x15` the type checker infers that its aura is `@ux`, because you used `0x` before the number to indicate the unsigned hexadecimal literal syntax. In both cases, Hoon pretty-prints the appropriate literal syntax by using inferred type information from the input expression; the Dojo isn't (just) echoing what you enter.

More generally: for each atom expression in Hoon, you can use the literal syntax of an aura to force Hoon to interpret the atom as having that aura type. For example, when you type `~sampel-palnet` Hoon will interpret it as an atom with aura `@p` and treat it accordingly.

Here's another example of type inference at work:

```
> (add 15 15)
30

> ? (add 15 15)
  @
30

> (add 0x15 15)
36

> ? (add 0x15 15)
  @
36
```

The [`+add`](../../hoon/stdlib/1a.md#add) function in the Hoon standard library operates on all atoms, regardless of aura, and returns atoms with no aura specified. Hoon isn't able to infer anything more specific than `@` for the product of `+add`. This is by design, however. Notice that when you `+add` a decimal and a hexadecimal above, the correct answer is returned (pretty-printed as a decimal). This works for all of the unsigned auras:

```
> (add 100 0b101)
105

> (add 100 0xf)
115

> (add 0b1101 0x11)
30
```

The reason these add up correctly is that unsigned auras all map directly to the 'correct' atom underneath. For example, `16`, `0b1.0000`, and `0x10` are all the exact same atom, just with different literal syntax. (This doesn't hold for signed versions of the auras!)


## Cells {#cells}

Let's move on to consider cells. For now we'll limit ourselves to simple cell types made up of various atom types.

### Generic Cells {#generic-cells}

The `^` ("ket") symbol is used to indicate the type for cells (i.e., the set of all cells). We can use it for casting as we did with atom auras, like `@ux` and `@t`:

```
> ^-(^ [12 13])
[12 13]

> ^-(^ [[12 13] 14])
[[12 13] 14]

> ^-(^ [[12 13] [14 15 16]])
[[12 13] [14 15 16]]

> ^-(^ 123)
nest-fail

> ^-(^ 0x10)
nest-fail
```

If the expression to be evaluated produces a cell, the cast succeeds; if the expression evaluates produces an atom, the cast fails with a nest-fail crash.

The downside of using `^` for casts is that Hoon will infer only that the product of the expression is a cell of nouns; `^` tells the compiler nothing about the contents of the cell.

```
> ? ^-(^ [12 13])
  [* *]
[12 13]

> ? ^-(^ [[12 13] 14])
  [* *]
[[12 13] 14]

> ? ^-(^ [[12 13] [14 15 16]])
  [* *]
[[12 13] [14 15 16]]
```

When we use the `?` operator to see the type inferred by Hoon for the expression, in all three of the above cases the same thing is returned: `[* *]`. The `*` ("tar") symbol indicates the type for any noun, and the square brackets indicate a cell. Every cell in Hoon is a cell of nouns; remember that cells are defined as pairs of nouns.

Yet the cell `[[12 13] [14 15 16]]` is a bit more complex than the cell `[12 13]`. Can we use the type system to distinguish them?  Yes.

### Getting More Specific {#getting-more-specific}

What if you want to cast for a particular kind of cell?  You can use square brackets when casting for a specific cell type. For example, if you want to cast for a cell in which the head and the tail must each be an atom, then simply cast using `[@ @]`:

```
> ^-([@ @] [12 13])
[12 13]

> ? ^-([@ @] [12 13])
  [@ @]
[12 13]

> ^-([@ @] 12)
nest-fail

> ^-([@ @] [[12 13] 14])
nest-fail
```

The `[@ @]` cast accepts any expression that evaluates to a cell with exactly two atoms, and crashes with a [nest-fail](../../hoon/hoon-errors.md#nest-fail) error for any expression that evaluates to something different. The expression `12` doesn't evaluate to a cell; and while the expression `[[12 13] 14]` does evaluate to a cell, the left-hand side isn't an atom, but is instead another cell.

You can get even more specific about the kind of cell you want by using atom auras:

```
> ^-([@ud @ux] [12 0x10])
[12 0x10]

> ^-([@ub @ux] [0b11 0x10])
[0b11 0x10]

> ? ^-([@ub @ux] [0b11 0x10])
  [@ub @ux]
[0b11 0x10]

> ^-([@ub @ux] [12 13])
nest-fail
```

You are also free to embed more square brackets to indicate cells within cells:

```
> ^-([[@ud @sb] @ux] [[12 --0b1101] 0xdead.beef])
[[12 --0b1101] 0xdead.beef]

> ? ^-([[@ud @sb] @ux] [[12 --0b1101] 0xdead.beef])
  [[@ud @sb] @ux]
[[12 --0b1101] 0xdead.beef]

> ^-([[@ @] @] [12 13])
nest-fail
```

You can also be highly specific with certain parts of the type structure, leaving other parts more general. Keep in mind that when you do this, Hoon's type system will infer a general type from the general part of the cast. Type information may be thrown away:

```
> ^-([^ @ux] [[12 --0b1101] 0xdead.beef])
[[12 26] 0xdead.beef]

> ? ^-([^ @ux] [[12 --0b1101] 0xdead.beef])
  [[* *] @ux]
[[12 26] 0xdead.beef]

> ^-(* [[12 --0b1101] 0xdead.beef])
[[12 26] 3.735.928.559]

> ? ^-(* [[12 --0b1101] 0xdead.beef])
  *
[[12 26] 3.735.928.559]
```

Because every piece of Hoon data is a noun, everything nests under `*`. When you cast to `*` you can see the raw noun with cells as brackets and atoms as unsigned integers.


## Molds {#molds}

A mold is a template or rule for identifying actual type structures. **Molds are actually gates, meaning that they operate on a value to coerce it to a particular structure.** Technically, a mold is a function from a noun to a noun. What this means is that we can use a mold to coerce any noun into a typed value; if this gate fails, then the mold crashes.

```
> (^ [1 2])
[1 2]

> (@ [1 2])
dojo: hoon expression failed

> `@`[1 2]
mint-nice
-need.@
-have.[@ud @ud]
nest-fail
dojo: hoon expression failed
```

We commonly need to do one of two things with a mold:

1. Validate the shape of a noun. (Or, "clam" the noun in Hoon developer parlance.)
    
```
> (@ux 0x1000)
0x1000

> (@ux [1 2])
dojo: hoon expression failed
```

2. Produce an example value (bunt).

We often use bunts (default value of a type) to clam; for example, `@ud` implicitly uses the `@ud` default value (`0`) as the type specimen which the computation must match.

To _actually_ get the bunt value, use the `^*` [kettar](../../hoon/rune/ket.md#kettar) rune, almost always used in its irregular form `*`

```
> ^*  @ud
0

> ^*  @da
~2000.1.1

> *@da
~2000.1.1

> *[@ud @ux @ub]
[0 0x0 0b0]
```

One more way to validate against type is to use an example instead of the extracted mold. This uses the `^+` [ketlus](../../hoon/rune/ket.md#ketlus) rune similarly to how we used `^-` [kethep](../../hoon/rune/ket.md#kethep) previously:

```hoon
^+(1.000 100)
```

(This is what `^-` is actually doing: `^-(p q)` reduces to `^+(^*(p) q)`. Many runes we use actually reduce to other rune forms, and have been introduced for ease of use.)

We can use more complex structures for molds though, including built-in types like lists and tapes. (A `$tape` represents text.)

```hoon
`(list @)`[104 101 108 108 111 32 77 97 114 115 33 ~]
`tape``(list @)`[104 101 108 108 111 32 77 97 114 115 33 ~]

`(list @)`[144 57 195 46 200 165 186 88 118 99 ~]
`(list @p)``(list @)`[144 57 195 46 200 165 186 88 118 99 ~]
```

(Sometimes you see a `%bad-text` when using `$tape`s, which means that you've tried to convert a number into text which isn't text. More on `$tape`s in the lesson on trees.)

Why does this mold conversion fail? What do we need to do in order to make it succeed?

 ```hoon
 `(list @ux)`[1 2 3 ~]
 ```

We can have more complex molds as well:

```hoon
::  [[from-ship to-ship] points]
[[@p @p] @ud]
```

Most of the time, we will define such complex types using specific runes and “mold builder” tools. Thus a `+list` mold needs an associated type `(list @)` to correctly denote the data type.

### Identifying Molds {#identifying-molds}

Besides `?` (which is a Dojo-specific tool), the programmatic way to figure out which mold the Hoon compiler thinks something is to use the `!>` [zapgar](../../hoon/rune/zap.md#zapgar) rune.

```hoon
> !>(0xace2.bead)
[#t/@ux q=2.900.541.101]
```

For reasons which will be elaborated in the lesson on trees, this is often employed as the so-called “type spear” `-:!>`:

```
> -:!>(0xace2.bead)
#t/@ux
```

### Type Unions {#type-unions}

The `$?` [bucwut](../../hoon/rune/buc.md#bucwut) rune forms a type union. Most commonly these are used with types having different structures, such as an atom and a cell.

For instance, if you wanted a gate to accept an atom of an unsigned aura type, but no other type, you could define a type union thus:

```hoon
$?  [@ud @ux @ub ~]
```

and use it in a gate:

```hoon
|=  [n=$?(@ud @ux @ub)]
(add n 1)
```

```
> (foo 4)  
5  
> (foo 0x5)  
6  
> (foo 0b110)  
7  
> (foo ~zod)  
-need.?(@ub @ud @ux)  
-have.@p  
nest-fail  
dojo: hoon expression failed
```

Unfortunately, type unions of atoms are not helpful in filtering over produced values (with `^-` kethep), as they default to the type of the last value in the union. So the type union `$?(@ (list @))` distinguishes an atom and a list, but `(list $?(@ud @sd))` does not successfully produce a list distinguishing both types.

The irregular form of `$?` looks like this:

```hoon
?(@ud @ux @ub)
```

Type unions are mainly helpful when you need to match something that can have multiple options. We will use them extensively with `@tas` terms, such as `?(%red %green %blue)` which would only admit one of those three tags.
