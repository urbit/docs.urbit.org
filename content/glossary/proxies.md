# Proxies

**Proxies** are Ethereum addresses in the [Urbit ID](urbit-docs/glossary/azimuth) system that have limited powers. They are lower-powered "siblings" of the ownership key, which has the sole power to transfer the assigned Urbit identity. Using [Bridge](urbit-docs/glossary/bridge), you can change the Ethereum addresses used for your proxies. If you use the [Urbit HD wallet](urbit-docs/glossary/hdwallet), your proxies have already been set.

There are three types of proxy.

- **Management Proxy**

The management proxy can configure or set Arvo networking keys and conduct sponsorship-related operations.

- **Voting Proxy**

The voting proxy can cast votes on behalf of its assigned point on new proposals, including changes to [Ecliptic](urbit-docs/glossary/ecliptic). The voting proxy is unique to [galaxies](urbit-docs/glossary/galaxy), since only power galaxies have seats in the Senate.

- **Spawn Proxy**

Creates new child points given Ethereum address. For [stars](urbit-docs/glossary/star) and [galaxies](urbit-docs/glossary/galaxy) only.


### Further Reading

- [Azimuth glossary page](urbit-docs/glossary/azimuth): The glossary entry for Azimuth.
- [The Azimuth concepts page](urbit-docs/system/identity/guides/advanced-azimuth-tools): A more in-depth explanation of Azimuth, including information the storage of Urbit identities.
