
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
