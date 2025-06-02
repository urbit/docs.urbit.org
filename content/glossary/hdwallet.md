# HD Wallet

The **Urbit HD Wallet** (_Hierarchical Deterministic_ Wallet) is a system of related Ethereum addresses that's used to store and manage an Urbit identity. Each of these Ethereum addresses have different powers over the same identity, from setting networking keys for communicating in the [Arvo](arvo.md) network to transferring ownership of identities.

The Ethereum address that has full powers over a given Urbit identity, including the ability to transfer ownership of the identity, is called the ownership address. Ethereum addresses with fewer powers – the ability to transfer ownership being notably absent – are known as [proxies](proxies.md). This scheme of compartmentalized powers allows wallet holders to only handle less valuable keys when they want to perform operations on an Urbit identity without risking their entire asset.

If a proxy or ownership address is compromised or has its keys lost, it can always be rederived using the master ticket, which is the piece of entropy that was initially used to derive the HD wallet.

### Further Reading {#further-reading}

- [The Azimuth concepts page](../system/identity): A more in-depth explanation of Azimuth.
- [Urbit HD Wallet](../urbit-id/concepts/hd-wallet.md): An in-depth explanation of the HD wallet.
