---
description: "Developer environment setup guide for Urbit development, including text editor configuration, development ship setup, and project organization best practices."
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

# Environment Setup

This guide covers best practices for preparing your environment to develop within the Urbit ecosystem.

## Text editors {#text-editors}

A variety of plugins have been built to provide support for the Hoon language in different text editors. These are listed below.

**Note:** The hoon compiler expects Unix-style line endings (LF) and will fail to parse Windows-style line endings (CRLF). Make sure your editor is set to use LF for line endings, especially if you're developing on Windows.

#### Visual Studio Code

Visual Studio Code is free and open-source and runs on all major operating systems. It is available [here](https://code.visualstudio.com/). Hoon support may be acquired in the Extensions menu within the editor by searching for `Hoon`.

#### Sublime Text

Sublime Text is closed-source, but may be downloaded for free and there is no enforced time limit for evaluation. It runs on all major operating systems. It is available [here](https://www.sublimetext.com/).

#### Emacs

Emacs is free and open-source and runs on all major operating systems. It is available [here](https://www.gnu.org/software/emacs/). Hoon support is available with [hoon-mode.el](https://github.com/urbit/hoon-mode.el).

#### Vim

Vim is free and open-source and runs on all major operating systems. It is available [here](https://www.vim.org/). Hoon support is available with [hoon.vim](https://github.com/urbit/hoon.vim).

## Development ships {#development-ships}

### Creating a fake ship {#creating-a-fake-ship}

To do work with Hoon, we recommended using a "fake" ship — one that's not connected to the network.

Because such a ship has no presence on the network, you don't need an Azimuth identity. You just need to have [installed the Urbit binary](../get-on-urbit.md#get-the-urbit-runtime).

To create a fake ship named ~zod, run the command below. You can replace `zod` with any valid Urbit ID.

```
./urbit -F zod
```

This will take a couple of minutes, during which you should see a block of boot messages, starting with the Urbit version number.

### Fake ship networking {#fake-ship-networking}

Fake ships on the same machine can automatically talk to one another. Having created a fake ~zod, you can create a fake ~bus the same way:

```
./urbit -F bus
```

Now in the fake ~bus's dojo, try:

```
> |hi ~bus
>=
hi ~bus successful
```

### Local Networking {#local-networking}

Fake ships run on their own network using fake keys and do not communicate with live-net ships in any way. Multiple fake ships running on the same machine can network with each other. They don't need to have a "realistic" chain of fake sponsors to communicate.

### Faster fake ship booting {#faster-fake-ship-booting}

While working with Hoon, you'll often want to delete an old fake ship and recreate a fresh one. Rather than having to wait a few minutes for the fresh ship to be initialized, you can instead create a backup copy of a fake ship. That way you can just delete the current copy, replace it with the backup, and reboot in a matter of seconds.

To do this, boot a fresh fake ship like usual, but with a different name:

```
./urbit -F zod -c zod.new
```

Once it's finished booting, it's a good idea to mount its desks so you don't have to do it again each time. In the Dojo:

```
> |mount %base
>=
> |mount %landscape
>=
```

Next, shut the ship down with `Ctrl+D`. Then, copy the pier and start using the copy instead:

```
cp -r zod.new zod
./urbit zod
```

Now whenever you want a new fake ~zod, you can just shut it down and do:

```
rm -r zod
cp -r zod.new zod
./urbit zod
```

## Working with desks {#working-with-desks}

If you're just working in the dojo or experimenting with generators, committing to the `%base` desk on a fake ship is fine. If you're working on a Gall agent or developing a desk for distribution, you'll most likely want to work on a separate desk and it's slightly more complicated.

### Mount a desk {#mount-a-desk}

To mount a desk to Unix so you can add files, you just need to run the `|mount` command in the dojo and specify the name of the desk to mount:

```
|mount %base
```

The desk will now appear in the root of your pier (zod in this case):

```
zod
└── base
```

You can unmount it again by running the `|unmount` command in the dojo:

```
|unmount %base
```

### Create a new desk {#create-a-new-desk}

To create a new desk, you can just run:

```
|new-desk %mydesk
```

If you run `|mount %mydesk`, you'll see a `/mydesk` directory in your pier with the following files:

```
mydesk
├── mar
│   ├── hoon.hoon
│   ├── kelvin.hoon
│   ├── noun.hoon
│   └── txt.hoon
└── sys.kelvin
```

The mark files in `/mar` are for handling some basic filetypes, and `sys.kelvin` specifies which kernel version(s) the desk is compatible with. The `|new-desk` generator populates `sys.kelvin` with the current kernel version like `[%zuse 410]`.

You can delete these files, copy in your own and run `|commit %mydesk` in the Dojo.

## `/*-dev` folders {#dev-folders}

The files included by `|new-desk` are the only the bare minimum necessary to mount the desk. If you're building a full app, you'll almost certainly need a number of mark files and libraries from the `%base` and `%landscape` desks. If your app is going to talk to other apps on your ship, you'll likely need files for those, too.

To make these dependencies easier, the convention is for developers to include the necessary files in a separate `/*-dev` folder in their git repo:

- The [urbit/urbit repo](https://github.com/urbit/urbit) includes a [`base-dev` folder](https://github.com/urbit/urbit/tree/develop/pkg/base-dev) with the files necessary for interacting with agents on the `%base` desk, among other useful marks and libraries.
- The [tloncorp/landscape repo](https://github.com/tloncorp/landscape) includes a [`desk-dev` folder](https://github.com/tloncorp/landscape/tree/develop/desk-dev) with marks and libraries for building Landscape apps.

You can clone these repos and copy the contents of their `/*-dev` folders into your own projects. A better alternative is to use the [desk skeleton](#desk-skeleton) described below.

## Project organization {#project-organization}

When you're developing a desk, it's best to structure your working directory with the same hierarchy as a real desk. For example, `~/project-repo/desk` might look like:

```
desk
├── app
│   └── foo.hoon
├── desk.bill
├── desk.docket-0
├── lib
│   └── foo.hoon
├── mar
│   └── foo
│       ├── action.hoon
│       └── update.hoon
├── sur
│   └── foo.hoon
└── sys.kelvin

```

That way, whenever you want to test your changes, you can just copy it across to your pier like:

```
cp -ruv desk/* /path/to/fake/zod/mydesk
```

And then just commit it in the dojo:

```
|commit %mydesk
```

If you're using [dev folders](#dev-folders) as a base, it's best to keep those files separate from your own code.

## Desk skeleton {#desk-skeleton}

Dependency management can be inconvenient when building Urbit apps. If you manually copy in `/base-dev` and Landscape's `/desk-dev`, it can be annoying to update them when a new kernel version is released.

For this reason, the Urbit Foundation has published a desk skeleton to use for new projects. It includes a couple of tools to make code organization and dependency management easier.

You can git clone the repo from [urbit/desk-skeleton](https://github.com/urbit/desk-skeleton):

```sh
git clone https://github.com/urbit/desk-skeleton.git my-project
```

Then you can create a `my-project` repo on your Github, set the upstream to that instead, and push it:

```sh
cd my-project
git remote set-url origin https://github.com/YOUR-GITHUB/my-project.git
git push
```

The desk skeleton contains a `/desk` folder with an extremely simple example app. You can delete the `/app/example.hoon` file, add your own files, list your own agents in `desk.bill`, and add your own Docket configuration to `desk.docket-0`.

You can optionally create a separate `/desk-dev` folder for any dependencies another developer would need, or you can just put everything in `/desk`.

You'll notice `/desk` doesn't include `/base-dev` or Landscape's `/desk-dev` files. Instead, they're configured in `peru.yaml` and pulled in by [peru](https://github.com/buildinspace/peru). Peru is a Python app for managing dependencies. You can install it from:

- [pip](https://pypi.org/project/pip/): `pip install peru`
- [Homebrew](https://brew.sh/): `brew install peru`
- The [AUR](https://aur.archlinux.org/packages/peru) if you use Arch Linux

With `peru` installed on your system, you simply need to run `./build.sh`. It'll create a `/dist` folder, copy in all the files from the `/desk` folder (and `/desk-dev` if it exists), and copy in the files from `/base-dev` and Landscape's `/desk-dev` on Github. The `/dist` folder will now contain all the necessary files, and you can copy them across to a mounted desk on a fake ship and `|commit` them in the Dojo.

The `./build.sh` script can be run again any time you make changes.

If there's a kernel update down the line and you need to update the `/base-dev` and Landscape dependencies, you just need to run `peru reup`. This will update `peru.yaml` to use the latest commit on the `master` branch of the `urbit/urbit` and `tloncorp/landscape` GitHub repos. Then you can just run `./build.sh` again.

The default `peru.yaml` only includes the two dependencies mentioned, but you can easily add any others you need. Refer to the [peru documentation](https://github.com/buildinspace/peru) configuration details.

