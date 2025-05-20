# Bridge

**Bridge** is a client made for interacting with [Azimuth](azimuth.md). It's the recommended way to receive, send, and manage your Urbit identity, and it's by far the easiest way to generate the [keyfile](keyfile.md) required to boot your [ship](ship.md). Most Bridge functions are accessed by "logging in" to an identity's ownership address or one of its [proxy addresses](proxies.md). It's accessed at [bridge.urbit.org](https://bridge.urbit.org/).

Below are some important functions of Bridge.

#### Actions

- **Claim an invite**: If you've been given a planet invite code/link, you claim the planet through Bridge.
- **Spawn Planets/Stars:** Spawn a child from a [galaxy](galaxy.md) or a [star](star.md). If on [L2](rollups.md), you can generate planet invite codes.
- **Accept sponsorship request:** - Accept a sponsorship request to a galaxy or star.
- **Transfer:** Send the Urbit identity to another Ethereum address or a new Master Ticket.
- **Accept incoming transfer:** If someone is trying to send you an Urbit identity, you must use this action to receive it.
- **Cancel outgoing transfer:** Cancel a transfer that you initiated before the recipient has accepted it.
- **Generate Arvo keyfile:** Generate the keyfile to boot a ship with your Urbit identity.
- **Change spawn proxy:** Assign your spawn proxy to a new Ethereum address, or set it to L2.
- **Change management proxy:** Assign your transfer proxy to a new Ethereum address.
- **Set network keys:** Set new authentication and encryption keys used on your Arvo ship. Will change your Arvo keyfile.
- **Transfer to L2**: Transfer an [L1](azimuth.md) point to L2.

### Further Reading {#further-reading}

- [bridge.urbit.org](https://bridge.urbit.org/): The Bridge website.
- [Using Bridge](../manual/id/using-bridge.md): A guide to starting out with Bridge.
- [The Azimuth concepts page](../system/identity/guides/advanced-azimuth-tools.md): A more in-depth explanation of our identity layer.
