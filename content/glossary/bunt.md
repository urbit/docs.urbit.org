# Bunt {#bunt}

In [Hoon](hoon.md), **bunting** a [mold](mold.md) produces its default/example value (or "bunt value"). For example, the bunt of a null-terminated `list` is `~` (null, an empty list). The bunt of `@ud` (an unsigned decimal) is `0`. Bunting is done with the kettar [rune](rune.md) (`^*`), or more commonly its irregular form: a `*` prefix like `*@ud`, `*(list @t)`, etc.

#### Further reading {#further-reading}

- [Kettar rune reference](../language/hoon/reference/rune/ket.md#-kettar): Details of the kettar rune.
- [Hoon School: Molds lesson](../userspace/threads/tutorials/basics/input.md#bowl): This lesson discusses bunt values.
