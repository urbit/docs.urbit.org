---
description: "Rationale for Hoon programming language design."
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

# Why Hoon?

We're often asked why Urbit is written in a new programming language, Hoon, rather than some existing one like C, Haskell, or more recently Rust.

This document provides a high-level rationale for that decision, and covers some of the features of Hoon that set it apart from others.

If you're looking to learn Hoon, the best place to start is [Hoon School](../build-on-urbit/hoon-school/).

## Why is Hoon the way it is? <a href="#why-is-hoon-the-way-it-is" id="why-is-hoon-the-way-it-is"></a>

Minimalism, mostly.

Urbit's principled minimalism simplifies all kinds of things at many layers of the stack; for example, Urbit's linker, which is part of the Ford build system, just conses together multiple libraries into a tuple to form the compile-time environment for a source file. Universal serialization means we can safely send arbitrary pieces of data to apps on other ships without any more work than sending them to a local app.

Even Hoon's seemingly baroque syntax is extremely regular and an unusually thin layer over the abstract syntax tree. It's designed to be a power tool; learning the syntax takes some time, but you only have to learn it once, and then it's not hard to read. It's like an English speaker learning Hiragana or Cyrillic. This heaping spoonful of syntactic sugar (along with jets for performance) is enough to take Nock from a Turing tarpit to a practical, ergonomic programming tool.

Subject orientation in Nock and Hoon stems partly from minimalism: there's just one subject, which serves as state, lexical scope, environment, and function argument; partly from a desire to simplify compilation: the type of the subject is a full specification of the compile-time environment for a source file; and partly to give the language a more imperative feel.

You program Hoon as if you have a mutable environment, but you're embedded in a purely functional, immutable context. While Hoon is a purely functional language, many of its runes create a mutant copy of the subject for manipulation by future runes (similar to Forth's stack operations), which makes it feel more like an expression is "doing something" rather than just calculating something.

Everything about a scope, including name bindings, aliases, and docstrings, is stored in the subject's type. This allows Hoon's compilation discipline to be similarly minimal: the compiler is a function from subject type and Hoon source to product type and compiled Nock. Running this Nock against a value of the subject type produces a vase of the result. It's hard to imagine a more streamlined formalism for compilation.

The compilation discipline gets applied recursively to build the layers of the Arvo stack. The Arvo kernel is compiled using the Hoon compiler as subject, the Zuse standard library is compiled using the Arvo kernel as the subject, and apps and vanes (kernel modules) are compiled using Zuse as the subject.

The promise of Urbit lies in its reimagination of the digital world using components that are as constrained and limited as possible. By adhering firmly to principle and doubling down on minimalism at every turn, we get an OS that provides far stronger guarantees than Unix with a thousand times less code. Given the complexity of modern software, this is what's required to put personal computing back into the hands of people.

## What can Hoon do that other languages can't? <a href="#what-can-hoon-do-that-other-languages-cant" id="what-can-hoon-do-that-other-languages-cant"></a>

The short answer is: implement a purely functional operating system. Try to do this in a principled way in Haskell, and the problems you'll run into will make design decisions in Hoon and Nock make a lot more sense.

In particular, the problems Hoon solves that aren't solved by other functional languages are:

* Compiling and running other Hoon code in a typesafe manner at full speed,
* Typesafe metaprogramming
* Hot code reloading and online data migration.

## What is Hoon good at? <a href="#what-is-hoon-good-at" id="what-is-hoon-good-at"></a>

Hoon is mostly good at compiling and running other Hoon code. That matters because Urbit consists of many layers of bootstrapping. Several of these layers lean heavily on this feature, including the Gall application runner, the Ford build system, the Dojo shell, and the Arvo kernel itself.

## Why did we write the OS in Hoon? <a href="#why-did-we-write-the-os-in-hoon" id="why-did-we-write-the-os-in-hoon"></a>

The chain of reasoning goes something like this:

Software complexity leads to monopolies and lack of individual digital sovereignty, in addition to bugs and security vulnerabilities. One of the best ways to reduce software complexity is to restrict the code to pure mathematical functions: no side effects, no implicit arguments. This makes the system deterministic. So we want a simple, deterministic, functional operating system for non-technical individuals to run.

This operating system should also be axiomatic: we don't want it to depend on various idiosyncrasies of whatever current hardware is like. Hardware changes over time, and we want people to be able to pass their computers on to their grandchildren, so we should have an axiomatic virtual machine that runs this functional operating system.

