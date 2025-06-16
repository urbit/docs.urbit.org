# Userspace

Gall is one of the nine vanes (kernel modules) of Arvo, Urbit's operating system. Gall's purpose is to manage userspace applications called _agents_. **Agents** are the main kind of userspace application on Urbit. They have a persistent state and API that handles events and produces effects.Gall agents can variously be treated as databases with developer-defined logic, services, daemons, or a kind of state machine.

One or more Gall agents can be put together in a "desk" in Clay (the filesystem vane) and, along with a front-end, can be published and distributed as a cohesive app for users to install.

This section of the docs contains guides related to writing apps and [distributing them](dist/software-distribution.md). It also contains a number of different [examples and exercises](examples/) you can work through to learn how to build different kinds of apps.

* [Reference](reference/) - Reference information about apps and software distribution.
* [Guides](guides/) - Guides to things like software distribution, CLI apps and remote scries.
* [Examples](examples/) - A workbook of app exercises and examples.

Additionally, the [courses](../../build-on-urbit/contents.md) section of the docs contain two in-depth app-building tutorials, which are the recommended place to start learning Urbit app development:

* [App School](../app-school/) - Learn the basics of app development.
* [App School II](../app-school-full-stack/) - Learn to build and publish a full app, back-end and front-end.
