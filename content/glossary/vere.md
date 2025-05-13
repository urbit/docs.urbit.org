# Vere

**Vere**, pronounced "Vair", is the [Nock](urbit-docs/glossary/nock) runtime environment and Urbit virtual machine. Vere is written in C, runs on Unix, and is the intermediate layer between your urbit and Unix. Unix system calls are made by Vere, not Arvo; Vere must also encode and deliver relevant external events to [Arvo](urbit-docs/glossary/arvo). Vere is also responsible for implementing jets and maintaining the persistent state of each urbit (computed as a pure function of its [event log](urbit-docs/glossary/eventlog) with [Replay](urbit-docs/glossary/replay)). It also contains the I/O drivers for Urbit’s vanes, which are responsible for generating events from Unix and applying effects to Unix.

When you boot your [ship](urbit-docs/glossary/ship), Vere passes your [Azimuth](urbit-docs/glossary/azimuth) [keyfile](urbit-docs/glossary/keyfile) into the Arvo state, allowing a connection to the [Ames](urbit-docs/glossary/ames) network.

Vere consists of two processes that communicate via a socket: a daemon process in charge of managing I/O channels, and a worker process that acts as a Nock interpreter that is instructed by the daemon process.

### Further Reading

- [The Technical Overview](urbit-docs/overview/)
- [The Vere tutorial](urbit-docs/system/runtime/): An in-depth technical guide to Vere.
