# Vere

**Vere**, pronounced "Vair", is the [Nock](nock.md) runtime environment and Urbit virtual machine. Vere is written in C, runs on Unix, and is the intermediate layer between your urbit and Unix. Unix system calls are made by Vere, not Arvo; Vere must also encode and deliver relevant external events to [Arvo](arvo.md). Vere is also responsible for implementing jets and maintaining the persistent state of each urbit (computed as a pure function of its [event log](eventlog.md) with [Replay](replay.md)). It also contains the I/O drivers for Urbit’s vanes, which are responsible for generating events from Unix and applying effects to Unix.

When you boot your [ship](ship.md), Vere passes your [Azimuth](azimuth.md) [keyfile](keyfile.md) into the Arvo state, allowing a connection to the [Ames](ames.md) network.

Vere consists of two processes that communicate via a socket: a daemon process in charge of managing I/O channels, and a worker process that acts as a Nock interpreter that is instructed by the daemon process.

### Further Reading {#further-reading}

- [The Technical Overview](/overview/)
- [The Vere tutorial](../system/runtime): An in-depth technical guide to Vere.
