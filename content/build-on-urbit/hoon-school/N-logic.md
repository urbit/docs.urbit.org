---
description: "Guide to conditional logic in Hoon, covering loobean (boolean) values, logical operators (AND, OR, NOT), conditional branching, switch statements, and pattern matching."
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

# 13. Conditional Logic

_Although you've been using various of the `?`_ [_wut_](../../hoon/rune/wut.md) _runes for a while now, let's wrap up some loose ends. This module will cover the nature of loobean logic and the rest of the `?` wut runes._

## Loobean Logic <a href="#loobean-logic" id="loobean-logic"></a>

Throughout Hoon School, you have been using `%.y` and `%.n`, often implicitly, every time you have asked a question like `?: =(5 4)`. The `=()` expression returns a loobean, a member of the type union `?(%.y %.n)`. (There is a proper aura `@f` but unfortunately it can't be used outside of the compiler.) These can also be written as `&` (`%.y`, true) and `|` (`%.n`, false), which is common in older code but should be avoided for clarity in your own compositions.

What are the actual values of these, _sans_ formatting?

```
> `@`%.y
0

> `@`%.n
1
```

## Noun Equality <a href="#noun-equality" id="noun-equality"></a>

The most fundamental comparison in Hoon is provided by `.=` [dottis](../../hoon/rune/dot.md#dottis), a test for equality of two nouns using Nock 5. This is almost always used in its irregular form of `=` tis.

```
> =(0 0)
%.y

> =('a' 'b')
%.n
```

Since Nock is unaware of the Hoon metadata type system, only bare atoms in the nouns are compared. If you need to compare include type information, create vases with `!>` [zapgar](../../hoon/rune/zap.md#zapgar).

```
> =('a' 97)
%.y

> =(!>('a') !>(97))
%.n
```

## Making Choices <a href="#making-choices" id="making-choices"></a>

You are familiar in everyday life with making choices on the basis of a decision expression. For instance, you can compare two prices for similar products and select the cheaper one for purchase.

Essentially, we have to be able to decide whether or not some value or expression evaluates as `%.y` true (in which case we will do one thing) or `%.n` false (in which case we do another). Some basic expressions are mathematical, but we also check for existence, for equality of two values, etc.

* [`+gth`](../../hoon/stdlib/1a.md#gth) (greater than `>`)
* [`+lth`](../../hoon/stdlib/1a.md#lth) (less than `<`)
* [`+gte`](../../hoon/stdlib/1a.md#gte) (greater than or equal to `≥`)
* [`+lte`](../../hoon/stdlib/1a.md#lte) (less than or equal to `≤`)
* `.=` [dottis](../../hoon/rune/dot.md#dottis), irregularly `=()` (check for equality)

The key conditional decision-making rune is `?:` [wutcol](../../hoon/rune/wut.md#wutcol), which lets you branch between an `expression-if-true` and an "expression-if-false". `?.` [wutdot](../../hoon/rune/wut.md#wutdot) inverts the order of `?:`. Good Hoon style prescribes that the heavier branch of a logical expression should be lower in the file.

There are also two long-form decision-making runes, which we will call [_switch statements_](https://en.wikipedia.org/wiki/Switch_statement) by analogy with languages like C.

`?-` [wuthep](../../hoon/rune/wut.md#wuthep) lets you choose between several possibilities, as with a type union. Every case must be handled and no case can be unreachable.

Since `@tas` terms are constants first, and not `@tas` unless marked as such, `?-` [wuthep](../../hoon/rune/wut.md#wuthep) switches over term unions can make it look like the expression is branching on the value. It's actually branching on the _type_. These are almost exclusively used with term type unions.

```hoon
|=  p=?(%1 %2 %3)
?-  p
  %1  1
  %2  2
  %3  3
==
```

`?+` [wutlus](../../hoon/rune/wut.md#wutlus) is similar to `?-` but allows a default value in case no branch is taken. Otherwise these are similar to `?-` [wuthep](../../hoon/rune/wut.md#wuthep) switch statements.

```hoon
|=  p=?(%0 %1 %2 %3 %4)
?+  p  0
  %1  1
  %2  2
  %3  3
==
```

## Logical Operators <a href="#logical-operators" id="logical-operators"></a>

Mathematical logic allows the collocation of propositions to determine other propositions. In computer science, we use this functionality to determine which part of an expression is evaluated. We can combine logical statements pairwise:

`?&` [wutpam](../../hoon/rune/wut.md#wutpam), irregularly `&()`, is a logical `AND` (i.e. _p_ ∧ _q_) over loobean values, e.g. both terms must be true.

| `AND` | `%.y` | `%.n` |
| ----- | ----- | ----- |
| `%.y` | `%.y` | `%.n` |
| `%.n` | `%.n` | `%.n` |

```
> =/  a  5
  &((gth a 4) (lth a 7))
%.y
```

`?|` [wutbar](../../hoon/rune/wut.md#wutbar), irregularly `|()`, is a logical `OR` (i.e. _p_ ∨ _q_) over loobean values, e.g. either term may be true.

| `OR`  | `%.y` | `%.n` |
| ----- | ----- | ----- |
| `%.y` | `%.y` | `%.y` |
| `%.n` | `%.y` | `%.n` |

\


```
> =/  a  5
  |((gth a 4) (lth a 7))
%.y
```

`?!` [wutzap](../../hoon/rune/wut.md#wutzap), irregularly `!`, is a logical `NOT` (i.e. ¬_p_). Sometimes it can be difficult to parse code including `!` because it operates without parentheses.

|       | `NOT` |
| ----- | ----- |
| `%.y` | `%.n` |
| `%.n` | `%.y` |

\


```
> !%.y
%.n

> !%.n
%.y
```

From these primitive operators, you can build other logical statements at need.

### Exercise: Design an `XOR` Function <a href="#exercise-design-an-xor-function" id="exercise-design-an-xor-function"></a>

The logical operation `XOR` yields true if one but not both operands are true.

| `XOR` | `%.y` | `%.n` |
| ----- | ----- | ----- |
| `%.y` | `%.n` | `%.y` |
| `%.n` | `%.y` | `%.n` |

Implement `XOR` as a gate in Hoon.

### Exercise: Design a `NAND` Function <a href="#exercise-design-a-nand-function" id="exercise-design-a-nand-function"></a>

The logical operation `NAND` produces false if both operands are true.

| `NAND` | `%.y` | `%.n` |
| ------ | ----- | ----- |
| `%.y`  | `%.n` | `%.y` |
| `%.n`  | `%.y` | `%.y` |

Implement `NAND` as a gate in Hoon.

### Exercise: Design a `NOR` Function <a href="#exercise-design-a-nor-function" id="exercise-design-a-nor-function"></a>

The logical operation `NOR` produces true if both operands are false.

| `NOR` | `%.y` | `%.n` |
| ----- | ----- | ----- |
| `%.y` | `%.n` | `%.n` |
| `%.n` | `%.n` | `%.y` |

Implement `NOR` as a gate in Hoon.

### Exercise: Implement a Piecewise Boxcar Function <a href="#exercise-implement-a-piecewise-boxcar-function" id="exercise-implement-a-piecewise-boxcar-function"></a>

The boxcar function is a piecewise mathematical function which is equal to zero for inputs less than zero and one for inputs greater than or equal to zero. We implemented the similar Heaviside function [previously](./B-syntax.md) using the `?:` [wutcol](../../hoon/rune/wut.md#wutcol) rune.

Compose a gate which implements the boxcar function,

$$
\text{boxcar}(x)
:=
\left(
\begin{matrix}
1, & 10 \leq x < 20 \\\\
0, & \text{otherwise} \\\\
\end{matrix}
\right)
$$

Use Hoon logical operators to compress the logic into a single statement using at least one `AND` or `OR` operation.
