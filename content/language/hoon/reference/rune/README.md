# Runes

Runes are a way to form expressions in Hoon.

## Non-Rune Expressions

### [Constants](constants)

Hoon uses runes to form expressions, but not all expressions have runes in them. First, we have constant expressions (and also expressions that would be constant, but that they allow for interpolations).

### [Limbs and Wings](../limbs)

Limb and wing expressions also lack runes.

### [`+ lus` (Arms)](lus)

Runes (digraphs) used to define arms in a core.

## Runes Proper

### [`| bar` (Cores)](bar)

Runes used to produce cores.

### [`$ buc` (Structures)](buc)

Runes used for defining custom types.

### [`% cen` (Calls)](cen)

Runes used for making function calls in Hoon.

### [`: col` (Cells)](col)

Runes used to produce cells, which are pairs of nouns.

### [`. dot` (Nock)](dot)

Runes used for carrying out Nock operations in Hoon.

### [`/ fas` (Imports)](fas)

Ford runes which import files.

### [`^ ket` (Casts)](ket)

Runes that let us adjust types without violating type constraints.

### [`; mic` (Make)](mic)

Miscellaneous useful macros.

### [`~ sig` (Hints)](sig)

Runes that use Nock `11` to pass non-semantic info to the interpreter.

### [`= tis` (Subject Modification)](tis)

Runes used to modify the subject.

### [`? wut` (Conditionals)](wut)

Runes used for branching on conditionals.

### [`! zap` (wild)](zap)

Wildcard category. Expressions that don't fit anywhere else go here.

### [`--`, `==` (Terminators)](terminators)

Runes used to terminate expressions.
