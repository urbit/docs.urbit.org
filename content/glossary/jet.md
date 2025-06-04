# Jet

[Hoon](hoon.md) is compiled to [Nock](nock.md), a purely functional turing-complete combinator calculus that can be thought of as Urbit's assembly language or basic opcodes of the virtual machine. Nock is extremely minimalist, with only 11 basic operators, and consequently there are computations that cannot be *efficiently* implemented in Nock. To allow fast computation in these cases, Nock includes the ability to hand them off to a fast C implementation on the host system. These external implementations are called **jets**, and any Hoon/Nock code can be **jetted** in this way.

#### Further reading

- [Jet writing reference](../build-on-urbit/runtime/guides/jetting.md): developer documentation on how to write jets.
- [Nock documentation](../nock/definition.md): how Nock works.
