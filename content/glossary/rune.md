# Rune

**Runes** are the fundamental operators/functions in the [Hoon](hoon.md) programming language, and the building blocks of Hoon expressions. Runes are digraphs made of two ASCII special characters, for example `:-`, `!<`, `^-`, `?:`, `.^`, etc. Most runes take a fixed number of arguments (usually 1-4), or else an arbitrary number of arguments terminated with `==`. Runes are organized into 11 main families by their first character, so for example the `:`-family forms [cells](cell.md), and has variations like `:-`,`:_`, `:~`, `:^`, etc, to create different kinds of cells. Runes are composed together to create complex expressions.

### Further Reading {#further-reading}

- [Hoon School](../courses/hoon-school): Our guide to learning the Hoon programming language.
  - [“Hoon Syntax”](../courses/hoon-school/B-syntax.md#nouns): A Hoon School lesson that explains runes.
- [The Rune reference](../hoon/reference/rune): A comprehensive catalogue of the different runes and how to use them.
