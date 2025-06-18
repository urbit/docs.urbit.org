# Eyre Scry Reference

Here are all of Eyre's scry endpoints. There's not too many and they mostly deal with either CORS settings or aspects of the state of connections.

The first few have a `care` of `x` and are a scry like `.^([type] %ex /=//=/[some-path])` (note the empty `desk`). The rest have no `care` and the tag replaces the `desk` like `.^([type] %e /=[something]=)`.

All examples are run from the dojo.

## `/cors` {#cors}

An `x` scry with a `path` of `/cors` will return Eyre's CORS origin registry. The type returned is a [cors-registry](data-types.md#cors-registry) which contains the `set`s of approved, rejected and requested origins.

#### Example {#example-1}

```
> .^(cors-registry:eyre %ex /=//=/cors)
[ requests={~~http~3a.~2f.~2f.baz~.example}
  approved={~~http~3a.~2f.~2f.foo~.example}
  rejected={~~http~3a.~2f.~2f.bar~.example}
]
```

---

## `/cors/requests` {#corsrequests}

An `x` scry with a `path` of `/cors/requests` will return the `set` of pending origin requests. These are origins that were in an `Origin: ...` HTTP header but weren't in the existing approved or rejected sets. The type returned is a `(set origin:eyre)`.

#### Example {#example-2}

```
> .^(requests=(set origin:eyre) %ex /=//=/cors/requests)
requests={~~http~3a.~2f.~2f.baz~.example}
```

---

## `/cors/approved` {#corsapproved}

An `x` scry with a `path` of `/cors/approved` will return the `set` of approved CORS origins. The type returned is a `(set origin:eyre)`.

#### Example {#example-3}

```
> .^(approved=(set origin:eyre) %ex /=//=/cors/approved)
approved={~~http~3a.~2f.~2f.foo~.example}
```

---

## `/cors/approved/[origin]` {#corsapprovedorigin}

An `x` scry whose `path` is `/cors/approved/[origin]` tests whether the given origin URL is in the `approved` set of the CORS registry. The type returned is a simple `?`.

The origin URL is a `@t`, but since `@t` may not be valid in a path, it must be encoded in a `@ta` using `+scot` like `(scot %t 'foo')` rather than just `'foo'`.

#### Examples {#examples-1} 

```
> .^(? %ex /=//=/cors/approved/(scot %t 'http://foo.example'))
%.y
```

```
> .^(? %ex /=//=/cors/approved/(scot %t 'http://bar.example'))
%.n
```

---

## `/cors/rejected` {#corsrejected}

An `x` scry with a `path` of `/cors/rejected` will return the `set` of rejected CORS origins. The type returned is a `(set origin:eyre)`.

#### Example {#example-4}

```
> .^(rejected=(set origin:eyre) %ex /=//=/cors/rejected)
rejected={~~http~3a.~2f.~2f.bar~.example}
```

---

## `/cors/rejected/[origin]` {#corsrejectedorigin}

An `x` scry whose `path` is `/cors/rejected/[origin]` tests whether the given origin URL is in the `rejected` set of the CORS registry. The type returned is a simple `?`.

The origin URL must be a cord-encoded `@t` rather than just the plain `@t`, so you'll have to do something like `(scot %t 'foo')` rather than just `'foo'`.

#### Examples {#examples-2} 

```
> .^(? %ex /=//=/cors/rejected/(scot %t 'http://bar.example'))
%.y
```

```
> .^(? %ex /=//=/cors/rejected/(scot %t 'http://foo.example'))
%.n
```

---

## `/authenticated/cookie` {#authenticatedcookie}

An `x` scry whose `path` is `/authenticated/cookie/[cookie]` tests whether the given cookie is currently valid. The type returned is a `?`.

The cookie must be the full cookie including the `urbauth-{SHIP}=` part. The cookie must be a knot-encoded `@t` rather than just a plain `@t`, so you'll have to do something like `(scot %t 'foo')` rather than just `'foo'`.

#### Examples {#examples-3} 

