# Cell

A **cell** is an ordered pair of [nouns](noun.md). It is a fundamental data type in both [Hoon](hoon.md) and [Nock](cell.md): a noun is either an [atom](atom.md) or a cell. Its [mold](mold.md) in Hoon is `^`, and it's formed with either square brackets like `[123 456]` or `:`-family [runes](rune.md). A cell can also be thought of as an internal node in the binary tree of a noun. It is similar to a cons-cell in Lisp.

#### Further Reading

- [`:`-family rune reference](../hoon/reference/rune/col.md): The various runes in Hoon that form cells.
