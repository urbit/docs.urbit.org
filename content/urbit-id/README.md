# Identity

Azimuth is a general-purpose public-key infrastructure (PKI) on the Ethereum blockchain, used as a platform for _Urbit identities_. You need such an identity to use the Arvo network.

## Arvo vs. Azimuth {#arvo-vs-azimuth}

Urbit is a project, not a single computer system. It has multiple components: Arvo, the operating system, and Azimuth, the identity system. Let's compare them.

**Arvo** is an operating system that provides the software for a personal server. These personal servers together constitute the peer-to-peer Arvo network. To make this network work on the social level, Arvo is built to work with a system of scarce and immutable identities.

**Azimuth** is the public-key infrastructure built to be a system of scarce and immutable identities. It consists of a suite of [smart contracts on the Ethereum blockchain](https://github.com/urbit/azimuth) as well as [several apps](concepts/flow.md) run locally on your urbit. Togeter, they determine which Ethereum addresses own which Urbit ID's as well as the public keys needed to communicate with those ID's. All identity-related operations, such as transfers, are governed by Azimuth. Azimuth isn't built strictly for Arvo -- the smart contracts on Ethereum are sufficient to be used as a generalized identity system for other projects. Azimuth is considered to be the technical nomenclature for the PKI, while Urbit ID is the common nomenclature.

These otherwise-parallel systems meet when you want to connect to the Arvo network. Your Arvo personal server, called your _ship_, needs to be able to prove cryptographically that it is who it says it is. This proof comes in the form of a keyfile, derived from your identity, that you use to start your ship.

A metaphor might help illustrate the relationship between these two systems: the Arvo network is the neighborhood that you live in; Azimuth is the bank vault that stores the deed to your house.

## Smart contracts {#smart-contracts}

Azimuth consists of the following smart contracts:

- [Azimuth.eth](https://etherscan.io/address/azimuth.eth) `0x223c067f8cf28ae173ee5cafea60ca44c335fecb`: contains all on-chain state for Azimuth. Most notably, ownership and public keys. Can't be modified directly, you must use the Ecliptic.
- [Ecliptic.eth](https://etherscan.io/address/ecliptic.eth): `0x9ef27de616154FF8B38893C59522b69c7Ba8A81c ` is used as an interface for interacting with your points on-chain. Allows you to configure keys, transfer ownership, etc.
- [Polls](https://etherscan.io/address/0x7fecab617c868bb5996d99d95200d2fa708218e4): `0x7fecab617c868bb5996d99d95200d2fa708218e4` registers votes by the Galactic Senate on proposals. These can be either static documents or Ecliptic upgrades.
- [Linear Star Release](https://etherscan.io/address/0x86cd9cd0992f04231751e3761de45cecea5d1801): facilitates the release of blocks of stars to their owners over a period of time.
- [Conditional Star Release](https://etherscan.io/address/0x8c241098c3d3498fe1261421633fd57986d74aea): `0x8c241098c3d3498fe1261421633fd57986d74aea` facilitates the release of blocks of stars to their owners based on milestones.
- [Claims](https://etherscan.io/address/0xe7e7f69b34d7d9bd8d61fb22c33b22708947971a): `0xe7e7f69b34d7d9bd8d61fb22c33b22708947971a` allows point owners to make claims about (for example) their identity, and associate that with their point.
- [Censures](https://etherscan.io/address/0x325f68d32bdee6ed86e7235ff2480e2a433d6189): `0x325f68d32bdee6ed86e7235ff2480e2a433d6189` simple reputation management, allowing galaxies and stars to flag points for negative reputation.
- [Delegated Sending](https://etherscan.io/address/0xf6b461fe1ad4bd2ce25b23fe0aff2ac19b3dfa76): enables network-effect like distributing of planets.

Walkthroughs of some of the smart contracts are linked to [below](#other).

## General Azimuth Resources {#general-azimuth-resources}

These documents pertain to L1 and other general aspects of Azimuth. For L2 docs, [see below](#naive-rollups).

- [HD Wallet](concepts/hd-wallet.md) - Azimuth has its own optional hierarchical deterministic wallet system, often referred to as a "master ticket".
- [Data Flow](concepts/flow.md) - Diagrams and explanations of how data flows between Bridge and the various components inside Urbit involved with Azimuth and L2.
- [Azimuth.eth](reference/azimuth-eth.md) - A description of the azimuth.eth smart contract, which is the data store for Azimuth.
- [Ecliptic.eth](reference/ecliptic.md) - A description of the ecliptic.eth smart contract, which is the business logic for azimuth.eth. This includes an overview of all function calls available.
- [Advanced Azimuth Tools](guides/advanced-azimuth-tools.md) - Expert-level tooling for generating, signing, and sending layer 1 Azimuth transactions from within Urbit itself.
- [Life and Rift](concepts/life-and-rift.md) - An explanation of how Azimuth indexes networking keys revisions and breaches to keep track of the most recent set of networking keys necessary to communicate with a ship.

## Naive rollups {#naive-rollups}

In 2021, a new system was introduced to Azimuth called **naive rollups**, and often referred to as **layer 2** or L2. It was intended to reduce gas costs for working with Urbit ID and friction associated with using cryptocurrency in general. This system allows batches of Azimuth transactions to be submitted together as a single transaction using an Urbit node known as a "roller". The PKI state transitions resulting from these transactions are computed locally by your urbit rather than by the [Ethereum Virtual Machine](https://ethereum.org/en/developers/docs/evm/).

Due to the dramatically reduced cost, Tlon offers their own roller that is free for ordinary public use. This enables new users to get started with a permanent Azimuth identity without any prior knowledge of Ethereum, cryptocurrency, or blockchains. However, anybody can run a roller, and even using your own ship as a roller to submit single transactions results in significant savings.

L2 operator and developer resources:

- [Layer 2 Overview](concepts/layer2.md) - An overview of how naive rollups work.
- [Custom Roller Tutorial](guides/roller-tutorial.md) - A guide to running your own L2 roller locally.
- [Actions Reference](reference/l2-actions.md) - Details of the L2 API's possible actions.
- [Transaction Format Reference](reference/bytestring.md) - Details of the bytestring format for L2 transactions and batches.
- [Rollers](reference/roller.md) - Overview of the L2 roller system.
- [Roller HTTP RPC-API](reference/roller.md) - A diagram summarizing the L2 API calls.
