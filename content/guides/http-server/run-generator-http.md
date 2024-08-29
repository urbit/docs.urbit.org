+++
title = "Running Generators"
weight = 60
+++

Here we'll look at running a generator via Eyre. Eyre doesn't have a mediated JSON API for generators, instead it just passes through the HTTP request and returns the HTTP response composed by the generator.

You can refer to the [%serve](/system/kernel/eyre/reference/tasks#serve) section of the [Internal API Reference](/system/kernel/eyre/reference/tasks) document for relevant details.

Here's a very simple generator that will just echo back the body of the request (if available) along with the current datetime. You can save it in the `/gen` directory and `|commit %base`.

Note that this example does some things manually for demonstrative purposes. In practice you'd likely want to use a library like `/lib/server.hoon` to cut down on boilerplate code.

`eyre-gen.hoon`

```hoon
|=  [[now=@da eny=@uvJ bec=beak] ~ ~]
|=  [authenticated=? =request:http]
^-  simple-payload:http
=/  msg=@t
  ?~  body.request
    (scot %da now)
  (cat 3 (cat 3 (scot %da now) 10) q.u.body.request)
=/  data=octs
  (as-octs:mimes:html msg)
=/  =response-header:http
  [200 ['Content-Type' 'text/plain']~]
[response-header `data]
```

Eyre requires generators to be a gate within a gate. The sample of the first gate must be:

```hoon
[[now=@da eny=@uvJ bec=beak] ~ ~]
```

The sample of the second nested gate must be:

```hoon
[authenticated=? =request:http]
```

The return type of the generator must be [$simple-payload:http](/system/kernel/eyre/reference/data-types#simple-payloadhttp). If you look at our example generator you'll see it meets these requirements.

Because generators return the entire HTTP message as a single `simple-payload`, Eyre can calculate the `content-length` itself and automatically add the header.

In order to make our generator available, we must bind it to a URL path. To do this, we send Eyre a `%serve` `task`, which looks like:

```hoon
[%serve =binding =generator]
```

The [$binding](/system/kernel/eyre/reference/data-types#binding) specifies the site and URL path, and the [$generator](/system/kernel/eyre/reference/data-types#generator) specifies the `desk`, the `path` to the generator, and arguments. Note that the passing of arguments to the generator by Eyre is not currently implemented, so you can just leave that as `~` since it won't do anything.

Let's bind our generator to the `/mygen` URL path with the `|pass` command in the dojo:

```
|pass [%e [%serve `/mygen %base /gen/eyre-gen/hoon ~]]
```

Note that Eyre responds with a `%bound` `gift` to indicate whether the binding succeeded but `|pass` doesn't take such responses so it's not shown.

Now let's try making an HTTP request using `curl` in the unix terminal:

```
curl -i http://localhost:8080/mygen --data 'blah blah blah'
```

We can see that the request has succeeded and our generator has responded with the datetime and request body:

```
HTTP/1.1 200 ok
Date: Sat, 29 May 2021 09:19:45 GMT
Connection: keep-alive
Content-Length: 41
Server: urbit/vere-1.5
Content-Type: text/plain
Content-Length: 41

~2021.5.29..09.19.45..e096
blah blah blah
```