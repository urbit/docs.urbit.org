+++
title = "NEAR Gateways"
weight = 999
auto_expand = true
+++

This tutorial will cover building and deploying your first Urbit-compatible [Blockchain Operating System (BOS)](https://wiki.near.org/overview/BOS/overall-bos) gateway, and deploying it to the urbit network.

By the end of this tutorial you’ll be able to:
- Set up a BOS gateway skeleton with [Urbit’s create-near-app fork](https://github.com/urbit/create-near-app).
- Write and test Urbit-aware NEAR components with `create-near-app`.
- Deploy Urbit-aware components to the NEAR blockchain.
- Deploy a gateway to Urbit’s NEAR Gateways app, where people can use your gateway or mirror it to use on their own local machine.

We anticipate you’re either an Urbit developer who isn’t so familiar with NEAR, or a NEAR developer who isn’t so familiar with Urbit. Either way, we only assume some familiarity with React.

To make NEAR development on Urbit simple, we built an end-to-end workflow that covers development, deployment, and distribution of BOS gateways. We wanted something smaller, more opinionated, and more tightly integrated than NEAR developers might be used to. We were focussed on developing gateways, with no attention to smart contracts, so our `create-near-app` fork may not be suited to that.

Once you’re familiar with this workflow, you can use whichever parts of it you like and leave the rest. If you want your gateway to interact with Urbit, the only part of this stack you need is [our NEAR Social VM fork](https://github.com/urbit/NearSocialVM), which defines an Urbit object and methods for interacting with an Urbit server.

## What is BOS?

NEAR’s Blockchain Operating System provides a secure way to leverage onchain React components in specialized React apps called gateways. Storing these on the NEAR blockchain only costs a few cents. The official [near.org](http://near.org) site itself is a NEAR component made of other NEAR components, with the NearOrg.HomePage component source available to read [here](https://near.org/near/widget/ComponentDetailsPage?src=near/widget/NearOrg.HomePage).

If you’re not familiar with BOS, this tutorial will cover everything you need to know as it becomes relevant.

## What is Urbit?

Urbit is a personal server, which runs as a virtual machine on any Unix box, and a peer-to-peer network of those personal servers.

An Urbit server is permanently bound to the Urbit ID that booted it, and there can only be one Urbit server per Urbit ID at any one time. Urbit ID is a decentralized identity system secured by Ethereum: your Urbit ID is an NFT you hold in your Ethereum wallet, so nobody can take your “account” away from you.

Since Urbit IDs are scarce, spamming the network is prohibitively expensive. Since data packets are signed by their Urbit IDs, you can trust that messages are coming from the exact machine they claim to be. And since end-users run all their own data and software on their personal server, app developers have far fewer issues around deployment, uptime, and security to worry about.

This makes Urbit an ideal setting for BOS gateways. Web 2.0 deployment platforms remain a single point of failure between end-users and the NEAR blockchain. Urbit totally removes this deployment infrastructure for hobbyist developers, commoditizes much of it for professionals, and it makes it simple for end-users to run their own server hosting gateways they want to be able to rely on.

## Setting up

You’ll need an Urbit server (called a “ship”) to deploy your gateway.

{% callout %}

[Click here](https://redhorizon.com/join/61c3b5a7-9eba-437c-8049-b5b217625bcf) to get a hosted Urbit ship pre-configured to help you deploy to NEAR Gateways as fast as possible. Export the ship to your local machine, home server, or VPS at any time.

{% /callout %}

For development, you should probably use a locally-hosted “fakeship”; it’s not connected to the urbit network, which means you can use an ID you don’t really own. If you break it, you can just delete it and make another one for free.

(If you run several of these fakeships in the same directory on your machine, they’ll automatically run as a kind of urbit “testnet”. You just need to recreate the network topology where ~tex and ~mex can send exchange packets directly, but ~samtex and ~sammex need ~tex and ~mex to be online to route packets to each other.)

## Setting up a fakeship

On your local machine, follow Steps 1 and 2 on this [command-line install guide](/manual/getting-started/self-hosted/cli) to download the `urbit` executable file.

In the same directory you’ve installed the `urbit` executable, run this command to set up a fakeship. For this tutorial, we’ll use the Urbit ID ~zod.

```
> ./urbit -F zod
```

This command should take a few minutes to run. When the boot sequence is complete you’ll see this prompt in your fakeship’s terminal (AKA the “dojo”).

```
~zod:dojo>
```

You can shut your fakeship down at any time by typing `|exit` in the dojo. When you want to boot it up again, just run `./urbit zod` in your Unix terminal.

You can control which port your fakeship is accessed from by using the `--http-port` flag while booting.

```
> ./urbit zod --http-port 8080
```

In your fakeship’s dojo, run this command to approve CORS requests from your web browser at `localhost:8081`. If you want to run your test gateway on a port other than `:8081`, you’ll have to `|eyre/cors/approve` that port too.

```
> |eyre/cors/approve 'http://localhost:8081'
```

Now that you're set up, let's create the BOS gateway itself.
