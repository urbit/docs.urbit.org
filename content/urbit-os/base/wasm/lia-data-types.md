---
description: "Data types for Lia, Urbit's deterministic Wasm interpreter"
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

# Lia Data Types

The `+lia-sur` core builds on top of `+wasm-sur` and `+engine-sur` to define Lia's monadic, deterministic approach to making Wasm function calls and handling their results.

### `+lia-sur` {#lia-sur}

```hoon
++  lia-sur
  =,  wasm-sur
  =,  engine-sur
  |%
  ::  ...
::  ...
```

Wrapper arm around the Lia core, making its arms and types addressable by limb resolution paths like `lia-value:lia-sur`. Also exposes the `+wasm-sur` and `+engine-sur` namespaces so this core can access the underlying Wasm types.

### `+lia-value` {#lia-value}

```hoon
++  lia-value
  $~  [%i32 0]
  $%  [%octs octs]
      $<(%ref coin-wasm)
  ==
```

Lia value type. Can be:
- 32-bit integer `0`.
- `%octs`: Byte data with length and content (see [`$octs`](./wasm-data-types.md#octs)).
- Any [`$coin-wasm`](./wasm-data-types.md#coin-wasm) except references. That leaves integers, floats, vectors, and binary data.

### `+import` {#import}

```hoon
++  import
  |$  [acc]
  %+  pair  acc
  %+  map  (pair cord cord)
  $-  (list coin-wasm)
  (script-raw-form (list coin-wasm) acc)
```

Wasm module import.

Pair of the given `$acc` accumulator type with a map of imports to functions. Each `(pair cord cord)` key in the map is a cell of \[module-name export-name]. Each value in the map is a gate that takes a list of [`$coin-wasm`](./wasm-data-types.md#coin-wasm) arguments and returns the script.

### `+lia-state` {#lia-state}

```hoon
++  lia-state
  |$  [acc]
  (trel store (list (list lia-value)) (import acc))
```

Execution state for a Lia script, returning a tuple of:
- [`$store`](./wasm-interpreter-data-types.md#store): Wasm module state.
- Stack of [`+lia-value`s](#lia-value) representing the current script state.
- [`+import`](#import): Available import functions and their implementations.

### `+script-yield` {#script-yield}

```hoon
++  script-yield
  |$  [a]
  $%  [%0 p=a]
      [%1 name=term args=(list lia-value)]
      [%2 ~]
  ==
```

Result of executing a Lia script step:
- `%0`: Step completed with result of type `$a`.
- `%1`: Step blocked on external call to function `.name`, with the provided list of `.args` from the previous step.
- `%2`: Step crashed or errored.

### `+script-result` {#script-result}

```hoon
++  script-result
  |$  [m-yil m-acc]
  [(script-yield m-yil) (lia-state m-acc)]
```

Mold for the complete result of script execution including:
- [`$script-yield`](#script-yield) with the execution outcome.
- [`$lia-state`](#lia-state) with updated state.

### `+script-raw-form` {#script-raw-form}

```hoon
++  script-raw-form
  |*  [yil=mold acc=mold]
  $-((lia-state acc) (script-result yil acc))
```

Raw form of a Lia script: a gate that takes a [`$lia-state`](#lia-state) and produces a [`$script-result`](#script-result). This represents a stateful computation in the Lia monad.

### `+script` {#script}

```hoon
++  script
  |*  [m-yil=mold m-acc=mold]
  |%
  ::  +output
  ::  +yield
  ::  +form
  ::  +m-sat
  ::  +return
  ::  +try
  ::  +catch
  --
```

Monadic interface for Lia scripts with yield mold `.m-yil` and accumulator mold `.m-acc`.

#### `+output` {#output}

```hoon
++  output  (script-result m-yil m-acc)
```

Final `$script-result` of this script.

#### `+yield` {#yield}

```hoon
++  yield  (script-yield m-yil)
```

Final `$script-yield` of this script.

#### `+form` {#form}

```hoon
++  form  (script-raw-form m-yil m-acc)
```

Built script mold, analogous to `+form:m` from thread [strands](../../../urbit-os/base/threads/basics/fundamentals.md#strands).

#### `+m-sat` {#m-sat}

```hoon
++  m-sat  (lia-state m-acc)
```

Execution state for this script with the provided `.m-acc`.

#### `+return` {#return}

```hoon
++  return  ::  pure
  |=  arg=m-yil
  ^-  form
  |=  s=m-sat
  [0+arg s]
```

Monadic (pure) return: lifts a value into the Lia monad without changing script state.

#### `+try` {#try}

```hoon
++  try  ::  monadic bind
  |*  m-mond=mold
  |=  [mond=(script-raw-form m-mond m-acc) cont=$-(m-mond form)]
  ^-  form
  |=  s=m-sat
  =^  mond-yil=(script-yield m-mond)  s  (mond s)
  ^-  output
  ?.  ?=(%0 -.mond-yil)  [mond-yil s]
  ((cont p.mond-yil) s)
```

Monadic bind: sequences two computations, passing the result of the first to the second if successful (`%0`). Handles early termination for blocked (`%1`) or crashed (`%2`) states.

#### `+catch` {#catch}

```hoon
++  catch  ::  bind either
  |*  m-mond=mold
  |=  $:  $:  try=(script-raw-form m-mond m-acc)
              err=(script-raw-form m-mond m-acc)
          ==
          cont=$-(m-mond form)
      ==
  ^-  form
  |=  s=m-sat
  =^  try-yil=(script-yield m-mond)  s  (try s)
  ^-  output
  ?:  ?=(%0 -.try-yil)
    ((cont p.try-yil) s)
  ?:  ?=(%1 -.try-yil)
    [try-yil s]
  =^  err-yil  s  (err s)
  ?.  ?=(%0 -.err-yil)  [err-yil s]
  ((cont p.err-yil) s)
```

Error handling combinator: attempts the first computation, and if it crashes (`%2`), tries the error handler. Blocked states (`%1`) are propagated immediately.

### `$seed` {#seed}

```hoon
+$  seed
  $:
    module=octs
    past=(script-raw-form (list lia-value) *)
    shop=(list (list lia-value))
    import=(import *)
  ==
```

Complete Lia interpreter state containing all necessary components for module execution:
- `.module`: Wasm module binary data.
- `.past`: Previously executed script that established the current state.
- `.shop`: External results accumulator - lists of values from resolved import function calls.
- `.import`: Map of available import functions that the module can call.

This represents the "formal state" of the Lia interpreter, suitable for caching and resuming if necessary.

