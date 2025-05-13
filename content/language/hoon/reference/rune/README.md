# Runes

Runes are a way to form expressions in Hoon.

## Non-Rune Expressions {#non-rune-expressions}

### [Constants](constants.md) {#constantsconstantsmd}

Hoon uses runes to form expressions, but not all expressions have runes in them. First, we have constant expressions (and also expressions that would be constant, but that they allow for interpolations).

### [Limbs and Wings](../limbs) {#limbs-and-wingslimbs}

Limb and wing expressions also lack runes.

### [`+ lus` (Arms)](lus.md) {#lus-armslusmd}

Runes (digraphs) used to define arms in a core.

## Runes Proper {#runes-proper}

### [`| bar` (Cores)](bar.md) {#bar-coresbarmd}

Runes used to produce cores.

### [`$ buc` (Structures)](buc.md) {#buc-structuresbucmd}

Runes used for defining custom types.

### [`% cen` (Calls)](cen.md) {#cen-callscenmd}

Runes used for making function calls in Hoon.

### [`: col` (Cells)](col.md) {#col-cellscolmd}

Runes used to produce cells, which are pairs of nouns.

### [`. dot` (Nock)](dot.md) {#dot-nockdotmd}

Runes used for carrying out Nock operations in Hoon.

### [`/ fas` (Imports)](fas.md) {#fas-importsfasmd}

Ford runes which import files.

### [`^ ket` (Casts)](ket.md) {#ket-castsketmd}

Runes that let us adjust types without violating type constraints.

### [`; mic` (Make)](mic.md) {#mic-makemicmd}

Miscellaneous useful macros.

### [`~ sig` (Hints)](sig.md) {#sig-hintssigmd}

Runes that use Nock `11` to pass non-semantic info to the interpreter.

### [`= tis` (Subject Modification)](tis.md) {#tis-subject-modificationtismd}

Runes used to modify the subject.

### [`? wut` (Conditionals)](wut.md) {#wut-conditionalswutmd}

Runes used for branching on conditionals.

### [`! zap` (wild)](zap.md) {#zap-wildzapmd}

Wildcard category. Expressions that don't fit anywhere else go here.

### [`--`, `==` (Terminators)](terminators.md) {#terminatorsterminatorsmd}

Runes used to terminate expressions.
