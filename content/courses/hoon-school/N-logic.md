+++
title = "13. Conditional Logic"
weight = 23
nodes = [184]
objectives = ["Produce loobean expressions.", "Reorder conditional arms.", "Switch against a union with or without default."]
+++

{% video src="https://media.urbit.org/docs/hoon-school-videos/HS184 - Logical Operations.mp4" /%}

_Although you've been using various of the `?` wut runes for a while now, let's wrap up some loose ends.  This module will cover the nature of loobean logic and the rest of the `?` wut runes._


##  Loobean Logic

Throughout Hoon School, you have been using `%.y` and `%.n`, often implicitly, every time you have asked a question like `?:  =(5 4)`.  The `=()` expression returns a loobean, a member of the type union `?(%.y %.n)`.  (There is a proper aura `@f` but unfortunately it can't be used outside of the compiler.)  These can also be written as `&` (`%.y`, true) and `|` (`%.n`, false), which is common in older code but should be avoided for clarity in your own compositions.

What are the actual values of these, _sans_ formatting?

```hoon
> `@`%.y
0

> `@`%.n
1
```

Pretty much all conditional operators rely on loobeans, although it is very uncommon for you to need to unpack them.


##  Noun Equality

The most fundamental comparison in Hoon is provided by `.=` dottis, a test for equality of two nouns using Nock 5.  This is almost always used in its irregular form of `=` tis.

```hoon
> =(0 0)
%.y

> =('a' 'b')
%.n
```

Since Nock is unaware of the Hoon metadata type system, only bare atoms in the nouns are compared.  If you need to compare include type information, create vases with `!>` zapgar.

```hoon
> =('a' 97)
%.y

> =(!>('a') !>(97))
%.n
```


##  Making Choices

You are familiar in everyday life with making choices on the basis of a decision expression.  For instance, you can compare two prices for similar products and select the cheaper one for purchase.

Essentially, we have to be able to decide whether or not some value or expression evaluates as `%.y` true (in which case we will do one thing) or `%.n` false (in which case we do another).  Some basic expressions are mathematical, but we also check for existence, for equality of two values, etc.

- [`++gth`](/language/hoon/reference/stdlib/1a#gth) (greater than `>`)                   
- [`++lth`](/language/hoon/reference/stdlib/1a#lth) (less than `<`)  
- [`++gte`](/language/hoon/reference/stdlib/1a#gte) (greater than or equal to `≥`)
- [`++lte`](/language/hoon/reference/stdlib/1a#lte) (less than or equal to `≤`)
- [`.=` dottis](/language/hoon/reference/rune/dot#-dottis), irregularly `=()` (check for equality)

The key conditional decision-making rune is [`?:` wutcol](/language/hoon/reference/rune/wut#-wutcol), which lets you branch between an `expression-if-true` and an `expression-if-false`.  [`?.` wutdot](/language/hoon/reference/rune/wut#-wutdot) inverts the order of `?:`.  Good Hoon style prescribes that the heavier branch of a logical expression should be lower in the file.

There are also two long-form decision-making runes, which we will call [_switch statements_](https://en.wikipedia.org/wiki/Switch_statement) by analogy with languages like C.

- [`?-` wuthep](/language/hoon/reference/rune/wut#--wuthep) lets you choose between several possibilities, as with a type union.  Every case must be handled and no case can be unreachable.

    Since `@tas` terms are constants first, and not `@tas` unless marked as such, `?-` wuthep switches over term unions can make it look like the expression is branching on the value.  It's actually branching on the _type_.  These are almost exclusively used with term type unions.

    ```hoon {% copy=true %}
    |=  p=?(%1 %2 %3)
    ?-  p
      %1  1
      %2  2
      %3  3
    ==
    ```

- [`?+` wutlus](/language/hoon/reference/rune/wut#-wutlus) is similar to `?-` but allows a default value in case no branch is taken.  Otherwise these are similar to `?-` wuthep switch statements.

    ```hoon {% copy=true %}
    |=  p=?(%0 %1 %2 %3 %4)
    ?+  p  0
      %1  1
      %2  2
      %3  3
    ==
    ```

##  Logical Operators

Mathematical logic allows the collocation of propositions to determine other propositions.  In computer science, we use this functionality to determine which part of an expression is evaluated.  We can combine logical statements pairwise:

- [`?&` wutpam](/language/hoon/reference/rune/wut#-wutpam), irregularly `&()`, is a logical `AND` (i.e. _p_ ∧ _q_) over loobean values, e.g. both terms must be true.

    |             `AND`            | `%.y` | `%.n` |
    |------------------------------|-------|-------|
    | `%.y`{% class="font-bold" %} | `%.y` | `%.n` |
    | `%.n`{% class="font-bold" %} | `%.n` | `%.n` |

    <br>

    ```hoon
    > =/  a  5
      &((gth a 4) (lth a 7))
    %.y
    ```

- [`?|` wutbar](/language/hoon/reference/rune/wut#-wutbar), irregularly `|()`, is a logical `OR` (i.e. _p_ ∨ _q_)  over loobean values, e.g. either term may be true.

    |             `OR`             | `%.y` | `%.n` |
    |------------------------------|-------|-------|
    | `%.y`{% class="font-bold" %} | `%.y` | `%.y` |
    | `%.n`{% class="font-bold" %} | `%.y` | `%.n` |

    <br>

    ```hoon
    > =/  a  5
      |((gth a 4) (lth a 7))
    %.y
    ```

- [`?!` wutzap](/language/hoon/reference/rune/wut#-wutzap), irregularly `!`, is a logical `NOT` (i.e. ¬*p*).  Sometimes it can be difficult to parse code including `!` because it operates without parentheses.

    |                              | `NOT` |
    |------------------------------|-------|
    | `%.y`{% class="font-bold" %} | `%.n` |
    | `%.n`{% class="font-bold" %} | `%.y` |

    <br>

    ```hoon
    > !%.y
    %.n

    > !%.n
    %.y
    ```

From these primitive operators, you can build other logical statements at need.

### Exercise:  Design an `XOR` Function

The logical operation `XOR` (i.e. *p*⊕*q* ; exclusive disjunction)  yields true if one but not both operands are true.  `XOR` can be calculated by (_p_ ∧ ¬*q*) ∨ (¬*p* ∧ _q_).

|             `XOR`            | `%.y` | `%.n` |
|------------------------------|-------|-------|
| `%.y`{% class="font-bold" %} | `%.n` | `%.y` |
| `%.n`{% class="font-bold" %} | `%.y` | `%.n` |

- Implement `XOR` as a gate in Hoon.

    ```hoon {% copy=true %}
    |=  [p=?(%.y %.n) q=?(%.y %.n)]
    ^-  ?(%.y %.n)
    |(&(p !q) &(!p q))
    ```

### Exercise:  Design a `NAND` Function

The logical operation `NAND` (i.e. _p_ ↑ _q_) produces false if both operands are true.  `NAND` can be calculated by ¬(_p_ ∧ _q_).

|             `NAND`            | `%.y` | `%.n` |
|-------------------------------|-------|-------|
| `%.y`{% class="font-bold" %}  | `%.n` | `%.y` |
| `%.n`{% class="font-bold" %}  | `%.y` | `%.y` |

- Implement `NAND` as a gate in Hoon.

### Exercise:  Design a `NOR` Function

The logical operation `NOR` (i.e. _p_ ↓ _q_) produces true if both operands are false.  `NOR` can be calculated by ¬(_p_ ∨ _q_).

|             `NOR`            | `%.y` | `%.n` |
|------------------------------|-------|-------|
| `%.y`{% class="font-bold" %} | `%.n` | `%.n` |
| `%.n`{% class="font-bold" %} | `%.n` | `%.y` |

- Implement `NAND` as a gate in Hoon.

### Exercise:  Implement a Piecewise Boxcar Function

The boxcar function is a piecewise mathematical function which is equal to zero for inputs less than zero and one for inputs greater than or equal to zero.  We implemented the similar Heaviside function [previously](/courses/hoon-school/B-syntax) using the `?:` wutcol rune.

- Compose a gate which implements the boxcar function,

    {% math block=true %}
    \text{boxcar}(x)
    :=
    \left(
    \begin{matrix}
    1, & 10 \leq x < 20 \\\\
    0, & \text{otherwise} \\\\
    \end{matrix}
    \right)
    {% /math %}

    <!--
    $$
    \text{boxcar}(x)
    :=
    \begin{matrix}
    1, & 10 \leq x < 20 \\
    0, & \text{otherwise} \\
    \end{matrix}
    $$
    -->

    Use Hoon logical operators to compress the logic into a single statement using at least one `AND` or `OR` operation.
