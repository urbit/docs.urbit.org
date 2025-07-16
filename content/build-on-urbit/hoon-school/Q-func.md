---
description: "Functional programming concepts in Hoon, including gate manipulation, currying and binding samples, changing arity, function composition with cork and corl, and working with lists."
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

# 16. Functional Programming

_This module will discuss some gates-that-work-on-gates and other assorted operators that are commonly recognized as functional programming tools._

Given a gate, you can manipulate it to accept a different number of values than its sample formally requires, or otherwise modify its behavior. These techniques mirror some of the common tasks used in other [functional programming languages](https://en.wikipedia.org/wiki/Functional_programming) like Haskell, Clojure, and OCaml.

Functional programming, as a paradigm, tends to prefer rather mathematical expressions with explicit modification of function behavior. It works as a formal system of symbolic expressions manipulated according to given rules and properties. FP was derived from the [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus), a cousin of combinator calculi like Nock. (See also [APL](https://en.wikipedia.org/wiki/APL_%28programming_language%29).)

## Changing Arity {#changing-arity}

If a gate accepts only two values in its sample, for instance, you can chain together multiple calls automatically using the `;:` [miccol](../../hoon/rune/mic.md#miccol) rune.

```
> (add 3 (add 4 5))
12

> :(add 3 4 5)
12

> (mul 3 (mul 4 5))
60

> :(mul 3 4 5)
60
```

This is called changing the [_arity_](https://en.wikipedia.org/wiki/Arity) of the gate. (Does this work on [`+mul:rs`](../../hoon/stdlib/3b.md#mulrs)?)


## Binding the Sample {#binding-the-sample}

["Currying"](https://en.wikipedia.org/wiki/Currying) describes taking a function of multiple arguments and reducing it to a set of functions that each take only one argument. "Binding", an allied process, is used to set the value of some of those arguments permanently.

If you have a gate which accepts multiple values in the sample, you can fix one of these. To fix the head of the sample (the first argument), use [`+cury`](../../hoon/stdlib/2n.md#cury); to bind the tail, use [`+curr`](../../hoon/stdlib/2n.md#curr).

Consider calculating _a x² + b x + c_, a situation we earlier resolved using a door. We can resolve the situation differently using currying:

```
> =full |=([x=@ud a=@ud b=@ud c=@ud] (add (add (mul (mul x x) a) (mul x b)) c))

> (full 5 4 3 2)
117

> =one (curr full [4 3 2])  

> (one 5)  
117
```

One can also [`+cork`](../../hoon/stdlib/2n.md#cork) a gate, or arrange it such that it applies to the result of the next gate. This pairs well with `;:` [miccol](../../hoon/rune/mic.md#miccol). (There is also [`+corl`](../../hoon/stdlib/2n.md#corl), which composes backwards rather than forwards.) This example decrements a value then converts it to `@ux` by corking two gates:

```
> ((cork dec @ux) 20)  
0x13
```

### Exercise: Bind Gate Arguments {#exercise-bind-gate-arguments}

Create a gate `+inc` which increments a value in one step, analogous to [`+dec`](../../hoon/stdlib/1a.md#dec).

### Exercise: Chain Gate Values {#exercise-chain-gate-values}

Write an expression which yields the parent galaxy of a planet's sponsoring star by composing two gates.

## Working Across `+list`s {#working-across-lists}

The [`+turn`](../../hoon/stdlib/2b.md#turn) function takes a list and a gate, and returns a list of the products of applying each item of the input list to the gate. For example, to add 1 to each item in a list of atoms:

```
> (turn `(list @)`~[11 22 33 44] |=(a=@ +(a)))
~[12 23 34 45]
```
Or to double each item in a list of atoms:

```
> (turn `(list @)`~[11 22 33 44] |=(a=@ (mul 2 a)))
~[22 44 66 88]
```
`+turn` is Hoon's version of Haskell's `+map`.

We can rewrite the Caesar cipher program using turn:

```hoon
|=  [a=@ b=tape]
^-  tape
?:  (gth a 25)
  $(a (sub a 26))
%+  turn  b
|=  c=@tD
?:  &((gte c 'A') (lte c 'Z'))
  =.  c  (add c a)
  ?.  (gth c 'Z')  c
  (sub c 26)
?:  &((gte c 'a') (lte c 'z'))
  =.  c  (add c a)
  ?.  (gth c 'z')  c
  (sub c 26)
c
```

[`+roll`](../../hoon/stdlib/2b.md#roll) and [`+reel`](../../hoon/stdlib/2b.md#reel) are used to left-fold and right-fold a list, respectively. To fold a list is similar to [`+turn`](../../hoon/stdlib/2b.md#turn), except that instead of yielding a `+list` with the values having had each applied, `+roll` and `+reel` produce an accumulated value.

```
> (roll `(list @)`[1 2 3 4 5 ~] add)
15

> (reel `(list @)`[1 2 3 4 5 ~] mul)
120
```

### Exercise: Calculate a Factorial {#exercise-calculate-a-factorial}

Use `+reel` to produce a gate which calculates the factorial of a number.


## Classic Operations {#classic-operations}

Functional programmers frequently rely on three design patterns to produce operations on collections of data:

1. Map. The Map operation describes applying a function to each item of a set or iterable object, resulting in the same final number of items transformed. In Hoon terms, we would say slamming a gate on each member of a `+list` or `+set`. The standard library arms that accomplish this include [`+turn`](../../hoon/stdlib/2b.md#turn) for a list, [`+run:in`](../../hoon/stdlib/2h.md#repin) for a [`+set`](../../hoon/stdlib/2o.md#set), and [`+run:by`](../../hoon/stdlib/2i.md#runby) for a [`+map`](../../hoon/stdlib/2o.md#map).

2. Reduce. The Reduce operation applies a function as a sequence of pairwise operations to each item, resulting in one summary value. The standard library arms that accomplish this are [`+roll`](../../hoon/stdlib/2b.md#roll) and [`+reel`](../../hoon/stdlib/2b.md#reel) for a list, [`+rep:in`](../../hoon/stdlib/2h.md#repin) for a [`+set`](../../hoon/stdlib/2o.md#set), and [`+rep:by`](../../hoon/stdlib/2i.md#repby) for a [`+map`](../../hoon/stdlib/2o.md#map).

3. Filter. The Filter operation applies a true/false function to each member of a collection, resulting in some number of items equal to or fewer than the size of the original set. In Hoon, the library arms that carry this out include [`+skim`](../../hoon/stdlib/2b.md#skim), [`+skid`](../../hoon/stdlib/2b.md#skid), [`+murn`](../../hoon/stdlib/2b.md#murn) for a list, and [`+rib:by`](../../hoon/stdlib/2i.md#ribby) for a [`+map`](../../hoon/stdlib/2o.md#map).
