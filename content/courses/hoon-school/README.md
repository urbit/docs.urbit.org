# Hoon School

Hoon School is designed to teach you Hoon without assuming you have an extensive programming background. You should be able to following most of it even if you have no programming experience at all yet, though of course experience helps. We strongly encourage you to try out all the examples of each lesson. Hoon School is meant for the beginner, but it's not meant to be skimmed.

Each lesson consists of:
- **Explanations**, which are prose-heavy commentary on the Hoon fundamentals.
- **Exercises**, which challenge you to clarify or expand your own understanding in practice.
- **Tutorials**, which are line-by-line commentary on example programs.

## Why Hoon? {#why-hoon}

The short version is that Hoon uses Urbit's provisions and protocols to enable very fast application development with shared primitives, sensible affordances, and straightforward distribution.

Urbit consists of an identity protocol ([Azimuth](../../glossary/azimuth.md), or “Urbit ID”) and a system protocol ([Arvo](../../glossary/arvo.md), or “Urbit OS”). These two parts work hand-in-hand to build your hundred-year computer.

**Urbit ID (Azimuth)** is a general-purpose public-key infrastructure (PKI) on the Ethereum blockchain, used as a platform for Urbit identities. It provides a system of scarce and immutable identities which are cryptographically secure.

**Urbit OS (Arvo)** is an operating system which provides the software for the personal server platform that constitutes the day-to-day usage of Urbit. Arvo works over a [peer-to-peer](https://en.wikipedia.org/wiki/Peer-to-peer), [end-to-end-encrypted](https://en.wikipedia.org/wiki/End-to-end_encryption) network to interact with other Urbit ships (or unique instances).

Arvo is an axiomatic operating system which restricts itself to pure mathematical functions, making it [deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm) and [functional-as-in-programming](https://en.wikipedia.org/wiki/Functional_programming). Such strong guarantees require an operating protocol, the [Nock virtual machine](../../language/nock/reference/definition.md), which will be persistent across hardware changes and always provide an upgrade path for necessary changes.

It's hard to write a purely functional operating system on hardware which doesn't make such guarantees. So Urbit OS uses a new language, Hoon, which compiles to Nock and hews to the necessary conceptual models for a platform like Urbit. [The Hoon overview](../../language/hoon) covers more of the high-level design decisions behind the language, as does [developer ~rovnys-ricfer's explanation](https://urbit.org/blog/why-hoon/).

Hoon School introduces and explains the fundamental concepts you need in order to understand Hoon's semantics. It then introduces a number of key examples and higher-order abstractions which will make you a more fluent Hoon programmer.

Once you have completed Hoon School, you should work through [App School](../app-school) to learn how to build full applications on Urbit.

## Environment Setup {#environment-setup}

An Urbit ship is a particular realization of an _identity_ and an _event log_ (state). Both of these are necessary.

Since live network identities ("live ships") are finite, scarce, and valuable, most developers prefer to write new code using fake identities ("fakeships"). A fakeship is also different from a comet, which is an unkeyed live ship.

Two fakeships can communicate with each other on the same machine, but have no awareness of the broader Urbit network. We won't need to use this capability in Hoon School Live, but it will be helpful later when you start developing networked apps.

Before beginning, you'll need to get a development ship running and configure an appropriate editor. See the [Environment Setup](../environment.md) guide for details.

Once you have a "...dojo>" prompt, the system is ready to go and waiting on input.

## Getting started {#getting-started}

Once you've created your development ship, let's try a basic command. Type `%-  add  [2 2]` at the prompt and hit `Return`. (Note the double spaces before and after `add`.)  Your screen now shows:

```hoon
fake: ~zod
ames: czar: ~zod on 31337 (localhost only)
http: live (insecure, public) on 80
http: live (insecure, loopback) on 12321
> %-  add  [2 2]
4
~zod:dojo>
```

You just used a function from the Hoon standard library, `add`, which for reasons that will become clear later is frequently written [++add](../../language/hoon/reference/stdlib/1a.md#add). Next, quit Urbit by entering [|exit](../../manual/os/dojo-tools.md#exit) :

```hoon
> %-  add  [2 2]
4
~zod:dojo> |exit
$
```

Your ship isn't running anymore and you're back at your computer's normal terminal prompt. If your ship is ~zod, then you can restart the ship by typing:

```hoon
./urbit zod
```

You've already used a standard library function to produce one value, in the Dojo. Now that your ship is running again, let's try another. Enter the number `17`.

(We won't show the `~zod:dojo>` prompt from here on out. We'll just show the echoed command along with its result.)

You'll see:

```hoon
> 17
17
```

You asked Dojo to evaluate `17` and it echoed the number back at you. This value is a [noun](../../glossary/noun.md). We'll talk more about nouns in the next lesson.

Basically, every Hoon expression operates on the values it is given until it reduces to some form that can't evaluate any farther. This is then returned as the result of the evaluation.

One more:

```hoon
> :-  1  2
[1 2]
```

This `:-` rune takes two values and composes them into a [cell](../../glossary/cell.md), a pair of values.


## Pronouncing Hoon {#pronouncing-hoon}

Hoon uses [runes](../../glossary/rune.md), or two-character ASCII symbols, to describe its structure. (These are analogous to keywords in other programming languages.)  Because there has not really been a standard way of pronouncing, say, `#` (hash, pound, number, sharp, hatch) or `!` (exclamation point, bang, shriek, pling), the authors of Urbit decided to adopt a one-syllable mnemonic to uniquely refer to each.

It is highly advisable for you to learn these pronunciations, as the documentation and other developers employ them frequently. For instance, a rune like `|=` is called a “bartis”, and you will find it designated as such in the docs, in the source code, and among the developers.

| Name  | Character  |
|-------|------------|
| `ace` | `␣`        |
| `gap` | `␣␣`, `\n` |
| `pat` | `@`        |
| `bar` | `\|`       |
| `gar` | `>`        |
| `sel` | `[`        |
| `bas` | `\`        |
| `hax` | `#`        |
| `ser` | `]`        |
| `buc` | `$`        |
| `hep` | `-`        |
| `sig` | `~`        |
| `cab` | `_`        |
| `kel` | `{`        |
| `soq` | `'`        |
| `cen` | `%`        |
| `ker` | `}`        |
| `tar` | `*`        |
| `col` | `:`        |
| `ket` | `^`        |
| `tic` | `` ` ``    |
| `com` | `,`        |
| `lus` | `+`        |
| `tis` | `=`        |
| `doq` | `"`        |
| `mic` | `;`        |
| `wut` | `?`        |
| `dot` | `.`        |
| `pal` | `(`        |
| `zap` | `!`        |
| `fas` | `/`        |
| `pam` | `&`        |
| `gal` | `<`        |
| `par` | `)`        |

Note that the list includes two separate whitespace forms: `ace` for a single space `␣`; `gap` is either two or more spaces `␣␣` or a line break `\n`. In Hoon, the only whitespace significance is the distinction between `ace` and `gap`: the distinction between "one space" and "more than one space".
