# Axis

An **axis** is a numerical tree address for a particular location in a [noun](urbit-docs/glossary/noun).

For the noun `[a b c]`, the axes are as follow:

- `1`: `[a b c]` (the whole noun).
- `2`: `a`
- `3`: `[b c]`
- `6`: `b`
- `7`: `c`

You can address things by axis with lus and a number, like `+7` for `c`, `+3` for `[b c]`, etc. This is an alternative to [lark](urbit-docs/glossary/lark) syntax.

#### Further Reading

- [Hoon School section 6: Trees](urbit-docs/courses/hoon-school/G-trees)
- [Standard Library 1b: Tree Addressing](urbit-docs/language/hoon/reference/stdlib/1b)
