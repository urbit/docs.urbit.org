+++
title = "Serialization"
weight = 180
+++

Noun serialization refers to a uniquely-defined technique for converting a noun into a single atom.

The main tools from `/sys/hoon` for this are:

- [`++cue`](https://docs.urbit.org/language/hoon/reference/stdlib/2p#cue), unpack a jammed noun
- [`++jam`](https://docs.urbit.org/language/hoon/reference/stdlib/2p#jam), pack a jammed noun
- [`++mat`](https://docs.urbit.org/language/hoon/reference/stdlib/2p#mat), length-encode a noun
- [`++rub`](https://docs.urbit.org/language/hoon/reference/stdlib/2p#rub), length-decode a noun

`++jam` and `++cue` are critically important for noun communication operations, including the `%lick`
vane and 

The basic idea of `++jam` is to produce a serial noun (in order of head/tail):

1. One bit marks cell or atom.
2. Next entry marks bit length of value (in unary, until a `0`).
3. Then the actual value.

(`++cue` distinguishes the bit length from the value by unary until the first `0`.)

```hoon
> `@ub`(jam ~)
0b10
::  start at LSB, so `0` for atom, `1` for length, `0` for value (head-trimmed zero)

> `@ub`(jam 1)
0b1100
::  start at LSB, so `0` for atom, `01`

> `@ub`(jam [0 0])  
0b10.1001
::  start at LSB, so `01` for cell, then `0` for head atom, length `1`, value `0`, repeat

> `@ub`(jam [0 1])
0b1100.1001

> `@ub`(jam [1 0])
0b1011.0001
```

To cue a jamfile:

```hoon
> =jammed-file .^(@ %cx %/jammed/jam)
> (cue jammed-file)
...
```

This cues as a noun, so it should be `;;` or clammed to a particular mold.

##  `eval` and newt encoding

Newt encoding is a variation of this:  it is a jammed noun with a short header.  Newt encoding is
used by `urbit eval`.

The format for a newt-encoded noun is:

```
V.BBBB.JJJJ.JJJJ...
```

- `V` version
- `B` jam size in bytes (little endian)
- `J` jammed noun (little endian)

`eval` supports several options for processing Hoon nouns as input to or output from `conn.c`:

- `-j`, `--jam`: output result as a jammed noun.
- `-c`, `--cue`: read input as a jammed noun.
- `-n`, `--newt`: write output / read input as a newt-encoded jammed noun, when paired with `-j` or `-c` respectively.
- `-k`: treat the input as the jammed noun input of a `%fyrd` request to `conn.c`; if the result is a `goof`, pretty-print it to `stderr` instead of returning it.

In the Vere runtime, these are used by `vere/newt.c`; see particularly:

- `u3_newt_send()` transmits a jammed noun (using `u3s_jam_xeno()`, for instance) to a task buffer for `libuv`.  (Recall that `libuv` is the main event loop driver for the king process.)
- `u3_newt_read()` pulls out the jammed noun from the buffer.

Serialization is also supported by `serial.c` functions, prefixed `u3s`.

Khan and Lick both use `newt.c`.
