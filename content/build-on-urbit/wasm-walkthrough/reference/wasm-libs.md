# UrWASM Library Reference

nested core structure

/lib/wasm/parser/hoon           ::  Wasm parser
/lib/wasm/validator/hoon        ::  Wasm validator
/lib/wasm/runner/op-def/hoon    ::  Wasm operator definitions
/lib/wasm/runner/engine/hoon    ::  Wasm interpreter
/lib/wasm/lia/hoon              ::  Lia interpreter

foobar

  * Stateless UrWASM: `+run-once`
  * Stateful UrWASM: `+run`

***

## /lib/wasm/runner/engine

++  engine
  ++  get-types
  ++  mint
  ++  make-export-map
  ++  find-func-id
  ++  conv
    ++  import-upd
  ++  prep
  ++  instantiate
    ++  init-globals
    ++  init-table
    ++  init-elems
    ++  init-mem
    ++  init-data
    ++  start
  ++  wasm-need
  ++  wasm-bind
  ++  invoke
  ++  invoke-id
  ++  call
  ++  eval
  ++  dec-br
  ++  apply


## /lib/wasm/runner/op-def

++  op-def
  ++  mayb
  ++  sure
  ++  torn
  ++  lane-size
  ++  fuse                        ::  from \~paldev
  ++  chap
  ++  page-size  ^\~((bex 16))
  ++  place
  ++  lim-min
  ++  lim-max
  ++  lte-lim
  ++  change
  ++  to-si
  ++  en-si
  ++  sat
  ++  coin-to-val
  ++  val-to-coin
  ++  snug
  ++  shot
  ++  buy
  ++  grab
    ++  func
    ++  table
    ++  memo
    ++  glob
  ++  mem-store
  ++  mem-load
  ++  kind
  ++  fetch-gate
  ++  fetch
    ++  dbug
      ++  print-tee
    ++  select
    ++  null
      ++  unreachable
      ++  nop  |=(local-state +<)
      ++  return
      ++  drop
    ++  ref
      ++  ref-null
      ++  ref-is-null
      ++  ref-func
    ++  load
    ++  store
    ++  const
    ++  get
    ++  set
    ++  branch
    ++  table
      ++  table-get
      ++  table-set
      ++  table-init
      ++  elem-drop
      ++  table-copy
      ++  table-grow
      ++  table-size
      ++  table-fill
    ++  memo
      ++  memory-size
      ++  memory-grow
      ++  memory-init
      ++  data-drop
      ++  memory-copy
      ++  memory-fill
    ++  unar
      ++  clz
      ++  ctz
      ++  popcnt
      ++  abs
      ++  neg
      ++  sqrt
      ++  ceil
      ++  floor
      ++  trunc
      ++  nearest
      ++  eqz
      ++  wrap
      ++  extend
      ++  convert
      ++  demote
      ++  promote
      ++  reinterpret
    ++  bina
      ++  add
      ++  sub
      ++  mul
      ++  div
      ++  rem
      ++  and
      ++  or
      ++  xor
      ++  shl
      ++  shr
      ++  rotl
      ++  rotr
      ++  min
      ++  max
      ++  copysign
      ++  eq
      ++  ne
      ++  lt
      ++  gt
      ++  le
      ++  ge
  ++  simd
    ++  rope
    ++  fetch-vec
    ++  load
    ++  load-lane
    ++  store
    ++  store-lane
    ++  const
    ++  shuffle
    ++  extract
    ++  replace
    ++  plain
      ++  kind
      ++  vec-unar
      ++  vec-bina
      ++  get-op-unar
      ++  get-op-bina
      ++  get-size

## /lib/wasm/lia

++  run-once
  ++  init
++  run
  ++  init

