# Metals

"Variance" describes the four possible relationships that type rules for [cores](core.md) are able to have to each other. [Hoon](hoon.md) imaginatively designates these by **metals**. Briefly:

1. Covariance (`%zinc`) means that specific types nest inside of generic types: it's like claiming that a core that produces a `%plant` can produce a `%tree`, a subcategory of `%plant`. Covariance is useful for flexibility in return values.

2. Contravariance (`%iron`) means that generic types are expected to nest inside of specific types: it's like claiming that a core that can accept a `%tree` can accept a `%plant`, the supercategory of `%tree`. (Contravariance seems counterintuitive for many developers when they encounter it for the first time.) Contravariance is useful for flexibility in input values ([samples](sample.md)).

3. Bivariance (`%lead`) means that we can allow both covariant and contravariant behavior. While bivariance is included for completeness, it is not commonly used and only a few examples exist in the standard library for building shared data structure cores.

4. Invariance (`%gold`) means that types must mutually nest compatibly: a core that accepts or produces a `%tree` can only accept or produce a `%tree`. This is the default behavior of cores. Cores which allow variance are changing that behavior.

A `%gold` core can be cast or converted to any metal, and any metal can be cast or converted to `%lead`.


### Further Reading {#further-reading}

- [Hoon School: metals](../build-on-urbit/hoon-school/R-metals.md): This lesson covers core variance.
