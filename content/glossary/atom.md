# Atom

An **atom** is any non-negative integer of any size. The atom is the most basic data type in [Nock](urbit-docs/glossary/nock) and [Hoon](urbit-docs/glossary/hoon).

A Hoon atom type consists of a Nock atom with two additional pieces of metadata: an _aura_, which is a soft type that declares if an atom is a date, a ship name, a number, etc, and an optional constant. A Hoon atom type is _warm_ or _cold_ based on whether or not the constant exists:

- A Hoon atom type is [warm](urbit-docs/glossary/warm-atom) if the constant is `~` (null), any atom is in the type.
- A Hoon atom type is [cold](urbit-docs/glossary/cold-atom) if the constant is `[~ atom]`, its only legal value is the exact value of the atom.

### Further Reading

- [Hoon School](urbit-docs/courses/hoon-school/): Our guide to learning the Hoon programming language.
  - [“Hoon Syntax”](urbit-docs/courses/hoon-school/B-syntax#nouns): A Hoon School lesson that explains how atoms work.
- [The Nock explanation](urbit-docs/language/nock/reference/specification): Includes an explanation of atoms.
