# Wasm Data Types


UrWasm's inner core, `+wasm-sur`, contains the foundational Wasm types.

The first part implements the [Structure chapter](https://www.w3.org/TR/2022/WD-wasm-core-2-20220419/syntax/index.html) of the [WebAssembly Core Specification](https://www.w3.org/TR/2022/WD-wasm-core-2-20220419/syntax/index.html).

The second part implements Wasm's binary-format opcodes.

### `$octs` {#octs}

```hoon
+$  octs  (pair @ud @)
```

Pair of byte-length and octet stream data.

### `+wasm-sur` {#wasm-sur}

Wrapper arm around the Wasm types. This just makes the types addressable by limb resolution paths like `num-type:wasm-sur`.

### `$num-type` {#num-type}

```hoon
+$  num-type  ?(%i32 %i64 %f32 %f64)
```

Type annotation for the four types of number Wasm calls can return:
- 32-bit integers (`@F`).
- 64-bit integers (`@G`).
- 32-bit floating point numbers (`@rs`).
- 64-bit floating point numbers (`@rd`).

### `$vec-type` {#vec-type}

```hoon
+$  vec-type  %v128
```

Type annotation for a 128-bit (`@H`) register.

### `$ref-type` {#ref-type}

```hoon
+$  ref-type  ?(%extn %func)  ::  externref and funcref
```

Type annotation for references in the Wasm state, be those functions or data.

### `$valtype` {#valtype}

```hoon
+$  valtype
  $~  %i32
  $?  num-type
      vec-type
      ref-type
  ==
```

Type annotation for all the types that Wasm can accept: numbers, vectors, and references.

### `$coin-wasm` {#coin-wasm}

```hoon
+$  coin-wasm
  $~  [%i32 *@F]
  $%  [%i32 @F]
      [%i64 @G]
      [%f32 @rs]
      [%f64 @rd]
      [vec-type @H]
      $:  %ref                  ::  function reference, null or not
          $%  [%func (unit @)]  ::  local
              $:  %extn         ::  external
                  %-  unit
                  $:  [mod=cord name=cord]
                      type=func-type
      ==  ==  ==  ==
  ::
  ==
```

Type-annotated Wasm value. A `$coin-wasm` is UrWasm's version of Wasm's [result types](https://www.w3.org/TR/2022/WD-wasm-core-2-20220419/syntax/types.html#result-types), which look something like Hoon's [`$coin`](https://docs.urbit.org/hoon/stdlib/3g#coin) nouns.

These are the [`$valtype`](#valtype) type annotation terms with extra specification for atom size and object references.

### `$limits` {#limits}

```hoon
+$  limits
  $%  [%flor p=@]      ::  min only
      [%ceil p=@ q=@]  ::  min and max
  ==
```

Limits the range of available storage for [`$memarg`](#memarg)s and [`$table`](#table)s.

### `$memarg` {#memarg}

```hoon
+$  memarg
  $+  memarg
  [align=@ offset=@]
```

Defines the minimum and maximum size of a memory instance. The `.align` and `.offset` values represent units of Wasm's page size, which is 128 bits (so, a `@H`).

### `$block-type` {#block-type}

```hoon
+$  block-type  $@(@ func-type)  ::  typeidx in type section or func-type
```

Function signature for control flow blocks (`if`, `loop`, etc.). This may be defined inline ([`$func-type`](#func-type)) or referred to by its index in the [`$type-section`](#type-section).

### `$func-type` {#func-type}

```hoon
+$  func-type
  $:  params=(list valtype)
      results=(list valtype)
  ==
```

Function signature.

### `$lane-type` {#lane-type}

```hoon
+$  lane-type  ?(%i8 %i16 num-type)
```

Type annotation for lanes (memory elements) in a 128-bit (`@H`) register. Includes the usual [`$num-type`s](#num-type) and additional `%i8` and `%i16` types for smaller lanes.

### `$instruction` {#instruction}

```hoon
+$  instruction
  $%([%vec instr-vec] instr-short instr-num instr-dbug)
```

Type union of all Wasm instructions.

Instructions are categorized here by their operand patterns:
- `%vec`: Vector instructions. (See [`$instr-vec`]($instr-vec).)
- [`$instr-short`](#instr-short): Non-numeric Wasm instructions.
- [`$instr-num`](#instr-num): Standard Wasm instructions categorized by arity.
- [`$instr-dbug`](#instr-dbug): Debugging.

### `$instr-dbug` {#instr-dbug}

```hoon
+$  instr-dbug
  $%
    [%dbug %print-tee term]
  ==
```

Debugging instructions. The only one supported here is `%print-tee`, which prints a value to output with the given `$term` as a label.

### `$instr-num` {#instr-num}

```hoon
+$  instr-num  ?(instr-num-zero instr-num-one instr-num-two)
```

Type union of all standard Wasm instructions, categorized here by arity.

### `$instr-num-zero` {#instr-num-zero}

```hoon
+$  instr-num-zero
  $%
    [%const p=$<(?(%v128 %ref) coin-wasm)]
  ==
```

Wasm `const` instruction, whose value is any [`$coin-wasm`](#coin-wasm) that may represent a constant value. So...

```hoon
$?  [%i32 @F]
    [%i64 @G]
    [%f32 @rs]
    [%f64 @rd]
==
```

### `$instr-num-one` {#instr-num-one}

```hoon
+$  instr-num-one
  $%
    [%eqz type=?(%i32 %i64)]
    [%clz type=?(%i32 %i64)]
    [%ctz type=?(%i32 %i64)]
    [%popcnt type=?(%i8 %i32 %i64)]
    [%abs type=lane-type]
    [%neg type=lane-type]
    [%ceil type=?(%f32 %f64)]
    [%floor type=?(%f32 %f64)]
    ::
    $:  %trunc
        type=num-type
        source-type=(unit ?(%f32 %f64))
        mode=(unit ?(%s %u))
        sat=?
    ==
    ::
    [%nearest type=?(%f32 %f64)]
    [%sqrt type=?(%f32 %f64)]
    [%wrap ~]
  ::
    $:  %extend
        type=?(%i32 %i64)
        source-type=?(%i32 %i64)
        source-size=?(%8 %16 %32)
        mode=?(%s %u)
    ==
  ::
    [%convert type=?(%f32 %f64) source-type=?(%i32 %i64) mode=?(%s %u)]
    [%demote ~]
    [%promote ~]
    [%reinterpret type=num-type source-type=num-type]
  ==
```

Standard Wasm instructions with one parameter each:
- `eqz`: Check if equals zero.
- `clz`: Count leading zeroes.
- `ctz`: Count trailing zeroes.
- `popcnt`: Population count (number of set bits).
- `abs`: Absolute value.
- `neg`: Negate.
- `ceil`: Round a float up to nearest integer.
- `floor`: Round a float down to nearest integer.
- `nearest`: Round a float to nearest integer.
- `sqrt`: Square root.
- `trunc`: Truncate float to integer (with optional saturation).
- `wrap`: Wrap larger integer to smaller type.
- `extend`: Extend smaller integer to larger type.
- `convert`: Convert between integer and float.
- `demote`: Convert `f64` (`@rd`) to `f32` `(@rs`).
- `promote`: Convert `f32` (`@rs`) to `f64` (`@rd`).
- `reinterpret`: Reinterpret bit pattern as different type.

### `$instr-num-two` {#instr-num-two}

```hoon
+$  instr-num-two
  $%
    [%eq type=lane-type]
    [%ne type=lane-type]
    [%lt type=lane-type mode=(unit ?(%s %u))]
    [%gt type=lane-type mode=(unit ?(%s %u))]
    [%le type=lane-type mode=(unit ?(%s %u))]
    [%ge type=lane-type mode=(unit ?(%s %u))]
    [%add type=lane-type]
    [%sub type=lane-type]
    [%mul type=lane-type]
    [%div type=lane-type mode=(unit ?(%s %u))]
    [%rem type=?(%i32 %i64) mode=?(%s %u)]
    [%and type=?(%i32 %i64)]
    [%or type=?(%i32 %i64)]
    [%xor type=?(%i32 %i64)]
    [%shl type=?(%i8 %i16 %i32 %i64)]
    [%shr type=?(%i8 %i16 %i32 %i64) mode=?(%s %u)]
    [%rotl type=?(%i32 %i64)]
    [%rotr type=?(%i32 %i64)]
    [%min type=?(%f32 %f64)]
    [%max type=?(%f32 %f64)]
    [%copysign type=?(%f32 %f64)]
  ==
```

Wasm's binary numeric instructions:
- `eq`: Test equality.
- `ne`: Test inequality.
- `lt`: Less than.
- `gt`: Greater than.
- `le`: Less than or equal.
- `ge`: Greater than or equal.
- `add`: Addition.
- `sub`: Subtraction.
- `mul`: Multiplication.
- `div`: Division.
- `rem`: Remainder.
- `and`: Bitwise AND.
- `or`: Bitwise OR.
- `xor`: Bitwise XOR.
- `shl`: Shift left.
- `shr`: Shift right (logical or arithmetic).
- `rotl`: Rotate left.
- `rotr`: Rotate right.
- `min`: Minimum value.
- `max`: Maximum value.
- `copysign`: Copy sign bit from second operand to first.

### `$instr-short` {#instr-short}

```hoon
+$  instr-short
  $%
  ::  Control instructions
  ::
    [%unreachable ~]
    [%nop ~]
    [%block type=block-type body=expression]
    [%loop type=block-type body=expression]
    $:  %if
        type=block-type
        branch-true=expression
        branch-false=expression
    ==
  ::
    [%br label=@]
    [%br-if label=@]
    [%br-table label-vec=(list @) label-default=@]
    [%return ~]
    [%call func-id=@]
    [%call-indirect type-id=@ table-id=@]
  ::  Reference instructions
  ::
    [%ref-null t=ref-type]
    [%ref-is-null ~]
    [%ref-func func-id=@]
  ::  Parametric instructions
  ::
    [%drop ~]
    [%select (unit (list valtype))]
  ::  Variable instructions
  ::
    [%local-get index=@]
    [%local-set index=@]
    [%local-tee index=@]
    [%global-get index=@]
    [%global-set index=@]
  ::  Table instructions
  ::
    [%table-get tab-id=@]
    [%table-set tab-id=@]
    [%table-init elem-id=@ tab-id=@]
    [%elem-drop elem-id=@]
    [%table-copy tab-id-x=@ tab-id-y=@]
    [%table-grow tab-id=@]
    [%table-size tab-id=@]
    [%table-fill tab-id=@]
    ::  Memory instructions
    ::
    $:  %load
        type=num-type
        m=memarg
        n=(unit ?(%8 %16 %32))
        mode=(unit ?(%s %u))
    ==
    ::
    $:  %store
        type=num-type
        m=memarg
        n=(unit ?(%8 %16 %32))
    ==
    ::
    [%memory-size mem-id=%0]
    [%memory-grow mem-id=%0]
    [%memory-init x=@ mem-id=%0]
    [%data-drop x=@]
    [%memory-copy mem-1=%0 mem-2=%0]
    [%memory-fill mem-id=%0]
  ==  ::  $instr-short
```

Non-numeric WebAssembly instructions organized by category:
- `unreachable`: Trap execution unconditionally.
- `nop`: No operation.
- `block`: Start a block with optional result type.
- `loop`: Start a loop with optional result type.
- `if`: Conditional execution with true/false branches.
- `br`: Unconditional branch to label.
- `br-if`: Conditional branch to label.
- `br-table`: Multi-way branch (switch statement).
- `return`: Return from current function.
- `call`: Call function by index.
- `call-indirect`: Call function indirectly through table.
- `ref-null`: Create null reference.
- `ref-is-null`: Test if reference is null.
- `ref-func`: Get function reference.
- `drop`: Remove top stack value.
- `select`: Choose between two values based on condition.
- `local-get`: Get local variable value.
- `local-set`: Set local variable value.
- `local-tee`: Set local variable and return the value.
- `global-get`: Get global variable value.
- `global-set`: Set global variable value.
- `table-get`: Get element from table.
- `table-set`: Set element in table.
- `table-init`: Initialize table from element segment.
- `table-copy`: Copy elements between tables.
- `table-grow`: Grow table size.
- `table-size`: Get table size.
- `table-fill`: Fill table range with value.
- `elem-drop`: Drop element segment.
- `load`: Load value from memory.
- `store`: Store value to memory.
- `memory-size`: Get memory size in pages.
- `memory-grow`: Grow memory size.
- `memory-init`: Initialize memory from data segment.
- `data-drop`: Drop data segment.
- `memory-copy`: Copy memory regions.
- `memory-fill`: Fill memory range with byte value.

### `$instr-vec` {#instr-vec}

```hoon
+$  instr-vec
  $%
  ::  Load
  ::
    $:  %load
        m=memarg
        $=  kind  %-  unit
        $:  p=?(%8 %16 %32 %64)
            q=?(%splat %zero [%extend ?(%s %u)])
    ==  ==
  ::
    [%load-lane m=memarg p=?(%8 %16 %32 %64) l=@]
  ::  Store
  ::
    [%store m=memarg]
    [%store-lane m=memarg p=?(%8 %16 %32 %64) l=@]
  ::  Misc
    [%const p=$>(%v128 coin-wasm)]
    [%shuffle lane-ids=(list @)]
    [%extract p=lane-type l=@ mode=?(%s %u)]
    [%replace p=lane-type l=@]
  ::  Plain
  ::
    [%swizzle ~]
    [%splat p=lane-type]
    [%eq p=lane-type]
    [%ne p=lane-type]
    [%lt p=lane-type mode=?(%u %s)]
    [%gt p=lane-type mode=?(%u %s)]
    [%le p=lane-type mode=?(%u %s)]
    [%ge p=lane-type mode=?(%u %s)]
    [%not ~]
    [%and ~]
    [%andnot ~]
    [%or ~]
    [%xor ~]
    [%bitselect ~]
    [%any-true ~]
    [%abs p=lane-type]
    [%neg p=lane-type]
    [%popcnt ~]
    [%all-true p=?(%i8 %i16 %i32 %i64)]
    [%bitmask p=?(%i8 %i16 %i32 %i64)]
    [%narrow p=?(%i8 %i16) mode=?(%u %s)]
    [%shl p=?(%i8 %i16 %i32 %i64)]
    [%shr p=?(%i8 %i16 %i32 %i64) mode=?(%u %s)]
    [%add p=lane-type sat=(unit ?(%u %s))]
    [%sub p=lane-type sat=(unit ?(%u %s))]
    [%min p=lane-type mode=?(%u %s)]
    [%max p=lane-type mode=?(%u %s)]
    [%avgr p=?(%i8 %i16) mode=%u]
    [%extadd p=?(%i16 %i32) mode=?(%u %s)]
    [%q15mul-r-sat ~]
    [%extend p=?(%i16 %i32 %i64) mode=?(%u %s) half=?(%high %low)]
    [%mul p=lane-type]
    [%extmul p=?(%i16 %i32 %i64) mode=?(%u %s) half=?(%high %low)]
    [%dot ~]
    [%ceil p=?(%f32 %f64)]
    [%floor p=?(%f32 %f64)]
    [%trunc p=?(%i32 %f32 %f64) from=?(%f32 %f64) mode=?(%u %s)]
    [%nearest p=?(%f32 %f64)]
    [%sqrt p=?(%f32 %f64)]
    [%div p=?(%f32 %f64)]
    [%pmin p=?(%f32 %f64)]
    [%pmax p=?(%f32 %f64)]
    [%convert p=?(%f32 %f64) mode=?(%u %s)]
    [%demote ~]
    [%promote ~]
  ==  ::  $instr-vec
```

Wasm SIMD vector instructions for 128-bit vectors:
- `load`: Load vector from memory (with optional splat/zero-extend/sign-extend).
- `load-lane`: Load single value into specific lane.
- `store`: Store vector to memory.
- `store-lane`: Store single lane to memory.
- `const`: Vector constant.
- `shuffle`: Rearrange lanes by index list.
- `extract`: Get value from specific lane.
- `replace`: Set value in specific lane.
- `swizzle`: Rearrange lanes using second vector as indices.
- `splat`: Broadcast scalar to all lanes.
- `eq`: Lane-wise equality comparison.
- `ne`: Lane-wise inequality comparison.
- `lt`: Lane-wise less than comparison.
- `gt`: Lane-wise greater than comparison.
- `le`: Lane-wise less than or equal comparison.
- `ge`: Lane-wise greater than or equal comparison.
- `not`: Bitwise NOT on entire vector.
- `and`: Bitwise AND on entire vector.
- `andnot`: Bitwise AND-NOT on entire vector.
- `or`: Bitwise OR on entire vector.
- `xor`: Bitwise XOR on entire vector.
- `bitselect`: Select bits based on mask.
- `any-true`: Test if any lanes are true.
- `all-true`: Test if all lanes are true.
- `bitmask`: Extract high bit from each lane.
- `abs`: Lane-wise absolute value.
- `neg`: Lane-wise negation.
- `popcnt`: Population count on each lane.
- `narrow`: Pack two vectors into one with narrower lanes.
- `shl`: Lane-wise left bit shift.
- `shr`: Lane-wise right bit shift.
- `add`: Lane-wise addition (with optional saturation).
- `sub`: Lane-wise subtraction (with optional saturation).
- `min`: Lane-wise minimum.
- `max`: Lane-wise maximum.
- `avgr`: Averaging with rounding.
- `mul`: Lane-wise multiplication.
- `extend`: Extend lane width.
- `extmul`: Extended multiplication.
- `extadd`: Extended addition.
- `q15mul-r-sat`: Q15 fixed-point multiplication.
- `dot`: Dot product.
- `ceil`: Lane-wise ceiling (round up).
- `floor`: Lane-wise floor (round down).
- `nearest`: Lane-wise round to nearest.
- `sqrt`: Lane-wise square root.
- `div`: Lane-wise division.
- `trunc`: Lane-wise truncate to integer.
- `convert`: Lane-wise type conversion.
- `demote`: Lane-wise `f64` to `f32` conversion.
- `promote`: Lane-wise `f32` to `f64` conversion.
- `pmin`: Propagating minimum (NaN handling).
- `pmax`: Propagating maximum (NaN handling).

### `$expression` {#expression}

```hoon
+$  expression  (list instruction)
```

An ordered sequence of [`$instruction`](#instruction)s.

### `$const-instr` {#const-instr}

```hoon
+$  const-instr
  $~  [%const %i32 `@`0]
  $?  [%vec $>(%const instr-vec)]
      $>(?(%const %global-get %ref-null %ref-func) instruction)
  ==
```

Instructions that produce constant values e.g. global variables. Unlike [`$instr-num-zero`](#instr-num-zero) which only handles scalar numeric constants, this includes vector constants, global variable reads, and reference constants.

### `$module` {#module}

```hoon
+$  module
  $:
    =type-section
    =import-section
    =function-section
    =table-section
    =memory-section
    =global-section
    =export-section
    =start-section
    =elem-section
    =datacnt-section
    =code-section
    =data-section
  ==
```

A Wasm module. Note code and function sections are separated here to simplify parsing.

### `$type-section` {#type-section}

```hoon
+$  type-section
  $+  type-section
  (list func-type)
```

List of function signatures in the module.

### `$import-section` {#import-section}

```hoon
+$  import-section
  $+  import-section
  (list import)
```

List of [`$import`s](#import) this module requires from other modules.

### `$import` {#import}

```hoon
+$  import
  $:  mod=cord
      name=cord
      $=  desc
      $%
        [%func type-id=@]
        [%tabl t=table]
        [%memo l=limits]
        [%glob v=valtype m=?(%con %var)]  ::  constant or variable
  ==  ==
```

Import from another Wasm module, including:
- `.mod`: Module name.
- `.name`: Name for the entity in the module we'd like to import.
- `.desc`: Importable definitions within the module, including functions, tables, global variables, etc.

### `$function-section` {#function-section}

```hoon
+$  function-section
  $+  function-section
  (list type-id=@)
```

List of functions in this module, referenced by index.

### `$table-section` {#table-section}

```hoon
+$  table-section  (list table)
```

List of [`$table`s](#table) in the module.

### `$table` {#table}

```hoon
+$  table  (pair ref-type limits)
```

Wasm table, referenced by its [`$ref-type`](#ref-type) and describing the [`$limits`](#limits) of its size.

### `$memory-section` {#memory-section}

```hoon
+$  memory-section  (list limits)
```

List of the module's memory arrays, defined by the [`$limits`](#limits) of their size.

### `$global-section` {#global-section}

```hoon
+$  global-section  (list global)
```

List of the module's [`$global`](#global) variables.

### `$global` {#global}

```hoon
+$  global
  $:  v=valtype
      m=?(%con %var)
      i=const-instr
  ==
```

Global variable, including:
- `.val`: [`$valtype`](#valtype), type of the variable's value.
- `.m`: Constant or variable.
- `.i`: Initial value. (Note that this is a constant instruction and not a `(list instruction)` as Wasm has no global value type that would take multiple constant values.)

### `$export-section` {#export-section}

```hoon
+$  export-section
  $+  export-section
  (list export)
```

List of [`$export`s](#export) in the module.

### `$export` {#export}

```hoon
+$  export  [name=cord =export-desc]
```

Element to be exportable for use in other modules:
- `.name`: Name of the export.
- `.export-desk`: [`$export-desc`](#export-desc), type-annotated value of the export.

### `$export-desc` {#export-desc}

```hoon
+$  export-desc
  $%  [%func i=@]
      [%tabl i=@]
      [%memo i=@]
      [%glob i=@]
  ==
```

Type-annotated value of an export addressed by its index:
- `%func`: Function.
- `%tabl`: Table.
- `%memo`: Memory.
- `%glob`: Global variable.

In practice these indexes will always be 32-bit integers (`@F`s).

### `$start-section` {#start-section}

```hoon
+$  start-section  (unit @)
```

The initialization (or "start") function for the module, if one exists.

### `$elem-section` {#elem-section}

```hoon
+$  elem-section  (list elem)
```

List of [`$elem`s](#elem).

### `$elem` {#elem}

```hoon
+$  elem
  $~  [*ref-type ~ %pass ~]
  $:  t=ref-type
      i=(list $>(?(%ref-func %ref-null) instruction))
      $=  m
      $%  [%pass ~]
          [%decl ~]
          [%acti tab=@ off=const-instr]
  ==  ==
```

Wasm element segment:
- `.t`: Reference type. (Currently Wasm only supports function references (`%func` [`$ref-type`s](#ref-type)).)
- `.i`: Sequence of [`$instruction`s](#instruction) to produce function references.
- `.m`: Element segment mode:
  - `%pass`: Passive, elements copied manually via table initialization.
  - `%decl`: Declarative, declares references which aren't copied to tables.
  - `%acti`: Active, automatically copies element data to the table `.tab` at offset `.off` when the module is instantiated.

Element segments store static data with which to populate [`$table`s](#table) when the module is initialized.

### `$code-section` {#code-section}

```hoon
+$  code-section
  $+  code-section
  (list code)
```

List of [`$code`](#code) entries.

### `$code` {#code}

```hoon
+$  code
  $:  locals=(list valtype)
      =expression
  ==
```

Function implementation stored in binary format:
- `.locals`: List of local variables in this function.
- `.expression`: The function body as a sequence of instructions. (See [`$expression`](#expression).)

### `$data-section` {#data-section}

```hoon
+$  data-section  (list data)
```

List of the module's [`$data`](#data) segments.

### `$data` {#data}

```hoon
+$  data
  $%
    [%acti off=const-instr b=octs]
    [%pass b=octs]
  ==
```

Data segment for initializing the module's state.
- `%acti`: Active segments automatically copy `$octs` `.b` to the module's memory at offset `.off` during instantiation.
- `%pass`: Passive segments are copied manually when instructed.

### `+datacnt-section` {#datacnt-section}

```hoon
++  datacnt-section  (unit @)
```

{TODO check the below}

Data count section of the Wasm module, which may optionally contain the number of data segments ([`$data`](#data)) in the module. This allows validators to check the index validity of the data section before trying to access it.

### `$opcode` {#opcode}

```hoon
+$  opcode  $?  bin-opcodes-zero-args
                bin-opcodes-one-arg
                bin-opcodes-two-args
                bin-opcodes-blocks
                pseudo-opcode
            ==
```

Type union of all Wasm's binary instruction opcodes.

### `$bin-opcodes-zero-args` {#bin-opcodes-zero-args}

```hoon
+$  bin-opcodes-zero-args
  $?
::  trap  nop   return  drop   select  wrap  demote  promote
    %0x0  %0x1  %0xf    %0x1a  %0x1b  %0xa7  %0xb6   %0xbb
::
    eqz-opcodes  eq-opcodes  ne-opcodes  lt-opcodes  gt-opcodes  le-opcodes
    ge-opcodes  clz-opcodes  ctz-opcodes  popcnt-opcodes  add-opcodes
    sub-opcodes  mul-opcodes  div-opcodes  rem-opcodes  and-opcodes  or-opcodes
    xor-opcodes  shl-opcodes  shr-opcodes  rotl-opcodes  rotr-opcodes
    abs-opcodes  neg-opcodes  ceil-opcodes  floor-opcodes  trunc-opcodes
    nearest-opcodes  sqrt-opcodes  min-opcodes  max-opcodes  copysign-opcodes
    extend-opcodes  convert-opcodes  reinterpret-opcodes
  ==
```

Wasm binary instruction opcodes that take no immediate arguments.

A few simple opcodes are defined here:
- `%0x0`: `unreachable` - causes an unconditional trap when executed.
- `%0x1`: `nop` - no-op, do nothing.
- `%0xf`: `return` - return from current function with values from stack.
  - If there's nothing in the stack to return, this returns nothing.
  - If there are more values on the stack than allowed by the function's return type, the first $$n$$ values are returned (where $$n$$ is the number of values allowed) and the rest are discarded.
- `%0x1a`: `drop` - remove top value from stack.
- `%0x1b`: `select` - choose between two values based on condition.
- `%0xa7`: `i64.wrap_i32` - convert `i64` to `i32` by wrapping (truncating high bits).
- `%0xb6`: `f32.demote_f64` - convert `f64` to `f32`.
- `%0xbb`: `f64.promote_f32` - convert `f32` to `f64`.

### `$pseudo-opcode` {#pseudo-opcode}

```hoon
+$  pseudo-opcode  ?(%0x5 %0xb)  ::  else, end
```

Pseudo-opcodes for control flow constructs:
- `%0x5`: `else` - marks the else branch of an if block.
- `%0xb`: `end` - terminates blocks, loops, if-statements, and functions.

### `$bin-opcodes-one-arg` {#bin-opcodes-one-arg}

```hoon
+$  bin-opcodes-one-arg
  $?
::  br    br_if  call  local.get  local.set  local.tee  global.get  global.set
    %0xc  %0xd   %0x10  %0x20     %0x21      %0x22      %0x23       %0x24
::
    const-opcodes
    %0x3f  ::  memory.size
    %0x40  ::  memory.grow
  ==
```

Instructions taking one immediate argument:
- `%0xc`: `br` - unconditional branch to label.
- `%0xd`: `br_if` - conditional branch to label.
- `%0x10`: `call` - invoke function by index.
- `%0x20`: `local.get` - read local variable.
- `%0x21`: `local.set` - write local variable.
- `%0x22`: `local.tee` - write local variable and return value.
- `%0x23`: `global.get` - read global variable.
- `%0x24`: `global.set` - write global variable.
- `%0x3f`: `memory.size` - query memory size.
- `%0x40`: `memory.grow` - grow memory by given delta.
- [`$const-opcodes`](#const-opcodes): constants for `i32`, `i64`, `f32`, `f64`.

### `$bin-opcodes-two-args` {#bin-opcodes-two-args}

```hoon
+$  bin-opcodes-two-args
  $?
    %0xe   ::  br_table
    %0x11  ::  call_indirect
    load-opcodes
    store-opcodes
  ==
```

Instructions taking two immediate arguments:
- `%0xe`: `br_table` - branch table for switch-like control flow.
- `%0x11`: `call_indirect` - invoke function indirectly through table.
- [`$load-opcodes`](#load-opcodes): memory load operations with alignment and offset.
- [`$store-opcodes`](#store-opcodes): memory store operations with alignment and offset.

### `$bin-opcodes-blocks` {#bin-opcodes-blocks}

```hoon
+$  bin-opcodes-blocks
  $?
    %0x2  ::  block
    %0x3  ::  loop
    %0x4  ::  if
  ==
```

Structured control flow instructions that create blocks with labels:
- `%0x2`: `block` - creates a block construct that can be targeted by branch instructions.
- `%0x3`: `loop` - creates a loop construct where branches target the beginning of the block.
- `%0x4`: `if` - creates a conditional block that executes based on a condition value.

### `$const-opcodes` {#const-opcodes}

```hoon
+$  const-opcodes
  $?
    %0x41  ::  i32
    %0x42  ::  i64
    %0x43  ::  f32
    %0x44  ::  f64
  ==
```

Constant value instructions that push literal values onto the stack:
- `%0x41`: `i32.const` - push 32-bit integer constant.
- `%0x42`: `i64.const` - push 64-bit integer constant.
- `%0x43`: `f32.const` - push 32-bit float constant.
- `%0x44`: `f64.const` - push 64-bit float constant.

### `$load-opcodes` {#load-opcodes}

```hoon
+$  load-opcodes
  $?
    %0x28  ::  i32
    %0x29  ::  i64
    %0x2a  ::  f32
    %0x2b  ::  f64
    %0x2c  ::  i32 8 s
    %0x2d  ::  i32 8 u
    %0x2e  ::  i32 16 s
    %0x2f  ::  i32 16 u
    %0x30  ::  i64 8 s
    %0x31  ::  i64 8 u
    %0x32  ::  i64 16 s
    %0x33  ::  i64 16 u
    %0x34  ::  i64 32 s
    %0x35  ::  i64 32 u
  ==
```

Memory load instructions that read values from linear memory:
- `%0x28`: `i32.load` - load 32-bit integer.
- `%0x29`: `i64.load` - load 64-bit integer.
- `%0x2a`: `f32.load` - load 32-bit float.
- `%0x2b`: `f64.load` - load 64-bit float.
- `%0x2c`: `i32.load8_s` - load 8-bit signed, extend to `i32`.
- `%0x2d`: `i32.load8_u` - load 8-bit unsigned, extend to `i32`.
- `%0x2e`: `i32.load16_s` - load 16-bit signed, extend to `i32`.
- `%0x2f`: `i32.load16_u` - load 16-bit unsigned, extend to `i32`.
- `%0x30`: `i64.load8_s` - load 8-bit signed, extend to `i64`.
- `%0x31`: `i64.load8_u` - load 8-bit unsigned, extend to `i64`.
- `%0x32`: `i64.load16_s` - load 16-bit signed, extend to `i64`.
- `%0x33`: `i64.load16_u` - load 16-bit unsigned, extend to `i64`.
- `%0x34`: `i64.load32_s` - load 32-bit signed, extend to `i64`.
- `%0x35`: `i64.load32_u` - load 32-bit unsigned, extend to `i64`.

### `$store-opcodes` {#store-opcodes}

```hoon
+$  store-opcodes
  $?
    %0x36  ::  i32
    %0x37  ::  i64
    %0x38  ::  f32
    %0x39  ::  f64
    %0x3a  ::  i32 8
    %0x3b  ::  i32 16
    %0x3c  ::  i64 8
    %0x3d  ::  i64 16
    %0x3e  ::  i64 32
  ==
```

Memory store instructions that write values to linear memory:
- `%0x36`: `i32.store` - store 32-bit integer.
- `%0x37`: `i64.store` - store 64-bit integer.
- `%0x38`: `f32.store` - store 32-bit float.
- `%0x39`: `f64.store` - store 64-bit float.
- `%0x3a`: `i32.store8` - store lower 8 bits of `i32`.
- `%0x3b`: `i32.store16` - store lower 16 bits of `i32`.
- `%0x3c`: `i64.store8` - store lower 8 bits of `i64`.
- `%0x3d`: `i64.store16` - store lower 16 bits of `i64`.
- `%0x3e`: `i64.store32` - store lower 32 bits of `i64`.

### `$eqz-opcodes` {#eqz-opcodes}

```hoon
+$  eqz-opcodes  ?(%0x45 %0x50)              ::  i32, i64
```

Test if value equals zero:
- `%0x45`: `i32.eqz` - test if `i32` equals zero.
- `%0x50`: `i64.eqz` - test if `i64` equals zero.

### `$eq-opcodes` {#eq-opcodes}

```hoon
+$  eq-opcodes   ?(%0x46 %0x51 %0x5b %0x61)  ::  i32, i64, f32, f64
```

Test if two values are equal:
- `%0x46`: `i32.eq` - `i32` equality comparison.
- `%0x51`: `i64.eq` - `i64` equality comparison.
- `%0x5b`: `f32.eq` - `f32` equality comparison.
- `%0x61`: `f64.eq` - `f64` equality comparison.

### `$ne-opcodes` {#ne-opcodes}

```hoon
+$  ne-opcodes   ?(%0x47 %0x52 %0x5c %0x62)  ::  i32, i64, f32, f64
```

Test if two values are not equal:
- `%0x47`: `i32.ne` - `i32` inequality comparison.
- `%0x52`: `i64.ne` - `i64` inequality comparison.
- `%0x5c`: `f32.ne` - `f32` inequality comparison.
- `%0x62`: `f64.ne` - `f64` inequality comparison.

### `$lt-opcodes` {#lt-opcodes}

```hoon
+$  lt-opcodes
  $?
    %0x48  ::  i32 s
    %0x49  ::  i32 u
    %0x53  ::  i64 s
    %0x54  ::  i64 u
    %0x5d  ::  f32
    %0x63  ::  f64
  ==
```

Test if first value is less than second:
- `%0x48`: `i32.lt_s` - `i32` signed less-than.
- `%0x49`: `i32.lt_u` - `i32` unsigned less-than.
- `%0x53`: `i64.lt_s` - `i64` signed less-than.
- `%0x54`: `i64.lt_u` - `i64` unsigned less-than.
- `%0x5d`: `f32.lt` - `f32` less-than.
- `%0x63`: `f64.lt` - `f64` less-than.

### `$gt-opcodes` {#gt-opcodes}

```hoon
+$  gt-opcodes
  $?
    %0x4a  ::  i32 s
    %0x4b  ::  i32 u
    %0x55  ::  i64 s
    %0x56  ::  i64 u
    %0x5e  ::  f32
    %0x64  ::  f64
  ==
```

Test if first value is greater than second:
- `%0x4a`: `i32.gt_s` - `i32` signed greater-than.
- `%0x4b`: `i32.gt_u` - `i32` unsigned greater-than.
- `%0x55`: `i64.gt_s` - `i64` signed greater-than.
- `%0x56`: `i64.gt_u` - `i64` unsigned greater-than.
- `%0x5e`: `f32.gt` - `f32` greater-than.
- `%0x64`: `f64.gt` - `f64` greater-than.

### `$le-opcodes` {#le-opcodes}

```hoon
+$  le-opcodes
  $?
    %0x4c  ::  i32 s
    %0x4d  ::  i32 u
    %0x57  ::  i64 s
    %0x58  ::  i64 u
    %0x5f  ::  f32
    %0x65  ::  f64
  ==
```

Test if first value is less than or equal to second:
- `%0x4c`: `i32.le_s` - `i32` signed less-than-or-equal.
- `%0x4d`: `i32.le_u` - `i32` unsigned less-than-or-equal.
- `%0x57`: `i64.le_s` - `i64` signed less-than-or-equal.
- `%0x58`: `i64.le_u` - `i64` unsigned less-than-or-equal.
- `%0x5f`: `f32.le` - `f32` less-than-or-equal.
- `%0x65`: `f64.le` - `f64` less-than-or-equal.

### `$ge-opcodes` {#ge-opcodes}

```hoon
+$  ge-opcodes
  $?
    %0x4e  ::  i32 s
    %0x4f  ::  i32 u
    %0x59  ::  i64 s
    %0x5a  ::  i64 u
    %0x60  ::  f32
    %0x66  ::  f64
  ==
```

Test if first value is greater than or equal to second:
- `%0x4e`: `i32.ge_s` - `i32` signed greater-than-or-equal.
- `%0x4f`: `i32.ge_u` - `i32` unsigned greater-than-or-equal.
- `%0x59`: `i64.ge_s` - `i64` signed greater-than-or-equal.
- `%0x5a`: `i64.ge_u` - `i64` unsigned greater-than-or-equal.
- `%0x60`: `f32.ge` - `f32` greater-than-or-equal.
- `%0x66`: `f64.ge` - `f64` greater-than-or-equal.

### `$clz-opcodes` {#clz-opcodes}

```hoon
+$  clz-opcodes  ?(%0x67 %0x79)              ::  i32, i64
```

Count leading zeros:
- `%0x67`: `i32.clz` - count leading zeros in `i32`.
- `%0x79`: `i64.clz` - count leading zeros in `i64`.

### `$ctz-opcodes` {#ctz-opcodes}

```hoon
+$  ctz-opcodes  ?(%0x68 %0x7a)              ::  i32, i64
```

Count trailing zeros:
- `%0x68`: `i32.ctz` - count trailing zeros in `i32`.
- `%0x7a`: `i64.ctz` - count trailing zeros in `i64`.

### `$popcnt-opcodes` {#popcnt-opcodes}

```hoon
+$  popcnt-opcodes  ?(%0x69 %0x7b)           ::  i32, i64
```

Count number of set bits (population count):
- `%0x69`: `i32.popcnt` - count set bits in `i32`.
- `%0x7b`: `i64.popcnt` - count set bits in `i64`.

### `$add-opcodes` {#add-opcodes}

```hoon
+$  add-opcodes  ?(%0x6a %0x7c %0x92 %0xa0)  ::  i32, i64, f32, f64
```

Addition operations:
- `%0x6a`: `i32.add` - `i32` addition.
- `%0x7c`: `i64.add` - `i64` addition.
- `%0x92`: `f32.add` - `f32` addition.
- `%0xa0`: `f64.add` - `f64` addition.

### `$sub-opcodes` {#sub-opcodes}

```hoon
+$  sub-opcodes  ?(%0x6b %0x7d %0x93 %0xa1)  ::  i32, i64, f32, f64
```

Subtraction operations:
- `%0x6b`: `i32.sub` - `i32` subtraction.
- `%0x7d`: `i64.sub` - `i64` subtraction.
- `%0x93`: `f32.sub` - `f32` subtraction.
- `%0xa1`: `f64.sub` - `f64` subtraction.

### `$mul-opcodes` {#mul-opcodes}

```hoon
+$  mul-opcodes  ?(%0x6c %0x7e %0x94 %0xa2)  ::  i32, i64, f32, f64
```

Multiplication operations:
- `%0x6c`: `i32.mul` - `i32` multiplication.
- `%0x7e`: `i64.mul` - `i64` multiplication.
- `%0x94`: `f32.mul` - `f32` multiplication.
- `%0xa2`: `f64.mul` - `f64` multiplication.

### `$div-opcodes` {#div-opcodes}

```hoon
+$  div-opcodes
  $?
    %0x6d  ::  i32 s
    %0x6e  ::  i32 u
    %0x7f  ::  i64 s
    %0x80  ::  i64 u
    %0x95  ::  f32
    %0xa3  ::  f64
  ==
```

Division operations:
- `%0x6d`: `i32.div_s` - `i32` signed division.
- `%0x6e`: `i32.div_u` - `i32` unsigned division.
- `%0x7f`: `i64.div_s` - `i64` signed division.
- `%0x80`: `i64.div_u` - `i64` unsigned division.
- `%0x95`: `f32.div` - `f32` division.
- `%0xa3`: `f64.div` - `f64` division.

### `$rem-opcodes` {#rem-opcodes}

```hoon
+$  rem-opcodes
  $?
    %0x6f  ::  i32 s
    %0x70  ::  i32 u
    %0x81  ::  i64 s
    %0x82  ::  i64 u
  ==
```

Remainder operations:
- `%0x6f`: `i32.rem_s` - `i32` signed remainder.
- `%0x70`: `i32.rem_u` - `i32` unsigned remainder.
- `%0x81`: `i64.rem_s` - `i64` signed remainder.
- `%0x82`: `i64.rem_u` - `i64` unsigned remainder.

### `$and-opcodes` {#and-opcodes}

```hoon
+$  and-opcodes  ?(%0x71 %0x83)  ::  i32, i64
```

Bitwise AND operations:
- `%0x71`: `i32.and` - `i32` bitwise AND.
- `%0x83`: `i64.and` - `i64` bitwise AND.

### `$or-opcodes` {#or-opcodes}

```hoon
+$  or-opcodes   ?(%0x72 %0x84)  ::  i32, i64
```

Bitwise OR operations:
- `%0x72`: `i32.or` - `i32` bitwise OR.
- `%0x84`: `i64.or` - `i64` bitwise OR.

### `$xor-opcodes` {#xor-opcodes}

```hoon
+$  xor-opcodes  ?(%0x73 %0x85)  ::  i32, i64
```

Bitwise XOR operations:
- `%0x73`: `i32.xor` - `i32` bitwise exclusive OR.
- `%0x85`: `i64.xor` - `i64` bitwise exclusive OR.

### `$shl-opcodes` {#shl-opcodes}

```hoon
+$  shl-opcodes  ?(%0x74 %0x86)  ::  i32, i64
```

Bitwise left shift operations:
- `%0x74`: `i32.shl` - `i32` shift left.
- `%0x86`: `i64.shl` - `i64` shift left.

### `$shr-opcodes` {#shr-opcodes}

```hoon
+$  shr-opcodes
  $?
    %0x75  ::  i32 s
    %0x76  ::  i32 u
    %0x87  ::  i64 s
    %0x88  ::  i64 u
  ==
```

Bitwise right shift operations:
- `%0x75`: `i32.shr_s` - `i32` arithmetic right shift (sign-extending).
- `%0x76`: `i32.shr_u` - `i32` logical right shift (zero-filling).
- `%0x87`: `i64.shr_s` - `i64` arithmetic right shift (sign-extending).
- `%0x88`: `i64.shr_u` - `i64` logical right shift (zero-filling).

### `$rotl-opcodes` {#rotl-opcodes}

```hoon
+$  rotl-opcodes   ?(%0x77 %0x89)  ::  i32, i64
```

Rotate left operations:
- `%0x77`: `i32.rotl` - `i32` rotate left.
- `%0x89`: `i64.rotl` - `i64` rotate left.

### `$rotr-opcodes` {#rotr-opcodes}

```hoon
+$  rotr-opcodes   ?(%0x78 %0x8a)  ::  i32, i64
```

Rotate right operations:
- `%0x78`: `i32.rotr` - `i32` rotate right.
- `%0x8a`: `i64.rotr` - `i64` rotate right.

### `$abs-opcodes` {#abs-opcodes}

```hoon
+$  abs-opcodes    ?(%0x8b %0x99)  ::  f32, f64
```

Floating-point absolute value operations:
- `%0x8b`: `f32.abs` - `f32` absolute value.
- `%0x99`: `f64.abs` - `f64` absolute value.

### `$neg-opcodes` {#neg-opcodes}

```hoon
+$  neg-opcodes    ?(%0x8c %0x9a)  ::  f32, f64
```

Floating-point negation operations:
- `%0x8c`: `f32.neg` - `f32` negation.
- `%0x9a`: `f64.neg` - `f64` negation.

### `$ceil-opcodes` {#ceil-opcodes}

```hoon
+$  ceil-opcodes   ?(%0x8d %0x9b)  ::  f32, f64
```

Floating-point ceiling operations (round up to nearest integer):
- `%0x8d`: `f32.ceil` - `f32` ceiling.
- `%0x9b`: `f64.ceil` - `f64` ceiling.

### `$floor-opcodes` {#floor-opcodes}

```hoon
+$  floor-opcodes  ?(%0x8e %0x9c)  ::  f32, f64
```

Floating-point floor operations (round down to nearest integer):
- `%0x8e`: `f32.floor` - `f32` floor.
- `%0x9c`: `f64.floor` - `f64` floor.

### `$trunc-opcodes` {#trunc-opcodes}

```hoon
+$  trunc-opcodes
  $?
    %0x8f  ::  f32
    %0x9d  ::  f64
    %0xa8  ::  f32 -> i32 s
    %0xa9  ::  f32 -> i32 u
    %0xaa  ::  f64 -> i32 s
    %0xab  ::  f64 -> i32 u
    %0xae  ::  f32 -> i64 s
    %0xaf  ::  f32 -> i64 u
    %0xb0  ::  f64 -> i64 s
    %0xb1  ::  f64 -> i64 u
  ==
```

Truncation operations (remove fractional part):
- `%0x8f`: `f32.trunc` - `f32` truncate toward zero.
- `%0x9d`: `f64.trunc` - `f64` truncate toward zero.
- `%0xa8`: `i32.trunc_f32_s` - convert `f32` to signed `i32` (truncate).
- `%0xa9`: `i32.trunc_f32_u` - convert `f32` to unsigned `i32` (truncate).
- `%0xaa`: `i32.trunc_f64_s` - convert `f64` to signed `i32` (truncate).
- `%0xab`: `i32.trunc_f64_u` - convert `f64` to unsigned `i32` (truncate).
- `%0xae`: `i64.trunc_f32_s` - convert `f32` to signed `i64` (truncate).
- `%0xaf`: `i64.trunc_f32_u` - convert `f32` to unsigned `i64` (truncate).
- `%0xb0`: `i64.trunc_f64_s` - convert `f64` to signed `i64` (truncate).
- `%0xb1`: `i64.trunc_f64_u` - convert `f64` to unsigned `i64` (truncate).

### `$nearest-opcodes` {#nearest-opcodes}

```hoon
+$  nearest-opcodes   ?(%0x90 %0x9e)  ::  f32, f64
```

Floating-point nearest integer operations (round to nearest, ties to even):
- `%0x90`: `f32.nearest` - `f32` round to nearest integer.
- `%0x9e`: `f64.nearest` - `f64` round to nearest integer.

### `$sqrt-opcodes` {#sqrt-opcodes}

```hoon
+$  sqrt-opcodes      ?(%0x91 %0x9f)  ::  f32, f64
```

Floating-point square root operations:
- `%0x91`: `f32.sqrt` - `f32` square root.
- `%0x9f`: `f64.sqrt` - `f64` square root.

### `$min-opcodes` {#min-opcodes}

```hoon
+$  min-opcodes       ?(%0x96 %0xa4)  ::  f32, f64
```

Floating-point minimum operations:
- `%0x96`: `f32.min` - `f32` minimum of two values.
- `%0xa4`: `f64.min` - `f64` minimum of two values.

### `$max-opcodes` {#max-opcodes}

```hoon
+$  max-opcodes       ?(%0x97 %0xa5)  ::  f32, f64
```

Floating-point maximum operations:
- `%0x97`: `f32.max` - `f32` maximum of two values.
- `%0xa5`: `f64.max` - `f64` maximum of two values.

### `$copysign-opcodes` {#copysign-opcodes}

```hoon
+$  copysign-opcodes  ?(%0x98 %0xa6)  ::  f32, f64
```

Floating-point copy sign operations (combine magnitude of first value with sign of second):
- `%0x98`: `f32.copysign` - `f32` copy sign.
- `%0xa6`: `f64.copysign` - `f64` copy sign.

### `$extend-opcodes` {#extend-opcodes}

```hoon
+$  extend-opcodes
  $?
    %0xac  ::  i32 -> i64 s
    %0xad  ::  i32 -> i64 u
    %0xc0  ::  i8  -> i32 s
    %0xc1  ::  i16 -> i32 s
    %0xc2  ::  i8  -> i64 s
    %0xc3  ::  i16 -> i64 s
    %0xc4  ::  i32 -> i64 s  ??  same as 0xac??? (yes)
  ==
```

Integer extension operations (widen integer types):
- `%0xac`: `i64.extend_i32_s` - extend signed `i32` to `i64`.
- `%0xad`: `i64.extend_i32_u` - extend unsigned `i32` to `i64`.
- `%0xc0`: `i32.extend8_s` - extend signed `i8` to `i32`.
- `%0xc1`: `i32.extend16_s` - extend signed `i16` to `i32`.
- `%0xc2`: `i64.extend8_s` - extend signed `i8` to `i64`.
- `%0xc3`: `i64.extend16_s` - extend signed `i16` to `i64`.
- `%0xc4`: `i64.extend32_s` - extend signed `i32` to `i64` (same as `%0xac`).

### `$convert-opcodes` {#convert-opcodes}

```hoon
+$  convert-opcodes
  $?
    %0xb2  ::  i32 s -> f32
    %0xb3  ::  i32 u -> f32
    %0xb4  ::  i64 s -> f32
    %0xb5  ::  i64 u -> f32
    %0xb7  ::  i32 s -> f64
    %0xb8  ::  i32 u -> f64
    %0xb9  ::  i64 s -> f64
    %0xba  ::  i64 u -> f64
  ==
```

Type conversion operations (integer to floating-point):
- `%0xb2`: `f32.convert_i32_s` - convert signed `i32` to `f32`.
- `%0xb3`: `f32.convert_i32_u` - convert unsigned `i32` to `f32`.
- `%0xb4`: `f32.convert_i64_s` - convert signed `i64` to `f32`.
- `%0xb5`: `f32.convert_i64_u` - convert unsigned `i64` to `f32`.
- `%0xb7`: `f64.convert_i32_s` - convert signed `i32` to `f64`.
- `%0xb8`: `f64.convert_i32_u` - convert unsigned `i32` to `f64`.
- `%0xb9`: `f64.convert_i64_s` - convert signed `i64` to `f64`.
- `%0xba`: `f64.convert_i64_u` - convert unsigned `i64` to `f64`.

### `$reinterpret-opcodes` {#reinterpret-opcodes}

```hoon
+$  reinterpret-opcodes
  $?
    %0xbc  ::  f32 -> i32
    %0xbd  ::  f64 -> i64
    %0xbe  ::  i32 -> f32
    %0xbf  ::  i64 -> f64
  ==
```

Type reinterpretation operations (reinterpret bit pattern without conversion):
- `%0xbc`: `i32.reinterpret_f32` - reinterpret `f32` bits as `i32`.
- `%0xbd`: `i64.reinterpret_f64` - reinterpret `f64` bits as `i64`.
- `%0xbe`: `f32.reinterpret_i32` - reinterpret `i32` bits as `f32`.
- `%0xbf`: `f64.reinterpret_i64` - reinterpret `i64` bits as `f64`.

