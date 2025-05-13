# Keyfile

A **keyfile** is a piece of information used to associate a [ship](glossary/ship) with an Urbit identity so that the ship can use the [Arvo](glossary/arvo) network. A keyfile is dependent upon the [networking keys](glossary/bridge) that have been set for the identity; we recommend using [Bridge](glossary/bridge) to set the networking keys and to generate the corresponding keyfile.

The keyfile is used as an argument in the command line when booting a ship. During the boot process, [Vere](glossary/vere) passes the keyfile into the Arvo state.

### Further Reading

- [Installation Guide](manual/getting-started): Instructions on using a keyfile to boot a ship.
