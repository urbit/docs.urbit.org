+++
title = "HTTP Requests from Agents"
weight = 50
+++

Here we'll look at handling HTTP requests directly in Gall agents rather than using Eyre's channel system.

You can refer to the [%connect](/system/kernel/eyre/reference/tasks#connect) section of the [Internal API Reference](/system/kernel/eyre/reference/tasks) document for relevant details.

Here's a Gall agent that demonstrates this method. It binds the URL path `/foo`, serves `Hello, World!` for GET requests and a `405` error for all others. It also prints debug information to the terminal as various things happen.

Note that this example does a lot of things manually for demonstrative purposes. In practice you'd likely want to use a library like `/lib/server.hoon` to cut down on boilerplate code.

`eyre-agent.hoon`

```hoon
/+  default-agent, dbug
=*  card  card:agent:gall
%-  agent:dbug
^-  agent:gall
|_  =bowl:gall
+*  this      .
    def   ~(. (default-agent this %|) bowl)
::
++  on-init  on-init:def
++  on-save  on-save:def
++  on-load  on-load:def
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+    mark
    (on-poke:def [mark vase])
  ::
      %noun
    ?.  =(q.vase %bind)
      %-  (slog leaf+"Bad argument." ~)
      `this
    %-  (slog leaf+"Attempting to bind /foo." ~)
    :_  this
    [%pass /bind-foo %arvo %e %connect `/'foo' %eyre-agent]~
  ::
      %handle-http-request
    =/  req  !<  (pair @ta inbound-request:eyre)  vase
    ~&  [mark req]
    ?+    method.request.q.req
      =/  data=octs
        (as-octs:mimes:html '<h1>405 Method Not Allowed</h1>')
      =/  content-length=@t
        (crip ((d-co:co 1) p.data))
      =/  =response-header:http
        :-  405
        :~  ['Content-Length' content-length]
            ['Content-Type' 'text/html']
            ['Allow' 'GET']
        ==
      :_  this
      :~
        [%give %fact [/http-response/[p.req]]~ %http-response-header !>(response-header)]
        [%give %fact [/http-response/[p.req]]~ %http-response-data !>(`data)]
        [%give %kick [/http-response/[p.req]]~ ~]
      ==
    ::
        %'GET'
      =/  data=octs
        (as-octs:mimes:html '<h1>Hello, World!</h1>')
      =/  content-length=@t
        (crip ((d-co:co 1) p.data))
      =/  =response-header:http
        :-  200
        :~  ['Content-Length' content-length]
            ['Content-Type' 'text/html']
        ==
      :_  this
      :~
        [%give %fact [/http-response/[p.req]]~ %http-response-header !>(response-header)]
        [%give %fact [/http-response/[p.req]]~ %http-response-data !>(`data)]
        [%give %kick [/http-response/[p.req]]~ ~]
      ==
    ==
  ==
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?+    path
    (on-watch:def path)
  ::
      [%http-response *]
    %-  (slog leaf+"Eyre subscribed to {(spud path)}." ~)
    `this
  ==
++  on-leave  on-leave:def
++  on-peek   on-peek:def
++  on-agent  on-agent:def
++  on-arvo
  |=  [=wire =sign-arvo]
  ^-  (quip card _this)
  ?.  ?=([%bind-foo ~] wire)
    (on-arvo:def [wire sign-arvo])
  ?>  ?=([%eyre %bound *] sign-arvo)
  ?:  accepted.sign-arvo
    %-  (slog leaf+"/foo bound successfully!" ~)
    `this
  %-  (slog leaf+"Binding /foo failed!" ~)
  `this
++  on-fail   on-fail:def
--
```

Save the above to `/app/eyre-agent.hoon`. Commit it:

```
> |commit %base
>=
+ /~zod/base/2/app/eyre-agent/hoon
```

...and start it:

```
> |rein %base [& %eyre-agent]
```

Now, first we need to bind a URL to our app. In the `++ on-poke` arm, our agent will send a [%connect](/system/kernel/eyre/reference/tasks#connect) `task` to Eyre when poked with `%bind`:

```hoon
  %noun
?.  =(q.vase %bind)
  %-  (slog leaf+"Bad argument." ~)
  `this
%-  (slog leaf+"Attempting to bind /foo." ~)
:_  this
[%pass /eyre %arvo %e %connect `/'foo' %eyre-agent]~
```

...and when `%eyre` responds with a `%bound` `gift`, the `+on-agent` arm will print whether the bind succeeded:

```hoon
  [%eyre %bound *]
?:  accepted.sign-arvo
  %-  (slog leaf+"/foo bound successfully!" ~)
  `this
%-  (slog leaf+"Binding /foo failed!" ~)
`this
```

...so let's try:

```
> :eyre-agent %bind
>=
Attempting to bind /foo.
/foo bound successfully!
```

As you can see, we have successfully bound the `/foo` url path. Now we can try making an HTTP request. Over in the unix terminal, we can make a GET request using curl:

```
> curl -i localhost:8080/foo
HTTP/1.1 200 ok
Date: Mon, 17 May 2021 04:39:40 GMT
Connection: keep-alive
Server: urbit/vere-1.5
Content-Type: text/html
Content-Length: 22
transfer-encoding: chunked

<h1>Hello, World!</h1>%
```

...which has succeed! This is because the `+on-poke` arm tests for http GET requests and responds with `Hello, World!` when it sees one:

```hoon
  %'GET'
=/  data=octs
  (as-octs:mimes:html '<h1>Hello, World!</h1>')
=/  content-length=@t
  (crip ((d-co:co 1) p.data))
=/  =response-header:http
  :-  200
  :~  ['Content-Length' content-length]
      ['Content-Type' 'text/html']
  ==
:_  this
:~
  [%give %fact [/http-response/[p.req]]~ %http-response-header !>(response-header)]
  [%give %fact [/http-response/[p.req]]~ %http-response-data !>(`data)]
  [%give %kick [/http-response/[p.req]]~ ~]
==
```

Back in the dojo, our app's `+on-watch` arm has printed the path on which Eyre has subscribed for the response:

```
Eyre subscribed to /http-response/~.eyre_0v3.1knjk.l544e.5uds6.fn9l2.f8929.
```

...and it's also printed the request so you can see how it looks when it comes in:

```
[ %handle-http-request
  p=~.~.eyre_0v3.1knjk.l544e.5uds6.fn9l2.f8929
    q
  [ authenticated=%.n
    secure=%.n
    address=[%ipv4 .127.0.0.1]
      request
    [ method=%'GET'
      url='/foo'
        header-list
      ~[
        [key='host' value='localhost:8080']
        [key='user-agent' value='curl/7.76.1']
        [key='accept' value='*/*']
      ]
      body=~
    ]
  ]
]
```

This is a very rudimentary app but it demonstrates the basic mechanics of dealing with HTTP requests and serving responses.