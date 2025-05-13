# Jam

**Jam** is the primary [noun](noun.md) serialization function. It allows any noun to be packed into an [atom](atom.md) for tranmission over the network or storage on disk. The jammed noun can be unpacked again with the [cue](cue.md) function. Jam and Cue are used extensively by the kernel.

Example in the [Dojo](dojo.md):

```
> (jam [1 2 3])
3.426.417
> (cue 3.426.417)
[1 2 3]
```

Note that [vases](vase.md) shouldn't be jammed as non-trivial types pull in a lot of the standard library and result in an enormous jam file. Instead, they should be cue'd to a raw noun and then [molded](mold.md) to the desired type.

#### Further Reading

- [Standard Library 2p: Serialization](../language/hoon/reference/stdlib/2p.md)
