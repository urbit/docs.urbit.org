# UrWASM Generator Example

Let's use UrWASM to write a generator that can quickly sort a large list of 64-bit integers in ascending order.

## Benchmark without UrWASM

In pure Hoon, we would write something like this:

```hoon
|=  lit=(list @G)
^-  (list @G)
~>  %bout
(sort lit lth)
```

{TODO: check the above compiles and runs}

Let's run this and see how long it takes. (`__~` in the Dojo discards the product of the given expression and returns `~`).

```
> =l (flop (gulf 0 1.000))
>
took ms/63.434
> __~ +run l
~
```

## Building the WASM module

Now let's sort the list using UrWasm, with the source code written in Rust. Initialize a new library cargo with `cargo new wasm_sort --lib` and edit `Cargo.toml`:

```toml
[package]
name = "wasm_sort"
version = "0.1.0"
edition = "2024"

[dependencies]
wasm-bindgen = "0.2"

[lib]
crate-type = ["cdylib"]
```

Paste this source code into `sort.rs`:

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn sort_u64(mut input: Vec<u64>) -> Vec<u64> {
    input.sort();
    input
}
```

Run `wasm-pack build` and `wasm-pack` will compile the `wasm_sort.wasm` module from this file. The `wasm_bindgen` Rust library will be used to create a corresponding JS bindings file named something like `wasm_sort_bg.js`.

## Writing Hoon bindings

Let's see how the JS bindings file calls `sort_u64()`. Remember, this is a generated wrapper function that would be called from the web app. This wrapper function is what we'll have to reimplement in our new Hoon generator to call out to the compiled `wasm_sort.wasm` module.

```javascript
// ...

let WASM_VECTOR_LEN = 0;

function passArray64ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 8, 8) >>> 0;
  getBigUint64ArrayMemory0().set(arg, ptr / 8);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

function getArrayU64FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getBigUint64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

/**
 * @param {BigUint64Array} input
 * @returns {BigUint64Array}
**/
export function sort_u64(input) {
  const ptr0 = passArray64ToWasm0(input, wasm.__wbindgen_malloc);
  const len0 = WASM_VECTOR_LEN;
  const ret = wasm.sort_u64(ptr0, len0);
  var v2 = getArrayU64FromWasm0(ret[0], ret[1]).slice();
  wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
  return v2;
}

