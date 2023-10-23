+++
title = "Cell"

[extra]
category = "hoon-nock"

[glossaryEntry.cell]
name = "cell"
symbol = ""
usage = "hoon-nock"
desc = "An ordered pair of nouns in Hoon and Nock."

+++

A **cell** is an ordered pair of [nouns](/glossary/noun). It is a
fundamental data type in both [Hoon](/glossary/hoon) and
[Nock](/glossary/cell): a noun is either an
[atom](/glossary/atom) or a cell. Its [mold](/glossary/mold)
in Hoon is `^`, and it's formed with either square brackets like `[123 456]` or
`:`-family [runes](/glossary/rune). A cell can also be thought of as
an internal node in the binary tree of a noun. It is similar to a cons-cell in
Lisp.

#### Further Reading

- [`:`-family rune reference](/language/hoon/reference/rune/col): The various runes in
  Hoon that form cells.
