# Dill

Dill is Arvo's terminal driver module, used to power Urbit's CLI.

Keyboard events from Unix are received by Dill and Dill sends responses to the Urbit runtime to be displayed in the Unix terminal.

For Urbit developers, the manner of interacting with Dill depends 

If you're an Urbit developer, the manner of interacting with Dill depends on whether you're interacting with it from an Urbit app or from within Arvo.

## Arvo {#arvo}

Dill performs a handful of system tasks related to booting a ship and some memory operations. Aside from those, Dill mostly just receives [tasks](reference/tasks.md) from Arvo to print error messages and the like to the terminal.

## Applications {#applications}

Applications are unlikely to pass tasks to Dill directly. Instead, Dill looks at things in terms of "sessions". A session is a pipeline between a client and a handler, where:
- The client is an external input source and output sink: a terminal with dimensions and so forth.
- The handler is an application in Urbit that interprets input, maybe does something with it, maybe produces output to be displayed in the client, etc.

Currently, Dill supports multiple sessions, but the Urbit runtime only supports a single Unix terminal client for the default session. This means any [non-default sessions will need to be linked](./reference/tasks.md#session-tasks) if they are to work in the Unix terminal.

By default Arvo has one CLI application running: Dojo. For more information on the `sole` library and the related `shoe` library, and for information on how to build CLI apps, you can refer to the [CLI app tutorial](../../../build-on-urbit/userspace/guides/cli-tutorial.md).

To give a basic idea of how keyboard events flow through these systems and produce terminal output, here's a diagram showing the messages in pseudo-Hoon:

![](https://media.urbit.org/docs/arvo/dill/dill-userspace.svg)

You can use a [move trace](../arvo/guides/move-trace.md) to get a hands-on feel for this data flow.

