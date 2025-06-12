# Software Distribution

Urbit supports peer-to-peer distribution and installation of applications. A user can click on a link to an app published on another ship to install that app. Landscape lets users manage their installed apps and launch their interfaces in new tabs.

This document describes the architecture of Urbit's app distribution system. For a walkthrough of creating and distributing an app, see the [`Guide`](../../guides/software-distribution.md) document.

## Architecture <a href="#architecture" id="architecture"></a>

The unit of software distribution is the desk. A desk is a lot like a git branch, but full of typed files, and designed to work with the Arvo kernel. In addition to files full of source code, a desk specifies the version(s) of the kernel that it's compatible with, and it includes a manifest describing which of its Gall agents should be run by default.

Every desk is self-contained: the result of validating and building its files is a pure function of those files and the standard libraries provided by the running kernel. A desk on one ship will build the same as on any other ship.

For the moment, every live desk must support the running kernel version. Kernel backwards compatibility is an intended feature in the future, but for now, app developers will need to publish an app update supporting new kernels each time they're released.

Each desk defines its own filetypes (called `mark`s), in its `/mar` folder. There are no shared system marks that all userspace code knows, nor common libraries in `/lib` or `/sur` — each desk is completely self-contained.

It's common for a apps to interact with apps on other desks, and therefore need marks and libraries by the other desk's developer. Since direct cross-desk dependencies are not currently supported, the typical approach is for app developers to publish a "dev" folder on their git repo with the files need for developers interfacing with their app.

Most desks will want to include the `base-dev` folder from the [urbit/urbit](https://github.com/urbit/urbit) repo so they can easily interact with system apps in the `%base` desk.

Landscape apps (those with frontends launched from a tile in Landscape), should also include `desk-dev` from the [Landscape repo](https://github.com/tloncorp/landscape). This folder includes the `%docket-0` mark, which the app needs in order to include a `/desk/docket-0` file.

The `%docket` agent in Landscape reads the `/desk/docket-0` file to display an app tile on the home screen and hook up other front-end functionality, such as downloading the app's client bundle ([glob](glob.md)). Docket also manages app installs, serves the home screen, downloads client bundles, and communicates with Kiln to configure the apps on your system.

### Anatomy of a Desk <a href="#anatomy-of-a-desk" id="anatomy-of-a-desk"></a>

Desks contain helper files in `/lib` and `/sur`, generators in `/gen`, marks in `/mar`, threads in `/ted`, tests in `/tests`, and Gall agents in `/app`. In addition, desks also contain these files:

```
/sys/kelvin     ::  Kernel kelvin, e.g. [%zuse 410] (mandatory)
/desk/bill      ::  list of agents to start on install (optional, read by Kiln) 
/desk/docket-0  ::  app metadata (optional, read by Docket) 
/desk/ship      ::  ship of original desk publisher (optional, read by Docket) 
```

Only the `%base` desk contains a `/sys` directory with the standard library and vanes. All other desks simply specify the kernel version(s) they're compatible with in the `/sys/kelvin` file.

### Updates <a href="#updates" id="updates"></a>

Kiln listens to the publisher for any new commits to the desk. If an update is compatible with the current kernel, it will be installed immediately. Any running Gall agents on the desk will be upgraded and if there's a new front-end glob version, it will be fetched. If the update is only compatible with a future kelvin, it will be queued until a compatible kernel upgrade is applied.

A kernel update with a new kelvin version will not be applied until all running apps have compatible updates queued for installation. Users have the option to force the kernel update, which will suspend any incompatible apps. Once they receive a compatible update, they'll automatically be upgraded and started back up. It's therefore important for app publishers to push updates ahead of any new kernel versions. The Urbit Foundation will announce new kernel updates in advance, so app developers have time to update their apps. Often the only necessary change is signalling compatibility with the new version in `sys.kelvin`, but sometimes further changes are necessary. Breaking changes will be included in the release notes of release candidates on the [urbit/urbit](https://github.com/tloncorp/landscape) Github repo.

### Managing Apps and Desks in Kiln <a href="#managing-apps-and-desks-in-kiln" id="managing-apps-and-desks-in-kiln"></a>

The default agents to run are listed in the `/desk/bill` file of the desk. These can be forced off, or additional agents forced on, with commands to Clay.

For details of the generators for managing desks and agents, see the [`Dojo Tools`](../../../../user-manual/os/dojo-tools.md) document.

### Landscape apps <a href="#landscape-apps" id="landscape-apps"></a>

It's possible to create and distribute desks without a front-end, but most developers will want a web UI for their app. There are a couple of options for this:

* Have a Gall agent handle directly HTTP requests through, doing server-side page rendering and/or serving front-end files out of Clay. You can refer to the [Sail guide](../../../../hoon/guides/sail.md) for more information about generating HTML in Hoon.
* Have the Gall agents perform back-end functions only, and create a separate client bundle called a [`glob`](glob.md), which contains the front-end files like HTML, CSS, JS, images, and so forth.

When an app is started, `%docket` will read the `desk.docket-0` file in the desk and, if it specifies a glob, fetch and serve it. For more details of the docket file, see the [Docket File](docket.md) document.

### Globs <a href="#globs" id="globs"></a>

If the glob is to be served over Ames, the Docket globulator at the `/docket/upload` URL will let you upload the front-end files. It'll automatically update the `desk.docket-0` file with the name and hash so people who install the desk know where to get it.

If the glob is to be served over HTTP, the [`-make-glob`](glob.md#make-glob) thread can be used to assemble it from the individual front-end files and output the resulting `.glob` file to the host filesystem. You can then upload the glob to an s3 bucket or wherever else you'd like to serve it from. You can then update the `desk.docket-0` file with the URL.

Note that serving a glob over Ames might increase the install time for your app, since Ames is currently pretty slow compared to HTTP — but being able to serve a glob from your ship allows you to serve your whole app, both server-side and client-side, without setting up a CDN or any other external web tooling. Your ship can do it all on its own.

For further details of globs, see the [Glob](glob.md) document.

## Sections <a href="#sections" id="sections"></a>

* [Glob](glob.md) - Documentation of `glob`s (client bundles).
* [Docket Files](docket.md) - Documentation of docket files.

## Further reading <a href="#further-reading" id="further-reading"></a>

* [Guide](../../guides/software-distribution.md) - A walkthrough of creating, installing and publishing a new desk with a tile and front-end.
