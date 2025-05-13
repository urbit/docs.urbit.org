# Kernel {#kernel}

- [Arvo](arvo) - Arvo is the kernel itself.
- [Ames](ames) - Ames is the name of our network and the vane that communicates over it. It's an encrypted P2P network composed of instances of the Arvo operating system.
- [Behn](behn) - Behn is our timer. It allows vanes and applications to set and timer events, which are managed in a simple priority queue.
- [Clay](clay) - Clay is our filesystem and revision-control system.
- [Dill](dill) - Dill is our terminal driver. Unix sends keyboard events to dill from the terminal, and dill produces terminal output.
- [Eyre](eyre) - Eyre is our HTTP server. Unix sends HTTP messages to Eyre, and Eyre produces HTTP messages in response.
- [Gall](gall) - Gall is the vane for controlling userspace apps.
- [Iris](iris) - Iris is our HTTP client.
- [Jael](jael) - Jael manages keys and Azimuth state.
- [Khan](khan) - Khan is our thread dispatcher.
- [Lick](lick) - Lick is the IPC vane, for communicating with processes on the host.
