---
description: Programming implementations in Hoon for common algorithmic tasks including sorting, bitwise operations, prime calculation, functional operators, floating-point math, and debugging techniques.
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


# Competitive Programming

Let's take a quick look at implementations for some common tasks in Hoon.  I assume that you want to use library tools whenever possible, but you can delve into the source code itself if you want to know more.

## Sorting {#sorting}

- Given a `list` of values, sort the values according to a given rule and produce a `list`.

The standard `++sort` gate implements a quicksort.  You need to provide a comparison function as a gate as well.

```hoon
> =/  my-list  `(list @ud)`~[10 9 8 1 2 3 7 6 4 5]
  (sort my-list gth)
~[10 9 8 7 6 5 4 3 2 1]

> =/  my-list  `(list @ud)`~[10 9 8 1 2 3 7 6 4 5]
  (sort my-list lth)
~[1 2 3 4 5 6 7 8 9 10]
```

If you are sorting something more complicated than atoms, you'll need a comparison gate that handles pairwise values and returns truthness.

E.g. given a data structure like `[@ud @tas]`, a cell which we wish to sort on the tail, we could sort like this:

```hoon
> =/  my-list  `(list [@ud @tas])`~[[1 %a] [2 %c] [3 %b] [4 %d]]
  (sort my-list |=([a=[@ud @tas] b=[@ud @tas]] (lth +.a +.b)))
~[[1 %a] [3 %b] [2 %c] [4 %d]]
```

- Given a `set` of values, sort the values according to a given rule and produce a `list`.

If something isn't a `list`, the easiest way to sort it is to convert it to a `list` first and then sort that.

```hoon
> =/  my-set  (silt ~[1 10 10 1 2 3 3 2 4 9 8 5 7 6 8 9])
  =/  my-list  ~(tap in my-set)
  (sort my-list lth)
~[1 2 3 4 5 6 7 8 9 10]
```

## Bitwise Operations {#bitwise-operations}

Bitwise operations are necessary when you are closely packing data into binary formats or otherwise dealing with binary data.  Basically there are three scenarios:

