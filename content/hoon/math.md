---
description: "Documentation for the %base desk's /lib/math.hoon library, which contains mathematical operations."
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

# Mathematical Operations

Documentation for the `%base` desk's `/lib/math.hoon` library, which contains mathematical operations.

`/lib/math` is a standard library which lives outside of the `/sys` kernel and supports userspace applications which need transcendental mathematical constants and operators.  `/lib/math` is not currently subject to kelvin versioning.

Like [Lagoon](lagoon/README.md), `/lib/math` is intended to support general-purpose linear algebraic types, but at this point it focuses on integers and IEEE 754 floating-point numbers.

Like the basic floating-point support in Hoon, `/lib/math` is divided into doors along the lines of the supported data types.  At the current time, it supports:

- `+rh`, half-precision (16-bit) floating-point numbers.
- `+rs`, single-precision (32-bit) floating-point numbers.
- `+rd`, double-precision (64-bit) floating-point numbers.
- `+rq`, quadruple-precision (128-bit) floating-point numbers.

## `+rs` {#rs}

Single-precision IEEE 754 mathematical operations.

A container core for operations related to single-precision binary floats.

`+rs` has four rounding modes: round to nearest (`%n`), round up (`%u`), round down (`%d`), and round to zero (`%z`). The default rounding mode is `%z`. If you need a different rounding mode, you'd do something like `=/  rs-n  ~(. rs [%n rtol])` and then call the arms of your modified version instead.

`+rs` supports a relative tolerance for precision of operations, which is set by the `rtol` parameter. The default value is `_.1e-5`, but you can change it by passing a different value in the `rs` door.

#### Source

```hoon
++  rs
  ^|
  |_  $$:  r=$?(%n %u %d %z)   :: round nearest, up, down, to zero
          rtol=_.1e-5         :: relative tolerance for precision of operations
      ==
```

---

### `+tau` {#tau}

The value $$\tau = 2 \pi$$ (OEIS A019692), radian angle measure of a full turn.

#### Produces

The value of tau $$\tau$$ or 2 pi $$\pi$$, radian angle measure of a full turn, represented as a single-precision floating-point atom.

#### Source

```hoon
++  tau  .6.2831855
```

---

### `+pi` {#pi}

The value pi (OEIS A000796), radian angle measure of a half turn.

#### Produces

The value of pi $$\pi$$, radian angle measure of a half turn, represented as a single-precision floating-point atom.

#### Source

```hoon
++  pi  .3.1415927
```

---

### `+e` {#e}

