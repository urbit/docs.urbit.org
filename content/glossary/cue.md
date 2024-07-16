+++
title = "Cue"
+++

**Cue** is the deserialization function for nouns serialized into atoms with
the {% tooltip label="jam" href="/glossary/jam" /%} function. Cue and Jam are
used extensively by the kernel.

Example in the {%tooltip label="Dojo" href="/glossary/dojo" /%}:

```
> (jam [1 2 3])
3.426.417
> (cue 3.426.417)
[1 2 3]
```

#### Further Reading

- [Standard Library 2p: Serialization](/language/hoon/reference/stdlib/2p)
