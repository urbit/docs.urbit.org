# Get on Urbit

Using Urbit requires two things: an Urbit ID, and a server running Urbit OS. This guide will walk through the steps of getting an Urbit ID, downloading its keyfile, installing the Urbit runtime, and booting up the Urbit.

This guide will require:

- A small amount of technical ability (such as using a terminal).
- Basic familiarity with crypto wallets and some ETH to buy a planet (unless you want to use a free disposable ID).
- A computer or server running macOS or Linux with at least 4GB of RAM and around 40GB of disk space. You can usually get away with 2GB of RAM plus a swapfile and less disk space, but it might become a problem in the future as your Urbit grows.

It should also be possible to run Urbit on a Windows computer using the Windows Subsystem for Linux (WSL), but that's outside the scope of this guide.

{% hint %}

If you want a quicker and easier way to get on Urbit, you can skip this guide and use a hosting provider instead. Tlon offer a free Urbit ID and hosting in the cloud that only takes a few clicks to get up and running, [available here](https://join.tlon.io/0v1.cr43s.b0o2b.nllrg.sf25p.62l4h).

{% endhint %}

{% stepper %}
{% step %}
## Get an Urbit ID {#get-an-urbit-id}

All Urbits need a unique ID. There are [5 types of Urbit ID](manual/id/get-id.md#types-of-id), but the type an ordinary user needs is a **planet**, which looks like `~sampel-palnet`. Planets are stored in a smart contract called Azimuth on the Ethereum blockchain. Unless you know someone who can gift you one, you'll need to buy one from a marketplace.

{% hint %}
If you don't want to buy one at this stage, you can use a disposable ID called a **comet**. If you're trying to run an Urbit locally for development purposes, you can also spin up a "fake ship". In either case, [skip straight to Step 3](#get-the-urbit-runtime).
{% endhint %}

Here are the best places to by planets:

| Layer | Market                                                   | Description                                            |
|-------|----------------------------------------------------------|--------------------------------------------------------|
| L1    | [OpenSea](https://opensea.io/collection/urbit-id-planet) | The largest NFT marketplace.                           |
| L2    | [azimuth.shop](https://azimuth.shop)                     | Easily connect a wallet and buy an L2 planet with ETH. |

Originally, all Urbit IDs were ERC-721 NFTs on Ethereum. In 2021, we introduce a Layer-2 protocol to reduce transaction costs on Ethereum. This means there are two places an Urbit ID can live:

- **L1**: The original kind. They can traded on ordinary NFT marketplaces like [OpenSea](https://opensea.io/) and other smart contracts can interact with them, but it'll cost a bit of [gas](https://ethereum.org/en/gas/#what-is-gas) if you need to do a factory reset or change your networking keys.
- **L2**: There are no transaction fees for things like factory resets and key changes, but normal smart contracts and NFT marketplaces don't understand them.

In either case you retain full ownership and control of your Urbit ID. **It's yours forever.**

{% endstep %}

{% step %}
## Get your keyfile {#get-your-keyfile}

Once you've got an Urbit ID, the next step is to get its keyfile so you can boot it up. The process can vary depending on how you obtained your ID and where it's stored.

{% tabs %}

{% tab title="In a wallet" %}

If you got an L1 planet from somewhere like OpenSea, it likely got transferred directly to your Ethereum wallet. Here are the steps to get its keyfile:

1. Go to [Bridge](https://bridge.urbit.org).
2. Login with WalletConnect or MetaMask if you use that.
3. Click on your planet, which should be listed there.
4. Go to the "OS" section.
5. Click "Initialize" next to "Network Keys" (see note below if it says something else)
6. Make sure you have a little ETH to pay the transaction fee, then click on "Set Networking Keys"
7. Click "Send Transaction"
8. Approve the transaction in your wallet.
9. Wait until the transaction completes and it says "Network Keys have been set" in Bridge.
10. Click "Download Keyfile"
11. A file called something like `sampel-palnet-1.key` will have been downloaded. Don't lose it.

{% hint %}
Note: if the options next to "Networking Keys" are "Reset" and "View" rather than "Initialize", it means a previous owner has generated keys for the planet. In that case, click on "Reset", tick the "Factory Reset" box, and continue from step 6.
{% endhint %}

{% endtab %}

{% tab title="Claim planet invite" %}

If you bought an L2 planet, you likely received an invite link that looks like `https://bridge.urbit.org/#foshec-moplec-haddem-poddun-middeg-toptus`:

1. Open the link and complete the steps as prompted.
2. At one point, there'll be an option to download the passport. Click on that, and it'll download a file that looks like `sampel-palnet-passport.zip`.
3. Complete any remaining steps and make sure to record the Master Ticket code somewhere safe.
4. Unzip the passport file you downloaded.
5. It will contain a file that looks like `sampel-palnet.key`.

If you've already claimed the planet and forgot to download the passport, you'll need to go and download the keyfile from [Bridge](https://bridge.urbit.org):

1. Go to [Bridge](https://bridge.urbit.org).
2. Click the "Master Ticket" login option.
3. Enter the planet name and Master Ticket code, and hit "Login".
4. Go to the "OS" section.
5. Click on "Download Keyfile" and it'll download a file that looks like `sampel-palnet-2.key`.

{% endtab %}

{% endtabs %}

{% endstep %}

{% step %}
## Get the Urbit runtime {#get-the-urbit-runtime}

To spin up a new Urbit, you need the runtime called Vere. There are 4 prebuilt binaries available, depending on your platform. Pick the one you're on and run the corresponding `curl` command in a terminal.

{% tabs %}
{% tab title="macOS (Intel)" %}

Open a terminal and run:

```sh
curl -L https://urbit.org/install/macos-x86_64/latest | tar xzk -s '/.*/vere/'
```

{% endtab %}
{% tab title="macOS (Apple Silicon)" %}

Open a terminal and run:

```sh
curl -L https://urbit.org/install/macos-aarch64/latest | tar xzk -s '/.*/urbit/'
```

{% endtab %}
{% tab title="Linux x86_64" %}

Open a terminal and run:

```sh
curl -L https://urbit.org/install/linux-x86_64/latest | tar xzk --transform='s/.*/vere/g'
```

{% endtab %}
{% tab title="Linux aarch64" %}

Open a terminal and run:

```sh
curl -L https://urbit.org/install/linux-aarch64/latest | tar xzk --transform='s/.*/vere/g'
```

{% endtab %}
{% endtabs %}

{% endstep %}

{% step %}
## Boot up your Urbit {#boot-up-your-urbit}

{% tabs %}

{% tab title="Boot a planet" %}

Having acquired a planet and downloaded its keyfile, you can now boot it up. The best way to run an Urbit is inside a `screen` session. Screen is a terminal multiplexer that lets you detach from shell sessions and leave them running in the background, then attach them again later. To start a new `screen` session and name it `urbit`, run the following command in your terminal:

```sh
screen -S urbit
```

Now that you're in a `screen` session, you can boot your Urbit with the command below, replacing `sampel-palnet` with your actual planet name, and `/path/to/sampel-palnet-1.key` with the path to the keyfile you downloaded previously: 

```sh
./vere -w sampel-palnet -k /path/to/sampel-palnet-1.key
```

Your planet will begin to boot up, it might take a few minutes. You'll know your planet has booted when you have a responsive prompt that looks like this:

```sh
~sampel-palnet:dojo>
```

This is the Dojo, Urbit's command-line interface. For the moment, shut the ship down again by typing `|exit` or pressing `Ctrl+D`.

**Linux users:** Linux won't let Vere's web server bind port 80, and it will instead default to port 8080. If you want it to bind port 80, you'll need to do the following in the terminal:

```sh
sudo apt-get install libcap2-bin # if you're on ubuntu and don't already have setcap
sudo setcap 'cap_net_bind_service=+ep' sampel-palnet/.run # replace sampel-palnet with the actual folder name
```

You can now spin it back up again by running `./sampel-palnet/.run`, and you'll be back at the Dojo. Vere has "docked" itself with the `sampel-palnet` folder so you don't need the separate `vere` binary anymore.

Next, you'll want to get the web login code so you can login to your Urbit's web interface in a browser. To do so, type `+code` in the Dojo and hit enter. It'll give you a code that looks like `lidlut-tabwed-pillex-ridrup`. Highlight that and copy it to the clipboard with `Ctrl+Shift+C`. You can save it in a password manager or write it down if you'd like.

Now, detach the `screen` session by hitting `Ctrl+A`, then hitting `D`. It should say something like `[detached from 1819892.urbit]`. You can now close the terminal entirely with `Ctrl+D`.

If you need to get back to the Dojo again in the future, just open a terminal and run `screen -r urbit` to reattach the session.

{% endtab %}

{% tab title="Mine a comet" %}

The best way to run an Urbit is inside a `screen` session. Screen is a terminal multiplexer that lets you detach from shell sessions and leave them running in the background, then attach them again later. Without something like `screen`, you'd have to leave the terminal open all the time while your Urbit is running. To start a new `screen` session and name it `urbit`, run the following command in your terminal:

```sh
screen -S urbit
```

Now that you're in a `screen` session, you can mine a new comet with the command below. Yyou can change `mycomet` to whatever you'd like: 

```sh
./vere -c mycomet
```

It might take a few minutes to boot up and mine a comet. You'll know your comet has fully booted when you have a responsive prompt that looks like this:

```sh
~sampel_litzod:dojo>
```

This is the Dojo, Urbit's command-line interface. For the moment, shut the ship down again by typing `|exit` or pressing `Ctrl+D`.

**Linux users:** Linux won't let Vere's web server bind port 80, and it will instead default to port 8080. If you want it to bind port 80, you'll need to do the following in the terminal:

```sh
sudo apt-get install libcap2-bin # if you're on ubuntu and don't already have setcap
sudo setcap 'cap_net_bind_service=+ep' mycomet/.run
```

You can now spin it back up again by running `./mycomet/.run`, and you'll be back at the Dojo. Vere has "docked" itself with the `mycomet` folder so you don't need the separate `vere` binary anymore.

Comets don't have kernel over-the-air updates enabled by default, so you'll want to run `|ota` in the Dojo to turn those on.

Next, you'll want to get the web login code so you can login to your Urbit's web interface in a browser. To do so, type `+code` in the Dojo and hit enter. It'll give you a code that looks like `lidlut-tabwed-pillex-ridrup`. Highlight that and copy it to the clipboard with `Ctrl+Shift+C`. You can save it in a password manager or write it down if you'd like.

Now, detach the `screen` session by hitting `Ctrl+A`, then hitting `D`. It should say something like `[detached from 1819892.urbit]`. You can now close the terminal entirely with `Ctrl+D`.

If you need to get back to the Dojo again in the future, just open a terminal and run `screen -r urbit` to reattach the session.

{% endtab %}

{% tab title="Boot a fake ship" %}

Fake ships are for development purposes only and cannot connect to the live network.

Run the `vere` binary you previously downloaded with the `-F` flag to boot a new fake ship. You can specify any identity you want. Most people use the galaxy `~zod`.

```sh
./vere -F zod
```

This will take a few minutes. Once it's done, you'll have a responsive prompt that looks like this:

```
~zod:dojo> 
```

You can shut the fake ship down by typing `|exit` or pressing `Ctrl+D`.

You can now spin it back up again by running `./zod/.run`, and you'll be back at the Dojo. Vere has "docked" itself with the `zod` folder so you don't need the separate `vere` binary anymore.

If you need to access your fake ship's web interface, type `+code` in the Dojo and hit enter. It'll give you a code that looks like `lidlut-tabwed-pillex-ridrup`. Highlight that and copy it to the clipboard with `Ctrl+Shift+C`.

To learn more about developing on Urbit, look at our [courses](./courses/README.md).

{% endtab %}

{% endtabs %}

{% endstep %}

{% step %}
## Login to Landscape {#login-to-landscape}

With your Urbit now running and your web login code in the clipboard, you can open a browser and go to `http://localhost` (try `http://localhost:8080` if that doesn't work). You should be greeted with your Urbit's login screen. Paste in the code you got from running `+code` in the Dojo (it looks like `lidlut-tabwed-pillex-ridrup`) and hit enter. You'll now be in your Landscape homescreen.

To join your first group, you can open the Tlon app by clicking on its tile, then hit the `+` in the sidebar and select "Join a group". Paste in `~halbex-palheb/uf-public`, the Urbit Foundation's main public group, and hit "Go".

If you'd like to explore what other apps are available, click on the "Get Urbit Apps" button at the top of the Landscape homescreen. There's a few suggestions listed there, and you can also paste in an app shortcode or an app publisher's ship name if you know any.

{% endstep %}
{% endstepper %}