// ...
```

What's going on in this `sortu64()` wrapper function? We see that it does the following:
1. Allocates memory for the input vector by calling `__wbindgen_malloc`.
2. Writes the contents of the array to WASM memory.
3. Calls `sort_u64()` with the array pointer and length as parameters, which returns two values.
4. Uses those two values as the pointer and length of the resulting array, reads that from memory.
5. Frees the returned array from Wasm memory with `__wbindgen_free`.
6. Returns the sorted array.

{TODO: better setup for yil-mold and acc-mold here.}

We don't need to reimplement step 5, since the whole Wasm VM will be freed when we're done.

Our generator with Hoon "bindings" will look like this in full. We'll examine each part in detail below.

{% code title="/gen/sort.hoon" overflow="nowrap" lineNumbers="true" %}

```hoon
/+  *wasm-lia
/*  wasm-bin  %wasm  /sort/wasm
::
:-  %say
|=  [* [lit=(list @G) ~] *]
:-  %noun
^-  (list @G)
~>  %bout
::
=>  |%
    +$  yil-mold  (list @G)
    +$  acc-mold  *
    --
%-  yield-need  =<  -
%^  (run-once yil-mold acc-mold)  [wasm-bin [~ ~]]  %$
=/  m  (script yil-mold acc-mold)
=/  arr  (arrows acc-mold)
=,  arr
=/  len-vec=@  (lent lit)
=/  len-bytes=@  (mul 8 len-vec)
=/  vec=@  (rep 6 lit)
::
;<  ptr=@             try:m  (call-1 '__wbindgen_malloc' len-bytes 8 ~)
;<  ~                 try:m  (memwrite ptr len-bytes vec)
;<  ptr-len=(list @)  try:m  (call 'sort_u64' ptr len-vec ~)
;<  vec-out=octs      try:m  (memread &1.ptr-len (mul 8 &2.ptr-len))
::
=/  lit-out=(list @)  (rip 6 q.vec-out)
=/  lent-out=@  (lent lit-out)
?:  =(len-vec lent-out)
  (return:m lit-out)
%-  return:m
%+  weld  lit-out
(reap (sub len-vec lent-out) 0)
```

{% endcode %}

What's going on here?

First, we import the Lia interpreter and the `.wasm` module, which we've copied in to the root of our desk. (If you're working through this example, the `%base` desk on a fakeship would be fine.)

```hoon
/+  *wasm-lia
/+  wasm-bin  %wasm  /sort/wasm
```

Mostly generator boilerplate, but note the `.lit` parameter and the output `(list @G)`. (That is, a `+list` of `@`s where `G` indicates a bitwidth of 64.)

```hoon
:-  %say
|=  [* [lit=(list @G) ~] *]
:-  %noun
^-  (list @G)
```

We use the `%bout` runtime hint to time the computation that follows.

```hoon
~>  %bout
```

Now we'll define the types for our yield of the main script and the accumulator noun. We don't need the accumulator for this example but it's required for `+run-once`, so we'll just call it a noun `*`.

{TODO: better intro to the yield concept}

```hoon
=>  |%
    +$  yil-mold  (list @G)  ::  type of the yield
    +$  acc-mold  *          ::  type of the accumulator
    --
```

Since Lia's `+run-once` returns a pair of \[yield accumulator], we grab the yield with [`=<`](../../../hoon/rune/tis.md#tisgal) to get the head (`-`) of the result. `+yield-need` is a Lia function that asserts that a yield is successful and returns the unwrapped result. The `%$` is where we'd specify a runtime hint like `%bout`, but we stub it out here as we don't need one.

Below, we build Lia's `+run-once` gate and run it on our imported `.wasm-bin` module, which we give the empty initial state `[~ ~]`. (That is, a pair of the initial accumulator state and {foobar}).

{TODO: not sure about this Lia `+run-once` verbiage above}

{TODO: get clarity on (list coin-wasm) arg in wasm state}

```hoon
::  run +yield-need on the head of the result
%-  yield-need  =<  -
::
::  build Lia's +run-once core with our .yil-mold
::  and .acc-mold and run it with our .wasm-bin, which
::  will be given the empty state [~ ~]
%^  (run-once yil-mold acc-mold)  [wasm-bin [~ ~]]  %$
```

Some more boilerplate. Hoon developers will recognize `.m` by analogy to the `.m` from the boilerplate often seen in [threads](../../../urbit-os/base/threads/README.md). `.arrows` is our built `+arrows` core from Lia, and we expose that namespace with [`=,`](../../../hoon/rune/tis.md#tiscom) for convenient usage later.

{TODO: link to `+arrows` documentation in the reference section once it exists}

```hoon
::  define the monadic interface for the script
=/  m  (script yil-mold acc-mold)
::  define basic operations
=/  arr  (arrows acc-mold)
::  expose the .arr namespace
=,  arr
```

We'll measure the input list and concatonate all of its elements into a single atom with [`+rep`](../../../hoon/stdlib/2c.md#rep).

{TODO: amend generator code style and update all code blocks accordingly}

```hoon
::  number of items in the list
=/  len-vec=@    (lent lit)
::  byte-length of the list
=/  len-bytes=@  (mul 8 len-vec)
::  2^6 = 64 bits per list element
=/  vec=@        (rep 6 lit)
```

With that out of the way we can now interact with Wasm VM, replicating steps 1-4 of the JS binding we're using as a reference. We make heavy use of Hoon's [`;<`](../../../hoon/rune/mic.md#micgal) monadic pipeline builder, running expressions and piping the result directly into the one that follows.

```hoon
::  allocate memory
;<  ptr=@             try:m  (call-1 '__wbindgen_malloc' len-bytes 8 ~)
::  write the input vector
;<  ~                 try:m  (memwrite ptr len-bytes vec)
::  call the sort_u64 function in the module
;<  ptr-len=(list @)  try:m  (call 'sort_u64' ptr len-vec ~)
::  read the resulting vector from memory
;<  vec-out=octs      try:m  (memread &1.ptr-len (mul 8 &2.ptr-len))
```

Now we split the resulting octets atom (`$octs`, a cell of byte length and data) into a list of 64-bit atoms with [`+rip`](../../../hoon/stdlib/2c.md) and add missing trailing zeroes if necessary.

{TODO: why would trailing zeroes be missing?}

```hoon
::  rip the octet stream into a list of 64-bit atoms
=/  lit-out=(list @)  (rip 6 q.vec-out)
::  measure the length of the list
=/  lent-out=@  (lent lit-out)
::
::  check if .lent-out equals the length of the
::  original list we passed into the generator
?:  =(len-vec lent-out)
  ::  if so, return the output list
  (return:m lit-out)
::
::  if not, use +return from the .m +script core to
::  return the output list with enough trailing zeroes
::  to match the length of the input list
%-  return:m
%+  weld  lit-out
(reap (sub len-vec lent-out) 0)
```

Once you have the `sort.wasm` module and the `sort.hoon` generator in your `%base` desk, run `|commit %base` and run this generator in the Dojo, again timing it with the `%bout` in the generator.

```
took ms/5.012
> __~ +sort l
~
```

{TODO: get example data in there}

A 10x speedup compared to pure Hoon for our test case (1.000 elements, reversed ordering).

