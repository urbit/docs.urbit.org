# Vase

A **vase** is a pair of [`$type`](../hoon/reference/stdlib/4o.md#type) and [`$noun`](../hoon/reference/stdlib/2q.md#noun), where the type describes the noun.

They're used all over Urbit to represent data whose type we can't know ahead of time. This often comes up when being asked to compile and run other Hoon code. It's also used to store data that could be any type, but where we want to know the type.

### Further Reading {#further-reading}

- [Vase guide](../hoon/guides/vases.md) - an overview of vases and the tools for working with them.
- [Standard library section 5c](../hoon/reference/stdlib/5c.md): This contains most of the vase functions in the standard library.