As hardware changes, people need to move their virtual machines to new hosts. This means there needs to be a standard way to serialize and deserialize the VM state at any time. The easiest way to do this is by storing an event log, just like a database, and writing each event to that before emitting the effects caused by that event. Since we also need state snapshots, every piece of data in the system, including runtime state, needs to be serializable to a standardized format.

Because the VM will likely move from host to host many times, it needs to be tractable to actually implement a VM correctly. This means the system specification needs to be simple enough that it's clear whether a VM is, in fact, correct. The x86\_64 instruction set that runs most servers has somewhere between 1300 and 4000 opcodes, depending on how you count. Nock has 12.

Since Urbit is an operating system, its main purpose is to load and run programs on behalf of the user. This means the system needs to be really good at hot code reloading, self-hosting, metacircularity, and virtualization.

There aren't any other languages out there that are purely functional, purely axiomatic, performant enough for practical personal use, universally serializable, and good at runtime metaprogramming. Nock is Urbit's solution to these design constraints. Some Lisps come close to meeting these criteria, and Nock is very Lisp-like, but no practical Lisp dialects are nearly as pure or axiomatic as Nock.

We call Hoon a high-level programming language, but conceptually it's quite a thin layer around Nock. The pseudo-operators you see in the Nock spec (`?`, `=`, `*`, etc.) are recapitulated in the "runes" that Hoon uses in place of keywords (`?:`, `=/`, `+*`, etc.). Nock opcode 2 takes a pair of "subject" (data) and "formula" (code), and creates a new subject to run another formula against. Almost everything in Hoon is a "core", which is a pair of "battery" (code) and "payload" (data). Everything that happens in Arvo runs through an event loop function that accepts a list of effects (code) and a state (data) and yields new versions of the same by running Nock opcode 2 directly. Nock aspires to be the simplest practical definition of a computer, and writing the OS in a programming language that maps precisely onto its semantics eliminates a lot of the potential complexity that could have arisen in the OS by now.

## What is special about Hoon? <a href="#what-is-special-about-hoon" id="what-is-special-about-hoon"></a>

It's a purely functional systems language. Calling it a functional analog of C is not too far off in several ways. Almost all code throughout Urbit's kernelspace and userspace is written in Hoon.

## What properties does Hoon have? What type of language is it? <a href="#what-properties-does-hoon-have-what-type-of-language-is-it" id="what-properties-does-hoon-have-what-type-of-language-is-it"></a>

Hoon is a statically typed, purely functional, strictly evaluated programming language.

Hoon and Nock have several unusual properties...

### Axiomaticity <a href="#axiomaticity" id="axiomaticity"></a>

