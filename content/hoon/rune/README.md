---
description: "Reference documentation for Hoon's rune expressions organized by family."
layout:
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# Runes

Documentation for Hoon's rune expressions.

## Non-Rune Expressions {#non-rune-expressions}

- [Constants](constants.md) - Hoon uses runes to form expressions, but not all expressions have runes in them. First, we have constant expressions (and also expressions that would be constant, but that they allow for interpolations).
- [Limbs and Wings](../limbs) - Limb and wing expressions also lack runes.
- [`--`, `==` (Terminators)](terminators.md) - Digraphs used to terminate expressions.

## Runes Proper {#runes-proper}

- [`| bar` (Cores)](bar.md) - Produce cores.
- [`$ buc` (Structures)](buc.md) - Define custom types.
- [`% cen` (Calls)](cen.md) - Make function calls.
- [`: col` (Cells)](col.md) - Produce cells.
- [`. dot` (Nock)](dot.md) - Carry out Nock operations in Hoon.
- [`/ fas` (Imports)](fas.md) - Import files.
- [`^ ket` (Casts)](ket.md) - Adjust types without violating type constraints.
- [`+ lus` (Arms)](./lus.md) - Define arms in a core.
- [`; mic` (Make)](mic.md) - Miscellaneous useful macros.
- [`~ sig` (Hints)](sig.md) - Use Nock 11 to pass non-semantic info to the interpreter.
- [`= tis` (Subject Modification)](tis.md) - Modify the subject.
- [`? wut` (Conditionals)](wut.md) - Branch on conditionals.
- [`! zap` (wild)](zap.md) - Expressions that don't fit anywhere else go here.