++  arrows
* [cookbook.md](https://gist.github.com/Quodss/a7dca761f6bcd887241bdc04db2c026a)
  ++  m-sat  (lia-state m-acc)
  ++  call
  ++  call-1
  ++  memread
  ++  memwrite
  ++  call-ext
  ++  global-set
  ++  global-get
  ++  memory-size
  ++  memory-grow  ::  returns old size in pages
  ++  get-acc
  ++  set-acc
  ++  get-all-local-globals
  ++  set-all-local-globals

++  runnable  (script (list lia-value) *)
++  cw-to-atom
++  types-atoms-to-coins
++  valtype-from-coin
++  page-size  ^\~((bex 16))
++  yield-need

## /lib/wasm/parser

++  parser
  ++  main
  ++  r
    ++  womp
    ++  bild
    ++  bonk
    ++  feel
    ++  u-n
    ++  s-n
    ++  u32  (u-n 32)
    ++  u64  (u-n 64)
    ++  f32
    ++  f64
    ++  vec
    ++  name     (cook crip (vec next))
    ++  vec-u32  (vec u32)
    ++  num-type
    ++  vec-type  (cold %v128 (just '\7b'))
    ++  ref-type
    ++  valtype
    ++  func-type
    ++  limits
    ++  expr
    ++  expr-pair
    ++  end        (just '\0b')
    ++  else       (just '\05')
    ++  const-i32  (just '\41')
    ++  const-i64  (just '\42')
    ++  const-f32  (just '\43')
    ++  const-f64  (just '\44')
    ++  block-op   (just '\02')
    ++  loop-op    (just '\03')
    ++  if-op      (just '\04')
    ++  form-ranges
    ++  instr
    ++  select-vec
    ++  br-table
    ++  instr-zero  (sear op-map next)
    ++  block
    ++  loop
    ++  if
    ++  block-type
    ++  handle-one-arg-i32
    ++  handle-two-args-i32
    ++  handle-br-table
    ++  handle-block
    ++  get-valtype
    ++  handle-loop
    ++  handle-if
    ++  handle-const-f64
    ++  handle-const-f32
    ++  handle-const-i32
    ++  handle-const-i64
    ++  fc
      ++  zero-args  (sear handle-zero u32)
      ++  one-arg    (sear handle-one ;\~(plug u32 u32))
      ++  two-args   (sear handle-two ;\~(plug u32 u32 u32))
      ++  handle-zero
      ++  handle-one
      ++  handle-two
    ++  fd
      ++  memarg
      ++  mem-lane
      ++  const
      ++  shuffle
      ++  lane
    ++  type-section
    ++  import-section
    ++  import
    ++  import-desc
    ++  import-func  ;\~(plug (cold %func (just '\00')) u32)
    ++  import-tabl  ;\~(plug (cold %tabl (just '\01')) ref-type limits)
    ++  import-memo  ;\~(plug (cold %memo (just '\02')) limits)
    ++  import-glob
    ++  con-var
    ++  function-section
    ++  table-section
    ++  table  ;\~(plug ref-type limits)
    ++  memory-section
    ++  global-section
    ++  global
    ++  const-expr  ;\~(sfix const-instr end)  ::  single instruction
    ++  const-instr
    ++  export-section
    ++  export
    ++  start-section
    ++  elem-section
    ++  elem
    ++  elem-kind  (just '\00')
    ++  elem-0
    ++  elem-1
    ++  elem-2
    ++  elem-3
    ++  elem-4
    ++  elem-5
    ++  elem-6
    ++  elem-7
    ++  handle-elem-0
    ++  handle-elem-1
    ++  handle-elem-2
    ++  handle-elem-3
    ++  handle-elem-4
    ++  handle-elem-5
    ++  handle-elem-6
    ++  handle-elem-7
    ++  code-section
    ++  code  (bonk (vec next) ;\~(pfix u32 func))
    ++  func
    ++  locals  ;\~(plug u32 valtype)
    ++  handle-locals
    ++  data-section
    ++  data
    ++  to-octs
    ++  datacnt-section
    ++  module
    ++  module-contents
    ++  check
    ++  customs
    ++  magic  (jest '\00asm')
    ++  version
  ++  op-map
  ++  simd-map
    ++  nearest
    ++  sqrt
    ++  div
    ++  pmin
    ++  pmax
    ++  avgr
    ++  ceil
    ++  floor
    ++  all-true
    ++  bitmask
    ++  narrow
    ++  shl
    ++  extadd
    ++  convert
    ++  mul
    ++  splat
    ++  eq
    ++  ne
    ++  abs
    ++  neg
    ++  trunc
    ++  lt
    ++  gt
    ++  le
    ++  ge
    ++  shr
    ++  min
    ++  max
    ++  add
    ++  sub
    ++  extend
    ++  extmul


## /lib/wasm/validator

++  validator
  ++  output
  ++  result-form
  ++  result
    ++  bind
  ++  snug
  ++  validate-module
  ++  v-import-section
  ++  validate-limits
  ++  v-function-section
  ++  v-table-section
  ++  v-memory-section
  ++  v-global-section
  ++  v-export-section
  ++  v-start-section
  ++  v-elem-section
  ++  v-datacnt-section
  ++  v-code-section
  ++  v-data-section
  ++  validate-code
  ++  validate-expr
  ++  validate-instr
  ++  get-type
  ++  get-type-vec
  ++  from-coin
  ++  byte-width
  ++  dim-lane
  ++  unpack
