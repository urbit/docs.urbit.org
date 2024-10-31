+++
title = "Implementing an Aura"
weight = 150
+++

An aura is a metadata tag for Hoon to identify and manipulate atoms correctly.  Auras nest inside of each other logically:  `@uvJ` nests inside of `@uv`, which in turn nests in `@u` then `@`.  Auras allow programmers to encode intent into their handling of values.

To implement an aura in Hoon, we follow these steps:

1. **Design the aura.**  A lot of existing letter pairs are spoken for, and new auras _should_ nest logically. Currently unoccupied letters include: `abeghjkmovwxyz`.  If you can make a case for why your new aura logically nests under an existing aura, then you implement such a nesting; you'll just need to make the case for it in your pull request submission.

2. **Implement the base logic in `/sys/hoon`.**  This, by and large, means providing a core or door which can correctly carry out arithmetic, conversion, processing, and so forth on your atom.

3. **Implement a pretty-printer in `|co`.**  Two components are necessary:

  1. **Produce a formatted text `tank`.**  Due to nesting rules, you will likely have to implement all of the necessary logic here if you are adding your base logic code to the end of `/sys/hoon`.

  2. **Produce `tape`.** Take your `tank`-maker and wrap it in `%~ ram re`.

4. **Implement parser in `|so`.**  Compose a parsing rule which is distinct from all others and add it in the appropriate sections here.  (Finding a unique syntax that follows Hoon's rules, like URL-safe characters only and not parseable as Hoon code, can be rather challenging now.)  The aura parser prefixes elements with a type `term`; properly the pair is called a `dime`.  This will also allow you to type the literal atom in the Dojo.

We prefer the parsed form and the prettyprinted form to coincide so we can copy and paste a result directly back in as valid Hoon.  (This is generally true for atoms but not for other molds; consider `set` for instance.)


##  Example:  Sexagesimal Degrees

Classically, angular measurements using degrees subdivided each degree into 60 minutes and each minute into 60 seconds.  Although less common in an age rife with [floating-point values](https://xkcd.com/2170/), proficiency with [sexagesimal notation](https://en.wikipedia.org/wiki/Degree_(angle)#Subdivisions) lends distinction and _gravitas_.

{% math %}
5°6'7''
{% /math %}

### Preliminaries

You should fork the [Urbit repo](https://github.com/urbit/urbit) and create a working branch for this project.  While per the guide you will not be PRing this code back against the main repo, this is the standard working environment setup.

### Design

In this example, we will produce a degree–minute–second (DMS) aura.  We will call it `@udms`.  It will have the visual form of three integers prefixed with `.` dots, e.g. `.359.59.59` for 359°59'59''.  This distinguishes it from `@rs`, which has two similarly-separated values, e.g. `.1.2`; and from `@if`, which has four, e.g. `.1.2.3.4`.  For atoms, the literal input form and literal output form should be the same.

It will have the bit-logical form of an integer of arbitrary size, with each whole-number increment representing a second.  This would permit overflow, i.e. values greater than 360° such as 720°; however, we will supply a `++norm` arm to enforce modular arithmetic at 360°.

### Base Logic

We need to be able to perform arithmetic and type conversion with `@udms` values.  Some value representations have an “unpacked“ tuple form, like dates and floating-point values.  This makes it easier to shunt the values between auxiliary functions.  We'll define one as well here, `+$sexa` (for _sexagesimal_, base-60).

At this point, we implement modular arithmetic and wrap the values properly in `++op`.  For instance, wrapping around at 360°=0° should work properly, similar to midnight.  Subtraction is liable to underflow, so we need a special handler for it in `++dg`; since we have one, we may as well handle `++add` the same way for consistency.

{% math %}
359° + 2° = 1°
{% /math %}

<br/>

{% math %}
59' + 1' = 1°
{% /math %}

<br/>

{% math %}
59'' + 1'' = 1'
{% /math %}

<br/>

{% math %}
1°59'59'' + 1'' = 2°
{% /math %}

<br/>

{% math %}
3° - 1° = 2°
{% /math %}

<br/>

{% math %}
1° - 3° = 358°
{% /math %}

<br/>

{% math %}
0° - 1'' = 359°59'59''
{% /math %}

Let's write some unit tests first.

**`/tests/sys/dms`**

```hoon
/+  *test
|%
++  test-add-zero
  ;:  weld
  %+  expect-eq
    !>  (wrap:dg 180 0 0)
    !>  (add:dg (wrap:dg 180 0 0) (wrap:dg 0 0 0))
  ==
++  test-add-dms
  ;:  weld
  %+  expect-eq
    !>  (wrap:dg 180 0 0)
    !>  (add:dg (wrap:dg 179 0 0) (wrap:dg 1 0 0))
  %+  expect-eq
    !>  (wrap:dg 180 0 0)
    !>  (add:dg (wrap:dg 90 1 0) (wrap:dg 89 59 0))
  %+  expect-eq
    !>  (wrap:dg 180 0 0)
    !>  (add:dg (wrap:dg 1 1 1) (wrap:dg 178 58 59))
  %+  expect-eq
    !>  (wrap:dg 180 0 0)
    !>  (add:dg (wrap:dg 179 0 59) (wrap:dg 0 0 1))
  ==
++  test-sub-dms
  ;:  weld
  %+  expect-eq
    !>  (wrap:dg 90 0 0)
    !>  (sub:dg (wrap:dg 180 0 0) (wrap:dg 90 0 0))
  %+  expect-eq
    !>  (wrap:dg 90 0 0)
    !>  (sub:dg (wrap:dg 0 0 0) (wrap:dg 270 0 0))
  %+  expect-eq
    !>  (wrap:dg 90 0 0)
    !>  (sub:dg (wrap:dg 90 0 0) (wrap:dg 360 0 0))
  %+  expect-eq
    !>  (wrap:dg 89 0 0)
    !>  (sub:dg (wrap:dg 90 0 0) (wrap:dg 1 0 0))
  %+  expect-eq
    !>  (wrap:dg 89 59 0)
    !>  (sub:dg (wrap:dg 90 0 0) (wrap:dg 0 1 0))
  %+  expect-eq
    !>  (wrap:dg 89 59 59)
    !>  (sub:dg (wrap:dg 90 0 0) (wrap:dg 0 0 1))
  %+  expect-eq
    !>  (wrap:dg 359 59 59)
    !>  (sub:dg (wrap:dg 0 0 0) (wrap:dg 0 0 1))
  ==
++  test-unwrap-dms
  ;:  weld
  %+  expect-eq
    !>  .90.0.0
    !>  (wrap:dg 90 0 0)
  %+  expect-eq
    !>  .0.45.0
    !>  (wrap:dg 0 45 0)
  %+  expect-eq
    !>  .0.0.45
    !>  (wrap:dg 0 0 45)
  %+  expect-eq
    !>  .1.2.3
    !>  (wrap:dg 1 2 3)
  %+  expect-eq
    !>  .360.0.0
    !>  (wrap:dg 360 0 0)
  ==
++  test-norm-dms
  ;:  weld
  %+  expect-eq
    !>  (wrap:dg 1 30 0)
    !>  (norm:dg (wrap:dg 0 90 0))
  %+  expect-eq
    !>  (wrap:dg 1 0 0)
    !>  (norm:dg (wrap:dg 0 60 0))
  %+  expect-eq
    !>  (wrap:dg 0 1 30)
    !>  (norm:dg (wrap:dg 0 0 90))
  %+  expect-eq
    !>  (wrap:dg 0 0 0)
    !>  (norm:dg (wrap:dg 360 0 0))
  %+  expect-eq
    !>  (wrap:dg 0 0 0)
    !>  (norm:dg (wrap:dg 359 60 0))
  %+  expect-eq
    !>  (wrap:dg 0 0 0)
    !>  (norm:dg (wrap:dg 359 59 60))
  %+  expect-eq
    !>  .1.0.0
    !>  .0.60.0
  ==
++  test-parse-dms
  ;:  weld
  %+  expect-eq
    !>  [p=[p=1 q=6] q=[~ u=[p=3.723 q=[p=[p=1 q=6] q=""]]]]
    !>  (dems:so [[1 1] "1.2.3"])
  %+  expect-eq
    !>  3.723
    !>  (scan "1.2.3" dems:so)
  %-  expect-fail
    |.  (scan ".5.6" ;~(pfix dot ;~((glue dot) dem:ag dem:ag dem:ag)))
  %-  expect-fail
    |.  (scan ".5.6.7.8" ;~(pfix dot ;~((glue dot) dem:ag dem:ag dem:ag)))
  ==
--
```

The Hoon logic will be located in a `++dg` arm.  This needs to be sufficiently high in the stack that our prettyprinter and parser logic know about them, so let's put `++dg` in the fourth core.  Search for `layer-5` and paste `++dg` in a few lines above that after `+$hump`.  (Strictly speaking, we should make sure that this works in a userspace `/lib` library first but here we'll just insert it into `/sys/hoon` and rely on our unit tests.)

**`/sys/hoon`**

```hoon
++  dg
  |%
  +$  sexa  $:(d=@ud m=@ud s=@ud)
  :: Convert to $sexa expanded form.
  ++  unwrap
    |=  p=@udms
    ^-  sexa
    =/  d  (div p 3.600)
    =/  s  (sub p (mul d 3.600))
    =/  m  (div s 60)
    =.  s  (sub s (mul m 60))
    [d m s]
  :: Convert to atomic @udms form.
  ++  wrap
    |=  =sexa
    ^-  @udms
    =,  sexa
    :(add (mul d 3.600) (mul m 60) s)
  :: Handle arithmetic.
  ++  add  |=([p=@udms q=@udms] ^-(@udms (^add `@`p `@`q)))
  ++  sub  |=([p=@udms q=@udms] ^-(@udms (~(dif fo 1.296.000) `@`p `@`q)))
  :: Convert to @rs.
  ++  to-rs  |=(p=@udms ^-(@rs (div:rs (sun:rs p) .3600)))
  :: Convert to @rd.
  ++  to-rd  |=(p=@udms ^-(@rd (div:rd (sun:rd p) .~3600)))
  :: Roll over values out of range of 360°.
  ++  norm
    |=  p=@udms
    ^-  @udms
    (~(fra fo 1.296.000) `@`p 1.296.000)
  --
```

### Pretty-Printing

The atom literal should be constructed in `++rend`, which has a cascade of switch statements over the atom aura.   Let's adopt the output syntax to be the same as the input syntax, `.ddd.mm.ss`.

```hoon
++  co
  ~%  %co  ..co  ~
  |_
    ...
    ++  rend
      =+  [yed=(end 3 p.p.lot) hay=(cut 3 [1 1] p.p.lot)]
      |-  ^-  tape
      ?+    yed  (z-co q.p.lot)
        ...
            %u
          ?:  ?=(%c hay)
            %+  welp  ['0' 'c' (reap (pad:fa q.p.lot) '1')]
            (c-co (enc:fa q.p.lot))
          ::
          =;  gam=(pair tape tape)
            (weld p.gam ?:(=(0 q.p.lot) `tape`['0' ~] q.gam))
          ?+  hay  [~ ((ox-co [10 3] |=(a=@ ~(d ne a))) q.p.lot)]
          ...
              %d
            =/  ham  (cut 3 [2 1] p.p.lot)
            ?+    ham  [~ ((ox-co [10 3] |=(a=@ ~(d ne a))) q.p.lot)]
                %m
              =/  has  (cut 3 [3 1] p.p.lot)
              ?+    has  [~ ((ox-co [10 3] |=(a=@ ~(d ne a))) q.p.lot)]
                  %s
                =/  =sexa:dg  (unwrap:dg q.p.lot)
                :-  ['.' ~]
                `tape`:(weld (a-co d.sexa) "." (a-co m.sexa) "." (a-co s.sexa))
              ==
            ==
          ==
```

Every type has its own special conventions, so you need to adapt to follow whatever those may be.

### Parsing

A parsing rule which correctly handles the aura is:

```hoon
;~(pfix dot ;~((glue dot) dem:ag dem:ag dem:ag))
```

as demonstrated by these tests.  (See also `++dem:ag`.)

```hoon
> (;~(pfix dot ;~((glue dot) dem:ag dem:ag dem:ag)) [[1 1] ".1.2.3"])
[p=[p=1 q=7] q=[~ u=[p=[1 2 3] q=[p=[p=1 q=7] q=""]]]]

> (scan ".5.6.7" ;~(pfix dot ;~((glue dot) dem:ag dem:ag dem:ag)))
[5 6 7]

> (scan ".5.6" ;~(pfix dot ;~((glue dot) dem:ag dem:ag dem:ag)))
{1 5}
syntax error
dojo: hoon expression failed

> (scan ".5.6.7.8" ;~(pfix dot ;~((glue dot) dem:ag dem:ag dem:ag)))
{1 9}
syntax error
dojo: hoon expression failed
```

Ultimately we will pack these together into the atom form `@udms`.

```hoon
> (scan "1.2.3" (cook |=([d=@ m=@ s=@] :(add (mul d 3.600) (mul m 60) s)) ;~((glue dot) dem:ag dem:ag dem:ag)))
3.723
```

Note that this form overflows still, but can be corrected using `++norm:dg`.

Our parser logic needs to be cited in `++zust:so` because that arm parses atoms prefixed with `.` dot.  This means that the `pfix dot` gets eaten, and our actual parsing rule only needs to handle the rest of the symbol.  Add a `++dems` arm after `++zust` and register it in the `pose` in `++zust` as well.  Since parsers in a `pose` resolve in order, it should come after IPv4 `@if` addresses (`.1.1.1.1`) and before `@rs` values (`.1.1`).

```hoon
++  so
  ~%  %so  +  ~
  |%
  ...
  ++  zust
    ~+
    ;~  pose
      (stag %is bip:ag)
      (stag %if lip:ag)
      (stag %udms dems)
      royl
      ...
    ==
  ++  dems
    |=  b=nail
    %.  b
    %+  cook
      |=([d=@ m=@ s=@] :(add (mul d 3.600) (mul m 60) s))
    ;~((glue dot) dem:ag dem:ag dem:ag)
  --
```

You also need to modify `+$iota` to include `[%udms @udms]` to satisfy the type system for typed paths.

At this point, a compiled `/sys/hoon` should detect the typed atom syntax correctly.  This aura should pass all tests and be usable in conventional Hoon code.

```hoon
> .1.2.3
.1.2.3

> `@ud`.1.2.3
3.723
```

##  Exercises

What else should be implemented?

- Radian-based angles could be supported (let's say as `@ur`).
- Arguably, there should be an absolute angle (analogous to `@da`) representing a direction in 2D space, and a relative angle (analogous to `@dr`) representing a turn in 2D space.
- You'd also want to decide how to deal with negative arcs, if supported; a zigzag scheme similar to `@s` would be most apt (`@sdms`).
- A spherical trigonometry project could build on these mathematics for an astronomical or avionic calculator.  (`@uds` for steradians?)
- `*@udms` displays incorrectly.  Why, and how would you fix it?
