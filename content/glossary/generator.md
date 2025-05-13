# Generator

A **generator** is something like a script in [Arvo](urbit-docs/glossary/arvo). Generators are written in [Hoon](urbit-docs/glossary/hoon) and run from the [dojo](urbit-docs/glossary/dojo) like `+code`, `|hi ~zod`, `+vats`, etc. They are usually used for two things: printing system information and passing commands to the system or apps. Generators are either ordinary [gates](urbit-docs/glossary/gate) (a "naked generator") or a `%say`/`%ask` generator with a more particular structure.

#### Further reading

- [Hoon school: gates](urbit-docs/courses/hoon-school/D-gates): This lesson on gates also introduces generators.
- [Hoon school: text processing](urbit-docs/courses/hoon-school/J-stdlib-text#say-generators): This lesson includes `%say` generators.
