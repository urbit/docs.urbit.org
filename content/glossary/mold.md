# Mold {#mold}

**Molds** are data types in [Hoon](hoon.md). [Atom](atom.md) [auras](aura.md) like `@ud` are molds, as are more complex structures like `json`, `path`, `(list @ud)`, `(unit manx)`, `card:agent:gall`, `(map @tas (pair @t @ux))`, etc. Raw values may be type-cast to a mold, and molds can also be called as functions to coerce a value to its type (this is called "molding" or "clamming"). Molds may be create with "mold builder" functions, or with `$`-family runes.

### Further Reading {#further-reading}

- [Hoon school: types](../courses/hoon-school/E-types.md): A lesson on molds.

- [Buc (`$`) rune reference](../language/hoon/reference/rune/buc.md): Details on the runes that can create molds.
