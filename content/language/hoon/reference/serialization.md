+++
title = "Serialization"
weight = 180
+++

Noun serialization refers to a uniquely-defined technique for converting a noun into a single atom.  The basic noun serialization process in Urbit, called “jamming”, includes supporting internal references so that there is a minor compression effect included.

##  Serialization Arms

The main tools from `/sys/hoon` for noun serialization are:

- [`++cue`](/language/hoon/reference/stdlib/2p#cue), unpack a jammed noun
- [`++jam`](/language/hoon/reference/stdlib/2p#jam), pack a jammed noun
- [`++mat`](/language/hoon/reference/stdlib/2p#mat), length-encode a noun
- [`++rub`](/language/hoon/reference/stdlib/2p#rub), length-decode a noun

`++jam` and `++cue` are critically important for noun communication operations, including the `%lick` vane, the `%khan` vane, and [noun channels in `%eyre`](/system/kernel/eyre/guides/noun-channels).

### `++cue`

It is more straightforward to see how to decode a noun than to encode it, so let's start there.

```hoon
++  cue                                                 ::  unpack
  ~/  %cue
  |=  a=@
  ^-  *
  =+  b=0
  =+  m=`(map @ *)`~
  =<  q
  |-  ^-  [p=@ q=* r=(map @ *)]
  ?:  =(0 (cut 0 [b 1] a))
    =+  c=(rub +(b) a)
    [+(p.c) q.c (~(put by m) b q.c)]
  =+  c=(add 2 b)
  ?:  =(0 (cut 0 [+(b) 1] a))
    =+  u=$(b c)
    =+  v=$(b (add p.u c), m r.u)
    =+  w=[q.u q.v]
    [(add 2 (add p.u p.v)) w (~(put by r.v) b w)]
  =+  d=(rub c a)
  [(add 2 p.d) (need (~(get by m) q.d)) m]
```

The above gate accepts an atom `b`, which is a “blob” or as-yet-undefined value.  Pin a cursor to run from low to high (LSB) at 0.  The empty map `m` will map from cursor to noun.  (All cursor-to-noun mappings will be saved here.)

The trap produces a 3-tuple where `p` is the following cursor position; `q` is the noun; and `r` is the cache.  The product itself will be `q`.

A data cursor is pinned at `c`, while the third bit is pinned at `a`.  If the first bit at `a` is `0b0`, then the noun is a direct atom.  Pin the expansion of the second bit at `a` as `c`; `p` is now the cursor after `c`, `q` is the atom from `e`, and `r` is an updated cache.  (See `++rub` discussion below for the atom expansion details.)

Otherwise, we have a cell, so we have to expand the second bit at `a`.  If it is `0b0`, then the cell needs to be decoded by decoding the noun at .  If it is `0b1`, then we have a saved reference and retrieve it from the cache (last branch).

If the second bit at `a` is `0b1`, then the noun is a saved reference.  In that case, expand at `c` (the head), as `$(b c)` and pin the cursor after as `v`.  `w` is the cell of `q.u` and `q.v`.  `p` is the lengths of `u` and `v` plus 2.  `q` is `w`, with `r` is the cache with `w` inserted.

### `++rub`

```hoon
++  rub                                                 ::  length-decode
  ~/  %rub
  |=  [a=@ b=@]
  ^-  [p=@ q=@]
  =+  ^=  c
      =+  [c=0 m=(met 0 b)]
      |-  ?<  (gth c m)
      ?.  =(0 (cut 0 [(add a c) 1] b))
        c
      $(c +(c))
  ?:  =(0 c)
    [1 0]
  =+  d=(add a +(c))
  =+  e=(add (bex (dec c)) (cut 0 [d (dec c)] b))
  [(add (add c c) e) (cut 0 [(add d (dec c)) e] b)]
```

`++rub` extracts a self-measuring atom from an atomic blob, which accepts a cell of bit position cursor `a` and atomic blob `b`.  `++rub` produces a number of bits to advance the cursor `p` and the encoded atom `q`.

`c` is a unary sequance of `0b1` bits followed by a `0b0` bit.  If `c` is `0b0`, then the cursor advancement `p` is `0b1` and the encoded atom `q` is `0b0`.  Otherwise, `c` is the number of bits needed to express the number of bits in `q`.

The cursor `a` is advanced to include `c` and the terminator bit.

We pin `e`, the number of bits in `q`. This is encoded as a `c-1`-length sequence of bits following `a`, which is added to $2^{c-1}$. `p` (the number of bits consumed) is `c+c+e`.  The packaged atom `q` is the `e`-length bitfield at `a+c+c`.

### `++jam`

The basic idea of `++jam` is to produce a serial noun (in order of head/tail).  This requires a recursive examination of the encoded noun:

1. One bit marks cell or atom.
2. Next entry marks bit length of value for atom, `0` if cell, or `1` if reference.
3. Then the actual value (itself a cell or atom).

Some readers may prefer to examine the [Python `noun.py` implementation](https://github.com/urbit/tools/blob/master/pkg/pynoun/noun.py) to supplement the Hoon definition; see particularly `mat()`.

Examples:

```hoon
> `@ub`(jam ~)
0b10
::  start at LSB, so `0` for atom, `1` for length, `0` for value (head-trimmed
::  zero, really `0b010`)

> `@ub`(jam 1)
0b1100
::  start at LSB, so `0` for atom, `01` for length, `1` for value

> `@ub`(jam [0 0])
0b10.1001
::  start at LSB, so `01` for cell, then `0` for head atom, length `1`,
::  value `0`, repeat

> `@ub`(jam [0 1])
0b1100.1001
::  start at LSB, so `01` for cell, then `0` for head atom, length `1`,
::  value `0`, repeat with value `1`

> `@ub`(jam [1 0])
0b1011.0001

> `@ub`(jam 0b111)
0b1111.1000

> `@ub`(jam [0 1 2])
0b1.0010.0011.0001.1001
```

To cue a jamfile:

```hoon
> =jammed-file .^(@ %cx %/jammed/jam)
> (cue jammed-file)
...
```

This cues as a noun, so it should be `;;` or clammed to a particular mold.

##  `eval` and newt encoding

Newt encoding is a variation of this:  it is a jammed noun with a short header.  Newt encoding is used by `urbit eval`.

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

