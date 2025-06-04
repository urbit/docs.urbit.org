# Monad

In functional programming languages, a **monad** is a pattern where functions wrap their return value in a type that requires additional computation. A common monad is the "maybe" type, way either contain a result or a null value. A series of functions that produce a "maybe" can then be composed together with a "bind" operator. While Javascript promises are not technically monads, they follow a similar pattern.

In [Hoon](hoon.md), there are a number of functions that are either monads or follow a similar pattern. [Threads](thread.md) are written this way, and the `unit` type and associate functions are similar to "maybe".

#### Further reading

- [Threads guide](../urbit-os/base/threads/tutorials/basics/fundamentals.md): Learn how to write threads.
- [stdlib reference section 2a](../hoon/reference/stdlib/2a.md): These functions are for manipulating and composing units.
