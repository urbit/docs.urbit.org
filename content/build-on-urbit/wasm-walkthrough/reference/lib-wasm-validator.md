# Wasm Validator

The `+validator` library validates WebAssembly modules for correctness according to the [WebAssembly Core Specification](https://www.w3.org/TR/2022/WD-wasm-core-2-20220419/valid/index.html). It performs static analysis to ensure type safety, proper memory access, and correct control flow before execution.

The validator operates on parsed [`$module`](./wasm-data-types.md#module) structures from the [`+parser`](./lib-wasm-parser.md) core and provides error messages for invalid modules.

## `+validator` {#validator}

```hoon
++  validator
  =,  wasm-sur
  |%
  +$  glob-type  [v=valtype m=?(%con %var)]
  +$  glob-types  (list glob-type)
  ::  ...
  --
```

Core validator namespace. Exposes the nested `+wasm-sur` namespace and defines validator-specific types.

## `$glob-type` {#glob-type}

```hoon
+$  glob-type  [v=valtype m=?(%con %var)]
```

Global variable type combining a [`$valtype`](./wasm-data-types.md#valtype) with mutability:
- `.v`: Value type of the global variable.
- `.m`: Mutability - `%con` for constant, `%var` for variable.

## `$glob-types` {#glob-types}

```hoon
+$  glob-types  (list glob-type)
```

List of all global variable types.

## `+output` {#output}

```hoon
++  output
  |%
  +$  import
    $:
      funcs=(list func-type)  ::  flopped
      tables=(list table)  ::  flopped
      memo=(unit limits)
      globs=glob-types  ::  flopped
    ==
  --
```

Validation output types.

??? - why are they flopped?

## `$import` {#import}

```hoon
+$  import
  $:
    funcs=(list func-type)  ::  flopped
    tables=(list table)  ::  flopped
    memo=(unit limits)
    globs=glob-types  ::  flopped
  ==
```

??? - why flopped?

Aggregated import validation results:
- `.funcs`: List of imported function types.
- `.tables`: List of imported [`$table`s](./wasm-data-types.md#table).
- `.memo`: Optional imported memory [`$limits`](./wasm-data-types.md#limits).
- `.globs`: List of imported global types.

## `$store` {#store}

```hoon
+$  store  import:output  ::  right order
```

Validation store containing all available types in the correct order for validation context.

??? - why does order matter here?

## `+result-form` {#result-form}

```hoon
++  result-form
  |$  [mold]
  (each mold cord)
```

Generic result type parameterized by return type. Either a result of the given `$mold` or an error message cord.

## `+result` {#result}

```hoon
++  result
  |*  m2=mold
  |%
  +$  form  $+(form (result-form m2))
  ++  bind
    |*  m1=mold
    |=  [a=(result-form m1) b=$-(m1 form)]
    ^-  form
    ?:  ?=(%| -.a)  a
    (b p.a)
  --
```

Monadic error handling system for validation. If the first validation fails, returns the error message; otherwise applies the continuation function.

## `+snug` {#snug}

```hoon
++  snug
  |=  where=cord
  |*  [a=@ b=(list)]
  =/  r  (result _?>(?=(^ b) i.b))
  |-  ^-  form:r
  ?~  b  |+(cat 3 'index error in ' where)
  ?:  =(a 0)  &+i.b
  $(a (dec a), b t.b)
```

Safe list indexing. Returns element at index `.a` in list `.b`, or an error message indicating the failure location.

## `+validate-module` {#validate-module}

```hoon
++  validate-module
  |=  m=module
  =/  r  (result ,~)
  ^-  form:r
  ;<  import-out=import:output  bind:r  (v-import-section m)
  =/  n-funcs-import=@  (lent funcs.import-out)
  ;<  functypes=(list func-type)  bind:r
    (v-function-section m funcs.import-out)
  ;<  tables=(list table)  bind:r  (v-table-section m tables.import-out)
  ;<  memo=(unit limits)  bind:r  (v-memory-section m memo.import-out)
  =/  n-funcs=@  (lent functypes)
  =/  n-tables=@  (lent tables)
  ;<  =glob-types  bind:r
    (v-global-section m globs.import-out n-funcs)
  =/  =store  [functypes tables memo glob-types]
  ;<  ~  bind:r
    %:  v-export-section
      m
      n-funcs
      n-tables
      ?^(memo 1 0)
      (lent glob-types)
    ==
  ;<  ~  bind:r  (v-start-section m functypes)
  ;<  ~  bind:r  (v-elem-section m n-tables functypes store)
  ;<  datacnt=(unit @)  bind:r  (v-datacnt-section m)
  ;<  ~  bind:r  (v-code-section m n-funcs-import store)
  (v-data-section m datacnt store)
::
```

Main module validation function. Validates a [`$module`](./wasm-data-types.md#module) by sequentially checking all sections in dependency order.

## `+v-import-section` {#v-import-section}

```hoon
++  v-import-section
  |=  m=module
  =|  out=import:output
  =/  num-types=@  (lent type-section.m)
  =/  r  (result import:output)
  |-  ^-  form:r
  ?~  import-section.m
    &+out
  ?-    -.desc.i.import-section.m
      %func
    =/  idx=@  type-id.desc.i.import-section.m
    ;<  type=func-type  bind:r  ((snug 'import functype') idx type-section.m)
    %=  $
      import-section.m  t.import-section.m
      funcs.out  [type funcs.out]
    ==
  ::
      %tabl
    ?.  (validate-limits q.t.desc.i.import-section.m)
      |+'invalid limits import table'
    =/  =table  t.desc.i.import-section.m
    $(import-section.m t.import-section.m, tables.out [table tables.out])
  ::
      %memo
    ?.  (validate-limits l.desc.i.import-section.m)
      |+'invalid limits import memo'
    ?^  memo.out  |+'multiple memos'
    %=  $
      import-section.m  t.import-section.m
      memo.out  `l.desc.i.import-section.m
    ==
  ::
      %glob
    %=  $
      import-section.m  t.import-section.m
      globs.out  [+.desc.i.import-section.m globs.out]
    ==
  ==
```

Validates the module's [`$import-section`](./wasm-data-types.md#import-section). Checks:
- Function imports reference valid type indices.
- Table imports have valid [`$limits`](./wasm-data-types.md#limits).
- At most one memory can be imported.
- Global imports have proper types.

## `+validate-limits` {#validate-limits}

```hoon
++  validate-limits
  |=  l=limits
  ^-  ?
  ?-  -.l
    %flor  &
    %ceil  (gte q.l p.l)
  ==
```

Validates [`$limits`](./wasm-data-types.md#limits) ensuring maximum is greater than or equal to minimum.

## `+v-function-section` {#v-function-section}

```hoon
++  v-function-section
  |=  [m=module functypes-import=(list func-type)]
  =/  functypes=(list func-type)  functypes-import
  =/  r  (result (list func-type))
  |-  ^-  form:r
  ?~  function-section.m  &+(flop functypes)
  =/  idx=@  i.function-section.m
  ;<  type=func-type  bind:r  ((snug 'local functype') idx type-section.m)
  %=  $
    function-section.m  t.function-section.m
    functypes  [type functypes]
  ==
```

Validates the [`$function-section`](./wasm-data-types.md#function-section) by checking that all function type indices reference valid entries in the type section.

## `+v-table-section` {#v-table-section}

```hoon
++  v-table-section
  |=  [m=module tables=(list table)]
  =/  r  (result (list table))
  ^-  form:r
  ?~  table-section.m  &+(flop tables)
  ?.  (validate-limits q.i.table-section.m)  |+'invalid limits local table'
  $(table-section.m t.table-section.m, tables [i.table-section.m tables])
```

Validates the [`$table-section`](./wasm-data-types.md#table-section) by checking table [`$limits`](./wasm-data-types.md#limits).

## `+v-memory-section` {#v-memory-section}

```hoon
++  v-memory-section
  |=  [m=module memo=(unit limits)]
  =/  r  (result (unit limits))
  ^-  form:r
  =/  len-memos=@  (lent memory-section.m)
  ?:  (gth len-memos 1)  |+'multiple memos'
  ?:  &(?=(^ memo) (gth len-memos 0))  |+'multiple memos'
  ?^  memo  &+memo
  ?:  =(len-memos 0)  &+~
  =/  lim=limits  -.memory-section.m
  ?.  (validate-limits lim)  |+'invalid limits local memory'
  ?:  &(?=(%ceil -.lim) (gth q.lim (bex 16)))  |+'mem limit too big'
  &+`-.memory-section.m
```

Validates the [`$memory-section`](./wasm-data-types.md#memory-section). Ensures:
- At most one memory is defined.
- Memory limits are valid.
- Maximum memory size doesn't exceed 2^16 pages (4GB).

## `+v-global-section` {#v-global-section}

```hoon
++  v-global-section
  |=  [m=module gt=glob-types n-funcs=@]
  =/  n-glob-import=@  (lent gt)
  =/  r  (result glob-types)
  |-  ^-  form:r
  ?~  global-section.m  &+(flop gt)
  =/  glob  i.global-section.m
  ?-    -.i.glob
      %const
    ?.  =(v.glob -.p.i.glob)  |+'global type mismatch'
    $(global-section.m t.global-section.m, gt [[v m]:glob gt])
  ::
      %vec
    ?.  ?=(%v128 v.glob)  |+'global type mismatch'
    $(global-section.m t.global-section.m, gt [[v m]:glob gt])
  ::
      %ref-null
    $(global-section.m t.global-section.m, gt [[v m]:glob gt])
  ::
      %ref-func
    ?:  (gte func-id.i.glob n-funcs)  |+'invalid funcref'
    $(global-section.m t.global-section.m, gt [[v m]:glob gt])
  ::
      %global-get
    ?:  (gte index.i.glob n-glob-import)
      |+'non-import or nonexisting const global initializer'
    $(global-section.m t.global-section.m, gt [[v m]:glob gt])
  ==
```

Validates the [`$global-section`](./wasm-data-types.md#global-section). Checks:
- Initializer expressions match declared types.
- Function references are valid.
- Global references in initializers refer to imported constants.

## `+v-export-section` {#v-export-section}

```hoon
++  v-export-section
  |=  [m=module n-funcs=@ n-tables=@ n-memos=@ n-globs=@]
  =|  names=(set cord)
  =/  r  (result ,~)
  |-  ^-  form:r
  ?~  export-section.m  &+~
  =/  exp  i.export-section.m
  ?:  (~(has in names) name.exp)  |+'name duplicate'
  =;  [i=@ num=@]
    ?:  (gte i num)  |+'invalid export index'
    $(export-section.m t.export-section.m, names (~(put in names) name.exp))
  ?-  -.export-desc.exp
    %func  [i.export-desc.exp n-funcs]
    %tabl  [i.export-desc.exp n-tables]
    %memo  [i.export-desc.exp n-memos]
    %glob  [i.export-desc.exp n-globs]
  ==
```

Validates the [`$export-section`](./wasm-data-types.md#export-section). Checks:
- Export names are unique.
- Export indices are within bounds for their respective types.

## `+v-start-section` {#v-start-section}

```hoon
++  v-start-section
  |=  [m=module functypes=(list func-type)]
  =/  r  (result ,~)
  ^-  form:r
  ?~  start-section.m  &+~
  =/  func-idx=@  u.start-section.m
  ;<  type=func-type  bind:r  ((snug 'start section') func-idx functypes)
  ?.  ?=([~ ~] type)
    |+'non-void start function'
  &+~
```

Validates the [`$start-section`](./wasm-data-types.md#start-section) ensuring the start function has no parameters and no return values.

## `+v-elem-section` {#v-elem-section}

```hoon
++  v-elem-section
  ::  elems are additionaly restricted by the parser: offset
  ::  expression is limited to a single const instruction,
  ::  and init expression are limited to a single %ref* instruction
  ::
  |=  [m=module n-tables=@ functypes=(list func-type) =store]
  =/  r  (result ,~)
  ^-  form:r
  ?~  elem-section.m  &+~
  =/  elem  i.elem-section.m
  ;<  ~  bind:r
    =/  r  (result ,~)
    |-  ^-  form:r
    ?~  i.elem  &+~
    ?:  ?=(%ref-null -.i.i.elem)
      ?:  =(t.elem t.i.i.elem)  $(i.elem t.i.elem)
      |+'%ref-null type mismatch in element'
    ?.  ?=(%func t.elem)  |+'%ref-null type mismatch in element'
    =/  idx=@  func-id.i.i.elem
    ;<  *  bind:r  ((snug 'elem section funcref') idx functypes)
    $(i.elem t.i.elem)
  ?.  ?=(%acti -.m.elem)  $(elem-section.m t.elem-section.m)
  ?:  (gte tab.m.elem n-tables)  |+'element index error'
  :: ?.  ?=(%i32 -.p.off.m.elem)  |+'type error in element offset'
  ?:  ?=(?(%ref-null %ref-func %vec) -.off.m.elem)
    |+'type error in element offset'
  ?:  ?=(%const -.off.m.elem)
    ?.  ?=(%i32 -.p.off.m.elem)  |+'type error in element offset'
    $(elem-section.m t.elem-section.m)
  ::  %global-get
  ;<  glob=glob-type  bind:r
    ((snug 'global section') index.off.m.elem globs.store)
  ?.  ?=(%i32 v.glob)  |+'type error in element offset'
  $(elem-section.m t.elem-section.m)
```

Validates the [`$elem-section`](./wasm-data-types.md#elem-section). Checks:
- Element initializers match table reference types.
- Function references are valid.
- Table indices are within bounds.
- Offset expressions have correct types.

## `+v-datacnt-section` {#v-datacnt-section}

```hoon
++  v-datacnt-section
  |=  m=module
  =/  r  (result (unit @))
  ^-  form:r
  &+datacnt-section.m
```

Returns the data count section, no additional validation needed.

## `+v-code-section` {#v-code-section}

```hoon
++  v-code-section
  |=  $:  m=module
          n-funcs-import=@
          =store
      ==
  ?.  =((lent code-section.m) (lent function-section.m))
    |+'mismatching lengths of function and code sections'
  =/  idx=@  n-funcs-import
  =/  r  (result ,~)
  |-  ^-  form:r
  ?~  code-section.m  &+~
  ;<  type=func-type  bind:r  ((snug 'code section') idx funcs.store)
  ;<  ~  bind:r  (validate-code idx i.code-section.m type m store)
  $(idx +(idx), code-section.m t.code-section.m)
```

Validates the [`$code-section`](./wasm-data-types.md#code-section). Checks:
- Code and function sections have matching lengths.
- Each function body validates against its declared type.

## `+v-data-section` {#v-data-section}

```hoon
++  v-data-section
  ::  data section is additionaly restrained by the parser:
  ::  offset expression may only be a single const instruction
  ::
  |=  [m=module datacnt=(unit @) =store]
  =/  r  (result ,~)
  ^-  form:r
  ?:  &(?=(^ datacnt) !=(u.datacnt (lent data-section.m)))
    |+'wrong datacnt'
  |-  ^-  form:r
  ?~  data-section.m
    &+~
  =/  data  i.data-section.m
  ?:  ?=(%pass -.data)
    $(data-section.m t.data-section.m)
  ?~  memo.store  |+'no memory to copy data to'
  ?:  ?=(%const -.off.data)
    ?.  ?=(%i32 -.p.off.data)  |+'type error in data offset'
    $(data-section.m t.data-section.m)
  ?:  ?=(?(%ref-null %ref-func %vec) -.off.data)
    |+'type error in data offset'
  ::  global-get
  ;<  glob=glob-type  bind:r
    ((snug 'global-section') index.off.data globs.store)
  ?.  ?=(%i32 v.glob)  |+'type error in data offset'
  $(data-section.m t.data-section.m)
```

Validates the [`$data-section`](./wasm-data-types.md#data-section). Checks:
- Data count matches actual data segments.
- Memory exists for active data segments.
- Offset expressions have correct types.

## `+validate-code` {#validate-code}

```hoon
++  validate-code
  |=  $:  idx=@
          =code
          type=func-type
          =module
          =store
      ==
  =/  r  (result ,~)
  ^-  form:r
  =/  locals  (weld params.type locals.code)
  =/  stack=(list valtype)  ~
  =/  frames=(list (list valtype))  ~[results.type]
  =/  res
    %:  validate-expr
      expression.code
      module
      store
      locals
      stack
      frames
    ==
  ?-  -.res
    %&  res
    %|  |+(rap 3 'func ' (scot %ud idx) ': ' p.res ~)
  ==
```

Validates a single function's [`$code`](./wasm-data-types.md#code) against its expected [`$func-type`](./wasm-data-types.md#func-type). Sets up the validation context with parameters and local variables, then validates the function body.

## `+validate-expr` {#validate-expr}

```hoon
++  validate-expr
  |=  $:  expr=expression
          =module
          =store
          $=  args
          $:  locals=(list valtype)
              stack=(list valtype)
              frames=(list (list valtype))
      ==  ==
  =/  r  (result ,~)
  ^-  form:r
  ?~  expr
    ?.  =(-.frames.args (flop stack.args))
      ~&  [frames.args (flop stack.args)]
      |+'type error in result'
    &+~
  =/  instr  i.expr
  ::  stack-polymorphic instructions (unconditional control transfer)
  ::
  ?:  ?=(%unreachable -.instr)  &+~
  ?:  ?=(%br -.instr)
    ;<  results=(list valtype)  bind:r
      ((snug 'br frames') label.instr frames.args)
    ?.  =(results (flop (scag (lent results) stack.args)))  |+'br type error'
    &+~
  ?:  ?=(%br-table -.instr)
    =/  labels=(list @)  [label-default label-vec]:instr
    ?.  =(%i32 -.stack.args)  |+'br-table index type error'
    =.  stack.args  +.stack.args
    |-  ^-  form:r
    ?~  labels  &+~
    ;<  results=(list valtype)  bind:r
      ((snug 'br-table frames') i.labels frames.args)
    ?.  =(results (flop (scag (lent results) stack.args)))
      |+'br-table type error'
    $(labels t.labels)
  ?:  ?=(%return -.instr)
    ?:  =(~ frames.args)  |+'no frames'
    =/  results=(list valtype)  (rear frames.args)
    ?.  =(results (flop (scag (lent results) stack.args)))
      |+'return type error'
    &+~
  ;<  [stack1=_stack.args]  bind:r
    (validate-instr instr module store args)
  $(expr t.expr, stack.args stack1)
```

Validates an [`$expression`](./wasm-data-types.md#expression) (sequence of instructions) within a given context. Validates:
- Local variable types.
- Stack type state.
- Control flow frames for branch validation.

Handles stack-polymorphic instructions (`unreachable`, `br`, `br-table`, `return`) specially as they don't return normally.

## `+validate-instr` {#validate-instr}

```hoon
++  validate-instr
  |=  $:  $=  instr
          $~  [%nop ~]
          $<(?(%unreachable %br %br-table %return) instruction)
      ::
          =module
          =store
          locals=(list valtype)
          stack=(pole valtype)
          frames=(list (list valtype))
      ==
  =/  r  (result _stack)
  ^-  form:r
  ::  ...
```

Validates a single [`$instruction`](./wasm-data-types.md#instruction) against the current stack and context. Handles:
- Value-polymorphic instructions (`drop`, `select`).
- Block instructions (`block`, `loop`, `if`).
- Control flow instructions (`br-if`, `call`, `call-indirect`).
- Reference instructions (`ref-is-null`).

For most instructions, delegates to [`+get-type`](#get-type) to determine the instruction's type signature.

## `+get-type` {#get-type}

```hoon
++  get-type
  |=  $:  $=  instr
          $~  [%nop ~]
          $<  $?  %unreachable
                  %br
                  %br-table
                  %return
                  %drop
                  %select
                  %block
                  %loop
                  %if
                  %br-if
                  %call
                  %call-indirect
                  %ref-is-null
              ==
          instruction
      ::
          =module
          =store
          locals=(list valtype)
      ==
  ~+
  =/  r  (result func-type)
  ^-  form:r
  ?-    -.instr
  ::  ...
  ==
```

Returns the type signature of an [`$instruction`](./wasm-data-types.md#instruction) as a [`$func-type`](./wasm-data-types.md#func-type) (parameter types and result types). Handles:
- Constant instructions (`const`).
- Unary numeric operations (`eqz`, `clz`, `ctz`, `popcnt`, `abs`, `neg`, etc.).
- Binary numeric operations (`add`, `sub`, `mul`, `div`, `rem`, etc.).
- Comparison operations (`eq`, `ne`, `lt`, `gt`, `le`, `ge`).
- Reference operations (`ref-null`, `ref-func`).
- Variable operations (`local-get`, `local-set`, `local-tee`, `global-get`, `global-set`).
- Table operations (`table-get`, `table-set`, `table-init`, etc.).
- Memory operations (`load`, `store`, `memory-size`, `memory-grow`, etc.).
- Vector instructions (delegated to [`+get-type-vec`](#get-type-vec)).

## `+get-type-vec` {#get-type-vec}

```hoon
++  get-type-vec
  |=  [instr=instr-vec =module =store]
  =/  r  (result func-type)
  ^-  form:r
  ?-    -.instr
  ::  ...
  ==
```

Returns the type signature for SIMD vector instructions. Handles:
- Vector memory operations (`load`, `store`, `load-lane`, `store-lane`).
- Vector constants and manipulation (`const`, `shuffle`, `extract`, `replace`).
- Vector logical operations (`swizzle`, `splat`).
- Vector comparison and arithmetic operations.
- Vector conversion operations.

## `+from-coin` {#from-coin}

```hoon
++  from-coin
  |=  coin=coin-wasm
  ^-  valtype
  ?-  -.coin
    valtype  -.coin
    %ref     +<.coin
  ==
```

Extracts the [`$valtype`](./wasm-data-types.md#valtype) from a [`$coin-wasm`](./wasm-data-types.md#coin-wasm).

## `+byte-width` {#byte-width}

```hoon
++  byte-width
  |=  v=?(num-type vec-type)
  ^-  @
  ?-  v
    ?(%i32 %f32)  4
    ?(%i64 %f64)  8
    %v128         16
  ==
```

Returns the byte width of a numeric or vector type.

## `+dim-lane` {#dim-lane}

```hoon
++  dim-lane
  |=  l=lane-type
  ^-  @
  ?-  l
    %i8           16
    %i16          8
    ?(%i32 %f32)  4
    ?(%i64 %f64)  2
  ==
```

Returns the number of lanes in a 128-bit vector for the given [`$lane-type`](./wasm-data-types.md#lane-type).

## `+unpack` {#unpack}

```hoon
++  unpack
  |=  l=lane-type
  ^-  num-type
  ?-  l
    num-type  l
    ?(%i8 %i16)  %i32
  ==
```

Converts a [`$lane-type`](./wasm-data-types.md#lane-type) to its corresponding [`$num-type`](./wasm-data-types.md#num-type), promoting `%i8` and `%i16` to `%i32`.
