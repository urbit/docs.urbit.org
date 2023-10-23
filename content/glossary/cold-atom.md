+++
title = "Cold atom"

[extra]
category = "hoon-nock"

[glossaryEntry."cold atom"]
name = "cold atom"
symbol = ""
usage = "hoon-nock"
desc = "An atom whose type is an exact value rather than a general aura."

+++

A **cold atom** is an [atom](/glossary/atom) whose type is an exact
value equal to itself. This in contrast to a [warm
atom](/glossary/warm-atom), whose type is a general
[aura](/glossary/aura). Cold atoms have a `%` prefix, for example
`%foo`, `%123`, `%0xdead.beef`, etc.

### Further Reading

- [Atoms and Strings](/language/hoon/reference/rune/constants): A guide to atoms.
- [Hoon School](/courses/hoon-school/): Our guide to learning the Hoon
  programming language.
  - [“Hoon Syntax”](/courses/hoon-school/B-syntax#nouns): A Hoon School
    lesson that explains how atoms work.
