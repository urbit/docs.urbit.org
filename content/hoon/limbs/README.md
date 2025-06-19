---
description: "Introduction to limbs and wings in Hoon, which provide the primary mechanism for accessing data from the subject without traditional scope or environment concepts."
layout:
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# Limbs and wings

One feature Hoon lacks: a context that isn't a first-class value. Hoon has no concept of scope, environment, etc. An expression has exactly one data source, the subject, a noun like any other.

- [Limbs](./limb.md) - A limb is used to resolve to a piece of data in the subject. A wing is thus a resolution path into the subject.
- [Wings](./wing.md) - In Hoon we use 'wings' to extract information from the subject. A wing is a list of limbs (including a trivial list of one limb).
