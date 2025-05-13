# Entropy

**Entropy** is the randomness collected by an operating system or application for use in cryptography or other uses that require random data. In Urbit's case, entropy is provided to [Arvo](arvo) by the runtime [Vere](vere). The entropy is made available to [agents](agent) and [threads](thread) as the `eny` value in the [bowl](bowl). It's also available as `eny` in the [dojo](dojo) and `%say`/`%ask` [generators](generator).
