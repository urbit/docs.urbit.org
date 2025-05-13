# Kernel

- [Arvo](urbit-docs/system/kernel/arvo) - Arvo is the kernel itself.
- [Ames](urbit-docs/system/kernel/ames) - Ames is the name of our network and the vane that communicates over it. It's an encrypted P2P network composed of instances of the Arvo operating system.
- [Behn](urbit-docs/system/kernel/behn) - Behn is our timer. It allows vanes and applications to set and timer events, which are managed in a simple priority queue.
- [Clay](urbit-docs/system/kernel/clay) - Clay is our filesystem and revision-control system.
- [Dill](urbit-docs/system/kernel/dill) - Dill is our terminal driver. Unix sends keyboard events to dill from the terminal, and dill produces terminal output.
- [Eyre](urbit-docs/system/kernel/eyre) - Eyre is our HTTP server. Unix sends HTTP messages to Eyre, and Eyre produces HTTP messages in response.
- [Gall](urbit-docs/system/kernel/gall) - Gall is the vane for controlling userspace apps.
- [Iris](urbit-docs/system/kernel/iris) - Iris is our HTTP client.
- [Jael](urbit-docs/system/kernel/jael) - Jael manages keys and Azimuth state.
- [Khan](urbit-docs/system/kernel/khan) - Khan is our thread dispatcher.
- [Lick](urbit-docs/system/kernel/lick) - Lick is the IPC vane, for communicating with processes on the host.
