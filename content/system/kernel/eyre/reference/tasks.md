# Internal API Reference

This document details all the `task`s you're likely to use to interact with Eyre, as well as the `gift`s you'll receive in response.

The primary way of interacting with Eyre is from the outside with HTTP requests. As a result, most of its `task`s are only used internally and you're unlikely to need to deal with them directly. The ones you may want to use in certain cases are [%connect](#connect), [%serve](#serve), [%disconnect](#disconnect), [%approve-origin](#approve-origin) and [%reject-origin](#reject-origin), and they are also demonstrated in the [Guide](../guides/guide.md) document. The rest are just documented for completeness.

Many of the types referenced are detailed in the [Data Types](data-types.md) document. It may also be useful to look at the `+eyre` section of `/sys/lull.hoon` in Arvo where these `task`s, `gift`s and data structures are defined.

## `%live` {#live}

```hoon
[%live insecure=@ud secure=(unit @ud)]
```

This `task` notifies Eyre of the listening HTTPS and HTTP ports. It is automatically sent to Eyre by the runtime and should not be used manually.

The `insecure` field is the HTTP port and `secure` is the optional HTTPS port.

#### Returns

Eyre returns no `gift` in response to a `%live` `task`.

---

## `%rule` {#rule}

```hoon
[%rule =http-rule]
```

This `task` either configures HTTPS with a certificate and keypair, or configures a DNS binding. This is typically done for you by the `%acme` app, rather than done manually.

