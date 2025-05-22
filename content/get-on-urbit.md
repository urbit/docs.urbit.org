# Get on Urbit

Using Urbit requires two things: an Urbit ID, and a server running Urbit OS.

{% hint %}

You can get a free Urbit ID and OS in the cloud, courtesy of Tlon Corporation, at [this link](http://example.com).

{% endhint %}

Clicking that link will also invite you to the official Urbit Foundation group on Tlon Messenger, which is a great place to start finding your way around the network.

## Install Urbit OS

If you want to run Urbit on your local device, or a cloud VPS, paste the commands below into the terminal for your operating system and machine.

### macOS

{% tabs %}

{% tab title="Apple Silicon" %}

{% code %}

curl -L https://urbit.org/install/macos-aarch64/latest | tar xzk -s '/.*/urbit/' && ./urbit

{% endcode %}

{% endtab %}

{% tab title="Intel" %}

{% code %}

curl -L https://urbit.org/install/macos-x86_64/latest | tar xzk -s '/.*/urbit/' && ./urbit

{% endcode %}

{% endtab %}

{% endtabs %}

### Linux

**System Requirements**
- **Processor:** 1 core
- **Memory:** At least 2GB
- **Storage:** At least a few gigabytes, 40GB or more recommended

{% tabs %}

{% tab title="x86_64" %}

{% code %}

curl -L https://urbit.org/install/linux-x86_64/latest | tar xzk --transform='s/.*/urbit/g' && ./urbit

{% endcode %}

{% endtab %}

{% tab title="AArch64" %}

{% code %}

curl -L https://urbit.org/install/linux-aarch64/latest | tar xzk --transform='s/.*/urbit/g' && ./urbit

{% endcode %}

{% endtab %}

{% endtabs %}

## Get an Urbit ID

Every Urbit OS instance is made unique by its identity, which other ships can use to talk to it. There are three ways to get an identity:
- **Buy a planet.** There are three main ranks of Urbit ID: 2^32 planets, 2^16 stars, and 2^8 galaxies. Most users will only need a planet.
- **Mine a comet.** A comet is a free, anonymous, disposable Urbit ID. (There are 2^128 of them. Enough for every grain of sand on Earth.) You can use it to access the network, but some groups may refuse entry. Never buy these.
- **Boot a fake ship.** For development and testing. This will only be able to talk to other fake ships on your machine.

{% tabs %}

{% tab title="Buy a planet" %}

See [this detailed guide](./manual/id/get-id.md) on buying a planet. Once you've done that, proceed to booting it up.

To boot a planet, you'll need a copy of its private key. Depending on how you got your planet, you may already have a .zip file called something like "sampel-palnet-1.key". If not, log into [Bridge](https://bridge.urbit.org), select your planet, go to the OS section, and click "Download Keyfile".

Back in the terminal, you can boot your planet by running this command. Replace "sampel-palnet" with your planet's Urbit ID, minus the usual "~" prefix, and make sure the second part after `-k` is the path to your keyfile including its filename.

{% code %}

```sh
./urbit -w sampel-palnet -k sampel-palnet-1.key
```

This will take a few minutes. You'll know your planet has booted when you see something like this.

{% code %}

```
ames: live on 31337
http: web interface live on http://localhost:80
http: loopback live on http://localhost:12321
~sampel-palnet:dojo>
```

{% endcode %}

This is the Dojo, Urbit's command-line interface. You can shut the ship down and leave the Dojo by typing `|exit` or pressing `Ctrl+D`.

You can access your planet from a web browser by visiting `http://localhost:80`, or whichever URL you saw in the "web interface" line in your terminal output. You'll see a login screen asking for a code, which you can get by typing `+code` in the Dojo. You'll see something like `lidlut-tabwed-pillex-ridrup`. Copy that into the login screen and click "Continue".

<details>

<summary>Note for Linux users on default ports</summary>
Linux users need to run this command in another terminal window to access their urbit on port 80 every time they upgrade their <code>urbit</code> runtime. Otherwise, it'll default to port 8080.

```sh
sudo apt-get install libcap2-bin
sudo setcap 'cap_net_bind_service=+ep' <pier>/.run
```

</details>

This will take you to your homescreen. Open the Tlon app to find your way around the network. Click "Get Urbit Apps" to see some of what your ship can do.

{% endcode %}

{% endtab %}

{% tab title="Mine a comet" %}

If you want to run Urbit without buying an Urbit ID, you can use an anonymous, disposable ID called a comet for free.

To start, run this command, where "mycomet" is the name of the folder you'd like to create for your comet.

{% code %}

```sh
./urbit -c mycomet
```

{% endcode %}

This will take a few minutes. If you're running this on a laptop it might warm up, but it's nothing a base-model MacBook can't easily handle. You'll know your comet has booted when you see something like this.

{% code %}

```
ames: live on 31337
http: web interface live on http://localhost:80
http: loopback live on http://localhost:12321
~sampel_ponnym:dojo>
```

{% endcode %}

This is the Dojo, Urbit's command-line interface. You can shut the ship down and leave the Dojo by typing `|exit` or pressing `Ctrl+D`.

You can access your comet from a web browser by visiting `http://localhost:80`, or whichever URL you saw in the "web interface" line in your terminal output. You'll see a login screen asking for a code, which you can get by typing `+code` in the Dojo. You'll see something like `lidlut-tabwed-pillex-ridrup`. Copy that into the login screen and click "Continue".

<details>

<summary>Note for Linux users on default ports</summary>
Linux users need to run this command in another terminal window to access their urbit on port 80 every time they upgrade their <code>urbit</code> runtime. Otherwise, it'll default to port 8080.

```sh
sudo apt-get install libcap2-bin
sudo setcap 'cap_net_bind_service=+ep' <pier>/.run
```

</details>

This will take you to your homescreen. Open the Tlon app to find your way around the network. Click "Get Urbit Apps" to see some of what your ship can do.

{% endtab %}

{% tab title="Boot a fake ship" %}

Run `urbit` with the `-F` flag to boot a new fake ship. You'll need to specify an identity for your fake ship, minus the usual "~" prefix.

{% code %}

```sh
./urbit -F zod
```

{% endcode %}

This will take a few minutes. Once that's done, you'll see something like this:

{% code %}

```
ames: live on 31337
http: web interface live on http://localhost:80
http: loopback live on http://localhost:12321
~zod:dojo> 
```

{% endcode %}

You can shut the comet down by typing `|exit` or pressing `Ctrl+D`.

Once you've booted for the first time, you can run your ship again with `./urbit zod`. (For ease of portability, the `zod` folder now has a copy of the runtime inside it, which you can run with `./zod/.run`.)

Run `./urbit` with no arguments to see a full list of commands available to you.

To learn more about developing on Urbit, look at our [courses](./courses/README.md).

{% endtab %}

{% endtabs %}

