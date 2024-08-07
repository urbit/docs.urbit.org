+++
title = "Jam"
+++

**Jam** is the primary {% tooltip label="noun" href="/glossary/noun" /%}
serialization function. It allows any noun to be packed into an {% tooltip
label="atom" href="/glossary/atom" /%} for tranmission over the network or
storage on disk. The jammed noun can be unpacked again with the {% tooltip
label="cue" href="/glossary/cue" /%} function. Jam and Cue are used extensively
by the kernel.

Example in the {%tooltip label="Dojo" href="/glossary/dojo" /%}:

```
> (jam [1 2 3])
3.426.417
> (cue 3.426.417)
[1 2 3]
```

Note that {% tooltip label="vases" href="/glossary/vase" /%} shouldn't be
jammed as non-trivial types pull in a lot of the standard library and result in
an enormous jam file. Instead, they should be cue'd to a raw noun and then {%
tooltip label="molded" href="/glossary/mold" /%} to the desired type.

#### Further Reading

- [Standard Library 2p: Serialization](/language/hoon/reference/stdlib/2p)
