# 1. Arvo

This document is a prologue to App School I. If you've worked though [Hoon School](../hoon-school) (or have otherwise learned the basics of Hoon), you'll likely be familiar with generators, but not with all the other parts of the Arvo operating system or the way it fits together. We'll go over the basic details here so you're better oriented to learn Gall agent development. We'll not go into the internal workings of the kernel much, but just what is necessary to understand it from the perspective of userspace.

## Arvo and its Vanes {#arvo-and-its-vanes}

[Arvo](../../system/kernel/arvo) is the Urbit OS and kernel which is written in [Hoon](../../glossary/hoon.md), compiled to [Nock](../../glossary/nock.md), and executed by the runtime environment and virtual machine [Vere](../../glossary/vere.md). Arvo has ten kernel modules called vanes: [Ames](../../system/kernel/ames), [Behn](../../system/kernel/behn), [Clay](../../system/kernel/clay), [Dill](../../system/kernel/dill), [Eyre](../../system/kernel/eyre), [Gall](../../system/kernel/gall), [Iris](../../system/kernel/iris), [Jael](../../system/kernel/jael), [Khan](../../system/kernel/khan), and [Lick](../../system/kernel/lick).

Arvo itself has its own small codebase in `/sys/arvo.hoon` which primarily implements the [transition function](../../system/kernel/arvo#operating-function) `(State, Event) -> (State, Effects)` for events injected by the runtime. It also handles inter-vane messaging, the [scry](../../system/kernel/arvo/guides/scry.md) system, and a couple of other things. Most of the heavy lifting is done by the vanes themselves - Arvo itself typically just routes events to the relevant vanes.

Each vane has its own state. Gall's state contains the agents it's managing, Clay's state contains all the desks and their files, Jael's state contains all its PKI data, etc. All the vanes and their states live in Arvo's state, so Arvo's state ultimately contains the entire OS and its data.

Here's a brief summary of each of the vanes:

- **Ames**: This is both the name of Urbit's networking protocol, as well as the vane that handles communications over it. All inter-ship communications are done with Ames, but you'd not typically deal with it directly in a Gall agent because Gall itself handles it for you.
- **Behn**: A simple timer vane. Behn lets your Gall agent set timers which go off at the time specified and notify your agent.
- **Clay**: Filesystem vane. Clay is a revision-controlled, typed filesystem with a built-in build system. Your agent's source code lives in Clay. Your agent's source code and relevant files are automatically built and loaded upon installation, so your Gall agent itself would not need to interact with Clay unless you specifically wanted to read and write files.
- **Dill**: Terminal driver vane. You would not typically interact with Dill directly; printing debug messages to the terminal is usually done with hinting runes and functions rather than tasks to Dill, and CLI apps are mediated by a sub-module of the `%hood` system agent called `%drum`. CLI apps will not be touched on in this guide, but there's a separate [CLI Apps](../../userspace/apps/guides/cli-tutorial.md) guide which covers them if you're interested.
- **Eyre**: Webserver vane. App web front-ends are served via Eyre. It's possible to handle HTTP requests directly in a Gall agent (see the [Eyre Guide](../../system/kernel/eyre/guides/guide.md) for details), but usually you'd just serve a front-end [glob](../../userspace/apps/reference/dist/glob.md) via the `%docket` agent, so you'd not typically have your agent deal with Eyre directly.
- **Gall**: App management vane; this is where your agent lives.
- **Iris**: Web client vane. If you want your agent to query external web APIs and the like, it's done via Iris. Oftentimes web API interactions are spun out into [threads](../../userspace/threads/tutorials/basics/fundamentals.md) to avoid complicating the Gall agent itself, so a Gall agent would not necessary deal with Iris directly, even if it made use of external APIs.
- **Jael**: Key infrastructure vane. Jael keeps track of PKI data for your ship and other ships on the network. Jael's data is most heavily used by Ames, and since Gall handles Ames communications for you, you'd not typically deal with Jael directly unless your were specifically writing something that made use of its data.
- **Khan**: Control plane vane. The main purpose of Khan is for external application to be able to run threads via a Unix socket and receive their results. Khan's external interface is still experimental, but it's also good for running threads internally.
- **Lick**: Inter-process communication (IPC) vane. Lick manages IPC ports, and the communication between Urbit applications and POSIX applications via these ports. Other vanes and applications ask Lick to open an IPC port, notify it when something is connected or disconnected, and transfer data between itself and the Unix application.

## Userspace {#userspace}

Gall agents live in "userspace" as opposed to "kernelspace". Kernelspace is Arvo and its nine vanes. Userspace is primarily Gall agents, generators, threads, front-ends, and all of their related files in Clay. The distinction looks something like this:

[![](https://media.urbit.org/guides/core/app-school/kernelspace-userspace-diagram-v1.svg)](https://media.urbit.org/guides/core/app-school/kernelspace-userspace-diagram-v1.svg)

By and large, Gall _is_ the userspace vane - the majority of userspace is either Gall agents, or things used by Gall agents. Apart from the agents themselves, there's also:

- **Generators**: These are basically scripts. You'll likely already be familiar with these from Hoon School. Aside from learning exercises, their main use is to make interacting with Gall agents easier from the dojo. Rather than having to manually craft `%poke`s to agents, generators can take a simpler input, reformat it into what the agent actually expects, and poke the agent with it. When you do something like `:dojo|wipe` in the dojo, you're actually running the `/gen/dojo/wipe.hoon` generator and poking the `%dojo` agent with its output.
- **Threads**: While generators are for strictly synchronous operations, threads make it easy to implement sequences of asynchronous operations. Threads are managed by the `%spider` agent. They can be used as mere scripts like generators, but their main purpose is for performing complex IO. For example, suppose you need to query some external web API, then with the data in its response you make another API call, and then another, before finally having the data you need. If one of the API calls fails, your Gall agent is potentially left in a strange intermediary state. Instead, you can put all the IO logic in a separate thread which is completely atomic. That way the Gall agent only has to deal with the two conditions of success or failure. Writing threads is covered in a [separate guide](../../userspace/threads/tutorials/basics/fundamentals.md), which you might like to work through after completing App School I.

- **Front-end**: Web UIs. It's possible for Gall agents to handle HTTP requests directly and dynamically produce responses, but it's also possible to have a static [glob](../../userspace/apps/reference/dist/glob.md) of HTML, CSS, Javascript, images, etc, which are served to the client like an ordinary web app. Such front-end files are typically managed by the `%docket` agent which serves them via Eyre. The [software distribution guide](../../userspace/apps/guides/software-distribution.md) covers this in detail, and you might like to work through it after completing App School I.

## The Filesystem {#the-filesystem}

On an ordinary OS, you have persistent disk storage and volatile memory. An application is launched by reading an executable file on disk, loading it into memory and running it. The application will maybe read some more files from disk, deserialize them into data structures in memory, perform some computations and manipulate the data, then serialize the new data and write it back to disk. This process is necessary because persistent storage is too slow to operate on directly and the fast memory is wiped when it loses power. The result is that all non-ephemeral data is ultimately stored as files in the filesystem on disk. Arvo on the other hand is completely different.

Arvo has no concept of volatile memory - its whole state is assumed to be persistent. This means it's unnecessary for a Gall agent to write its data to the filesystem or read it in from the filesystem - an agent can just modify its state in situ and leave it there. The urbit runtime writes events to disk and backs up Arvo's state on the host OS to ensure data integrity but Arvo itself isn't concerned with such details.

The result of this total persistence is that the filesystem&mdash;Clay&mdash;does not have the same fundamental role as on an ordinary OS. In Arvo, very little of its data is actually stored in Clay. The vast majority is just in the state of Gall agents and vanes. For example, none of the chat messages, notebooks, etc, in the Tlon app exist in Clay - they're all in the state of the `%channels` agent. For the most part, Clay just stores source code.

Clay has a few unique features&mdash;it's a typed filesystem, with all file types defined in mark files. It's revision controlled, in a similar way to Git. It also has a built-in build system (formerly a separate vane called Ford, but was merged with Clay in 2020 to make atomicity of upgrades easier). We'll look at some of these features in more detail later in the guide.

## Desk Anatomy {#desk-anatomy}

The fundamental unit in Clay is a desk. Desks are kind of like git repositories. By default, new urbits come with the following desks included: `%base`, `%landscape`, `%groups` and `%webterm`.

- `%base` - This desk contains the kernel as well as some core agents and utilities.
- `%landscape` - This desk contains agents and utilities for managing apps, and the home screen that displays other app tiles.
- `%groups` - This desk contains everything for the Groups app.
- `%webterm` - This desk is for the web Dojo app.

You'll typically also have a `%kids` desk, which is just a copy of `%base` from upstream that sponsored ships (moons in the case of a planet, planets in the case of a star) sync their `%base` desk from. Any third-party apps you've installed will also have their own desks.

Desks are typically assumed to store their files according to the following directory structure:

```
desk
├── app
├── gen
├── lib
├── mar
├── sur
├── sys
├── ted
└── tests
```

- `/app`: Gall agents.
- `/gen`: Generators.
- `/lib`: Libraries - these are imported with the `/+` Ford rune.
- `/mar`: mark files, which are filetype definitions.
- `/sur`: Structures - these typically contain type definitions and structures, and would be imported with the `/-` Ford rune.
- `/sys`: Kernel files and standard library. Only the `%base` desk has this directory, it's omitted entirely in all other desks.
- `/ted`: Threads.
- `/tests`: Unit tests, to be run by the `%test` thread. This is often omitted in distributed desks.

This directory hierarchy is not strictly enforced, but most tools expect things to be in their right place. Any of these folders can be omitted if they'd otherwise be empty.

As mentioned, the `%base` desk alone includes a `/sys` directory containing the kernel and standard libraries. It looks like this:

```
sys
├── arvo.hoon
├── hoon.hoon
├── lull.hoon
├── vane
│   ├── ames.hoon
│   ├── behn.hoon
│   ├── clay.hoon
│   ├── dill.hoon
│   ├── eyre.hoon
│   ├── gall.hoon
│   ├── iris.hoon
│   ├── jael.hoon
│   ├── khan.hoon
│   └── lick.hoon
└── zuse.hoon
```

- `/arvo.hoon`: Source code for Arvo itself.
- `/hoon.hoon`: Hoon standard library and compiler.
- `/lull.hoon`: Mostly structures and type definitions for interacting with vanes.
- `/$vane`: This directory contains the source code for each of the vanes.
- `/zuse.hoon`: This is an extra utility library. It mostly contains cryptographic functions and functions for dealing with web data like JSON.

The chain of dependency for the core kernel files is `hoon.hoon` -> `arvo.hoon` -> `lull.hoon` -> `zuse.hoon`. For more information, see the [Filesystem Hierarchy](../../system/kernel/clay/guides/filesystem.md) documentation.

In addition to the directories discussed, there's a handful of special files a desk might contain. All of them live in the root of the desk, and all are optional in the general case, except for `sys.kelvin`, which is mandatory.

- `sys.kelvin`: Specifies the kernel version with which the desk is compatible.
- `desk.bill`: Specifies Gall agents to be auto-started upon desk installation.
- `desk.ship`: If the desk is being republished, the original publisher can be specified here.
- `desk.docket-0`: Configures the front-end, tile, and other metadata for desks which include a home screen app.

Each desk must be self-contained; it must include all the marks, libraries, threads, etc, that it needs. The one exception is the kernel and standard libraries from the `%base` desk. Agents, threads and generators in other desks all have these libraries available to them in their subject.

## APIs {#apis}

You should now have a general idea of the different parts of Arvo, but how does a Gall agent interact with these things?

There are two basic ways of interacting with other parts of the system: by scrying into them, and by passing them messages and receiving messages in response. There are also two basic things to interact with: vanes, and other agents.

- Scries: The scry system allows you to access the state of other agents and vanes in a read-only fashion. Scries can be performed from any context with the dotket (`.^`) rune. Each vane has "scry endpoints" which define what you can read, and these are comprehensively documented in the Scry Reference of each vane's section of the [Arvo documentation](../../system/kernel/arvo). Agents define scry endpoints in the `+on-peek` arm of their agent core. Scries can only be done on the local ship; it is not yet possible to perform scries over the network (but this functionality is planned for the future). There is a separate [guide to scries](../../system/kernel/arvo/guides/scry.md) which you might like to read through for more details.
- Messages:
  - Vanes: Each vane has a number of `$task`s it can be passed and `$gift`s it can respond with in its respective section of `/sys/lull.hoon`. These might do all manner of things, depending on the vane. For example, Iris might fetch an external HTTP resource for you, Clay might read or build a specified file, etc. The `$task`s and `$gift`s of each vane are comprehensively documented in the API Reference of each vane's section of the [Arvo documentation](../../system/kernel/arvo).
  - Agents: These can be `%poke`d with some data, which is a request to perform a single action. They can also be `%watch`ed, which means to subscribe for updates. We'll discuss these in detail later in the guide.

Here's a simplified diagram of the ways an agent can interact with other parts of the system:

![](https://media.urbit.org/guides/core/app-school/api-diagram.svg)

Things like `+on-poke` are arms of the agent core. Don't worry about their meaning for now, we'll discuss them in detail later in the guide.

Inter-agent messaging can occur over the network, so you can interact with agents on other ships as well as local ones. You can only talk to local vanes, but some vanes like Clay are able to make requests to other ships on your behalf. Note this summary is simplified - vanes don't just talk in `$task`s and `$gift`s in all cases. For example, requests from HTTP clients through Eyre (the webserver vane) behave more like those from agents than vanes, and a couple of other vanes also have some different behaviours. Agent interactions are also a little more complicated, and we'll discuss that later, but the basic patterns described here cover the majority of cases.

## Environment Setup {#environment-setup}

Before proceeding with App School, you'll need to have an appropriate text editor installed and configured, and know how to work with a fake ship for development. Best practices are described in the [environment setup guide](../environment.md). Example agents and other code throughout this guide will just be committed to the `%base` desk of a fake ship, but it's a good idea to have a read through that guide for when you begin work on your own apps.
