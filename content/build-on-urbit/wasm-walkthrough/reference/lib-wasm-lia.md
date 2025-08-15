## Lia Interpreter

The `/lib/wasm/lia.hoon` library implements Lia (Language for Invocation of webAssembly), a high-level scripting interface for executing WebAssembly modules within Urbit. Lia provides deterministic execution of Wasm code while maintaining performance through caching and efficient state management.

Lia handles:
- Deterministic execution of Wasm modules.
- Memory read/write operations.
- Function invocation with automatic type conversion.
- Global variable access.
- Import function handling for external calls.

## `$run-input` {#run-input}

```hoon
+$  run-input
  (each (script-raw-form (list lia-value) *) (list lia-value))
```

Input type for [`+run`](#run). Either a new script to execute or cached values from previous execution.

## `+run-once` {#run-once}

```hoon
++  run-once
  |*  [type-yield=mold type-acc=mold]
  |=  [[binary=octs imp=(import type-acc)] hint=term script-in=form:m]
  ^-  [yield:m type-acc]
  ::  ...
```

Build a stateless execution arm for a Wasm module. Takes:
- `.type-yield`: Mold for the yield type.
- `.type-acc`: Mold for the accumulator type.
- `.binary`: WebAssembly module as [`$octs`](./wasm-data-types.md#octs).
- `.imp`: Import function map.
- `.hint`: Execution hint.
- `.script-in`: Lia script to execute.

Returns the script yield and final accumulator state.

### `+init:run-once` {#init-run-once}

```hoon
++  init
  =/  m  (script ,~ type-acc)
  ^-  form:m
  |=  sat=(lia-state type-acc)
  ^-  output:m
  ::  ...
```

Initializes the Wasm module within [`+run-once`](#run-once). Handles module instantiation and processes any required imports by calling external functions.

## `+run` {#run}

```hoon
++  run
  |=  [input=run-input =seed hint=term]
  ^-  [yield:m * _seed]
  ::  ...
```

Stateful execution of a Wasm module. Can be used to run a new script or resume computation with the provided `$seed` state. 

### `+init` {#init-run}

```hoon
++  init
  =/  m  (script ,~ *)
  ^-  form:m
  |=  sat=(lia-state)
  ^-  output:m
```

Initializes the Wasm module within [`+run`](#run). Similar to [`+init`](#init-run-once) in `+run-once` but operates on the monomorphic [`$lia-state`](./lia-data-types.md#lia-state).

## `+arrows` {#arrows}

```hoon
++  arrows
  |*  m-acc=mold
  ^?  |%
  ::  ...
```

Core containing Kleisli arrows (monadic operations) for Lia script operations. Type-polymorphic over the accumulator type `.m-acc`.

### `$m-sat` {#m-sat}

```hoon
+$  m-sat  (lia-state m-acc)
```

Type alias for the polymorphic [`$lia-state`](./lia-data-types.md#lia-state) with accumulator type `.m-acc`.

### `+call` {#call}

```hoon
++  call
  |=  [name=cord args=(list @)]
  =/  m  (script (list @) m-acc)
  ^-  form:m
```

Invokes a WebAssembly function by name with the given arguments. Performs type conversion from Hoon atoms to [`$coin-wasm`](./wasm-data-types.md#coin-wasm) values and back. Handles import function resolution if the called function is not locally defined.

### `+call-1` {#call-1}

```hoon
++  call-1
  |=  [name=cord args=(list @)]
  =/  m  (script @ m-acc)
  ^-  form:m
```

Convenience function for calling WebAssembly functions that return exactly one value. Wraps [`+call`](#call) and extracts the single return value.

### `+memread` {#memread}

```hoon
++  memread
  |=  [ptr=@ len=@]
  =/  m  (script octs m-acc)
  ^-  form:m
```

Reads `.len` bytes from WebAssembly linear memory starting at address `.ptr`. Returns the data as [`$octs`](./wasm-data-types.md#octs). Performs bounds checking against the current memory size.

### `+memwrite` {#memwrite}

```hoon
++  memwrite
  |=  [ptr=@ len=@ src=@]
  =/  m  (script ,~ m-acc)
  ^-  form:m
```

Writes `.len` bytes from atom `.src` to WebAssembly linear memory starting at address `.ptr`. Performs bounds checking and fails if the write would exceed memory bounds.

### `+call-ext` {#call-ext}

```hoon
++  call-ext
  |=  [name=term args=(list lia-value)]
  =/  m  (script (list lia-value) m-acc)
  ^-  form:m
```

Calls an external (import) function. If no cached result is available, yields the function call request to the host environment. Otherwise returns the cached result.

### `+global-set` {#global-set}

```hoon
++  global-set
  |=  [name=cord value=@]
  =/  m  (script ,~ m-acc)
  ^-  form:m
```

Sets the value of an exported global variable by name. Verifies the global is mutable and performs type conversion from atom to the appropriate [`$coin-wasm`](./wasm-data-types.md#coin-wasm) type.

### `+global-get` {#global-get}

```hoon
++  global-get
  |=  name=cord
  =/  m  (script @ m-acc)
  ^-  form:m
```

Gets the value of an exported global variable by name. Returns the value as an atom, performing type conversion from [`$coin-wasm`](./wasm-data-types.md#coin-wasm).

### `+memory-size` {#memory-size}

```hoon
++  memory-size
  =/  m  (script @ m-acc)
  ^-  form:m
```

Returns the current size of WebAssembly linear memory in pages. Each page is [`+page-size`](#page-size) bytes (65,536 bytes).

### `+memory-grow` {#memory-grow}

```hoon
++  memory-grow
  |=  delta=@
  =/  m  (script @ m-acc)
  ^-  form:m
```

Grows WebAssembly linear memory by `.delta` pages. Returns the previous memory size in pages. Growing memory preserves existing data and zero-initializes the new pages.

### `+get-acc` {#get-acc}

```hoon
++  get-acc
  =/  m  (script m-acc m-acc)
  ^-  form:m
```

Returns the current accumulator value from the Lia state.

### `+set-acc` {#set-acc}

```hoon
++  set-acc
  |=  acc=m-acc
  =/  m  (script ,~ m-acc)
  ^-  form:m
```

Sets the accumulator value in the Lia state.

### `+get-all-local-globals` {#get-all-local-globals}

```hoon
++  get-all-local-globals
  =/  m  (script (list @) m-acc)
  ^-  form:m
```

Returns all local (non-import) global variable values as a list of atoms.

### `+set-all-local-globals` {#set-all-local-globals}

```hoon
++  set-all-local-globals
  |=  vals=(list @)
  =/  m  (script ,~ m-acc)
  ^-  form:m
```

Sets all local global variables from a list of atoms. Performs type conversion to the appropriate [`$coin-wasm`](./wasm-data-types.md#coin-wasm) types.

## `+runnable` {#runnable}

```hoon
++  runnable  (script (list lia-value) *)
```

Type alias for the monomorphic script type used by [`+run`](#run).

## `+cw-to-atom` {#cw-to-atom}

```hoon
++  cw-to-atom
  |=  cw=coin-wasm:wasm-sur
  ^-  @
```

Converts a [`$coin-wasm`](./wasm-data-types.md#coin-wasm) value to an atom. Fails if the coin represents a reference type.

## `+types-atoms-to-coins` {#types-atoms-to-coins}

```hoon
++  types-atoms-to-coins
  |=  [a=(list valtype:wasm-sur) b=(list @)]
  ^-  (list coin-wasm:wasm-sur)
```

Converts parallel lists of [`$valtype`s](./wasm-data-types.md#valtype) and atoms into a list of [`$coin-wasm`](./wasm-data-types.md#coin-wasm) values. Used for function argument conversion.

## `+valtype-from-coin` {#valtype-from-coin}

```hoon
++  valtype-from-coin
  |=  =cw
  ^-  valtype:wasm-sur
```

Extracts the [`$valtype`](./wasm-data-types.md#valtype) from a [`$coin-wasm`](./wasm-data-types.md#coin-wasm) value.

## `+page-size` {#page-size}

```hoon
++  page-size  ^~((bex 16))
```

WebAssembly page size constant: 65,536 bytes.

## `+yield-need` {#yield-need}

```hoon
++  yield-need
  |*  a=(script-yield *)
  ?>  ?=(%0 -.a)
  p.a
```

Extracts the payload from a successful script yield, crashing if the yield indicates failure or blocking.
