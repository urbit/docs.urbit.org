# Kernel

The **kernel** is the core, fundamental components of an operating system. In the case of [Arvo](arvo), it is `arvo.hoon`, its [vanes](vane) (kernel modules), and associated libraries. The code for Arvo's kernel is located in the `/sys` directory of the `%base` [desk](desk). "Kernelspace" is contrasted with "userspace", which includes [agents](agent), [threads](thread), [generators](generator), front-end resources and other non-kernel files in [Clay](clay).

#### Further reading

- [Arvo overview](../system/kernel): Technical overview of Arvo.
