# Arvo

**Arvo** is the Urbit operating system and kernel. Arvo's state is a pure function of its [event log](eventlog.md), and it serves as the Urbit event manager. It contains [vanes](vane.md), which are kernel modules that perform essential system operations.

Arvo being purely functional means that the state of the operating system at a given moment is completely determined by the sequence of events in the event log. In other words, the state of an Arvo instance is given by a lifecycle function

```
L: History ➜ State
```

where `History` consists of the set of all possible sequences of events in an Arvo event log.

Arvo coordinates and reloads vanes. It can be thought of as a traffic-director. Any vane needs to go through Arvo before reaching another vane. Events and their effects happen like so:

```
Unix event -> Vere -> Arvo -> vane -> Arvo
```

Here, [Vere](vere.md) is the virtual machine running Urbit.

Arvo is located in `/base/sys/arvo.hoon` within your urbit.

Arvo vanes are [Ames](ames.md) for networking, [Behn](behn.md) for timing, [Clay](clay.md) for the filesystem and build system, [Dill](dill.md) for terminal driving, [Eyre](eyre.md) for the web server, [Gall](gall.md) for application management, [Iris](iris.md) for the HTTP client, [Jael](jael.md) for PKI management, and [Khan](khan.md) for external control and thread running. [Lick](lick.md) for external communication.

Vanes and other programs for Arvo are written in [Hoon](hoon.md).

A ship creates its own copy of Arvo via a bootstrap sequence known as a [Pill](pill.md).

### Further Reading {#further-reading}

- [The Arvo reference](../system/kernel) "BROKEN_LINK": An in-depth technical guide to Arvo and its vanes.
