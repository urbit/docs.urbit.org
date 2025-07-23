---
description: "Reference documentation for the Hoon standard library, organized by layer from basic arithmetic to advanced compiler operations and text processing."
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

# Standard Library

Comprehensive documentation for the Hoon standard library.

The Hoon standard library provides a complete suite of functions for working with the fundamental data types and operations in Hoon. These functions are organized into numbered sections based on their purpose and the types they operate on. The numbering corresponds to the layer structure in `/sys/hoon.hoon`.

## Layer 1: Basic Operations {#layer-1-basic-operations}
- [1a: Basic Arithmetic](./1a.md) - Unsigned arithmetic operations including addition, subtraction, multiplication, division, and comparison functions.
- [1b: Tree Addressing](./1b.md) - Functions for addressing and navigating tree structures using Nock's tree addressing scheme.
- [1c: Containers](./1c.md) - Fundamental container types and molds including `+pair`, `+list`, `+unit`, `+tree`, `+gate`, and other essential type definitions.

## Layer 2: Data Structures and Operations {#layer-2-data-structures-and-operations}

### Unit and List Operations {#unit-and-list-operations}
- [2a: Unit Logic](./2a.md) - Functions for working with units (optional values).
- [2b: List Logic](./2b.md) - List manipulation functions.

### Bit and Logic Operations {#bit-and-logic-operations}
- [2c: Bit Arithmetic](./2c.md) - Functions for assembling, disassembling, and manipulating `$atom`s at the bit level.
- [2d: Bit Logic](./2d.md) - Bitwise logical operations including binary AND, OR, XOR, and bit manipulation.
- [2e: Insecure Hashing](./2e.md) - Non-cryptographic hash functions including MurmurHash and other fast hashing algorithms.
- [2f: Noun Ordering](./2f.md) - Functions for ordering and comparing nouns.
- [2g: Unsigned Powers](./2g.md) - Exponentiation and power-related operations for unsigned integers.

### Container Data Structures {#container-data-structures}
- [2h: Set Logic](./2h.md) - Set data structure operations including union, intersection, difference, and membership testing.
- [2i: Map Logic](./2i.md) - Functions for working with key-value maps, including insertion, deletion, lookup, and map transformations.
- [2j: Jar and Jug Logic](./2j.md) - Operations for jar (map of lists) and jug (map of sets) data structures.
- [2k: Queue Logic](./2k.md) - Queue data structure operations for first-in, first-out data handling.
- [2l: Container from Container](./2l.md) - Functions for transforming one container type into another.
- [2m: Container from Noun](./2m.md) - Functions for creating containers from raw noun data.
- [2n: Functional Hacks](./2n.md) - Utility functions and functional programming helpers.
- [2o: Normalizing Containers](./2o.md) - Additional container types and operations.
- [2p: Serialization](./2p.md) - Functions for serializing and deserializing data structures.
- [2q: Molds and Mold-builders](2q.md) - Type construction and validation functions for creating and working with Hoon types.

## Layer 3: Advanced Operations {#layer-3-advanced-operations}

- [3a: Signed and Modular Arithmetic](./3a.md) - Signed integer arithmetic and modular arithmetic operations.
- [3b: Floating Point](./3b.md) - Floating-point arithmetic operations.
- [3c: Urbit Time](./3c.md) - Time and date manipulation functions specific to Urbit's `@da` datetime format.
- [3d: SHA Hash Family](./3d.md) - Cryptographic hash functions from the SHA family.
- [3e: AES Encryption](./3e.md) - Advanced Encryption Standard functions (removed from current stdlib).
- [3f: Scrambling](./3f.md) - Functions for data scrambling, obfuscation, and pseudo-random transformations.
- [3g: Molds and Mold-builders](3g.md) - Advanced type system operations and mold construction utilities.

## Layer 4: Text Processing and I/O {#layer-4-text-processing-and-io}

- [4a: Exotic Bases](./4a.md) - Functions for converting between different number bases and representations.
- [4b: Text Processing](./4b.md) - String and text manipulation functions including parsing and formatting.
- [4c: Tank Printer](./4c.md) - Pretty-printing functions for structured output and debugging.
- [4d: Parsing (Tracing)](4d.md) - Parsing utilities with tracing support for debugging parser errors.
- [4e: Parsing (Combinators)](4e.md) - Parser combinator functions for building complex parsers.
- [4f: Parsing (Rule Builders)](4f.md) - Functions for building parsing rules and grammar definitions.
- [4g: Parsing (Outside Caller)](4g.md) - Interface functions for calling parsers from external code.
- [4h: Parsing (ASCII Glyphs)](4h.md) - Parsers for ASCII characters and common text symbols.
- [4i: Parsing (Useful Idioms)](4i.md) - Common parsing patterns and idiomatic parser constructions.
- [4j: Parsing (Bases and Base Digits)](4j.md) - Parsers for numbers in various bases and digit representations.
- [4k: Atom Printing](./4k.md) - Functions for converting `$atom`s to various textual representations.
- [4l: Atom Parsing](./4l.md) - Functions for parsing text into `$atom`s with various auras.
- [4m: Formatting Functions](./4m.md) - Text formatting and pretty-printing utilities.
- [4n: Virtualization](./4n.md) - Virtualization and abstraction utilities for code execution.
- [4o: Molds and Mold-builders](./4o.md) - Advanced mold operations and type system utilities for complex type manipulation.

## Layer 5: Compiler and System Operations {#layer-5-compiler-and-system-operations}

- [5a: Compiler Utilities](./5a.md) - Utilities and helper functions used by the Hoon compiler.
- [5b: Macro Expansion](./5b.md) - Functions for macro expansion and code transformation.
- [5c: Compiler Backend](./5c.md) - Backend compilation functions and code generation utilities.
- [5d: Parser](./5d.md) - Core parsing functions for the Hoon language syntax.
- [5e: Molds and Mold-builders](./5e.md) - System-level type operations and mold construction.
- [5f: Profiling Support](./5f.md) - Profiling tools and debugging utilities for performance analysis.
