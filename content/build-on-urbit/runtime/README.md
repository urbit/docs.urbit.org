---
description: Documentation for Urbit's runtime and Nock interpreter (Vere), including guides for U3, jetting, C programming in Urbit, and cryptography implementation.
---

# Runtime

These guides cover Urbit's runtime and Nock interpreter, which is called Vere.

* [U3 Overview](u3.md) - An overview of the noun-wrangling part of the runtime, U3.
* [Conn.c Guide](conn.md) - Using `conn.c` to interact with a running ship from the outside.
* [How to Write a Jet](jetting.md) - A jetting guide by for new Urbit developers.
* [C3: C in Urbit](c.md) - Under u3 is the simple c3 layer, which is just how we write C in Urbit.
* [U3: Land of Nouns](nouns.md) - The division between c3 and u3 is that you could theoretically imagine using c3 as just a generic C environment. Anything to do with nouns is in u3.
* [U3: API Overview](api.md) - A walkthrough of each of the u3 modules.
* [Cryptography](cryptography.md) - References on the cryptography libraries utilized by jets.

## Additional Resources <a href="#additional-resources" id="additional-resources"></a>

* [User Reference](../../user-manual/running/vere.md) - Reference for the utilities and options the runtime takes from the terminal.
* [The Vere Repo](https://github.com/urbit/vere) - Github repository for the Urbit runtime.
