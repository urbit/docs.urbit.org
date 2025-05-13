# Path

A **path** is a data type in [Hoon](hoon.md). It is a [list](list.md) of `@ta` text strings, and its syntax looks like `/foo/bar/baz`. This type resembles a file path and while it *is* used for file paths in [Clay](clay.md) (the filesystem [vane](vane.md)), it's a more general type and is used in other cases as well, such as subscription paths and [wires](wire.md).
