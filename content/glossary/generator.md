# Generator

A **generator** is something like a script in [Arvo](/glossary/arvo). Generators are written in [Hoon](/glossary/hoon) and run from the [dojo](/glossary/dojo) like `+code`, `|hi ~zod`, `+vats`, etc. They are usually used for two things: printing system information and passing commands to the system or apps. Generators are either ordinary [gates](/glossary/gate) (a "naked generator") or a `%say`/`%ask` generator with a more particular structure.

#### Further reading

- [Hoon school: gates](/courses/hoon-school/D-gates): This lesson on gates also introduces generators.
- [Hoon school: text processing](/courses/hoon-school/J-stdlib-text#say-generators): This lesson includes `%say` generators.
