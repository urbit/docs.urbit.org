# Generator

A **generator** is something like a script in [Arvo](arvo.md). Generators are written in [Hoon](hoon.md) and run from the [dojo](dojo.md) like `+code`, `|hi ~zod`, `+vats`, etc. They are usually used for two things: printing system information and passing commands to the system or apps. Generators are either ordinary [gates](gate.md) (a "naked generator") or a `%say`/`%ask` generator with a more particular structure.

#### Further reading

- [Hoon school: gates](../build-on-urbit/hoon-school/D-gates.md): This lesson on gates also introduces generators.
- [Hoon school: text processing](../build-on-urbit/hoon-school/J-stdlib-text.md#say-generators): This lesson includes `%say` generators.
