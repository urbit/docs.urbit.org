# Keyfile

A **keyfile** is a piece of information used to associate a [ship](urbit-docs/glossary/ship) with an Urbit identity so that the ship can use the [Arvo](urbit-docs/glossary/arvo) network. A keyfile is dependent upon the [networking keys](urbit-docs/glossary/bridge) that have been set for the identity; we recommend using [Bridge](urbit-docs/glossary/bridge) to set the networking keys and to generate the corresponding keyfile.

The keyfile is used as an argument in the command line when booting a ship. During the boot process, [Vere](urbit-docs/glossary/vere) passes the keyfile into the Arvo state.

### Further Reading

- [Installation Guide](urbit-docs/manual/getting-started): Instructions on using a keyfile to boot a ship.
