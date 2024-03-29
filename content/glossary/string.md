+++
title = "String"

[extra]
category = "hoon-nock"

[glossaryEntry.string]
name = "string"
symbol = ""
usage = "hoon-nock"
desc = "A string is a general term for a piece of text. Cords and tapes are the two main types in Hoon."

+++

**String** is the general programming term for a piece of text. In Hoon, there
are two main kinds of strings: [cords](/glossary/cord) and
[tapes](/glossary/tape). A `cord` (and its sub-sets `knot` and `term`)
is UTF-8 text in a single [atom](/glossary/atom). A `tape` is a
[list](/glossary/list) of single UTF-8 characters.

#### Further Reading

- [Strings guide](/language/hoon/guides/strings): A guide to strings in Hoon.
