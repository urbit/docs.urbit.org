# Get an Urbit ID {#get-an-urbit-id}

### Types of ID {#types-of-id}

There are [five different types](https://operators.urbit.org/guides/which-id-should-i-buy) of Urbit ID, but here we'll just be  discussing two types called comets and planets.

**Comets** are free, temporary identities that you can issue yourself and are best-suited for short-term usage. **Planets** are permanent identities that are suitable for long-term use.

![](https://media.urbit.org/site/getting-started/comet-planet.png)

Planets have a unique, four syllable phonetic name and a [sigil](https://urbit.org/blog/creating-sigils), a visual representation of the name.

### Where to get a planet {#where-to-get-a-planet}

There are a few ways to get your own planet:

- Receiving one from a friend
- Asking on Twitter (if you're lucky)
- Booting a comet and being friendly in [Urbit Community](https://urbit.org/groups/~bitbet-bolbel/urbit-community)
- Purchasing one from a marketplace

This guide will cover the last case and what to do after receiving one.

### Buying a planet {#buying-a-planet}

There are many places to buy a planet using either crypto or fiat currency.

Layer 1 planets are the most available through marketplaces, however they can be expensive due to Ethereum gas fees. You will need an Ethereum wallet such as Metamask to purchase planets, and will later need to sign in to Bridge with your wallet to configure your planet.

Layer 2 planets do not require any crypto wallet management, but are only available on specific marketplaces.

There is no difference between Layer 1 or Layer 2 in the quality of experience when using Urbit.

Here are a few of the places where you can buy planets:

{% tabs %}

{% tab title="L1 Planet Markets" %}

- [Urbit.live](https://urbit.live)
- [Urbit.me](https://urbit.me)
- [OpenSea Urbit ID Planet](https://opensea.io/collection/urbit-id-planet)

{% endtab %}

{% tab title="L2 Planet Markets" %}

- [azimuth.shop](https://azimuth.shop)
- [lanlyd](https://lanlyd.net/)
- [\_networked subject](https://subject.network)

{% endtab %}

{% endtabs %}

{% hint style="info" %}

**Layer 2 for planets**

Learn more about [layer 2 for planets](https://operators.urbit.org/manual/id/layer-2-for-planets) in the User's Manual page on the topic.

{% endhint %}


### Claiming your planet {#claiming-your-planet}

An invitation to claim your planet comes in one of two forms.

The first is an email invitation with an Urbit ID and a Master Ticket.

The second, made available through our [L2 solution](https://operators.urbit.org/manual/id/layer-2-for-planets), is an activation code or a link to activate on [Bridge](https://bridge.urbit.org), the Urbit ID management tool.

![](https://media.urbit.org/site/getting-started/Server-setup-1.jpg)

Clicking a link to activate a planet on Bridge will take you to page which will generate a Master Ticket for you. Follow the instructions which will prompt you to download a copy of your Passport: your Master Ticket, management proxy, and keyfile. Store your Master Ticket and management proxy somewhere safe, hold on to the keyfile, and proceed to the next step.

{% hint style="info" %}

**Claiming L1 planets**

If you’ve purchased an L1 planet, you won’t need to claim it because you already own it as an NFT. Simply log into Bridge using Metamask or your wallet of choice.

{% endhint %}


### Using Bridge to get your keyfile {#using-bridge-to-get-your-keyfile}

Now that you have your planet, you can create your keyfile (eg. `sample-palnet.key`), which is the cryptographic signature required to encrypt and decrypt messages on Urbit's P2P network.

- **Claimed L2 planets**  
  If you’ve claimed your L2 Planet then you should already have downloaded your Passport, which contains your Master Ticket and keyfile.

- **Master Ticket holders**  
  If you haven’t downloaded your Passport but have a Master Ticket, then you can simply log in with Bridge using the Master Ticket option with your planet name and Master Ticket password. Click the ID box near the bottom of the page to open the ID page, then click the **Download Passport** button, which contains your keyfile.

- **L1 Planet Purchasers**  
  Log in to Bridge with your Ethereum wallet using Metamask or the wallet of your choice with WalletConnect. Click the “OS” box on the bottom of the page to open the OS page, and then click the **Download Keyfile** button.

### Next steps {#next-steps}

Now that you have a keyfile let's move on to booting the Urbit OS.

- [CLI instructions](self-hosted/cli.md) – Set up Vere, the Urbit runtime, using the command line.

- [Install on the cloud](self-hosted/cloud-hosting.md) – A step-by-step guide to setting up Urbit on a VPS.

- [Set up a home server](self-hosted/home-servers.md) – Explore options for running your own dedicated physical Urbit computer.

### Buying a star {#buying-a-star}

There are many places to buy a star using either crypto or fiat currency.

- [OpenSea Urbit ID Star](https://opensea.io/collection/urbit-id-star)
- ~tirrel/the-marketplace on Urbit for person-to-person sales

Stars were originally distributed as part of galaxy address space holdings, but many have changed hands from the original owner.  If you want to find the owner of a particular star today, you can use the Etherscan API to do so.  Build a query like the one below using the star ID number (rather than name).  (You will need an Etherscan API key.)

```
https://api.etherscan.io/api
   ?module=logs
   &action=getLogs
   &fromBlock=6784943
   &toBlock=latest
   &topic0=0x16d0f539d49c6cad822b767a9445bfb1cf7ea6f2a6c2b120a7ea4cc7660d8fda
   &topic0_1_opr=and
   &topic1=0x00000000000000000000000000000000000000000000000000000000000063b8
   &topic1_2_opr=and
   &topic2=0x00000000000000000000000086cd9cd0992F04231751E3761De45cEceA5d1801
   &page=1
   &offset=1000
   &apikey=<key here>

Topic 0 = OwnerChanged
Topic 1 = star number (ship number in hex)
Topic 2 = linear star release contract
```
