# Cloud Hosting

This guide walks through deploying an Urbit node to a server in the cloud. Deploying in the cloud allows you to access your Urbit from any device.

Specific instructions are included for Digital Ocean, Hetzner and Oracle Cloud, as well as generic instructions for other cloud providers.

Minimum requirements:

- **OS:** Linux
- **Architecture:** `x86_64` or `aarch64`
- **vCPUs:** 1 (more is generally a waste unless you're running more than one Urbit)
- **Memory:** 2GB will work with a [swapfile](https://www.linux.com/news/all-about-linux-swap-space), though 4GB is preferred
- **Disk space:** 40GB is preferred but 10GB will work

{% hint %}
**Note:** when an Urbit is first booted, it requires 2GB of memory (or swap) available to be mapped, but won't use much of it. Likewise, it initially won't use much disk space. The longer your Urbit runs and the more you use it (such as joining groups and installing apps), the larger its memory consumption and disk usage will grow. This means that while you can get away with a small amount of memory and disk space at first, you may eventually hit the limit of one or the other and need to upgrade it.
{% endhint %}

#### Cloud-init config {#cloud-init-config}

This `cloud-init` config file configures the VPS and installs the `urbit` runtime. It will work for most Linux images available from cloud providers. The guide below will refer back to this file later.

{% hint type="warning" %}
You must generate an SSH keypair and paste the contents of the `.pub` file where it says `YOUR-SSH-KEY-HERE` on line 17 or you will not be able to SSH into your instance.
{% endhint %}

<details>
<summary>Cloud-init config file</summary>

{% code title="cloud-config.yaml" overflow="nowrap" lineNumbers="true" %}

```yaml
#cloud-config

hostname: urbit-vps

disable_root: true
ssh_pwauth: false

users:
  - default
  - name: urbit
    gecos: Urbit User
    sudo: ALL=(ALL) NOPASSWD:ALL
    groups: sudo
    shell: /bin/bash
    lock_passwd: true
    ssh_authorized_keys:
      - YOUR-SSH-KEY-HERE

package_reboot_if_required: true
package_update: true
package_upgrade: true

packages:
  - bash
  - curl
  - tmux
  - firewalld

write_files:
  - path: /usr/local/bin/ensure-setcap.sh
    permissions: '0755'
    owner: root:root
    content: |
      #!/bin/bash
      set -euo pipefail

      echo "[setcap] Starting setcap check at $(date)"

      if command -v setcap >/dev/null 2>&1; then
        echo "[setcap] already installed"
        exit 0
      fi

      if command -v apt-get >/dev/null 2>&1; then
        apt-get install -y libcap2-bin
      elif command -v apk >/dev/null 2>&1; then
        apk add --no-cache libcap-utils
      elif command -v yum >/dev/null 2>&1; then
        yum install -y libcap
      elif command -v dnf >/dev/null 2>&1; then
        dnf install -y libcap
      elif command -v pacman >/dev/null 2>&1; then
        pacman -Sy --noconfirm libcap
      elif command -v emerge >/dev/null 2>&1; then
        emerge sys-libs/libcap
      else
        echo "[setcap] WARNING: no known package manager found; skipping installation" >&2
      fi

  - path: /usr/local/bin/ensure-caddy.sh
    permissions: '0755'
    owner: root:root
    content: |
      #!/bin/bash
      set -euo pipefail

      echo "[caddy] Starting caddy check at $(date)"

      if command -v caddy >/dev/null 2>&1; then
        echo "[caddy] already installed"
        exit 0
      fi

      if command -v apt-get >/dev/null 2>&1; then
        apt-get install -q debian-keyring debian-archive-keyring apt-transport-https curl
        curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
        curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
        apt-get update -q
        apt-get install -q caddy
      elif command -v apk >/dev/null 2>&1; then
        apk add --no-cache caddy
      elif command -v yum >/dev/null 2>&1; then
        yum install -y -q yum-plugin-copr
        yum copr enable -y -q @caddy/caddy
        yum install -y -q caddy
      elif command -v dnf >/dev/null 2>&1; then
        dnf install -y -q 'dnf-command(copr)'
        dnf copr enable -y -q @caddy/caddy
        dnf install -y -q caddy
      elif command -v pacman >/dev/null 2>&1; then
        pacman -Sy --noconfirm caddy
      elif command -v emerge >/dev/null 2>&1; then
        emerge www-servers/caddy
      else
        echo "[caddy] WARNING: no known package manager found; skipping installation" >&2
      fi

  - path: /usr/local/bin/install-urbit.sh
    permissions: '0755'
    owner: root:root
    content: |
      #!/bin/bash
      set -euo pipefail

      echo "[urbit] Starting install script at $(date)"

      ARCH=$(uname -m)
      echo "[urbit] Detected architecture: $ARCH"

      case "$ARCH" in
        x86_64)
          URBIT_ARCH="x86_64" ;;
        aarch64)
          URBIT_ARCH="aarch64" ;;
        *)
          echo "[urbit] ERROR: unsupported architecture '$ARCH'" >&2
          exit 1 ;;
      esac

      echo "[urbit] Downloading for architecture: $URBIT_ARCH"
      curl -fL -o /tmp/urbit.tar.gz "https://urbit.org/install/linux-${URBIT_ARCH}/latest"

      echo "[urbit] Extracting to /usr/local/bin/"
      tar xzkf /tmp/urbit.tar.gz --transform='s/.*/urbit/g' -C /usr/local/bin/

      echo "[urbit] Setting permissions"
      chown root:root /usr/local/bin/urbit
      chmod +x /usr/local/bin/urbit

      echo "[urbit] Install complete at $(date)"

  - path: /usr/local/bin/piercap
    permissions: '0755'
    owner: root:root
    content: |
      #!/bin/bash
      set -euo pipefail
      
      PIER_PATH="${1:?Usage: $0 <path-to-pier>}"
      
      # Use realpath if available
      if command -v realpath >/dev/null 2>&1; then
        PIER_PATH="$(realpath "$PIER_PATH")"
      else
        PIER_PATH="${PIER_PATH%/}"  # Remove trailing slash if present
      fi
      
      BIN="$PIER_PATH/.run"
      
      if [[ -f "$BIN" && -x "$BIN" ]]; then
        echo "[setcap] Applying cap_net_bind_service to $BIN"
        setcap 'cap_net_bind_service=+ep' "$BIN"
      else
        echo "[setcap] ERROR: .run binary not found or not executable at: $BIN" >&2
        exit 1
      fi

runcmd:
  - [ "bash", "-c", "dd if=/dev/zero of=/swapfile bs=1M count=2048 && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile && echo '/swapfile none swap sw 0 0' >> /etc/fstab" ]
  - [ "bash", "-c", "/usr/local/bin/ensure-setcap.sh" ]
  - [ "bash", "-c", "/usr/local/bin/ensure-caddy.sh" ]
  - [ "ln", "-sf", "/usr/local/bin/piercap", "/usr/sbin/piercap" ]
  - [ "systemctl", "enable", "--now", "firewalld" ]
  - [ "firewall-cmd", "--permanent", "--add-service=ssh" ]
  - [ "firewall-cmd", "--permanent", "--add-service=http" ]
  - [ "firewall-cmd", "--permanent", "--add-service=https" ]
  - [ "firewall-cmd", "--permanent", "--add-port=34540-34550/udp" ]
  - [ "firewall-cmd", "--reload" ]
  - [ "bash", "-c", "/usr/local/bin/install-urbit.sh" ]

```

{% endcode %}

</details>

## 1. Generate SSH keys

The first thing you need to do is generate an SSH key so you can connect to the VPS after you've created it. To do so, run the following command in the terminal:

```bash
ssh-keygen -q -t ed25519 -N "" -f ~/.ssh/urbit-vps
```

We'll come back to these keys later.

## 2. Create instance

You can use whichever cloud provider you prefer. Instructions are included for Digital Ocean, Hetzner, and Oracle Cloud, as well as generic instructions for others.

Comparison:

- **Digital Ocean:** the simplest to setup, but more expensive for what you get.
- **Hetzner:** cheaper than Digital Ocean and still relatively easy to configure. Based in Germany. Required KYC information.
- **Oracle Cloud:** quite complex compared to the other two. However, they provide 4 Ampere cores and 24GB of memory for free, which can be used as one very powerful instance or up to 4 single-core instances with 6GB of memory each.

{% tabs %}

{% tab title="Digital Ocean" %}

Create an account on [Digital Ocean](https://digitalocean.com). Once you make an account, choose "Create Droplets" from the menu.

Fill out the options like so:

#### Region

Choose the closest to you. The default data center for the region is fine.

#### Datacenter

Default.

#### Choose an image

Ubuntu, default version.

#### Choose a size

We'll go with the cheapest practical option in this guide:

* Shared CPU: Basic
* CPU options: Regular with SSD
* 2GB / 1 CPU ($12/mo)

You can choose a more powerful option if you'd like. The $14/mo premium AMD option is a good alternative. The $6/mo option with (1GB / 1 CPU) will likely work with swap but is not optimal.

#### Additional Storage

The $12 plan includes 50GB which should be sufficient for quite some time, so you can skip this.

#### Backups

Skip this.

#### Choose Authentication Method

Select "SSH keys" and hit "New SSH Key". Run the following in the terminal:

```sh
cat ~/.ssh/urbit-vps.pub
```

It should spit out a long string of letters and numbers beginning with `ssh-ed25519` and ending with `urbit-vps`. Copy the whole thing and paste it into the "SSH key content" field. Enter `urbit-vps` or whatever other name you'd like in the name field, then hit "Add SSH Key".

#### Advanced options

Skip "We recommend these options" and click "Advanced options" to expand it. Click on "Add initialization scripts".

On this page, go to the [Cloud init config](#cloud-init-config) section above, expand the "Cloud-init config file", and copy the text to the clipboard. Paste it into Digital Ocean where it says "Enter user data here..."

{% hint type="warning" %}

Make sure to paste the entire result of running `cat ~/.ssh/urbit-vps.pub` into the config file where it says `YOUR-SSH-KEY-HERE` on line 17. If you don't do this you won't be able to SSH into your VPS when setup is complete.

{% endhint %}

#### Finalize Details

Leave the quantity as 1 and skip the tags field. Where it says hostname, enter `urbit-vps` or something else if you'd prefer.

Finally, hit "Create Droplet". It'll take a minute, then you should see your droplet listed with a green dot, meaning it's running. Copy the IP address and save it somewhere so you can connect to it later.

Note that while it spins up pretty fast, `cloud-init` has to update all the packages and possibly reboot, so it may not be accessible or fully configured for a few minutes.

{% endtab %}

{% tab title="Hetzner" %}

Create an account on [Hetzner](https://www.hetzner.com/cloud). Open the cloud console, click on "New project" and call it "urbit" or whatever else you'd like.

Click on "create server" and fill out its options like so:

#### Location

Choose wherever's closest to you.

#### Image

Ubuntu, default version.

#### Type

Choose "Shared vCPU" and "Arm64 (Ampere)" for the architecture. Choose CAX11 (2 Ampere VCPUs / 4GB memory), it should be $3.99 per month or equivalent.

If this option's not available in the region you selected, you can try another region. You can choose a different option if you'd like but this one has the best performance at the lowest price.

#### Networking

Leave the default, with public IPv4 and IPv6 ticked.

#### SSH Keys

Click "Add SSH key", then run the following in the terminal on your local machine:

```sh
cat ~/.ssh/urbit-vps.pub
```

It should spit out a long string of letters and numbers beginning with `ssh-ed25519` and ending with `urbit-vps`. Copy the whole thing and paste it into the "SSH key" field, then hit "Add SSH key".

#### Volumes

Skip this section as the 40GB included by default is sufficient.

#### Firewalls

Skip this section as the `cloud-init` script will configure the firewall on the instance itself.

#### Backups, Placement groups, Labels

Skip these sections.

#### Cloud config

On this page, go to the [Cloud init config](#cloud-init-config) section above, expand the "Cloud-init config file", and copy the text to the clipboard. Paste it into Hetzner where it says "Cloud-init configuration".

{% hint style="warning" %}

Make sure to paste the contents of `~/.ssh/urbit-vps.pub` into the config file where it says `YOUR-SSH-KEY-HERE` on line 17. If you don't do this you won't be able to SSH into your VPS when setup is complete.

{% endhint %}

#### Name

Call it `urbit-vps` or something else if you'd prefer.

Finally, click "Create and buy". It'll take a minute, then you should see your droplet listed with a green dot, meaning it's running. Copy the IP address and save it somewhere so you can connect to it later.

Note that while it spins up pretty fast, `cloud-init` has to update all the packages and possibly reboot, so it may not be accessible or fully configured for a few minutes.

{% endtab %}

{% tab title="Oracle Cloud" %}

Create an account on [Oracle Cloud](https://www.oracle.com/cloud).

### Networking

Open the menu and click on "Networking", then click on "Virtual cloud networks". Click "Actions" and select "Start VCN Wizard".

For "Connection Type", select "Create VCN with Internet Connectivity". Fill out the form like so (most of these should be the default):

- **VCN name:** `urbit-vcn`
- **VCN IPv4 CIDR block:** `10.0.0.0/16`
- **Enable IPv6 in this VPN:** no.
- **Use DNS hostnames in this VCN:** yes.
- **Configure public subnet; IPv4 CIDR block:** `10.0.0.0/24`
- **Configure private subnet; IPv4 CIDR block:** `10.0.1.0/24`
- **Tags:** leave as default.

Click "Next" and then "Create". Wait for it to complete and then click "View VCN".

Go to the "Security" tab and click on the entry called "Default Security List for urbit-vcn".

Go to the "Security rules" tab, click "Add ingress rules", and add the following, hitting "+Another ingress rule" after each one:

| Source Type | Source CIDR | IP Protocol | Source Port Range | Destination Port Range | Description |
|-------------|-------------|-------------|-------------------|------------------------|-------------|
| CIDR        | 0.0.0.0/0   | TCP         | ALL               | 80                     | http        |
| CIDR        | 0.0.0.0/0   | TCP         | ALL               | 443                    | https       |
| CIDR        | 0.0.0.0/0   | UDP         | ALL               | 34540-34550            | ames        |

Once you've added these three rules, click "Add ingress rules" at the bottom.

### Instance

Open the menu and click on "Instances", then click on "Create instance".

Fill out the options like so:

#### Basic information

- **Name:** `urbit-vps`.
- **Create in compartment:** leave it as the default.
- **Placement:** leave it as the default, ignore "Advanced options".
- **Advanced options:** leave it as the default.
- **Image:** `Oracle Linux 9`
- **Shape:** Virtual machine, Ampere, `VM.Standard.A1.Flex`. Click the little arrow next to the shape name and set "Number of OCPUs" to 1, and "Amount of memory" to 6GB.
- **Advanced options:** Ignore everything except "Initialization script", where you should click "Paste cloud-init script", and paste in the [Cloud init config](#cloud-init-config) at the top of this page. Now run `cat ~/.ssh/urbit-vps.pub` in the terminal on your local machine. It should spit out a line beginning with `ssh-ed25519` and ending with `urbit-vps`. Copy it and paste it into the Cloud-init config on line 17 where it says `YOUR-SSH-KEY-HERE`. **This is important, if you forget to do this you won't be able to SSH into your VPS when setup is complete.**

{% hint %}
Note that on Oracle Cloud, their Ubuntu image includes `iptable` rules that prevent ingress apart from on port 22. If you use that image rather than `Oracle Linux 9` and you can't access your Urbit's web interface via its public IP address after booting it, you may need to edit those rules.
{% endhint %}

#### Security

Leave everything as default.

#### Networking

- **VNIC name:** `urbit-vnic`
- **Primary network:** "Select existing virtual cloud network"
- **Virtual cloud network name:** `urbit-vnc`
- **Virtual cloud network compartment:** leave it as the default.
- **Virtual cloud network:** `urbit-vcn`
- **Subnet:** select "Select existing subnet".
- **Subnet compartment:** leave it as the default.
- **Subnet:** the default should be "public subnet-urbit-vcn (regional)" or something similar. Leave it as that.
- **Private IPv4 address:** Select "Automatically assign private IPv4 address".
- **Automatically assign public IPv4 address:** yes.
- **IPv6 addresses:** no.
- **Advanced options:** leave as the default.
- **Add SSH keys:** select "Upload public key file (.pub)" and upload the `urbit-vps.pub` you created earlier in `.ssh/`.

#### Storage

- **Specify a custom boot volume size:** no, the default size is fine.
- **Use in-transit encryption:** this is fine to leave on.
- **Encrypt this volume with a key that you manage:** no.
- **Block volumes:** skip, the default boot volume is enough storage.

Now you can his "Create" and it'll show you the status of the work request. Click on the "Details" tab, go down to "Instance access", copy the public IP address listed, and save it somewhere so you can connect later.

{% endtab %}

{% tab title="Generic" %}

Create an account with the VPS provider of your choice. Go to their instance creation form, and fill out the options roughly as follows:

#### Location

Wherever you'd like, usually somewhere close to you.

#### Image

Ubuntu's a safe choice but you can choose whichever Linux image you prefer.

{% hint %}
Note that on Oracle Cloud, their Ubuntu image includes `iptable` rules that prevent ingress apart from on port 22. If you're using that host-image combo and you can't access your Urbit's web interface after booting it via its public IP address, you may need to edit those rules.
{% endhint %}

#### Type/Shape

Choose a shape that has 1 vCPU, at least 2GB of memory (ideally 4GB) and around 40GB of disk space. If they offer Arm/Ampere, they're usually good value for money and Urbit runs on them fine, but x86_64 is perfectly good too.

#### SSH keys

Upload or copy the contents of `~/.ssh/urbit-vps.pub` that you created earlier.

#### Initialization script

Somewhere they should have an option to add a Cloud-init config. It might be called "cloud config", "initialization script", "user data", or something in that vein. You need to paste in the [Cloud-init config](#cloud-init-config) at the top of this page. **This is important**.

{% hint type="warning" %}

Make sure to paste the contents of `~/.ssh/urbit-vps.pub` into the config file where it says `YOUR-SSH-KEY-HERE` on line 17. If you don't do this you won't be able to SSH into your VPS when setup is complete.

{% endhint %}

#### Networking

You just need a public IP address, default options are usually fine. If they have a firewall enabled by default, make sure you add the following ingress rules:

| Source    | Protocol | Source Port Range | Destination Port Range | Description |
|-----------|----------|-------------------|------------------------|-------------|
| 0.0.0.0/0 | TCP      | ALL               | 22                     | ssh         |
| 0.0.0.0/0 | TCP      | ALL               | 80                     | http        |
| 0.0.0.0/0 | TCP      | ALL               | 443                    | https       |
| 0.0.0.0/0 | UDP      | ALL               | 34540-34550            | ames        |

#### Storage

Usually the boot volume is large enough and you don't need to add any extra block storage.

Now create the instance, wait for it to be provisioned, then copy its public IP address and save it somewhere for when you connect later.

{% endtab %}

{% endtabs %}

## 3. Connect to the server

To make connecting simple, you can add an alias to `~/.ssh/config` on your local machine. Open `~/.ssh/config` in an editor (you may need to create it if the file doesn't exist), and add the following to the bottom of the file (replacing the IP address with the one you copied from your instance earlier):

```
Host urbit-vps
  HostName 192.168.1.123
  User urbit
  IdentityFile ~/.ssh/urbit-vps
  IdentitiesOnly yes
```

{% tabs %}

{% tab title="Upload existing pier" %}

If your Urbit is still running, use either `"Ctrl+d"` or `|exit` in the Dojo to shut it down.

With your Urbit now stopped (please be certain), archive your pier by running `tar cvzf sampel-palnet.tar.gz /path/to/your/pier` (substitute your own Urbit name and pier location).

Copy the archived pier to the server with the following (substituting your Urbit's name):

```sh
scp sampel-planet.tar.gz urbit-vps:
```

It may take a while to upload if your pier is large and/or your internet is slow.

Once the upload is complete, you can now connect to your server:

```bash
ssh urbit-vps
```

You'll be taken to the shell on your server.

{% hint %}
Note: it can take a few minutes for the server to be fully provisioned and configured. If you have trouble connecting, give it some more time. If you can connect but commands like `urbit` don't work, it's still being setup and you'll need to give it more time. If it asks you about the authenticity of the key fingerprint, just enter "yes".
{% endhint %}

{% endtab %}

{% tab title="Boot from keyfile" %}

{% hint %}

These instructions assume you've acquired a Urbit ID and downloaded its keyfile from [Bridge](https://bridge.urbit.org). If you don't have an Urbit ID yet, see the [Get an Urbit ID](../../get-on-urbit.md#get-an-urbit-id) section of the [Get On Urbit](../../get-on-urbit.md) guide. If you haven't downloaded your keyfile yet, see the [Get your keyfile](../../get-on-urbit.md#get-your-keyfile) section of the same guide.

{% endhint %}

Run the following in the terminal (replacing `/path/to/sampel-palnet.key` with the path to the keyfile you previously downloaded):

```sh
scp /path/to/sampel-palnet.key urbit-vps:
```

With your keyfile uploaded, you can now connect to your server:

```bash
ssh urbit-vps
```

You'll be taken to the shell on your server.

{% hint %}
Note: it can take a few minutes for the server to be fully provisioned and configured. If you have trouble connecting, give it some more time. If you can connect but commands like `urbit` don't work, it's still being setup and you'll need to give it more time. If it asks you about the authenticity of the key fingerprint, just enter "yes".
{% endhint %}

{% endtab %}

{% tab title="Boot a Comet" %}

You can now connect to your server:

```bash
ssh urbit-vps
```

You'll be taken to the shell on your server.

{% hint %}
Note: it can take a few minutes for the server to be fully provisioned and configured. If you have trouble connecting, give it some more time. If you can connect but commands like `urbit` don't work, it's still being setup and you'll need to give it more time. If it asks you about the authenticity of the key fingerprint, just enter "yes".
{% endhint %}

{% endtab %}

{% endtabs %}

## 4. Boot your Urbit

{% tabs %}
{% tab title="Upload existing pier" %}

In the previous section you ssh'd into the server. In the same ssh session, extract the pier archive you previously uploaded, then delete the archive:

```bash
tar xvzf sampel-palnet.tar.gz && rm sampel-palnet.tar.gz
```

You'll now have a folder called `sampel-palnet`. Urbit is best run in a `tmux` or `screen` session so it's easy to keep it running when you disconnect. In this case we'll use `tmux`, which has already been installed by the setup script.

Run `tmux`:

```bash
tmux new -s urbit
```

You should now be in `tmux`. First, dock your Urbit:

```bash
urbit dock sampel-palnet
```

That will copy the `urbit` runtime inside the pier.

Linux prevents non-root executables from binding privileged ports like 80 and 443 by default, but a script is included in the Cloud-init config to give piers the required permissions. Run the following (replacing `sampel-palnet` with your pier name):

```bash
sudo piercap /home/urbit/sampel-palnet
```

Now you can start your Urbit up with the following:

```bash
./sampel-palnet/.run -p 34540
```

After a few moments it'll show the Dojo prompt like `~sampel-palnet:dojo>`.

{% endtab %}

{% tab title="Boot from key file" %}

In the previous section you ssh'd into the server. In the same ssh session, start `tmux`:

```bash
tmux new -s urbit
```

You should now be in `tmux`. Boot a new Urbit with the following command, specifying the Urbit name and key file, as well as an Ames port in the range 34540-34550:

```bash
urbit -w sampel-palnet -k sampel-palnet.key -p 34540
```

It may take several minutes to boot the new Urbit. Eventually, it'll take you to the Dojo (Urbit's shell) and show a prompt like `~sampel-palnet:dojo>`. Once booted, shut the Urbit down again by typing `|exit` in the Dojo.

The key file is only needed when you first boot the Urbit, so it's good practice to delete it after first boot:

```bash
rm sampel-palnet.key
```

Linux prevents non-root executables from binding privileged ports like 80 and 443 by default, but a script is included in the Cloud-init config to give piers the required permissions. Run the following (replacing `sampel-palnet` with your pier name):

```bash
sudo piercap /home/urbit/sampel-palnet
```

Now you can start your Urbit up with the following:

```bash
./sampel-palnet/.run -p 34540
```

After a few moments it'll show the Dojo prompt like `~sampel-palnet:dojo>`.

{% endtab %}

{% tab title="Boot a Comet" %}

In the previous section you ssh'd into the server. In the same ssh session, start `tmux`:

```bash
tmux new -s urbit
```

You should now be in `tmux`. Boot a new comet with the following command, specifying whatever name you'd like for the pier, as well as an Ames port in the range 34540-34550:

```bash
urbit -c mycomet -p 34540
```

It may take several minutes to boot the new comet. Eventually, it'll take you to the Dojo (Urbit's shell) and show a prompt like `~sampel_litzod:dojo>`. Once booted, shut the comet down again by typing `|exit` in the Dojo.

Now you can start your comet up with the following:

```bash
./mycomet/.run -p 34540
```

After a few moments it'll show the Dojo prompt like `~sampel_litzod:dojo>`.

{% endtab %}

{% endtabs %}

## 5. Get a domain

{% tabs %}

{% tab title="Planet or Star" %}

To make accessing the web interface convenient, you should request an `arvo.network` domain name. To do so, run the following command in the Dojo:

```
|dns-config
```

It will ask you three things:
- **IP address:** enter the public IP address of your VPS.
- **Reset existing DNS configuration:** `y`
- **Perform recommended self-checks:** `y`

It will begin negotiating a subdomain with `~deg` and might take a few minutes. It should eventually say:

```
acme: requesting an https certificate for sampel-palnet.arvo.network
acme: received https certificate for sampel-palnet.arvo.network
http: restarting servers to apply configuration
http: web interface live on https://localhost:443
http: web interface live on http://localhost:80
http: loopback live on http://localhost:12321
```

That means the domain has been registered and an SSL certificate has been installed, so you can access the web interface securely with HTTPS.

{% endtab %}

{% tab title="Comet" %}

You can only get an `arvo.network` subdomain if you're running a Planet or a Star. For a comet, the best approach is to get a free subdomain from [freedns.afraid.org](https://freedns.afraid.org/) and use [Caddy](https://caddyserver.com) as a reverse-proxy to configure an SSL certificate. Cloud-init will have already installed Caddy.

First, go to [freedns.afraid.org](https://freedns.afraid.org/) and click "Sign up Free". Fill out your details and click "Send activation email". Click the link in the email to enable your account, then Login to your new account. Click "Subdomains" in the "For Members" menu and click "Add a subdomain".

Fill out the "Add a new subdomain" form:

- **Type:** `A`
- **Subdomain:** whatever you'd like.
- **Domain:** whichever you'd prefer.
- **Destination:** the public IP address of your server.
- **TTL:** skip.
- **Wildcard:** leave unticked.

Complete the CAPTCHA and click "Save!"

Now, back in the terminal of your server, hit `Ctrl+b d` (that is, you hit `Ctrl+b`, release it, and then hit `d`) to disconnect from `tmux`. In the main shell, run the following command, replacing `mysubdomain.example.com` which the domain you chose in the previous step.

```
echo -e "mysubdomain.example.com {\n  reverse_proxy localhost:8080\n}\n" | sudo tee /etc/caddy/Caddyfile > /dev/null
```

Next, start and enable the Caddy reverse-proxy with the following command:

```
sudo systemctl enable --now caddy
```

You can now run `tmux a` to reattach the `tmux` session and get back to your Urbit's Dojo.

{% endtab %}

{% endtabs %}

## 6. Log in to Landscape

In order to login to the web interface, you need to get the web login code. Run the following in the Dojo:

```
+code
```

It'll spit out something like `ropnys-batwyd-nossyt-mapwet`. That's your web login code, you can copy that and save it in a password manager or similar. Note that the web login code is separate from the master ticket.

The server configuration should now be complete, and you can access Landscape in the browser. Navigate to the domain you configured previously, for example `sampel-palnet.arvo.network`. You should see the Landscape login screen.

Enter the web login code and you'll be taken to your Urbit's homescreen. Your Urbit is now running in the cloud, and you can access it from any device by visiting its URL.

## 7. Disconnect

You can now disconnect from the tmux session by hitting `CTRL+b d` (that is, you hit `CTRL+b`, release it, and then hit `d`). You'll be taken back to the ordinary shell, but the Urbit will still be running in the background. If you want to get back to the Dojo again, you can reattach the tmux session with:

```bash
tmux a
```

Finally, you can disconnect from the ssh session completely by hitting `CTRL+d`.

## 8. Cleanup

If you booted an Urbit by uploading a key file, it's a good idea to now delete the key file on your local machine.

If you uploaded an existing pier, you should delete the old copy of both the pier directory and the `.tar.gz` archive on your local machine. You might be tempted to keep one of these as a backup, but note that **you must never again boot the old copy on the live network**. Doing so will create unfixable networking problems and require you to perform a factory reset through Bridge, wiping your Urbit's data. We therefore don't recommend you keep duplicates of your pier lying around.

