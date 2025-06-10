# What is Urbit ID?

Urbit ID is Urbit's identity standard. It's decentralized, secure, and human-meaningful. It's basis is [a public-key infrastructure (PKI) implemented with NFTs on the Ethereum blockchain](https://urbit.org/blog/pki-maze).

You need an Urbit ID to get on the Urbit network. Your Urbit ID allows your Urbit OS server to cryptographically sign every message it sends over the network: everything you see on Urbit really comes from who it says it does.

### Network topology <a href="#network-topology" id="network-topology"></a>

Like any peer-to-peer network, Urbit needs topographic affordances for bootstrapping peer discovery. Some notions of governance, ownership, and reputation are nice-to-haves. Urbit solves these issues by dividing the address space into five "ranks":

* **Galaxies:** These 2^8 (256) nodes make up Urbit's Galactic Senate, which ratifies governance proposals and votes on smart contract upgrades. The Senate also elects the Board of Directors of the Urbit Foundation. They spawn and sponsor stars.
* **Stars:** These 2^16 (65,536) nodes distribute software updates to their sponsees. Eventually they may be used for peer discovery. They spawn and sponsor planets.
* **Planets:** There are 2^32 (\~4 billion) nodes are for day-to-day individual usage. They spawn and sponsor moons.
* **Moons:** Every planet can spawn \~4 billion moons, which are ideal for identifying machines tied to their owner's planet. Today, these are mostly used by app developers to host software distribution nodes on cloud servers.
* **Comets:** Urbit ID also has room for 2^64 (\~18 quintillion) free, anonymous, disposable identities. They aren't sponsored and don't interact with the blockchain at all.

Technically, "sponsorship" just means that the sponsor is responsible for distributing software updates to the sponsee. Whether this sponsorship chain means that one node endorses another as trustworthy is totally implicit.

### Smart contracts <a href="#smart-contracts" id="smart-contracts"></a>

Urbit ID ownership is stored on a smart contract at `azimuth.eth`, and that store is goverend by a contract at `ecliptic.eth`. Other contracts provide supplementary functionality.

You can read these contracts on Etherscan:

* [Azimuth.eth](https://etherscan.io/address/azimuth.eth) `0x223c067f8cf28ae173ee5cafea60ca44c335fecb`: Contains all on-chain state for Urbit ID. Most notably, ownership and public keys. Can't be modified directly, you must use Ecliptic.
* [Ecliptic.eth](https://etherscan.io/address/ecliptic.eth) `0x9ef27de616154FF8B38893C59522b69c7Ba8A81c`: An interface for interacting with Azimuth. Allows you to configure keys, transfer ownership, etc.
* [Polls](https://etherscan.io/address/0x7fecab617c868bb5996d99d95200d2fa708218e4) `0x7fecab617c868bb5996d99d95200d2fa708218e4`: Registers votes on governance proposals by Urbit's Galactic Senate. These can be either static documents or Ecliptic upgrades.
* [Linear Star Release](https://etherscan.io/address/0x86cd9cd0992f04231751e3761de45cecea5d1801) `0x86cd9cd0992f04231751e3761de45cecea5d1801`: Facilitates the release of blocks of stars to their owners over a period of time.
* [Conditional Star Release](https://etherscan.io/address/0x8c241098c3d3498fe1261421633fd57986d74aea) `0x8c241098c3d3498fe1261421633fd57986d74aea`: Facilitates the release of blocks of stars to their owners based on milestones.
* [Claims](https://etherscan.io/address/0xe7e7f69b34d7d9bd8d61fb22c33b22708947971a) `0xe7e7f69b34d7d9bd8d61fb22c33b22708947971a`: Allows point owners to make claims about (for example) their identity, and associate that with their point.
* [Censures](https://etherscan.io/address/0x325f68d32bdee6ed86e7235ff2480e2a433d6189) `0x325f68d32bdee6ed86e7235ff2480e2a433d6189`: Simple reputation management, allowing galaxies and stars to flag points for negative reputation.
* [Delegated Sending](https://etherscan.io/address/0xf6b461fe1ad4bd2ce25b23fe0aff2ac19b3dfa76) `0xf6b461fe1ad4bd2ce25b23fe0aff2ac19b3dfa76`: Enables network-effect like distributing of planets.

### General Azimuth Resources <a href="#general-azimuth-resources" id="general-azimuth-resources"></a>

These documents pertain to L1 and other general aspects of Azimuth. For L2 docs, [see below](#naive-rollups).

* [HD Wallet](./concepts/hd-wallet.md) - Azimuth has its own optional hierarchical deterministic wallet system, often referred to as a "master ticket".
* [Data Flow](./concepts/flow.md) - Diagrams and explanations of how data flows between Bridge and the various components inside Urbit involved with Azimuth and L2.
* [Azimuth.eth](./reference/azimuth-eth.md) - A description of the azimuth.eth smart contract, which is the data store for Azimuth.
* [Ecliptic.eth](./reference/ecliptic.md) - A description of the ecliptic.eth smart contract, which is the business logic for azimuth.eth. This includes an overview of all function calls available.
* [Advanced Azimuth Tools](./guides/advanced-azimuth-tools.md) - Expert-level tooling for generating, signing, and sending layer 1 Azimuth transactions from within Urbit itself.
* [Life and Rift](./concepts/life-and-rift.md) - An explanation of how Azimuth indexes networking keys revisions and breaches to keep track of the most recent set of networking keys necessary to communicate with a ship.

### Naive rollups <a href="#naive-rollups" id="naive-rollups"></a>

In 2021, Tlon introduced a new component to Azimuth called **naive rollups**, and often referred to as Urbit ID's "Layer 2" or "L2". It was intended to reduce gas costs for working with Urbit ID and the friction associated with using cryptocurrency in general. This system allows batches of transactions with `azimuth.eth` to be submitted together as a single transaction, using an Urbit node known as a "roller". The PKI state transitions resulting from these transactions are computed locally by your urbit rather than by the [Ethereum Virtual Machine](https://ethereum.org/en/developers/docs/evm/).

Due to the extremely low cost, Tlon offers their own roller that is free for ordinary public use. This enables new users to get started with a permanent Urbit ID without any prior knowledge of Ethereum, cryptocurrency, or blockchains. Anybody can run a roller, and you can even use your own ship as a roller to submit single transactions.

#### Layer 2 resources <a href="#layer-2-resources" id="layer-2-resources"></a>

* [Layer 2 Overview](./concepts/layer2.md) - An overview of how naive rollups work.
* [Custom Roller Tutorial](./guides/roller-tutorial.md) - A guide to running your own L2 roller locally.
* [Actions Reference](./reference/l2-actions.md) - Details of the L2 API's possible actions.
* [Transaction Format Reference](./reference/bytestring.md) - Details of the bytestring format for L2 transactions and batches.
* [Roller](./reference/roller.md) - Overview of the L2 roller system.
