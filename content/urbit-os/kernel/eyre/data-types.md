---
description: "Eyre data type reference - web server structures for HTTP requests, responses, sessions, and server state."
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

# Eyre Data Types

This document describes the data types used by Eyre as defined in `/sys/lull.hoon`. It's separated into two sections:

[Eyre](#eyre) - Eyre-specific data types.

[HTTP](#http) - HTTP data types shared between Eyre and Iris.

## Eyre {#eyre}

### `$cache-entry` {#cache-entry}

```hoon
+$  cache-entry
  $:  auth=?
  $=  body
  $%  [%payload =simple-payload:http]
  ==  ==
```

- `.auth`: Whether the request must include a valid session cookie or otherwise be authenticated. If this is false, the entry will be publicly accessible.
- `.body`: The HTTP response to give. This contains a `[%payload =simple-payload:http]`. See the [`$simple-payload:http`](#simple-payloadhttp) for more details of the data.

---

### `$origin` {#origin}

```hoon
+$  origin  @torigin
```

A single CORS origin as used in an HTTP Origin header and the [$cors-registry](#cors-registry).

---

### `$cors-registry` {#cors-registry}

```hoon
+$  cors-registry
  $:  requests=(set origin)
      approved=(set origin)
      rejected=(set origin)
  ==
```

CORS origins categorised by approval status. The `requests` `+set` contains all [$origin](#origin)s Eyre has received in the headers of HTTP requests that have not been explicitly approved or rejected. The `approved` and `rejected` `+set`s are those that have been explicitly approved or rejected.

---

### `$outstanding-connection` {#outstanding-connection}

```hoon
+$  outstanding-connection
  $:  =action
      =inbound-request
      response-header=(unit response-header:http)
      bytes-sent=@ud
  ==
```

An HTTP connection that is currently open. The [`$action`](#action) is how it's being handled (e.g. by a Gall app, the channel system, etc). The [`$inbound-request`](#inbound-request) is the original request which opened the connection. The `$response-header` contains the status code and headers. The `.bytes-sent` is the total bytes sent so far in response.

---

### `$authentication-state` {#authentication-state}

```hoon
+$  authentication-state  sessions=(map @uv session)
```

This represents the authentication state of all sessions. It maps session cookies (without the `urbauth-{SHIP}=` prefix) to [$session](#session)s.

---

### `$session` {#session}

```hoon
+$  session
  $:  expiry-time=@da
      channels=(set @t)
  ==
```

This represents server-side data about a session. The `.expiry-time` is when the `$session` expires and `.channels` is the `+set` of [`$channel`](#channel) names opened by the session.

---

### `$channel-state` {#channel-state}

```hoon
+$  channel-state
  $:  session=(map @t channel)
      duct-to-key=(map duct @t)
  ==
```

The state used by the channel system. The `$session` is a `+map` between channel names and [`$channel`](#channel)s and the `.duct-to-key` `+map`s `$duct`s to `$channel` names.

---

### `$timer` {#timer}

```hoon
+$  timer
  $:  date=@da
      =duct
  ==
```

A reference to a timer so it can be cancelled or updated. The `$date` is when it will fire and the `$duct` is what set the timer.

---

### `$channel-event` {#channel-event}

```hoon
+$  channel-event
  $%  $>(%poke-ack sign:agent:gall)
      $>(%watch-ack sign:agent:gall)
      $>(%kick sign:agent:gall)
      [%fact =mark =noun]
  ==
```

An unacknowledged event in the channel system.

---

### `$channel` {#channel}

```hoon
  +$  channel
    $:  mode=?(%json %jam)
        state=(each timer duct)
        next-id=@ud
        last-ack=@da
        events=(qeu [id=@ud request-id=@ud =channel-event])
        unacked=(map @ud @ud)
        subscriptions=(map @ud [ship=@p app=term =path duc=duct])
        heartbeat=(unit timer)
    ==

```

This is the state of a particular channel in the channel system.

- `.mode` says whether the channel sends/received JSON or [nouns](noun-channels.md).
- `.state` is either the expiration time or the duct currently listening.
- `.next-id` is the next event ID to be used in the event stream.
- `.last-ack` is the date of the last client ack and is used for clog calculations in combination with `.unacked`.
- `.events` queue contains all unacked events:
  - `.id` is the server-set event ID.
  - `.request-id` is the client-set request ID.
  - [`.channel-event`](#channel-event) is the event itself.
- `.unacked` `+map` contains the unacked event count per `.request-id` and is used for clog calculations.
- `.subscriptions` `+map` contains gall subscriptions by `.request-id`.
- `.heartbeat` is the SSE heartbeat [`$timer`](#timer).

---

### `$binding` {#binding}

```hoon
+$  binding
  $:  site=(unit @t)
      path=(list @t)
  ==
```

A `$binding` is a rule to match a URL `$path` and optional `.site` domain which can then be tied to an [`$action`](#action). A `$path` of `/foo` will also match `/foo/bar`, `/foo/bar/baz`, etc. If the `.site` is `~` it will be determined implicitly. A binding must be unique.

---

### `$action` {#action}

```hoon
  +$  action
    $%  [%gen =generator]
        [%app app=term]
        [%authentication ~]
        [%logout ~]
        [%channel ~]
        [%scry ~]
        [%name ~]
        [%four-oh-four ~]
    ==
```

The action to take when a [$binding](#binding) matches an incoming HTTP request.

---

### `$generator` {#generator}

```hoon
+$  generator
  $:  =desk           ::  desk on current ship that contains the generator
      path=(list @t)  ::  path on :desk to the generator's hoon file
      args=*          ::  args: arguments passed to the gate
  ==
```

This refers to a generator on a local ship that can handle requests. Note that serving generators via Eyre is not fully implmented and should not be used.

---

### `$http-config` {#http-config}

```hoon
+$  http-config
  $:  secure=(unit [key=wain cert=wain])
      proxy=_|
      log=?
      redirect=?
  ==
```

The configuration of the runtime HTTP server itself. The `secure` field contains the PEM-encoded RSA private key and certificate or certificate chain when using HTTPS, and otherwise is `~` when using plain HTTP. The `proxy` field is not currently used. The `log` field turns on HTTP(S) access logs but is not currently implemented. The `redirect` field turns on 301 redirects to upgrade HTTP to HTTPS if the `key` and `cert` are set in `secure`.

---

### `$http-rule` {#http-rule}

```hoon
+$  http-rule
  $%  [%cert cert=(unit [key=wain cert=wain])]
      [%turf action=?(%put %del) =turf]
  ==
```

This is for updating the server configuration. In the case of `%cert`, a `cert` of `~` clears the HTTPS cert & key, otherwise `cert` contains the PEM-encoded RSA private key and certificate or certificate chain. In the case of `%turf`, a `%put` `.action` sets a domain name and a `%del` `.action` removes it. The [$turf](#turf) contains the domain name.

---

### `$address` {#address}

```hoon
+$  address
  $%  [%ipv4 @if]
      [%ipv6 @is]
  ==
```

A client IP address.

---

### `$inbound-request` {#inbound-request}

```hoon
+$  inbound-request
  $:  authenticated=?
      secure=?
      =address
      =request:http
  ==
```

An inbound HTTP request and metadata. The `authenticated` field says whether the request was made with a valid session cookie. The `secure` field says whether it was made with HTTPS. The [$address](#address) is the IP address from which the request originated, except if it came from localhost and included a `Forwarded` header, in which case it's the address specified in that header. The [$request:http](#requesthttp) contains the HTTP request itself.

---

## HTTP {#http}

### `$header-list:http` {#header-listhttp}

```hoon
+$  header-list  (list [key=@t value=@t])
```

An ordered list of HTTP headers. The `key` is the header name e.g `'Content-Type'` and the `value` is the value e.g. `text/html`.

---

### `$method:http` {#methodhttp}

```hoon
+$  method
  $?  %'CONNECT'
      %'DELETE'
      %'GET'
      %'HEAD'
      %'OPTIONS'
      %'POST'
      %'PUT'
      %'TRACE'
  ==
```

An HTTP method.

---

### `$request:http` {#requesthttp}

```hoon
+$  request
  $:  method=method
      url=@t
      =header-list
      body=(unit octs)
  ==
```

A single HTTP request. The [`$method:http`](#methodhttp) is the HTTP method, the `url` is the unescaped URL, the [`$header-list:http`](#header-listhttp) contains the HTTP headers of the request and the `body` is the actual data. An `$octs` is just `[p=@ud q=@]` where `.p` is the byte-length of `.q`, the data.

---

### `$response-header:http` {#response-headerhttp}

```hoon
+$  response-header
  $:  status-code=@ud
      headers=header-list
  ==
```

The status code and [$header-list:http](#header-listhttp) of an HTTP response.

---

### `$http-event:http` {#http-eventhttp}

```hoon
+$  http-event
  $%  $:  %start
          =response-header
          data=(unit octs)
          complete=?
      ==
      $:  %continue
          data=(unit octs)
          complete=?
      ==
      [%cancel ~]
  ==
```

Packetized HTTP.

Urbit treats Earth's HTTP servers as pipes, where Urbit sends or receives one or more `$http-event`s. The first of these will be a `%start`, and the last will always be `%cancel` or will have `complete` set to `%.y` to finish the connection.

Calculation of control headers such as `'Content-Length'` or `'Transfer-Encoding'` should be performed at a higher level; this structure is merely for what gets sent to or received from Earth.

---

### `$simple-payload:http` {#simple-payloadhttp}

```hoon
+$  simple-payload
  $:  =response-header
      data=(unit octs)
  ==
--
```

A simple, one-event response used for generators. The [`$reponse-header:http`](#response-headerhttp) contains the status code and HTTP headers. The `$octs` in the `$data` contains the body of the response and is a `[p=@ud q=@]` where `.p` is the byte-length of `.q`, the data.

---
