# Runes

Documentation for Hoon's rune expressions.

## Non-Rune Expressions {#non-rune-expressions}

- [Constants](constants.md) - Hoon uses runes to form expressions, but not all expressions have runes in them. First, we have constant expressions (and also expressions that would be constant, but that they allow for interpolations).
- [Limbs and Wings](../limbs) - Limb and wing expressions also lack runes.
- [`+ lus` (Arms)](./lus.md) - Digraphs used to define arms in a core.
- [`--`, `==` (Terminators)](terminators.md) - Digraphs used to terminate expressions.

## Runes Proper {#runes-proper}

- [`| bar` (Cores)](bar.md) - Runes used to produce cores.
- [`$ buc` (Structures)](buc.md) - Runes used for defining custom types.
- [`% cen` (Calls)](cen.md) - Runes used for making function calls in Hoon.
- [`: col` (Cells)](col.md) - Runes used to produce cells, which are pairs of nouns.
- [`. dot` (Nock)](dot.md) - Runes used for carrying out Nock operations in Hoon.
- [`/ fas` (Imports)](fas.md) - Ford runes which import files.
- [`^ ket` (Casts)](ket.md) - Runes that let us adjust types without violating type constraints.
- [`; mic` (Make)](mic.md) - Miscellaneous useful macros.
- [`~ sig` (Hints)](sig.md) - Runes that use Nock `11` to pass non-semantic info to the interpreter.
- [`= tis` (Subject Modification)](tis.md) - Runes used to modify the subject.
- [`? wut` (Conditionals)](wut.md) - Runes used for branching on conditionals.
- [`! zap` (wild)](zap.md) - Wildcard category. Expressions that don't fit anywhere else go here.
