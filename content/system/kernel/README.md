# Kernel

- [Arvo](system/kernel/arvo) - Arvo is the kernel itself.
- [Ames](system/kernel/ames) - Ames is the name of our network and the vane that communicates over it. It's an encrypted P2P network composed of instances of the Arvo operating system.
- [Behn](system/kernel/behn) - Behn is our timer. It allows vanes and applications to set and timer events, which are managed in a simple priority queue.
- [Clay](system/kernel/clay) - Clay is our filesystem and revision-control system.
- [Dill](system/kernel/dill) - Dill is our terminal driver. Unix sends keyboard events to dill from the terminal, and dill produces terminal output.
- [Eyre](system/kernel/eyre) - Eyre is our HTTP server. Unix sends HTTP messages to Eyre, and Eyre produces HTTP messages in response.
- [Gall](system/kernel/gall) - Gall is the vane for controlling userspace apps.
- [Iris](system/kernel/iris) - Iris is our HTTP client.
- [Jael](system/kernel/jael) - Jael manages keys and Azimuth state.
- [Khan](system/kernel/khan) - Khan is our thread dispatcher.
- [Lick](system/kernel/lick) - Lick is the IPC vane, for communicating with processes on the host.
