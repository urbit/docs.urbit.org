# UrWasm Reference

UrWasm is structured as a series of nested cores:

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

This reference section documents the UrWasm project's data types and library functionality.
