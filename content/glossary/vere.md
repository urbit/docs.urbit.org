+++
title = "Vere"

[extra]
category = "hoon-nock"

[glossaryEntry.vere]
name = "vere"
symbol = ""
usage = "arvo"
desc = "The Nock runtime environment and Urbit virtual machine, running on Unix."

+++

**Vere**, pronounced "Vair", is the [Nock](/glossary/nock) runtime environment and Urbit virtual machine. Vere is written in C, runs on Unix, and is the intermediate layer between your urbit and Unix. Unix system calls are made by Vere, not Arvo; Vere must also encode and deliver relevant external events to [Arvo](/glossary/arvo). Vere is also responsible for implementing jets and maintaining the persistent state of each urbit (computed as a pure function of its [event log](/glossary/eventlog) with [Replay](/glossary/replay)). It also contains the I/O drivers for Urbit’s vanes, which are responsible for generating events from Unix and applying effects to Unix.

When you boot your [ship](/glossary/ship), Vere passes your [Azimuth](/glossary/azimuth) [keyfile](/glossary/keyfile) into the Arvo state, allowing a connection to the [Ames](/glossary/ames) network.

Vere consists of two processes that communicate via a socket: a daemon process in charge of managing I/O channels, and a worker process that acts as a Nock interpreter that is instructed by the daemon process.

### Further Reading

- [The Technical Overview](/overview/)
- [The Vere tutorial](/system/runtime/): An in-depth technical guide to Vere.
