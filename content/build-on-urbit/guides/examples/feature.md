# Host a Website

[`%feature`](https://github.com/hanfel-dovned/Feature) by [~hanfel-dovned](https://urbit.org/ids/~hanfel-dovned) hosts a simple HTML page from an Urbit ship at an associated URL.  This tutorial examines how it uses the middleware [`%schooner`](https://github.com/dalten-collective/schooner/) library by Quartus to return a web page when contacted by a web browser.  You will learn how a basic site hosting app can handle HTTP requests and render a page using an `%html` mark.

`%feature` presents a web page from `/app/feature-ui` at `/apps/feature/feature-ui`.  These paths are both configurable by the developer.

## `/sur` Structure Files {#sur-structure-files}

Our primary event in this case is simply an `%action` to create a page.

**`/sur/feature.hoon`**:  

```hoon
|%
+$  action
  $%  [%new-page html=@t]
  ==
--
```

No special mark files are necessary for `%feature` other than `%html`.

## `/app` Agent Files {#app-agent-files}

The agent only maintains a state containing the page contents as a `cord.`

The system only handles pokes:  there are no subscriptions or Arvo calls except for the Eyre binding.

<details>
<summary>/app/feature.hoon</summary>

```hoon
/-  feature
/+  dbug, default-agent, server, schooner
/*  feature-ui  %html  /app/feature-ui/html
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 page=@t]
+$  card  card:agent:gall
--
%-  agent:dbug
^-  agent:gall
=|  state-0
=*  state  -
|_  =bowl:gall
+*  this  .
    def  ~(. (default-agent this %.n) bowl)
++  on-init
  ^-  (quip card _this)
  :_  this(page 'Hello World')
  :~
    :*  %pass  /eyre/connect  %arvo  %e
        %connect  `/apps/feature  %feature
    ==
  ==
::
++  on-save
  ^-  vase
  !>(state)
::
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
  |^
  ?+    mark  (on-poke:def mark vase)
      %handle-http-request
    ?>  =(src.bowl our.bowl)
    =^  cards  state
      (handle-http !<([@ta =inbound-request:eyre] vase))
    [cards this]
  ==
  ++  handle-http
    |=  [eyre-id=@ta =inbound-request:eyre]
    ^-  (quip card _state)
    =/  ,request-line:server
      (parse-request-line:server url.request.inbound-request)
    =+  send=(cury response:schooner eyre-id)
    ::
    ?+    method.request.inbound-request  
      [(send [405 ~ [%stock ~]]) state]
      ::
        %'POST'
      ?.  authenticated.inbound-request
        :_  state
        %-  send
        [302 ~ [%login-redirect './apps/feature']]
      ?~  body.request.inbound-request
        [(send [405 ~ [%stock ~]]) state]
      =/  json  (de:json:html q.u.body.request.inbound-request)
      =/  action  (dejs-action +.json)
      (handle-action action) 
      :: 
        %'GET'
      ?+    site  
          :_  state 
          (send [404 ~ [%plain "404 - Not Found"]])
        ::
          [%apps %feature %public ~]
        :_  state
        %-  send
        :+  200  ~  
        :-  %html  page
        ::
          [%apps %feature ~]
        ?.  authenticated.inbound-request
          :_  state
          %-  send
          [302 ~ [%login-redirect './apps/feature']]
        :_  state
        %-  send
        :+  200  ~  
        :-  %html  feature-ui
      == 
    ==
  ::
  ++  dejs-action
    =,  dejs:format
    |=  jon=json
    ^-  action:feature
    %.  jon
    %-  of
    :~  new-page+so
    ==
  ::
  ++  handle-action
    |=  =action:feature
    ^-  (quip card _state)
    ?-    -.action
        %new-page
      ?>  =(src.bowl our.bowl)
      `state(page html:action)
    ==
  --
++  on-peek  on-peek:def
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?+    path  (on-watch:def path)
      [%http-response *]
    `this
  ==
::
++  on-leave  on-leave:def
++  on-agent  on-agent:def
++  on-arvo  on-arvo:def
++  on-fail  on-fail:def
--
```

</details>

### Pokes {#pokes}

`++on-poke` only responds to `%handle-http-request`, which is dealt with in a `|^` barket core.

The most interesting part of the whole app is the `++handle-http` arm:

<details>
<summary>++handle-http</summary>

```hoon
++  handle-http
    |=  [eyre-id=@ta =inbound-request:eyre]
    ^-  (quip card _state)
    =/  ,request-line:server
      (parse-request-line:server url.request.inbound-request)
    =+  send=(cury response:schooner eyre-id)
    ::
    ?+    method.request.inbound-request  
      [(send [405 ~ [%stock ~]]) state]
      ::
        %'POST'
      ?.  authenticated.inbound-request
        :_  state
        %-  send
        [302 ~ [%login-redirect './apps/feature']]
      ?~  body.request.inbound-request
        [(send [405 ~ [%stock ~]]) state]
      =/  json  (de:json:html q.u.body.request.inbound-request)
      =/  action  (dejs-action +.json)
      (handle-action action) 
      :: 
        %'GET'
      ?+    site  
          :_  state 
          (send [404 ~ [%plain "404 - Not Found"]])
        ::
          [%apps %feature %public ~]
        :_  state
        %-  send
        :+  200  ~  
        :-  %html  page
        ::
          [%apps %feature ~]
        ?.  authenticated.inbound-request
          :_  state
          %-  send
          [302 ~ [%login-redirect './apps/feature']]
        :_  state
        %-  send
        :+  200  ~  
        :-  %html  feature-ui
        ::
        ::    [%apps %feature %state ~]
        ::  :_  state
        ::  %-  send
        ::  :+  200  ~ 
        ::  [%json (enjs-state +.state)]
      == 
    ==
```

</details>

This arm uses the `server` library and `schooner` to produce a response of a server state and associated data.  HTTP requests to `/apps/feature` are checked for login authentication, while `/apps/feature/public` are not.

### `POST` {#post}

In response to a `POST` request, the default page in the state can be changed.  This is the only state change supported by the agent.

### `GET` {#get}

A `GET` request defaults to a `404` error.

- `/apps/feature/public` returns `200` success and the default page in the state.
- `/apps/feature` returns `200` success and the target page, statically compiled on agent build.

### `/lib/schooner` {#libschooner}

The [Schooner library](https://github.com/dalten-collective/schooner/) simplifies raw HTTP handling for Gall agents, in particular for MIME returns.
