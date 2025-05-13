# Entropy

**Entropy** is the randomness collected by an operating system or application for use in cryptography or other uses that require random data. In Urbit's case, entropy is provided to [Arvo](urbit-docs/glossary/arvo) by the runtime [Vere](urbit-docs/glossary/vere). The entropy is made available to [agents](urbit-docs/glossary/agent) and [threads](urbit-docs/glossary/thread) as the `eny` value in the [bowl](urbit-docs/glossary/bowl). It's also available as `eny` in the [dojo](urbit-docs/glossary/dojo) and `%say`/`%ask` [generators](urbit-docs/glossary/generator).
