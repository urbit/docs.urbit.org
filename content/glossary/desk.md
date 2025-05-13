# Desk

A **desk** is an independently revision-controlled branch of a [ship](ship.md) that uses the [Clay](clay.md) filesystem. Each desk contains its own apps, [mark](mark.md) definitions, files, and so forth.

Traditionally a ship has at least a `%base` desk, and typically `%landscape` and `%webterm` desk among others. The `%base` desk has the kernel and base system software, while other desks are usually each for different apps. A desk is a series of numbered commits, the most recent of which represents the current state of the desk. A commit is composed of:

1. An absolute time when it was created.
2. A list of zero or more parents.
3. A map from paths to data.

### Further Reading

- [Using Your Ship](https://urbit.org/using/os/filesystem): A user guide that includes instructions for using desks.
