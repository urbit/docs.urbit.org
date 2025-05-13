# Cell

A **cell** is an ordered pair of [nouns](urbit-docs/glossary/noun). It is a fundamental data type in both [Hoon](urbit-docs/glossary/hoon) and [Nock](urbit-docs/glossary/cell): a noun is either an [atom](urbit-docs/glossary/atom) or a cell. Its [mold](urbit-docs/glossary/mold) in Hoon is `^`, and it's formed with either square brackets like `[123 456]` or `:`-family [runes](urbit-docs/glossary/rune). A cell can also be thought of as an internal node in the binary tree of a noun. It is similar to a cons-cell in Lisp.

#### Further Reading

- [`:`-family rune reference](urbit-docs/language/hoon/reference/rune/col): The various runes in Hoon that form cells.
