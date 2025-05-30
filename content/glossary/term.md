# Term

A **term** is an [atom](atom.md) with an [aura](aura.md) of `@tas`. It's for strings, but with a highly-restricted character set: lower-case letters, numbers, and the hyphen symbol. Additionally, the first character must be a letter. It's used mostly for naming and tagging.

Note that the aura alone doesn't restrict the characters, and if necessary should be enforced with [++sane](../hoon/reference/stdlib/4b.md#sane) and [++sand](../hoon/reference/stdlib/4b.md#sand).

### Further Reading {#further-reading}

- [String Guide](../hoon/guides/strings.md)
