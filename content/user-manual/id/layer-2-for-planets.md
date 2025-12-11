---
description: "How planet users can use Azimuth's Layer 2 rollup solution."
layout:
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# Layer 2 for planets

What does Layer 2 mean for planets? Cheap transaction fees which make it inexpensive to get on the network and manage your identity on the network.

Performing transactions directly on the Ethereum blockchain, ‘Layer 1’, has higher costs due to the transaction verification requirements of implementing Azimuth at the consensus layer. Urbit’s [Layer 2 solution](../../urbit-id/l2/README.md), called [naive rollups](https://urbit.org/blog/rollups), makes performing these transactions cheap or free. Planets can take advantage of this in the form of cheaper planet prices, as well as free Azimuth transactions (thanks to subsidization by Tlon, the main progenitor of the L2 rollup).

### What to know {#what-to-know}

- Migration is currently **one-way**. You cannot move a Layer 2 ID back to Layer 1. This includes planets that are spawned on Layer 2.
- You cannot interact with Layer 2 IDs using Layer 1 tools like OpenSea or Metamask. You will not be able to use your ID with smart contracts, or ‘see’ it using interfaces designed to support ERC721 NFTs. Urbit ID interfaces that support the L2 include [Bridge](https://bridge.urbit.org) and [Perigee](https://github.com/native-planet/perigee)
- Layer 2 does not have anything to do with networking between ships. Operating your ship on the network is not impacted by which layer it is on. You will be fully capable of communicating with ships on either layer.
- You can perform Layer 2 transactions for free with Tlon’s roller. A public roller operated by Tlon is connected to Bridge by default, but anyone can [operate a roller](../../urbit-id/roller-tutorial.md). Tlon’s roller offers free subsidized transactions up to a weekly limit of 25 operations.
- You will need to pay for the migration to L2. Migrating is a one-time process that takes place on Layer 1. You will need to fund it in the same way as a traditional Layer 1 Azimuth transaction.
- Your star sponsor can be on either layer. The layer that a star is on has no bearing on who it can sponsor. Bridge does sponsorship requests and acceptances on L2, but L1 transactions can be done on [Etherscan](https://etherscan.io/address/0x33EeCbf908478C10614626A9D304bfe18B78DD73#writeContract#F26) with the `escape` function.

If you already had a planet before the launch of L2, you don’t have to do anything. Your ship will continue to function normally and you will still be able to communicate with the entire network without any additional intervention. 

### Should I move? {#should-i-move}

If you have a planet on Layer 1, migrating is entirely optional. The **benefits** of migrating a planet to Layer 2 are free or cheap Azimuth transactions. Ships on Layer 2 can use Tlon’s roller to perform operations in Bridge for free up to a weekly limit. These operations might be resetting networking keys, or changing sponsors.

The **trade-offs** for migrating a planet to Layer 2 include:

- The migration process is currently irreversible. If you migrate to Layer 2, you cannot go back to Layer 1.
- Ships on Layer 2 are not visible to Layer 1 tools like wallets or chain explorers; Bridge is currently the only software that can ‘see’ Layer 2 IDs. There are a variety of Urbit companies that are building features that depend on the legibility of Urbit ID to the broader Ethereum blockchain ecosystem, and so while the functionality of Urbit OS is not dependent on this visibility, other use cases of your self-sovereign identity may not be possible with a Layer 2 identity.

### Which Layer am I on? {#which-layer-am-i-on}

You can tell at a glance which layer your asset occupies in Bridge:

1. Log into Bridge.
2. Click the ownership address modal at the top left of the main menu.
3. A square icon with ‘L1’ or ‘L2’ will show up next to each asset that belongs to your address.

A single ownership address can own ships on both Layer 1 and Layer 2. You can also check what layer you are on by looking at [the Network Explorer](https://network.urbit.org).

### Migrating {#migrating}

To migrate:

1. Log into Bridge.
2. Click the ownership address modal menu at the top left corner.
3. Select ‘Migrate’, and ‘Proceed’ after reading the information presented.
4. You will need to pay a one-time fee to fund the transaction; make sure your L1 address has funds available.

Migrating to Layer 2 does not change the address that owns a point. **You will still use the same wallet or key to log into Bridge (or any other Urbit ID management interface that support's the L2) after migration**. A single ownership address might have ships on both Layer 1 and Layer 2.

The migration itself does not need to be submitted to a roller – it should complete within a few minutes. Once it has, you can submit planets and transactions to the roller’s queue immediately.

### Activating a Layer 2 planet {#activating-a-layer-2-planet}

{% hint style="warning" %}
### Recommended L2 onboarding flow

Tlon offers free L2 Urbit ID's along with their free cloud hosting service, [available here](https://join.tlon.io/0v3.r87kb.fjpft.3k7b5.pbsr5.5em17). If you just want to get using Urbit OS in the quickest and easiest way possible, we recommend this onboarding path. For the more intrepid self-hoster or crypto-savvy user, we recommend acquiring a Layer 1 Urbit ID instead.

The documentation below refers to a legacy onboarding flow in Bridge and will soon be deprecated.

{% endhint %}

**Planet codes** are one-time passphrases used to claim a master ticket through Bridge. These can be standalone text phrases, or embedded in a URL that begins with `bridge.urbit.org`. **Master tickets** are passphrases used to log into Bridge to manage an ID that has already been claimed.

If you’ve been given a planet code invitation URL to claim a planet:

1. Open the link.
2. Click ‘Claim’.
3. Reveal the master ticket code. Write this down somewhere safe.
4. Confirm you’ve written the code down by typing it back into the prompt.
5. Click to download your passport, which contains the keyfile you will use for your ship’s first boot.

If you’ve been given a four-word text activation code, go to [Bridge](https://bridge.urbit.org/) and click ‘Activate a planet’ at the bottom. Enter your planet code, and follow the instructions above.

In the future, you can log into Bridge using the master ticket you wrote down in order to manage your ship’s keys. Knowing the master ticket is equivalent to owning the ID, so keep it somewhere secure.

An important consideration for new users with regard to Layer 2 planets: your ownership key is technically exposed to the star that issued your planet for up to 24 hours, until the next batch is processed by your roller. During this window, it's technically possible for the issuer to take back the planet or decrypt packets meant for it. This is the reason that the keyfile you use to boot your ship actually has two halves – one for your initial boot, and a second one that belongs solely to you.

The first time you boot, the key from the first half of the keyfile is used; but when the next roll batch is processed, the ID will be modified with a second key. This key is kept secret from the star that spawned you, and once this transaction clears, your planet is definitively and cryptographically yours. All of this is **taken care of in the background and requires no intervention**. You don’t even need to restart your planet after the ownership transfer has been finalized.

### Running your planet {#running-your-planet}

Once you’ve activated your planet and downloaded your keyfile, you can use it to [boot your ship](../../get-on-urbit.md#boot-up-your-urbit). It may take 5-10 minutes for the keyfile to become valid after the L2 transaction batch gets posted to chain, so please be patient.

Treat your planet like the precious object it is. Do not share your landscape login code or master key with anybody. Never run it in two places at the same time. This will knock it out of sequence with the network, and cause it to become ‘brain damaged’, unable to communicate with the outside world. Don’t delete the directory that contains your asset’s data. If you are shutting down your ship for a while, keep the data folder somewhere safe, and you can pick up where you left off in the future.

You may also opt to [host your planet](../../get-on-urbit.md) with a provider. Ships hosted by providers are always-on and come with support. After you’ve activated your planet code, but before you’ve booted with your keyfile, you can create an account with a hosting provider like [Tlon](https://tlon.io/) and use your keyfile to boot your ship with their service – known as ‘bring your own planet’.

In addition to importing a fresh planet, Tlon allows you to migrate an existing pier to your hosted account. If you’ve booted a planet on your PC but want to make the switch to hosting, you can upload it and hit the ground running without having to reset your networking keys. Just email support@tlon.io.

### Transaction history {#transaction-history}

The best place to see your 'transaction history' for your Urbit ID is in the [Network Explorer](https://network.urbit.org). On the homepage you can see the "Global Azimuth Event Stream" for the entire network, including both Layer 1 and Layer 2 points, or you can search for a specific point to see history as well as its ownership and proxy information.
