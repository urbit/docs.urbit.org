+++
title = "Reading the Namespace"
weight = 40
+++


Here we'll look at performing scries through Eyre. You can refer to the [Scry](/system/kernel/eyre/reference/external-api-ref#scry) section of the [External API Reference](/system/kernel/eyre/reference/external-api-ref) document for relevant details.

First we must obtain a session cookie by [authenticating](#authenticating).

Having obtained a cookie, we can now try a scry. We'll scry the `graph-store` Gall agent on the `/x/keys` scry path, which will return the list of channels it has. If you don't already have any chat channels on your fakezod, go ahead and create one via landscape so it'll have something to return.

The url path will be `/~/scry/graph-store/keys.json`. The `/~/scry` part specifies a scry, the `/graph-store` part is the Gall agent, the `/keys` is the scry path without the `care`, and the `.json` file extension specifies the return `mark`.

The request will be an HTTP GET request:

```
curl -i --cookie "urbauth-~zod=0v1.1pseu.tq7hs.hps2t.ltaf1.tmqjm" \
        --request GET \
        http://localhost:8080/~/scry/graph-store/keys.json
```

Eyre will respond with HTTP status 200 if it's successful and the body of the response will contain the data we requested:

```
HTTP/1.1 200 ok
Date: Fri, 04 Jun 2021 10:16:32 GMT
Connection: keep-alive
Content-Length: 61
Server: urbit/vere-1.5
set-cookie: urbauth-~zod=0v1.1pseu.tq7hs.hps2t.ltaf1.tmqjm; Path=/; Max-Age=604800
content-type: application/json

{"graph-update":{"keys":[{"name":"test-1183","ship":"zod"}]}}
```

Now let's make a request to a non-existent scry endpoint:

```
curl -i --cookie "urbauth-~zod=0v1.1pseu.tq7hs.hps2t.ltaf1.tmqjm" \
        --request GET \
        http://localhost:8080/~/scry/foo/bar/baz.json
```

Eyre will respond with a 404 Missing status and an error message:

```
HTTP/1.1 404 missing
Date: Fri, 04 Jun 2021 10:22:51 GMT
Connection: keep-alive
Content-Length: 187
Server: urbit/vere-1.5
set-cookie: urbauth-~zod=0v1.1pseu.tq7hs.hps2t.ltaf1.tmqjm; Path=/; Max-Age=604800
content-type: text/html

<html><head><title>404 Not Found</title></head><body><h1>Not Found</h1><p>There was an error while handling the request for /foo/bar/baz.json.</p><code>no scry result</code></body></html>
```