1. Using packed binary data, e.g. bit packing or [NaN-boxing](https://anniecherkaev.com/the-secret-life-of-nan).  Urbit supports bitwise operations on arbitrarily-sized atoms.
2. Working with MIME-type data.  Urbit has standard library support for yielding and parsing these, but it's sometimes a bit confusing where they may be located.
3. Directly processing particular kinds of data streams, like audio or video data.  On Urbit, you'll be serving these or interfacing with an external service.  (Remember, Urbit is more like a server than a GPU.)

### Binary Operations {#binary-operations}

If you are working with packed binary data, you'll typically print the atom data with a `@ux` unsigned hexadecimal aura.

We'll use `'Wild Hearts Can\'t Be Broken'` as our source atom.  As `@ux` the ASCII components are clearly visible.

```hoon
> `@ux`'Wild Hearts Can\'t Be Broken'  
0x6e.656b.6f72.4220.6542.2074.276e.6143.2073.7472.6165.4820.646c.6957  
```

Here are a few ways to slice and dice binary atom data.

[`++rip`](../stdlib/2c.md#rip) disassembles an atom `b` into `2^a`-sized chunks as a `list`.

```hoon
> =/  text  'Wild Hearts Can\'t Be Broken'  
 (rip 3 text)  
~[87 105 108 100 32 72 101 97 114 116 115 32 67 97 110 39 116 32 66 101 32 66 114 111 107 101 110]  

> =/  text  'Wild Hearts Can\'t Be Broken'  
 `(list @ux)`(rip 3 text)  
~[0x57 0x69 0x6c 0x64 0x20 0x48 0x65 0x61 0x72 0x74 0x73 0x20 0x43 0x61 0x6e 0x27 0x74 0x20 0x42 0x65 0x20 0x42 0x72 0x6f 0x6b 0x65 0x6e]

> =/  text  'Wild Hearts Can\'t Be Broken'  
 `(list @ux)`(rip 6 text)  
~[0x6165.4820.646c.6957 0x276e.6143.2073.7472 0x6f72.4220.6542.2074 0x6e.656b]
```

[`++rap`](../stdlib/2c.md#rap) is the opposite operation, producing an atom from a list of atoms `b` with a block size `2^a`.

```hoon
> `(list @ux)`(rip 3 'Mars')
~[0x4d 0x61 0x72 0x73]

> `@t`(rap 3 ~[0x4d 0x61 0x72 0x73])
'Mars'

> `@ux`(rap 3 ~[0x4d 0x61 0x72 0x73])
0x7372.614d

> `@ux`(rap 6 ~[0x4d 0x61 0x72 0x73])
0x73.0000.0000.0000.0072.0000.0000.0000.0061.0000.0000.0000.004d
```

[`++cut`](../stdlib/2c.md#cut) slices `2^a`-sized chunks from `b` to `c` out of atom `d`.

```hoon
> =/  text  'Wild Hearts Can\'t Be Broken'
 `@ux`(cut 3 [0 4] text)
0x646c.6957

> =/  text  'Wild Hearts Can\'t Be Broken'
 `@t`(cut 3 [0 4] text)
'Wild'
```

(There are many more of these types of operations available as well.)

Standard bitwise logical operations are available:

- `OR` is [`++con`](../stdlib/2d.md#con) (conjoint):

    ```hoon
    > `@ub`(con 0b10.0001.0110 0b11.1101.1011)
    0b11.1101.1111
    ```

- `AND` is [`++dis`](../stdlib/2d.md#dis) (disjoint):

    ```hoon
    > `@ub`(dis 0b10.0001.0110 0b11.1101.1011)
    0b10.0001.0010
    ```

- `XOR` is [`++mix`](../stdlib/2d.md#mix):

    ```hoon
    > `@ub`534
    0b10.0001.0110

    > `@ub`987
    0b11.1101.1011

    > `@ub`(mix 534 987)
    0b1.1100.1101
    ```

- `NOT` is [`++not`](../stdlib/2d.md#not); it requires a block size (powers of 2) because leading zeroes are always stripped in Hoon (and thus `NOT` is implicitly based on block size):

    ```hoon
    > `@ub`(not 2 1 0b1011)
    0b100

    > `@ub`(not 3 1 0b1011)
    0b1111.0100
    
    > `@ub`(not 4 1 0b1011)
    0b1111.1111.1111.0100
    ```

### MIME Data Operations {#mime-data-operations}

[MIME data types](https://en.wikipedia.org/wiki/MIME) allow HTTP communications to include rich content.  The `++html` core in the standard library provides quite a few operations for encoding and decoding MIME-typed values.

Data transmitted as bytes ([“octets”](https://en.wikipedia.org/wiki/Octet_%28computing%29)) are decoded using `++as-octs:mimes:html`.  This is transparent for ASCII text data:

```hoon
> (as-octs:mimes:html '<html><body>')
[p=12 q=19.334.824.924.412.244.887.090.784.316]

> `[@ @ux]`(as-octs:mimes:html '<html><body>')
[12 0x3e79.646f.623c.3e6c.6d74.683c]

> `[@ @t]`(as-octs:mimes:html '<html><body>')
[12 '<html><body>']
```

Perhaps surprisingly, many text conversion operations live here.  To parse a hexadecimal value as a string, for instance, use `++de:base16:mimes:html`:

```hoon
> (de:base16:mimes:html 'deadbeef')
[~ [p=4 q=3.735.928.559]]

> `(unit [@ @ux])`(de:base16:mimes:html 'deadbeef')
[~ [4 0xdead.beef]]
```

There are operations for JSON, [Base58](https://en.wikipedia.org/wiki/Binary-to-text_encoding#Base58), and XML/HTML as well.

- [JSON](../json-guide.md)
- [Sail (HTML)](../sail.md)

Urbit furthermore has a notion of _jammed noun_, which is essentially a serialization (marshaling, pickling) of a noun into an atom.

## Primes and Factors {#primes-and-factors}

To calculate a prime number, the tried-and-true method is the Sieve of Eratosthenes, which is an elimination algorithm.  In other words, we need to be able to calculate factors of a given positive integer.  We're actually going to do an even simpler (and less efficient) method here, and leave the Sieve as an exercise to the reader.

This gate accepts a number and divides it by every number from half the number down to 2.  If the remainder after division is zero, then it is a factor and we add it to the front of the list of factors.

```hoon
|%
++  factors
  |=  n=@ud  ^-  (list @ud)
  =/  ctr  (div n 2)
  =/  fxr  *(list @ud)
  |-  ^-  (list @ud)
  ?:  =(1 ctr)  fxr
  ?:  =(0 +:(dvr n ctr))
    $(ctr (sub ctr 1), fxr [ctr fxr])
  $(ctr (sub ctr 1))
--
```

Now that we can find factors, it should be straightforward to find primes.  In this case, we simply check each value up to `n` and see if it has any factors (other than itself and 1, of course).

```hoon
|%
++  factors
  |=  n=@ud  ^-  (list @ud)
  =/  ctr  (div n 2)
  =/  fxr  *(list @ud)
  |-  ^-  (list @ud)
  ?:  =(1 ctr)  fxr
  ?:  =(0 (mod n ctr))
    $(ctr (sub ctr 1), fxr [ctr fxr])
  $(ctr (sub ctr 1))
++  primes
  |=  n=@ud  ^-  (list @ud)
  =/  ctr  n
  =/  prm  *(list @ud)
  |-  ^-  (list @ud)
  ?:  =(1 ctr)  prm
  ?:  =(~ (factors ctr))
    $(ctr (sub ctr 1), prm [ctr prm])
  $(ctr (sub ctr 1))
--
```

- How would you change this algorithm to the more efficient Sieve of Eratosthenes?

## Pragmatic Input/Output {#pragmatic-inputoutput}

While Hoon has a sophisticated text parsing library, the primitives are rather low-level and we won't assume that you want to directly implement a parser using them in a rapid-fire competitive environment.

- [Text Processing III](../../build-on-urbit/hoon-school/Q2-parsing.md) - This module will cover text parsing.
- [Parsing Text](../parsing.md)

Fortunately, there is a regular expression library you can incorporate into your program which will allow you to match and work with code.

- https://github.com/lynko/re.hoon

## Functional Operators {#functional-operators}

Hoon is a functional programming language, so naturally it supports the basic collective operations which functional programming languages expect.

### Curry {#curry}

[_Currying_](https://en.wikipedia.org/wiki/Currying) describes taking a function of multiple arguments and reducing it to a set of functions that each take only one argument. _Binding_, an allied process, is used to set the value of some of those arguments permanently.  Hoon has a left-bind `++cury` and a right-bind `++curr`.

```hoon
> =full |=([x=@ud a=@ud b=@ud c=@ud] (add (add (mul (mul x x) a) (mul x b)) c))

> (full 5 4 3 2)
117

> =one (curr full [4 3 2])

> (one 5)  
117
```

### Map {#map}

The Map operation describes applying a function to each item of a set or iterable object, resulting in the same final number of items transformed. In Hoon terms, we would say slamming a gate on each member of a `list` or `set`. The standard library arms that accomplish this include [`++turn`](../stdlib/2b.md#turn) for a `list`, [`++run:in`](../stdlib/2h.md#repin) for a `set`, and [`++run:by`](../stdlib/2i.md#runby) for a `map`.

```hoon
> (turn `(list @ud)`~[1 2 3 4 5] one)
```

### Reduce {#reduce}

The Reduce operation applies a function as a sequence of pairwise operations to each item, resulting in one summary value. The standard library arms that accomplish this are [`++roll`](../stdlib/2b.md#roll) and [`++reel`](../stdlib/2b.md#reel) for a `list`, [`++rep:in`](../stdlib/2h.md#repin) for a `set`, and [`++rep:by`](../stdlib/2i.md#repby) for a `map`.

```hoon
> =my-set (silt `(list @ud)`~[1 2 3 4 5])

> (~(rep in my-set) mul)
b=120
```

### Filter {#filter}

The Filter operation applies a true/false function to each member of a collection, resulting in some number of items equal to or fewer than the size of the original set. In Hoon, the library arms that carry this out include [`++skim`](../stdlib/2b.md#skim), [`++skid`](../stdlib/2b.md#skid), [`++murn`](../stdlib/2b.md#murn) for a `list`, and [`++rib:by`](../stdlib/2i.md#ribby) for a `map`.

```hoon
> `(list @ud)`(skim `(list @ud)`~[1 2 3 4 5] (curr gth 2))
~[3 4 5]
```

An interesting feature of Hoon is that it really prefers functions-that-produce-functions, which feels very functional once you get used to the idiom.  Here you can see that done with `++curr`.

- [Functional Programming](../../build-on-urbit/hoon-school/Q-func.md) - This module will discuss some gates-that-work-on-gates and other assorted operators that are commonly recognized as functional programming tools.

## Floating-Point Operations {#floating-point-operations}

`@ud` unsigned decimal operations are, of course, postive-integer-only.  For floating-point maths, you will need to work with `@rs` for 32-bit single-precision IEEE 754 floating-point atoms.  These are prefixed with a single `.` which is _not_ a decimal point.

```hoon
> .100
.100

> .1e2
.100

> .1e-4
.1e-4

> .0.0001
.1e-4
```

Equivalent mathematical operations for `@rs` values are available in the `++rs` door:

```hoon
> (add:rs .1 .2)
.3

> (mul:rs .5 .0.6)
.0.3

> (div:rs .10 .3)
.3.3333333
```

- [Mathematics](../../build-on-urbit/hoon-school/S-math.md) - This module introduces how non-`@ud` mathematics are instrumented in Hoon.

(I picked the above set of examples after perusing the excellent book [Antti Laaksonen (2017) _Guide to Competitive Programming:  Learning and Improving Algorithms Through Contests_](https://link.springer.com/book/10.1007/978-3-319-72547-5).)

## Debugging and Troubleshooting {#debugging-and-troubleshooting}

Static typing with compile-time type checking turns out to be a secret strength of Hoon.  Once you've satisfied the typechecker, your code is often surprisingly free of bugs (compared to e.g. Python).

There are three basic things that tend to go wrong:

1. Syntax error, general (just typing things out wrong, for instance in a way Dojo would prevent)
2. Syntax error mismatching rune daughters (due to `ace`/`gap` or miscounting children)
3. Type issues (`need`/`have`, notoriously)

This last case can be handled with a couple of expedients:

- Frequent use of `^-` kethep/`^+` ketlus to make sure that types match at various points in the code.

    This has two benefits:  it verifies your expectations about what values are being passed around, and it means that mismatches raise an error more closely to the source of the error.

    (Since Hoon checks type at build time, this does not incur a computational cost when the program is running.)

- Use of assertions to enforce type constraints.  Assertions are a form of `?` wut rune which check the structure of a value.  Ultimately they all reduce back to `?:` wutcol, but are very useful in this sugar form:

    - [`?>` wutgar](../rune/wut.md#wutgar) is a positive assertion, that a condition _must_ be true.
    - [`?<` wutgal](../rune/wut.md#wutgal) is a negative assertion, that a condition _must_ be false.
    - [`?~` wutsig](../rune/wut.md#wutsig) is a branch on null.

    For instance, some operations require a `lest`, a `list` guaranteed to be non-null (that is, `^-  (list)  ~` is excluded).

    ```hoon
    > =/  list=(list @)  ~[1 2 3]
     i.list
    -find.i.list
    find-fork
    dojo: hoon expression failed
    ```

    `?~` wutsig solves the problem for this case:

    ```hoon
    > =/  list=(list @)  ~[1 2 3]
     ?~  list  !!
     i.list
    1
    ```
    
    In general, if you see an error like `find.fork`, it means that the type system is confused by your use of a too general of a type for a particular case.  Use the assertion runes to correct its assumption.

- [Testing Code](../../build-on-urbit/hoon-school/I-testing.md) - This module will discuss how we can have confidence that a program does what it claims to do, using unit testing and debugging strategies.
- [Unit Tests](../../build-on-urbit/userspace/unit-tests.md)
