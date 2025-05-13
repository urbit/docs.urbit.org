# Lick

Urbit's inter-process communication (IPC) vane.

Lick manages IPC ports, and the communication between Urbit applications and POSIX applications via these ports. Other vanes and applications ask Lick to open an IPC port, notify it when something is connected or disconnected, and transfer data between itself and the Unix application.

The IPC ports Lick creates are Unix domain sockets (`AF_UNIX` address family) of the `SOCK_STREAM` type.

The format of the full message with header and data sent to and from the socket is as follows:

|1 byte |4 bytes          |n bytes|
|-------|-----------------|-------|
|version|jam size in bytes|jamfile|

The version is currently `0`.

The [++jam](language/hoon/reference/stdlib/2p#jam)file contains a pair of `mark` and `noun`. The process on the host OS must therefore strip the first 5 bytes, [`++cue`](language/hoon/reference/stdlib/2p#cue) the jamfile, check the mark and (most likely) convert the noun into a native data structure.

Here are some libraries that can cue/jam:

- [`pynoun`](https://github.com/urbit/tools)
- [`nockjs`](https://github.com/urbit/nockjs)
- [Rust Noun](https://github.com/urbit/noun)

Lick has no novel data types in its API apart from `name`, which is just a `path` representing the name of a socket.

