# UrWASM Examples

foobar examples

* What usage patterns are possible with UrWASM?
  * WASM modules as libraries
    * In generators
      * [cookbook.md](https://gist.github.com/Quodss/a7dca761f6bcd887241bdc04db2c026a)
        * Stateless UrWASM: `+run-once`
          * Tutorial: sort a list of 64-bit atoms
    * In threads
      * [cookbook.md](https://gist.github.com/Quodss/a7dca761f6bcd887241bdc04db2c026a)
        * Stateful UrWASM: `+run`
          * Example: running Wasm in a thread
    * In Gall agents
      * You could do a Gall agent that tracks its state in the agent but delegates functionality to a JS library
  * WASM calls as "userspace jets"
    * I don’t think there’s an existing example for this
    * Glicko-2 in JS or Python might be nice
      * Would require finishing a Glicko-2 %telos which would be a pretty big job