Nock is a fully axiomatic computing system: no dependencies, no builtins, no hardware dependence, just math. The [jet system](why-hoon.md#jets) gives this a practical level of performance.

### Layering <a href="#layering" id="layering"></a>

Nock is machine code designed for machines to run; Hoon is a programming language designed for people to use.

Hoon layers over Nock in a very similar way to how C layers over machine code.

Nock has no symbols: all programmer-facing variable names live in Hoon types. You can use raw Nock from Hoon, much like dropping down to assembly from within C. Hoon compiles to Nock with no "runtime system"; aside from subtree lookups, you could quite easily compile most Hoon expressions by hand.

### Minimalism <a href="#minimalism" id="minimalism"></a>

Urbit is ruthlessly minimalistic throughout the stack. Nock has twelve opcodes, and Hoon's semantics are a very thin layer over Nock's.

The only fundamental datatype in Urbit is the noun: a noun is either any natural number, called an atom, or a pair of nouns, called a cell. This forms a binary tree with atoms at the leaves. Lists, sets, maps, queues, executable code, closures, abstract syntax trees, buffers, strings, floating-point numbers, and everything else in the whole programming environment are represented as nouns.

### Acyclicity <a href="#acyclicity" id="acyclicity"></a>

There are no cycles in nouns, since they're trees, so there are no cycles in Nock's memory model. Pointer equality is not exposed to the programmer. In practical Nock implementations, all data structures are what are elsewhere called "functional" or "persistent" data structures, meaning they're immutable and share structure wherever possible.

### Homoiconicity <a href="#homoiconicity" id="homoiconicity"></a>

Code and data are represented the same way and can be converted to each other. Lisp dialects are also homoiconic, but Hoon and Nock are arguably even more so, since things like closures and the environment are just Nock trees. We even have a statically typed metacircular interpreter called `+mule`. We run userspace code metacircularly with negligible performance overhead because of Urbit's jet system. In Lisp "eval is evil" is a common saying but, in Urbit, eval is a first-class feature.

### Universal serialization <a href="#universal-serialisation" id="universal-serialisation"></a>

There's one serialization format, called "jam", for any piece of code or data in the system. This makes it so that deserialization has just one function, a few hundred lines of C, as its security attack surface. It also facilitates portability of the virtual machine state, and it turns out to be useful in a bunch of places in the system.

### Jets <a href="#jets" id="jets"></a>

A jet is a piece of code that the Nock interpreter has that reimplements a Nock function in some other, faster language. The `+dec` decrement function in Hoon's standard library is defined axiomatically using recursion, but is run as a jet written in C that makes use of the processor's arithmetic logic unit for performance. When calling a Nock function, if the runtime has a matching jet, it will use that instead of the Nock implementation. Nock isn't as slow as you might think, especially considering it's a minimal, dynamic, axiomatic language.

This arrangement has the deeper implication that all Nock code is best considered as a specification for a program, which can be executed directly but might never run at all due to being jetted. Cryptographic functions, for example, should all have jets with constant-time implementations to prevent timing attacks. Most jets, though, just take advantage of hardware acceleration for things like floating point arithmetic. Arithmetic jets would still be useful even on a Nock-native CPU, of which we have a [proof-of-concept](https://youtu.be/F0qhQ-cM7LQ?si=cZpdC413ylNW1gFC).

### Regularity <a href="#regularity" id="regularity"></a>

The amount of Hoon syntax is unusually large, but also unusually regular. Hoon is a "runic" language, meaning expressions generally begin with a digraph "rune" (e.g. `|=`, `^-`, `=/`) corresponding to the type of expression.

Runes are used in place of keywords and Lisp's "special forms". Hoon's syntax makes better use of screen real estate than Haskell or Lisp by having a mostly vertical "backbone" of runes that prevents long functions from indenting repeatedly, which helps quickly identify control flow. Hoon does not allow syntactic abstraction, so you always know exactly what you're looking at when reading Hoon. The similarity of Hoon's syntax to its abstract syntax tree makes metaprogramming easier and can be thought of as another layer of homoiconicity on top of Nock's.

### Subject-oriented programming <a href="#subject-oriented-programming" id="subject-oriented-programming"></a>

There is no implicit environment. A Hoon expression compiles down to a Nock formula, which is interpreted as a function that runs with the "subject" as the argument. The subject can be any Nock tree, but it contains everything that's in scope. It usually consists of the Hoon compiler and standard library as a stack of cores, along with whatever functions and variables have been defined by the Hoon programmer.

### Cores <a href="#cores" id="cores"></a>

Almost everything you'll encounter in Hoon is a core: a pair of code and data.

The core is the underlying representation of a function (a lambda with implicit fixed point), a library or module, an OOP-style object, and an OOP-style "interface" or "protocol". The code consists of a set of Nock formulas that can each be run against the whole core as a subject. This means there's always an implicit fixed point when running a function, and mutual recursion can occur among a core's formulas. A core's data usually consists of the standard library (itself a stack of cores), and possibly a "sample" (function argument).

### Types <a href="#types" id="types"></a>

The type system has several unusual features:

* It's intentional, in the sense that all constructs are first-class and can be down-cast to a noun, Hoon's "any" or "top" type that matches all Nock nouns.
* Types are also used as scopes, so they store all of Hoon's variable names and docstrings.
* It uses an unusual macro-like feature called "wetness" to implement parametric polymorphism.
* It can also auto-generate coercion functions that validate and lift raw nouns into structural types, such as lists or cells. This is used to validate untrusted data, such as messages from the other ships on the network.

### Reflectivity <a href="#reflectivity" id="reflectivity"></a>

The type of type is just a normal datatype in Hoon, and a lot of the system manipulates types.

In particular, the `!>` rune, when applied to a piece of data, uses compile-time type reflection to produce something called a "vase": a pair of type and data, similar to a `Data.Dynamic` in Haskell, or a limited form of a dependent pair. Since the Arvo kernel does a lot of dynamic compilation, it uses vases to implement something akin to a dynamically typed language using Hoon. This allows for type-safe dynamic program loading, program execution, and data migration.

### Inertness <a href="#inertness" id="inertness"></a>

Because Nock is purely functional, Hoon compiles to it so directly, everything is homoiconic, and Hoon is intensional, there's a very nice feeling that everything is just a stationary tree.

There are no special objects that can't be manipulated; everything in your environment is just a subtree, and you could grab it and print it out if you wanted to. There's nothing like a "database handle", "websocket connection object", or other mystical constructs.

The calmness of working with such inert building blocks is addictive, as many Hoon programmers will attest.
