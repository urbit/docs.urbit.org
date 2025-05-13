# Subject

The **subject** is the [context](context.md) a particular [Hoon](hoon.md) (and [Nock](nock.md)) expression is evaluated against. Each [rune](rune.md) has exactly the context given to it by the previous one, and instead of modifying it in-place, an entirely new subject is produced for the next rune in the chain. Rather than the subject being an intangible, implicit context, it's an actual piece of data that can be referenced and manipulated as a whole. This system makes Hoon code a little like an onion, with a new immutable subject at each layer. Of course, the compiler is optimized so as not to literally duplicate the entire subject each time, but code behaves as though it does.

#### Further reading

- [Hoon School: subject-oriented programming](../courses/hoon-school/O-subject.md): A guide to subject-oriented programming.
