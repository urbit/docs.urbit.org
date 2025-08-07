# UrWASM Overview

Onboarding new developers onto Urbit necessarily involves teaching them [Hoon](../../hoon/why-hoon.md). Whatever Hoon's merits as a systems programming language, the time commitment to understanding the language enough to be productive is an obvious barrier to entry.

Urbit allows developers to run server-side code in languages like Rust and Python by compiling that code to [WebAssembly](https://webassembly.org/) (WASM). They can run Javascript on the Urbit ship with a JS interpreter like QuickJS. Today this still involves some knowledge of Hoon, but the developer can mostly use the examples here as boilerplate.

Trivially, Urbit's WASM affordances (collectively "UrWASM") enable Hoon developers to leverage pre-existing libraries for functionality that doesn't already exist in Hoon, or would be prohibitively slow without writing a C [runtime jet](../runtime/jetting.md). But one can imagine more ambitious use-cases like running complete Next.js or Rust apps on the Urbit ship.

## WebAssembly

WebAssembly is a small, hardware-independent assembly language for a stack-based virtual machine, primarily intended to be deployed on the web for client- and server-side applications that may be written in one of many programming languages other than Javascript. WASM is supported out-of-the-box in all mainstream browsers, and it uses Web APIs wherever possible, but WASM may be executed in other runtimes.

Compiled WASM code (a `.wasm` file) is structured as a module, which consists of import and export declarations, function definitions, global variable and memory declarations, etc. A WASM module describes the starting state of a WASM virtual machine, whose state is modified by calling its functions, writing directly to the memory of the module, or what have you.

As a low-level language, WASM's functions only return 32/64 bit integers and floating-point numbers. Higher-level information like structs and function signatures are stripped away during compliation and must be restored via "host language bindings", which reimplement the source code functions as wrappers around calls to the WASM VM. These may be generated automatically by the WASM compiler in addition to the `.wasm` module, usually in Javascript if the code is targeting a browser.

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

The main theortical blocker to executing non-Hoon code on Urbit was that doing so would violate Urbit's commitments to determinism and referential transparency. UrWASM solves this by executing compiled WASM in Lia, a tiny interpreter that manages WASM's handful of nondeterministic edge-cases such that the same inputs to a WASM function will always result in the same output. The interpreter itself is small enough to be [jetted](../runtime/jetting.md), such that Urbit can execute WASM code at near-native speeds.

* Determinism solved by Lia
  * [urwasm-jetting.md](https://gist.github.com/Quodss/196a4deb3e24a652c021469d2c4544fb)
    * Jetting
    * Motivation
      * Higher level interpreting function
      * Lia interpreter

