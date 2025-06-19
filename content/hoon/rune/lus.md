---
description: "Reference for the arm rune family used to define functions and other named expressions in cores, including normal computations, structure definitions, and constructors."
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

# + lus · Arms

A core is a cell of `[battery payload]`. The battery is made of one or more arms, each of which is a computation on its parent core.

Arm runes are used to define arms in a core, and thus can only be used from within an expression that produces a multi-arm core. That means arm runes cannot be used to mark the beginning of a first-class expression -- there is no such thing in Hoon as an arm without a core.

There are various arm runes you can use to produce different kinds of arms. Normal arms use `++`; arms defining a structure (or 'mold') use `+$`; and constructor arms use `+*`.

## +| "lusbar" {#lusbar}

Chapter label (not useful)

#### Syntax

One argument, fixed.

| Tall form   | Wide form | Irregular form |
|-------------|-----------|----------------|
| `+\| %label` | None      | None           |

#### Discussion

The `+|` doesn't produce an arm. It instead provides a label for the arms that follow it. The arms of a core can be divided into **chapters** for 'organization'. Chapter labels aren't part of the underlying noun of the core; they're stored as type system metadata only.

See [`tome`](../stdlib/4o.md#tome) in the Hoon standard library.

**Note:** The `+|` rune has little practical utility. Chapter labels cannot be referenced short of manually processing the `$type` of a core.

#### Examples

Let's look at what the Hoon compiler's parser, `ream`, does with the `+|` rune:

```
> (ream '|%  +|  %numbers  ++  two  2  ++  three  3  --')
[ %brcn
  p=~
    q
  { [ p=%numbers
      q=[p=~ q={[p=%three q=[%sand p=%ud q=3]] [p=%two q=[%sand p=%ud q=2]]}]
    ]
  }
]
```

Notice that `p.q` has the label `%numbers`. Contrast with:

```
> (ream '|%  ++  two  2  ++  three  3  --')
[ %brcn
  p=~
    q
  { [ p=%$
      q=[p=~ q={[p=%three q=[%sand p=%ud q=3]] [p=%two q=[%sand p=%ud q=2]]}]
    ]
  }
]
```

---

## +$ "lusbuc" {#lusbuc}

Produce a structure arm (type definition).

#### Syntax

Two arguments, fixed.

| Tall form            | Wide form | Irregular form |
|----------------------|-----------|----------------|
| `+$  p=term  q=spec` | None      | None           |

`p` is an arm name, and `q` is any structure expression.

#### Discussion

Arms produced by `+$` are essentially type definitions. They should be used when one wants to define custom types using core arms.

The Hoon subexpression, `q`, must be a structure expression. That is, it must be either a basic structure expression (`*`, `~`, `^`, `?`, and `@`), or a complex expression made with the `$` family of runes (including irregular variants). Names of structures are also permitted (e.g., `tape`).

#### Examples

```
> =c |%
       +$  atom-pair  $:(@ @)
       +$  flag-atom  $:(? @)
     --

> `atom-pair.c`[12 14]
[12 14]

> `atom-pair.c`[12 [22 33]]
nest-fail

> `flag-atom.c`[& 22]
[%.y 22]
```

---

## ++ "luslus" {#luslus}

Produce a normal arm.

#### Syntax

Two arguments, fixed.

| Tall form            | Wide form | Irregular form |
|----------------------|-----------|----------------|
| `++  p=term  q=hoon` | None      | None           |

`p` is the arm name, and `q` is any Hoon expression.

#### Discussion

All arms must have a name (e.g., `add`). An arm is computed by name resolution. (This resolution is implicit in the case of `$` arms. See `|=`, `|-`, and `|^`.) The `++` rune is used for explicitly giving a name to an arm.

Any Hoon expression, `q`, may be used to define the arm computation.

#### Examples

```
> =c |%
       ++  two  2
       ++  increment  |=(a=@ +(a))
     --

> two.c
2

> (increment.c 11)
12
```

---

## +* "lustar" {#lustar}

Defines deferred expressions within doors.

#### Syntax

Arguments: A variable number of pairs.

{% tabs %}

{% tab title="Tall form" %}

```hoon
+*  a=term  b=hoon
    c=term  d=hoon
    ...
    e=term  f=hoon
```

{% endtab %}

{% tab title="Wide form" %}

None

{% endtab %}

{% tab title="Irregular form" %}

None

{% endtab %}

{% endtabs %}

`a`, `c`, `e` are arm names and `b`, `d`, `f` are any Hoon expression. Note that unlike all other runes with a variable number of arguments, the list of arguments of `+*` does not end with a terminator.

`+*` arms must always come at the beginning of the battery, before any other type of lus arm.

#### Discussion

The primary use of `+*` is to create deferred expressions within doors (see Examples below). This is a name for an expressions that will be evaluated in each place the name is dereferenced. This is a similar concept to aliases or macros, but there are some subtle but important differences. Deferred expressions given by `+*` do not count towards the number of arms in the door and thus are also called "virtual arms", which can be important for things like Gall agent cores that require a fixed number of arms.

Under the hood, `+*` gets compiled as [`=*`'s](tis.md#tistar) (see here for more discussion on deferred expressions). `+* foo bar` rewrites each `++` arm beneath it in the core to include `=* foo bar`. For example, the interpreter sees the Nock compiled from this Hoon expression

```hoon
|_  z=@ud
+*  n  1
++  x  (add z n)
++  y  (sub z n)
--
```

as being identical the Nock compiled from this one:

```hoon
=|  z=@ud
|%
++  x
  =*  n  1
  (add z n)
++  y
  =*  n  1
  (sub z n)
--
```

#### Examples

To assign an alias to a door, we often write the following.

```hoon
|_  foo
+*  this  .
```

This is the idomatic way to assign the alias `this` to the door.

Sometimes cores, such as Gall app cores, have a fixed number of arms, but you'd like to include more. This is where aliases employed as "virtual arms" may be of use. We note that it is often better style to compose cores with `=>` or `=<` to add more arms to a Gall app core. This usage of `+*` is controversial and should be minimized.

```hoon
|_  =bowl:gall
+*  this  .
    samp  +<
    cont  +>
```

This assigns the door the alias `this`, the sample of the door `samp`, and the context of the door `cont`.

You may also call functions with `+*` by making use of e.g. the `%~` rune.

```hoon
=<
  |_  a=@
  +*  do   ~(. +> a)
  ++  stuff  foo:do
::etc
--
|_  b=@
++  foo  %bar
::etc
--
```
