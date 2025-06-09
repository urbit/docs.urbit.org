# Get on Urbit

Urbit is two things: [Urbit ID](urbit-id/what-is-urbit-id.md), and [Urbit OS](urbit-os/what-is-urbit-os.md). To get on the network, you'll need both.

This guide will walk through the steps of getting an Urbit ID, downloading its key, installing the Urbit runtime, and using that to boot up your Urbit OS.

{% hint style="warning" %}
### Get on Urbit faster

If you want a quicker and easier way to get on Urbit, you can skip this guide and use a hosting provider instead. Tlon offers a free Urbit ID and hosting in the cloud that only takes a few clicks to get up and running, [available here](https://join.tlon.io/0v1.cr43s.b0o2b.nllrg.sf25p.62l4h).
{% endhint %}

You will need:

* Enough technical ability to use a terminal. We'll go through it step by step.
* Basic familiarity with crypto wallets and some ETH to buy a planet, unless you want to use a free disposable ID.
* A computer or server running macOS or Linux with at least 4GB of RAM and around 40GB of disk space. (You can usually get away with 2GB of RAM plus a swapfile and less disk space, but it might become a problem in the future as your Urbit grows.)

(If you want to run Urbit on a Windows computer you should be able to do so with Windows Subsystem for Linux (WSL), but that's outside the scope of this guide.)

{% stepper %}
{% step %}
### Get an Urbit ID <a href="#get-an-urbit-id" id="get-an-urbit-id"></a>

Every Urbit OS server is made unique by its Urbit ID, which others can use to reach you on the network. There are [five ranks of Urbit ID](user-manual/id/get-id.md#types-of-id), but the type an ordinary user needs is a planet, which has a name like "\~sampel-palnet". Unless you know someone who can gift you one, or you want to get one from a cloud hosting provider like Tlon, you'll need to buy one from a marketplace.

{% hint style="info" %}
### Get on Urbit for free

If you don't want to buy anything at this stage, you can get on the network with a free, disposable ID called a comet. Comets can do almost everything a planet can do, but select groups on the network may refuse entry.

If you just want to run an Urbit locally for testing/development purposes, without networking, you can boot a "fake ship" that uses an Urbit ID you don't actually own.

To boot a comet or fake ship, [skip straight to Step 3](get-on-urbit.md#get-the-urbit-runtime).

You can also get a planet with [free cloud hosting](get-on-urbit.md#get-on-urbit-faster).
{% endhint %}

Here are the best places to buy planets:

| Layer   | Market                                                   | Description                                            |
| ------- | -------------------------------------------------------- | ------------------------------------------------------ |
| Layer 1 | [OpenSea](https://opensea.io/collection/urbit-id-planet) | The largest NFT marketplace.                           |
| Layer 2 | [azimuth.shop](https://azimuth.shop)                     | Easily connect a wallet and buy an L2 planet with ETH. |

Originally, all Urbit IDs were ERC-721 NFTs on Ethereum. In 2021, Tlon [introduced a Layer 2 protocol](https://urbit.org/blog/rollups) to reduce transaction costs on Ethereum. This means there are two places an Urbit ID can live:

* **Layer 1**: These ordinary NFTs can traded on regular NFT marketplaces like [OpenSea](https://opensea.io/), and other smart contracts can interact with them. It'll cost you a bit of [gas](https://ethereum.org/en/gas/#what-is-gas) if you need to do an onchain action like a [factory reset](user-manual/id/guide-to-resets.md) or [changing your networking keys](user-manual/id/hd-wallet.md).
* **Layer 2**: With a Layer 2 planet you pay no transaction fee for onchain actions like factory resets and key changes. (Tlon runs the L2 system you'll use by default and they pay the very small L2 fees.) However, _normal Ethereum smart contracts and NFT marketplaces cannot see or interact with L2 IDs._ While there have been proposals to offer an L2 -> L1 bridge that would turn L2 IDs into ordinary NFTs on Ethereum, you should not assume this will come to pass when making a purchase decision.

In either case, your ownership of your planet is secured by your private key. **Your Urbit is yours, forever.**
{% endstep %}

{% step %}
### Get your keyfile <a href="#get-your-keyfile" id="get-your-keyfile"></a>

Once you've got an Urbit ID, the next step is to download its private [networking key](urbit-id/concepts/hd-wallet.md) (contained in a "keyfile") so you can boot it up. This process can vary depending on how you obtained your ID and where it's stored.

{% tabs %}
{% tab title="In a wallet" %}
If you got an L1 planet from somewhere like OpenSea, it was likely transferred directly to your Ethereum wallet. Here are the steps to get its keyfile:

1. Go to [bridge.urbit.org](https://bridge.urbit.org).
2. Login with WalletConnect or MetaMask if you use that.
3. Click on your planet, which should be listed there.
4. Go to the "OS" section.
5. Click "Initialize" next to "Network Keys" (see note below if it says something else)
6. Make sure you have a little ETH to pay the transaction fee, then click on "Set Networking Keys"
7. Click "Send Transaction"
8. Approve the transaction in your wallet.
9. Wait until the transaction completes and it says "Network Keys have been set" in [bridge.urbit.org](https://bridge.urbit.org).
10. Click "Download Keyfile"
11. A file called something like `sampel-palnet-1.key` will have been downloaded. Don't lose it.

{% hint style="info" %}
### Don't see "Initialize"?

If the options next to "Networking Keys" are "Reset" and "View" rather than "Initialize", it means your ID's previous owner at one point generated keys for their planet. In that case, click on "Reset", tick the "Factory Reset" box, and continue from step 6 above.
{% endhint %}
{% endtab %}

{% tab title="Invite link" %}
If you bought an L2 planet, you likely received an invite link that looks like `https://bridge.urbit.org/#foshec-moplec-haddem-poddun-middeg-toptus`:

1. Open the link and complete the steps as prompted.
2. At one point, there'll be an option to download the "passport". Click on that, and it'll download a file named something like like `sampel-palnet-passport.zip`.
3. Complete any remaining steps and make sure to record the Master Ticket code somewhere safe.
4. Unzip the passport file you downloaded.
5. It will contain a file named something like `sampel-palnet.key`.

{% hint style="info" %}
### Already have a planet?

If you already claimed this planet at some point and forgot to download the passport, you'll need to go and download the keyfile from [bridge.urbit.org](https://bridge.urbit.org):

1. Go to [bridge.urbit.org](https://bridge.urbit.org).
2. Click the "Master Ticket" login option.
3. Enter the planet name and Master Ticket code, and hit "Login".
4. Go to the "OS" section.
5. Click on "Download Keyfile" and it'll download a file with a name like `sampel-palnet-2.key`.
{% endhint %}
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
### Get the Urbit runtime <a href="#get-the-urbit-runtime" id="get-the-urbit-runtime"></a>

To boot up a new Urbit, you'll need the Urbit runtime. There are four pre-built versions of the runtime available, one for each platform we support. Pick the one you're on and copy/paste the provided `curl` command into your terminal.

{% tabs %}
{% tab title="macOS (Apple Silicon)" %}
Open a terminal and run:

```sh
curl -L https://urbit.org/install/macos-aarch64/latest | tar xzk -s '/.*/urbit/'
```
{% endtab %}

{% tab title="macOS (Intel)" %}
Open a terminal and run:

```sh
curl -L https://urbit.org/install/macos-x86_64/latest | tar xzk -s '/.*/urbit/'
```
{% endtab %}

{% tab title="Linux (x86_64)" %}
Open a terminal and run:

```sh
curl -L https://urbit.org/install/linux-x86_64/latest | tar xzk --transform='s/.*/urbit/g'
```
{% endtab %}

{% tab title="Linux (aarch64)" %}
Open a terminal and run:

```sh
curl -L https://urbit.org/install/linux-aarch64/latest | tar xzk --transform='s/.*/urbit/g'
```
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
### Boot up your Urbit <a href="#boot-up-your-urbit" id="boot-up-your-urbit"></a>

{% tabs %}
{% tab title="Boot a planet" %}
Having acquired a planet and downloaded its keyfile, you can now boot up your Urbit.

The easiest way to run an Urbit is inside a `screen` session. `screen` is installed on macOS and Linux by default; it lets you "detach" from terminal sessions, leave them running in the background, then "attach" to them again later.

To start a new `screen` session and name it `urbit`, run the following command in your terminal:

```sh
screen -S urbit
```

You are now inside a `screen` session. You can boot your Urbit with the command below, replacing `sampel-palnet` with your actual planet name, and `/path/to/sampel-palnet-1.key` with the path to the keyfile you downloaded previously. (If you're on macOS, it's probably `~/Downloads/sampel-palnet-1.key`.)

```sh
./urbit -w sampel-palnet -k /path/to/sampel-palnet-1.key
```

Your planet will begin to boot up, which might take a few minutes. You'll know your planet has booted when you see something like this in the terminal:

```
~sampel-palnet:dojo>
```

This is the Dojo, Urbit's command-line interface.

For the moment, shut the ship down again by typing `|exit` or pressing `Ctrl+D`.

{% hint style="info" %}
### Linux default port

Linux won't let Urbit's web server bind port 80, and it will instead default to port 8080. If you want it to bind port 80, you'll need to do the following in the terminal:

```sh
# if you're on ubuntu and don't already have setcap
sudo apt-get install libcap2-bin
# replace sampel-palnet with the actual folder name
sudo setcap 'cap_net_bind_service=+ep' sampel-palnet/.run
```
{% endhint %}

For ease of portability the Urbit runtime has made a copy of itself in the `sampel-palnet` folder, so you don't need the separate `urbit` executable anymore.

Spin up your planet again by running `sampel-palnet/.run`, and you'll be back at the Dojo.

Next, you'll want to get the web login code so you can login to your Urbit's web interface in a browser.

To do so, type `+code` in the Dojo and hit `Return`. It'll give you a code that looks like `lidlut-tabwed-pillex-ridrup`. Highlight that and copy it.

{% hint style="info" %}
### Save your code

If you want, you can save your `+code` in a password manager or write it down somewhere safe. Your `+code` isn't your private key, just a web login password. If you think your `+code` has been compromised, you can just [reset it in the Dojo](user-manual/os/dojo-tools.md#code) to log out of all browser sessions in your Urbit.
{% endhint %}

Detach from this `screen` session by hitting `Ctrl+A`, then hitting `D`. It should say something like `[detached from 1819892.urbit]`. You can now close or quit the terminal entirely; your Urbit is still running in the `screen` session.

If you need to get back to the Dojo again in the future, just open a terminal and run `screen -r urbit` to reattach to the `urbit` session.
{% endtab %}

{% tab title="Mine a comet" %}
Comets are free, disposable Urbit IDs. Comets are trivial to create, so we use them as anonymous IDs, but to boot an Urbit server with a comet you'll have to "mine" one.

The easiest way to run an Urbit is inside a `screen` session. `screen` is installed on macOS and Linux by default; it lets you "detach" from terminal sessions, leave them running in the background, then "attach" to them again later.

To start a new `screen` session and name it `urbit`, run the following command in your terminal:

```sh
screen -S urbit
```

Now that you're in a `screen` session, you can mine a new comet with the command below. `mycomet` is just the name of the folder, so you can change it to whatever you like.

```sh
./urbit -c mycomet
```

It might take a few minutes to boot up and mine a comet. You'll know your comet has booted when you see something like this in the terminal:

```
~sampel_litzod:dojo>
```

This is the Dojo, Urbit's command-line interface.

For the moment, shut the ship down again by typing `|exit` or pressing `Ctrl+D`.

{% hint style="info" %}
### Linux default port

Linux won't let Urbit's web server bind port 80, and it will instead default to port 8080. If you want it to bind port 80, you'll need to do the following in the terminal:

```sh
# if you're on ubuntu and don't already have setcap
sudo apt-get install libcap2-bin
# replace mycomet with the actual folder name
sudo setcap 'cap_net_bind_service=+ep' mycomet/.run
```
{% endhint %}

For ease of portability the Urbit runtime has made a copy of itself in the `mycomet` folder, so you don't need the separate `urbit` executable anymore.

Spin up your comet again by running `mycomet/.run`, and you'll be back at the Dojo.

Comets don't receive software updates by default. If you intend on running this comet for a while and you want to receive updates, run `|ota` in the Dojo.

Next, you'll want to get the web login code so you can login to your Urbit's web interface in a browser.

To do so, type `+code` in the Dojo and hit `Return`. It'll give you a code that looks like `lidlut-tabwed-pillex-ridrup`. Highlight that and copy it.

{% hint style="info" %}
### Save your code

If you want, you can save your `+code` in a password manager or write it down somewhere safe. Your `+code` isn't your private key, just a web login password. If you think your `+code` has been compromised, you can just [reset it in the Dojo](user-manual/os/dojo-tools.md#code) to log out of all browser sessions in your Urbit.
{% endhint %}

Detach from this `screen` session by hitting `Ctrl+A`, then hitting `D`. It should say something like `[detached from 1819892.urbit]`. You can now close or quit the terminal entirely; your Urbit is still running in the `screen` session.

If you need to get back to the Dojo again in the future, just open a terminal and run `screen -r urbit` to reattach to the `urbit` session.
{% endtab %}

{% tab title="Boot a fake ship" %}
Fake ships are for development purposes only and cannot connect to the live network.

Run the `urbit` executable you previously downloaded with the `-F` flag to boot a new fake ship. You can specify any identity you want. Most people use the galaxy \~zod.

```sh
./urbit -F zod
```

This will take a few minutes. Once it's done, you'll have a responsive prompt that looks like this:

```
~zod:dojo> 
```

You can shut the fake ship down by typing `|exit` or pressing `Ctrl+D`.

For ease of portability the Urbit runtime has made a copy of itself in the `zod` folder, so you don't need the separate `urbit` executable anymore.

Spin up your fake ship again by running `zod/.run`, and you'll be back at the Dojo.

Next, you may want to get the web login code so you can login to your Urbit's web interface in a browser. To do so, type `+code` in the Dojo and hit `Return`. It'll give you a code that looks like `lidlut-tabwed-pillex-ridrup`. Highlight that and copy it.

Fake ships are for developers. If you want to learn more about programming, app development, or core development on Urbit, look at our [courses](broken-reference) section to get started.
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
### Login to Landscape <a href="#login-to-landscape" id="login-to-landscape"></a>

With your Urbit now running and your web login code copied, you can open a browser and go to `http://localhost`. (If that doesn't work, try `http://localhost:8080`.) You should see with your Urbit's login screen. Paste in the code you got from running `+code` in the Dojo (it looks like `lidlut-tabwed-pillex-ridrup`) and hit click "Continue". You'll now be in your Landscape homescreen.

To join your first group, you can open the Tlon app by clicking on its tile, then hit the `+` in the sidebar and select "Join a group". Paste in `~halbex-palheb/uf-public`, the Urbit Foundation's main public group, and hit "Go".

If you'd like to see what other apps are available, click on the "Get Urbit Apps" button at the top of the Landscape homescreen. There are a few suggestions listed there. If you know an app's publisher (e.g. \~bitdeg) or "shortcode" (e.g. `~bitdeg/hits`), you can type that in the searchbar at the top of the "Get Urbit Apps" menu.
{% endstep %}
{% endstepper %}
