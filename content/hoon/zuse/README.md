---
description: "Documentation for the %base desk's /sys/zuse.hoon library, which contains helper functions for the kernel."
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

# Zuse

Documentation for the `%base` desk's `/sys/zuse.hoon` library, which contains helper functions for the kernel.

Zuse is the farthest downstream component of the kernel in terms of dependency, so its version number is used to represent the version of the kernel as a whole. For example, a new kernel release might be referred to as "410k" to refer to Zuse kelvin version 410.

## 2d: Formatting functions {#2d-formatting-functions}

- [2d(1-5): To JSON, Wains](2d_1-5.md) - Functions for encoding/decoding line-lists and various JSON encoding functions.
- [2d(6): From JSON](2d_6.md) - Functions for decoding `$json`.
- [2d(7): From JSON (unit)](2d_7.md) - Functions for decoding `$json` to `$unit`s.

## 2e: Web Text Functions {#2e-web-text-functions}

- [2e(2-3): Print & Parse JSON](2e_2-3.md) - Print `$json` and parse JSON.

## 2m: Ordered Maps {#2m-ordered-maps}

[2m: Ordered Maps](2m.md) - Functions for creating and working with ordered maps.
