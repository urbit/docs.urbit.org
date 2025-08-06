# UrWASM Reference

foobar

Urwasm is structured as a series of nested cores:

/sur/wasm/wasm/hoon             ::  Wasm types definition
/sur/wasm/engine/hoon           ::  Wasm interpreter types
/sur/wasm/lia/hoon              ::  Lia [Language for Invocation of (web)Assembly] types
/lib/wasm/parser/hoon           ::  Wasm parser
/lib/wasm/validator/hoon        ::  Wasm validator
/lib/wasm/runner/op-def/hoon    ::  Wasm operator definitions
/lib/wasm/runner/engine/hoon    ::  Wasm interpreter
/lib/wasm/lia/hoon              ::  Lia interpreter

All cores except for the topmost, defined in /lib/wasm/lia/hoon are additionally wrapped in one-armed cores to manage the namespace:

/sur/wasm/wasm/hoon             ->  wasm-sur
/sur/wasm/engine/hoon           ->  engine-sur
/sur/wasm/lia/hoon              ->  lia-sur
/lib/wasm/parser/hoon           ->  parser
/lib/wasm/validator/hoon        ->  validator
/lib/wasm/runner/op-def/hoon    ->  op-def
/lib/wasm/runner/engine/hoon    ->  engine

