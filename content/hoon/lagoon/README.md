---
description: "Documentation for the %base desk's /lib/lagoon.hoon library, which contains linear algebra operations."
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

# Lagoon (Linear AlGebra in hOON)

Documentation for the `%base` desk's `/lib/lagoon.hoon` library, which contains linear algebra operations.

Lagoon is a standard library which lives outside of the `/sys` kernel and supports userspace applications which need vectors, matrices, and other linear algebra data structures and operators.  Lagoon is not currently subject to kelvin versioning.

Lagoon is intended to support general-purpose linear algebraic types, but at this point it focuses on integers and IEEE 754 floating-point numbers.

## Data Types

Lagoon's data types are supplied by `/sur/lagoon`.

```
/-  lagoon
```

## `$ray`

$$n$$-dimensional data array.

A pair of a bare array as an LSB atom with an associated metadata descriptor.

#### Source

```
+$  ray               ::  $ray:  n-dimensional array
  $:  =meta           ::  descriptor
      data=@ux        ::  data, row-major order, 1-pin MSB
  ==
```

#### Discussion

## `$meta`

Metadata for `$ray`.

A description of the necessary metadata to disambiguate an atom into an array.  The dimensionality of the array is derived from `.shape`; the block width from `.bloq`; and the type of data each entry should be interpreted as from `.kind`.  An arbitrary noun `.tail` is supplied for various current and future purposes.

#### Source

```
+$  meta              ::  $meta:  metadata for a $ray
  $:  shape=(list @)  ::  list of dimension lengths
      =bloq           ::  logarithm of bitwidth
      =kind           ::  name of data type
      tail=*          ::  placeholder for future data (jet convenience)
  ==
```

#### Discussion

An array has a dimensionality, and a length-$$5$$ vector is not the same as a $$5 \times 1$$ or a $$5 \times 1 \times 1$$ array even if the data representation as an atom is the same.

Metadata are constrained by various factors; for instance, an IEEE 754 floating-point array may only be of `.bloq` sizes 4 (16-bit half-precision, `@rh`), 5 (32-bit regular precision, `@rs`), 6 (64-bit double precision, `@rd`), and 7 (128-bit quadruple-precision, `@rq`).  A `.bloq` size of 3 will fail due to no operators being implemented for that bit width.

## `$kind`

Array scalar type.

#### Source

```
+$  kind              ::  $kind:  type of array scalars
  $?  %i754           ::  IEEE 754 float
      %uint           ::  unsigned integer
      %int2           ::  2s-complement integer (/lib/twoc)
  ==
```

#### Discussion

Lagoon is a general-purpose linear algebra platform.  At the current time, it provides support for:

* `%i754`, IEEE 754 floating-point numbers.
* `%uint`, unsigned integers (to bit width, not arbitrarily sized like conventional atoms).
* `%int2`, twos-complement integers (to bit width, not `@s`-style ZigZag atoms).

## `$baum`

$$n$$-dimensional array with metadata, unwrapped.

`$baum` is the tape to `$ray` as cord:  that is, it unpacks the array atom into a list.  This is relatively inefficient, but can be convenient for practical operations.

#### Source

```
+$  baum              ::  $baum:  ndray with metadata
  $:  =meta           ::
      data=ndray      ::
  ==
```

## `$ndray`

$$n$$-dimensional array with metadata, unwrapped.

`$ndray` is the tape to `$data=@ux` as cord:  that is, it unpacks the array atom into a list.  This is relatively inefficient, but can be convenient for practical operations.

#### Source

```
+$  ndray             ::  $ndray:  n-dim array as nested list
    $@  @             ::  single item
    (list ndray)      ::  nonempty list of children, in row-major order
```

## `$slice`

Submatrix (2D only)

A `$slice` stores index bounds for selecting a submatrix from a 2D array.  If the `(unit @)` is `~`, then the index either runs from the beginning of the array or until the end, depending on its position.

#### Source

```
+$  slice  (unit [(unit @) (unit @)])
```

## Operators

- [Convenience functions](conv.md) - Functions for printing, getting/setting, or otherwise meta-scale operating on an array.
- [Builders](build.md) - Functions to produce standard arrays.
- [Structures](structure.md) - Functions to reshape or manipulate arrays.
- [Arithmetic](math.md) - Functions for arithmetically operating on one or more arrays.

## Jetting

`/lib/lagoon` is jetted as part of the `%non` core.  Deterministic IEEE 754 floating-point arithmetic is provided by SoftBLAS built on the reference SoftFloat used by the rest of Urbit's `@rs` etc. support.

- [SoftBLAS](https://github.com/urbit/softblas)
