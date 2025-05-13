# Vase

A **vase** is a pair of [`$type`](urbit-docs/language/hoon/reference/stdlib/4o#type) and [`$noun`](urbit-docs/language/hoon/reference/stdlib/2q#noun), where the type describes the noun.

They're used all over Urbit to represent data whose type we can't know ahead of time. This often comes up when being asked to compile and run other Hoon code. It's also used to store data that could be any type, but where we want to know the type.

### Further Reading

- [Vase guide](urbit-docs/language/hoon/guides/vases) - an overview of vases and the tools for working with them.
- [Standard library section 5c](urbit-docs/language/hoon/reference/stdlib/5c): This contains most of the vase functions in the standard library.
