---
description: "Advanced core concepts including doors (gate-building gates), doors as parametrized cores with sample data, working with `+map`s (key-value stores), and stateful computation patterns."
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

# 10. Cores and Doors

_Hoon is statically typed, which means (among other things) that auras are subject to strict nesting rules, molds are crash-only, and the whole thing is rather cantankerous about matching types. However, since gate-building arms are possible, Hoon developers frequently employ them as templates to build type-appropriate cores, including gates. This module will start by introducing the concept of gate-building gates; then it will expand our notion of cores to include doors; finally it will introduce a common door, the [`+map`](../../hoon/stdlib/2o.md#map), to illustrate how doors work._

## Gate-Building Gates {#gate-building-gates}

### Calling Gates {#calling-gates}

There are two ways of making a function call in Hoon. First, you can call a gate in the subject by name. For instance, we can produce a gate `+inc` which adds `1` to an input:

```
> =inc |=(a=@ (add 1 a))

> (inc 10)
11

> =inc
```

The second way of making a function call involves an expression that _produces_ a gate on demand:

```
> (|=(a=@ (add 1 a)) 123)
124

> (|=(a=@ (mul 2 a)) 123)
246
```

The difference is subtle: the first case has an already-created gate in the subject when we called it, while the latter involves producing a gate that doesn't exist anywhere in the subject, and then calling it.

Are calls to [`+add`](../../hoon/stdlib/1a.md#add) and [`+mul`](../../hoon/stdlib/1a.md#mul) of the Hoon standard library of the first kind, or the second?

```
> (add 12 23)
35

> (mul 12 23)
276
```

They're of the second kind. Neither `+add` nor `+mul` resolves to a gate directly; they're each arms that _produce_ gates.

Often the difference doesn't matter much. Either way you can do a function call using the "(gate arg)" syntax.

It's important to learn the difference, however, because for certain use cases you'll want the extra flexibility that comes with having an already produced core in the subject.

### Building Gates {#building-gates}

Let's make a core with arms that build gates of various kinds. As we did in a previous lesson, we'll use the `|%` [barcen](../../hoon/rune/bar.md#barcen) rune. Copy and paste the following into the Dojo:

```
=c |%
++  inc      |=(a=@ (add 1 a))
++  add-two  |=(a=@ (inc (inc a)))
++  double   |=(a=@ (mul 2 a))
++  triple   |=(a=@ (mul 3 a))
--
```

Let's try out these arms, using them for function calls:

```
> (inc:c 10)
11

> (add-two:c 10)
12

> (double:c 10)
20

> (triple:c 10)
30
```

Notice that each arm in core `.c` is able to call the other arms of `.c`; `+add-two` uses the `+inc` arm to increment a number twice. As a reminder, each arm is evaluated with its parent core as the subject. In the case of `+add-two` the parent core is `.c`, which has `+inc` in it.

#### Mutating a Gate

Let's say you want to modify the default sample of the gate for `+double`. We can infer the default sample by calling `+double` with no argument:

```
> (double:c)
0
```

Given that *a x 2 = 0*, *a* must be 0. (Remember that `a` is the face for the `+double` sample, as defined in the core we bound to the face `c` above.)

Let's say we want to mutate the `+double` gate so that the default sample is `25`. There is only one problem: `+double` isn't a gate!

```
> double.c(a 25)
-tack.a
-find.a
dojo: hoon expression failed
```

It's an arm that produces a gate, and `.a` cannot be found in `+double` until the gate is created. Furthermore, every time the gate is created, it has the default sample, `0`. If you want to mutate the gate produced by `+double`, you'll first have to put a copy of that gate into the subject:

```
> =double-copy double:c

> (double-copy 123)
246
```

Now let's mutate the sample to `25`, and check that it worked with `+6`. (The sample lives at `+6` in a given core tree.)

```
> +6:double-copy(a 25)
a=25
```

Good. Let's call it with no argument and see if it returns double the value of the modified sample.

```
> (double-copy(a 25))
50
```

It does indeed. Unbind the faces `c` and `double-copy`:

```
> =c

> =double-copy
```

Contrast this with the behavior of [`+add`](../../hoon/stdlib/1a.md#add). We can look at the sample of the gate for `+add` with `+6:add`:

```
> +6:add
[a=0 b=0]
```

If you try to mutate the default sample of `+add`, it won't work:

```
> add(a 3)
-tack.a
-find.a
dojo: hoon expression failed
```

As before with `+double`, Hoon can't find an `.a` to modify in a gate that doesn't exist yet.

### Slamming a Gate {#slamming-a-gate}

If you check the docs on our now-familiar `%-` [cenhep](../../hoon/rune/cen.md#cenhep), you'll find that it is actually sugar syntax for another rune:

> This rune is for evaluating the `$` arm of a gate, i.e., calling a
> gate as a function. `.a` is the gate, and `.b` is the desired sample value
> (i.e., input value) for the gate.
>
> ```hoon
> %~($ a b)
> ```

So all gate calls actually pass back through `%~` [censig](../../hoon/rune/cen.md#censig). What's the difference?

The `%~` [censig](../../hoon/rune/cen.md#censig) rune accepts three children:

- A wing which resolves to an arm in a door.
- The aforesaid door.
- A sample for the door.

Basically, whenever you use `%-` [cenhep](../../hoon/rune/cen.md#cenhep), it actually looks up a wing in a door using `%~` [censig](../../hoon/rune/cen.md#censig), which is a more general type of core than a gate. Whatever that wing resolves to is then provided a sample. The resulting Hoon expression is evaluated and the value is returned.


## Doors {#doors}

Doors are another kind of core whose arms evaluate to make gates, as we just discovered. The difference is that a door also has its own sample. A door is the most general case of a function in Hoon. (You could say a "gate-building core" or a "function-building function" to clarify what the intent of most of these are.)

A core is a cell of code and data we call "\[battery payload]". The battery contains a series of arms, and the payload contains all the data necessary to run those arms correctly.

A "door" is a core with a sample. That is, a door is a core whose payload is a cell of sample and context: \[sample context]. A door's overall sample can affect how its gate-building arms work.

```
        door
       /    \
battery      .
            / \
      sample   context
```

It follows from this definition that a gate is a special case of a door. A gate is a door with exactly one arm, named `$` ("buc").

Doors are created with the `|_` [barcab](../../hoon/rune/bar.md#barcab) rune. Doors get used for a few different purposes in the standard library:

- Instrumenting and storing persistent data structures like `+map`s (this module and the next)
- Implementing state machines (the [subject-oriented programming module](O-subject.md))

One *big* pitfall for thinking about doors is thinking of them as “containing” gates, as if they were more like “objects”. Instead, think of them the same way as you think of gates, just that they can be altered at a higher level.

#### Example: The Quadratic Equation

First, a mathematical example. If we wanted to calculate a quadratic polynomial, _y = a x² + b x + c_, then we need to know two kinds of things: the unknown or variable _x_, AND the parameters _a_, _b_, and _c_. These aren't really the same kind of thing. When we calculate a particular curve _y_(_x_), we assume that the parameters _a_, _b_, and _c_ stay constant across evaluations of _x_, and it's inconvenient for us to specify them every single time.

If we were to build this as a gate, we would need to pass in four parameters:

```
> =poly-gate |=  [x=@ud a=@ud b=@ud c=@ud]
(add (add (mul a (mul x x)) (mul b x)) c)
```

Any time we call the gate, we have to provide all four values: one unknown, three parameters. But there's a sense in which we want to separate the three parameters and only call the gate with one `.x` value. One way to accomplish this is to wrap the gate inside of another:

```
> =wrapped-gate |=  [x=@ud]
=/  a  5
=/  b  4
=/  c  3
(poly-gate x a b c)
```

If we built this as a door instead, we could push the parameters out to a different layer of the structure. In this case, the parameters are the sample of the door, while the arm `+quad` builds a gate that corresponds to those parameters and only accepts one unknown variable `.x`. To make a door we use the `|_` [barcab](../../hoon/rune/bar.md#barcab) rune, which we'll discuss later:

```
> =poly |_  [a=@ud b=@ud c=@ud]
++  quad
  |=  x=@ud
  (add (add (mul a (mul x x)) (mul b x)) c)
--
```

This will be used in two steps: a gate-building step then a gate usage step.

We produce a gate from a door's arm using the `%~` [censig](../../hoon/rune/cen.md#censig) rune, almost always used in its irregular form, `~()`. Here we prime the door with `[5 4 3]`, which yields a gate:

```hoon
~(quad poly [5 4 3])
```

By itself, not so much to say. We could pin it into the Dojo, for instance, to use later. Our ultimate goal is to use the built gate on particular data, however:

```
> (~(quad poly [5 4 3]) 2)
31
```

By hand: *5×2² + 4×2 + 3 = 31*, so that's correct.

Doors will enable us to build some very powerful data storage tools by letting us defer parts of a gate calculation to other stages of building and calculating the gate.

#### Example: A Calculator

Let's unpack what's going on more with this next door. Each of the arms in this example door will define a simple gate. Let's bind the door to `.c`. To make a door we use the `|_` [barcab](../../hoon/rune/bar.md#barcab) rune:

```
=c |_  b=@
++  plus  |=(a=@ (add a b))
++  times  |=(a=@ (mul a b))
++  greater  |=(a=@ (gth a b))
--
```

If you type this into the Dojo manually, make sure you attend carefully to the spacing. Feel free to cut and paste the code, if desired.

Before getting into what these arms do, let's digress into how the `|_` [barcab](../../hoon/rune/bar.md#barcab) rune works in general.

`|_` [barcab](../../hoon/rune/bar.md#barcab) works exactly like the `|%` [barcen](../../hoon/rune/bar.md#barcen) rune for making a core, except that it takes one additional daughter expression, the door's sample. Following that are a series of `++` [luslus](../../hoon/rune/lus.md#luslus) runes, each of which defines an arm of the door. Finally, the expression is terminated with a `--` [hephep](../../hoon/rune/terminators.md#hephep) rune.

A door really is, at the bedrock level, the same thing as a core with a sample. Let's ask Dojo to pretty print a simple door.

```
> =a =>  ~  |_  b=@  ++  foo  b  --

> a
<1.zgd [b=@ %~]>
```

Dojo tells us that `.a` is a core with one arm and a payload of `[b=@ %~]`. Since a door's payload is \[sample context], this means that `.b` is the sample and the context is null. (The `=> ~` set the context. We did this to avoid including the standard library that is included in the context by default in Dojo, which would have made the pretty-printed core much more verbose. Try it without `=>  ~` as well.)

For the door defined above, `.c`, the sample is defined as a `@` atom and given the face `.b`. The `+plus` arm defines a gate that takes a single atom as its argument `.a` and returns the sum of `.a` and `.b`. The `+times` arm defines a gate that takes a single atom `.a` and returns the product of `.a` and `.b`. The `+greater` arm defines a gate that takes a single atom `.a`, and returns `%.y` if `.a` is greater than `.b`; otherwise it returns `%.n`.

Let's try out the arms of `.c` with ordinary function calls:

```
> (plus:c 10)
10

> (times:c 10)
0

> (greater:c 10)
%.y
```

This works, but the results are not exciting. Passing `10` to the `+plus` gate returns `10`, so it must be that the value of `.b` is `0` (the bunt value of `@`). The products of the other function calls reinforce that assessment. Let's look directly at `+6` of `.c` to see the sample:

```
> +6:c
b=0
```

Having confirmed that `.b` is `0`, let's mutate the `.c` sample and then call its arms:

```
> (plus:c(b 7) 10)
17

> (times:c(b 7) 10)
70

> (greater:c(b 7) 10)
%.y

> (greater:c(b 17) 10)
%.n
```

Doing the same mutation repeatedly can be tedious, so let's bind `.c` to the modified version of the door, where `.b` is `7`:

```
> =c c(b 7)

> (plus:c 10)
17

> (times:c 10)
70

> (greater:c 10)
%.y
```

There's a more direct way of passing arguments for both the door sample and the gate sample simultaneously. We may use the "\~(arm door arg)" syntax. This generates the _arm_ product after modifying the _door_'s sample to be _arg_.

```
> (~(plus c 7) 10)
17

> (~(times c 7) 10)
70

> (~(greater c 7) 10)
%.y

> (~(greater c 17) 10)
%.n
```

Readers with some mathematical background may notice that "\~(...)" expressions allow us to [curry](https://en.wikipedia.org/wiki/Currying). For each of the arms above, the "\~(...)" expression is used to create different versions of the same gate:

```
> ~(plus c 7)
< 1.xpd
  [ a=@
    < 3.bnz
      [ b=@
        [our=@p now=@da eny=@uvJ]
        <15.eah 40.ihi 14.tdo 54.xjm 77.vsv 236.zqw 51.njr 139.oyl 33.uof 1.pnw %138>
      ]
    >
  ]
>

> b:~(plus c 7)
7

> b:~(plus c 17)
17
```

Thus, you may think of the `.c` door as a function for making functions. Use the "\~(arm c arg)" syntax. _arm_ defines which kind of gate is produced (i.e., which arm of the door is used to create the gate), and _arg_ defines the value of _b_ in that gate, which in turn affects the product value of the gate produced.

The standard library provides [currying functionality](Q-func.md) outside of the context of doors.

#### Creating Doors with a Modified Sample

In the above example we created a door `.c` with sample `b=@` and found that the initial value of `.b` was `0`, the default value of type `@`. We then created new door from `.c` by modifying the value of `.b`. But what if we wish to define a door with a chosen sample value directly? We make use of the `$_` [buccab](../../hoon/rune/buc.md#buccab) rune, whose irregular form is simply `_`. To create the door `.c` with the sample `b=@` set to have the value `7` in the dojo, we would write

```
=c |_  b=_7
++  plus  |=(a=@ (add a b))
++  times  |=(a=@ (mul a b))
++  greater  |=(a=@ (gth a b))
--
```

Here the type of `.b` is inferred to be `@` based on the example value `7`, similar to how we've seen casting done by example. You will learn more about how types are inferred in the [next module](L-struct.md).

### Exercise: Adding Arms to a Door {#exercise-adding-arms-to-a-door}

Recall the quadratic equation door.

```hoon
|_  [a=@ud b=@ud c=@ud]
++  quad
  |=  x=@ud
  (add (add (mul a (mul x x)) (mul b x)) c)
--
```

1. Add an arm to the door which calculates the linear function *a × x + b*.
2. Add another arm which calculates the derivative of the first quadratic function, *2 × a × x + b*.


## Key-Value Pairs: `+map` as Door {#key-value-pairs-map-as-door}

In general terms, a [`+map`](../../hoon/stdlib/2o.md#map) is a pattern from a key to a value. You can think of a dictionary, or an index, or a data table. Essentially it scans for a particular key, then returns the data associated with that key (which may be any noun).

For example, a `(map @t @t)` called might "map" car brands to models:

| Key           | Value        |
| ------------- | ------------ |
| `'Mazda'`     | `'RX-8'`     |
| `'Dodge'`     | `'Viper'`    |
| `'Ford'`      | `'Mustang'`  |
| `'Chevrolet'` | `'Chevelle'` |
| `'Porsche'`   | `'Boxster'`  |
| `'Bugatti'`   | `'Type 22'`  |

While `+map` is the name of the mold or type of the value, the door which affords `+map`-related functionality is named [`+by`](../../hoon/stdlib/2i.md#by). (This felicitously affords us a way to read `+map` operations in an English-friendly phrasing, e.g. "(\~(get by cars) 'Ford')".)

In Urbit, all values are static and never change. (This is why we “overwrite” or replace the values in a limb to change it with `%=` [centis](../../hoon/rune/cen.md#centis).)  This means that when we build a `+map`, we often rather awkwardly replace it with its modified value explicitly.

We'll build a color `+map`, from a `@tas` of a [color's name](https://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors) to its HTML hexadecimal representation as a `@ux` hex value.

We can produce a `+map` from a list of key-value cells using the [`+malt`](../../hoon/stdlib/2l.md#malt) function. Using `@tas` terms as keys (which is common) requires us to explicitly mark the list as `(list (pair @tas @ux))`:

```
=colors (malt `(list (pair @tas @ux))`~[[%red 0xed.0a3f] [%yellow 0xfb.e870] [%green 0x1.a638] [%blue 0x66ff]])
```

To insert one key-value pair at a time, we use [`+put:by`](../../hoon/stdlib/2i.md#putby). In the Dojo, we need to either pin it into the subject or modify a copy of the map for the rest of the expression using `=/` [tisfas](../../hoon/rune/tis.md#tisfas).

```
=colors (~(put by colors) [%orange 0xff.8833])
=colors (~(put by colors) [%violet 0x83.59a3])
=colors (~(put by colors) [%black 0x0])
```

Note the pattern here: there is a [`+put`](../../hoon/stdlib/2i.md#putby) arm of [`+by`](../../hoon/stdlib/2i.md#by) which builds a gate to modify `.colors` by inserting a value.

What happens if we try to add something that doesn't match the type?

```
=colors (~(put by colors) [%cerulean '#02A4D3'])
```

We'll see a `mull-grow`, a `mull-nice`, and a [`nest-fail`](../../hoon/hoon-errors.md#nest-fail). Essentially these are all flavors of mold-matching errors.

(As an aside, `+put:by` is also how you'd replace an existing key's value.)

The point of a `+map` is to make it easy to retrieve data values given their appropriate key. Use [+get:by](../../hoon/stdlib/2i.md#getby):

```
> (~(get by colors) %orange)
[~ 0xff.8833]
```

What is that cell?  Wasn't the value stored as `0xff.8833`?  Well, one fundamental problem that a [`+map`](../../hoon/stdlib/2o.md#map) needs to solve is to allow us to distinguish an _empty_ result (or failure to locate a value) from a _zero_ result (or an answer that's actually zero). To this end, the [`+unit`](../../hoon/stdlib/1c.md#unit) was introduced, a type union of a `~` (for no result) and `[~ item]` (for when a result exists).

(As an exercise, what does `[~ ~]` mean when returned from a `+map`?)

You'll find that `+unit`s are common enough that they have their own syntax and set of operational functions. We'll look at them more in [the next module](L-struct.md).

```
> (~(get by colors) %brown)
~
```

The arm ([+got:by](../../hoon/stdlib/2i.md#gotby) returns the key's value without the `+unit` wrapper, but crashes on failure to locate. We recommend just using `+get:by` and extracting the tail of the resulting cell after confirming it isn't null with `?~` [wutsig](../../hoon/rune/wut.md#wutsig). See also [`+gut:by`](../../hoon/stdlib/2i.md#gutby) which allows a default in case of failure to locate.)

You can check whether a key is present using [`+has:by`](../../hoon/stdlib/2i.md#hasby):

```
> (~(has by colors) %teal)
%.n

> (~(has by colors) %green)
%.y
```

You can get a list of all keys with [`+key:by`](../../hoon/stdlib/2i.md#keyby):

```
> ~(key by colors)
{%black %red %blue %violet %green %yellow %orange}
```

You can apply a gate to each value using [`+run:by`](../../hoon/stdlib/2i.md#runby). For instance, these gates will break the color hexadecimal value into red, green, and blue components:

```
> =red |=(a=@ux ^-(@ux (cut 2 [4 2] a)))

> =green |=(a=@ux ^-(@ux (cut 2 [2 2] a)))

> =blue |=(a=@ux ^-(@ux (cut 2 [0 2] a)))

> (~(run by colors) blue)
{ [p=%black q=0x0]  
 [p=%red q=0x3f]  
 [p=%blue q=0xff]  
 [p=%violet q=0xa3]  
 [p=%green q=0x38]  
 [p=%yellow q=0x70]  
 [p=%orange q=0x33]  
}
```

### Exercise: Display Cards {#exercise-display-cards}

Recall the `/lib/playing-cards.hoon` library. Use a map to pretty-print the `$darc`s as Unicode card symbols.

The map type should be `(map darc @t)`. We'll use [`+malt`](../../hoon/stdlib/2l.md#malt) to build it and associate the fancy (if tiny) [Unicode playing card symbols](https://en.wikipedia.org/wiki/Playing_cards_in_Unicode).

Add the following arms to the library core:

<details>
<summary>+pp-card and +card-table arms</summary>

```hoon
++  pp-card
  |=  c=darc
  (~(got by card-table) c)
++  card-table
  %-  malt
  ^-  (list [darc @t])
  :~  :-  [sut=%clubs val=1]  '🃑'
      :-  [sut=%clubs val=2]  '🃒'
      :-  [sut=%clubs val=3]  '🃓'
      :-  [sut=%clubs val=4]  '🃔'
      :-  [sut=%clubs val=5]  '🃕'
      :-  [sut=%clubs val=6]  '🃖'
      :-  [sut=%clubs val=7]  '🃗'
      :-  [sut=%clubs val=8]  '🃘'
      :-  [sut=%clubs val=9]  '🃙'
      :-  [sut=%clubs val=10]  '🃚'
      :-  [sut=%clubs val=11]  '🃛'
      :-  [sut=%clubs val=12]  '🃝'
      :-  [sut=%clubs val=13]  '🃞'
      :-  [sut=%diamonds val=1]  '🃁'
      :-  [sut=%diamonds val=2]  '🃂'
      :-  [sut=%diamonds val=3]  '🃃'
      :-  [sut=%diamonds val=4]  '🃄'
      :-  [sut=%diamonds val=5]  '🃅'
      :-  [sut=%diamonds val=6]  '🃆'
      :-  [sut=%diamonds val=7]  '🃇'
      :-  [sut=%diamonds val=8]  '🃈'
      :-  [sut=%diamonds val=9]  '🃉'
      :-  [sut=%diamonds val=10]  '🃊'
      :-  [sut=%diamonds val=11]  '🃋'
      :-  [sut=%diamonds val=12]  '🃍'
      :-  [sut=%diamonds val=13]  '🃎'
      :-  [sut=%hearts val=1]  '🂱'
      :-  [sut=%hearts val=2]  '🂲'
      :-  [sut=%hearts val=3]  '🂳'
      :-  [sut=%hearts val=4]  '🂴'
      :-  [sut=%hearts val=5]  '🂵'
      :-  [sut=%hearts val=6]  '🂶'
      :-  [sut=%hearts val=7]  '🂷'
      :-  [sut=%hearts val=8]  '🂸'
      :-  [sut=%hearts val=9]  '🂹'
      :-  [sut=%hearts val=10]  '🂺'
      :-  [sut=%hearts val=11]  '🂻'
      :-  [sut=%hearts val=12]  '🂽'
      :-  [sut=%hearts val=13]  '🂾'
      :-  [sut=%spades val=1]  '🂡'
      :-  [sut=%spades val=2]  '🂢'
      :-  [sut=%spades val=3]  '🂣'
      :-  [sut=%spades val=4]  '🂤'
      :-  [sut=%spades val=5]  '🂥'
      :-  [sut=%spades val=6]  '🂦'
      :-  [sut=%spades val=7]  '🂧'
      :-  [sut=%spades val=8]  '🂨'
      :-  [sut=%spades val=9]  '🂩'
      :-  [sut=%spades val=10]  '🂪'
      :-  [sut=%spades val=11]  '🂫'
      :-  [sut=%spades val=12]  '🂭'
      :-  [sut=%spades val=13]  '🂮'
  ==
```

</details>

Import the library in Dojo (or use `/+` [faslus](../../hoon/rune/fas.md#faslus) in a generator) and build a deck:

```
> =playing-cards -build-file /===/lib/playing-cards/hoon

> =deck (shuffle-deck:playing-cards make-deck:playing-cards eny)
> deck
~[
  [sut=%spades val=12]
  [sut=%spades val=8]
  [sut=%hearts val=5]
  [sut=%clubs val=2]
  [sut=%diamonds val=10]
  ...
  [sut=%spades val=2]
  [sut=%hearts val=6]
  [sut=%hearts val=12]
]
```

Finally, render each card in the hand to a `@t`:

```
> =new-deck (draw:playing-cards 5 deck)

> =/  index  0
  =/  hand  *(list @t)
  |-
  ?:  =(index (lent hand:new-deck))
    hand
  $(index +(index), hand (snoc hand (pp-card:playing-cards (snag index hand:new-deck))))
<|🂭 🂨 🂵 🃒 🃊|>
```

#### Tutorial: Caesar Cipher

The Caesar cipher is a shift cipher ([that was indeed used anciently](https://en.wikipedia.org/wiki/Caesar_cipher)) wherein each letter in a message is encrypted by replacing it with one shifted some number of positions down the alphabet. For example, with a “right-shift” of 1, "a" would become "b", "j" would become "k", and "z" would wrap around back to "a".

Consider the message below, and the cipher that results when we Caesar-shift the message to the right by 1.

```
Plaintext message:   "do not give way to anger"
Right-shifted cipher: "ep opu hjwf xbz up bohfs"
```

Below is a generator that performs a Caesar cipher on a tape. This example isn't the most compact implementation of such a cipher in Hoon, but it demonstrates important principles that more laconic code would not. Save it as `/gen/caesar.hoon` on your `%base` desk.

<details>
<summary>/gen/caesar.hoon</summary>

```hoon
!:
|=  [msg=tape steps=@ud]
=<
=.  msg  (cass msg)
:-  (shift msg steps)
    (unshift msg steps)
::
|%
++  alpha  "abcdefghijklmnopqrstuvwxyz"
::  Shift a message to the right.
::
++  shift
  |=  [message=tape steps=@ud]
  ^-  tape
  (operate message (encoder steps))
::  Shift a message to the left.
::
++  unshift
  |=  [message=tape steps=@ud]
  ^-  tape
  (operate message (decoder steps))
::  Rotate forwards into encryption.
::
++  encoder
  |=  [steps=@ud]
  ^-  (map @t @t)
  =/  value-tape=tape  (rotation alpha steps)
  (space-adder alpha value-tape)
::  Rotate backwards out of encryption.
::
++  decoder
  |=  [steps=@ud]
  ^-  (map @t @t)
  =/  value-tape=tape  (rotation alpha steps)
  (space-adder value-tape alpha)
::  Apply the map of decrypted->encrypted letters to the message.
::
++  operate
  |=  [message=tape shift-map=(map @t @t)]
  ^-  tape
  %+  turn  message
  |=  a=@t
  (~(got by shift-map) a)
::  Handle spaces in the message.
::
++  space-adder
  |=  [key-position=tape value-result=tape]
  ^-  (map @t @t)
  (~(put by (map-maker key-position value-result)) ' ' ' ')
::  Produce a map from each letter to its encrypted value.
::
++  map-maker
  |=  [key-position=tape value-result=tape]
  ^-  (map @t @t)
  =|  chart=(map @t @t)
  ?.  =((lent key-position) (lent value-result))
    ~|  %uneven-lengths  !!
  |-
  ?:  |(?=(~ key-position) ?=(~ value-result))
    chart
  $(chart (~(put by chart) i.key-position i.value-result), key-position t.key-position, value-result t.value-result)
::  Cycle an alphabet around, e.g. from
::  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' to 'BCDEFGHIJKLMNOPQRSTUVWXYZA'
::
++  rotation
  |=  [my-alphabet=tape my-steps=@ud]
  =/  length=@ud  (lent my-alphabet)
  =+  (trim (mod my-steps length) my-alphabet)
  (weld q p)
--
```

</details>

This generator takes two arguments: a tape, which is your plaintext message, and an unsigned integer, which is the shift-value of the cipher. It produces a cell of two `$tape`s: one that has been shifted right by the value, and another that has been shifted left. It also converts any uppercase input into lowercase.

Try it out in the Dojo:

```
> +caesar ["abcdef" 1]
["bcdefg" "zabcde"]

> +caesar ["test" 2]
["vguv" "rcqr"]

> +caesar ["test" 26]
["test" "test"]

> +caesar ["test" 28]
["vguv" "rcqr"]

> +caesar ["test" 104]
["test" "test"]

> +caesar ["tESt" 2]
["vguv" "rcqr"]

> +caesar ["test!" 2]
nest-fail
```

##### Examining the Code

Let's examine our caesar.hoon code piece by piece. We won't necessarily go in written order; instead, we'll cover code in the intuitive order of the program. For each chunk that we cover, try to read and understand the code itself before reading the explanation.

There are a few runes in this which we haven't seen yet; we will deal with them incidentally in the commentary.

```hoon
!:
|=  [msg=tape steps=@ud]
=<
```

The `!:` [zapcol](../../hoon/rune/zap.md#zapcol) in the first line of the above code enables a full stack trace in the event of an error.

`|= [msg=tape steps=@ud]` creates a gate that takes a cell. The head of this cell is a `$tape`, which is a string type that's a list of `$cord`s. Tapes are represented as text surrounded by double-quotes, such as this: `"a tape"`. We give this input tape the face `msg`. The tail of our cell is a `@ud` -- an unsigned decimal atom -- that we give the face `steps`.

`=<` [zapgal](../../hoon/rune/tis.md#tisgal) is the rune that evaluates its first child expression with respect to its second child expression as the subject. In this case, we evaluate the expressions in the code chunk below against the core declared later, which allows us reference the core's contained arms before they are defined. Without `=<`, we would need to put the code chunk below at the bottom of our program. In Hoon, as previously stated, we always want to keep the longer code towards the bottom of our programs - `=<` helps us do that.

```hoon
=.  msg  (cass msg)
:-  (shift msg steps)
    (unshift msg steps)
```

`=. msg (cass msg)` changes the input string `.msg` to lowercases. `=.` [tisdot](../../hoon/rune/tis.md#tisdot) changes the leg of the subject to something else. In our case, the leg to be changed is `.msg`, and the thing to replace it is `(cass msg)`. `+cass` is a gate in `hoon.hoon` that converts uppercase letters to lowercase.

`:- (shift msg steps)` and `(unshift msg steps)` simply composes a cell of a right-shifted cipher and a left-shifted cipher of our original message. We will see how this is done using the core described below, but this is the final output of our generator. We have indented the lower line, which is not strictly good Hoon style but makes the intent clearer.

```hoon
|%
```

`|%` [barcen](../../hoon/rune/bar.md#barcen) creates a core, the second child of `=<` [tisgal](../../hoon/rune/tis.md#tisgal). Everything after `|%` is part of that second child `+core`, and will be used as the subject of the first child of `=<`, described above. The various parts, or arms, of the `+core` are denoted by `++` [luslus](../../hoon/rune/lus.md#luslus) beneath it, for instance:

```hoon
++  rotation
  |=  [my-alphabet=tape my-steps=@ud]
  =/  length=@ud  (lent my-alphabet)
  =+  (trim (mod my-steps length) my-alphabet)
  (weld q p)
```

The `+rotation` arm takes takes a specified number of characters off of a tape and puts them on the end of the tape. We're going to use this to create our shifted alphabet, based on the number of `.my-steps` given as an argument to our gate.

`|=  [my-alphabet=tape my-steps=@ud]` creates a gate that takes two arguments: `.my-alphabet`, a `$tape`, and `.my-steps`, a `@ud`.

`=/  length=@ud (lent my-alphabet)` stores the length of `.my-alphabet` to make the following code a little clearer.

The [`+trim`](../../hoon/stdlib/4b.md#trim) gate from the standard library splits a tape into two parts at a specified position. So `=+  (trim (mod my-steps length) my-alphabet)` splits the tape `.my-alphabet` into two parts, `.p` and `.q`, which are now directly available in the subject. We call the modulus operation `+mod` to make sure that the point at which we split our `$tape` is a valid point inside of `.my-alphabet` even if `.my-steps` is greater than `.length`, the length of `.my-alphabet`. Try trim in the dojo:

```
> (trim 2 "abcdefg")
[p="ab" q="cdefg"]

> (trim 4 "yourbeard")
[p="your" q="beard"]
```

The expression `(weld q p)` uses [`+weld`](../../hoon/stdlib/2b.md#weld), which combines two strings into one. Remember that `+trim` has given us a split version of `.my-alphabet` with `.p` being the front half that was split off of `.my-alphabet` and `.q` being the back half. Here we are welding the two parts back together, but in reverse order: the second part `.q` is welded to the front, and the first part `.p` is welded to the back.

```hoon
++  map-maker
  |=  [key-position=tape value-result=tape]
  ^-  (map @t @t)
  =|  chart=(map @t @t)
  ?.  =((lent key-position) (lent value-result))
    ~|  %uneven-lengths  !!
  |-
  ?:  |(?=(~ key-position) ?=(~ value-result))
    chart
  $(chart (~(put by chart) i.key-position i.value-result), key-position t.key-position, value-result t.value-result)
```

The `+map-maker` arm, as the name implies, takes two tapes and creates a [`+map`](../../hoon/stdlib/2o.md#map) out of them. A `+map` is a type equivalent to a dictionary in other languages: it's a data structure that associates a key with a value. If, for example, we wanted to have an association between `'a'` to `'1'` and `'b'` to `'2'`, we could use a `+map`.

`|=  [a=tape b=tape]` builds a gate that takes two tapes, `.a` and `.b`, as its sample.

`^-  (map @t @t)` casts the gate to a `+map` with a `$cord` (or `@t`) key and a `$cord` value.

You might wonder, if our gate in this arm takes `$tape`s, why then are we producing a map of `$cord` keys and values?

As we discussed earlier, a tape is a list of `$cord`s. In this case what we are going to do is map a single element of a `$tape` (either our alphabet or shifted-alphabet) to an element of a different `$tape` (either our shifted-alphabet or our alphabet). This pair will therefore be a pair of `$cord`s. When we go to use this `+map` to convert our incoming `.msg`, we will take each element (`$cord`) of our `.msg` `$tape`, use it as a key when accessing our `+map` and get the corresponding value from that position in the `+map`. This is how we're going to encode or decode our `.msg` `$tape`.

`=|  chart=(map @t @t)` adds a noun to the subject with the default value of the `(map @t @t)` type, and gives that noun the face `chart`.

`?.  =((lent key-position) (lent value-result))` checks if the two `$tape`s are the same length. If not, the program crashes with an error message of `%uneven-lengths`, using `~|  %uneven-lengths  !!`.

If the two `$tape`s are of the same length, we continue on to create a trap. `|-` [barhep](../../hoon/rune/bar.md#barhep) creates a trap, a gate with no arguments that is called immediately.

`?:  |(?=(~ key-position) ?=(~ value-result))` checks if either `$tape` is empty. If this is true, the `+map-maker` arm is finished and can return `.chart`, the [map](../../hoon/stdlib/2o.md#map) that we have been creating.

If the above test finds that the `$tape`s are not empty, we trigger a recursion that constructs our `+map`: `$(chart (~(put by chart) i.a i.b), a t.a, b t.b)`. This code recursively adds an entry in our `+map` where the head of the `$tape` `.a` maps to the value of the head of `$tape` `.b` with `~(put by chart)`, our calling of the [`+put:by`](../../hoon/stdlib/2i.md#putby) arm of the [`+by`](../../hoon/stdlib/2i.md#by) map engine core (note that "\~(\<wing> \<door> \<sample>)" is a shorthand for "%~  \<wing>  \<door>  \<sample>" (see the `%~` [censig](../../hoon/rune/cen.md#censig) documentation for more information). The recursion also "consumes" those heads with every iteration by changing `.a` and `.b` to their tails using `a t.a, b t.b`.

We have three related arms to look at next, `+decoder`, `+encoder`, and `+space-adder`. `+space-adder` is required for the other two, so we'll look at it first.

```hoon
++  space-adder
  |=  [key-position=tape value-result=tape]
  ^-  (map @t @t)
  (~(put by (map-maker key-position value-result)) ' ' ' ')
```

`|=  [key-position=tape value-result=tape]` creates a gate that takes two `$tape`s.

We use the [`+put`](../../hoon/stdlib/2i.md#putby) arm of the [`+by`](../../hoon/stdlib/2i.md#by) core on the next line, giving it a [`+map`](../../hoon/stdlib/2o.md#map) produced by the `+map-maker` arm that we created before as its sample. This adds an entry to the map where the single space character ` ` ("ace") simply maps to itself. This is done to simplify the handling of spaces in tapes we want to encode, since we don't want to shift them.

```hoon
++  encoder
  |=  [steps=@ud]
  ^-  (map @t @t)
  =/  value-tape=tape  (rotation alpha steps)
  (space-adder alpha value-tape)
++  decoder
  |=  [steps=@ud]
  ^-  (map @t @t)
  =/  key-tape=tape  (rotation alpha steps)
  (space-adder key-tape alpha)
```

`+encoder` and `+decoder` utilize the `+rotation` and `+space-adder` arms. These gates are essentially identical, with the arguments passed to `+space-adder` reversed. They simplify the two common transactions you want to do in this program: producing `+map`s that we can use to encode and decode messages.

In both cases, we create a gate that accepts a `@ud` named `.steps`. In `+encoder`: `=/  value-tape=tape (rotation alpha steps)` creates a `.value-tape` noun by calling `+rotation` on `+alpha`. `+alpha` is our arm which contains a `$tape` of the entire alphabet. The `.value-tape` will be the list of values in our [map](../../hoon/stdlib/2o.md#map).

In `+decoder`: `=/  key-tape  (rotation alpha steps)` does the same work, but when passed to `+space-adder` it will be the list of keys in our `+map`.

The expressions `(space-adder alpha value-tape)`, for `+encoder`, and `(space-adder key-tape alpha)`, for `+decoder`, both produce a `+map` that has the first argument as the keys and the second as the values.

If our two inputs to `+space-adder` were `"abcdefghijklmnopqrstuvwxyz"` and `"bcdefghijklmnopqrstuvwxyza"`, we would get a `+map` where `'a'` maps to `'b'`, `'b'` to `'c'` and so on. By doing this we can produce a `+map` that gives us a translation between the alphabet and our shifted alphabet, or vice versa.

Still with us? Good. We are finally about to use all the stuff that we've walked through.

```hoon
++  shift
  |=  [message=tape shift-steps=@ud]
  ^-  tape
  (operate message (encoder shift-steps))
++  unshift
  |=  [message=tape shift-steps=@ud]
  ^-  tape
  (operate message (decoder shift-steps))
```

Both `+shift` and `+unshift` take two arguments: our `.message`, the `$tape` that we want to manipulate; and our `.shift-steps`, the number of positions of the alphabet by which we want to shift our message.

`+shift` is for encoding, and `+unshift` is for decoding. Thus, `+shift` calls the `+operate` arm with `(operate message (encoder shift-steps))`, and `+unshift` makes that call with `(operate message (decoder shift-steps))`. These both produce the final output of the core, to be called in the form of `(shift msg steps)` and `(unshift msg steps)` in the cell being created at the beginning of our code.

```hoon
++  operate
  |=  [message=tape shift-map=(map @t @t)]
  ^-  tape
  %+  turn  message
  |=  a=@t
  (~(got by shift-map) a)
```

`+operate` produces a `$tape`. The `%+` [cenlus](../../hoon/rune/cen.md#cenlus) rune allows us to pull an arm with a pair sample. The arm we are going to pull is [`+turn`](../../hoon/stdlib/2b.md#turn). This arm takes two arguments, a list and a gate to apply to each element of the `+list`.

In this case, the `$gate` we are applying to our `.message` uses the [`+got`](../../hoon/stdlib/2i.md#gotby) arm of the [`+by`](../../hoon/stdlib/2i.md#by) door with our `.shift-map` as the sample (which is either the standard alphabet for keys, and the shifted alphabet for values, or the other way, depending on whether we are encoding or decoding) to look up each `$cord` in our `.message`, one by one and replace it with the value from our `+map` (either the encoded or decoded version).

Let's give our arm Caesar's famous statement (translated into English!) and get our left-cipher and right-cipher.

```
> +caesar ["i came i saw i conquered" 4]
["m geqi m wea m gsruyivih" "e ywia e ows e ykjmqanaz"]
```

Now, to decode, we can put either of our ciphers in with the appropriate key and look for the legible result.

```
> +caesar ["m geqi m wea m gsruyivih" 4]
["q kium q aie q kwvycmzml" "i came i saw i conquered"]

> +caesar ["e ywia e ows e ykjmqanaz" 4]
["i came i saw i conquered" "a usew a kso a ugfimwjwv"]
```

##### Further Exercise

1. Take the example generator and modify it to add a second layer of shifts.
2. Extend the example generator to allow for use of characters other than a-z. Make it shift the new characters independently of the alpha characters, such that punctuation is only encoded as other punctuation marks.
3. Build a gate that can take a Caesar shifted `$tape` and produce all possible unshifted `$tape`s.
4. Modify the example generator into a `%say` generator.


## A Bit More on Cores {#a-bit-more-on-cores}

The `|^` [barket](../../hoon/rune/bar.md#barket) rune is an example of what we can call a "convenience rune", similar to the idea of sugar syntax (irregular syntax to make writing certain things out in a more expressive manner). `|^` [barket](../../hoon/rune/bar.md#barket) produces a core with _at least_ a `$` arm and computes it immediately, called a "cork". (So a cork is like a trap in the regard of computing immediately, but it has more arms than just `$`.)

This code calculates the volume of a cylinder, _A=πr²h_.

```
=volume-of-cylinder |^
(mul:rs (area-of-circle .2.0) height)
++  area-of-circle
  |=  r=@rs
  (mul:rs pi r)
++  pi  .3.1415926
++  height  .10.0
--
```

Since all of the values either have to be pinned ahead of time or made available as arms, a `|^` [barket](../../hoon/rune/bar.md#barket) would probably be used inside of a gate. Of course, since it is a core with a `$` arm, one could also use it recursively to calculate values like the factorial.

If you read the docs, you'll find that a `|-` [barhep](../../hoon/rune/bar.md#barhep) rune “produces a trap (a core with one arm `$`) and evaluates it.”  So a trap actually evaluates to a `|%` [barcen](../../hoon/rune/bar.md#barcen) core with an arm `$`:

```hoon
:: count to five
=/  index  1
|-
?:  =(index 5)  index
$(index +(index))
```

actually translates to

```hoon
:: count to five
=/  index  1
=<  $
|%
++  $
  ?:  =(index 5)  index
  %=  $
    index  +(index)
  ==
--
```

You can also create a trap for later use with the `|.` [bardot](../../hoon/rune/bar.md#bardot) rune. It's quite similar, but without the `=<($...` part then it doesn't get evaluated immediately.

```
> =forty-two |.(42)
> $:forty-two
42
> (forty-two)
42
```

What is a gate? It is a door with only one arm `$`, and whenever you invoke it then that default arm's expression is referred to and evaluated.

A "gate" and a "trap" are actually very similar: a gate simply has a sample (and can actively change when evaluated or via a `%=` [centis](../../hoon/rune/cen.md#centis)), whereas a trap does not (and can _only_ be passively changed via something like `%=` centis).

#### Example: Hoon Workbook

Other examples demonstrating [`+map`](../../hoon/stdlib/2o.md#map) are available in the [Hoon Workbook](../../hoon/examples), such as Solution #2 in the [Rhonda Numbers](../../hoon/examples/rhonda.md) tutorial.
