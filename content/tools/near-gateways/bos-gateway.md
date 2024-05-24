+++
title = "Building a BOS Gateway"
weight = 10
template = "doc.html"
+++

Run this npx command to create a new gateway.

```
> npx @urbit/create-near-app
```

By default, this will create a new directory called `hello-urbit`.

## Configuring your development environment

In production you’ll be serving your gateway from an Urbit ship, but in this testing environment your gateway isn’t connected to your ship by default. To test components which use the `Urbit` method, you’ll need to specify which ship you want to talk to on which port.

You can specify this in the `.env` file at the root of the `hello-urbit` project. By default, we specify a fakeship called ~zod, which is running on `localhost:8080` and has the access code `lidlut-tabweb-pillex-ridrup`.

```
SHIP=zod
URL=http://localhost:8080
CODE=lidlut-tabwed-pillex-ridrup
```

Fakeships’ access codes are deterministic — every fake ~zod has the same code, every fake ~bud has the same code, etc. — so you don’t need to worry about leaking this info. You should, however, be careful to keep your real ships’ info in this `.env` file and avoid putting it in code that’s going to be uploaded to the blockchain.

If you’re using a ship that’s not a fake ~zod, you can get your ship’s access code by entering `+code` in the Dojo.

```
> +code
lidlut-tabwed-pillex-ridrup
```

(If you’ve not done so already, you can use this access key to log into your fakeship from your web browser.)

## Using the example app

You can run `npm run dev` from the `hello-urbit` directory to preview your gateway. This will automatically open the dev server in your browser at `localhost:8081`.

The example components here allow you to send “pokes” and “scries” to your fakeship. For now, you can think of pokes as POST requests and scries as GET requests.

In the “Poke ~zod” component, you can enter the placeholder App, Mark, and JSON values to show the following in your fakeship’s Dojo.

```
< ~zod: hi ~zod
```

Some more pokes include:
{more}

The “Scry to ~zod” component will fetch some data from any app on your fakeship, assuming you’re authenticated and an endpoint exists.

Some examples include:
- **App: “docket”, Path: “/charges”**: See information about the apps installed on your ship.

## Developing and testing your BOS gateway

You can now start modifying this default gateway. This gateway is an ideal environment to develop Urbit-aware components to deploy on the NEAR blockchain, or develop an entire gateway. Let’s go over the structure of the default gateway and see where you can find everything you need.

The default gateway will have this structure. The most important parts are the gateway itself (`/src`), and your components (`/apps`).

```
.
├── LICENSE
├── README.md
├── apps
│   ├── bos.config.json
│   └── widget
│       ├── app.jsx
│       └── components
│           ├── header.jsx
│           ├── pokeUrbit.jsx
│           └── scryUrbit.jsx
├── build
│   └── data.json
├── config
│   ├── paths.js
│   ├── presets
│   │   ├── loadPreset.js
│   │   └── webpack.analyze.js
│   ├── webpack.development.js
│   └── webpack.production.js
├── package.json
├── pnpm-lock.yaml
├── public
│   └── index.html
├── src
│   ├── App.js
│   ├── App.scss
│   ├── hooks
│   │   ├── useHashRouterLegacy.js
│   │   └── useScrollBlock.js
│   ├── index.css
│   ├── index.js
│   └── pages
│       └── ExamplePage.js
└── webpack.config.js
```

Next, let's talk about `Widget`s and components.
