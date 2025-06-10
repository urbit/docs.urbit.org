# Naive rollups

**Naive rollups**, also referred to as **layer 2**, is an upgrade to [Azimuth](azimuth.md) implemented in 2021 that reduces Ethereum gas costs associated with Urbit ID transactions and friction associated with using cryptocurrency in general.

This system allows batches of Urbit ID transactions to be submitted together as a single transaction using an urbit node known as a "roller". The PKI state transitions resulting from these transactions are computed locally by your [ship](ship.md) rather than by the [Ethereum Virtual Machine](https://ethereum.org/en/developers/docs/evm/).

Due to the dramatically reduced cost, Tlon offers their own roller that is free for ordinary public use. This enables new users to get started with a permanent Urbit ID without any prior knowledge of Ethereum, cryptocurrency, or blockchains.

### Further reading <a href="#further-reading" id="further-reading"></a>

* [Layer 2 for planets](../user-manual/id/layer-2-for-planets.md): Essential information for planet owners on layer 2 or considering a move to layer 2
* [The Gang Solves the Gas Crisis](https://urbit.org/blog/rollups): A casual overview of how naive rollups works.
* [Layer 2 Overview](../urbit-id/concepts/layer2.md): where developers should go to learn about the technical details of naive rollups.
* [Custom Roller Tutorial](../urbit-id/guides/roller-tutorial.md): tutorial on how to set up your own L2 roller.
