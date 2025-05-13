# Arvo

**Arvo** is the Urbit operating system and kernel. Arvo's state is a pure function of its [event log](urbit-docs/glossary/eventlog), and it serves as the Urbit event manager. It contains [vanes](urbit-docs/glossary/vane), which are kernel modules that perform essential system operations.

Arvo being purely functional means that the state of the operating system at a given moment is completely determined by the sequence of events in the event log. In other words, the state of an Arvo instance is given by a lifecycle function

```
L: History ➜ State
```

where `History` consists of the set of all possible sequences of events in an Arvo event log.

Arvo coordinates and reloads vanes. It can be thought of as a traffic-director. Any vane needs to go through Arvo before reaching another vane. Events and their effects happen like so:

```
Unix event -> Vere -> Arvo -> vane -> Arvo
```

Here, [Vere](urbit-docs/glossary/vere) is the virtual machine running Urbit.

Arvo is located in `/base/sys/arvo.hoon` within your urbit.

Arvo vanes are [Ames](urbit-docs/glossary/ames) for networking, [Behn](urbit-docs/glossary/behn) for timing, [Clay](urbit-docs/glossary/clay) for the filesystem and build system, [Dill](urbit-docs/glossary/dill) for terminal driving, [Eyre](urbit-docs/glossary/eyre) for the web server, [Gall](urbit-docs/glossary/gall) for application management, [Iris](urbit-docs/glossary/iris) for the HTTP client, [Jael](urbit-docs/glossary/jael) for PKI management, and [Khan](urbit-docs/glossary/khan) for external control and thread running. [Lick](urbit-docs/glossary/lick) for external communication.

Vanes and other programs for Arvo are written in [Hoon](urbit-docs/glossary/hoon).

A ship creates its own copy of Arvo via a bootstrap sequence known as a [Pill](urbit-docs/glossary/pill).

### Further Reading

- [The Arvo reference](urbit-docs/system/kernel): An in-depth technical guide to Arvo and its vanes.
