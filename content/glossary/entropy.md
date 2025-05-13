# Entropy {#entropy}

**Entropy** is the randomness collected by an operating system or application for use in cryptography or other uses that require random data. In Urbit's case, entropy is provided to [Arvo](arvo.md) by the runtime [Vere](vere.md). The entropy is made available to [agents](agent.md) and [threads](thread.md) as the `eny` value in the [bowl](bowl.md). It's also available as `eny` in the [dojo](dojo.md) and `%say`/`%ask` [generators](generator.md).
