# 16. Functional Programming

_This module will discuss some gates-that-work-on-gates and other assorted operators that are commonly recognized as functional programming tools._

Given a [gate](../../glossary/gate), you can manipulate it to accept a different number of values than its sample formally requires, or otherwise modify its behavior.  These techniques mirror some of the common tasks used in other [functional programming languages](https://en.wikipedia.org/wiki/Functional_programming) like Haskell, Clojure, and OCaml.

Functional programming, as a paradigm, tends to prefer rather mathematical expressions with explicit modification of function behavior.  It works as a formal system of symbolic expressions manipulated according to given rules and properties.  FP was derived from the [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus), a cousin of combinator calculi like [Nock](../../glossary/nock).  (See also [APL](https://en.wikipedia.org/wiki/APL_%28programming_language%29).)

##  Changing Arity

If a gate accepts only two values in its sample, for instance, you can chain together multiple calls automatically using the `;:` [miccol](../../language/hoon/reference/rune/mic#-miccol) rune.

```hoon
> (add 3 (add 4 5))
12

> :(add 3 4 5)
12

> (mul 3 (mul 4 5))
60

> :(mul 3 4 5)
60
```

This is called changing the [_arity_](https://en.wikipedia.org/wiki/Arity) of the gate.  (Does this work on [++mul:rs](../../language/hoon/reference/stdlib/3b#mulrs)?)


##  Binding the Sample

[_Currying_](https://en.wikipedia.org/wiki/Currying) describes taking a function of multiple arguments and reducing it to a set of functions that each take only one argument.  _Binding_, an allied process, is used to set the value of some of those arguments permanently.

If you have a [gate](../../glossary/gate) which accepts multiple values in the [sample](../../glossary/sample), you can fix one of these.  To fix the head of the sample (the first argument), use [++cury](../../language/hoon/reference/stdlib/2n#cury); to bind the tail, use [`++curr`](../../language/hoon/reference/stdlib/2n#curr).

Consider calculating _a x² + b x + c_, a situation we earlier resolved using a door.  We can resolve the situation differently using currying:

```hoon
> =full |=([x=@ud a=@ud b=@ud c=@ud] (add (add (mul (mul x x) a) (mul x b)) c))

> (full 5 4 3 2)
117

> =one (curr full [4 3 2])  

> (one 5)  
117
```

One can also [++cork](../../language/hoon/reference/stdlib/2n#cork) a gate, or arrange it such that it applies to the result of the next gate.  This pairs well with `;:` [miccol](../../language/hoon/reference/rune/mic#-miccol).  (There is also [++corl](../../language/hoon/reference/stdlib/2n#corl), which composes backwards rather than forwards.) This example decrements a value then converts it to `@ux` by corking two gates:

```hoon
> ((cork dec @ux) 20)  
0x13
```

### Exercise:  Bind Gate Arguments

- Create a gate `++inc` which increments a value in one step, analogous to [++dec](../../language/hoon/reference/stdlib/1a#dec).

### Exercise:  Chain Gate Values

- Write an expression which yields the parent [galaxy](../../glossary/galaxy) of a [planet's](../../glossary/planet) sponsoring [star](../../glossary/star) by composing two gates.

##  Working Across `list`s

The [++turn](../../language/hoon/reference/stdlib/2b#turn) function takes a list and a [gate](../../glossary/gate), and returns a list of the products of applying each item of the input list to the gate. For example, to add 1 to each item in a list of [atoms](../../glossary/atom):

```hoon
> (turn `(list @)`~[11 22 33 44] |=(a=@ +(a)))
~[12 23 34 45]
```
Or to double each item in a [list](../../glossary/list) of atoms:

```hoon
> (turn `(list @)`~[11 22 33 44] |=(a=@ (mul 2 a)))
~[22 44 66 88]
```
`++turn` is Hoon's version of Haskell's map.

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

[++roll](../../language/hoon/reference/stdlib/2b#roll) and [++reel](../../language/hoon/reference/stdlib/2b#reel) are used to left-fold and right-fold a [list](../../glossary/list), respectively.  To fold a list is similar to [++turn](../../language/hoon/reference/stdlib/2b#turn), except that instead of yielding a `list` with the values having had each applied, `++roll` and `++reel` produce an accumulated value.

```hoon
> (roll `(list @)`[1 2 3 4 5 ~] add)
15

> (reel `(list @)`[1 2 3 4 5 ~] mul)
120
```

### Exercise:  Calculate a Factorial

- Use `++reel` to produce a [gate](../../glossary/gate) which calculates the factorial of a number.


##  Classic Operations

Functional programmers frequently rely on three design patterns to produce operations on collections of data:

1. Map.  The Map operation describes applying a function to each item of a set or iterable object, resulting in the same final number of items transformed.  In Hoon terms, we would say slamming a gate on each member of a `list` or `set`.  The standard library arms that accomplish this include [++turn](../../language/hoon/reference/stdlib/2b#turn) for a [list](../../glossary/list), [++run:in](../../language/hoon/reference/stdlib/2h#repin) for a [set](../../language/hoon/reference/stdlib/2o#set), and [++run:by](../../language/hoon/reference/stdlib/2i#runby) for a [map](../../language/hoon/reference/stdlib/2o#map).

2. Reduce.  The Reduce operation applies a function as a sequence of pairwise operations to each item, resulting in one summary value. The standard library [arms](../../glossary/arm) that accomplish this are [++roll](../../language/hoon/reference/stdlib/2b#roll) and [++reel](../../language/hoon/reference/stdlib/2b#reel) for a [list](../../glossary/list), [++rep:in](../../language/hoon/reference/stdlib/2h#repin) for a [set](../../language/hoon/reference/stdlib/2o#set), and [++rep:by](../../language/hoon/reference/stdlib/2i#repby) for a [map](../../language/hoon/reference/stdlib/2o#map).

3. Filter.  The Filter operation applies a true/false function to each member of a collection, resulting in some number of items equal to or fewer than the size of the original set.  In Hoon, the library arms that carry this out include [++skim](../../language/hoon/reference/stdlib/2b#skim), [++skid](../../language/hoon/reference/stdlib/2b#skid), [++murn](../../language/hoon/reference/stdlib/2b#murn) for a [list](../../glossary/list), and [++rib:by](../../language/hoon/reference/stdlib/2i#ribby) for a [map](../../language/hoon/reference/stdlib/2o#map).