The [$http-rule](data-types.md#http-rule) is either tagged with `%cert` or `%turf`. A `%cert` `http-rule` sets an HTTPS certificate and keypair or removes it if null. A `%turf` `http-rule` either adds or removes a DNS binding depending on whether the `action` is `%put` or `%del`. Note that using `%turf` will automatically cause the system to try and obtain a certificate and keypair via Letsencrypt.

#### Returns

Eyre returns no `gift` in response to a `%rule` `task`.

---

## `%request` {#request}

```hoon
[%request secure=? =address =request:http]
```

This `task` is how Eyre receives an inbound HTTP request. It will ordinarily be sent to Eyre by the runtime so you wouldn't use it except perhaps in tests.

The `secure` field says whether it's over HTTPS. The `address` is the IP address from which the request originated. The [$request:http](data-types.md#requesthttp) is the HTTP request itself containing the method, URL, headers, and body.

#### Returns

Eyre may `pass` a `%response` `gift` on the appropriate `duct` depending on the contents of the `%request`, state of the connection, and other factors.

---

## `%request-local` {#request-local}

```hoon
[%request-local secure=? =address =request:http]
```

This `task` is how Eyre receives an inbound HTTP request over the local loopback port. It behaves the same and takes the same arguments as in the [%request](#request) example except it skips any normally required authentication. Just like for a [%request](#request) `task`, you'd not normally use this manually.

#### Returns

Eyre may `pass` a `%response` `gift` on the appropriate `duct` depending on the contents of the `%request`, state of the connection, and other factors.

---

## `%cancel-request` {#cancel-request}

```hoon
[%cancel-request ~]
```

This `task` is sent to Eyre by the runtime when an HTTP client closes its previously established connection. You would not normally use this manually.

This `task` takes no arguments.

#### Returns

Eyre may `pass` a `%response` `gift` on the appropriate `duct` depending on the state of the connection and other factors.

---

## `%connect` {#connect}

```hoon
[%connect =binding app=term]
```

This `task` binds a Gall agent to a URL path so it can receive HTTP requests and return HTTP responses directly.

The [$binding](data-types.md#binding) contains a URL path and optional domain through which the agent will be able to take HTTP requests. The `app` is just the name of the Gall agent to bind. Note that if you bind a URL path of `/foo`, Eyre will also match `/foo/bar`, `/foo/bar/baz`, etc.

If an agent is bound in Eyre using this method, HTTP requests to the bound URL path are poked directly into the agent. The `cage` in the poke have a `%handle-http-request` `mark` and a `vase` of `[@ta inbound-request:eyre]` where the `@ta` is a unique `eyre-id` and the [$inbound-request](data-types.md#inbound-request) contains the HTTP request itself.

Along with the poke, Eyre will also subscribe to the `/http-response/[eyre-id]` `path` of the agent and await a response, which it will pass on to the HTTP client who made the request. Eyre expects at least two `fact`s and a `kick` on this subscription path to complete the response and close the connection (though it can take more than two `fact`s).

The first `fact`'s `cage` must have a `mark` of `%http-response-header` and a `vase` containing a [$response-header:http](data-types.md#response-headerhttp) with the HTTP status code and headers of the response.

The `cage` of the second and subsequent `fact`s must have a `mark` of `%http-response-data` and a `vase` containing a `(unit octs)` with the actual data of the response. An `octs` is just `[p=@ud q=@]` where `p` is the byte-length of `q`, the data. You can send an arbitrary number of these.

Finally, once you've sent all the `fact`s you want, you can `kick` Eyre's subscription and it will complete the response and close the connection to the HTTP client.

#### Returns

Eyre will respond with a `%bound` `gift` which says whether the binding was successful and looks like:

```hoon
[%bound accepted=? =binding]
```

The `accepted` field says whether the binding succeeded and the `binding` is the requested binding described above.

#### Example

See the [Agents: Direct HTTP](../guides/guide.md#agents-direct-http) section of the [Guide](../guides/guide.md) document for an example.

---

## `%serve` {#serve}

```hoon
[%serve =binding =generator]
```

This `task` binds a generator to a URL path so it can receive HTTP requests and return HTTP responses.

The `binding` contains the URL path and optional domain through which the generator will take HTTP requests. The [$generator](data-types.md#generator) specifies the `desk`, the `path` to the generator in Clay, and also has a field for arguments. Note that the passing of specified arguments to the generator by Eyre is not currently implemented, so you can just leave it as `~`.

The bound generator must be a gate within a gate and the type returned must be a [$simple-payload:http](data-types.md#simple-payloadhttp).

The sample of the first gate must be:

```hoon
[[now=@da eny=@uvJ bec=beak] ~ ~]
```

...and the sample of the second, nested gate must be:

```hoon
[authenticated=? =request:http]
```

The `?` says whether the HTTP request contained a valid session cookie and the [$request:http](data-types.md#requesthttp) contains the request itself.

The `simple-payload:http` returned by the generator is similar to the response described in the [%connect](#connect) section except the HTTP headers and body are all contained in the one response rather than staggered across several.

#### Returns

Eyre will return a `%bound` `gift` as described at the end of the [%connect](#connect) section.

#### Example

See the [Generators](../guides/guide.md#generators) section of the [Guide](../guides/guide.md) document for an example.

---

## `%disconnect` {#disconnect}

```hoon
[%disconnect =binding]
```

This `task` deletes a URL binding previously set by a `%connect` or `%serve` `task`.

The [$binding](data-types.md#binding) is the URL path and domain of the binding you want to delete.

#### Returns

Eyre returns no `gift` in response to a `%disconnect` `task`.

---

## `%code-changed` {#code-changed}

```hoon
[%code-changed ~]
```

This `task` tells Eyre that the web login code has changed, causing Eyre to throw away all sessions and cookies. Typically it's automatically sent to Eyre by `hood` when you run `|code %reset`.

This `task` takes no arguments.

#### Returns

Eyre returns no `gift` in response to a `%code-changed` `task`.

## `%approve-origin` {#approve-origin}

```hoon
[%approve-origin =origin]
```

This `task` tells Eyre to start responding positively to CORS requests for the specified `origin`.

The [$origin](data-types.md#origin) is a CORS origin like `http://foo.example` you want to approve.

#### Returns

Eyre returns no `gift` in response to a `%approve-origin` `task`.

#### Example

See the [Managing CORS Origins](../guides/guide.md#managing-cors-origins) section of the [Guide](../guides/guide.md) document for an example.

## `%reject-origin` {#reject-origin}

```hoon
[%reject-origin =origin]
```

This `task` tells Eyre to start responding negatively to CORS requests for the specified `origin`.

The [$origin](data-types.md#origin) is a CORS origin like `http://foo.example` you want want to reject.

#### Returns

Eyre returns no `gift` in response to a `%reject-origin` `task`.

#### Example

See the [Managing CORS Origins](../guides/guide.md#managing-cors-origins) section of the [Guide](../guides/guide.md) document for an example.

---
## `%set-response` {#set-response}

```hoon
[%set-response url=@t entry=(unit cache-entry)]
```

This `task` tells Eyre to set a cache entry for a URL path. Adding entries to Eyre's cache will make them much faster to load, and more capable of handling many connections.

The `url` field is the URL path you want to bind with the cache entry. Note this will just be the URL path as a cord like `'/foo/bar/baz'`, it does not include the host, etc.

The `entry` field is a [`$cache-entry`](data-types.md#cache-entry) in a `unit`. If the unit is null, the specified `url` will be unbound and the cache entry removed. If non-null, the given `entry` will be added to the cache (or updated if the binding already exists).

Each time the entry for a URL path is changed, its revision number will be incremented.

See the [`$cache-entry`](data-types.md#cache-entry) entry in Eyre's type reference for more details of the entry itself.

#### Returns

Eyre gives a `%grow` `gift` in response to a `%set-response` `task`. A `%grow` `gift` looks like:

```hoon
[%grow =path]
```

The `path` will be of the format `/cache/[revision]/[url]`, for example `/cache/12/~~~2f.foo~2f.bar`. The revision number is incremented each time the entry is updated, including if it's removed, and is in `@ud` format. The url element uses `%t` [`++scot`](../../../../hoon/reference/stdlib/4m.md#scot) encoding, so will need to be decoded with `%t` [`++slav`](../../../../hoon/reference/stdlib/4m.md#slav).

---
