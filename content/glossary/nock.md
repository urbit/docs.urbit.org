# Nock

**Nock** is a purely functional typeless programming language and acts as Urbit's lowest-level language. To be more precise, it is a minimalist Turing complete [combinator calculus](https://en.wikipedia.org/wiki/Combinatory_logic). Nock can be thought of as the assembly-level language specification for Urbit. Nock is evaluated by the runtime system [Vere](vere.md).

The only basic data type in Nock is the [atom](atom.md), which is a non-negative integer. Computation in Nock occurs through the use of [nouns](noun.md) (e.g. binary trees whose leaves are atoms) utilized in three different manners: formulas, subjects, and products. A _formula_ is a noun utilized as a function that takes in a noun, its _subject_, and returns a noun, its _product_.

Code written in [Hoon](hoon.md) is compiled to Nock, though it is unnecessary to learn Nock to write code in Hoon.

### Further Reading {#further-reading}

- [The Nock Tutorial](../nock): An-in depth technical guide.
