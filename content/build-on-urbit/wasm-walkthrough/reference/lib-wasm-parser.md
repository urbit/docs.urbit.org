# Wasm Parser

The `/lib/wasm/parser.hoon` library converts Wasm bytecode into UrWasm's Hoon types defined in [`+wasm-sur`](./wasm-data-types.md), which is nested in the imported [`/sur/wasm/lia.hoon`](./lia-data-types.md) file. This library implements parsing rules that follow the [WebAssembly Core Specification](https://www.w3.org/TR/2022/WD-wasm-core-2-20220419/binary/index.html) binary format.

{TODO Implements WebAssembly's [LEB128](https://en.wikipedia.org/wiki/LEB128) unsigned integer encoding.}

## `+parser` {#parser}

```hoon
|%
++  parser
  =/  sur  wasm-sur
  |%
  ::  ...
  --
--
```

Parser core. Exposes the nested `+wasm-sur` namespace as `.sur`.

## `+main` {#main}

```hoon
++  main
  |=  wasm=octs
  =,  sur
  ^-  module
  =|  out=module
  =/  bytes=tape  (trip q.wasm)
  ::  add trailing zeros
  =.  bytes
    %+  weld  bytes
    ^-  tape
    (reap (sub p.wasm (lent bytes)) '\00')
  (scan bytes module:r)
```

Main parsing function that takes a Wasm binary as [`$octs`](./wasm-data-types.md#octs) and returns a parsed [`$module`](./wasm-data-types.md#module). Extends the octet stream with trailing zeros to ensure proper parsing then applies the [`+module:r`](#module) parsing rule.

## `+r` {#r}

Parsing rule core. Parsing rules often use the same name as the types in `/sur/wasm.hoon`, e.g. `+num-type:r` is the parsing rule that produces a `$num-type:sur`.

### `+womp` {#womp}

```hoon
++  womp
  |*  rul=rule
  $_  =+  vex=(rul)
  ?>  ?=(^ q.vex)
  p.u.q.vex
```

Returns a mold of the product of the given [`$rule`](../../../hoon/stdlib/3g.md#rule).

### `+bild` {#bild}

```hoon
++  bild
  |*  [vex=edge gat=_=>(rule |*(* *rule))]
  ?~  q.vex
    vex
  %.  [vex (gat p.u.q.vex)]
  (comp |*([a=* b=*] b))
```

Connects an [`$edge`](../../../hoon/stdlib/3g.md#edge) (parsing output) with a rule and a rule-producing gate, returning the result of the rule produced by slamming the gate with the result of the first rule.

Used for conditional parsing based on previously parsed values.

### `+bonk` {#bonk}

```hoon
++  bonk
  |*  [tet=rule fes=rule]
  |=  tub=nail
  ^+  (fes)
  =+  try=(tet tub)
  ?~  q.try  try
  =+  zen=(fes tub)
  ?~  q.zen  zen
  ?:  =(q.u.q.try q.u.q.zen)
    zen
  (fail tub)
```

Rule modifier. Applies two rules to a [`$nail`](../../../hoon/stdlib/3g.md#nail), failing if either rule fails to parse or if the rules return different continuations. Returns the result of the second rule otherwise.

### `+feel` {#feel}

```hoon
++  feel
  |*  [a=* sef=rule]
  |=  tub=nail
  =+  vex=(sef tub)
  ?~  q.vex  vex
  ?:  =(a p.u.q.vex)
    vex
  [p=p.vex q=~]
```

Rule modifier. Tests equality of the parsing result with a given noun. Only succeeds if the parsed value `.p.u.q.vex` exactly matches the expected value `.a`.

### `+u-n` {#u-n}

```hoon
++  u-n
  |=  n-bits=@
  =*  this  $
  %+  knee  *@
  |.  ~+
  ;~  pose
    ::  multiple byte case
    ?:  (lte n-bits 7)  fail
    %+  cook
      |=  [n=@ m=@]
      %+  add
        (mul 128 m)
      (sub n 128)
    ;~  plug
      (shim 128 255)
      this(n-bits (sub n-bits 7))
    ==
    ::  single byte case
    (cook ,@ (shim 0 (dec (bex (min n-bits 7)))))
  ==
```

Parse `@` integer with bitwidth $$n$$ as an atom. Handles both single-byte and multi-byte cases recursively.

### `+s-n` {#s-n}

```hoon
++  s-n
  |=  n-bits=@
  =*  this  $
  %+  knee  *@s
  |.  ~+
  ;~  pose
    ::  single byte: positive
    (cook (cury new:si &) (shim 0 (dec (bex (min (dec n-bits) 6)))))
    ::  single byte: negative
    %+  cook
      |=  n=@
      =,  si
      (dif (new & n) --128)
    ;~  simu
      (shim 64 127)
      (shim (sub 128 (min 128 (bex (dec n-bits)))) 127)
    ==
    ::  multiple bytes
    ?:  (lte n-bits 7)  fail
    %+  cook
      |=  [n=@s m=@s]
      =,  si
      (sum (dif n --128) (pro --128 m))
    ;~  plug
      (cook (cury new:si &) (shim 128 255))
      this(n-bits (sub n-bits 7))
    ==
  ==
```

Parse `@s` integer with bitwidth $$n$$. Implements WebAssembly's signed LEB128 integer encoding with proper sign extension handling for positive and negative integers.

### `+u32` {#u32}

```hoon
++  u32  (u-n 32)
```

Parse 32-bit unsigned integer.

### `+u64` {#u64}

```hoon
++  u64  (u-n 64)
```

Parse 64-bit unsigned integer.

### `+f32` {#f32}

```hoon
++  f32
  %+  cook
    |=  =(list @)
    ;;  @rs
    (rep 3 list)
  (stun [4 4] next)
```

Parse 32-bit float.

Reads exactly 4 bytes and reconstructs them into a `@rs` atom.

### `+f64` {#f64}

```hoon
++  f64
  %+  cook
    |=  =(list @)
    ;;  @rd
    (rep 3 list)
  (stun [8 8] next)
```

Parse 64-bit float.

Reads exactly 8 bytes and reconstructs them into a `@rd` atom.

### `+vec` {#vec}

```hoon
++  vec
  |*  rul=rule
  ;~  bild
    u32
    |=  n=@
    (stun [n n] rul)
  ==
```

Parses a Wasm vector.

First parses a u32 length, then parses exactly that many instances of the given rule. This is the standard WebAssembly encoding for variable-length sequences.

### `+name` {#name}

```hoon
++  name     (cook crip (vec next))
```

Parse Wasm name (UTF-8 string).

Uses `+vec` to get the length and bytes, then converts the parsed `$rule` to a `@t`.

### `+vec-u32` {#vec-u32}

```hoon
++  vec-u32  (vec u32)
```

Parse vector of 32-bit unsigned integers.

### `+num-type` {#num-type}

```hoon
++  num-type
  %+  cook  |=(num-type:sur +<)
  ;~  pose
    (cold %i32 (just '\7f'))
    (cold %i64 (just '\7e'))
    (cold %f32 (just '\7d'))
    (cold %f64 (just '\7c'))
  ==
```

Parse Wasm number type.

Maps binary opcodes to [`$num-type`](./wasm-data-types.md#num-type) values.

### `+vec-type` {#vec-type}

```hoon
++  vec-type  (cold %v128 (just '\7b'))
```

Parse Wasm vector type.

### `+ref-type` {#ref-type}

```hoon
++  ref-type
  %+  cook  |=(ref-type:sur +<)
  ;~  pose
    (cold %extn (just '\6f'))
    (cold %func (just '\70'))
  ==
```

Parse Wasm reference type.

Maps binary opcodes to [`$ref-type`](./wasm-data-types.md#ref-type) values.

### `+valtype` {#valtype}

```hoon
++  valtype
  %+  cook  |=(valtype:sur +<)
  ;~(pose num-type vec-type ref-type)
```

Parse Wasm value type.

Homogenizes results of `+num-type:r`, `+vec-type:r`, and `+ref-type:r` parsers into [`$valtype`s](./wasm-data-types.md#valtype).

### `+func-type` {#func-type}

```hoon
++  func-type
  %+  cook  |=(func-type:sur +<)
  ;~  pfix
    (just '\60')
    ;~(plug (vec valtype) (vec valtype))
  ==
```

Parse Wasm function.

Expects the function type opcode `\60`, followed by parameter types and result types as vectors. (See [`$func-type`](./wasm-data-types.md#func-type).)

### `+limits` {#limits}

```hoon
++  limits
  %+  cook  |=(limits:sur +<)
  ;~  pose
    ;~(plug (cold %flor (just '\00')) u32)
    ;~(plug (cold %ceil (just '\01')) u32 u32)
  ==
```

Parse Wasm memory/table limits.

Either minimum only (`%flor`) or minimum and maximum (`%ceil`).

## Instruction and Expression Parsing Rules

### `+expr` {#expr}

```hoon
++  expr
  %+  knee  *expression:sur
  |.  ~+
  ;~(sfix (star instr) end)
```

Parse Wasm expression as a sequence of instructions terminated by an [`+end`](#end) opcode.

### `+expr-pair` {#expr-pair}

```hoon
++  expr-pair
  %+  knee  [*expression:sur *expression:sur]
  |.  ~+
  ;~  plug
    (star instr)
    ;~  pose
      (cold ~ end)
      (ifix [else end] (star instr))
    ==
  ==
```

Parse a pair of [`$expression`s](./wasm-data-types.md#expression) for [`+if`](#if) statements.

First expression (true branch), followed by optional [`+else`](#else) and second expression (false branch).

### `+end` {#end}

{TODO change `\0b` in prose to `0x0b` as in actual Wasm binary}

```hoon
++  end        (just '\0b')
```

Parse Wasm `end` opcode (`\0b`).

### `+else` {#else}

```hoon
++  else       (just '\05')
```

Parse Wasm `else` opcode (`\05`).

### `+const-i32` {#const-i32}

```hoon
++  const-i32  (just '\41')
```

Parse Wasm `i32.const` opcode (`\41`).

### `+const-i64` {#const-i64}

```hoon
++  const-i64  (just '\42')
```

Parse Wasm `i64.const` opcode (`\42`).

### `+const-f32` {#const-f32}

```hoon
++  const-f32  (just '\43')
```

Parse Wasm `f32.const` opcode (`\43`).

### `+const-f64` {#const-f64}

```hoon
++  const-f64  (just '\44')
```

Parse Wasm `f64.const` opcode (`\44`).

### `+block-op` {#block-op}

```hoon
++  block-op   (just '\02')
```

Parse Wasm `block` opcode (`\02`).

### `+loop-op` {#loop-op}

```hoon
++  loop-op    (just '\03')
```

Parse Wasm `loop` opcode (`\03`).

### `+if-op` {#if-op}

```hoon
++  if-op      (just '\04')
```

Parse Wasm `if` opcode (`\04`).

### `+form-ranges` {#form-ranges}

```hoon
++  form-ranges
  |=  l=(list @)
  ^-  (list ?(@ [@ @]))
  ?~  l  ~
  =+  a=i.l
  =+  b=i.l
  |-  ^-  (list ?(@ [@ @]))
  ?~  t.l
    :_  ~
    ?:  =(a b)  a
    [a b]
  ?>  (gth i.t.l b)
  ?:  =(i.t.l +(b))
    $(b i.t.l, t.l t.t.l)
  :-  ?:  =(a b)  a
      [a b]
  $(a i.t.l, b i.t.l, t.l t.t.l)
```

Helper function that converts a list of sorted integers into a list of ranges (`?(@ [@ @])`).

??? - Used to optimize parsing by creating efficient lookup tables for opcodes.

### `+instr` {#instr}

```hoon
++  instr
  ~+  %-  stew  ^.  stet
  ;:  welp
    ^.  limo
    :~
      ['\fc' ;~(pfix next fc)]
      ['\fd' ;~(pfix next fd)]
      ['\1c' select-vec]
      ['\0e' br-table]
      ['\02' block]
      ['\03' loop]
      ['\04' if]
      ['\d0' ;~(pfix next (stag %ref-null ref-type))]
      ['\d2' ;~(pfix next (stag %ref-func u32))]
    ==
  ::
    %-  turn  :_  (late instr-zero)
    %-  form-ranges
    %+  skim  (gulf 0 255)
    |=(n=@ ?=(^ (op-map n)))
  ::
    %+  turn
      %-  form-ranges
      %+  skim  (gulf 0 255)
      |=(n=@ ?=(^ (handle-one-arg-i32 n 0)))
    %-  late
    %+  sear  handle-one-arg-i32
    ;~(plug next u32)
  ::
    ^.  limo
    :~
      ['\41' (cook handle-const-i32 ;~(pfix next (s-n 32)))]
      ['\42' (cook handle-const-i64 ;~(pfix next (s-n 64)))]
      ['\43' (cook handle-const-f32 ;~(pfix next f32))]
      ['\44' (cook handle-const-f64 ;~(pfix next f64))]
    ==
  ::
    %+  turn
      %-  form-ranges
      %+  skim  (gulf 0 255)
      |=(n=@ ?=(^ (handle-two-args-i32 n 0 0)))
    %-  late
    %+  sear  handle-two-args-i32
    ;~(plug next u32 u32)
  ::
  ==
```

Main instruction parser. Uses `+stew` parser to switch on the given text to the appropriate parser.

### `+select-vec` {#select-vec}

```hoon
++  select-vec
  %+  cook  |=(instruction:sur +<)
  ;~  pfix
    next
    %+  stag  %select
    %+  stag  %~
    (vec valtype)
  ==
```

??? - Parse Wasm `select` expression with optional type annotation for vectors.

### `+br-table` {#br-table}

```hoon
++  br-table
  %+  cook  handle-br-table
  ;~(pfix next ;~(plug vec-u32 u32))
```

Parse Wasm `br_table` (branch table) expression with vector of labels and default label.

### `+instr-zero` {#instr-zero}

```hoon
++  instr-zero  (sear op-map next)
```

Parse instructions with zero arguments by looking up the opcode in the [opcode map](#op-map).

### `+block` {#block}

```hoon
++  block
  %+  cook  handle-block
  ;~(pfix next ;~(plug block-type expr))
```

Parse Wasm `block` expression with [block type](#block-type) and body [expression](#expr).

### `+loop` {#loop}

```hoon
++  loop
  %+  cook  handle-loop
  ;~(pfix next ;~(plug block-type expr))
```

Parse Wasm `loop` expression with block type and body expression.

### `+if` {#if}

```hoon
++  if
  %+  cook  handle-if
  ;~  pfix
    next
    ;~(plug block-type expr-pair)
  ==
```

Parse Wasm `if` expression with block type and true/false expression pair.

### `+block-type` {#block-type}

```hoon
++  block-type
  %+  cook  |=(block-type:sur +<)
  ;~  pose
    (cold [~ ~] (just '\40'))
    ;~(plug (easy ~) (sear get-valtype next) (easy ~))
  ::
    %+  sear
      |=  a=@s
      ^-  (unit @)
      ?.  (syn:si a)  ~
      `(abs:si a)
    (s-n 33)
  ::
  ==
```

Parse Wasm [`$block-type`](./wasm-data-types.md#block-type).

## Handler Functions

### `+handle-one-arg-i32` {#handle-one-arg-i32}

```hoon
++  handle-one-arg-i32
  |=  [op=char arg=@]
  ^-  (unit instruction:sur)
  ?+  op  ~
    %0xc   `[%br arg]
    %0xd   `[%br-if arg]
    %0x10  `[%call arg]
    %0x20  `[%local-get arg]
    %0x21  `[%local-set arg]
    %0x22  `[%local-tee arg]
    %0x23  `[%global-get arg]
    %0x24  `[%global-set arg]
    %0x25  `[%table-get arg]
    %0x26  `[%table-set arg]
    %0x3f  `[%memory-size ?>(=(arg 0) %0)]
    %0x40  `[%memory-grow ?>(=(arg 0) %0)]
  ==
```

Handle Wasm instructions that take one 32-bit argument.

Maps opcodes to their corresponding [`$instruction`](./wasm-data-types.md#instruction) representations.

### `+handle-two-args-i32` {#handle-two-args-i32}

```hoon
++  handle-two-args-i32
  |=  [op=char arg1=@ arg2=@]
  ^-  (unit instruction:sur)
  ?+  op  ~
      %0x11
    `[%call-indirect arg1 arg2]
  ::
      %0x28
    `[%load %i32 [arg1 arg2] ~ ~]
  ::
      %0x29
    `[%load %i64 [arg1 arg2] ~ ~]
  ::
      %0x2a
    `[%load %f32 [arg1 arg2] ~ ~]
  ::
      %0x2b
    `[%load %f64 [arg1 arg2] ~ ~]
  ::
      %0x2c
    `[%load %i32 [arg1 arg2] `%8 `%s]
  ::
      %0x2d
    `[%load %i32 [arg1 arg2] `%8 `%u]
  ::
      %0x2e
    `[%load %i32 [arg1 arg2] `%16 `%s]
  ::
      %0x2f
    `[%load %i32 [arg1 arg2] `%16 `%u]
  ::
      %0x30
    `[%load %i64 [arg1 arg2] `%8 `%s]
  ::
      %0x31
    `[%load %i64 [arg1 arg2] `%8 `%u]
  ::
      %0x32
    `[%load %i64 [arg1 arg2] `%16 `%s]
  ::
      %0x33
    `[%load %i64 [arg1 arg2] `%16 `%u]
  ::
      %0x34
    `[%load %i64 [arg1 arg2] `%32 `%s]
  ::
      %0x35
    `[%load %i64 [arg1 arg2] `%32 `%u]
  ::
      %0x36
    `[%store %i32 [arg1 arg2] ~]
  ::
      %0x37
    `[%store %i64 [arg1 arg2] ~]
  ::
      %0x38
    `[%store %f32 [arg1 arg2] ~]
  ::
      %0x39
    `[%store %f64 [arg1 arg2] ~]
  ::
      %0x3a
    `[%store %i32 [arg1 arg2] `%8]
  ::
      %0x3b
    `[%store %i32 [arg1 arg2] `%16]
  ::
      %0x3c
    `[%store %i64 [arg1 arg2] `%8]
  ::
      %0x3d
    `[%store %i64 [arg1 arg2] `%16]
  ::
      %0x3e
    `[%store %i64 [arg1 arg2] `%32]
  ==
::
```

Handle Wasm instructions that take two 32-bit immediate arguments.

### `+handle-br-table` {#handle-br-table}

```hoon
++  handle-br-table
  |=  [vec=(list @) i=@]
  ^-  instruction:sur
  [%br-table vec i]
```

Handle Wasm `br_table` expression (switch statement) by constructing the list of branches with a default index.

### `+handle-block` {#handle-block}

```hoon
++  handle-block
  |=  [type=block-type:sur body=expression:sur]
  ^-  $>(%block instruction:sur)
  [%block type body]
```

Handle Wasm `block` expression.

### `+get-valtype` {#get-valtype}

```hoon
++  get-valtype
  |=  byte=@
  ^-  (unit valtype:sur)
  ?+  byte  ~
    %0x7f  `%i32
    %0x7e  `%i64
    %0x7d  `%f32
    %0x7c  `%f64
  ==
```

Map byte values to value types for block type parsing.

Map opcodes to value types to construct [`$valtype`s](./wasm-data-types.md#valtype)

### `+handle-loop` {#handle-loop}

```hoon
++  handle-loop
  |=  [type=block-type:sur body=expression:sur]
  ^-  instruction:sur
  [%loop type body]
```

Handle Wasm `loop` expression.

### `+handle-if` {#handle-if}

```hoon
++  handle-if
  |=  $:  type=block-type:sur
          body-true=expression:sur
          body-false=expression:sur
      ==
  ^-  instruction:sur
  [%if type body-true body-false]
```

Handle Wasm `if` expression construction with true and false branches.

### `+handle-const-f64` {#handle-const-f64}

```hoon
++  handle-const-f64
  |=  i=@rd
  ^-  instruction:sur
  [%const %f64 i]
```

Handle Wasm `f64.const` expression.

### `+handle-const-f32` {#handle-const-f32}

```hoon
++  handle-const-f32
  |=  i=@rs
  ^-  instruction:sur
  [%const %f32 i]
```

Handle Wasm `f32.const` expression.

### `+handle-const-i32` {#handle-const-i32}

```hoon
++  handle-const-i32
  |=  i=@s
  ^-  instruction:sur
  =;  i-unsigned=@
    [%const %i32 i-unsigned]
  =,  si
  ?:  (syn i)
    +:(old i)
  (sub (bex 32) +:(old i))
```

Handle Wasm `i32.const` expression with signed to unsigned conversion.

### `+handle-const-i64` {#handle-const-i64}

```hoon
++  handle-const-i64
  |=  i=@s
  ^-  instruction:sur
  =;  i-unsigned=@
    [%const %i64 i-unsigned]
  =,  si
  ?:  (syn i)
    +:(old i)
  (sub (bex 64) +:(old i))
```

Handle Wasm `i64.const` expression with signed to unsigned conversion.

## `+fc` {#fc}

`0xFC` extension parser for saturating truncation instructions.

```hoon
++  fc
  |^
  %+  cook  |=(instruction:sur +<)
  ;~  pose
    zero-args
    one-arg
    two-args
  ==
```

Parser for Wasm instructions prefixed with `0xFC`, which includes memory and table operations.

### `+zero-args` {#zero-args}

```hoon
++  zero-args  (sear handle-zero u32)
```

Parse extended instructions with zero additional arguments.

### `+one-arg` {#one-arg}

```hoon
++  one-arg    (sear handle-one ;~(plug u32 u32))
```

Parse extended instructions with one additional argument.

### `+two-args` {#two-args}

```hoon
++  two-args   (sear handle-two ;~(plug u32 u32 u32))
```

Parse extended instructions with two additional arguments.

### `+handle-zero` {#handle-zero}

```hoon
++  handle-zero
  |=  op=@
  ^-  (unit instruction:sur)
  ?.  (lte op 7)  ~
  :-  ~
  :*
    %trunc
  ::  Type
    ?:((lte op 3) %i32 %i64)
  ::  Source type
    `?:(=(0 (mod (div op 2) 2)) %f32 %f64)
  ::  Mode
    `?:(=(0 (mod op 2)) %s %u)
  ::
    &  ::  saturated
  ==
```

Handle saturating truncation instructions (opcodes 0-7).

### `+handle-one` {#handle-one}

```hoon
++  handle-one
  |=  [op=@ arg=@]
  ^-  (unit instruction:sur)
  ?+  op  ~
    %9   `[%data-drop arg]
    %11  `[%memory-fill ?>(?=(%0 arg) arg)]
    %13  `[%elem-drop arg]
    %15  `[%table-grow arg]
    %16  `[%table-size arg]
    %17  `[%table-fill arg]
  ==
```

Handle extended instructions with one argument.

### `+handle-two` {#handle-two}

```hoon
++  handle-two
  |=  [op=@ arg1=@ arg2=@]
  ^-  (unit instruction:sur)
  ?+  op  ~
    %8   `[%memory-init arg1 ?>(?=(%0 arg2) arg2)]
    %10  `[%memory-copy ?>(?=(%0 arg1) arg1) ?>(?=(%0 arg2) arg2)]
    %12  `[%table-init arg1 arg2]
    %14  `[%table-copy arg1 arg2]
  ==
```

Handle extended instructions with two arguments.

## `+fd` {#fd}

0xFD extension parser for SIMD (vector) instructions.

```hoon
++  fd
  |^
  ::  Opcode and immediate parameters
  ;~  pose
    (sear memarg ;~(plug u32 u32 u32))
    (sear mem-lane ;~(plug u32 ;~(plug u32 u32) next))
    (cook const ;~(pfix (feel 12 u32) (stun [16 16] next)))
    (cook shuffle ;~(pfix (feel 13 u32) (stun [16 16] next)))
    (sear lane ;~(plug u32 next))
    (sear simd-map u32)
  ==
```

Parser for Wasm SIMD instructions.

### `+memarg` {#memarg}

```hoon
++  memarg
  |=  [op=@ mem=[@ @]]
  ^-  (unit instruction:sur)
  =;  =(unit instr-vec:sur)
    ?~  unit  ~
    `[%vec u.unit]
  ?+  op  ~
    %0   `[%load mem ~]
    %1   `[%load mem ~ %8 %extend %s]
    %2   `[%load mem ~ %8 %extend %u]
    %3   `[%load mem ~ %16 %extend %s]
    %4   `[%load mem ~ %16 %extend %u]
    %5   `[%load mem ~ %32 %extend %s]
    %6   `[%load mem ~ %32 %extend %u]
    %7   `[%load mem ~ %8 %splat]
    %8   `[%load mem ~ %16 %splat]
    %9   `[%load mem ~ %32 %splat]
    %10  `[%load mem ~ %64 %splat]
    %92  `[%load mem ~ %32 %zero]
    %93  `[%load mem ~ %64 %zero]
    %11  `[%store mem]
  ==
::
```

Handle SIMD memory instructions (vector loads/stores with memory arguments).

### `+mem-lane` {#mem-lane}

```hoon
++  mem-lane
  |=  [op=@ mem=[@ @] l=@]
  ^-  (unit instruction:sur)
  =;  =(unit instr-vec:sur)
    ?~  unit  ~
    `[%vec u.unit]
  ?+  op  ~
    %84  `[%load-lane mem %8 l]
    %85  `[%load-lane mem %16 l]
    %86  `[%load-lane mem %32 l]
    %87  `[%load-lane mem %64 l]
    %88  `[%store-lane mem %8 l]
    %89  `[%store-lane mem %16 l]
    %90  `[%store-lane mem %32 l]
    %91  `[%store-lane mem %64 l]
  ==
::
```

Handle SIMD lane-specific memory operations.

### `+const` {#const}

```hoon
++  const
  |=  =(list @)
  ^-  instruction:sur
  :^  %vec  %const  %v128
  (rep 3 list)
```

Handle SIMD constant vectors (`v128.const`).

### `+shuffle` {#shuffle}

```hoon
++  shuffle
  |=  =(list @)
  ^-  instruction:sur
  [%vec %shuffle list]
```

Handle SIMD shuffle operations with lane indices.

### `+lane` {#lane}

```hoon
++  lane
  |=  [op=@ l=@]
  ^-  (unit instruction:sur)
  =;  =(unit instr-vec:sur)
    ?~  unit  ~
    `[%vec u.unit]
  ?+  op  ~
    %21  `[%extract %i8 l %s]
    %22  `[%extract %i8 l %u]
    %23  `[%replace %i8 l]
    %24  `[%extract %i16 l %s]
    %25  `[%extract %i16 l %u]
    %26  `[%replace %i16 l]
    %27  `[%extract %i32 l %u]
    %28  `[%replace %i32 l]
    %29  `[%extract %i64 l %u]
    %30  `[%replace %i64 l]
    %31  `[%extract %f32 l %u]
    %32  `[%replace %f32 l]
    %33  `[%extract %f64 l %u]
    %34  `[%replace %f64 l]
  ==
```

Handle SIMD lane extract/replace operations.

## Section Parsers

### `+type-section` {#type-section}

```hoon
++  type-section
  %+  cook  |=(type-section:sur +<)
  (vec func-type)
```

Parse Wasm module [`$type-section`](./wasm-data-types.md#type-section) containing function signatures.

### `+import-section` {#import-section}

```hoon
++  import-section
  %+  cook  |=(import-section:sur +<)
  (vec import)
```

Parse Wasm module [`$import-section`](./wasm-data-types.md#import-section) containing module dependencies.

### `+import` {#import}

```hoon
++  import
  %+  cook  |=(import:sur +<)
  ;~  plug
    name
    name
    import-desc
  ==
```

Parse individual module [`$import`](./wasm-data-types.md#import) entry with module name, import name, and description.

### `+import-desc` {#import-desc}

```hoon
++  import-desc
  ;~  pose
    import-func
    import-tabl
    import-memo
    import-glob
  ==
```

Parse module import description (function, table, memory, or global).

### `+import-func` {#import-func}

```hoon
++  import-func  ;~(plug (cold %func (just '\00')) u32)
```

Parse function import with type index.

### `+import-tabl` {#import-tabl}

```hoon
++  import-tabl  ;~(plug (cold %tabl (just '\01')) ref-type limits)
```

Parse table import with [reference type](./wasm-data-types.md#ref-type) and [`$limits`](./wasm-data-types.md#limits).

### `+import-memo` {#import-memo}

```hoon
++  import-memo  ;~(plug (cold %memo (just '\02')) limits)
```

Parse memory import with size limits.

### `+import-glob` {#import-glob}

```hoon
++  import-glob
  ;~  plug
    (cold %glob (just '\03'))
    valtype
    con-var
  ==
```

Parse global import with value type and mutability.

### `+con-var` {#con-var}

```hoon
++  con-var
  ;~  pose
    (cold %con (just '\00'))
    (cold %var (just '\01'))
  ==
```

Parse constant/variable mutability flag.

### `+function-section` {#function-section}

```hoon
++  function-section
  %+  cook  |=(function-section:sur +<)
  (vec u32)
```

Parse Wasm module [`$function-section`](./wasm-data-types.md#function-section) with type indices.

### `+table-section` {#table-section}

```hoon
++  table-section
  %+  cook  |=(table-section:sur +<)
  (vec table)
```

Parse Wasm module [`$table-section`](./wasm-data-types.md#table-section).

### `+table` {#table}

```hoon
++  table  ;~(plug ref-type limits)
```

Parse table definition with reference type and size limits.

### `+memory-section` {#memory-section}

```hoon
++  memory-section
  %+  cook  |=(memory-section:sur +<)
  (vec limits)
```

Parse Wasm module [`$memory-section`](./wasm-data-types.md#memory-section) with size limits.

### `+global-section` {#global-section}

```hoon
++  global-section
  %+  cook  |=(global-section:sur +<)
  (vec global)
```

Parse Wasm module [`$global-section`](./wasm-data-types.md#global-section).

### `+global` {#global}

```hoon
++  global
  %+  cook  |=(global:sur +<)
  ;~  plug
    valtype
    con-var
    const-expr
  ==
```

Parse [`$global`](./wasm-data-types.md#global) variable with type, mutability, and initial value.

### `+const-expr` {#const-expr}

```hoon
++  const-expr  ;~(sfix const-instr end)  ::  single instruction
```

Parse constant [`$expression`](./wasm-data-types.md#expression) (single constant instruction followed by end).

### `+const-instr` {#const-instr}

```hoon
++  const-instr
%+  sear
  |=  i=instruction:sur
  ^-  (unit const-instr:sur)
  ?.  ?=(const-instr:sur i)
    ~
  `i
instr
```

Parse [`$instruction`s](./wasm-data-types.md#instruction) that can appear in [constant instructions](./wasm-data-types.md#const-instr).

### `+export-section` {#export-section}

```hoon
++  export-section
  %+  cook  export-section:sur
  (vec export)
```

Parse Wasm export section.

### `+export` {#export}

```hoon
++  export
  ;~  plug
    name
    %+  cook  |=(export-desc:sur +<)
    ;~  pose
      ;~(plug (cold %func (just '\00')) u32)
      ;~(plug (cold %tabl (just '\01')) u32)
      ;~(plug (cold %memo (just '\02')) u32)
      ;~(plug (cold %glob (just '\03')) u32)
    ==
  ==
```

Parse export entry with name and description.

### `+start-section` {#start-section}

```hoon
++  start-section
  %+  cook  |=(start-section:sur +<)
  (stag ~ u32)
```

Parse Wasm module [`$start-section`](./wasm-data-types.md#start-section) with start function index.

### `+elem-section` {#elem-section}

```hoon
++  elem-section
  %+  cook  |=(elem-section:sur +<)
  (vec elem)
```

Parse Wasm module [`$elem-section`](./wasm-data-types.md#elem-section) for table initialization.

### `+elem` {#elem}

```hoon
++  elem
  ;~  pose
    elem-0
    elem-1
    elem-2
    elem-3
    elem-4
    elem-5
    elem-6
    elem-7
  ==
```

Parse element segment in one of eight different formats. Each format has different combinations of:
- Active/passive/declarative mode.
- Table index specification.
- Element type annotation.
- Initialization [`$expression`](./wasm-data-types.md#expression) vs [`$function`](./wasm-data-types.md#function-section) indices.

### `+elem-kind` {#elem-kind}

```hoon
++  elem-kind  (just '\00')
```

Parse element kind (currently only function references references supported).

### `+elem-0` through +elem-7 {#elem-variants}

```hoon
++  elem-0
  %+  cook  handle-elem-0
  ;~  pfix  (just '\00')
    ;~(plug const-expr (vec u32))
  ==
```

Parse different element segment formats.

### `+handle-elem-0` through +handle-elem-7 {#handle-elem-variants}

Handler functions that convert parsed element data into the standard [`$elem`](./wasm-data-types.md#elem) format, normalizing the different binary representations.

### `+code-section` {#code-section}

```hoon
++  code-section
  %+  cook  |=(code-section:sur +<)
  (vec code)
```

Parse Wasm module [`$code-section`](./wasm-data-types.md#code-section) containing function implementations.

### `+code` {#code}

```hoon
++  code  (bonk (vec next) ;~(pfix u32 func))
```

Parse code entry with size validation and function body.

### `+func` {#func}

```hoon
++  func
  ;~  plug
    (cook handle-locals (vec locals))
    expr
  ==
```

Parse function implementation with local variable declarations and body.

### `+locals` {#locals}

```hoon
++  locals  ;~(plug u32 valtype)
```

Parse local variable declaration (count and [`$valtype`](./wasm-data-types.md#valtype)).

### `+handle-locals` {#handle-locals}

```hoon
++  handle-locals
  |=  l=(list [n=@ v=valtype:sur])
  ^-  (list valtype:sur)
  ?~  l  ~
  %+  weld  (reap n.i.l v.i.l)
  $(l t.l)
```

Expand compressed local variable declarations into full list.

### `+data-section` {#data-section}

```hoon
++  data-section
  %+  cook  |=(data-section:sur +<)
  (vec data)
```

Parse Wasm module [`$data-section`](./wasm-data-types.md#data-section) section for memory initialization.

### `+data` {#data}

```hoon
++  data
  %+  cook  |=(data:sur +<)
  ;~    pose
      ;~  plug
        (cold %acti (just '\00'))
        const-expr
        (cook to-octs (vec next))
      ==
  ::
      ;~  plug
        (cold %pass (just '\01'))
        (cook to-octs (vec next))
      ==
  ::
      ;~    plug
          (cold %acti (just '\02'))
          ;~    pfix
              u32
              ;~  plug
                const-expr
                (cook to-octs (vec next))
  ==  ==  ==  ==
```

Parse [`$data`](./wasm-data-types.md#data) segment in active or passive mode with initialization data.

### `+to-octs` {#to-octs}

```hoon
++  to-octs
  |=  =tape
  ^-  octs
  :-  (lent tape)
  (rep 3 tape)
```

Convert tape to `$octs` format.

### `+datacnt-section` {#datacnt-section}

```hoon
++  datacnt-section
  %+  cook  |=(datacnt-section:sur +<)
  (stag ~ u32)
```

Parse Wasm module [data count](./wasm-data-types.md#datacnt-section) section.

### `+module` {#module}

```hoon
++  module
  %+  cook  |=(module:sur +<)
  ;~  pfix
    magic
    version
    (ifix [customs customs] module-contents)
  ==
```

Parse complete Wasm [`$module`](./wasm-data-types.md#module) with [`+magic`](#magic) number, [`+version`](#version), and sections.

### `+module-contents` {#module-contents}

```hoon
++  module-contents
  ;~  (glue customs)
    (check 1 type-section *type-section:sur)
    (check 2 import-section *import-section:sur)
    (check 3 function-section *function-section:sur)
    (check 4 table-section *table-section:sur)
    (check 5 memory-section *memory-section:sur)
    (check 6 global-section *global-section:sur)
    (check 7 export-section *export-section:sur)
    (check 8 start-section *start-section:sur)
    (check 9 elem-section *elem-section:sur)
    (check 12 datacnt-section *datacnt-section:sur)
    (check 10 code-section *code-section:sur)
    (check 11 data-section *data-section:sur)
  ==
```

Parse Wasm [`$module`](./wasm-data-types.md#module) contents.

### `+check` {#check}

```hoon
++  check
  |*  [id=@ sec=rule def=*]
  ;~  pose
  ::  section present
    ;~  pfix
      (just `@`id)
      (bonk (vec next) ;~(pfix u32 sec))
    ==
  ::  section missing
    (easy `(womp sec)`def)
  ==
```

Check for optional Wasm module sections, providing default values for missing sections.

### `+customs` {#customs}

```hoon
++  customs
  %-  star
  ;~  plug
    (just '\00')
    (vec next)
  ==
```

Parse custom Wasm module sections (ignored during parsing).

### `+magic` {#magic}

```hoon
++  magic  (jest '\00asm')
```

Parse Wasm magic number (`\00asm`).

### `+version` {#version}

```hoon
++  version
  ;~  plug
    (just '\01')
    (just '\00')  ::  leading zeros shenanigans
    (just '\00')
    (just '\00')
  ==
```

Parse Wasm version number (currently version 1).

## `+op-map` {#op-map}

```hoon
++  op-map
  |=  op=char
  ~+
  ^-  (unit instruction:sur)
  ?+  op  ~
    %0x0   `[%unreachable ~]
    %0x1   `[%nop ~]
    %0xf   `[%return ~]
    %0x1a  `[%drop ~]
    %0x1b  `[%select ~]
    :: ...
  ==
```

Maps single-byte Wasm opcodes to their corresponding [`$instruction`](./wasm-data-types.md#instruction) representations.

## `+simd-map` {#simd-map}

```hoon
++  simd-map
  |=  op=@
  ~+
  |^
  ^-  (unit instruction:sur)
  =;  =(unit instr-vec:sur)
    ?~  unit  ~
    `[%vec u.unit]
  ?+  op    ~
    %14   `[%swizzle ~]
    %98   `[%popcnt ~]
    :: ...
  ==
```

Maps SIMD instruction opcodes to their corresponding [vector instruction](./wasm-data-types.md#instr-vec) representations. Includes helper functions for different categories of vector operations.
