# Path

A **path** is a data type in [Hoon](hoon). It is a [list](list) of `@ta` text strings, and its syntax looks like `/foo/bar/baz`. This type resembles a file path and while it *is* used for file paths in [Clay](clay) (the filesystem [vane](vane)), it's a more general type and is used in other cases as well, such as subscription paths and [wires](wire).
