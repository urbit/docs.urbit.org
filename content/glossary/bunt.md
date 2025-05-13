# Bunt

In [Hoon](/glossary/hoon), **bunting** a [mold](/glossary/mold) produces its default/example value (or "bunt value"). For example, the bunt of a null-terminated `list` is `~` (null, an empty list). The bunt of `@ud` (an unsigned decimal) is `0`. Bunting is done with the kettar [rune](/glossary/rune) (`^*`), or more commonly its irregular form: a `*` prefix like `*@ud`, `*(list @t)`, etc.

#### Further reading

- [Kettar rune reference](/language/hoon/reference/rune/ket#-kettar): Details of the kettar rune.
- [Hoon School: Molds lesson](/userspace/threads/tutorials/basics/input#bowl): This lesson discusses bunt values.
