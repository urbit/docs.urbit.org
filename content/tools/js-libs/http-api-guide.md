# HTTP API

Urbit's Eyre vane is an HTTP server which our web frontends can talk to. In this guide, we'll create a simple Urbit app and use the [`@urbit/http-api`](https://github.com/urbit/js-http-api) JavaScript module to interact with it from a web app.

## Background {#background}

Eyre's API is a fairly thin overlay on some of Arvo's internal systems, so there's some basic things to understand.

### Clay {#clay}

[Clay] is the filesystem vane. It's typed, and it's revision-controlled in a similar way to git. Clay contains a number of [desk]s, which are a bit like git repositories. Each app on your ship's home screen corresponds to a desk in Clay. That desk contains the source code and resources for that app.

#### Marks

Most of Clay's workings aren't relevant to frontend development, but there's one important concept to understand: [mark]s. Clay is a typed filesystem, and marks are the filetypes. There's a mark for `.hoon` files, a mark for `.txt` files, and so on. The mark specifies the datatype for those files, and it also specifies conversion methods between different types. Marks aren't just used for files saved in Clay, but also for data that goes to and from the web through Eyre.

When you send a [poke](#pokes) or run a [thread](#threads) through Eyre's HTTP API, Clay will look at the mark specified (for example `ui-action`, `contact-action-1`, etc.) and use the corresponding mark file in the relevant desk to convert the given JSON to that type, before passing it to the target [agent](#gall-agents) or thread. The same conversion will happen in reverse for responses.

Note that Eyre makes a best effort attempt to convert data to and from JSON. If the marks in question do not contain appropriate JSON conversion functions, it will fail. Not all [scry endpoints](#scry-endpoints), [subscription paths](#subscriptions), and pokes are intended to be used from a frontend, so not all of them use marks which can convert to and from JSON. (The `noun` mark for example). The majority of things you'll want to interact with through Eyre will work with JSON.

### Gall agents {#gall-agents}

An _agent_ is a userspace application managed by the [Gall] vane. A desk may contain multiple agents that do different things. The [Tlon Messenger](https://github.com/tloncorp/tlon-apps) app, for example, has the `%contacts`, `%profile`, and `%lanyard` agents in its desk, among others. Agents are the main thing you'll interact with through Eyre. They have a simple interface with three main parts:

| Interface     | Description                                                                                                                                                                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pokes         | One-off message to an agent. Pokes often represent actions, commands, requests, etc.                                                                                                                                                                            |
| Subscriptions | An agent may have a number of different paths to which you may subscribe. |
| Scries        | Scries are one-time, read-only requests for data. Like subscriptions, they are organized by path. Scry requests will be fulfilled immediately.                                                             |

#### Pokes {#pokes}

Pokes are single, standalone messages to agents. Pokes are how you send data and requests to agents. Agents will send back either a positive acknowledgement (ack) or a negative acknowledgement (nack). The agent can't send actual data back in the acks. If they have any response to give back, it will be sent out to subscribers on a subscription path instead.

The pokes an agent accepts will be defined in the `+on-poke` section of its source code in the desk's `/app` directory, or maybe in its type definition file in the `/sur` directory.

`@urbit/http-api` includes a `poke()` function which allows you to perform pokes through Eyre, and is [detailed below](#poke).

#### Subscriptions {#subscriptions}

Agents define subscription paths which you can subscribe to through Eyre. A path might be simple and fixed like `/foo/bar`, or it might have dynamic elements where you can specify a date, a user, a key in a key-value store, etc. Each agent will define its subscription paths in the `+on-watch` section of its source code.

You can subscribe by sending a request to the agent with the desired path specifed. The agent will apply some logic (such as checking permissions) to the request and then ack or nack it. If acked, you'll be subscribed. You might receive an initial payload of data defined in `+on-watch`. Then you'll begin receiving any updates the agent sends out on that path in future. What you'll receive on a given path depends entirely on the agent.

Agents can kick subscribers, and you can unsubscribe at any time.

`@urbit/http-api` includes a `subscribe()` function which allows you to subscribe and unsubscribe to paths through Eyre, and is [detailed below](#subscribe).

#### Scry Endpoints {#scry-endpoints}

Pokes and subscriptions can modify the state of the agent. A third kind of interaction called a _scry_ does not. It simply retrieves data from the agent without any side-effects. Agents can define _scry endpoints_ which, like subscriptions, are paths. A scry to one of these endpoints will retrieve some data as determined by the agent. Like subscription paths, scry paths can be simple like `/foo/bar` or contain dynamic elements. Unlike subscriptions, a scry is a one-off request and the data will come back immediately.

Scry endpoints are defined in the `+on-peek` section of an agent's source code. Scry endpoints will be written with a leading letter like `/x/foo/bar`. That letter is a `care` which tells Gall what kind of request this is. All scries through Eyre have a care of `/x`, so that letter needn't be specified.

`@urbit/http-api` includes a `scry()` function which allows you to perform scries through Eyre, and is [detailed below](#scry).

### Threads {#threads}

A thread is a monadic function in Arvo that takes arguments and produces a result. Threads are conceptually similar to Javascript promises: they can perform one or more asynchronous I/O operations, which can be chained together, and will notify the agent that started them whether they succeedeed or failed. Threads are often used to handle complex I/O operations for agents. Threads live in the `/ted` directory of a desk.

`@urbit/http-api` includes a `thread()` function which allows you to run threads through Eyre, and is [detailed below](#thread).

## HTTP API basics {#http-api-basics}
Now that we've covered the backend concepts, let's see how `@urbit/http-api` communicates with the server.

### The `Urbit` class {#the-urbit-class}

All functionality is contained within the `Urbit` class. There are two ways to instantiate it, depending on whether your web app is served directly from the ship or whether it's served externally. The reason for the difference is that you require a session cookie to talk to the ship.

If your app is served from the ship, the user will already be logged in and they'll have a session cookie that the `Urbit` class will use automatically.

If your app isn't served from the ship, you'll need to authenticate with the user's ship, which is [detailed separately below](#authentication).

In the case of a frontend served from the ship, the `Urbit` class contains a `constructor` which takes 1-3 arguments:

| Argument | Type     | Description                                                                                                                                                                                                                         | Example                                   |
| -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `url`    | `string` | The host of the ship. This string is mandatory, but is typically left empty as requests will still work if they're root-relative paths.                                                                          | `"example.com"`, `"http://localhost:8080"`, `""` |
| `code`   | `string` | (Optional.) The web login code of the ship. Not needed if your frontend is served from the ship. In practice this should never be set by the frontend (if you need the user to log into their ship, use EAuth), but if you had to you'd want to import this from a secure environment variable to avoid putting it in the source code. | `""`, `"lidlut-tabwed-pillex-ridrup"`     |
| `desk`   | `string` | (Optional.) The desk on which you want to run threads. This is only used if you want to run threads from the frontend, rather than run them from the agent.                         | `"landscape"`, `""`                       |

To create an `Urbit` instance, you can simply do:

```javascript
const api = new Urbit("");
```

If you want to specify a desk, you can do:

```javascript
const api = new Urbit("", "", "landscape");
```

### `/session.js` {#sessionjs}

Most functions of the `Urbit` class need to know the ship's Urbit ID or they will fail. This is given explicitly with the external authentication method [detailed below](#authentication), but that's unnecessary when using the `Urbit` constructor in a web app served directly from the ship, because the ship serves a JS library at `/session.js` that contains the following:

```javascript
window.ship = "zod";
```

`"zod"` will be replaced with the actual name of the ship in question. You can import this file like so:

```html
<script src="/session.js"></script>
```

Then you need to set the `ship` field in the `Urbit` object. You would typically do it immediately after instantiating it:

```javascript
const api = new Urbit("");
api.ship = window.ship;
```

### Channels {#channels}

With the exception of scries and threads, all communication with Eyre happens through its channel system.

When it's constructed, the `Urbit` object will generate a random channel ID like `1646295453-e1bdfd`, and use a path of `/~/channel/1646295453-e1bdfd` to talk to Eyre. Pokes and subscription requests will be sent to that channel. Responses and subscription updates will be sent out to the frontend on that channel too.

Eyre sends out updates and responses on an [SSE] (Server Sent Event) stream for that channel. The `Urbit` object handles this internally with an `eventSource` object, so you won't deal with it directly. Eyre requires all events it sends out be acknowledged by the client, and will eventually close the channel if enough unacknowledged events accumulate. The `Urbit` object handles event acknowledgement automatically.

Eyre automatically creates a channel when a poke or subscription request is first sent to `/~/channel/[unknown-channel-id]`. If your web app is served outside a ship, you could use the `authenticate()` function [described below](#authentication) which will automatically send a poke and open the new channel. If your web app is served directly from the ship and you use the `Urbit` class constructor, it won't open the channel right away. Instead, the channel will be opened whenever you first send a poke or subscription request.

### Connection state {#connection-state}

The `Urbit` class constructor includes three optional callback functions that fire when the SSE connection state changes:

| Callback        | Description                                                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `Urbit.onOpen()`  | Called when an SSE channel connection is successfully established.                                                        |
| `Urbit.onRetry()` | Called when a reconnection attempt is made due to an interruption, e.g. if there are network problems.                    |
| `Urbit.onError()` | Called when there is an unrecoverable error, e.g. after enough reconnection attemps have failed.                          |

As mentioned in the previous section, typically a channel will be opened and an SSE connection established after you first poke the ship or make a subscription request. If successful, whatever function you provided to `onOpen()` will be called. If at some point the connection is interrupted, a reconnection attempt will be made three times:

1. Instantly.
2. 750ms after the first.
3. 3000ms after the second.

Each attempt will call the function you provided to `onRetry()`, if any. If all three reconnection attempts failed, or if a fatal error occurred, the function you provided `onError()` will be called with an `Error` object containing an error message as its argument.

How you use these, if at all, is up to you. If you want to try reconnecting when `onError()` fires, note that Eyre will delete a channel if it's had no messages from the client in the last 12 hours. The timeout is reset whenever it receives a message, including the acks that are automatically sent by the `Urbit` object in response to subscription updates.

If you don't want to account for the possibility of the channel having been deleted, you can just call the [`reset()`](#reset) function before you try reconnecting and consequently open a brand new channel.

## Tutorial setup {#tutorial-setup}

Start a fake ~zod and we'll add a Gall agent to its `%base` desk. This agent will store a trivial key-value database. It will provide endpoints for pokes, scries, and subscriptions. We'll define its poke and update types in a `/sur` file, and create marks that convert those types to and from JSON. We'll use `@urbit/http-api` to interact with the agent.

### Types {#types}

In the `/sur` folder of the `%base` desk, create a file `/api-demo.hoon` and define the following types:
- `$api-action`: User actions sent from the frontend to the Gall agent. We just want to put new k-v pairs into the state, and delete them by their keys.
- `$api-update`: Updates sent from the Gall agent to the frontend. Updates tagged with `%store` will contain the entire updated k-v store. Updates tagged with `%key-value` will contain one key and a unit of a value.

```hoon
|%
+$  api-action
  $%  [%put key=@tas val=@t]
      [%del key=@tas]
  ==
+$  api-update
  $%  [%store store=(map @tas @t)]
      [%key-value key=@tas val=(unit @t)]
  ==
--
```

### Marks {#marks}

In the `/mar` folder of the `%base` desk, create two new files `/api-action.hoon` and `/api-update.hoon`. Both of these marks will contain functions for converting their respective types in `/sur` to and from JSON. Don't worry if you don't understand every line of this.

{% code title="/mar/api-action.hoon" overflow="nowrap" lineNumbers="true" %}

```hoon
/-  *api-demo
|_  act=api-action
++  grab
  |%
  ++  noun  api-action
  ++  json
    |=  jon=^json
    %-  api-action
    =,  format
    %.  jon
    %-  of:dejs
    :~  :-  %put
        %-  ot:dejs
        :~  [%key (se:dejs %tas)]
            [%val so:dejs]
        ==
        :-  %del
        %-  ot:dejs
        :~  [%key (se:dejs %tas)]
        ==
    ==
  --
++  grow
  |%
  ++  noun  act
  ++  json
    ^-  ^json
    =,  format
    ?-  -.act
        %put
      %-  frond:enjs
      :-  'put'
      %-  pairs:enjs
      :~  ['key' [%s key.act]]
          ['val' [%s val.act]]
      ==
    ::
        %del
      %-  frond:enjs
      :-  'del'
      %-  frond:enjs
      :-  'key'
      [%s key.act]
    ==
  --
++  grad  %noun
--
```

{% endcode %}

{% code title="/mar/api-update.hoon" overflow="nowrap" lineNumbers="true" %}

```hoon
/-  *api-demo
|_  upd=api-update
++  grab
  |%
  ++  noun  api-update
  --
++  grow
  |%
  ++  noun  upd
  ++  json
    =,  format
    ^-  ^json
    ?-  -.upd
        %store
      %-  frond:enjs
      :-  'store'
      %-  pairs:enjs
      %+  turn
        ~(tap by store.upd)
      |=  [k=@tas v=@t]
      [(@t k) [%s v]]
    ::
        %key-value
      %-  frond:enjs
      :-  'key-value'
      %-  pairs:enjs
      :~  ['key' [%s (@t key.upd)]]
          ['val' ?~(val.upd [%s ''] [%s u.val.upd])]
      ==
    ==
  --
++  grad  %noun
--
```

{% endcode %}

### Agent {#agent}

In the `%base` desk's `/app` directory, create a new file called `/api-demo.hoon` and paste in the code below.

{% code title="/app/api-demo.hoon" overflow="nowrap" lineNumbers="true" %}

```hoon
/-  *api-demo
/+  default-agent, dbug
::
|%
+$  card  card:agent:gall
+$  versioned-state
  $%  state-0
  ==
+$  state-0
  $:  %0
      store=(map @tas @t)
  ==
--
::
%-  agent:dbug
=|  state-0
=*  state  -
::
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %.n) bowl)
::
++  on-init
  ^-  (quip card _this)
  :-  ~
  %=  this
    state  [%0 ~]
  ==
::
++  on-save  !>(state)
++  on-load
  |=  old-state=vase
  ^-  (quip card _this)
  =/  old  !<(versioned-state old-state)
  ?-  -.old
      %0  `this(state old)
  ==
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+  mark
    (on-poke:def mark vase)
  ::
      %api-action
    =/  act  !<(api-action vase)
    ?-  -.act
        %put
      ~&  >  "api-demo: putting [{<key.act>} {<val.act>}]"
      =/  new-store
        (~(put by store) key.act val.act)
      :_  %=  this
            store  new-store
          ==
      :~  :*  %give
              %fact
              [/updates]~
              %api-update
              !>  ^-  api-update
              [%store new-store]
          ==
          :*  %give
              %fact
              [(welp /updates [key.act]~)]~
              %api-update
              !>  ^-  api-update
              [%key-value key.act (some val.act)]
          ==
      ==
    ::
        %del
      ~&  >  "api-demo: deleting {<key.act>}"
      :_  %=  this
            store  (~(del by store) key.act)
          ==
      :~  :*  %give
              %fact
              [(welp /updates [key.act]~)]~
              %api-update
              !>  ^-  api-update
              [%key-value key.act ~]
          ==
      ==
    ==
  ==
::
++  on-watch
  |=  =(pole knot)
  ^-  (quip card _this)
  ?+  pole
    (on-watch:def pole)
  ::
      [%updates ~]
    ~&  >  "api-demo: subscribed to /updates"
    :_  this
    :~  :*  %give
            %fact
            ~
            %api-update
            !>  ^-  api-update
            [%store store]
        ==
    ==
  ::
      [%updates key=@tas ~]
    ~&  >  "api-demo: subscribed to {<`path`(welp /updates [key.pole]~)>}"
    :_  this
    :~  :*  %give
            %fact
            ~
            %api-update
            !>  ^-  api-update
            [%key-value key.pole (~(get by store) key.pole)]
        ==
    ==
  ==
::
++  on-peek
  |=  =(pole knot)
  ^-  (unit (unit cage))
  ~&  >  "api-demo: scry on {<`path`pole>}"
  ?+  pole
    (on-peek:def pole)
  ::
      [%x %store ~]
    %-  some
    %-  some
    :-  %api-update
    !>  ^-  api-update
    [%store store]
  ::
      [%x %store key=@tas ~]
    %-  some
    %-  some
    :-  %api-update
    !>  ^-  api-update
    [%key-value key.pole (~(get by store) key.pole)]
  ==
::
++  on-leave
  |=  =(pole knot)
  ~&  >  "api-demo: unsubscribed from {<`path`pole>}"
  `this
::
++  on-agent  on-agent:def
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
```

{% endcode %}

### Committing the code {#committing-the-code}
Finally, run `|commit %base` in the ship's dojo to commit your changes to the desk, then run `|start %api-demo` to initialise the agent.

## Using the HTTP API {#using-the-http-api}
Create and serve the HTML examples below from a local URL to talk to your fake ~zod via the HTTP API.

An Urbit ship will deny CORS requests from external URLs by default. **In order to run the examples below, you'll need to serve them from a URL (for example, with Python's http.server module) and approve that URL in the ship's dojo.** If serving the example page from `http://localhost:8000`, you'll need to run:

```
|eyre/cors/approve 'http://localhost:8000'
```

### Importing the HTTP API {#importing-the-http-api}
The `http-api` module is available in npm as `@urbit/http-api`, and can be installed with:

```
npm i @urbit/http-api
```

Once installed, you can import it into your app with:

```javascript
import Urbit from '@urbit/http-api';
```

Note that the examples in this guide are simple HTML documents with vanilla Javascript in `<script>` tags, so they use [unpkg.com](https://unpkg.com) to import `@urbit/http-api`. This is not typical, and is just done here for purposes of simplicity.

### Authenticate {#authenticate}
**If your frontend is served directly from the Urbit ship, this can be skipped.**

If your web app is served externally to the ship, you must authenticate and obtain a session cookie before commencing communications with the ship.

The `Urbit` class in `http-api` includes an `authenticate` function which does the following:

1. Login to the user's ship with their `code` and obtain a session cookie.
2. Generate a random channel ID for the connection.
3. Poke the user's ship and print "opening airlock" in the dojo to initialize the channel.

The `authenticate` function takes four arguments in an object: `ship`, `url`, `code` and `verbose`:

| Argument  | Type      | Description                                                                            | Example                           |
| --------- | --------- | -------------------------------------------------------------------------------------- | --------------------------------- |
| `ship`    | `string`  | The ship ID (`@p`) without the leading `~`.                                            | `"sampel-palnet"` or `"zod"`      |
| `url`     | `string`  | The base URL for the ship.                                        | `"http://localhost:8080"` or `"example.com"` |
| `code`    | `string`  | The user's web login code.                                                             | `"lidlut-tabwed-pillex-ridrup"`   |
| `verbose` | `boolean` | Whether to log details to the console. This field is optional and defaults to `false`. | `true`                            |

This function returns a promise that if successful, produces an `Urbit` object which can then be used for communications with the ship.

#### Authenticate() example {#authenticate-example}

{% code title="auth-test.html" overflow="nowrap" lineNumbers="true" %}

```html
<html>
  <head>
    <script src="https://unpkg.com/@urbit/http-api"></script>
  </head>
  <body>
    <button id="start" type="button" onClick="connect()" >Connect</button>
  </body>
  <script>
    async function connect() {
      window.api = await UrbitHttpApi.Urbit.authenticate({
          ship: "zod",
          url: "http://localhost:8080",
          code: "lidlut-tabwed-pillex-ridrup",
          verbose: true
      });
      document.body.innerHTML = "Connected!";
    };
  </script>
</html>
```

{% endcode %}

### Poke {#poke}
For poking a ship, the `Urbit` class in `http-api` includes a `poke` function. The `poke` function takes six arguments in a object:

| Argument    | Type        | Description                                                                                                                  | Example                 |
| ----------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `app`       | `string`    | The Gall agent to poke.                                                                                                      | `"api-demo"`         |
| `mark`      | `string`    | The mark of the data to poke the agent with.                                                                                 | `"api-action"`      |
| `json`      | any JSON    | The data to poke the agent with.                                                                                             | `{ put: { key: "foo", val: "bar" } }` |
| `ship`      | `string`    | The Urbit ID (`@p`) of the ship without the `~`. This may be ommitted if it's already been set for the whole `Urbit` object. | `"zod"`       |
| `onSuccess` | A function. | This is called if the poke succeeded (the ship ack'd the poke).                                                              | `someFunction()`          |
| `onError`   | A function. | This is called if the poke failed (the ship nack'd the poke).                                                                | `anotherFunction()`       |

#### Poke example {#poke-example}

{% code title="poke-test.html" overflow="nowrap" lineNumbers="true" %}

```html
<html>
  <head>
    <script src="https://unpkg.com/@urbit/http-api"></script>
  </head>
  <body>
    <h2>HTTP API - Pokes</h2>
    <br>
    <div>
      <input id="put-key" type="text" placeholder="Key" />
      <input id="put-value" type="text" placeholder="Value" />
      <button id="put-button" type="button" onClick="putByKey()">Store Value</button>
    </div>
    <br>
    <div>
      <input id="del-key" type="text" placeholder="Key to delete" />
      <button id="del-button" type="button" onClick="delByKey()">Delete Value</button>
    </div>
    <br>
    <p id="status"></p>
  </body>
  <script>
    const api = new UrbitHttpApi.Urbit("");
    api.ship = "zod";
    api.url = "http://localhost:8080";
    api.code = "lidlut-tabwed-pillex-ridrup";

    function putByKey() {
      const key = document.getElementById("put-key").value;
      const value = document.getElementById("put-value").value;
      
      if (!key) {
        document.getElementById("status").innerHTML = "Error: Key is required";
        return;
      }

      if (!value) {
        document.getElementById("status").innerHTML = "Error: Value is required for deletion";
        return;
      }

      try {
        console.log(key)
        console.log(value)

        api.poke({
          app: "api-demo",
          mark: "api-action",
          json: { put: { key: key, val: value } },
          onSuccess: pokeSuccess,
          onError: pokeError,
        });
      } catch (err) {
        document.getElementById("status").innerHTML = "Poke error: " + err.message;
      }
    }

    function delByKey() {
      const key = document.getElementById("del-key").value;

      if (!key) {
        document.getElementById("status").innerHTML = "Error: Key is required for deletion";
        return;
      }

      try {
        api.poke({
          app: "api-demo",
          mark: "api-action",
          json: { del: { key: key } },
          onSuccess: successDelete,
          onError: pokeError,
        });
      } catch (err) {
        document.getElementById("status").innerHTML = "Poke error: " + err.message;
      }
    }

    function pokeSuccess() {
      document.getElementById("put-key").value = "";
      document.getElementById("put-value").value = "";
      document.getElementById("del-key").value = "";
      document.getElementById("status").innerHTML = "Value stored successfully!";
    }

    function successDelete() {
      document.getElementById("put-key").value = "";
      document.getElementById("put-value").value = "";
      document.getElementById("del-key").value = "";
      document.getElementById("status").innerHTML = "Value deleted successfully!";
    }

    function pokeError() {
      document.getElementById("status").innerHTML = "Poke failed, see dojo";
    }
  </script>
</html>
```

{% endcode %}

### Scry {#scry}
To scry agents on the ship, the `Urbit` class in `http-api` includes a `scry` function. The `scry` function takes two arguments in a object:

| Argument | Type     | Description                        | Example         |
| -------- | -------- | ---------------------------------- | --------------- |
| `app`    | `string` | The agent to scry.                 | `"api-demo"` |
| `path`   | `string` | The path to scry, sans the `care`. | `"/store"`       |

The `scry` function returns a promise that, if successful, contains the requested data as JSON. If the scry failed, for example due to a non-existent scry endpoint, connection problem, or mark conversion failure, the promise will fail.

#### Scry example {#scry-example}

{% code title="scry-test.html" overflow="nowrap" lineNumbers="true" %}

```html
<html>
  <head>
    <script src="https://unpkg.com/@urbit/http-api"></script>
  </head>
  <body>
    <h1>HTTP API - Scry Endpoints</h1>
    <div>
      <h2>Fetch entire store</h2>
      <div>
        <button
          id="store-scry-btn"
          type="button"
          onClick="scryStore()"
        >
          Scry /store
        </button>
      </div>
      <br />
      <div id="store-status">No data requested yet</div>
      <pre id="store-data">Results will appear here</pre>
    </div>
    <br />
    <div>
      <h2>Fetch a specific key</h2>
      <input
        id="key-input"
        type="text"
        placeholder="Enter key to fetch"
      />
      <div>
      <br />
        <button
          id="key-scry-btn"
          type="button"
          onClick="scryKey()"
        >
          Scry key
        </button>
      </div>
      <br />
      <div id="key-status">No data requested yet</div>
      <pre id="key-data">Results will appear here</pre>
    </div>
  </body>
  <script>
    const api = new UrbitHttpApi.Urbit("");
    api.ship = "zod";
    api.url = "http://localhost:8080";
    api.code = "lidlut-tabwed-pillex-ridrup";

    // Scry the entire store
    async function scryStore() {
      const statusEl = document.getElementById("store-status");
      const dataEl = document.getElementById("store-data");
      
      statusEl.innerText = "Fetching data...";
      
      try {
        const result = await api.scry({
          app: "api-demo",
          path: "/store"
        });
        
        statusEl.innerText = "Data fetched successfully";
        dataEl.innerText = JSON.stringify(result, null, 2);
      } catch (err) {
        statusEl.innerText = "Error fetching data";
        dataEl.innerText = "Error: " + (err.message || "Unknown error");
      }
    }

    // Scry a specific key
    async function scryKey() {
      const key = document.getElementById("key-input").value;
      const statusEl = document.getElementById("key-status");
      const dataEl = document.getElementById("key-data");
      
      if (!key) {
        statusEl.innerText = "Error: Please enter a key";
        return;
      }
      
      statusEl.innerText = "Fetching data...";
      
      try {
        const result = await api.scry({
          app: "api-demo",
          path: `/store/${key}`
        });
        
        statusEl.innerText = "Data fetched successfully";
        if (result === null) {
          dataEl.innerText = "Key not found";
        } else {
          dataEl.innerText = JSON.stringify(result, null, 2);
        }
      } catch (err) {
        statusEl.innerText = "Error fetching data";
        dataEl.innerText = "Error: " + (err.message || "Unknown error");
      }
    }
  </script>
</html>
```

{% endcode %}

### Subscribe and unsubscribe {#subscribe-and-unsubscribe}
For subscribing to a particular path in an agent, the `Urbit` class in `http-api` includes a `subscribe` function. The `subscribe` function takes six arguments in a object:

| Argument | Type        | Description                                                                                                                      | Example              |
| -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `app`    | `string`    | The Gall agent to which you'll subscribe.                                                                                        | `"api-demo"`      |
| `path`   | `string`    | The subscription path.                                                                                                           | `"/updates"`         |
| `ship`   | `string`    | The Urbit ID (`@p`) of the ship without the `~`. This may be ommitted if it's already been set for the whole `Urbit` object.     | `"zod"`    |
| `err`    | A function. | This is called if the subscription request fails.                                                                                | `someFunction()`       |
| `event`  | A function. | This is the function to handle each update you receive for this subscription. The function's argument is the update's JSON data. | `anotherFunction()`    |
| `quit`   | A function. | This is called if you are kicked from the subscription.                                                                          | `yetAnotherFunction()` |

The `subscribe` function returns a subscription ID, which is just a number. This ID can be used to unsubscribe down the line.

If the subscription request is successful, you'll continue to receive updates until you either unsubscribe or are kicked by the agent. You may subscribe to multiple different agents and subscription paths by calling the `subscribe` function for each one.

If you wish to unsubscribe from a particular subscription, the `Urbit` class in `http-api` includes an `unsubscribe` function. This function just takes a single argument: the subscription ID number of an existing subscription. Once unsubscribed, you'll stop receiving updates for the specified subscription.

#### Subscribe example {#subscribe-example}

{% code title="subscribe-test.html" overflow="nowrap" lineNumbers="true" %}

```html
<html>
  <head>
    <script src="https://unpkg.com/@urbit/http-api"></script>
  </head>
  <body>
    <h1>HTTP API - Subscriptions</h1>
    <div>
      <h2>Subscribe to the /updates wire</h2>
      <div>
        <button
          id="store-sub-btn"
          type="button"
          onClick="toggleStoreSubscription()"
        >
          Subscribe to /updates
        </button>
      </div>
      <br />
      <div id="store-status">Not subscribed</div>
      <pre id="store-data">No data yet</pre>
    </div>
    <br />
    <div>
      <h2>Subscribe to a wire for a specific key</h2>
      <input
        id="key-input"
        type="text"
        placeholder="Enter key to subscribe to"
      />
      <div>
      <br />
        <button
          id="key-sub-btn"
          type="button"
          onClick="toggleKeySubscription()"
        >
          Subscribe to key
        </button>
      </div>
      <br />
      <div id="key-status">Not subscribed</div>
      <pre id="key-data">No data yet</pre>
    </div>
  </body>
  <script>
    const api = new UrbitHttpApi.Urbit("");
    api.ship = "zod";
    api.url = "http://localhost:8080";
    api.code = "lidlut-tabwed-pillex-ridrup";

    let storeSubId = null;
    let keySubId = null;
    let keyName = null;

    // Subscribe to all store updates
    function toggleStoreSubscription() {
      const statusEl = document.getElementById("store-status");
      const btnEl = document.getElementById("store-sub-btn");
      const dataEl = document.getElementById("store-data");

      if (storeSubId === null) {
        // Subscribe
        statusEl.innerText = "Subscribing...";

        storeSubId = api.subscribe({
          app: "api-demo",
          path: "/updates",
          err: () => {
            storeSubId = null;
            statusEl.innerText = "Subscription failed!";
            btnEl.innerText = "Subscribe to /updates";
          },
          event: (update) => {
            statusEl.innerText = "Receiving updates";
            dataEl.innerText = JSON.stringify(update, null, 2);
          },
          quit: () => {
            storeSubId = null;
            statusEl.innerText = "Kicked from subscription";
            btnEl.innerText = "Subscribe to /updates";
            dataEl.innerText = "No data - subscription ended";
          },
        });

        btnEl.innerText = "Unsubscribe from /updates";
        statusEl.innerText = "Subscribed, awaiting events...";
      } else {
        // Unsubscribe
        api.unsubscribe(storeSubId);
        storeSubId = null;
        btnEl.innerText = "Subscribe to /updates";
        statusEl.innerText = "Not subscribed";
        dataEl.innerText = "No data - unsubscribed";
      }
    }

    // Subscribe to a specific key
    function toggleKeySubscription() {
      const key = document.getElementById("key-input").value;
      const statusEl = document.getElementById("key-status");
      const btnEl = document.getElementById("key-sub-btn");
      const dataEl = document.getElementById("key-data");

      if (!key) {
        statusEl.innerText = "Error: Please enter a key";
        return;
      }

      if (keySubId === null) {
        // Subscribe
        statusEl.innerText = "Subscribing...";

        keySubId = api.subscribe({
          app: "api-demo",
          path: `/updates/${key}`,
          err: () => {
            keySubId = null;
            keyName = null;
            statusEl.innerText = "Subscription failed!";
            btnEl.innerText = "Subscribe to key";
          },
          event: (update) => {
            statusEl.innerText = "Receiving updates";
            dataEl.innerText = JSON.stringify(update, null, 2);
          },
          quit: () => {
            keySubId = null;
            keyName = null;
            statusEl.innerText = "Kicked from subscription";
            btnEl.innerText = "Subscribe to key";
            dataEl.innerText = "No data";
          },
        });

        keyName = key;
        btnEl.innerText = `Unsubscribe from ${key}`;
        statusEl.innerText = "Subscribed, awaiting events...";
      } else {
        // Unsubscribe
        api.unsubscribe(keySubId);
        keySubId = null;
        keyName = null;
        btnEl.innerText = "Subscribe to key";
        statusEl.innerText = "Unsubscribed";
        dataEl.innerText = "No data";
      }
    }
  </script>
</html>
```

{% endcode %}

### Subscribe once {#subscribe-once}
The `subscribeOnce()` function is a variation on the ordinary [`subscribe`](#subscribe) function. Rather than keeping the subscription going and receiving an arbitrary number of updates, instead it waits to receive a single update and then closes the subscription. This is useful if, for example, you send a poke and just want a response to that one poke.

The `subscribeOnce()` function also takes an optional `timeout` argument, which specifies the number of milliseconds to wait for an update before closing the subscription. If omitted, `subscribeOnce()` will wait indefinitely.

`subscribeOnce()` takes three arguments (these can't be in an object like most other `Urbit` functions):

| Argument  | Type     | Description                                                                                                              | Example         |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------ | --------------- |
| `app`     | `string` | The Gall agent to which you'll subscribe.                                                                                | `"api-demo"` |
| `path`    | `string` | The subscription path.                                                                                                   | `"/updates"`    |
| `timeout` | `number` | The number of milliseconds to wait for an update before closing the subscription. If omitted, it will wait indefinitely. | `5000`          |

`subscribeOnce()` returns a Promise. If successful, the Promise produces the JSON data of the update it received. If it failed due to either timing out or getting kicked from the subscription, it will return an error message of either `"timeout"` or `"quit"`.

#### SubscribeOnce example {#subscribe-once-example}

{% code title="auth-test.html" overflow="nowrap" lineNumbers="true" %}

```html
<html>
  <head>
    <script src="https://unpkg.com/@urbit/http-api"></script>
  </head>
  <body>
    <h1>HTTP API - Subscribe Once</h1>
    <div>
      <h2>Subscribe once to the /updates wire</h2>
      <div>
        <button
          id="store-sub-btn"
          type="button"
          onClick="subscribeOnceToStore()"
        >
          Subscribe to /updates and unsubscribe
        </button>
      </div>
      <br />
      <div id="store-status">No data requested yet</div>
      <pre id="store-data">Results will appear here</pre>
    </div>
  </body>
  <script>
    const api = new UrbitHttpApi.Urbit("");
    api.ship = "zod";
    api.url = "http://localhost:8080";
    api.code = "lidlut-tabwed-pillex-ridrup";

    // Subscribe once to all store updates
    async function subscribeOnceToStore() {
      const statusEl = document.getElementById("store-status");
      const dataEl = document.getElementById("store-data");

      statusEl.innerText = "Subscribing once...";
      dataEl.innerText = "Waiting for one update...";

      try {
        const result = await api.subscribeOnce("api-demo", "/updates", 5000);
        statusEl.innerText = "Received one update and closed subscription";
        dataEl.innerText = JSON.stringify(result, null, 2);
      } catch (err) {
        if (err === "timeout") {
          statusEl.innerText = "Subscription timed out";
          dataEl.innerText = "No update received within the timeout period";
        } else if (err === "quit") {
          statusEl.innerText = "Kicked from subscription";
          dataEl.innerText = "The agent kicked us from the subscription";
        } else {
          statusEl.innerText = "Subscription error";
          dataEl.innerText = "Error: " + (err.message || "Unknown error");
        }
      }
    }
  </script>
</html>
```

{% endcode %}

### Run a thread {#run-a-thread}
To run a thread, the `Urbit` class in `http-api` includes a `thread` function. The `thread` function takes five arguments in an object:

| Argument     | Type     | Description                                                                                                   | Example                 |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `inputMark`  | `string` | The mark to convert your JSON data to before giving it to the thread as its argument.                         | `"ship"`   |
| `outputMark` | `string` | The result of the thread should be converted to this mark before being converted to JSON and returned to you. | `"tang"`                |
| `threadName` | `string` | The name of the thread to run.                                                                                | `"hi"`          |
| `body`       | any JSON | The data to give to the thread as its argument.                                                               | `"~bud"` |
| `desk`       | `string` | The desk in which the thread resides. This may be ommitted if previously set for the whole `Urbit` object.    | `"base"`           |

The `thread` function will produce a promise that, if successful, contains the JSON result of the thread. If the thread failed, a connection error occurred, or mark conversion failed, the promise will fail.

#### Thread example {#thread-example}

{% code title="thread-test.html" overflow="nowrap" lineNumbers="true" %}

```html
<html>
  <head>
    <script src="https://unpkg.com/@urbit/http-api"></script>
  </head>
  <body>
    <h1>HTTP API - Threads</h1>
    <div>
      <h2>Run the "hi" thread in %base</h2>
      <div>
        <input id="name-input" type="text" placeholder="~bud" />
        <br />
        <br />
        <button id="run-thread-btn" type="button" onClick="runHiThread()">
          Say hi
        </button>
      </div>
      <br />
      <div id="thread-status">No thread run yet</div>
      <pre id="thread-result">Results will appear here</pre>
    </div>
  </body>
  <script>
    const api = new UrbitHttpApi.Urbit("");
    api.ship = "zod";
    api.desk = "base";
    api.url = "http://localhost:8080";
    api.code = "lidlut-tabwed-pillex-ridrup";

    async function runHiThread() {
      const name = document.getElementById("name-input").value;
      const statusEl = document.getElementById("thread-status");
      const resultEl = document.getElementById("thread-result");

      if (!name) {
        statusEl.innerText = "Input cannot be empty";
        return;
      }

      statusEl.innerText = "Running thread...";
      resultEl.innerText = "Waiting for thread to complete...";

      try {
        const result = await api.thread({
          inputMark: "ship",
          outputMark: "tang",
          threadName: "hi",
          body: name,
        });

        if (result) {
          statusEl.innerText = "Thread completed!";
          resultEl.innerText = "Check the recipient's dojo";
        }
      } catch (err) {
        statusEl.innerText = "Thread error";
        resultEl.innerText = "Error: " + (err.message || "Unknown error");
      }
    }
  </script>
</html>
```

{% endcode %}

### Delete a channel {#delete-a-channel}
Rather than just closing individual subscriptions, the entire channel can be closed with the `delete()` function in the `Urbit` class of `@urbit/http-api`. When a channel is closed, all subscriptions are cancelled and all pending updates are discarded. The function takes no arguments, and can be called like `api.delete()`.

### Reset {#reset}
An existing instance of `Urbit` class can be reset with its `reset()` function. This function takes no arguments, and can be called like `api.reset()`. When a channel is reset, all subscriptions are cancelled and all pending updates are discarded. Additionally, all outstanding outbound pokes to the agent will be discarded, and a fresh channel ID will be generated.

## Further reading {#further-reading}

- [`@urbit/http-api` on Github](https://github.com/urbit/js-http-api) - The source code for the JS HTTP API package.
- [Eyre External API Reference][eyre-ext-ref] - Lower-level documentation of Eyre's external API.
- [Eyre Guide][eyre-guide] - Lower-level examples of using Eyre's external API with `curl`.

