# Term

A **term** is an [atom](urbit-docs/glossary/atom) with an [aura](urbit-docs/glossary/aura) of `@tas`. It's for strings, but with a highly-restricted character set: lower-case letters, numbers, and the hyphen symbol. Additionally, the first character must be a letter. It's used mostly for naming and tagging.

Note that the aura alone doesn't restrict the characters, and if necessary should be enforced with [++sane](urbit-docs/language/hoon/reference/stdlib/4b#sane) and [++sand](urbit-docs/language/hoon/reference/stdlib/4b#sand).

### Further Reading

- [String Guide](urbit-docs/language/hoon/guides/strings)
