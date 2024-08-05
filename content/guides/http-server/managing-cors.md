+++
title = "CORS Origins"
weight = 20
+++


Here we'll look at approving and rejecting a CORS origin by passing Clay a [%approve-origin](/system/kernel/eyre/reference/tasks#approve-origin) `task` and [%reject-origin](/system/kernel/eyre/reference/tasks#reject-origin) `task` respectively.

In this example we'll use more manual methods for demonstrative purposes but note there are also the `|cors-approve` and `|cors-reject` generators to approve/reject origins from the dojo, and the `+cors-registry` generator for viewing the CORS configuration.

First, using `|pass` in the dojo, let's approve the origin `http://foo.example` by sending Eyre a `%approve-origin` `task`:

```
|pass [%e [%approve-origin 'http://foo.example']]
```

Now if we scry for the [approved](/system/kernel/eyre/reference/scry#cors-approved) CORS `set`:

```
> .^(approved=(set @t) %ex /=//=/cors/approved)
approved={'http://foo.example'}
```

...we can see that `http://foo.example` has been added.

Next, let's test it by sending Eyre a CORS preflight request via `curl` in unix:

```
curl -i -X OPTIONS \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -H "Origin: http://foo.example" \
     http://localhost:8080
```

We can see in the response that it has succeeded:

```
HTTP/1.1 204 ok
Date: Fri, 28 May 2021 12:37:12 GMT
Connection: keep-alive
Server: urbit/vere-1.5
Access-Control-Allow-Origin: http://foo.example
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: X-Requested-With
Access-Control-Allow-Methods: POST
```

Now we'll try rejecting an `origin`. Back in the dojo, let's `|pass` Eyre a `%reject-origin` `task` for `http://bar.example`:

```
|pass [%e [%reject-origin 'http://bar.example']]
```

If we scry for the [rejected](/system/kernel/eyre/reference/scry#cors-rejected) CORS `set`:

```
> .^(rejected=(set @t) %ex /=//=/cors/rejected)
rejected={'http://bar.example'}
```

...we can see that `http://bar.example` has been added.

If we again test it with `curl` in unix:

```
curl -i -X OPTIONS \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -H "Origin: http://bar.example" \
     http://localhost:8080
```

...we can see that, as expected, it has not returned the access control headers:

```
HTTP/1.1 404 missing
Date: Fri, 28 May 2021 12:38:47 GMT
Connection: close
Server: urbit/vere-1.5
```

Finally, let's look at CORS requests that are neither approved nor rejected.

If we make another request with `curl` on unix, this time for `http://baz.example` which we haven't added to a list:

```
curl -i -X OPTIONS \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -H "Origin: http://baz.example" \
     http://localhost:8080
```

...we can see it also correctly fails to return the access control headers:

```
HTTP/1.1 404 missing
Date: Fri, 28 May 2021 12:39:59 GMT
Connection: close
Server: urbit/vere-1.5
```

Now if we scry for the [requests](/system/kernel/eyre/reference/scry#cors-requests) CORS `set`:

```
> .^(requests=(set @t) %ex /=//=/cors/requests)
requests={'http://baz.example' 'http://localhost:8080'}
```

... we can see it has automatically been added by the mere fact of the request being made.
