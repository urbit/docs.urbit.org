# Keyfile

A **keyfile** is a piece of information used to associate a [ship](ship.md) with an Urbit identity so that the ship can use the [Arvo](arvo.md) network. A keyfile is dependent upon the [networking keys](bridge.md) that have been set for the identity; we recommend using [Bridge](bridge.md) to set the networking keys and to generate the corresponding keyfile.

The keyfile is used as an argument in the command line when booting a ship. During the boot process, [Vere](vere.md) passes the keyfile into the Arvo state.

### Further Reading {#further-reading}

- [Installation Guide](../get-on-urbit.md): Instructions on using a keyfile to boot a ship.
