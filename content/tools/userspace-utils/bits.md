+++
title = "lib/bits"
weight = 7
+++


## `++and`

Binary AND

Computes the bitwise logical AND of two atoms, `a` and `b`, producing an atom. Alias for [`++dis`](/language/hoon/reference/stdlib/2d#dis).

#### Accepts

`a` is an atom.

`b` is an atom.

#### Produces

An atom.

#### Source

```hoon
++  dis
  ~/  %dis
  |=  [a=@ b=@]
  =|  [c=@ d=@]
  |-  ^-  @
  ?:  ?|(=(0 a) =(0 b))  d
  %=  $
    a   (rsh 0 a)
    b   (rsh 0 b)
    c   +(c)
    d   %+  add  d
          %+  lsh  [0 c]
          ?|  =(0 (end 0 a))
              =(0 (end 0 b))
          ==
  ==
```

#### Examples

```
    > `@ub`9
    0b1001

    > `@ub`5
    0b101

    > `@ub`(and 9 5)
    0b1

    > (and 9 5)
    1

    > `@ub`534
    0b10.0001.0110

    > `@ub`987
    0b11.1101.1011

    > `@ub`(and 534 987)
    0b10.0001.0010

    > (and 534 987)
    530
```

## `++or`

Binary OR

Computes the bitwise logical OR of two atoms, `a` and `b`, producing an atom. Alias for [`++con`](/language/hoon/reference/stdlib/2d#mix).

#### Accepts

`a` is an atom

`b` is an atom

#### Produces

An atom.

#### Source

```hoon
++  con
  ~/  %con
  |=  [a=@ b=@]
  =+  [c=0 d=0]
  |-  ^-  @
  ?:  ?&(=(0 a) =(0 b))  d
  %=  $
    a   (rsh 0 a)
    b   (rsh 0 b)
    c   +(c)
    d   %+  add  d
          %+  lsh  [0 c]
          ?&  =(0 (end 0 a))
              =(0 (end 0 b))
          ==
  ==
```

#### Examples

```
    > (or 0b0 0b1)
    1

    > (or 0 1)
    1

    > (or 0 0)
    0

    > `@ub`(or 0b1111.0000 0b1.0011)
    0b1111.0011

    > (or 4 4)
    4

    > (or 10.000 234)
    10.234

    > `@ub`534
    0b10.0001.0110

    > `@ub`987
    0b11.1101.1011

    > `@ub`(or 534 987)
    0b11.1101.1111

    > (or 534 987)
    991
```

## `++not`

Binary NOT

Computes the bitwise logical NOT of the bottom `b` blocks of size `a`
of `c`. Passthrough for [`++not`](/language/hoon/reference/stdlib/2d#not).

#### Accepts

`a` is a block size (see [`bloq`](/language/hoon/reference/stdlib/1c)).

`b` is an atom.

`c` is an atom.

#### Produces

An atom.

#### Source

```hoon
++  not  |=  [a=bloq b=@ c=@]
  (mix c (dec (bex (mul b (bex a)))))
```

#### Examples

```
    > `@ub`24
    0b1.1000

    > (not 0 5 24)
    7

    > `@ub`7
    0b111

    > (not 2 5 24)
    1.048.551

    > (not 2 5 1.048.551)
    24

    > (not 1 1 (not 1 1 10))
    10
```

## `++xor`

Binary XOR

Produces the bitwise logical XOR of two atoms, `a` and `b`, producing an atom. Alias for [`++mix`](/language/hoon/reference/stdlib/2d#mix)

#### Accepts

`a` is an atom

`b` is an atom

#### Produces

An atom.

#### Source

```hoon
++  mix
  ~/  %mix
  |=  [a=@ b=@]
  ^-  @
  =+  [c=0 d=0]
  |-
  ?:  ?&(=(0 a) =(0 b))  d
  %=  $
    a   (rsh 0 a)
    b   (rsh 0 b)
    c   +(c)
    d   (add d (lsh [0 c] =((end 0 a) (end 0 b))))
  ==
```

#### Examples

```
    > `@ub`2
    0b10

    > `@ub`3
    0b11

    > `@ub`(mix 2 3)
    0b1

    > (mix 2 3)
    1

    > `@ub`(mix 2 2)
    0b0

    > (mix 2 2)
    0

    > `@ub`534
    0b10.0001.0110

    > `@ub`987
    0b11.1101.1011

    > `@ub`(mix 534 987)
    0b1.1100.1101

    > (mix 534 987)
    461
```
