+++
title = "Warm atom"

[extra]
category = "hoon-nock"

[glossaryEntry."warm atom"]
name = "warm atom"
symbol = ""
usage = "hoon-nock"
desc = "An atom with an ordinary aura."

+++

A **warm atom** is an [atom](/glossary/atom) with an ordinary [aura](/glossary/aura). The type of a warm atom is, conceptually, the set of all possible values for that aura. For example, the [cord](/glossary/cord) `'foo'` nests under the type of the cord `'bar'` - they both have `@t` auras. This is in contrast to a [cold atom](/glossary/cold-atom), where its type is an exact value.

### Further Reading

- [Atoms and Strings](/language/hoon/reference/rune/constants): A guide to atoms.
- [Hoon School](/courses/hoon-school/): Our guide to learning the Hoon programming language.
  - [“Hoon Syntax”](/courses/hoon-school/B-syntax#nouns): A Hoon School lesson that explains how atoms work.
