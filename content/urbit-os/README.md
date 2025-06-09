# Urbit OS

Urbit OS is a personal server operating system that runs on any Unix box as a self-contained virtual machine.

It's sometimes described as an "operating function": the current state of your urbit is computed by running its history through one function, called [Nock](../nock). It's simple to understand, easy to secure, and trivial to reproduce exactly.

This section describes the two components of Urbit OS proper: the kernel, called "Arvo", and its standard distribution (the "`%base` desk") that contains other essential functionality.

If you're looking for one detailed overview of Urbit OS, read [the 2016 whitepaper](https://media.urbit.org/whitepaper.pdf) and [this 2024 article](https://urbitsystems.tech/article/v01-i01/eight-years-after-the-whitepaper) on what's changed since the whitepaper's publication.

For information on the Urbit runtime that interprets Nock and talks to the host machine, see the [runtime](../build-on-urbit/runtime) section.