Return the value e (Euler's constant) (OEIS A001113).

#### Produces

The value of e, represented as a single-precision floating-point atom.

#### Source

```hoon
++  e  .2.7182817
```

---

### `+phi` {#phi}

The value phi (golden ratio) (OEIS A001622).

#### Produces

The value of phi, represented as a single-precision floating-point atom.

#### Source

```hoon
++  phi  .1.618034
```

---

### `+sqt2` {#sqt2}

The value sqrt(2) (OEIS A002193).

#### Produces

The value of sqrt(2), represented as a single-precision floating-point atom.

#### Source

```hoon
++  sqt2  .1.4142135
```

---

### `+invsqt2` {#invsqt2}

The value 1/sqrt(2) (OEIS A010503).

#### Produces

The value of 1/sqrt(2), represented as a single-precision floating-point atom.

#### Source

```hoon
++  invsqt2  .70710677
```

---

### `+log2` {#log2}

The value log(2) (OEIS A002162).

#### Produces

The value of log(2), represented as a single-precision floating-point atom.

#### Source

```hoon
++  log2  .0.6931472
```

---

### `+invlog2` {#invlog2}

The value 1/log(2).

#### Produces

The value of 1/log(2), represented as a single-precision floating-point atom.

#### Source

```hoon
++  invlog2  .1.442695
```

---

### `+log10` {#log10}

The value log(10) (OEIS A002392).

#### Produces

The value of log(10), represented as a single-precision floating-point atom.

#### Source

```hoon
++  log10  .2.3025851
```

---

### `+huge` {#huge}

The value of the largest representable number.

#### Produces

The value of the largest representable number, represented as a single-precision floating-point atom.

#### Source

```hoon
++  huge  `@rs`0x7f80.0000  ::  3.40282346638528859812e+38
```

---

### `+tiny` {#tiny}

The value of the smallest representable normal number.

#### Produces

The value of the smallest representable normal number, represented as a single-precision floating-point atom.

#### Source

```hoon
++  tiny  `@rs`0x1          ::  1.40129846432481707092e-45
```

---

### `+sea` {#sea}

Floating-point atom representation.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

The `$fn` representation of the floating-point atom.

#### Source

```hoon
++  sea  sea:^rs
```

---

### `+bit` {#bit}

Floating-point atom representation.

#### Accepts

The `$fn` representation of a floating-point atom.

#### Produces

A floating-point atom (`@rs`).

#### Source

```hoon
++  bit  bit:^rs
```

---

### `+sun` {#sun}

Floating-point atom of an unsigned integer atom.

#### Accepts

An unsigned integer atom (`@ud`).

#### Produces

A floating-point atom (`@rs`).

#### Source

```hoon
++  sun  sun:^rs
```

---

### `+san` {#san}

Floating-point atom of a signed integer atom.

#### Accepts

A signed integer atom (`@sd`).

#### Produces

A floating-point atom (`@rs`).

#### Source

```hoon
++  san  san:^rs
```

---

### `+exp` {#exp}

The value of e^x for a given floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Source

```hoon
++  exp  exp:^rs  :: no pass-through because of exp function
```

---

### `+toi` {#toi}

The unitized signed integer atom of a rounded floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A unitized signed integer atom (`@sd`).

#### Source

```hoon
++  toi  toi:^rs
```

---

### `+drg` {#drg}

The decimal form of a floating-point atom using the Dragon4 algorithm.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A decimal form (`+dn`).

#### Source

```hoon
++  drg  drg:^rs
```

---

### `+grd` {#grd}

The floating-point atom of a decimal form.  Inverse of `+drg`.

#### Accepts

A decimal form (`+dn`).

#### Produces

A floating-point atom (`@rs`).

#### Source

```hoon
++  grd  grd:^rs
```

---

### `+lth` {#lth}

The comparison of two floating-point atoms, less than.

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A `$flag`.

#### Source

```hoon
++  lth  lth:^rs
```

---

### `+lte` {#lte}

The comparison of two floating-point atoms, less than or equal to.

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A `$flag`.

#### Source

```hoon
++  lte  lte:^rs
```

---

### `+leq` {#leq}

The comparison of two floating-point atoms, less than or equal to. Alias for `+lte`.

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A `$flag`.

#### Source

```hoon
++  leq  lte:^rs
```

---

### `+equ` {#equ}

The comparison of two floating-point atoms, equal to.

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A `$flag`.

#### Source

```hoon
++  equ  equ:^rs
```

---

### `+gth` {#gth}

The comparison of two floating-point atoms, greater than.

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A `$flag`.

#### Source

```hoon
++  gth  gth:^rs
```

---

### `+gte` {#gte}

The comparison of two floating-point atoms, greater than or equal to.

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A `$flag`.

#### Source

```hoon
++  gte  gte:^rs
```

---

### `+geq` {#geq}

The comparison of two floating-point atoms, greater than or equal to. Alias for `+gte`.

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A `$flag`.

#### Source

```hoon
++  geq  gte:^rs
```

---

### `+neq` {#neq}

The comparison of two floating-point atoms, not equal to.

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A `$flag`.

#### Source

```hoon
++  neq  |=([a=@rs b=@rs] ^-(? !(equ:^rs a b)))
```

---

### `+is-close` {#isclose}

The comparison of two floating-point atoms, within a relative tolerance (provided by the `+rs` door).

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A `$flag`.

#### Source

```hoon
++  is-close
  |=  [p=@rs r=@rs]
  (lth (abs (sub p r)) rtol)
```

---

### `+all-close` {#allclose}

The comparison of a floating-point atom to a list of floating- point atoms, within a relative tolerance (provided by the `+rs` door).

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A `$flag`.

#### Source

```hoon
++  all-close
  |=  [p=@rs q=(list @rs)]
  =/  i  0
  =/  n  (lent q)
  |-  ^-  ?
  ?:  =(n i)
    %.y
  ?.  (is-close p (snag i q))
    %.n
  $$(i +(i))
```

---

### `+is-int` {#isint}

Returns whether a floating-point value is an integer (no fractional part).

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A `$flag`.

#### Source

```hoon
++  is-int
  |=  x=@rs  ^-  ?
  (equ x (san (need (toi x))))
```

---

### `+add` {#add}

The sum of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Source

```hoon
++  add  add:^rs
```

---

### `+sub` {#sub}

The difference of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Source

```hoon
++  sub  sub:^rs
```

---

### `+mul` {#mul}

The product of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Source

```hoon
++  mul  mul:^rs
```

---

### `+div` {#div}

The quotient of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Source

```hoon
++  div  div:^rs
```

---

### `+mod` {#mod}

The modulus of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Source

```hoon
++  mod
  |=  [a=@rs b=@rs]  ^-  @rs
  ?:  (lth a .0)
    (sub b (mod (neg a) b))
  (sub a (mul b (san (need (toi (div a b))))))  ::  a - b * floor(a / b)
```

---

### `+fma` {#fma}

The fused multiply-add of three floating-point atoms.

#### Accepts

A triplet of floating-point atoms (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Source

```hoon
++  fma  fma:^rs
```

---

### `+sig` {#sig}

The sign of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A `$flag`.

#### Source

```hoon
++  sig  |=(x=@rs =(0 (rsh [0 31] x)))
```

---

### `+sgn` {#sgn}

The sign of a floating-point atom. Alias for `+sig`.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A `$flag`.

#### Source

```hoon
++  sgn  sig
```

---

### `+neg` {#neg}

The negation of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Source

```hoon
++  neg  |=(x=@rs (sub .0 x))
```

---

### `+factorial` {#factorial}

The factorial of a floating-point atom.  Assumes integer input.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Source

```hoon
++  factorial
  |=  x=@rs  ^-  @rs
  ?>  (gte x .0)
  =/  t=@rs  .1
  ?:  (is-close x .0)
    t
  |-  ^-  @rs
  ?:  (is-close x .1)
    t
  $$(x (sub x .1), t (mul t x))
```

---

### `+abs` {#abs}

The absolute value of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Source

```hoon
++  abs
  |=  x=@rs  ^-  @rs
  ?:((sgn x) x (neg x))
```

---

### `+exp` {#exp}

The exponential of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
>(exp .1)
.2.7182808

>(exp .2)
.7.389052

>(~(exp rs [%z .1e-8]) .2)
.7.389053

>(exp .inf)
.inf
```

#### Source

```hoon
++  exp
  |=  x=@rs  ^-  @rs
  ::  filter out non-finite arguments
  ?:  =(x 0x0)  .1
  ::    check infinities
  ?:  =(x 0x7f80.0000)  `@rs`0x7f80.0000  :: exp(+inf) -> inf
  ?:  =(x 0xff80.0000)  .0.0              :: exp(-inf) -> 0
  ::    check NaN
  ?.  (^gte (dis 0x7fc0.0000 x) 0)  `@rs`0x7fc0.0000  :: exp(NaN) -> NaN
  ::    check overflow to infinity
  =/  o-threshold  `@rs`0x42b0.c0a8  ::  88.72283905206835, value above which exp(x) overflows
  ?:  (gth x o-threshold)  (mul huge huge)
  ::    check underflow to zero
  =/  u-threshold  `@rs`0xc2b0.c0a8  ::  -88.72283905206835, value below which exp(x) underflows
  ?:  (lth x u-threshold)  (mul tiny tiny)
  ::  otherwise, use Taylor series
  =/  p   .1
  =/  po  .-1
  =/  i   .1
  |-  ^-  @rs
  ?:  (lth (abs (sub po p)) rtol)
    p
  $$(i (add i .1), p (add p (div (pow-n x i) (factorial i))), po p)
```

---

### `+sin` {#sin}

The sine of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
>(sin .1)
.0.84147096

>(sin .2)
.0.9092974

>(sin pi)
.3.1609193e-7
```

#### Source

```hoon
++  sin
  |=  x=@rs  ^-  @rs
  ::  filter out non-finite arguments
  ::    check infinities
  ?:  =(x 0x7f80.0000)  `@rs`0x7fc0.0000  :: sin(+inf) -> NaN
  ?:  =(x 0xff80.0000)  `@rs`0x7fc0.0000  :: sin(-inf) -> NaN
  ::    check NaN
  ?.  (^gte (dis 0x7fc0.0000 x) 0)  `@rs`0x7fc0.0000  :: sin(NaN) -> NaN
  ::  map into domain
  =.  x  (mod x tau)
  ::  otherwise, use Taylor series
  =/  p   x
  =/  po  .-2
  =/  i   1
  =/  term  x
  |-  ^-  @rs
  ?.  (gth (abs term) rtol)
    p
  =/  i2  (add (sun i) (sun i))
  =.  term  (mul (neg term) (div (mul x x) (mul i2 (add i2 .1))))
  $$(i +(i), p (add p term), po p)
```

---

### `+cos` {#cos}

The cosine of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
>(cos .1)
.0.5403022

>(cos .2)
.-0.41614664

>(cos pi)
.-0.9999998
```

#### Source

```hoon
++  cos
  |=  x=@rs  ^-  @rs
  ::  filter out non-finite arguments
  ::    check infinities
  ?:  =(x 0x7f80.0000)  `@rs`0x7fc0.0000  :: sin(+inf) -> NaN
  ?:  =(x 0xff80.0000)  `@rs`0x7fc0.0000  :: sin(-inf) -> NaN
  ::    check NaN
  ?.  (^gte (dis 0x7fc0.0000 x) 0)  `@rs`0x7fc0.0000  :: sin(NaN) -> NaN
  ::  map into domain
  =.  x  (mod x tau)
  ::  otherwise, use Taylor series
  =/  p   .1
  =/  po  .-2
  =/  i   1
  =/  term  .1
  |-  ^-  @rs
  ?.  (gth (abs term) rtol)
    p
  =/  i2  (add (sun i) (sun i))
  =.  term  (mul (neg term) (div (mul x x) (mul i2 (sub i2 .1))))
  $$(i +(i), p (add p term), po p)
```

---

### `+tan` {#tan}

The tangent of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
>(tan .1)
.1.5574079

>(tan .2)
.-2.1850407

>(tan pi)
.-7.0094916e-7
```

#### Source

```hoon
++  tan
  |=  x=@rs  ^-  @rs
  (div (sin x) (cos x))
```

---

### `+asin` {#asin}

The inverse sine of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
>(asin .0)
.0

>(asin .1)
.1.5707964

>(asin .0.7)
.0.7753969
```

#### Source

```hoon
++  asin
  |=  x=@rs  ^-  @rs
  ?.  (gte (abs x) .1)
    (atan (div x (sqt (abs (sub .1 (mul x x))))))
  ?:  =(.1 x)   ^~((mul pi .0.5))
  ?:  =(.-1 x)  ^~((mul pi .-0.5))
  ~|([%asin-out-of-bounds x] !!)
```

---

### `+acos` {#acos}

The inverse cosine of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

#### Examples

```hoon
>(acos .0)
.1.5707964

>(acos .1)
.0

>(acos .0.7)
.0.7953982
```

#### Source

```hoon
++  acos
  |=  x=@rs  ^-  @rs
  ?.  (gte (abs x) .1)
    ?:  =(.0 x)  ^~((mul pi .0.5))
    (atan (div (sqt (abs (sub .1 (mul x x)))) x))
  ?:  =(.1 x)   .0
  ?:  =(.-1 x)  pi
  ~|([%acos-out-of-bounds x] !!)
```

---

### `+atan` {#atan}

The inverse tangent of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
>(atan .1)
.0.7853976

>(atan .2)
.1.1071494

>(atan pi)
.1.2626364
```

#### Source

```hoon
++  atan
  |=  x=@rs  ^-  @rs
  =/  a  (pow (add .1 (mul x x)) .-0.5)
  =/  b  .1
  |-
  ?.  (gth (abs (sub a b)) rtol)
    (div x (mul (pow (add .1 (mul x x)) .0.5) b))
  =/  ai  (mul .0.5 (add a b))
  =/  bi  (sqt (mul ai b))
  $$(a ai, b bi)
```

---

### `+atan2` {#atan2}

The inverse tangent of a floating-point coordinate.

#### Accepts

A pair of floating-point atoms (`@rs`), representing the y and x coordinates.

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
>(atan2 .0 .1)
.0

>(atan2 .-1 .0)
.-1.5707964

>(atan2 .0.5 .-0.5)
.2.356195
```

#### Source

```hoon
++  atan2
  |=  [y=@rs x=@rs]  ^-  @rs
  ?:  (gth x .0)
    (atan (div y x))
  ?:  &((lth x .0) (gte y .0))
    (add (atan (div y x)) pi)
  ?:  &((lth x .0) (lth y .0))
    (sub (atan (div y x)) pi)
  ?:  &(=(.0 x) (gth y .0))
    (div pi .2)
  ?:  &(=(.0 x) (lth y .0))
    (mul .-1 (div pi .2))
  .0  ::  undefined
```

---

### `+pow-n` {#pown}

The power of a floating-point atom to an integer exponent.

#### Accepts

A pair of floating-point atoms (`@rs`), representing the base and the exponent.

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
>(pow-n .1 .2)
.1

>(pow-n .2 .2)
.4

>(pow-n .2 .3)
.8
```

#### Source

```hoon
++  pow-n
  |=  [x=@rs n=@rs]  ^-  @rs
  ?:  =(n .0)  .1
  ?>  &((gth n .0) (is-int n))
  =/  p  x
  |-  ^-  @rs
  ?:  (lth n .2)
    p
  $$(n (sub n .1), p (mul p x))
```

---

### `+log` {#log}

The natural logarithm of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
>(log .1)
.0

>(log .2)
.0.69314677

>(log .inf)
.inf

>(log:rs:math e:rs:math)
.0.999998

>(log:rs:math [%z .1e-8])
.0.9999994
```

#### Source

```hoon
++  log
  |=  z=@rs  ^-  @rs
  ::  filter out non-finite arguments
  ::    check infinities
  ?:  =(z 0x7f80.0000)  `@rs`0x7f80.0000  :: log(+inf) -> inf
  ?:  =(z 0xff80.0000)  `@rs`0x7fc0.0000  :: log(-inf) -> NaN
  ::    check NaN
  ?.  (^gte (dis 0x7fc0.0000 z) 0)  `@rs`0x7fc0.0000  :: exp(NaN) -> NaN
  ::  otherwise, use Taylor series
  =/  p   .0
  =/  po  .-1
  =/  i   .0
  |-  ^-  @rs
  ?:  (lth (abs (sub po p)) rtol)
    (mul (div (mul .2 (sub z .1)) (add z .1)) p)
  =/  term1  (div .1 (add .1 (mul .2 i)))
  =/  term2  (mul (sub z .1) (sub z .1))
  =/  term3  (mul (add z .1) (add z .1))
  =/  term  (mul term1 (pow-n (div term2 term3) i))
  $$(i (add i .1), p (add p term), po p)
```

---

### `+log-10` {#log10}

The base-10 logarithm of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
> (log-10 .0.1)
.-0.999989

> (log-10 .2)
.0.30102932

> (~(log-10 rs [%z .1e-8]) .2)
.0.3010301

> (log-10 .inf)
.inf
```

#### Source

```hoon
++  log-10
  |=  z=@rs  ^-  @rs
  (div (log z) log10)
```

---

### `+log-2` {#log2}

The base-2 logarithm of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
> (log-2 .0.1)
.-3.321928

> (log-2 .2)
.1.5849625

> (~(log-2 rs [%z .1e-8]) .2)
.1.5849633
```

#### Source

```hoon
++  log-2
  |=  z=@rs  ^-  @rs
  (div (log z) log2)
```

---

### `+pow` {#pow}

The power of a floating-point atom to a floating-point exponent.

#### Accepts

A pair of floating-point atoms (`@rs`), representing the base and the exponent.

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
> (pow .1 .2)
.1

> (pow .2 .2)
.4

> (pow .2 .3.5)
.11.313682

> (~(pow rs:math [%z .1e-8]) .2 .3.5)
.11.313687
```

#### Source

```hoon
++  pow
  |=  [x=@rs n=@rs]  ^-  @rs
  ::  fall through on positive integers (faster)
  ?:  &(=(n (san (need (toi n)))) (gth n .0))  (pow-n x (san (need (toi n))))
  (exp (mul n (log x)))
```

---

### `+sqrt` {#sqrt}

The square root of a floating-point atom. Alias for `+sqt`.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
> (sqrt .1)
.1

> (sqrt .2)
.1.4142128

> (~(sqrt rs [%z .1e-8]) .2)
.1.414213
```

#### Source

```hoon
++  sqrt  sqt
```

---

### `+sqt` {#sqt}

The square root of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
> (sqt .1)
.1

> (sqt .2)
.1.4142135

> (sqt .1e5)
.316.22775
```

#### Source

```hoon
++  sqt
  |=  x=@rs  ^-  @rs
  ?>  (sgn x)
  ?:  =(.0 x)  .0
  =/  g=@rs  (div x .2)
  |-
  =/  n=@rs  (mul .0.5 (add g (div x g)))
  ?.  (gth (abs (sub g n)) rtol)
    n
  $$(g n)
```

---

### `+cbrt` {#cbrt}

The cube root of a floating-point atom. Alias for `+cbt`. ]

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
> (cbrt .1)
.1

> (cbrt .2)
.1.2599205

> (~(cbrt rs [%z .1e-8]) .2)
.1.2599207
```

#### Source

```hoon
++  cbrt  cbt
```

---

### `+cbt` {#cbt}

The cube root of a floating-point atom.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
> (cbt .1)
.1

> (cbt .2)
.1.2599205

> (~(cbt rs [%z .1e-8]) .2)
.1.2599207
```

#### Source

```hoon
++  cbt
  |=  x=@rs  ^-  @rs
  ?>  (sgn x)
  (pow x .0.33333333)
```

---

### `+arg` {#arg}

The argument of a floating-point atom (real argument = absolute value).

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
> (arg .1)
.1

> (arg .-1)
.1
```

#### Source

```hoon
++  arg  abs
```

---

### `+round` {#round}

The floating-point atom rounded to a given number of decimal places.

#### Accepts

A pair of floating-point atom (`@rs`) and an unsigned integer atom (`@ud`), where the integer specifies the number of significant digits to round to.

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
> (round .1 0)
.1

> (round .1.11 1)
.1.1

> (round .1.11 2)
.1.11

> (round .1.11 3)
.1.11
```

#### Discussion

This is exceptionally sensitive to off-by-one FP rounding error.

#### Source

```hoon
++  round
  |=  [x=@rs n=@ud]  ^-  @rs
  ?:  =(.0 x)  .0
  ::  Calculate the order of magnitude.
  =/  oom  (san (need (toi (log-10 (abs x)))))
  ::  Calculate the scaling factor.
  =/  scaling  (pow .10 :(sub (sun n) oom .1))
  ::  Round the mantissa to desired significant digits.
  =/  rnd-mantissa  (round-bankers (mul x scaling))
  ::  Convert back to the original scale.
  (div rnd-mantissa scaling)
```

---

### `+round-places` {#roundplaces}

The floating-point atom rounded to a given number of decimal places.

#### Accepts

A pair of floating-point atom (`@rs`) and an unsigned integer atom (`@ud`), where the integer specifies the number of significant digits to round to.

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
> (round-places .1 0)
.1

> (round-places .1.11 1)
.1.1

> (round-places .1.285 2)
.1.28

> (round-places .4.12345 3)
.4.1229997
```

#### Discussion

This is exceptionally sensitive to off-by-one FP rounding error.

#### Source

```hoon
++  round-places
  |=  [x=@rs n=@ud]  ^-  @rs
  ::  Calculate the scaling factor.
  =/  scaling  (pow .10 (sun n))
  ::  Scale the number.
  =/  scaled  (mul x scaling)
  ::  Round the mantissa to desired significant digits.
  =/  rnd-mantissa  (round-bankers scaled)
  ::  Convert back to the original scale.
  (div rnd-mantissa scaling)
```

---

### `+round-bankers` {#roundbankers}

The floating-point atom rounded to the nearest integer, with ties rounded to the nearest even integer.

#### Accepts

A floating-point atom (`@rs`).

#### Produces

A floating-point atom (`@rs`).

#### Examples

```hoon
> (round-bankers .1)
.1

> (round-bankers .1.5)
.2

> (round-bankers .1.49)
.1
```

#### Source

```hoon
++  round-bankers
  |=  x=@rs  ^-  @rs
  =/  int  (san (need (toi x)))
  =/  dcm  (sub x int)
  ?:  (lth dcm .0.5)
    int
  (add int .1)
```

---

## `+rd` {#rd}

Double-precision IEEE 754 mathematical operations.

A container core for operations related to double-precision binary floats.

`+rd` has four rounding modes: round to nearest (`%n`), round up (`%u`), round down (`%d`), and round to zero (`%z`). The default rounding mode is `%z`. If you need a different rounding mode, you'd do something like `=/  rd-n  ~(. rd [%n rtol])` and then call the arms of your modified version instead.

`+rd` supports a relative tolerance for precision of operations, which is set by the `rtol` parameter. The default value is `_.~1e-10`, but you can change it by passing a different value in the `rd` door.

#### Source

```hoon
++  rd
  ^|
  |_  $$:  r=$?(%n %u %d %z)   :: round nearest, up, down, to zero
          rtol=_.~1e-10       :: relative tolerance for precision of operations
      ==
```

---

### `+tau` {#tau}

The value $$\tau = 2 \pi$$ (OEIS A019692), radian angle measure of a full turn.

#### Produces

The value of tau $$\tau$$ or 2 pi $$\pi$$, radian angle measure of a full turn, represented as a single-precision floating-point atom.

#### Examples

```hoon
> tau
.~6.283185307179586
```

#### Source

```hoon
++  tau  .~6.283185307179586
```

---

### `+pi` {#pi}

The value pi (OEIS A000796), radian angle measure of a half turn.

#### Produces

The value of pi $$\pi$$, radian angle measure of a half turn, represented as a single-precision floating-point atom.

#### Examples

```hoon
> pi
.~3.141592653589793
```

#### Source

```hoon
++  pi  .~3.141592653589793
```

---

### `+e` {#e}

Return the value e (Euler's constant) (OEIS A001113).

#### Produces

The value of e, represented as a double-precision floating-point atom.

#### Examples

```hoon
> e
.~2.718281828459045
```

#### Source

```hoon
++  e  .~2.718281828459045
```

---

### `+phi` {#phi}

The value phi (golden ratio) (OEIS A001622).

#### Produces

The value of phi, represented as a double-precision floating-point atom.

#### Examples

```hoon
> phi
.~1.618033988749895
```

#### Source

```hoon
++  phi  .~1.618033988749895
```

---

### `+sqt2` {#sqt2}

The value sqrt(2) (OEIS A002193).

#### Produces

The value of sqrt(2), represented as a double-precision floating-point atom.

#### Examples

```hoon
> sqt2
.~1.414213562373095
```

#### Source

```hoon
++  sqt2  .~1.4142135623730951
```

---

### `+invsqt2` {#invsqt2}

The value 1/sqrt(2) (OEIS A010503).

#### Produces

The value of 1/sqrt(2), represented as a double-precision floating-point atom.

#### Examples

```hoon
> invsqt2
.~0.7071067811865476
```

#### Source

```hoon
++  invsqt2  .~0.7071067811865476
```

---

### `+log2` {#log2}

The value log(2) (OEIS A002162).

#### Produces

The value of log(2), represented as a double-precision floating-point atom.

#### Examples

```hoon
> log2
.~0.6931471805599453
```

#### Source

```hoon
++  log2  .~0.6931471805599453
```

---

### `+invlog2` {#invlog2}

The value 1/log(2).

#### Produces

The value of 1/log(2), represented as a double-precision floating-point atom.

#### Examples

```hoon
> invlog2
.~1.4426950408889634
```

#### Source

```hoon
++  invlog2  .~1.4426950408889634
```

---

### `+log10` {#log10}

The value log(10) (OEIS A002392).

#### Produces

The value of log(10), represented as a double-precision floating-point atom.

#### Examples

```hoon
> log10
.~2.302585092994046
```

#### Source

```hoon
++  log10  .~2.302585092994046
```

---

### `+huge` {#huge}

The value of the largest representable number.

#### Produces

The value of the largest representable number, represented as a double-precision floating-point atom.

#### Examples

```hoon
> huge
.~1.7976931348623157e+308
```

#### Source

```hoon
++  huge  `@rd`0x7fef.ffff.ffff.ffff  ::  1.79769313486231570815e+308
```

---

### `+tiny` {#tiny}

The value of the smallest representable normal number.

#### Produces

The value of the smallest representable normal number, represented as a double-precision floating-point atom.

#### Examples

```hoon
> tiny
.~2.2250738585072014e-308
```

#### Source

```hoon
++  tiny  `@rd`0x10.0000.0000.0000    ::  2.22507385850720138309e-308
```

---

### `+sea` {#sea}

Floating-point atom representation.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

The `$fn` representation of the floating-point atom.

#### Examples

```hoon
> (sea .~1)
[%f s=%.y e=-52 a=4.503.599.627.370.496]
> (sea .~1.1)
[%f s=%.y e=-52 a=4.953.959.590.107.546]
```

#### Source

```hoon
++  sea  sea:^rd
```

---

### `+bit` {#bit}

Floating-point atom representation.

#### Accepts

The `$fn` representation of a floating-point atom.

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (bit [%f s=%.y e=-52 a=4.503.599.627.370.496])
.~1
> (bit [%f s=%.y e=-52 a=4.953.959.590.107.546])
.~1.1
```

#### Source

```hoon
++  bit  bit:^rd
```

---

### `+sun` {#sun}

Floating-point atom of an unsigned integer atom.

#### Accepts

An unsigned integer atom (`@ud`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (sun 1)
.~1
> (sun 1.000)
.~1e3
```

#### Source

```hoon
++  sun  sun:^rd
```

---

### `+san` {#san}

Floating-point atom of a signed integer atom.

#### Accepts

A signed integer atom (`@sd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (san --1)
.~1

> (san -1)
.~-1
```

#### Source

```hoon
++  san  san:^rd
```

---

### `+toi` {#toi}

The unitized signed integer atom of a rounded floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A unitized signed integer atom (`@sd`).

#### Examples

```hoon
> (toi .~1)
[~ --1]

> (toi .~1.1)
[~ --1]
```

#### Source

```hoon
++  toi  toi:^rd
```

---

### `+drg` {#drg}

The decimal form of a floating-point atom using the Dragon4 algorithm.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A decimal form (`+dn`).

#### Examples

```hoon
> (drg .~1)
[%d s=%.y e=--0 a=1]

> (drg .~1.1)
[%d s=%.y e=-1 a=11]
```

#### Source

```hoon
++  drg  drg:^rd
```

---

### `+grd` {#grd}

The floating-point atom of a decimal form.  Inverse of `+drg`.

#### Accepts

A decimal form (`+dn`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (grd [%d s=%.y e=--0 a=1])
.~1

> (grd [%d s=%.y e=-1 a=11])
.~1.1
```

#### Source

```hoon
++  grd  grd:^rd
```

---

### `+lth` {#lth}

The comparison of two floating-point atoms, less than.

#### Accepts

A pair of floating-point atoms (`@rd`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (lth .~1 .~2)
%.y
> (lth .~2 .~1)
%.n
> (lth .~1 .~1)
%.n
```

#### Source

```hoon
++  lth  lth:^rd
```

---

### `+lte` {#lte}

The comparison of two floating-point atoms, less than or equal to.

#### Accepts

A pair of floating-point atoms (`@rd`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (lte .~1 .~2)
%.y
> (lte .~2 .~1)
%.n
> (lte .~1 .~1)
%.y
```

#### Source

```hoon
++  lte  lte:^rd
```

---

### `+leq` {#leq}

The comparison of two floating-point atoms, less than or equal to. Alias for `+lte`.

#### Accepts

A pair of floating-point atoms (`@rd`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (leq .~1 .~2)
%.y
> (leq .~2 .~1)
%.n
> (leq .~1 .~1)
%.y
```

#### Source

```hoon
++  leq  lte:^rd
```

---

### `+equ` {#equ}

The comparison of two floating-point atoms, equal to.

#### Accepts

A pair of floating-point atoms (`@rd`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (equ .~1 .~2)
%.n
> (equ .~2 .~1)
%.n
> (equ .~1 .~1)
%.y
```

#### Source

```hoon
++  equ  equ:^rd
```

---

### `+gth` {#gth}

The comparison of two floating-point atoms, greater than.

#### Accepts

A pair of floating-point atoms (`@rd`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (gth .~1 .~2)
%.n
> (gth .~2 .~1)
%.y
> (gth .~1 .~1)
%.n
```

#### Source

```hoon
++  gth  gth:^rd
```

---

### `+gte` {#gte}

The comparison of two floating-point atoms, greater than or equal to.

#### Accepts

A pair of floating-point atoms (`@rd`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (gte .~1 .~2)
%.n
> (gte .~2 .~1)
%.y
> (gte .~1 .~1)
%.y
```

#### Source

```hoon
++  gte  gte:^rd
```

---

### `+geq` {#geq}

The comparison of two floating-point atoms, greater than or equal to. Alias for `+gte`.

#### Accepts

A pair of floating-point atoms (`@rd`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (geq .~1 .~2)
%.n
> (geq .~2 .~1)
%.y
> (geq .~1 .~1)
%.y
```

#### Source

```hoon
++  geq  gte:^rd
```

---

### `+neq` {#neq}

The comparison of two floating-point atoms, not equal to.

#### Accepts

A pair of floating-point atoms (`@rd`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (neq .~1 .~2)
%.y
> (neq .~2 .~1)
%.y
> (neq .~1 .~1)
%.n
```

#### Source

```hoon
++  neq  |=([a=@rd b=@rd] ^-(? !(equ:^rd a b)))
```

---

### `+is-close` {#isclose}

The comparison of two floating-point atoms, within a relative tolerance (provided by the `+rd` door).

#### Accepts

A pair of floating-point atoms (`@rd`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (is-close .~1 .~2)
%.n
> (is-close .~1 .~1.0000001)
%.n
> (~(is-close rd [%z .~1e-3]) .~1 .~1.0000001)
%.y
```

#### Source

```hoon
++  is-close
  |=  [p=@rd r=@rd]
  (lth (abs (sub p r)) rtol)
```

---

### `+all-close` {#allclose}

The comparison of a floating-point atom to a list of floating- point atoms, within a relative tolerance (provided by the `+rd` door).

#### Accepts

A pair of floating-point atoms (`@rd`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (all-close .~1 ~[.~1 .~2])
%.n
> (all-close .~1 ~[.~1 .~1.0000001])
%.n
> (~(all-close rd [%z .~1e-3]) .~1 ~[.~1 .~1.0000001])
%.y
```

#### Source

```hoon
++  all-close
  |=  [p=@rd q=(list @rd)]
  =/  i  0
  =/  n  (lent q)
  |-  ^-  ?
  ?:  =(n i)
    %.y
  ?.  (is-close p (snag i q))
    %.n
  $$(i +(i))
```

---

### `+is-int` {#isint}

Returns whether a floating-point value is an integer (no fractional part).

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (is-int .~1)
%.y
> (is-int .~1.1)
%.n
```

#### Source

```hoon
++  is-int
  |=  x=@rd  ^-  ?
  (equ x (san (need (toi x))))
```

---

### `+add` {#add}

The sum of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (add .~1 .~2)
.~3
```

#### Source

```hoon
++  add  add:^rd
```

---

### `+sub` {#sub}

The difference of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (sub .~1 .~2)
.~-1
```

#### Source

```hoon
++  sub  sub:^rd
```

---

### `+mul` {#mul}

The product of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (mul .~1 .~2)
.~2
> (mul .~2 .~3)
.~6
```

#### Source

```hoon
++  mul  mul:^rd
```

---

### `+div` {#div}

The quotient of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (div .~1 .~2)
.~0.5
```

#### Source

```hoon
++  div  div:^rd
```

---

### `+fma` {#fma}

The fused multiply-add of three floating-point atoms.

#### Accepts

A triplet of floating-point atoms (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (fma .~1 .~2 .~3)
.~5
> (fma .~2 .~3 .~4)
.~10
```

#### Source

```hoon
++  fma  fma:^rd
```

---

### `+sig` {#sig}

The sign of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (sig .~1)
%.y
> (sig .~-1)
%.n
```

#### Source

```hoon
++  sig  |=(x=@rd =(0 (rsh [0 63] x)))
```

---

### `+sgn` {#sgn}

The sign of a floating-point atom. Alias for `+sig`.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (sgn .~1)
%.y
> (sgn .~-1)
%.n
```

#### Source

```hoon
++  sgn  sig
```

---

### `+neg` {#neg}

The negation of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (neg .~1)
.~-1
> (neg .~-1)
.~1
```

#### Source

```hoon
++  neg  |=(x=@rd (sub .~0 x))
```

---

### `+factorial` {#factorial}

The factorial of a floating-point atom.  Assumes integer input.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (factorial .~1)
.~1
> (factorial .~2)
.~2
> (factorial .~3)
.~6
```

#### Source

```hoon
++  factorial
  |=  x=@rd  ^-  @rd
  ?>  (gte x .~0)
  =/  t=@rd  .~1
  ?:  (is-close x .~0)
    t
  |-  ^-  @rd
  ?:  (is-close x .~1)
    t
  $$(x (sub x .~1), t (mul t x))
```

---

### `+abs` {#abs}

The absolute value of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (abs .~1)
.~1
> (abs .~-1)
.~1
```

#### Source

```hoon
++  abs
  |=  x=@rd  ^-  @rd
  ?:((sgn x) x (neg x))
```

---

### `+exp` {#exp}

The exponential of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (exp .~1)
.~2.7182818284582266
> (exp .~2)
.~7.389056098925858
> (~(exp rd [%z .~1e-15]) .~2)
.~7.389056098930642
> (exp .~inf)
.inf
```

#### Source

```hoon
++  exp
  |=  x=@rd  ^-  @rd
  ::  filter out non-finite arguments
  ?:  =(x 0x0)  .~1
  ::    check infinities
  ?:  =(x 0x7ff0.0000.0000.0000)  `@rd`0x7ff0.0000.0000.0000  :: exp(+inf) -> inf
  ?:  =(x 0xfff0.0000.0000.0000)  .~0.0                       :: exp(-inf) -> 0
  ::    check NaN
  ?.  (^gte (dis 0x7ff8.0000.0000.0000 x) 0)  `@rd`0x7ff8.0000.0000.0000  :: exp(NaN) -> NaN
  ::    check overflow to infinity
  =/  o-threshold  `@rd`0x4086.2e42.fefa.39ef  ::  709.782712893384, value above which exp(x) overflows
  ?:  (gth x o-threshold)  (mul huge huge)
  ::    check underflow to zero
  =/  u-threshold  `@rd`0xc086.2e42.fefa.39ef  ::  -709.782712893384, value below which exp(x) underflows
  ?:  (lth x u-threshold)  (mul tiny tiny)
  ::  otherwise, use Taylor series
  =/  p   .~1
  =/  po  .~-1
  =/  i   .~1
  |-  ^-  @rd
  ?:  (lth (abs (sub po p)) rtol)
    p
  $$(i (add i .~1), p (add p (div (pow-n x i) (factorial i))), po p)
```

---

### `+sin` {#sin}

The sine of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (sin .~1)
.~0.8414709848078934
> (sin .~2)
.~0.9092974268256406
> (sin pi)
.~-1.698287706085482e-13
```

#### Source

```hoon
++  sin
  |=  x=@rd  ^-  @rd
  ::  filter out non-finite arguments
  ::    check infinities
  ?:  =(x 0x7ff0.0000.0000.0000)  `@rd`0x7ff8.0000.0000.0000  :: sin(+inf) -> NaN
  ?:  =(x 0xfff0.0000.0000.0000)  `@rd`0x7ff8.0000.0000.0000  :: sin(-inf) -> NaN
  ::    check NaN
  ?.  (^gte (dis 0x7ff8.0000.0000.0000 x) 0)  `@rd`0x7ff8.0000.0000.0000  :: sin(NaN) -> NaN
  ::  map into domain
  =.  x  (mod x tau)
  ::  otherwise, use Taylor series
  =/  p   x
  =/  po  .~-2
  =/  i   1
  =/  term  x
  |-  ^-  @rd
  ?.  (gth (abs term) rtol)
    p
  =/  i2  (add (sun i) (sun i))
  =.  term  (mul (neg term) (div (mul x x) (mul i2 (add i2 .~1))))
  $$(i +(i), p (add p term), po p)
```

---

### `+cos` {#cos}

The cosine of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (cos .~1)
.~0.5403023058680917
> (cos .~2)
.~-0.41614683654756957
> (cos pi)
.~-1.0000000000013558
```

#### Source

```hoon
++  cos
  |=  x=@rd  ^-  @rd
  ::  filter out non-finite arguments
  ::    check infinities
  ?:  =(x 0x7ff0.0000.0000.0000)  `@rd`0x7ff8.0000.0000.0000  :: cos(+inf) -> NaN
  ?:  =(x 0xfff0.0000.0000.0000)  `@rd`0x7ff8.0000.0000.0000  :: cos(-inf) -> NaN
  ::    check NaN
  ?.  (^gte (dis 0x7ff8.0000.0000.0000 x) 0)  `@rd`0x7ff8.0000.0000.0000  :: exp(NaN) -> NaN
  ::  map into domain
  =.  x  (mod x tau)
  ::  otherwise, use Taylor series
  =/  p   .~1
  =/  po  .~-2
  =/  i   1
  =/  term  .~1
  |-  ^-  @rd
  ?.  (gth (abs term) rtol)
    p
  =/  i2  (add (sun i) (sun i))
  =.  term  (mul (neg term) (div (mul x x) (mul i2 (sub i2 .~1))))
  $$(i +(i), p (add p term), po p)
```

---

### `+tan` {#tan}

The tangent of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (tan .~1)
.~1.5574077246550349
> (tan .~2)
.~-2.185039863259177
> (tan pi)
.~-2.6535896228476087e-6
```

#### Source

```hoon
++  tan
  |=  x=@rd  ^-  @rd
  (div (sin x) (cos x))
```

---

### `+asin` {#asin}

The inverse sine of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (asin .~0)
.~0
> (asin .~1)
.~1.5707963267948966
> (asin .~0.7)
.~0.7753974965943197
```

#### Source

```hoon
++  asin
  |=  x=@rd  ^-  @rd
  ?.  (gte (abs x) .~1)
    (atan (div x (sqt (abs (sub .~1 (mul x x))))))
  ?:  =(.~1 x)   ^~((mul pi .~0.5))
  ?:  =(.~-1 x)  ^~((mul pi .~-0.5))
  ~|([%asin-out-of-bounds x] !!)
```

---

### `+acos` {#acos}

The inverse cosine of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (acos .~0)
.~1.5707963267948966
> (acos .~1)
.~0
> (acos .~0.7)
.~0.7953988301652518
```

#### Source

```hoon
++  acos
  |=  x=@rd  ^-  @rd
  ?.  (gte (abs x) .~1)
    ?:  =(.~0 x)  ^~((mul pi .~0.5))
    (atan (div (sqt (abs (sub .~1 (mul x x)))) x))
  ?:  =(.~1 x)   .~0
  ?:  =(.~-1 x)  pi
  ~|([%acos-out-of-bounds x] !!)
```

---

### `+atan` {#atan}

The inverse tangent of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (atan .~1)
.~0.7853981633821053
> (atan .~2)
.~1.1071487178081938
> (atan pi)
.~1.2626272558398273
```

#### Source

```hoon
++  atan
  |=  x=@rd  ^-  @rd
  =/  a  (pow (add .~1 (mul x x)) .~-0.5)
  =/  b  .~1
  |-
  ?.  (gth (abs (sub a b)) rtol)
    (div x (mul (pow (add .~1 (mul x x)) .~0.5) b))
  =/  ai  (mul .~0.5 (add a b))
  =/  bi  (sqt (mul ai b))
  $$(a ai, b bi)
```

---

### `+atan2` {#atan2}

The inverse tangent of a floating-point coordinate.

#### Accepts

A pair of floating-point atoms (`@rd`), representing the y and x coordinates.

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (atan2 .~0 .~1)
.~0
> (atan2 .~-1 .~0)
.~-1.5707963267948966
> (atan2 .~0.5 .~-0.5)
.~2.3561944902107888
```

#### Source

```hoon
++  atan2
  |=  [y=@rd x=@rd]  ^-  @rd
  ?:  (gth x .~0)
    (atan (div y x))
  ?:  &((lth x .~0) (gte y .~0))
    (add (atan (div y x)) pi)
  ?:  &((lth x .~0) (lth y .~0))
    (sub (atan (div y x)) pi)
  ?:  &(=(.~0 x) (gth y .~0))
    (div pi .~2)
  ?:  &(=(.~0 x) (lth y .~0))
    (mul .~-1 (div pi .~2))
  .~0  ::  undefined
```

---

### `+pow-n` {#pow-n}

Returns the power of a floating-point atom to an integer exponent.

#### Accepts

A pair of floating-point atoms (`@rd`), where the first is the base and the second is the exponent.

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (pow-n .~1 .~2)
.~1

> (pow-n .~2 .~2)
.~4

> (pow-n .~2 .~3)
.~8
```

#### Source

```hoon
++  pow-n
    |=  [x=@rd n=@rd]  ^-  @rd
    ?:  =(n .~0)  .~1
    ?>  &((gth n .~0) (is-int n))
    =/  p  x
    |-  ^-  @rd
    ?:  (lth n .~2)
      p
    $$(n (sub n .~1), p (mul p x))
```

### `+log` {#log}

The natural logarithm of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (log .~1)
.~0

> (log .~2)
.~0.6931471805589156

> (~(log rd [%z .~1e-15]) .~2)
.~0.693147180559944

> (log .~inf)
.~inf
```

#### Source

```hoon
++  log
  |=  z=@rd  ^-  @rd
  ::  filter out non-finite arguments
  ::    check infinities
  ?:  =(z 0x7ff0.0000.0000.0000)  `@rd`0x7ff0.0000.0000.0000  :: exp(+inf) -> inf
  ?:  =(z 0xfff0.0000.0000.0000)  .~0.0                       :: exp(-inf) -> 0
  ::    check NaN
  ?.  (^gte (dis 0x7ff8.0000.0000.0000 z) 0)  `@rd`0x7ff8.0000.0000.0000  :: exp(NaN) -> NaN
  ::  otherwise, use Taylor series
  =/  p   .~0
  =/  po  .~-1
  =/  i   .~0
  |-  ^-  @rd
  ?:  (lth (abs (sub po p)) rtol)
    (mul (div (mul .~2 (sub z .~1)) (add z .~1)) p)
  =/  term1  (div .~1 (add .~1 (mul .~2 i)))
  =/  term2  (mul (sub z .~1) (sub z .~1))
  =/  term3  (mul (add z .~1) (add z .~1))
  =/  term  (mul term1 (pow-n (div term2 term3) i))
  $$(i (add i .~1), p (add p term), po p)
```

### `+log-10` {#log10}

The base-10 logarithm of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (log-10 .~0.1)
.~-0.9999999999082912

> (log-10 .~2)
.~0.30102999566353394

> (~(log-10 rd [%z .~1e-8]) .~2)
.~0.30102999562024696
```

#### Source

```hoon
++  log-10
  |=  z=@rd  ^-  @rd
  (div (log z) log10)
```

### `+log-2` {#log2}

The base-2 logarithm of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (log-2 .~0.1)
.~-3.321928094582713

> (log-2 .~2)
.~0.9999999999985144

> (~(log-2 rs [%z .1e-8]) .~2)
.~0.9999999998547181
```

#### Source

```hoon
++  log-2
  |=  z=@rd  ^-  @rd
  (div (log z) log2)
```

### `+pow` {#pow}

The power of a floating-point atom to a floating-point exponent.

#### Accepts

A pair of floating-point atoms (`@rd`), where the first is the base and the second is the exponent.

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (pow .~1 .~2)
.~1

> (pow .~2 .~2)
.~4

> (pow .~2 .~3.5)
.~11.313708498941306

> (~(pow rd [%z .~1e-15]) .~2 .~3.5)
.~11.313708498984685
```

#### Source

```hoon
++  pow
  |=  [x=@rd n=@rd]  ^-  @rd
  ::  fall through on positive integers (faster)
  ?:  &(=(n (san (need (toi n)))) (gth n .~0))  (pow-n x (san (need (toi n))))
  (exp (mul n (log x)))
```

### `+sqrt` {#sqrt}

The square root of a floating-point atom.  Alias for `+sqt`.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (sqrt .~1)
.~1

> (sqrt .~2)
.~1.414213562373095

> (~(sqrt rd [%z .~1e-15]) .~2)
.~1.4142135623730923
```

#### Source

```hoon
++  sqrt  sqt
```

### `+sqt` {#sqt}

The square root of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (sqt .~1)
.~1

> (sqt .~2)
.~1.414213562373095

> (~(sqt rd [%z .~1e-15]) .~2)
.~1.4142135623730923
```

#### Source

```hoon
++  sqt
  |=  x=@rd  ^-  @rd
  ?>  (sgn x)
  ?:  =(.~0 x)  .~0
  =/  g=@rd  (div x .~2)
  |-
  =/  n=@rd  (mul .~0.5 (add g (div x g)))
  ?.  (gth (abs (sub g n)) rtol)
    n
  $$(g n)
```

### `+cbrt` {#cbrt}

The cube root of a floating-point atom.  Alias for `+cbt`.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (cbrt .~1)
.~1

> (cbrt .~2)
.~1.2599210498943176

> (~(cbrt rd [%z .~1e-15]) .~2)
.~1.2599210498948716
```

#### Source

```hoon
  ++  cbrt  cbt
```

### `+cbt` {#cbt}

The cube root of a floating-point atom.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (cbt .~1)
.~1

> (cbt .~2)
.~1.2599210498943176

> (~(cbt rd [%z .~1e-15]) .~2)
.~1.2599210498948716
```

#### Source

```hoon
++  cbt
  |=  x=@rd  ^-  @rd
  ?>  (sgn x)
  (pow x .~0.3333333333333333)
```

### `+arg` {#arg}

The argument of a floating-point atom (real argument = absolute value).

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (arg .~1)
.~1

> (arg .~-1)
.~1

> (arg .~0)
.~0
```

#### Source

```hoon
++  arg  abs
```

### `+round` {#round}

The rounding of a floating-point atom to a given number of decimal places.

#### Accepts

A pair of floating-point atoms (`@rd` and `@ud`), where the first is the value to round and the second is the number of decimal places.

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (round .~1 0)
.~.1

> (round .~1.11 1)
.~.1.1

> (round .~1.11 2)
.~.1.11
```

#### Source

```hoon
++  round
  |=  [x=@rd n=@ud]  ^-  @rd
  ?:  =(.~0 x)  .~0
  ::  Calculate the order of magnitude.
  =/  oom  (san (need (toi (log-10 (abs x)))))
  ::  Calculate the scaling factor.
  =/  scaling  (pow .~10 :(sub (sun n) oom .~1))
  ::  Round the mantissa to desired significant digits.
  =/  rnd-mantissa  (round-bankers (mul x scaling))
  ::  Convert back to the original scale.
  (div rnd-mantissa scaling)
```

### `+round-places` {#round-places}

Rounds a floating-point atom to a specified number of decimal places.

#### Accepts

A pair of floating-point atoms (`@rd` and `@ud`), where the first is the value to round and the second is the number of decimal places.

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (round-places .~1 0)
.~.1

> (round-places .~1.11 1)
.~.1.1

> (round-places .~1.285 2)
.~.1.28
```

#### Discussion

This is exceptionally sensitive to off-by-one floating-point rounding error.

#### Source

```hoon
++  round-places
  |=  [x=@rd n=@ud]  ^-  @rd
  ::  Calculate the scaling factor.
  =/  scaling  (pow .~10 (sun n))
  ::  Scale the number.
  =/  scaled  (mul x scaling)
  ::  Round the mantissa to desired significant digits.
  =/  rnd-mantissa  (round-bankers scaled)
  ::  Convert back to the original scale.
  (div rnd-mantissa scaling)
```

### `+round-bankers` {#round-bankers}

The floating-point atom rounded to the nearest integer, with ties rounded to the nearest even integer.

#### Accepts

A floating-point atom (`@rd`).

#### Produces

A floating-point atom (`@rd`).

#### Examples

```hoon
> (round-bankers .~1)
.~.1

> (round-bankers .~1.5)
.~.2

> (round-bankers .~1.49)
.~.1
```

#### Source

```hoon
++  round-bankers
  |=  x=@rd  ^-  @rd
  =/  int  (san (need (toi x)))
  =/  dcm  (sub x int)
  ?:  (lth dcm .~0.5)
    int
  (add int .~1)
```

---

## `+rh` {#rh}

Half-precision IEEE 754 floating-point arithmetic.

A container core for operations related to half-precision binary floats.

`+rh` has four rounding modes: round to nearest (`%n`), round up (`%u`), round down (`%d`), and round to zero (`%z`). The default rounding mode is `%z`. If you need a different rounding mode, you'd do something like `=/  rh-n  ~(. rh [%n rtol])` and then call the arms of your modified version instead.

`+rh` supports a relative tolerance for precision of operations, which is set by the `rtol` parameter. The default value is `_.~~1e-2`, but you can change it by passing a different value in the `rh` door.

#### Source

```hoon
++  rh
  ^|
  |_  $$:  r=$?(%n %u %d %z)   :: round nearest, up, down, to zero
          rtol=_.~~1e-2       :: relative tolerance for precision of operations
      ==
```

---

### `+tau` {#tau}

The value $$\tau = 2 \pi$$ (OEIS A019692), radian angle measure of a full turn.

#### Produces

The value of tau $$\tau$$ or 2 pi $$\pi$$, radian angle measure of a full turn, represented as a single-precision floating-point atom.

#### Examples

```hoon
> tau
.~~6.28
```

#### Source

```hoon
++  tau  .~~6.28
```

### `+pi` {#pi}

The value pi (OEIS A000796), radian angle measure of a half turn.

#### Produces

The value of pi $$\pi$$, radian angle measure of a half turn, represented as a single-precision floating-point atom.

#### Examples

```hoon
> pi
.~~3.14
```

#### Source

```hoon
++  pi  .~~3.14
```
### `+e` {#e}

The value e (Euler's constant) (OEIS A001113).

#### Produces

The value of e, represented as a half-precision floating-point atom.

#### Examples

```hoon
> e
.~~2.72
```

#### Source

```hoon
++  e  .~~2.719
```

### `+phi` {#phi}

The value phi (golden ratio) (OEIS A001622).

#### Produces

The value of phi, represented as a half-precision floating-point atom.

#### Examples

```hoon
> phi
.~~1.62
```

#### Source

```hoon
++  phi  .~~1.618
```

### `+sqt2` {#sqt2}

The value sqrt(2) (OEIS A002193).

#### Produces

The value of sqrt(2), represented as a half-precision floating-point atom.

#### Examples

```hoon
> sqt2
.~~1.414
```

#### Source

```hoon
++  sqt2  .~~1.414
```

### `+invsqt2` {#invsqt2}

The value 1/sqrt(2) (OEIS A010503).

#### Produces

The value of 1/sqrt(2), represented as a half-precision floating-point atom.

#### Examples

```hoon
> invsqt2
.~~0.707
```

#### Source

```hoon
++  invsqt2  .~~0.707
```

### `+log2` {#log2}

The value log(2) (OEIS A002162).

#### Produces

The value of log(2), represented as a half-precision floating-point atom.

#### Examples

```hoon
> log2
.~~0.693
```

#### Source

```hoon
++  log2  .~~0.6934
```

### `+invlog2` {#invlog2}

The value 1/log(2).

#### Produces

The value of 1/log(2), represented as a half-precision floating-point atom.

#### Examples

```hoon
> invlog2
.~~1.443
```

#### Source

```hoon
++  invlog2  .~~1.443
```

### `+log10` {#log10}

The value log(10) (OEIS A002392).

#### Produces

The value of log(10), represented as a half-precision floating-point atom.

#### Examples

```hoon
> log10
.~~2.303
```

#### Source

```hoon
++  log10  .~~2.303
```

### `+huge` {#huge}

The value of the largest representable number.

#### Produces

The value of the largest representable number, represented as a half-precision floating-point atom.

#### Examples

```hoon
> huge
.~~6.55e+04
```

#### Source

```hoon
++  huge  `@rh`0x7bff  ::  6.55e+04
```

### `+tiny` {#tiny}

The value of the smallest representable normal number.

#### Produces

The value of the smallest representable normal number, represented as a half-precision floating-point atom.

#### Examples

```hoon
> tiny
.~~6.10e-05
```

#### Source

```hoon
++  tiny  `@rh`0x1     ::  6e-08
```

### `+sea` {#sea}

Floating-point atom representation.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A `$fn` representation of the floating-point atom.

#### Examples

```hoon
> (sea .~~1)
[%f s=%.y e=-10 a=1.024]

> (sea .~~1.1)
[%f s=%.y e=-10 a=1.126]
```

#### Source

```hoon
++  sea  sea:^rh
```

### `+bit` {#bit}

The floating-point atom representation of a `$fn`.

#### Accepts

A `$fn` representation of a floating-point atom.

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (bit [%f s=%.y e=-10 a=1.024])
.~~1

> (bit [%f s=%.y e=-10 a=1.126])
.~~1.1
```

#### Source

```hoon
++  bit  bit:^rh
```

### `+sun` {#sun}

Floating-point atom of an unsigned integer.

#### Accepts

An unsigned integer atom (`@ud`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (sun 1)
.~~1

> (sun 1.000)
.~~1e3
```

#### Source

```hoon
++  sun  sun:^rh
```

### `+san` {#san}

The floating-point atom of a signed integer.

#### Accepts

A signed integer atom (`@sd`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (san --1)
.~~1

> (san -1)
.~~-1
```

#### Source

```hoon
++  san  san:^rh
```

### `+toi` {#toi}

The unitized signed integer atom of a rounded floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A unitized signed integer atom (`@sd`).

#### Examples

```hoon
> (toi .~~1)
[~ --1]

> (toi .~~1.1)
[~ --1]
```

#### Source

```hoon
++  toi  toi:^rh
```

### `+drg` {#drg}

The decimal form of a floating-point atom using the Dragon4 algorithm.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A decimal form (`+dn`).

#### Examples

```hoon
> (drg .~~1)
[%d s=%.y e=--0 a=1]

> (drg .~~1.1)
[%d s=%.y e=-1 a=11]
```

#### Source

```hoon
++  drg  drg:^rh
```

### `+grd` {#grd}

The floating-point atom of a decimal form.  Inverse of `+drg`.

#### Accepts

A decimal form (`+dn`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (grd [%d s=%.y e=--0 a=1])
.~~1

> (grd [%d s=%.y e=-1 a=11])
.~~1.1
```

#### Source

```hoon
++  grd  grd:^rh
```




### `+lth` {#lth}

The comparison of two floating-point atoms, less than.

#### Accepts

A pair of floating-point atoms (`@rh`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (lth .~~1 .~~2)
%.y
> (lth .~~2 .~~1)
%.n
> (lth .~~1 .~~1)
%.n
```

#### Source

```hoon
++  lth  lth:^rh
```

---

### `+lte` {#lte}

The comparison of two floating-point atoms, less than or equal to.

#### Accepts

A pair of floating-point atoms (`@rh`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (lte .~~1 .~~2)
%.y
> (lte .~~2 .~~1)
%.n
> (lte .~~1 .~~1)
%.y
```

#### Source

```hoon
++  lte  lte:^rh
```

---

### `+leq` {#leq}

The comparison of two floating-point atoms, less than or equal to. Alias for `+lte`.

#### Accepts

A pair of floating-point atoms (`@rh`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (leq .~~1 .~~2)
%.y
> (leq .~~2 .~~1)
%.n
> (leq .~~1 .~~1)
%.y
```

#### Source

```hoon
++  leq  lte:^rh
```

---

### `+equ` {#equ}

The comparison of two floating-point atoms, equal to.

#### Accepts

A pair of floating-point atoms (`@rh`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (equ .~~1 .~~2)
%.n
> (equ .~~2 .~~1)
%.n
> (equ .~~1 .~~1)
%.y
```

#### Source

```hoon
++  equ  equ:^rh
```

---

### `+gth` {#gth}

The comparison of two floating-point atoms, greater than.

#### Accepts

A pair of floating-point atoms (`@rh`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (gth .~~1 .~~2)
%.n
> (gth .~~2 .~~1)
%.y
> (gth .~~1 .~~1)
%.n
```

#### Source

```hoon
++  gth  gth:^rh
```

---

### `+gte` {#gte}

The comparison of two floating-point atoms, greater than or equal to.

#### Accepts

A pair of floating-point atoms (`@rh`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (gte .~~1 .~~2)
%.n
> (gte .~~2 .~~1)
%.y
> (gte .~~1 .~~1)
%.y
```

#### Source

```hoon
++  gte  gte:^rh
```

---

### `+geq` {#geq}

The comparison of two floating-point atoms, greater than or equal to. Alias for `+gte`.

#### Accepts

A pair of floating-point atoms (`@rh`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (geq .~~1 .~~2)
%.n
> (geq .~~2 .~~1)
%.y
> (geq .~~1 .~~1)
%.y
```

#### Source

```hoon
++  geq  gte:^rh
```

---

### `+neq` {#neq}

The comparison of two floating-point atoms, not equal to.

#### Accepts

A pair of floating-point atoms (`@rh`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (neq .~~1 .~~2)
%.y
> (neq .~~2 .~~1)
%.y
> (neq .~~1 .~~1)
%.n
```

#### Source

```hoon
++  neq  |=([a=@rh b=@rh] ^-(? !(equ:^rh a b)))
```

---

### `+is-close` {#isclose}

The comparison of two floating-point atoms, within a relative tolerance (provided by the `+rh` door).

#### Accepts

A pair of floating-point atoms (`@rh`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (is-close .~~1 .~~2)
%.n
> (is-close .~~1 .~~1.0000001)
%.n
> (~(is-close rh [%z .~~1e-3]) .~~1 .~~1.0001)
%.y
```

#### Source

```hoon
++  is-close
  |=  [p=@rh r=@rh]
  (lth (abs (sub p r)) rtol)
```

---

### `+all-close` {#allclose}

The comparison of a floating-point atom to a list of floating-point atoms, within a relative tolerance (provided by the `+rh` door).

#### Accepts

A pair of floating-point atoms (`@rh`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (all-close .~~1 ~[.~~1 .~~2])
%.n
> (all-close .~~1 ~[.~~1 .~~1.0000001])
%.n
> (~(all-close rh [%z .~~1e-3]) .~~1 ~[.~~1 .~~1.0001])
%.y
```

#### Source

```hoon
++  all-close
  |=  [p=@rh q=(list @rh)]
  =/  i  0
  =/  n  (lent q)
  |-  ^-  ?
  ?:  =(n i)
    %.y
  ?.  (is-close p (snag i q))
    %.n
  $$(i +(i))
```

---

### `+is-int` {#isint}

Returns whether a floating-point value is an integer (no fractional part).

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (is-int .~~1)
%.y
> (is-int .~~1.1)
%.n
```

#### Source

```hoon
++  is-int
  |=  x=@rh  ^-  ?
  (equ x (san (need (toi x))))
```

---

### `+add` {#add}

The sum of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (add .~~1 .~~2)
.~~3
```

#### Source

```hoon
++  add  add:^rh
```

---

### `+sub` {#sub}

The difference of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (sub .~~1 .~~2)
.~~-1
```

#### Source

```hoon
++  sub  sub:^rh
```

---

### `+mul` {#mul}

The product of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (mul .~~1 .~~2)
.~~2
```

#### Source

```hoon
++  mul  mul:^rh
```

---

### `+div` {#div}

The quotient of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (div .~~1 .~~2)
.~~0.5
```

#### Source

```hoon
++  div  div:^rh
```

---

### `+fma` {#fma}

The fused multiply-add of three floating-point atoms.

#### Accepts

A triplet of floating-point atoms (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (fma .~~1 .~~2 .~~3)
.~~5
> (fma .~~2 .~~3 .~~4)
.~~10
```

#### Source

```hoon
++  fma  fma:^rh
```

---

### `+sig` {#sig}

The sign of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (sig .~~1)
%.y
> (sig .~~-1)
%.n
```

#### Source

```hoon
++  sig  |=(x=@rh =(0 (rsh [0 15] x)))
```

---

### `+sgn` {#sgn}

The sign of a floating-point atom. Alias for `+sig`.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A `$flag`.

#### Examples

```hoon
> (sgn .~~1)
%.y
> (sgn .~~-1)
%.n
```

#### Source

```hoon
++  sgn  sig
```

---

### `+neg` {#neg}

The negation of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (neg .~~1)
.~~-1
> (neg .~~-1)
.~~1
```

#### Source

```hoon
++  neg  |=(x=@rh (sub .~~0 x))
```

---

### `+factorial` {#factorial}

The factorial of a floating-point atom. Assumes integer input.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (factorial .~~1)
.~~1
> (factorial .~~2)
.~~2
> (factorial .~~3)
.~~6
```

#### Source

```hoon
++  factorial
  |=  x=@rh  ^-  @rh
  ?>  (gte x .~~0)
  =/  t=@rh  .~~1
  ?:  (is-close x .~~0)
    t
  |-  ^-  @rh
  ?:  (is-close x .~~1)
    t
  $$(x (sub x .~~1), t (mul t x))
```

---

### `+abs` {#abs}

The absolute value of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (abs .~~1)
.~~1
> (abs .~~-1)
.~~1
```

#### Source

```hoon
++  abs
  |=  x=@rh  ^-  @rh
  ?:((sgn x) x (neg x))
```

---

### `+exp` {#exp}

The exponential of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (exp .~~1)
.~~2.715
> (exp .~~2)
.~~7.375
> (~(exp rh [%z .~~1e-1]) .~~2)
.~~7.348
> (exp .~~inf)
.inf
```

#### Source

```hoon
++  exp
  |=  x=@rh  ^-  @rh
  ::  filter out non-finite arguments
  ?:  =(x 0x0)  .~~1
  ::    check infinities
  ?:  =(x 0x7c00)  `@rh`0x7c00  :: exp(+inf) -> inf
  ?:  =(x 0xfc00)  .~~0.0       :: exp(-inf) -> 0
  ::    check NaN
  ?.  (^gte (dis 0x7e00 x) 0)  `@rh`0x7e00  :: exp(NaN) -> NaN
  ::    check overflow to infinity
  =/  o-threshold  `@rh`0x498c  ::  11.091265424003277, value above which exp(x) overflows
  ?:  (gth x o-threshold)  (mul huge huge)
  ::    check underflow to zero
  =/  u-threshold  `@rh`0xc98c  ::  -11.091265424003277, value below which exp(x) underflows
  ?:  (lth x u-threshold)  (mul tiny tiny)
  ::  otherwise, use Taylor series
  =/  p   .~~1
  =/  po  .~~-1
  =/  i   .~~1
  |-  ^-  @rh
  ?:  (lth (abs (sub po p)) rtol)
    p
  $$(i (add i .~~1), p (add p (div (pow-n x i) (factorial i))), po p)
```

---

### `+sin` {#sin}

The sine of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (sin .~~1)
.~~0.8413
> (sin .~~2)
.~~0.9087
> (sin pi)
.~~3.437e-3
```

#### Source

```hoon
++  sin
  |=  x=@rh  ^-  @rh
  ::  filter out non-finite arguments
  ::    check infinities
  ?:  =(x 0x7c00)  `@rh`0x7e00  :: sin(+inf) -> NaN
  ?:  =(x 0xfc00)  `@rh`0x7e00  :: sin(-inf) -> NaN
  ::    check NaN
  ?.  (^gte (dis 0x7e00 x) 0)  `@rh`0x7e00  :: sin(NaN) -> NaN
  ::  map into domain
  =.  x  (mod x tau)
  ::  otherwise, use Taylor series
  =/  p   x
  =/  po  .~~-2
  =/  i   1
  =/  term  x
  |-  ^-  @rh
  ?.  (gth (abs term) rtol)
    p
  =/  i2  (add (sun i) (sun i))
  =.  term  (mul (neg term) (div (mul x x) (mul i2 (add i2 .~~1))))
  $$(i +(i), p (add p term), po p)
```

---

### `+cos` {#cos}

The cosine of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (cos .~~1)
.~~0.54
> (cos .~~2)
.~~-0.4158
> (cos pi)
.~~-1.001
```

#### Source

```hoon
++  cos
  |=  x=@rh  ^-  @rh
  ::  filter out non-finite arguments
  ::    check infinities
  ?:  =(x 0x7c00)  `@rh`0x7e00  :: cos(+inf) -> NaN
  ?:  =(x 0xfc00)  `@rh`0x7e00  :: cos(-inf) -> NaN
  ::    check NaN
  ?.  (^gte (dis 0x7e00 x) 0)  `@rh`0x7e00  :: cos(NaN) -> NaN
  ::  map into domain
  =.  x  (mod x tau)
  ::  otherwise, use Taylor series
  =/  p   .~~1
  =/  po  .~~-2
  =/  i   1
  =/  term  .~~1
  |-  ^-  @rh
  ?.  (gth (abs term) rtol)
    p
  =/  i2  (add (sun i) (sun i))
  =.  term  (mul (neg term) (div (mul x x) (mul i2 (sub i2 .~~1))))
  $$(i +(i), p (add p term), po p)
```

---

### `+tan` {#tan}

The tangent of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (tan .~~1)
.~~1.558
> (tan .~~2)
.~~-2.186
> (tan pi)
.~~-3.433e-3
```

#### Source

```hoon
++  tan
  |=  x=@rh  ^-  @rh
  (div (sin x) (cos x))
```

---

### `+asin` {#asin}

The inverse sine of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (asin .~~0)
.~~0
> (asin .~~1)
.~~1.57
> (asin .~~0.7)
.~~0.7773
```

#### Source

```hoon
++  asin
  |=  x=@rh  ^-  @rh
  ?.  (gte (abs x) .~~1)
    (atan (div x (sqt (abs (sub .~~1 (mul x x))))))
  ?:  =(.~~1 x)   ^~((mul pi .~~0.5))
  ?:  =(.~~-1 x)  ^~((mul pi .~~-0.5))
  ~|([%asin-out-of-bounds x] !!)
```

---

### `+acos` {#acos}

The inverse cosine of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (acos .~~0)
.~~1.57
> (acos .~~1)
.~~0
> (acos .~~0.7)
.~~0.7964
```

#### Source

```hoon
++  acos
  |=  x=@rh  ^-  @rh
  ?.  (gte (abs x) .~~1)
    ?:  =(.~~0 x)  ^~((mul pi .~~0.5))
    (atan (div (sqt (abs (sub .~~1 (mul x x)))) x))
  ?:  =(.~~1 x)   .~~0
  ?:  =(.~~-1 x)  pi
  ~|([%acos-out-of-bounds x] !!)
```

---

### `+atan` {#atan}

The inverse tangent of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (atan .~~1)
.~~0.7866
> (atan .~~2)
.~~1.111
> (atan pi)
.~~1.281
```

#### Source

```hoon
++  atan
  |=  x=@rh  ^-  @rh
  =/  a  (pow (add .~~1 (mul x x)) .~~-0.5)
  =/  b  .~~1
  |-
  ?.  (gth (abs (sub a b)) rtol)
    (div x (mul (pow (add .~~1 (mul x x)) .~~0.5) b))
  =/  ai  (mul .~~0.5 (add a b))
  =/  bi  (sqt (mul ai b))
  $$(a ai, b bi)
```

---

### `+atan2` {#atan2}

The inverse tangent of a floating-point coordinate.

#### Accepts

A pair of floating-point atoms (`@rh`), representing the y and x coordinates.

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (atan2 .~~0 .~~1)
.~~0
> (atan2 .~~-1 .~~0)
.~~-1.57
> (atan2 .~~0.5 .~~-0.5)
.~~2.354
```

#### Source

```hoon
++  atan2
  |=  [y=@rh x=@rh]  ^-  @rh
  ?:  (gth x .~~0)
    (atan (div y x))
  ?:  &((lth x .~~0) (gte y .~~0))
    (add (atan (div y x)) pi)
  ?:  &((lth x .~~0) (lth y .~~0))
    (sub (atan (div y x)) pi)
  ?:  &(=(.~~0 x) (gth y .~~0))
    (div pi .~~2)
  ?:  &(=(.~~0 x) (lth y .~~0))
    (mul .~~-1 (div pi .~~2))
  .~~0  ::  undefined
```

---

### `+pow-n` {#pow-n}

Returns the power of a floating-point atom to an integer exponent.

#### Accepts

A pair of floating-point atoms (`@rh`), where the first is the base and the second is the exponent.

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (pow-n .~~1 .~~2)
.~~1
> (pow-n .~~2 .~~2)
.~~4
> (pow-n .~~2 .~~3)
.~~8
```

#### Source

```hoon
++  pow-n
  |=  [x=@rh n=@rh]  ^-  @rh
  ?:  =(n .~~0)  .~~1
  ?>  &((gth n .~~0) (is-int n))
  =/  p  x
  |-  ^-  @rh
  ?:  (lth n .~~2)
    p
  $$(n (sub n .~~1), p (mul p x))
```

---

### `+log` {#log}

The natural logarithm of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (log .~~1)
.~~0
> (log .~~2)
.~~0.6914
> (~(log rh [%z .~~1e-1]) .~~2)
.~~0.6904
```

#### Source

```hoon
++  log
  |=  z=@rh  ^-  @rh
  ::  filter out non-finite arguments
  ::    check infinities
  ?:  =(z 0x7c00)  `@rh`0x7c00  :: exp(+inf) -> inf
  ?:  =(z 0xfc00)  .~~0.0       :: exp(-inf) -> 0
  ::    check NaN
  ?.  (^gte (dis 0x7e00 z) 0)  `@rh`0x7e00  :: exp(NaN) -> NaN
  ::  otherwise, use Taylor series
  =/  p   .~~0
  =/  po  .~~-1
  =/  i   .~~0
  |-  ^-  @rh
  ?:  (lth (abs (sub po p)) rtol)
    (mul (div (mul .~~2 (sub z .~~1)) (add z .~~1)) p)
  =/  term1  (div .~~1 (add .~~1 (mul .~~2 i)))
  =/  term2  (mul (sub z .~~1) (sub z .~~1))
  =/  term3  (mul (add z .~~1) (add z .~~1))
  =/  term  (mul term1 (pow-n (div term2 term3) i))
  $$(i (add i .~~1), p (add p term), po p)
```

---

### `+log-10` {#log10}

The base-10 logarithm of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (log-10 .~~0.1)
.~~-0.9995
> (log-10 .~~2)
.~~0.3013
> (~(log-10 rh [%z .~~1e-1]) .~~2)
.~~0.3008
```

#### Source

```hoon
++  log-10
  |=  z=@rh  ^-  @rh
  (div (log z) log10)
```

---

### `+log-2` {#log2}

The base-2 logarithm of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (log-2 .~~0.1)
.~~-3.32
> (log-2 .~~2)
.~~0.9995
> (~(log-2 rh [%z .~~1e-1]) .~~2)
.~~0.9961
```

#### Source

```hoon
++  log-2
  |=  z=@rh  ^-  @rh
  (div (log z) log2)
```

---

### `+pow` {#pow}

The power of a floating-point atom to a floating-point exponent.

#### Accepts

A pair of floating-point atoms (`@rh`), where the first is the base and the second is the exponent.

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (pow .~~1 .~~2)
.~~1
> (pow .~~2 .~~2)
.~~4
> (~(pow rh [%z .~~1e-1]) .~~2 .~~3.5)
.~~11.14
```

#### Source

```hoon
++  pow
  |=  [x=@rh n=@rh]  ^-  @rh
  ::  fall through on positive integers (faster)
  ?:  &(=(n (san (need (toi n)))) (gth n .~~0))  (pow-n x (san (need (toi n))))
  (exp (mul n (log x)))
```

---

### `+sqrt` {#sqrt}

The square root of a floating-point atom. Alias for `+sqt`.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (sqrt .~~1)
.~~1
> (sqrt .~~2)
.~~1.412
> (~(sqrt rh [%z .~~1e-1]) .~~2)
.~~1.404
```

#### Source

```hoon
++  sqrt  sqt
```

---

### `+sqt` {#sqt}

The square root of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (sqt .~~1)
.~~1
> (sqt .~~2)
.~~1.414
> (sqt .~~1e3)
.~~31.61
```

#### Source

```hoon
++  sqt
  |=  x=@rh  ^-  @rh
  ?>  (sgn x)
  ?:  =(.~~0 x)  .~~0
  =/  g=@rh  (div x .~~2)
  |-
  =/  n=@rh  (mul .~~0.5 (add g (div x g)))
  ?.  (gth (abs (sub g n)) rtol)
    n
  $$(g n)
```

---

### `+cbrt` {#cbrt}

The cube root of a floating-point atom. Alias for `+cbt`.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (cbrt .~~1)
.~~1
> (cbrt .~~2)
.~~1.258
> (~(cbrt rh [%z .~~1e-1]) .~~2)
.~~1.256
```

#### Source

```hoon
++  cbrt  cbt
```

---

### `+cbt` {#cbt}

The cube root of a floating-point atom.

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (cbt .~~1)
.~~1
> (cbt .~~2)
.~~1.258
> (~(cbt rh [%z .~~1e-1]) .~~2)
.~~1.256
```

#### Source

```hoon
++  cbt
  |=  x=@rh  ^-  @rh
  ?>  (sgn x)
  (pow x .~~0.3333)
```

---

### `+arg` {#arg}

The argument of a floating-point atom (real argument = absolute value).

#### Accepts

A floating-point atom (`@rh`).

#### Produces

A floating-point atom (`@rh`).

#### Examples

```hoon
> (arg .~~1)
.~~1
> (arg .~~-1)
.~~1
> (arg .~~0)
.~~0
```

#### Source

```hoon
++  arg  abs
```

---

## `+rq` {#rq}

Quadruple-precision IEEE 754 floating-point arithmetic.

A container core for operations related to quadruple-precision binary floats.

`+rq` has four rounding modes: round to nearest (`%n`), round up (`%u`), round down (`%d`), and round to zero (`%z`). The default rounding mode is `%z`. If you need a different rounding mode, you'd do something like `=/  rq-n  ~(. rq [%n rtol])` and then call the arms of your modified version instead.

`+rq` supports a relative tolerance for precision of operations, which is set by the `rtol` parameter. The default value is `_.~~~1e-20`, but you can change it by passing a different value in the `rq` door.

#### Source

```hoon
++  rq
  ^|
  |_  $$:  r=$?(%n %u %d %z)   :: round nearest, up, down, to zero
          rtol=_.~~~1e-20     :: relative tolerance for precision of operations
      ==
```

---

### `+tau` {#tau}

The value $$\tau = 2 \pi$$ (OEIS A019692), radian angle measure of a full turn.

#### Produces

The value of tau $$\tau$$ or 2 pi $$\pi$$, radian angle measure of a full turn, represented as a single-precision floating-point atom.

#### Examples

```hoon
> tau
.~~~6.2831853071795864769252867665590056
```

#### Source

```hoon
++  tau  .~~~6.2831853071795864769252867665590056
```

### `+pi` {#pi}

The value pi (OEIS A000796), radian angle measure of a half turn.

#### Produces

The value of pi $$\pi$$, radian angle measure of a half turn, represented as a single-precision floating-point atom.

#### Examples

```hoon
> pi
.~~~3.1415926535897932384626433832795028
```

#### Source

```hoon
++  pi  .~~~3.1415926535897932384626433832795028
```

### `+e` {#e}

The value e (Euler's constant) (OEIS A001113).

#### Produces

The value of e, represented as a quad-precision floating-point atom.

#### Examples

```hoon
> e
.~~~2.7182818284590452353602874713526623
```

#### Source

```hoon
++  e  .~~~2.7182818284590452353602874713526623
```

### `+phi` {#phi}

The value phi (golden ratio) (OEIS A001622).

#### Produces

The value of phi, represented as a quad-precision floating-point atom.

#### Examples

```hoon
> phi
.~~~1.6180339887498948482045868343656382
```

#### Source

```hoon
++  phi  .~~~1.6180339887498948482045868343656382
```

### `+sqt2` {#sqt2}

The value sqrt(2) (OEIS A002193).

#### Produces

The value of sqrt(2), represented as a quad-precision floating-point atom.

#### Examples

```hoon
> sqt2
.~~~1.414213562373095048801688724209698
```

#### Source

```hoon
++  sqt2  .~~~1.414213562373095048801688724209698
```

### `+invsqt2` {#invsqt2}

The value 1/sqrt(2) (OEIS A010503).

#### Produces

The value of 1/sqrt(2), represented as a quad-precision floating-point atom.

#### Examples

```hoon
> invsqt2
.~~~0.707106781186547524400844362104849
```

#### Source

```hoon
++  invsqt2  .~~~0.707106781186547524400844362104849
```

### `+log2` {#log2}

The value log(2) (OEIS A002162).

#### Produces

The value of log(2), represented as a quad-precision floating-point atom.

#### Examples

```hoon
> log2
.~~~0.6931471805599453094172321214581766
```

#### Source

```hoon
++  log2  .~~~0.6931471805599453094172321214581766
```

### `+invlog2` {#invlog2}

The value 1/log(2).

#### Produces

The value of 1/log(2), represented as a quad-precision floating-point atom.

#### Examples

```hoon
> invlog2
.~~~1.442695040888963387004650940070860
```

#### Source

```hoon
++  invlog2  .~~~1.442695040888963387004650940070860  :: TODO check
```

### `+log10` {#log10}

The value log(10) (OEIS A002392).

#### Produces

The value of log(10), represented as a quad-precision floating-point atom.

#### Examples

```hoon
> log10
.~~~2.302585092994045684017991454684364
```

#### Source

```hoon
++  log10  .~~~2.302585092994045684017991454684364
```

### `+huge` {#huge}

The value of the largest representable number.

#### Produces

The value of the largest representable number, represented as a quad-precision floating-point atom.

#### Examples

```hoon
> huge
.~~~1.189731495357231765085759326628007e4932
```

#### Source

```hoon
++  huge  `@rq`0x7ffe.ffff.ffff.ffff.ffff.ffff.ffff.ffff.ffff  ::  1.18973149535723176508575932662800702e4932
```

### `+tiny` {#tiny}

The value of the smallest representable normal number.

#### Produces

The value of the smallest representable normal number, represented as a quad-precision floating-point atom.

#### Examples

```hoon
> tiny
.~~~3.3621031431120935062626778173217526e-4932
```

#### Source

```hoon
++  tiny  `@rq`0x1.0000.0000.0000.0000.0000.0000.0000.0000     ::  3.36210314311209350626267781732175260e-4932
```

---

### `+sea` {#sea}

Floating-point atom representation.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

The `$fn` representation of the floating-point atom.

#### Source

```hoon
++  sea  sea:^rq
```

---

### `+bit` {#bit}

Floating-point atom representation.

#### Accepts

The `$fn` representation of a floating-point atom.

#### Produces

A floating-point atom (`@rq`).

#### Source

```hoon
++  bit  bit:^rq
```

---

### `+sun` {#sun}

Floating-point atom of an unsigned integer atom.

#### Accepts

An unsigned integer atom (`@ud`).

#### Produces

A floating-point atom (`@rq`).

#### Source

```hoon
++  sun  sun:^rq
```

---

### `+san` {#san}

Floating-point atom of a signed integer atom.

#### Accepts

A signed integer atom (`@sd`).

#### Produces

A floating-point atom (`@rq`).

#### Source

```hoon
++  san  san:^rq
```

---

### `+toi` {#toi}

The unitized signed integer atom of a rounded floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A unitized signed integer atom (`@sd`).

#### Source

```hoon
++  toi  toi:^rq
```

---

### `+drg` {#drg}

The decimal form of a floating-point atom using the Dragon4 algorithm.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A decimal form (`+dn`).

#### Source

```hoon
++  drg  drg:^rq
```

---

### `+grd` {#grd}

The floating-point atom of a decimal form.  Inverse of `+drg`.

#### Accepts

A decimal form (`+dn`).

#### Produces

A floating-point atom (`@rq`).

#### Source

```hoon
++  grd  grd:^rq
```

---

### `+lth` {#lth}

The comparison of two floating-point atoms, less than.

#### Accepts

A pair of floating-point atoms (`@rq`).

#### Produces

A `$flag`.

#### Source

```hoon
++  lth  lth:^rq
```

---

### `+lte` {#lte}

The comparison of two floating-point atoms, less than or equal to.

#### Accepts

A pair of floating-point atoms (`@rq`).

#### Produces

A `$flag`.

#### Source

```hoon
++  lte  lte:^rq
```

---

### `+leq` {#leq}

The comparison of two floating-point atoms, less than or equal to. Alias for `+lte`.

#### Accepts

A pair of floating-point atoms (`@rq`).

#### Produces

A `$flag`.

#### Source

```hoon
++  leq  lte:^rq
```

---

### `+equ` {#equ}

The comparison of two floating-point atoms, equal to.

#### Accepts

A pair of floating-point atoms (`@rq`).

#### Produces

A `$flag`.

#### Source

```hoon
++  equ  equ:^rq
```

---

### `+gth` {#gth}

The comparison of two floating-point atoms, greater than.

#### Accepts

A pair of floating-point atoms (`@rq`).

#### Produces

A `$flag`.

#### Source

```hoon
++  gth  gth:^rq
```

---

### `+gte` {#gte}

The comparison of two floating-point atoms, greater than or equal to.

#### Accepts

A pair of floating-point atoms (`@rq`).

#### Produces

A `$flag`.

#### Source

```hoon
++  gte  gte:^rq
```

---

### `+geq` {#geq}

The comparison of two floating-point atoms, greater than or equal to. Alias for `+gte`.

#### Accepts

A pair of floating-point atoms (`@rq`).

#### Produces

A `$flag`.

#### Source

```hoon
++  geq  gte:^rq
```

---

### `+neq` {#neq}

The comparison of two floating-point atoms, not equal to.

#### Accepts

A pair of floating-point atoms (`@rq`).

#### Produces

A `$flag`.

#### Source

```hoon
++  neq  |=([a=@rq b=@rq] ^-(? !(equ:^rq a b)))
```

---

### `+is-close` {#isclose}

The comparison of two floating-point atoms, within a relative tolerance (provided by the `+rq` door).

#### Accepts

A pair of floating-point atoms (`@rq`).

#### Produces

A `$flag`.

#### Source

```hoon
++  is-close
  |=  [p=@rq r=@rq]
  (lth (abs (sub p r)) rtol)
```

---

### `+all-close` {#allclose}

The comparison of a floating-point atom to a list of floating- point atoms, within a relative tolerance (provided by the `+rq` door).

#### Accepts

A pair of floating-point atoms (`@rq`).

#### Produces

A `$flag`.

#### Source

```hoon
++  all-close
  |=  [p=@rq q=(list @rq)]
  =/  i  0
  =/  n  (lent q)
  |-  ^-  ?
  ?:  =(n i)
    %.y
  ?.  (is-close p (snag i q))
    %.n
  $$(i +(i))
```

---

### `+is-int` {#isint}

Returns whether a floating-point value is an integer (no fractional part).

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A `$flag`.

#### Source

```hoon
++  is-int
  |=  x=@rq  ^-  ?
  (equ x (san (need (toi x))))
```

---

### `+add` {#add}

The sum of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Source

```hoon
++  add  add:^rq
```

---

### `+sub` {#sub}

The difference of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Source

```hoon
++  sub  sub:^rq
```

---

### `+mul` {#mul}

The product of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Source

```hoon
++  mul  mul:^rq
```

---

### `+div` {#div}

The quotient of two floating-point atoms.

#### Accepts

A pair of floating-point atoms (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Source

```hoon
++  div  div:^rq
```

---

### `+fma` {#fma}

The fused multiply-add of three floating-point atoms.

#### Accepts

A triplet of floating-point atoms (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Source

```hoon
++  fma  fma:^rq
```

---

### `+sig` {#sig}

The sign of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A `$flag`.

#### Source

```hoon
++  sig  |=(x=@rq =(0 (rsh [0 127] x)))
```

---

### `+sgn` {#sgn}

The sign of a floating-point atom. Alias for `+sig`.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A `$flag`.

#### Source

```hoon
++  sgn  sig
```

---

### `+neg` {#neg}

The negation of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Source

```hoon
++  neg  |=(x=@rq (sub .~~~0 x))
```

---

### `+factorial` {#factorial}

The factorial of a floating-point atom.  Assumes integer input.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Source

```hoon
++  factorial
  |=  x=@rq  ^-  @rq
  ?>  (gte x .~~~0)
  =/  t=@rq  .~~~1
  ?:  (is-close x .~~~0)
    t
  |-  ^-  @rq
  ?:  (is-close x .~~~1)
    t
  $$(x (sub x .~~~1), t (mul t x))
```

---

### `+abs` {#abs}

The absolute value of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Source

```hoon
++  abs
  |=  x=@rq  ^-  @rq
  ?:((sgn x) x (neg x))
```

---

### `+exp` {#exp}

The exponential of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(exp .~~~1)
.~~~2.7182818284590452353602471108690483

>(exp .~~~2)
.~~~7.389056098930650227230362414146335

>(~(exp rq [%z .~~~1e-20]) .~~~2)
.~~~7.389056098930650227230362414146335

>(exp .~~~inf)
.~~~inf
```

#### Source

```hoon
++  exp
  |=  x=@rq  ^-  @rq
  ::  filter out non-finite arguments
  ?:  =(x 0x0)  .~~~1
  ::    check infinities
  ?:  =(x 0x7fff.0000.0000.0000.0000.0000.0000.0000)  `@rq`0x7fff.0000.0000.0000.0000.0000.0000.0000  :: exp(+inf) -> inf
  ?:  =(x 0xffff.0000.0000.0000.0000.0000.0000.0000)  .~~~0.0      :: exp(-inf) -> 0
  ::    check NaN
  ?.  (^gte (dis 0x7fff.8000.0000.0000.0000.0000.0000.0000 x) 0)  `@rq`0x7fff.8000.0000.0000.0000.0000.0000.0000  :: exp(NaN) -> NaN
  ::    check overflow to infinity
  =/  o-threshold  `@rq`0x400c.62e4.2fef.a39e.f357.93c7.6730.0601  ::  1.135652340629414394949193107797e4, value above which exp(x) overflows
  ?:  (gth x o-threshold)  (mul huge huge)
  ::    check underflow to zero
  =/  u-threshold  `@rq`0xc00c.62e4.2fef.a39e.f357.93c7.6730.0601  ::  -1.135652340629414394949193107797e4, value below which exp(x) underflows
  ?:  (lth x u-threshold)  (mul tiny tiny)
  ::  otherwise, use Taylor series
  =/  p   .~~~1
  =/  po  .~~~-1
  =/  i   .~~~1
  |-  ^-  @rq
  ?:  (lth (abs (sub po p)) rtol)
    p
  $$(i (add i .~~~1), p (add p (div (pow-n x i) (factorial i))), po p)
```

---

### `+sin` {#sin}

The sine of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(sin .~~~1)
.~~~0.8414709848078965066525022572525196

>(sin .~~~2)
.~~~0.9092974268256816953960201260866781

>(sin pi)
.~~~2.4143733100361875441251426417684949e-23
```

#### Source

```hoon
++  sin
  |=  x=@rq  ^-  @rq
  ::  filter out non-finite arguments
  ::    check infinities
  ?:  =(x 0x7fff.0000.0000.0000.0000.0000.0000.0000)  `@rq`0x7fff.8000.0000.0000.0000.0000.0000.0000  :: sin(+inf) -> NaN
  ?:  =(x 0xffff.0000.0000.0000.0000.0000.0000.0000)  `@rq`0x7fff.8000.0000.0000.0000.0000.0000.0000  :: sin(-inf) -> NaN
  ::    check NaN
  ?.  (^gte (dis 0x7fff.8000.0000.0000.0000.0000.0000.0000 x) 0)  `@rq`0x7fff.8000.0000.0000.0000.0000.0000.0000  :: sin(NaN) -> NaN
  ::  map into domain
  =.  x  (mod x tau)
  ::  otherwise, use Taylor series
  =/  p   x
  =/  po  .~~~-2
  =/  i   1
  =/  term  x
  |-  ^-  @rq
  ?.  (gth (abs term) rtol)
    p
  =/  i2  (add (sun i) (sun i))
  =.  term  (mul (neg term) (div (mul x x) (mul i2 (add i2 .~~~1))))
  $$(i +(i), p (add p term), po p)
```

---

### `+cos` {#cos}

The cosine of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(cos .~~~1)
.~~~0.5403023058681397174009349981817251

>(cos .~~~2)
.~~~-0.41614683654714238699756419777191616

>(cos pi)
.~~~-1.0000000000000000000000021077555518
```

#### Source

```hoon
++  cos
  |=  x=@rq  ^-  @rq
  ::  filter out non-finite arguments
  ::    check infinities
  ?:  =(x 0x7fff.0000.0000.0000.0000.0000.0000.0000)  `@rq`0x7fff.8000.0000.0000.0000.0000.0000.0000  :: cos(+inf) -> NaN
  ?:  =(x 0xffff.0000.0000.0000.0000.0000.0000.0000)  `@rq`0x7fff.8000.0000.0000.0000.0000.0000.0000  :: cos(-inf) -> NaN
  ::    check NaN
  ?.  (^gte (dis 0x7fff.8000.0000.0000.0000.0000.0000.0000 x) 0)  `@rq`0x7fff.8000.0000.0000.0000.0000.0000.0000  :: cos(NaN) -> NaN
  ::  map into domain
  =.  x  (mod x tau)
  ::  otherwise, use Taylor series
  =/  p   .~~~1
  =/  po  .~~~-2
  =/  i   1
  =/  term  .~~~1
  |-  ^-  @rq
  ?.  (gth (abs term) rtol)
    p
  =/  i2  (add (sun i) (sun i))
  =.  term  (mul (neg term) (div (mul x x) (mul i2 (sub i2 .~~~1))))
  $$(i +(i), p (add p term), po p)
```

---

### `+tan` {#tan}

The tangent of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(tan .~~~1)
.~~~1.5574077246549022305069793269617903

>(tan .~~~2)
.~~~-2.1850398632615189916433278966958165

>(tan pi)
.~~~-2.1850398632615189916433278966958165
```

#### Source

```hoon
++  tan
  |=  x=@rq  ^-  @rq
  (div (sin x) (cos x))
```

---

### `+asin` {#asin}

The inverse sine of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(asin .~~~0)
.~~~0

>(asin .~~~1)
.~~~1.5707963267948966192313216916397514

>(asin .~~~0.7)
.~~~0.7753974966107530637394463388579305
```

#### Source

```hoon
++  asin
  |=  x=@rq  ^-  @rq
  ?.  (gte (abs x) .~~~1)
    (atan (div x (sqt (abs (sub .~~~1 (mul x x))))))
  ?:  =(.~~~1 x)   ^~((mul pi .~~~0.5))
  ?:  =(.~~~-1 x)  ^~((mul pi .~~~-0.5))
  ~|([%asin-out-of-bounds x] !!)
```

---

### `+acos` {#acos}

The inverse cosine of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(acos .~~~0)
.~~~1.5707963267948966192313216916397514

>(acos .~~~1)
.~~~0

>(acos .~~~0.7)
.~~~0.7953988301841435554899943710156033
```

#### Source

```hoon
++  acos
  |=  x=@rq  ^-  @rq
  ?.  (gte (abs x) .~~~1)
    ?:  =(.~~~0 x)  ^~((mul pi .~~~0.5))
    (atan (div (sqt (abs (sub .~~~1 (mul x x)))) x))
  ?:  =(.~~~1 x)   .~~~0
  ?:  =(.~~~-1 x)  pi
  ~|([%acos-out-of-bounds x] !!)
```

---

### `+atan` {#atan}

The inverse tangent of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(atan .~~~1)
.~~~0.7853981633974483096146231179876219

>(atan .~~~2)
.~~~1.1071487177940905030161167763325275

>(atan pi)
.~~~1.2626272556789116834540013074115034
```

#### Source

```hoon
++  atan
  |=  x=@rq  ^-  @rq
  =/  a  (pow (add .~~~1 (mul x x)) .~~~-0.5)
  =/  b  .~~~1
  |-
  ?.  (gth (abs (sub a b)) rtol)
    (div x (mul (pow (add .~~~1 (mul x x)) .~~~0.5) b))
  =/  ai  (mul .~~~0.5 (add a b))
  =/  bi  (sqt (mul ai b))
  $$(a ai, b bi)
```

---

### `+atan2` {#atan2}

The inverse tangent of a floating-point coordinate.

#### Accepts

A pair of floating-point atoms (`@rq`), representing the y and x coordinates.

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(atan2 .~~~0 .~~~1)
.~~~0

>(atan2 .~~~-1 .~~~0)
.~~~-1.5707963267948966192313216916397514

>(atan2 .~~~0.5 .~~~-0.5)
.~~~2.3561944901923449288480202652918806
```

#### Source

```hoon
++  atan2
  |=  [y=@rq x=@rq]  ^-  @rq
  ?:  (gth x .~~~0)
    (atan (div y x))
  ?:  &((lth x .~~~0) (gte y .~~~0))
    (add (atan (div y x)) pi)
  ?:  &((lth x .~~~0) (lth y .~~~0))
    (sub (atan (div y x)) pi)
  ?:  &(=(.~~~0 x) (gth y .~~~0))
    (div pi .~~~2)
  ?:  &(=(.~~~0 x) (lth y .~~~0))
    (mul .~~~-1 (div pi .~~~2))
  .~~~0  ::  undefined
```

---

### `+pow-n` {#pown}

The power of a floating-point atom to an integer exponent.

#### Accepts

A pair of floating-point atoms (`@rq`), representing the base and the exponent.

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(pow-n .~~~2 .~~~2)
.~~~4

>(pow-n .~~~2 .~~~-2)
.~~~0.25
```

#### Source

```hoon
++  pow-n
  |=  [x=@rq n=@rq]  ^-  @rq
  ?:  =(n .~~~0)  .~~~1
  ?>  &((gth n .~~~0) (is-int n))
  =/  p  x
  |-  ^-  @rq
  ?:  (lth n .~~~2)
    p
  $$(n (sub n .~~~1), p (mul p x))
```

---

### `+log` {#log}

The natural logarithm of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(log .~~~1)
.~~~0

>(log .~~~2)
.~~~0.6931471805599453094170735934298606

>(~(log rq [%z .~~~1e-5]) .~~~2)
.~~~0.6931470737597852366942444674497712

>(log .~~~inf)
.~~~inf
```

#### Source

```hoon
++  log
  |=  z=@rq  ^-  @rq
  ::  filter out non-finite arguments
  ::    check infinities
  ?:  =(z 0x7fff.0000.0000.0000.0000.0000.0000.0000)  `@rq`0x7fff.0000.0000.0000.0000.0000.0000.0000  :: exp(+inf) -> inf
  ?:  =(z 0xffff.0000.0000.0000.0000.0000.0000.0000)  .~~~0.0      :: exp(-inf) -> 0
  ::    check NaN
  ?.  (^gte (dis 0x7fff.8000.0000.0000.0000.0000.0000.0000 z) 0)  `@rq`0x7fff.8000.0000.0000.0000.0000.0000.0000  :: exp(NaN) -> NaN
  ::  otherwise, use Taylor series
  =/  p   .~~~0
  =/  po  .~~~-1
  =/  i   .~~~0
  |-  ^-  @rq
  ?:  (lth (abs (sub po p)) rtol)
    (mul (div (mul .~~~2 (sub z .~~~1)) (add z .~~~1)) p)
  =/  term1  (div .~~~1 (add .~~~1 (mul .~~~2 i)))
  =/  term2  (mul (sub z .~~~1) (sub z .~~~1))
  =/  term3  (mul (add z .~~~1) (add z .~~~1))
  =/  term  (mul term1 (pow-n (div term2 term3) i))
  $$(i (add i .~~~1), p (add p term), po p)
```

---

### `+log-10` {#log10}

The base-10 logarithm of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Source

```hoon
++  log-10
  |=  z=@rq  ^-  @rq
  (div (log z) log10)
```

---

### `+log-2` {#log2}

The base-2 logarithm of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Source

```hoon
++  log-2
  |=  z=@rq  ^-  @rq
  (div (log z) log2)
```

---

### `+pow` {#pow}

The power of a floating-point atom to a floating-point exponent.

#### Accepts

A pair of floating-point atoms (`@rq`), representing the base and the exponent.

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(pow .~~~1 .~~~2)
.~~~1

>(pow .~~~2 .~~~2)
.~~~4

>(~(pow rq:math [%z .~~~1e-5]) .~~~2 .~~~3.5)
.~~~11.313703735926135014164384135726204
```

#### Source

```hoon
++  pow
  |=  [x=@rq n=@rq]  ^-  @rq
  ::  fall through on positive integers (faster)
  ?:  &(=(n (san (need (toi n)))) (gth n .~~~0))  (pow-n x (san (need (toi n))))
  (exp (mul n (log x)))
```

---

### `+sqrt` {#sqrt}

The square root of a floating-point atom. Alias for `+sqt`.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(sqrt .~~~1)
.~~~1

>(sqrt .~~~2)
.~~~1.4142135623730950488015335862957159

>(~(sqrt rq:math [%z .~~~1e-10]) .~~~2)
.~~~1.4142135623721439870165294373250435
```

#### Source

```hoon
++  sqrt  sqt
```

---

### `+sqt` {#sqt}

The square root of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(sqt .~~~1)
.~~~1

>(sqt .~~~2)
.~~~1.414213562373095048801688724209698

>(sqt .~~~1e5)
.~~~316.2277660168379331998893544432718
```

#### Source

```hoon
++  sqt
  |=  x=@rq  ^-  @rq
  ?>  (sgn x)
  ?:  =(.~~~0 x)  .~~~0
  =/  g=@rq  (div x .~~~2)
  |-
  =/  n=@rq  (mul .~~~0.5 (add g (div x g)))
  ?.  (gth (abs (sub g n)) rtol)
    n
  $$(g n)
```

---

### `+cbrt` {#cbrt}

The cube root of a floating-point atom. Alias for `+cbt`.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(cbrt .~~~1)
.~~~1

>(cbrt .~~~2)
.~~~1.2598919398737178526805575821133312

>(~(cbrt rq:math [%z .~~~1e-10]) .~~~2)
.~~~1.2598919398731638759238176665172822
```

#### Source

```hoon
++  cbrt  cbt
```

---

### `+cbt` {#cbt}

The cube root of a floating-point atom.

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(cbt .~~~1)
.~~~1

>(cbt .~~~2)
.~~~1.2598919398737178526805575821133312

>(~(cbt rq:math [%z .~~~1e-10]) .~~~2)
.~~~1.2598919398731638759238176665172822
```

#### Source

```hoon
++  cbt
  |=  x=@rq  ^-  @rq
  ?>  (sgn x)
  (pow x .~~~0.3333)
```

---

### `+arg` {#arg}

The argument of a floating-point atom (real argument = absolute value).

#### Accepts

A floating-point atom (`@rq`).

#### Produces

A floating-point atom (`@rq`).

#### Examples

```hoon
>(arg .~~~1)
.~~~1

>(arg .~~~-1)
.~~~1
```

---

## `+reference` {#reference}

A core of reference values in high precision as hard-coded string constants for reference and testing purposes.

---

### `+tau` {#tau}

The value $$\tau = 2 \pi$$ (OEIS A019692), radian angle measure of a full turn.

#### Source

```hoon
++  tau   '6.28318530717958647692528676655900576839433879875021164194988918461563281257241799625606965068423413596428'
```

---

### `+pi` {#pi}

The value $$\pi$$ (OEIS A000796), radian angle measure of a half turn.

#### Source

```hoon
++  pi     '3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214'
```

---

### `+e` {#e}

The value $$e$$ (Euler's number, OEIS A001113).

#### Source

```hoon
++  e      '2.71828182845904523536028747135266249775724709369995957496696762772407663035354759457138217852516642742746'
```

---

### `+phi` {#phi}

The value $$\phi = \frac{1+\sqrt{5}}{2}$$ (the golden ratio, OEIS A001622).

#### Source

```hoon
++  phi    '1.61803398874989484820458683436563811772030917980576286213544862270526046281890244970720720418939113748475'
```

---

### `+sqt2` {#sqt2}

The square root of 2 (OEIS A002193).

#### Source

```hoon
++  sqt2  '1.41421356237309504880168872420969807856967187537694807317667973799073247846210703885038753432764157273'
```

---

### `+invsqt2` {#invsqt2}

The inverse square root of 2 (OEIS A010503).

#### Source

```hoon
++  invsqt2  '0.70710678118654752440084436210484903928483593768847403658833986899536623923105351942519376716382086'
```

---

### `+log2` {#log2}

The natural logarithm of 2 (approximately 0.693147, OEIS A002392).

#### Source

```hoon
++  log2    '0.69314718055994530941723212145817656807550013436025525412068000949339362196969471560586332699641868754'
```

---

### `+log10` {#log10}

The natural logarithm of 10 (approximately 2.302585, OEIS A002392).

#### Source

```hoon
++  log10   '2.30258509299404568401799145468436420760110148862877297603332790096757260967735248023599726645985502929'
```
