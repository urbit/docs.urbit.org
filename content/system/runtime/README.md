# Runtime

This section of the docs is about Urbit's Nock interpreter and runtime system **Vere**, which is written in C. This is of interest if you're planning to work on the Urbit interpreter, you're a language implementation geek, or you don't really understand anything until you've seen the actual structs.

### Developer Docs

- [U3 Overview](urbit-docs/system/runtime/concepts/u3) - An overview of the noun-wrangling part of the runtime, U3.
- [Conn.c Guide](urbit-docs/system/runtime/guides/conn) - Using `conn.c` to interact with a running ship from the outside.
- [How to Write a Jet](urbit-docs/system/runtime/guides/jetting) - A jetting guide by for new Urbit developers.
- [C3: C in Urbit](urbit-docs/system/runtime/reference/c) - Under u3 is the simple c3 layer, which is just how we write C in Urbit.
- [U3: Land of Nouns](urbit-docs/system/runtime/reference/nouns) - The division between c3 and u3 is that you could theoretically imagine using c3 as just a generic C environment. Anything to do with nouns is in u3.
- [U3: API Overview](urbit-docs/system/runtime/reference/api) - A walkthrough of each of the u3 modules.
- [Cryptography](urbit-docs/system/runtime/reference/cryptography) - References on the cryptography libraries utilized by jets.

### Additional Resources

- [User Reference](urbit-docs/manual/running/vere) - Reference for the utilities and options the runtime takes from the terminal.
- [The Vere Repo](https://github.com/urbit/vere) - Github repository for the runtime.
