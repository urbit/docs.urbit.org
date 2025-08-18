---
description: "Types for Wasm code in its executable form"
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

# Wasm Interpreter Data Types

UrWasm's `+engine-sur` types represent Wasm modules in their executable form. While `+wasm-sur` implements the WebAssembly Core Specification, `+engine-sur` provides the runtime representation needed for execution, with some optimizations.

### `+engine-sur` {#engine-sur}

```hoon
++  engine-sur
  =,  wasm-sur
  |%
  ::  ...
::  ...
```

Wrapper arm around the engine types, making them addressable by limb resolution paths like `module:engine-sur`. Also exposes the `+wasm-sur` namespace so it can refer to types like `$type-section` directly.

### `$module` {#module}

```hoon
+$  module
  $:
    =type-section
  ::
    =import-section      ::  Changed
    =function-section    ::  Changed to include code
  ::
    =table-section
    =memory-section
    =global-section
    =export-section
    =start-section
    =elem-section
    :: =datacnt-section  ::  Removed
    :: =code-section     ::  Code moved to function section
    =data-section
  ==
```

Wasm [`$module`](./wasm-data-types.md#module) as seen by the engine. Some sections have been removed or modified for efficiency:
- [`$code-section](./wasm-data-types.md#code-section) is merged into the function section.
- [`$datacnt-section](./wasm-data-types.md#datacnt-section) is removed as it's not needed during execution.
- [`$import-section](./wasm-data-types.md#import-section) is restructured for runtime resolution.

### `$function` {#function}

```hoon
+$  function
  $:  type-id=@
      locals=(list valtype)
      =expression
  ==
```

This includes both the function signature and its implementation merged together:
- `.type-id`: Index into the [`$type-section`](./wasm-data-types.md#type-section) for this function's signature.
- `.locals`: Local variables for this function.
- [`.expression`](./wasm-data-types.md#expression): The function body as a sequence of [`$instruction`s](./wasm-data-types.md#instruction).

### `$function-section` {#function-section}

```hoon
+$  function-section
  (list function)
```

List of [`$function`s](#function) in the [`$module`](#module).

### `$import-section` {#import-section}

```hoon
+$  import-section
  $:
    funcs=(list [[mod=cord name=cord] type-id=@])
    tables=(list [[mod=cord name=cord] t=table])
    memos=(list [[mod=cord name=cord] l=limits])
    globs=(list [[mod=cord name=cord] v=valtype m=?(%con %var)])
  ==
```

Restructured import section organized by import type for efficient runtime resolution:
- `.funcs`: Imported functions with module name, export name, and type signature by index.
- `.tables`: Imported [`$table`s](./wasm-data-types.md#table) with their specifications.
- `.memos`: Imported memories with size [`$limits`](./wasm-data-types.md#limits).
- `.globs`: Imported global variables with [value type](./wasm-data-types.md#valtype) and mutability.

### `$store` {#store}

```hoon
+$  store
  $:  =shop                                    ::  resolved imports
      =module                                  ::  engine representation of module
      mem=(unit [buffer=@ n-pages=@])          ::  single membuffer
      tables=(list (list $>(%ref coin-wasm)))  ::  tables
      globals=(list coin-wasm)
  ==
```

Complete module store containing:
- `.shop`: Resolved import dependencies (see [`$shop`](#shop)).
- `.module`: The engine's [`$module`](#module).
- `.mem`: Optional memory buffer with page count.
- `.tables`: Table instances containing function references.
- `.globals`: Global variable values.

### `$local-state` {#local-state}

```hoon
+$  local-state  [=stack locals=(list val) =store]
```

Execution state for a function call:
- `.stack`: Current execution stack (see [`$stack`](#stack)).
- `.locals`: Local variable values for current function.
- `.store`: Module store containing all persistent state.

### `$stack` {#stack}

```hoon
+$  stack  [br=branch va=(pole val)]
```

Execution stack with:
- `.br`: Current branch state for control flow (see [`$branch`](#branch)).
- `.va`: Stack of values.

### `$val` {#val}

```hoon
+$  val
  $~  `@`0
  $@  @               ::  numerical value
  $>(%ref coin-wasm)  ::  reference
```

Runtime value on the stack, which can be either:
- A raw atom.
- A typed reference.

### `$branch` {#branch}

```hoon
+$  branch
  $~  ~
  $@  ~
  $%  [%retr ~]    ::  return to the caller
      [%targ i=@]  ::  targeted block
      [%trap ~]    ::  deterministic crash
  ::
      $:  %bloq    ::  blocked on import request
          [[mod=cord name=cord] =request]
          =module
          mem=(unit [buffer=@ n-pages=@])          ::  single membuffer
          tables=(list (list $>(%ref coin-wasm)))  ::  tables
          globals=(list coin-wasm)
  ==  ==
```

Branch state for control flow management:
- `~`: Normal execution (no branch pending).
- `%retr`: Return to caller function.
- `%targ`: Branch to specific block label `.i`.
- `%trap`: Execution trapped (deterministic crash).
- `%bloq`: Blocked waiting for import resolution, containing the [`$request`](#request) details and current execution state.

### `$result` {#result}

```hoon
+$  result
  $%
    [%0 out=(list coin-wasm) st=store]             ::  success
  ::
    $:  %1                                         ::  block
        [[mod=cord name=cord] =request]          ::  /module/name, request
        =module
        mem=(unit [buffer=@ n-pages=@])
        tables=(list (list $>(%ref coin-wasm)))
        globals=(list coin-wasm)
    ==
  ::
    [%2 st=store]                                  ::  trap, crash
  ==
```

Result of module instantiation or function invocation:
- `%0`: Successful execution with output values and updated [`$store`](#store).
- `%1`: Blocked on import [`$request`](#request), containing request details and current state for resumption.
- `%2`: Crashed with final `$store` state.

### `$request` {#request}

```hoon
+$  request
  $%
    [%func args=(list coin-wasm)]  ::  typed values for the call
  ::
    $:  %tabl
        args=(list coin-wasm)
        $=  instr
        $~  [%table-size `@`0]
        $>
          $?  %call-indirect  %table-get
              %table-set      %table-init
              %table-copy     %table-grow
              %table-size     %table-fill
          ==
        instr-short
    ==
  ::
    $:  %memo
        args=(list coin-wasm)
        $=  instr
        $~  [%memory-size %0]
        $?  $>  $?  %load         %store
                    %memory-size  %memory-grow
                    %memory-init  %memory-copy
                    %memory-fill
                ==
            instr-short
        ::
            $:  %vec
                $>  $?  %load   %load-lane
                        %store  %store-lane
                    ==
                instr-vec
        ==  ==  ==
  ::
    $:  %glob
        args=(list coin-wasm)
        $=  instr
        $~  [%global-get `@`0]
        $>(?(%global-get %global-set) instr-short)
    ==
  ==
```

Import request types:
- `%func`: Function call with typed argument values.
- `%tabl`: Table operation with arguments and specific table instruction.
- `%memo`: Memory operation, including vector operations and standard memory instructions.
- `%glob`: Global variable.

### `$shop` {#shop}

```hoon
+$  shop  (list item)
```

List of resolved import [`$item`s](#item) representing available external dependencies.

### `$item` {#item}

```hoon
+$  item
  %+  pair  (list coin-wasm)
  $:  =module
      mem=(unit [buffer=@ n-pages=@])          ::  single membuffer
      tables=(list (list $>(%ref coin-wasm)))  ::  tables
      globals=(list coin-wasm)
  ==
```

Resolved import item containing:
- A list of values to push onto the stack when this import is invoked.
- Complete module state including memory, tables, and globals that this import provides access to.