```
> .^(? %ex /=//=/authenticated/cookie/(scot %t 'urbauth-~zod=0vvndn8.bfsjj.j3614.k40ha.8fomi'))
%.y
```

```
> .^(? %ex /=//=/authenticated/cookie/(scot %t 'foo'))
%.n
```

---

## `/cache/[aeon]/[url]` {#cacheaeonurl}

An `%x` `/cache` scry will return the cached value for the given `[url]` at the given `[aeon]` if it exists.

The `[url]` must be a knot-encoded `@t` rather than just a plain `@t`, so you'll have to do something like `(scot %t 'foo')` rather than just `'foo'`.

---

## `%bindings` {#bindings}

A scry with `bindings` in place of the `desk` in the `beak` will return Eyre's URL path bindings. The type returned is a `(list [binding:eyre duct action:eyre])` (see the [$binding](data-types.md#binding) & [$action](data-types.md#action) sections of the Data Types document for details).

#### Example {#example-5}

```
> .^((list [binding:eyre duct action:eyre]) %e /=bindings=)
~[
  [ [site=~ path=<|~landscape js bundle|>]
    ~[/gall/use/file-server/0w2.EijQB/~zod/~landscape/js/bundle /dill //term/1]
    [%app app=%file-server]
  ]
  [ [site=~ path=<|~landscape|>]
    ~[/gall/use/file-server/0w2.EijQB/~zod/~landscape /dill //term/1]
    [%app app=%file-server]
  ]
  ...(truncated for brevity)...
]
```

---

## `%cache` {#cache}

A scry with `cache` in place of the `desk` in the `beak` will return Eyre's entire cache. The type returned is as follows:

```hoon
(map url=@t [aeon=@ud val=(unit cache-entry:eyre)])
```

The map's `url` key is a URL path like `/foo/bar/baz.jpg` in a `cord`. The `aeon` is the revision number, and `val` is either the cache entry or null if it's been tombstoned. See the [$cache-entry](data-types.md#cache-entry) section of the Data Types document for details of its type.

---

## `%connections` {#connections}

A scry with `connections` in place of the `desk` in the `beak` will return all open HTTP connections that aren't fully complete. The type returned is a `(map duct outstanding-connection:eyre)` (see the [$outstanding-connection](data-types.md#outstanding-connection) section of the Data Types document for details).

#### Example {#example-6}

```
> .^((map duct outstanding-connection:eyre) %e /=connections=)
{}
```

---

## `%authentication-state` {#authentication-state}

A scry with `authentication-state` in place of the `desk` in the `beak` will return authentication details of all current sessions. The type returned is a [$authentication-state](data-types.md#authentication-state). The `p` field is the cookie sans the `urbauth-[ship]=` part.

#### Example {#example-7}

```
> .^(authentication-state:eyre %e /=authentication-state=)
  sessions
{ [ p=0v3.kags1.hj7hm.6llrl.cga2j.eh1r7
    q=[expiry-time=~2021.5.20..08.44.27..39e0 channels={}]
  ]
}
```

---

## `%channel-state` {#channel-state}

A scry with `channel-state` in place of the `desk` in the `beak` will return details of the state of each channel. The type returned is a [channel-state](data-types.md#channel-state).

#### Example {#example-8}

```
> .^(channel-state:eyre %e /=channel-state=)
[   session
  { [ p='1601844290-ae45b'
        q
      [ state=[%.y p=[date=~2021.5.13..20.44.27..39e0 duct=~[//http-server/0v2.kmj6q/26/1]]]
        next-id=1
        last-ack=~2021.5.13..08.44.27..39e0
        events={[id=0 request-id=2 channel-event=[%poke-ack p=~]]}
        unacked={}
        subscriptions={}
        heartbeat=~
      ]
    ]
  }
  duct-to-key={}
]
```

---

## `%host` {#host}

A scry with `host` in place of the `desk` in the `beak` will return host details of the ship. The type returned is a `hart:eyre`.

#### Example {#example-9}

```
> .^(hart:eyre %e /=host=)
[p=%.n q=[~ 8.080] r=[%.y p=<|localhost|>]]
```

---
