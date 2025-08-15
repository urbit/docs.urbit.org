# Wasm Runner Op-Def

The `/lib/wasm/runner/op-def` library implements WebAssembly instruction definitions as functions that transform the [`$local-state`](./wasm-interpreter-data-types.md#local-state) of the UrWasm interpreter. This library serves as the operational semantics for WebAssembly instructions, defining how each instruction modifies the interpreter's execution state.

## `+op-def` {#op-def}

```hoon
++  op-def
  =,  engine-sur
  |%
  ::  ...
  --
```

Core instruction definitions namespace. Implements WebAssembly instructions as gates that transform [`$local-state`](./wasm-interpreter-data-types.md#local-state) to [`$local-state`](./wasm-interpreter-data-types.md#local-state). Uses round-to-nearest ties-to-even semantics for floating-point operations except where otherwise specified.

## `+mayb` {#mayb}

```hoon
++  mayb
  |*  gat=$-(* *)
  |:  a=+6.gat
  ^-  (unit _$:gat)
  `(gat a)
```

Wrap output of a gate in a unit.

## `+sure` {#sure}

```hoon
++  sure
  |*  gat=$-(* (unit))
  |*  a=_+6.gat
  (need (gat a))
```

Unwrap output of gate, crashing if unit is empty.

## `+torn` {#torn}

```hoon
++  torn
  |*  [a=(list) b=$-(* (unit))]
  =|  l=(list _(need $:b))
  |-  ^-  (unit (list _(need $:b)))
  ?~  a  `(flop l)
  =+  c=(b i.a)
  ?~  c  ~
  $(a t.a, l [u.c l])
```

Map a list with a gate, collapsing units. Returns `~` if any application produces `~`.

## `+lane-size` {#lane-size}

```hoon
++  lane-size
  |=  lt=lane-type
  ^-  @
  (slav %ud (rsh 3 lt))
```

Extract the bit size from a [`$lane-type`](./wasm-data-types.md#lane-type).

## `+fuse` {#fuse}

```hoon
++  fuse
  |*  [a=(list) b=(list)]
  ^-  (list [_?>(?=(^ a) i.a) _?>(?=(^ b) i.b)])
  ?~  a  ~
  ?~  b  ~
  :-  [i.a i.b]
  $(a t.a, b t.b)
```

Zip two lists together, stopping when either list is exhausted.

## `+chap` {#chap}

```hoon
++  chap
  |=  [l=local-state instr=$-(local-state local-state)]
  ^-  local-state
  ?^  br.stack.l  l
  (instr l)
```

Check branching signal and conditionally apply instruction. If there's a branch signal in the local state, return unchanged; otherwise apply the instruction.

## `+page-size` {#page-size}

```hoon
++  page-size  ^~((bex 16))
```

WebAssembly memory page size (65,536 bytes).

## `+place` {#place}

```hoon
++  place
  |*  [a=(list) off=@ b=(list)]
  |-  ^+  b
  ?~  b  a
  ?>  (lth off (lent a))
  $(a (shot a off i.b), b t.b, off +(off))
```

Place list `.b` into list `.a` starting at offset `.off`, overwriting contents of `.a`.

## `+lim-min` {#lim-min}

```hoon
++  lim-min
  |=  l=limits
  ^-  @
  ?:  ?=(%flor -.l)
    p.l
  p.l
```

Extract minimum value from [`$limits`](./wasm-data-types.md#limits).

## `+lim-max` {#lim-max}

```hoon
++  lim-max
  |=  l=limits
  ^-  (unit @)
  ?:  ?=(%flor -.l)
    ~
  `q.l
```

Extract maximum value from [`$limits`](./wasm-data-types.md#limits). Returns `~` if no maximum is specified.

## `+lte-lim` {#lte-lim}

```hoon
++  lte-lim
  |=  [a=@ l=limits]
  ^-  ?
  ?:  ?=(%flor -.l)
    &
  (lte a q.l)
```

Test if value `.a` is within the specified [`$limits`](./wasm-data-types.md#limits).

## `+change` {#change}

```hoon
++  change
  |=  [a=(list valtype) b=(list val)]
  ^-  (list coin-wasm)
  ?.  &(?=(^ a) ?=(^ b))
    ?>  &(?=(~ a) ?=(~ b))
    ~
  :_  $(a t.a, b t.b)
  ;;  coin-wasm
  ?-    i.a
      ?(num-type vec-type)
    [i.a ?>(?=(@ i.b) i.b)]
  ::
      %extn
    ?>(?=([%ref %extn ~] i.b) i.b)
  ::
      %func
    ?>(?=([%ref %func *] i.b) i.b)
  ==
```

Convert stack values to a list of [`$coin-wasm`](./wasm-data-types.md#coin-wasm) for type checking.

## `+to-si` {#to-si}

```hoon
++  to-si
  |=  [base=@ n=@]
  ^-  @s
  =.  n  (mod n (bex base))
  =/  sign=?  (lth n (bex (dec base)))
  %+  new:si  sign
  ?:  sign  n
  (sub (bex base) n)
```

Convert unsigned integer to signed integer with specified bit width.

## `+en-si` {#en-si}

```hoon
++  en-si
  |=  [base=@ s=@s]
  ^-  @
  ?:  (syn:si s)
    +:(old:si s)
  (sub (bex base) +:(old:si s))
```

Convert signed integer to unsigned integer with specified bit width.

## `+sat` {#sat}

```hoon
++  sat
  |=  [size=@ s=@s mode=?(%u %s)]
  ^-  @
  =,  si
  =;  sat-s=@s
    (en-si size sat-s)
  ?:  =(%u mode)
    ?:  =(--1 (cmp s (sum (new & (bex size)) -1)))
      (sum (new & (bex size)) -1)
    ?:  =(-1 (cmp s --0))
      --0
    s
  ?:  =(--1 (cmp s (sum (new & (bex (dec size))) -1)))
    (sum (new & (bex (dec size))) -1)
  ?:  =(-1 (cmp s (new | (bex (dec size)))))
    (new | (bex (dec size)))
  s
```

Saturating conversion from signed integer with specified size and mode (`%u` for unsigned, `%s` for signed).

## `+coin-to-val` {#coin-to-val}

```hoon
++  coin-to-val
  |=  c=coin-wasm
  ^-  val
  ?:  ?=(%ref -.c)
    c
  ?-  -.c
    ?(%i32 %f32)  (mod +.c ^~((bex 32)))
    ?(%i64 %f64)  (mod +.c ^~((bex 64)))
    %v128         (mod +.c ^~((bex 128)))
  ==
```

Convert [`$coin-wasm`](./wasm-data-types.md#coin-wasm) to interpreter [`$val`](./wasm-interpreter-data-types.md#val).

## `+val-to-coin` {#val-to-coin}

```hoon
++  val-to-coin
  |=  [v=val ex=coin-wasm]
  ^-  coin-wasm
  ?@  v
    ?<  ?=(%ref -.ex)
    ;;  coin-wasm
    [-.ex v]
  ?>  ?=(%ref -.ex)
  ?>  =(+<.v +<.ex)  ::  assert: same reftypes
  v
```

Convert interpreter [`$val`](./wasm-interpreter-data-types.md#val) to [`$coin-wasm`](./wasm-data-types.md#coin-wasm) using expected type.

## `+snug` {#snug}

```hoon
++  snug
  |*  [a=@ b=(list)]
  |-  ^-  (unit _?>(?=(^ b) i.b))
  ?~  b  ~
  ?:  =(0 a)  `i.b
  $(b t.b, a (dec a))
```

Unitized list indexing. Returns element at index `.a` or `~` if index is out of bounds.

## `+shot` {#shot}

```hoon
++  shot
  |*  [a=(list) b=@ c=*]
  ^+  a
  ?>  (lth b (lent a))
  (snap a b c)
```

Replace existing item in a list at index `.b` with value `.c`.

## `+buy` {#buy}

```hoon
++  buy
  |=  [l=local-state req=[[mod=cord name=cord] =request] type=(list valtype)]
  ^-  local-state
  ?~  shop.store.l
    =,  store.l
    l(br.stack [%bloq req module mem tables globals])
  =/  valid-types=?
    =/  res=(list coin-wasm)  p.i.shop.store.l
    |-  ^-  ?
    ?:  &(?=(~ res) ?=(~ type))  &
    ?>  &(?=(^ res) ?=(^ type))
    ?&  =(-.i.res i.type)
        $(res t.res, type t.type)
    ==
  ?>  valid-types
  %=    l
      va.stack
    %+  weld
      %-  flop
      (turn p.i.shop.store.l coin-to-val)
    va.stack.l
  ::
      store
    =,  store.l
    [t.shop q.i.shop]
  ==
```

Resolve import. If no values are available in the `.shop`, creates a request and blocks execution. Otherwise, validates types and pushes values onto the stack.

## `+grab` {#grab}

```hoon
++  grab
  |%
  ++  func
    |=  [id=@ st=store]
    ^-  (each function [[mod=cord name=cord] type-id=@])
    =,  import-section.module.st
    =+  imp=(snug id funcs)
    ?^  imp  [%| u.imp]
    :-  %&
    (snag (sub id (lent funcs)) function-section.module.st)
  ::
  ++  table
    |=  [id=@ st=store]
    ^-  %+  each  (pair @ (list $>(%ref coin-wasm)))
        [[mod=cord name=cord] t=^table]
    =,  import-section.module.st
    =+  imp=(snug id tables)
    ?^  imp  [%| u.imp]
    :-  %&
    =+  idx=(sub id (lent tables))
    :-  idx
    (snag idx tables.st)
  ::
  ++  memo
    |=  [id=@ st=store]
    ^-  %+  each  [buffer=@ n-pages=@]
        [[mod=cord name=cord] l=limits]
    =,  import-section.module.st
    =+  imp=(snug id memos)
    ?^  imp  [%| u.imp]
    [%& (need mem.st)]
  ::
  ++  glob
    |=  [id=@ st=store]
    ^-  %+  each  (pair @ coin-wasm)
        [[mod=cord name=cord] v=valtype m=?(%con %var)]
    =,  import-section.module.st
    =+  imp=(snug id globs)
    ?^  imp  [%| u.imp]
    :-  %&
    =+  idx=(sub id (lent globs))
    :-  idx
    (snag idx globals.st)
  ::
  --
```

Import resolution utilities. Each arm returns either a local instance of an object or its external reference.
- `+func`: Resolve function by index.
- `+table`: Resolve table by index. Returns either a local table with its contents or an external reference.
- `+memo`: Resolve memory by index. Returns either local memory instance or an external reference.
- `+glob`: Resolve global variable by index. Returns either local global value or an external reference.

## `+mem-store` {#mem-store}

```hoon
++  mem-store
  |=  [index=@ size=@ content=@ buffer=@ n-pages=@]
  ^-  (unit [buffer=@ n-pages=@])
  ?.  (lte (add index size) (mul n-pages page-size))
    ~
  `[(sew 3 [index size content] buffer) n-pages]
```

Store data in linear memory at the specified index. Returns updated memory or `~` if out of bounds.

## `+mem-load` {#mem-load}

```hoon
++  mem-load
  |=  [index=@ size=@ buffer=@ n-pages=@]
  ^-  (unit @)
  ?.  (lte (add index size) (mul n-pages page-size))
    ~
  `(cut 3 [index size] buffer)
```

Load data from linear memory at the specified index. Returns data or `~` if out of bounds.

## `+kind` {#kind}

```hoon
++  kind
  |%
  +$  nullary   $?  %unreachable %nop %return %drop  ==
  +$  ref       ?(%ref-null %ref-is-null %ref-func)
  +$  get       ?(%global-get %local-get)
  +$  set       ?(%global-set %local-set %local-tee)
  +$  branch    ?(%br %br-if %br-table)
  +$  table     $?  %table-get %table-set %table-init %elem-drop
                    %table-copy %table-grow %table-size %table-fill  ==
  +$  memo      $?  %memory-size %memory-grow %memory-init %data-drop
                    %memory-copy %memory-fill  ==
  +$  unary-num    $?  %clz %ctz %popcnt %abs %neg %sqrt %ceil %floor
                       %trunc %nearest %eqz %wrap %extend %convert
                       %demote %promote %reinterpret  ==
  +$  binary-num   $?  %add %sub %mul %div %rem %and %or %xor %shl %shr
                       %rotl %rotr %min %max %copysign %eq %ne %lt %gt
                       %le %ge  ==
  --
```

Instruction category types for organizing instruction implementations.

## `+fetch-gate` {#fetch-gate}

```hoon
++  fetch-gate
  |=  i=$<(?(%call %loop %call-indirect %block %if) instruction)
  ^-  $-(local-state local-state)
  ?-    -.i
      %vec          (simd +.i)
      nullary:kind  (null:fetch i)
      ref:kind      (ref:fetch i)
      %load         (load:fetch i)
      %store        (store:fetch i)
      %const        (const:fetch i)
      get:kind      (get:fetch i)
      set:kind      (set:fetch i)
      branch:kind   (branch:fetch i)
      table:kind    (table:fetch i)
      memo:kind     (memo:fetch i)
      %select       select:fetch
      %dbug         (dbug:fetch i)
  ::
      unary-num:kind
    |=  l=local-state
    ^-  local-state
    ?>  ?=([a=@ rest=*] va.stack.l)
    =,  va.stack.l
    =+  val=((unar:fetch i) a)
    ?~  val  l(br.stack [%trap ~])
    l(va.stack [u.val rest])
  ::
      binary-num:kind
    |=  l=local-state
    ^-  local-state
    ?>  ?=([b=@ a=@ rest=*] va.stack.l)
    =,  va.stack.l
    =+  val=((bina:fetch i) a b)
    ?~  val  l(br.stack [%trap ~])
    l(va.stack [u.val rest])
  ::
  ==
```

Convert [`$instruction`](./wasm-data-types.md#instruction) to a gate that transforms local state. Handles different instruction categories appropriately.

## `+fetch` {#fetch}

```hoon
++  fetch
  |%
  ++  dbug     ::  Debug instructions
  ++  select   ::  Parametric instructions
  ++  null     ::  Control instructions with no operands
  ++  ref      ::  Reference instructions
  ++  load     ::  Memory load instructions
  ++  store    ::  Memory store instructions
  ++  const    ::  Constant instructions
  ++  get      ::  Variable get instructions
  ++  set      ::  Variable set instructions
  ++  branch   ::  Branch instructions
  ++  table    ::  Table instructions
  ++  memo     ::  Memory instructions
  ++  unar     ::  Unary numeric instructions
  ++  bina     ::  Binary numeric instructions
  --
```

Core with instruction implementation definitions. Each arm contains implementations for specific categories of WebAssembly instructions.

### `+dbug:fetch` {#dbug-fetch}

```hoon
++  dbug
  =-  |=  i=instruction
      ((~(got by m) ;;(@tas +<.i)) i)
  ^~
  ^=  m
  ^-  (map @tas $-(instruction $-(local-state local-state)))
  |^
  %-  my
  :~  print-tee+print-tee  ==
  ++  print-tee
    |=  i=instruction
    ?>  ?=([%dbug %print-tee a=term] i)
    |=  l=local-state
    ^-  local-state
    ~&  [a.i ;;(@ux -.va.stack.l)]
    l
  --
```

Debug instruction implementations. Currently supports `%print-tee` which prints the top stack value with a label.

### `+select:fetch` {#select-fetch}

```hoon
++  select
  |=  l=local-state
  ^-  local-state
  ?>  ?=([which=@ val2=* val1=* rest=*] va.stack.l)
  =,  va.stack.l
  %=    l
      va.stack
    [?.(=(0 which) val1 val2) rest]
  ==
```

Select instruction. Pops condition and two values, pushes the chosen value based on the condition.

### `+null:fetch` {#null-fetch}

```hoon
++  null
  =-  |=  i=instruction
      (~(got by m) ;;(@tas -.i))
  ^~
  ^=  m
  ^-  (map @tas $-(local-state local-state))
  |^
  %-  my
  :~
    unreachable+unreachable
    nop+nop
    return+return
    drop+drop
  ==
  ++  unreachable
    |=  l=local-state
    ^-  local-state
    l(br.stack [%trap ~])
  ++  nop  |=(local-state +<)
  ++  return
    |=  l=local-state
    ^-  local-state
    l(br.stack [%retr ~])
  ++  drop
    |=  l=local-state
    ^-  local-state
    l(va.stack +.va.stack.l)
  --
```

Control instructions with no operands:
- `unreachable`: Unconditionally trap.
- `nop`: No operation.
- `return`: Return from function.
- `drop`: Drop top value from stack.

### `+ref:fetch` {#ref-fetch}

```hoon
++  ref
  =-  |=  i=instruction
      ?>  ?=(ref:kind -.i)
      ^-  $-(local-state local-state)
      ((~(got by m) ;;(@tas -.i)) i)
  ^~
  ^=  m
  ^-  (map @tas $-(instruction $-(local-state local-state)))
  |^
  %-  my
  :~
    ref-null+ref-null
    ref-is-null+ref-is-null
    ref-func+ref-func
  ==
  ++  ref-null
    |=  i=instruction
    ?>  ?=(%ref-null -.i)
    |=  l=local-state
    ^-  local-state
    %=    l
        va.stack
      :_  va.stack.l
      :-  %ref
      ?-  t.i
        %extn  [%extn ~]
        %func  [%func ~]
      ==
    ==
  ++  ref-is-null
    |=  *
    |=  l=local-state
    ^-  local-state
    ?>  ?=([ref=[%ref *] rest=*] va.stack.l)
    =,  va.stack.l
    =/  out=@
      ?@(+>.ref 1 0)
    l(va.stack [out rest])
  ++  ref-func
    |=  i=instruction
    ?>  ?=(%ref-func -.i)
    |=  l=local-state
    ^-  local-state
    l(va.stack [[%ref %func ~ func-id.i] va.stack.l])
  --
```

Reference instruction implementations:
- `ref-null`: Push null reference of specified type.
- `ref-is-null`: Test if reference is null.
- `ref-func`: Push function reference.

## `+simd` {#simd}

```hoon
++  simd
  |=  iv=instr-vec
  ^-  $-(local-state local-state)
  ::  Implementation details for SIMD vector instructions
```

SIMD vector instruction implementations for 128-bit vectors. Handles vector load/store operations, lane manipulation, and parallel arithmetic operations on packed data.

The SIMD implementation includes:

### `+rope` {#rope}

Helper functions for vector operation utilities.

### `+fetch-vec` {#fetch-vec}

Vector instruction dispatcher that routes to specific vector operation implementations.

### Vector Memory Operations

- `load`: Load vector from memory with optional splat/zero-extend/sign-extend
- `load-lane`: Load single value into specific lane  
- `store`: Store vector to memory
- `store-lane`: Store single lane to memory

### Vector Manipulation

- `const`: Vector constant values
- `shuffle`: Rearrange lanes by index list
- `extract`: Get value from specific lane
- `replace`: Set value in specific lane

### Vector Arithmetic

- `plain`: Plain vector operations including:
  - `kind`: Categorize vector operation types
  - `vec-unar`: Unary vector operations 
  - `vec-bina`: Binary vector operations
  - `get-op-unar`: Resolve unary operation implementations
  - `get-op-bina`: Resolve binary operation implementations
  - `get-size`: Extract size information from vector types
