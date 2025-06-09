# Face

A **face** is a name for a value, type or expression in [Hoon](hoon.md). In the expression `foo=42`, `foo` is the face of the value `42`. When that value is pinned to the [subject](subject.md) like `=+ foo=42`, subsequent expressions can reference `foo` and it will be substituted with `42`. Faces are part of Hoon's type system, and are replaced with tree addresses when compiled to [Nock](nock.md).

#### Further reading

- [Hoon school: Syntax lesson](../build-on-urbit/hoon-school/B-syntax.md#preserving-values-with-faces): This lesson discusses faces in more detail.
