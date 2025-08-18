---
description: "UrWasm reference section, including data types and libraries"
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

# UrWasm Reference

The UrWasm project is structured as a series of nested cores, innermost to outermost:

```
/sur/wasm/wasm/hoon             ::  Wasm types definition
/sur/wasm/engine/hoon           ::  Wasm interpreter types
/sur/wasm/lia/hoon              ::  Lia [Language for Invocation of (web)Assembly] types
/lib/wasm/parser/hoon           ::  Wasm parser
/lib/wasm/validator/hoon        ::  Wasm validator
/lib/wasm/runner/op-def/hoon    ::  Wasm operator definitions
/lib/wasm/runner/engine/hoon    ::  Wasm interpreter
/lib/wasm/lia/hoon              ::  Lia interpreter
```

This reference section documents UrWasm's data types and library functionality.

## Data types
- [Wasm data types](./wasm-data-types.md)
- [Wasm interpreter data types](./wasm-interpreter-data-types.md)
- [Lia data types](./lia-data-types.md)

## Libraries
- [Wasm parser](./lib-wasm-parser.md)
- [Wasm validator](./lib-wasm-validator.md)
- [Wasm operator definitions](./lib-wasm-runner-op-def.md)
- [Wasm interpreter](./wasm-interpreter-data-types.md)
- [Lia interpreter](./lib-wasm-lia.md)
