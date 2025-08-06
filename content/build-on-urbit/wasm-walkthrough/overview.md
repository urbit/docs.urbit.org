# UrWASM Overview

### Why
* The point of UrWASM is to compensate for deficiencies in the system, so that Hoon devs can…
  * Do stuff like userspace jets for stuff that’s criminally slow in Hoon (fuzzy-find, userpsace jets, Glicko-2, etc.)
  * Leverage existing JS and Rust libraries for functionality that doesn’t exist in Hoon (encryption, ripgrep, etc.)

### How
* Why didn’t Urbit do this already?
* How did we solve the problems?
  * UrWASM
    * [urwasm.md](https://gist.github.com/Quodss/a1aaa81941e61707843a75d45d901ea0)
      * Introduction
    * [cookbook.md](https://gist.github.com/Quodss/a7dca761f6bcd887241bdc04db2c026a)
      * WebAssembly primer
      * UrWASM core structure
  * Determinism solved by Lia
    * [urwasm-jetting.md](https://gist.github.com/Quodss/196a4deb3e24a652c021469d2c4544fb)
      * Jetting
      * Motivation
        * Bespoke WASM interpreter that operates on nouns
        * Serializer / deserializer in the jet
        * Serializer / deserializer in the Hoon spec
        * Higher level interpreting function
      * Lia interpreter
