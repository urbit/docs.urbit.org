+++
title = "Dry Gate"

[extra]
category = "hoon-nock"

[glossaryEntry."dry gate"]
name = "dry gate"
symbol = ""
usage = "hoon-nock"
desc = "A gate that only accepts an argument of the type it specified."

+++

A **dry gate** is a [gate](/glossary/gate) that only accepts an
argument of the type it explicitly specified. This is in contrast to a [wet
gate](/glossary/wet-gate), which can accept arguments of different
types and transparently pass them through. The typical
[rune](/glossary/rune) for a dry gate is `|=`.

### Further Reading

- [Hoon School: Metals lesson](/courses/hoon-school/R-metals): This lesson covers
  dry and wet gates.
