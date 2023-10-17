+++
title = "12. Next Steps"
weight = 60
+++

We've now covered all the arms of a Gall agent, and everything you need to know
to start writing your own agent.

The things haven't touched on yet are front-end development and integration,
Eyre's HTTP API for communicating with agents from the web, and dealing with
JSON data. The [Full-stack Walkthrough](/courses/app-school-full-stack)
covers these aspects of Urbit app development, and it also puts into practice
many of the concepts we've discussed in this guide, so you might like to work
through that next. In addition to that walkthrough, you can refer to the
following documents for help writing a web front-end for your app:

- [Eyre's external API reference](/system/kernel/eyre/reference/external-api-ref) - This
  explains Eyre's HTTP API, through which a browser or other HTTP client can
  interact with a Gall agent.
- [Eyre's usage guide](/system/kernel/eyre/guides/guide) - This walks through examples of
  using Eyre's HTTP API.
- [JSON guide](/language/hoon/guides/json-guide/) - This walks through the basics of
  converting Hoon data structures to JSON, for use with a web client. It also
  covers JSON conversion methods in `mark` files.
- [Zuse reference](/language/hoon/reference/zuse) - This contains
  documentation of all JSON encoding and decoding functions included in the
  `zuse.hoon` utility library.
- [The software distribution guide](/userspace/apps/guides/software-distribution) - This covers
  everything you need to know to distribute apps to other ships. It includes
  details of bundling a web front-end and serving it to the user in the browser.
- [The HTTP API guide](/tools/http-api-guide) - This is a reference
  and guide to using the `@urbit/http-api` NPM module.
- [The Sail guide](/language/hoon/guides/sail) - Sail is a domain-specific language
  for composing XML structure in Hoon. It can be used to compose front-ends for
  Urbit apps directly in agents, as an alternative approach to having a
  separate Javascript app.

In addition to these documents about creating a web-based user interface for
your app, there are some other guides you might like to have a look at:

- [Threads guide](/userspace/threads/tutorials/basics/fundamentals) - Threads are like transient
  agents, typically used for handling complex I/O functionality for Gall
  agents - like interacting with an external HTTP API.
- [The software distribution guide](/userspace/apps/guides/software-distribution) - This explains
  how to set up a desk for distribution, so other people can install your app.
