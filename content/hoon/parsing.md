---
description: "Guide to parsing text in Hoon using functional parsers and combinators, covering basic types like hair/nail/edge/rule and common parsing patterns."
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

# Parsing Text

This document serves as an introduction to parsing text with Hoon. No prior knowledge of parsing is required, and we will explain the basic structure of how parsing works in a purely functional language such as Hoon before moving on to how it is implemented in Hoon.

**Note:** For JSON printing/parsing and encoding/decoding, see the [JSON Guide](json-guide.md).

## What is parsing? {#what-is-parsing}

A program which takes a raw sequence of characters as an input and produces a data structure as an output is known as a _parser_. The data structure produced depends on the use case, but often it may be represented as a tree and the output is thought of as a structural representation of the input. Parsers are ubiquitous in computing, commonly used for to perform tasks such as reading files, compiling source code, or understanding commands input in a command line interface.

Parsing a string is rarely done all at once. Instead, it is usually done character-by-character, and the return contains the data structure representing what has been parsed thus far as well as the remainder of the string to be parsed. They also need to be able to fail in case the input is improperly formed. We will see each of these standard practices implemented in [Hoon below](#parsing-in-hoon).

## Functional parsers {#functional-parsers}

How parsers are built varies substantially depending on what sort of programming language it is written in. As Hoon is a functional programming language, we will be focused on understanding _functional parsers_, also known as _combinator parsers_. In this section we will make light use of pseudocode, as introducing the Hoon to describe functional parsers here creates a chicken-and-egg problem.

Complex functional parsers are built piece by piece from simpler parsers that are plugged into one another in various ways to perform the desired task.

The basic building blocks, or primitives, are parsers that read only a single character. There are frequently a few types of possible input characters, such as letters, numbers, and symbols. For example, `(parse "1" integer)` calls the parsing routine on the string `"1"` and looks for an integer, and so it returns the integer `1`. However, taking into account what was said above about parsers returning the unparsed portion of the string as well, we should represent this return as a tuple. So we should expect something like this:

```
> (parse "1" integer)
[1 ""]
> (parse "123" integer)
[1 "23"]
```

What if we wish to parse the rest of the string? We would need to apply the `+parse` function again:

```
> (parse (parse "123" integer) integer)
[12 "3"]
> (parse (parse (parse "123" integer) integer) integer)
[123 ""]
```

So we see that we can parse strings larger than one character by stringing together parsing functions for single characters. Thus in addition to parsing functions for single input characters, we want _parser combinators_ that allow you to combine two or more parsers to form a more complex one. Combinators come in a few shapes and sizes, and typical operations they may perform would be to repeat the same parsing operation until the string is consumed, try a few different parsing operations until one of them works, or perform a sequence of parsing operations. We will see how all of this is done with Hoon in the next section.

# Parsing in Hoon

In this section we will cover the basic types, parser functions, and parser combinators that are utilized for parsing in Hoon. This is not a complete guide to every parsing-related functionality in the standard library (of which there are quite a few), but ought to be sufficient to get started with parsing in Hoon and be equipped to discover the remainder yourself.

## Basic types {#basic-types}

In this section we discuss the types most commonly used for Hoon parsers. In short:

- A `+hair` is the position in the text the parser is at,
- A `+nail` is parser input,
- An `+edge` is parser output,
- A `+rule` is a parser.

### `+hair` {#hair}

```hoon
++  hair  [p=@ud q=@ud]
```

A `+hair` is a pair of `@ud` used to keep track of what has already been parsed for stack tracing purposes. This allows the parser to reveal where the problem is in case it hits something unexpected during parsing.

`.p` represents the line and `.q` represents the column.

### `+nail` {#nail}

```hoon
++  nail  [p=hair q=tape]
```

We recall from our [discussion above](#what-is-parsing) that parsing functions must keep track of both what has been parsed and what has yet to be parsed. Thus a `+nail` consists of both a `+hair`, giving the line and column up to which the input sequence has already been parsed, and a `$tape`, consisting of what remains of the original input string (i.e. everything after the location indicated by the `+nail`, including the character at that `+nail`).

For example, if you wish to feed the entire `$tape` `"abc"` into a parser, you would pass it as the `+nail` `[[1 1] "abc"]`. If the parser successfully parses the first character, the `+nail` it returns will be `[[1 2] "bc"]` (though we note that parser outputs are actually `+edge`s which contain a `+nail`, see the following). The `+nail` only matters for book-keeping reasons - it could be any value here since it doesn't refer to a specific portion of the string being input, but only what has theoretically already been parsed up to that point.

### `+edge` {#edge}

```hoon
++  edge  [p=hair q=(unit [p=* q=nail])]
```

An `+edge` is the output of a parser. If parsing succeeded, `.p` is the location of the original input `tape `up to which the text has been parsed. If parsing failed, `.p` will be the first `+hair` at which parsing failed.

`.q` may be `~`, indicating that parsing has failed . If parsing did not fail, `p.u.q` is the data structure that is the result of the parse up to this point, while `q.u.q` is the `+nail` which contains the remainder of what is to be parsed. If `.q` is not null, `.p` and `p.q.u.q` are identical.

### `+rule` {#rule}

```hoon
++  rule  _|:($:nail $:edge)
```

A `+rule` is a gate which takes in a `+nail` and returns an `+edge` - in other words, a parser.

## Parser builders {#parser-builders}

These functions are used to build `+rule`s (i.e. parsers), and thus are often called rule-builders. For a complete list of parser builders, see [4f: Parsing (Rule-Builders)](stdlib/4f.md), but also the more specific functions in [4h: Parsing (ASCII Glyphs)](stdlib/4h.md), [4i: Parsing (Useful Idioms)](stdlib/4i.md), [4j: Parsing (Bases and Base Digits)](stdlib/4j.md), [4l: Atom Parsing](stdlib/4l.md).

### [`+just`](stdlib/4f.md#just) {#justreferencestdlib4fmdjust}

The most basic rule builder, `+just` takes in a single `+char` and produces a `+rule` that attempts to match that `+char` to the first character in the `$tape` of the input `+nail`.

```
> =edg ((just 'a') [[1 1] "abc"])
> edg
[p=[p=1 q=2] q=[~ [p='a' q=[p=[p=1 q=2] q="bc"]]]]
```

We note that `p.edg` is `[p=1 q=2]`, indicating that the next character to be parsed is in line 1, column 2. `q.edg` is not null, indicating that parsing succeeded. `p.u.q.edg` is `'a'`, which is the result of the parse. `p.q.u.q.edg` is the same as `p.edg`, which is always the case for `+rule`s built using standard library functions when parsing succeeds. Lastly, `q.q.u.q.edg` is `"bc"`, which is the part of the input `$tape` that has yet to be parsed.

Now let's see what happens when parsing fails.

```
> =edg ((just 'b') [[1 1] "abc"])
> edg
[p=[p=1 q=1] q=~]
```

Now we have that `p.edg` is the same as the input `+hair`, `[1 1]`, meaning the parser has not advanced since parsing failed. `q.edg` is null, indicating that parsing has failed.

Later we will use [+star](#star) to string together a sequence of `+just`s in order to parse multiple characters at once.

### [`+jest`](stdlib/4f.md#jest) {#jestreferencestdlib4fmdjest}

`+jest` is a `+rule` builder used to match a `$cord`. It takes an input `$cord` and produces a `+rule` that attempts to match that `$cord` against the beginning of the input.

Let's see what happens when we successfully parse the entire input `$tape`.

```
> =edg ((jest 'abc') [[1 1] "abc"])
> edg
[p=[p=1 q=4] q=[~ [p='abc' q=[p=[p=1 q=4] q=""]]]]
```

`p.edg` is `[p=1 q=4]`, indicating that the next character to be parsed is at line 1, column 4. Of course, this does not exist since the input `$tape` was only 3 characters long, so this actually indicates that the entire `$tape` has been successfully parsed (since the `+hair` does not advance in the case of failure). `p.u.q.edg` is `'abc'`, as expected. `q.q.u.q.edg` is `""`, indicating that nothing remains to be parsed.

What happens if we only match some of the input `$tape`?

```
> =edg ((jest 'ab') [[1 1] "abc"])
> edg
[p=[p=1 q=3] q=[~ [p='ab' q=[p=[p=1 q=3] q="c"]]]]
```

Now we have that the result, `p.u.q.edg`, is `'ab'`, while the remainder `q.q.u.q.edg` is `"c"`. So `+jest` has successfully parsed the first two characters, while the last character remains. Furthermore, we still have the information that the remaining character was in line 1 column 3 from `p.edg` and `p.q.u.q.edg`.

What happens when `+jest` fails?

```
> ((jest 'bc') [[1 1] "abc"])
[p=[p=1 q=1] q=~]
```

Despite the fact that `'bc'` appears in `"abc"`, because it was not at the beginning the parse failed. We will see in [parser combinators](#parser-combinators) how to modify this `+rule` so that it finds `bc` successfully.

### [`+shim`](stdlib/4f.md#shim) {#shimreferencestdlib4fmdshim}

`+shim` is used to parse characters within a given range. It takes in two atoms and returns a `+rule`.

```
> ((shim 'a' 'z') [[1 1] "abc"])
[p=[p=1 q=2] q=[~ [p='a' q=[p=[p=1 q=2] q="bc"]]]]
```

### [`+next`](stdlib/4f.md#next) {#nextreferencestdlib4fmdnext}

`+next` is a simple `+rule` that takes in the next character and returns it as the parsing result.

```
> (next [[1 1] "abc"])
[p=[p=1 q=2] q=[~ [p='a' q=[p=[p=1 q=2] q="bc"]]]]
```

### [`+cold`](stdlib/4f.md#cold) {#coldreferencestdlib4fmdcold}

`+cold` is a `+rule` builder that takes in a constant noun we'll call `cus` and a `+rule` we'll call `sef`. It returns a `+rule` identical to the `sef` except it replaces the parsing result with `cus`.

Here we see that `p.q` of the `+edge` returned by the `+rule` created with `+cold` is `%foo`.

```
> ((cold %foo (just 'a')) [[1 1] "abc"])
[p=[p=1 q=2] q=[~ u=[p=%foo q=[p=[p=1 q=2] q="bc"]]]]
```

One common scenario where `+cold` sees play is when writing [command line interface (CLI) apps](../build-on-urbit/userspace/cli-tutorial.md). We usher the reader there to find an example where `+cold` is used.

### `+less` {#lessreferencestdlib4fmdless}

`+less` builds a `+rule` to exclude matches to its first argument.  It is commonly used to filter out an undesired match.

```
> (;~(less buc next) [[1 1] " "])
[p=[p=1 q=2] q=[~ [p=' ' q=[p=[p=1 q=2] q=""]]]]

> (;~(less ace next) [[1 1] " "])
[p=[p=1 q=1] q=~]
```

Here we see that the first case refuses to parse `buc` `$` (which is not present), so the `ace` succeeds (via `+next` which matches any character).

The second case attempts to parse the excluded character `ace` and fails on the first character as it should.

### [`+knee`](stdlib/4f.md#knee) {#kneereferencestdlib4fmdknee}

Another important function in the parser builder library is `+knee`, used for building recursive parsers. We delay discussion of `+knee` to the [section below](#recursive-parsers) as more context is needed to explain it properly.

## Outside callers {#outside-callers}

Since `+hair`s, `+nail`s, etc. are only utilized within the context of writing parsers, we'd like to hide them from the rest of the code of a program that utilizes parsers. That is to say, you'd like the programmer to only worry about passing `$tape`s to the parser, and not have to dress up the `$tape` as a `+nail` themselves. Thus we have several functions for exactly this purpose.

These functions take in either a `$tape` or a `$cord`, alongside a `+rule`, and attempt to parse the input with the `+rule`. If the parse succeeds, it returns the result. There are crashing and unitized versions of each caller, corresponding to what happens when a parse fails.

For additional information including examples see [4g: Parsing (Outside Caller)](stdlib/4g.md).

### Parsing `$tape`s {#parsing-tapes}

[`+scan`](stdlib/4g.md#scan) takes in a `$tape` and a `+rule` and attempts to parse the `$tape` with the
`+rule`.

```
> (scan "hello" (jest 'hello'))
'hello'
> (scan "hello zod" (jest 'hello'))
{1 6}
'syntax-error'
```

[`+rust`](stdlib/4g.md#rust) is the unitized version of `+scan`.

```
> (rust "a" (just 'a'))
[~ 'a']
> (rust "a" (just 'b'))
~
```

For the remainder of this tutorial we will make use of `+scan` so that we do not need to deal directly with `+nail`s except where it is illustrative to do so.

### Parsing atoms {#parsing-atoms}

[Recall from Hoon School](../build-on-urbit/hoon-school/E-types.md) that `$cord`s are atoms with the aura `@t` and are typically used to represent strings internally as data, as atoms are faster for the computer to work with than `$tape`s, which are `+list`s of `@tD` atoms. [`+rash`](stdlib/4g.md#rash) and [`+rush`](stdlib/4g.md#rush) are for parsing atoms, with `+rash` being analogous to `+scan` and `+rush` being analogous to `+rust`. Under the hood, `+rash` calls `+scan` after converting the input atom to a `$tape`, and `+rush` does similary for `+rust`.

## Parser modifiers {#parser-modifiers}

The standard library provides a number of gates that take a `+rule` and produce a new modified `+rule` according to some process. We call these _parser modifiers_. These are documented among the [parser builders](stdlib/4f.md).

### [`+ifix`](stdlib/4f.md#ifix) {#ifixreferencestdlib4fmdifix}

`+ifix` modifies a `+rule` so that it matches that `+rule` only when it is surrounded on both sides by text that matches a pair of `+rule`s, which is discarded.

```
> (scan "(42)" (ifix [pal par] (jest '42')))
'42'
```

`+pal` and `+par` are shorthand for `(just '(')` and `(just ')')`, respectively. All ASCII glyphs have counterparts of this sort, documented [here](stdlib/4h.md).

### [`+star`](stdlib/4f.md#star) {#star}

`+star` is used to apply a `+rule` repeatedly. Recall that `+just` only parses the first character in the input `tape.`

```
> ((just 'a') [[1 1] "aaaa"])
[p=[p=1 q=2] q=[~ [p='a' q=[p=[p=1 q=2] q="aaa"]]]]
```

We can use `+star` to get the rest of the `$tape`:

```
> ((star (just 'a')) [[1 1] "aaa"])
[p=[p=1 q=4] q=[~ [p=[i='a' t=<|a a|>] q=[p=[p=1 q=4] q=""]]]]
```

and we note that the parsing ceases when it fails.

```
> ((star (just 'a')) [[1 1] "aaab"])
[p=[p=1 q=4] q=[~ [p=[i='a' t=<|a a|>] q=[p=[p=1 q=4] q="b"]]]]
```

We can combine `+star` with `+next` to just return the whole input:

```
> ((star next) [[1 1] "aaabc"])
[p=[p=1 q=6] q=[~ [p=[i='a' t=<|a a b c|>] q=[p=[p=1 q=6] q=""]]]]
```

### [`+cook`](stdlib/4f.md#cook) {#cookreferencestdlib4fmdcook}

`+cook` takes a `+rule` and a gate and produces a modified version of the `+rule` that passes the result of a successful parse through the given gate.

Let's modify the rule `(just 'a')` so that it when it successfully parses `.a`, it returns the following letter `.b` as the result.

```
((cook |=(a=@ `@t`+(a)) (just 'a')) [[1 1] "abc"])
[p=[p=1 q=2] q=[~ u=[p='b' q=[p=[p=1 q=2] q="bc"]]]]
```

## Parser combinators {#parser-combinators}

Building complex parsers from simpler parsers is accomplished in Hoon with the use of two tools: the monadic applicator rune [`;~`](rune/mic.md#micsig) and [parsing combinators](stdlib/4e.md). First we introduce a few combinators, then we examine more closely how `;~` is used to chain them together.

The syntax to combine `+rule`s is

```hoon
;~(combinator rule1 rule2 ... ruleN)
```

The `+rule`s are composed together using the combinator as an intermediate function, which takes the product of a `+rule` (an `+edge`) and a `+rule` and turns it into a sample (a `+nail`) for the next `+rule` to handle. We elaborate on this behavior [below](#-micsig).

### [`+plug`](stdlib/4e.md#plug) {#plugreferencestdlib4emdplug}

`+plug` simply takes the `+nail` in the `+edge` produced by one rule and passes it to the next `+rule`, forming a cell of the results as it proceeds.

```
> (scan "starship" ;~(plug (jest 'star') (jest 'ship')))
['star' 'ship']
```

### [`+pose`](stdlib/4e.md#pose) {#posereferencestdlib4emdpose}

`+pose` tries each `+rule` you hand it successively until it finds one that works.

```
> (scan "a" ;~(pose (just 'a') (just 'b')))
'a'
> (scan "b" ;~(pose (just 'a') (just 'b')))
'b'
```

### [`+glue`](stdlib/4e.md#glue) {#gluereferencestdlib4emdglue}

`+glue` parses a delimiter in between each `+rule` and forms a cell of the results of each `+rule`.

```
> (scan "a,b" ;~((glue com) (just 'a') (just 'b')))
['a' 'b']
> (scan "a,b,a" ;~((glue com) (just 'a') (just 'b')))
{1 4}
syntax error
> (scan "a,b,a" ;~((glue com) (just 'a') (just 'b') (just 'a')))
['a' 'b' 'a']
```

### [`;~`](rune/mic.md#micsig) {#-micsig}

Understanding the rune `;~` is essential to building parsers with Hoon. Let's take this opportunity to think about it carefully.

The `+rule` created by `;~(combinator (list rule))` may be understood inductively. To do this, let's consider the base case where our `(list rule)` has only a single entry.

```
> (scan "star" ;~(plug (jest 'star')))
'star'
```

Our output is identical to that given by `(scan "star" (jest 'star'))`. This is to be expected. The combinator `+plug` is specifically used for chaining together `+rule`s in the `(list rule)`, but if there is only one `+rule`, there is nothing to chain. Thus, swapping out `+plug` for another combinator makes no difference here:

```
> (scan "star" ;~(pose (jest 'star')))
'star'
> (scan "star" ;~((glue com) (jest 'star')))
'star'
```

`;~` and the combinator only begin to play a role once the `(list rule)` has at least two elements. So let's look at an example done with `+plug`, the simplest combinator.

```
> (scan "star" ;~(plug (jest 'st') (jest 'ar')))
['st' 'ar']
```

Our return suggests that we first parsed `"star"` with the `+rule` `(jest 'st')` and passed the resulting `+edge` to `(jest 'ar')` - in other words, we called `+plug` on `(jest 'st')` and the `+edge` returned once it had been used to parse `"star"`. Thus `+plug` was the glue that allowed us to join the two `+rule`s, and `;~` performed the gluing operation. And so, swapping `+plug` for `+pose` results in a crash, which clues us into the fact that the combinator now has an effect since there is more than one `+rule`.

```
> (scan "star" ;~(pose (jest 'st') (jest 'ar')))
{1 3}
syntax error
```

## Parsing numbers {#parsing-numbers}

Functions for parsing numbers are documented in [4j: Parsing (Bases and Base Digits)](stdlib/4j.md). In particular, [`+dem`](stdlib/4i.md#dem) is a `+rule` for parsing decimal numbers.

```
> (scan "42" dem)
42
> (add 1 (scan "42" dem))
43
```

## Recursive parsers {#recursive-parsers}

Naively attempting to write a recursive `+rule`, i.e. like

```
> |-(;~(plug prn ;~(pose $ (easy ~))))
```

results in an error:

```
-find.,.+6
-find.,.+6
rest-loop
```

Here, [`+prn`](stdlib/4i.md#prn) is a `+rule` used to parse any printable character, and [`+easy`](stdlib/4f.md#easy) is a `+rule` that always returns a constant (`~` in this case) regardless of the input.

Thus some special sauce is required, the [`+knee`](stdlib/4f.md#knee) function.

`+knee` takes in a noun that is the default value of the parser, typically given as the bunt value of the type that the `+rule` produces, as well as a gate that accepts a `+rule`. `+knee` produces a `+rule` that implements any recursive calls in the `+rule` in a manner acceptable to the compiler. Thus the preferred manner to write the above `+rule` is as follows:

```hoon
|-(;~(plug prn ;~(pose (knee *tape |.(^$)) (easy ~))))
```

You may want to utilize the `~+` rune when writing recursive parsers to cache the parser to improve performance. In the following section, we will be writing a recursive parser making use of `+knee` and `~+` throughout.

# Parsing arithmetic expressions

In this section we will be applying what we have learned to write a parser for arithmetic expressions in Hoon. That is, we will make a `+rule` that takes in `$tape`s of the form `"(2+3)*4"` and returns `20` as a `@ud`.

We call a `$tape` consisting of some consistent arithmetic string of numbers, `+`, `*`, `(`, and `)` an _expression_. We wish to build a `+rule` that takes in an expression and returns the result of the arithmetic computation described by the expression as a `@ud`.

To build a parser it is a helpful exercise to first describe its [grammar](https://en.wikipedia.org/wiki/Parsing_expression_grammar). This has a formal mathematical definition, but we will manage to get by here describing the grammar for arithmetic expressions informally.

First let's look at the code we're going to use, and then dive into explaining it. If you'd like to follow along, save the following as `expr-parse.hoon` in your `gen/` folder.

```hoon
::  expr-parse: parse arithmetic expressions
::
|=  math=tape
|^  (scan math expr)
++  factor
  %+  knee  *@ud
  |.  ~+
  ;~  pose
    dem
    (ifix [pal par] expr)
  ==
++  term
  %+  knee  *@ud
  |.  ~+
  ;~  pose
    ((slug mul) tar ;~(pose factor term))
    factor
  ==
++  expr
  %+  knee  *@ud
  |.  ~+
  ;~  pose
    ((slug add) lus ;~(pose term expr))
    term
  ==
--
```

Informally, the grammar here is:

- A factor is either an integer or an expression surrounded by parentheses.
- A term is either a factor or a factor times a term.
- An expression is either a term or a term plus an expression.

### Factors, terms, and expressions {#factors-terms-and-expressions}

Our grammar consists of three `+rule`s: one for factors, one for terms, and one for expressions.

#### Factors

```hoon
++  factor
  %+  knee  *@ud
  |.  ~+
  ;~  pose
    dem
    (ifix [pal par] expr)
  ==
```

A _factor_ is either a decimal number or an expression surrounded by parentheses. Put into Hoon terms, a decimal number is parsed by the `+rule` `+dem` and an expression is parsed by removing the surrounding parentheses and then passing the result to the expression parser arm `+expr`, given by the `+rule` `(ifix [pal par] expr)`. Since we want to parse our expression with one or the other, we chain these two `+rule`s together using the monadic applicator rune `;~` along with `+pose`, which says to try each rule in succession until one of them works.

Since expressions ultimately reduce to factors, we are actually building a recursive rule. Thus we need to make use of `+knee`. The first argument for `+knee` is `*@ud`, since our final answer should be a `@ud`.

Then follows the definition of the gate utilized by `+knee`:

```hoon
  |.  ~+
  ;~  pose
    dem
    (ifix [pal par] expr)
  ==
```

`~+` is used to cache the parser, so that it does not need to be computed over and over again. Then it follows the `+rule` we described above.

#### Parsing expressions

An _expression_ is either a term plus an expression or a term.

In the case of a term plus an expression, we actually must compute what that equals. Thus we will make use of [`+slug`](stdlib/4f.md#slug), which parses a delimited list into `$tape`s separated by a given delimiter and then composes them by folding with a binary gate. In this case, our delimiter is `+` and our binary gate is `+add`. That is to say, we will split the input string into terms and expressions separated by luses, parse each term and expression until they reduce to a `@ud`, and then add them together. This is accomplished with the `+rule` `((slug add) lus ;~(pose term expr))`.

If the above `+rule` does not parse the expression, it must be a `term`, so the `$tape` is automatically passed to `+term` to be evaluated. Again we use `;~` and `+pose` to accomplish this:

```hoon
;~  pose
  ((slug add) lus ;~(pose term expr))
  term
==
```

The rest of the `+expr` arm is structured just like how `+factor` is, and for the same reasons.

#### Parsing terms

A _term_ is either a factor times a term or a factor. This is handled similarly for expressions, we just need to swap `lus` for `tar`, `+add` for `+mul`, and `;~(pose factor term)` instead of `;~(pose term expr)`.

```hoon
++  expr
  %+  knee  *@ud
  |.  ~+
  ;~  pose
    ((slug add) lus ;~(pose term expr))
    term
  ==
```

### Try it out {#try-it-out}

Let's feed some expressions to `+expr-parse` and see how it does.

```
> +expr-parse "3"
3
> +expr-parse "3+3"
6
> +expr-parse "3+3+(2*3)+(4+2)*(4+1)"
42
> +expr-parse "3+3+2*3"
12
```

As an exercise, add exponentiation (e.g. `2^3 = 8`) to `+expr-parse`.
