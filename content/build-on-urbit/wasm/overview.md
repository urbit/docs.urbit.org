---
description: "Overview of the UrWasm project, goals, structure"
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

# UrWasm Overview

Onboarding new developers onto Urbit necessarily involves teaching them [Hoon](../../hoon/why-hoon.md). Whatever Hoon's merits as a systems programming language, the time commitment to understanding the language enough to be productive is an obvious barrier to entry.

Urbit allows developers to run server-side code in languages like Rust and Python by compiling that code to [WebAssembly](https://webassembly.org/) (Wasm). Today this still involves some knowledge of Hoon, but the developer can mostly use the examples here as boilerplate.

Trivially, Urbit's Wasm affordances (collectively "UrWasm") enable Hoon developers to leverage pre-existing libraries for functionality that doesn't already exist in Hoon, or would be prohibitively slow without writing a C [runtime jet](../runtime/jetting.md). But one can imagine more ambitious use-cases like running complete Next.js or Rust apps on the Urbit ship.

## WebAssembly

WebAssembly is a small, hardware-independent assembly language for a stack-based virtual machine, primarily intended to be deployed on the web for client- and server-side applications that may be written in one of many programming languages other than Javascript. Wasm is supported out-of-the-box in all mainstream browsers, and it uses Web APIs wherever possible, but Wasm may be executed in other runtimes.

Compiled Wasm code (a `.wasm` file) is structured as a module, which consists of import and export declarations, function definitions, global variable and memory declarations, etc. A Wasm module describes the starting state of a Wasm virtual machine, whose state is modified by calling its functions, writing directly to the memory of the module, or what have you.

As a low-level language, Wasm's functions only return 32/64 bit integers and floating-point numbers. Higher-level information like structs and function signatures are stripped away during compliation and must be restored via "host language bindings", which reimplement the source code functions as wrappers around calls to the Wasm VM. These may be generated automatically by the Wasm compiler in addition to the `.wasm` module, usually in Javascript if the code is targeting a browser.

For example, the following Rust code...

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn process(input: String) -> String {
     let output_string: String = input.chars().rev().collect();
     output_string
}
```

...will produce a `.wasm` module alongside the following language binding...

```javascript
export function process(input) {
  let deferred2_0;
  let deferred2_1;
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(input, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.process(retptr, ptr0, len0);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    deferred2_0 = r0;
    deferred2_1 = r1;
    return getStringFromWasm0(r0, r1);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
  }
}
```

...which a web app could invoke like so:

```javascript
import init, { process } from './our_wasm_module.js';

await init();                          // init our_wasm_module.wasm
const result = process("hello world"); // run process()
console.log(result);                   // "dlrow olleh"
```

In our case, we'll have to write our own bindings manually in Hoon. We'll cover this later in these docs.

## Lia

The main theoretical blocker to executing non-Hoon code on Urbit was that doing so would violate Arvo's commitments to determinism. Some Wasm instructions like `memory.grow` and floating-point operators have non-deterministic behavior.

UrWasm solves this by executing compiled Wasm in Lia ("Language for Invocation of (web)Assembly"), a tiny interpreter that manages Wasm's handful of nondeterministic edge-cases such that the same inputs to a Wasm function will always result in the same output. The Lia interpreter itself is small enough to be [jetted](../runtime/jetting.md), such that Urbit can execute Wasm code at near-native speeds.

Lia handles Wasm's non-determinism like so:
- Some numerical operations may return an empty set of values; this is often equivalent to `undefined` in other languages, e.g. when the Wasm VM attempts to divide by zero. Whenever a function returns an empty set of values, Lia treats it as an error and deterministically crashes.
- Some numerical operations may legally return one of a set of values, from which the Wasm VM may select any. This typically occurs with floating-point operations that produce NaN results, where different implementations might return different NaN bit patterns. Lia preserves determinism by normalizing all NaN results to one type.
- Wasm's `memory.grow` may or may not grow the memory; in some cases the choice is left to the host environment like the browser. In Lia, `memory.grow` will always increase the length of linear memory if the module's limits allow.

## UrWasm Structure

UrWasm is structured as several nested cores, with each core in this list being in the [subject](../../hoon/why-hoon.md#subject-oriented-programming) of the core below.

```
/sur/wasm/wasm/hoon             ::  Wasm types
/sur/wasm/engine/hoon           ::  Wasm interpreter types
/sur/wasm/lia/hoon              ::  Lia types
/lib/wasm/parser/hoon           ::  Wasm parser
/lib/wasm/validator/hoon        ::  Wasm validator
/lib/wasm/runner/op-def/hoon    ::  Wasm operator definitions
/lib/wasm/runner/engine/hoon    ::  Wasm interpreter
/lib/wasm/lia/hoon              ::  Lia interpreter
```

All cores except `/lib/wasm/lia/hoon`, are additionally wrapped in one-armed cores for easy invocation:

```
/sur/wasm/wasm/hoon             ::  +wasm-sur
/sur/wasm/engine/hoon           ::  +engine-sur
/sur/wasm/lia/hoon              ::  +lia-sur
/lib/wasm/parser/hoon           ::  +parser
/lib/wasm/validator/hoon        ::  +validator
/lib/wasm/runner/op-def/hoon    ::  +op-def
/lib/wasm/runner/engine/hoon    ::  +engine
```

Thus if you imported `/lib/wasm/lia/hoon` as `wasm`, you can get the core with Lia types as `lia-sur:wasm`.

UrWasm's data types and functionality are covered in detail in the [reference](../../urbit-os/base/wasm/README.md) section.

