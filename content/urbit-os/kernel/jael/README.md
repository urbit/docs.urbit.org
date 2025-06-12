# Jael

Jael is Arvo's module for networking key infrastructure.

The main purpose of Jael is keeping track of [Azimuth](../../../urbit-id/what-is-urbit-id.md)-related information.

This includes:

* Every known Urbit [ship](../../../glossary/ship.md)'s public keys.
* Every known Urbit ship's [key revision number and continuity breach number](../../../urbit-id/concepts/life-and-rift.md).
* Every known Urbit ship's [sponsor](../../../glossary/sponsor.md).

It also handles the local ship's private keys, keeps track of [galaxy](../../../glossary/galaxy.md) domain prexifes, and performs some tasks related to booting the local ship for the first time.

The database of PKI information that Jael maintains is used by other modules and applications for identity validation, encryption, decryption, and other cryptographic functions.

In particular, [Ames](../ames/) uses the information stored in Jael to encrypt packets it sends to other ships, and to decrypt and validate packets it receives from them.

Jael has a few `$task`s you can use to interact with it. In particular, its [`%public-keys` task](reference/tasks.md#public-keys) allows an application or thread to subscribe for PKI updates for a set of ships.
