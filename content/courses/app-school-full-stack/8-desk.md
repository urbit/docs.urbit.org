# 8. Desk and glob

With our React app now complete, we can put together the final desk and publish
it.

## Config files {#config-files}

So far we've written the following files for the back-end:

```
ourfiles
├── app
│   └── journal.hoon
├── lib
│   └── journal.hoon
├── mar
│   └── journal
│       ├── action.hoon
│       └── update.hoon
└── sur
    └── journal.hoon
```

There's a handful of extra files we need in the root of our desk:

- `desk.bill` - the list of agents that should be started when our app is installed.
- `sys.kelvin` - the kernel version our app is compatible with.
- `desk.docket-0` - configuration of our app tile, front-end glob and other metadata.

We only have one agent to start, so `desk.bill` is very simple:

```
:~  %journal
==
```

Likewise, `sys.kelvin` just contains:

```
[%zuse 414]
```

The `desk.docket-0` file is slightly more complicated:

```
:~
  title+'Journal'
  info+'Dear diary...'
  color+0xd9.b06d
  version+[0 1 0]
  website+'https://urbit.org'
  license+'MIT'
  base+'journal'
  glob-ames+[~zod 0v0]
==
```

The fields are as follows:

- `%title` is the name of the app - this will be displayed on the tile and when people search for the app to install it.
- `%info` is a brief description of the app.
- `%color` - the RGB hex color of the tile.
- `%version` - the version number of the app. The fields represent major, minor and patch version.
- `%website` - a link to a website for the app. This would often be its Github repo.
- `%license` - the license of for the app.
- `%base` - the desk name of the app.
- `%glob-ames` - the ship to retrieve the front-end files from, and the hash of those files. We've put \~zod here but this would be the actual ship distributing the app when it's live on the network. The hash is `0v0` initially, but once we upload the front-end files it will be updated to the hash of those files automatically. Note that it's also possible to distribute front-end files from a separate web server. In that case, you'd use `glob-http` rather than `glob-ames`. The [Glob documentation](../../userspace/apps/reference/dist/glob.md) covers this alternative approach in more detail.

Our files should now look like this:

```
ourfiles
├── app
│   └── journal.hoon
├── desk.bill
├── desk.docket-0
├── lib
│   └── journal.hoon
├── mar
│   └── journal
│       ├── action.hoon
│       └── update.hoon
├── sur
│   └── journal.hoon
└── sys.kelvin
```

## New desk {#new-desk}

Next, we'll create a new `%journal` desk on our ship by forking an existing one. Once created, we can mount it to the unix filesystem.

In the Dojo of a fake ship:

```
|new-desk %journal
|mount %journal
```

Now we can browse to it in the unix terminal:

```sh
cd /path/to/zod/journal
```

Currently it just contains some skeleton files, so we need to delete those:

```sh
rm -rI /path/to/zod/journal/*
```

Apart from the kernel and standard library, desks need to be totally self-contained, including all mark files and libraries necessary to build them. For example, since our app contains a number of `.hoon` files, we need the `%hoon` mark, and its dependencies. The easiest way to ensure our desk has everything it needs is to copy in the "dev" versions of the `%base` and `%landscape` desks. To do this, we first clone the Urbit and Landscape git repositories:

```sh
git clone https://github.com/urbit/urbit.git urbit-git
git clone https://github.com/tloncorp/landscape.git landscape-git
```

If we navigate to the `/pkg` directory in the cloned `/urbit` repo:

```sh
cd /path/to/urbit-git/pkg
```

...we can combine the `/base-dev` and Landscape `/desk-dev` desks with the included `symbolic-merge.sh` script:

```sh
./symbolic-merge.sh base-dev journal
./symbolic-merge.sh ../../landscape-git/desk-dev journal
```

Now, we copy the contents of the new `/journal` folder into our empty desk:

```sh
cp -rL journal/* /path/to/zod/journal/
```

Note we've used the `L` flag to resolve symbolic links.

We can copy across all of our own files too:

```sh
cp -r /path/to/ourfiles/* /path/to/zod/journal/
```

Finally, in the dojo, we can commit the whole lot:

```
|commit %journal
```

## Glob {#glob}

The next step is to build our front-end and upload the files to our ship. If you haven't yet downloaded the journal front-end source files, you can grab them from [their repository](https://github.com/urbit/docs-examples). In the folder containing our React app (`/journal-app/ui` relative to the repository base directory), we can run:

```sh
npm run build
```

This will create a `/build` directory containing the compiled front-end files. To upload it to our ship, we need to first install the `%journal` desk. In the dojo:

```
|install our %journal
```

Next, in the browser, we navigate to the `%docket` globulator at `http://localhost:8080/docket/upload` (replacing localhost with the actual host):

![](https://m.tinnus-napbus.xyz/pub/globulator.png)

We select our `%journal` desk, then we hit "Choose file", and select the whole `/build` directory which was created when we build our React app. Finally, we hit "glob!" to upload it.

(For real production apps, you might prefer to use the [`-make-glob` thread](../../userspace/apps/reference/dist/glob.md#make-glob) in the `%landscape` desk. This allows you to publish the glob from somewhere other than your ship; if your ship publishing the app is down, anyone can install the desk from a peer and get the frontend glob from this other location.)

If we now return to the homescreen of our ship, we'll see our tile displayed, and we can open our app by clicking on it:

![](https://m.tinnus-napbus.xyz/pub/tiles.png)

## Publishing {#publishing}

The last thing we need to do is publish our app, so other users can install it from our ship. To do that, we just run the following command in the dojo:

```
:treaty|publish %journal
```

## Resources {#resources}

- [App publishing/distribution documentation](../../userspace/apps/reference/dist) - Documentation covering third party desk composition, publishing and distribution.
- [Glob documentation](../../userspace/apps/reference/dist/glob.md) - Comprehensive documentation of handling front-end files.
- [Desk publishing guide](../../userspace/apps/guides/software-distribution.md) - A step-by-step guide to creating and publishing a desk.
- [-make-glob guide](../../userspace/apps/reference/dist/glob.md#make-glob)
