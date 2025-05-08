+++
title = "Path"

[extra]
category = "hoon-nock"

[glossaryEntry.path]
name = "path"
symbol = ""
usage = "hoon-nock"
desc = "A data type in Hoon that resembles a file path and is a list of @ta text strings."

+++

A **path** is a data type in [Hoon](/glossary/hoon). It is a [list](/glossary/list) of `@ta` text strings, and its syntax looks like `/foo/bar/baz`. This type resembles a file path and while it *is* used for file paths in [Clay](/glossary/clay) (the filesystem [vane](/glossary/vane)), it's a more general type and is used in other cases as well, such as subscription paths and [wires](/glossary/wire).
