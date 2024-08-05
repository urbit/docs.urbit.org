+++
title = "Using Channels"
weight = 30
+++

Here we'll look at a practical example of Eyre's channel system. You can refer to the [Channels](/system/kernel/eyre/reference/external-api-ref#channels) section of the [External API Reference](/system/kernel/eyre/reference/external-api-ref) document for relevant details.

First, we must obtain a session cookie by [authenticating](#authenticating). You will be copying the entry of the `set-cookie` field into the `--cookie` field in subsequent commands.

Now that we have our cookie, we can try poking an app & simultaneously opening a new channel. In this case, we'll poke the `hood` app with a `mark` of `helm-hi` to print "Opening airlock" in the dojo.

We'll do this with an HTTP PUT request, and we'll include the cookie we obtained when we authenticated in the `Cookie` header. The URL path we'll make the request to will be `http://localhost:8080/~/channel/mychannel`. The last part of the path is the channel `UID` - the name for our new channel. Normally you'd use the current unix time plus a hash to ensure uniqueness, but in this case we'll just use `mychannel` for simplicity.

The data will be a JSON array containing a [poke](/system/kernel/eyre/reference/external-api-ref#poke) `action`:

```
curl --header "Content-Type: application/json" \
     --cookie "urbauth-~zod=0v3.j2062.1prp1.qne4e.goq3h.ksudm" \
     --request PUT \
     --data '[{"id":1,"action":"poke","ship":"zod","app":"hood","mark":"helm-hi","json":"Opening airlock"}]' \
     http://localhost:8080/~/channel/my-channel
```

If we now have a look in the dojo we'll see it's printed our message, so the poke was successful:

```
< ~zod: Opening airlock
```

Now we can connect to the `mychannel` channel we opened. We do this with an HTTP GET request with our session cookie and the same path as the last request:

```
curl -i --cookie "urbauth-~zod=0v3.j2062.1prp1.qne4e.goq3h.ksudm" http://localhost:8080/~/channel/my-channel
```

Eyre will respond with an HTTP status code of 200 and a `content-type` of `text/event-stream`, indicating an SSE (Server Sent Event) stream. It will also send us any pending events on the channel - in this case the poke ack as a [poke](/system/kernel/eyre/reference/external-api-ref#poke-ack) `response` for our original poke:

```
HTTP/1.1 200 ok
Date: Tue, 18 May 2021 01:40:47 GMT
Connection: keep-alive
Server: urbit/vere-1.5
set-cookie: urbauth-~zod=0v3.j2062.1prp1.qne4e.goq3h.ksudm; Path=/; Max-Age=604800
connection: keep-alive
cache-control: no-cache
content-type: text/event-stream
transfer-encoding: chunked

id: 0
data: {"ok":"ok","id":1,"response":"poke"}
```

Normally this event stream would be handled by an EventSource object or similar in Javascript or the equivalent in whatever other language you're using. Here, though, we'll continue using `curl` for simplicity.

Leaving the event stream connection open, in another shell session on unix we'll try subscribing to the watch path of a Gall agent - the `/updates` watch path of `graph-store` in this case.

We'll do this in the same way as the initial poke, except this time it will be a [subscribe](/system/kernel/eyre/reference/external-api-ref#subscribe) `action`:

```
curl --header "Content-Type: application/json" \
     --cookie "urbauth-~zod=0v3.j2062.1prp1.qne4e.goq3h.ksudm" \
     --request PUT \
     --data '[{"id":2,"action":"subscribe","ship":"zod","app":"graph-store","path":"/updates"}]' \
     http://localhost:8080/~/channel/my-channel
```

Notice we've incremented the `id` to `2`. Eyre doesn't require IDs to be sequential, merely numerical and unique, but sequential IDs are typically the most practical.

Back in the event stream, we'll see a positive watch ack as a [subscribe](/system/kernel/eyre/reference/external-api-ref#watch-ack) `response`, meaning the subscription has been successful:

```
id: 1
data: {"ok":"ok","id":2,"response":"subscribe"}
```

Now we'll try trigger an event on our event stream. In fakezod's Landscape, create a new chat channel named "test". You should see the `add-graph` `graph-update` come through on our channel in a [diff](/system/kernel/eyre/reference/external-api-ref#diff) `response`:

```
id: 2
data: {"json":{"graph-update":{"add-graph":{"graph":{},"resource":{"name":"test-1183","ship":"zod"},"mark":"graph-validator-chat","overwrite":false}}},"id":2,"response":"diff"}
```

All events we receive must be `ack`ed so Eyre knows we've successfully received them. To do this we'll send an [ack](/system/kernel/eyre/reference/external-api-ref#ack) `action` which specifies the `event-id` of the event in question - `2` in this case:

```
curl --header "Content-Type: application/json" \
     --cookie "urbauth-~zod=0v3.j2062.1prp1.qne4e.goq3h.ksudm" \
     --request PUT \
     --data '[{"id":3,"action":"ack","event-id":2}]' \
     http://localhost:8080/~/channel/my-channel
```

This same pattern would be repeated for all subsequent events. Note that when you `ack` one event, you also implicitly `ack` all previous events, so in this case event `1` will also be `ack`ed.

When we're finished, we can unsubscribe from `graph-store` `/update`. We do this by sending Eyre a [unsubscribe](/system/kernel/eyre/reference/external-api-ref#unsubscribe) `action`, and specify the request ID of the original `subscribe` `action` in the `subscription` field - `2` in our case:

```
curl --header "Content-Type: application/json" \
     --cookie "urbauth-~zod=0v3.j2062.1prp1.qne4e.goq3h.ksudm" \
     --request PUT \
     --data '[{"id":4,"action":"unsubscribe","subscription":2}]' \
     http://localhost:8080/~/channel/my-channel
```

Unlike `poke` and `subscribe` actions, Eyre doesn't acknowledge `unsubscribe`s, but we'll now have stopped receiving updates from `graph-store`.

Finally, let's close the channel itself. We can do this simply by sending Eyre a [delete](/system/kernel/eyre/reference/external-api-ref#delete-channel) `action`:

```
curl --header "Content-Type: application/json" \
     --cookie "urbauth-~zod=0v3.j2062.1prp1.qne4e.goq3h.ksudm" \
     --request PUT \
     --data '[{"id":5,"action":"delete"}]' \
     http://localhost:8080/~/channel/my-channel
```

With our channel deleted, we can now close the connection on the client side.