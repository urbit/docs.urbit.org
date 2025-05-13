# Runes

Runes are a way to form expressions in Hoon.

## Non-Rune Expressions

### [Constants](/language/hoon/reference/rune/constants)

Hoon uses runes to form expressions, but not all expressions have runes in them. First, we have constant expressions (and also expressions that would be constant, but that they allow for interpolations).

### [Limbs and Wings](/language/hoon/reference/limbs/)

Limb and wing expressions also lack runes.

### [`+ lus` (Arms)](/language/hoon/reference/rune/lus)

Runes (digraphs) used to define arms in a core.

## Runes Proper

### [`| bar` (Cores)](/language/hoon/reference/rune/bar)

Runes used to produce cores.

### [`$ buc` (Structures)](/language/hoon/reference/rune/buc)

Runes used for defining custom types.

### [`% cen` (Calls)](/language/hoon/reference/rune/cen)

Runes used for making function calls in Hoon.

### [`: col` (Cells)](/language/hoon/reference/rune/col)

Runes used to produce cells, which are pairs of nouns.

### [`. dot` (Nock)](/language/hoon/reference/rune/dot)

Runes used for carrying out Nock operations in Hoon.

### [`/ fas` (Imports)](/language/hoon/reference/rune/fas)

Ford runes which import files.

### [`^ ket` (Casts)](/language/hoon/reference/rune/ket)

Runes that let us adjust types without violating type constraints.

### [`; mic` (Make)](/language/hoon/reference/rune/mic)

Miscellaneous useful macros.

### [`~ sig` (Hints)](/language/hoon/reference/rune/sig)

Runes that use Nock `11` to pass non-semantic info to the interpreter.

### [`= tis` (Subject Modification)](/language/hoon/reference/rune/tis)

Runes used to modify the subject.

### [`? wut` (Conditionals)](/language/hoon/reference/rune/wut)

Runes used for branching on conditionals.

### [`! zap` (wild)](/language/hoon/reference/rune/zap)

Wildcard category. Expressions that don't fit anywhere else go here.

### [`--`, `==` (Terminators)](/language/hoon/reference/rune/terminators)

Runes used to terminate expressions.
