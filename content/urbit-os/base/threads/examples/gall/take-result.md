# Take Result

Two examples are provided: taking the result for a thread started by poking Spider directly, and taking the result for a thread started via the Khan vane.

## When poking Spider directly

Here we'll look at taking the result of a thread we started by poking Spider directly. We've added an extra card to subscribe for the result and a couple of lines in `+on-agent` to test if it succeeded:

<details>

<summary>/app/thread-starter.hoon code</summary>

{% code title="/app/thread-starter.hoon" overflow="nowrap" lineNumbers="true" %}
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
  ?+    mark  (on-poke:def mark vase)
      %noun
    ?+    q.vase  (on-poke:def mark vase)
        (pair term term)
      =/  tid  `@ta`(cat 3 'thread_' (scot %uv (sham eny.bowl)))
      =/  ta-now  `@ta`(scot %da now.bowl)
      =/  start-args  [~ `tid byk.bowl(r da+now.bowl) p.q.vase !>(q.q.vase)]
      :_  this
      :~
        [%pass /thread/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
        [%pass /thread/[ta-now] %agent [our.bowl %spider] %poke %spider-start !>(start-args)]
      ==
    ==
  ==
++  on-watch  on-watch:def
++  on-leave  on-leave:def
++  on-peek   on-peek:def
++  on-agent
   |=  [=wire =sign:agent:gall]
   ^-  (quip card _this)
   ?+    -.wire  (on-agent:def wire sign)
       %thread
     ?+    -.sign  (on-agent:def wire sign)
         %poke-ack
       ?~  p.sign
         %-  (slog leaf+"Thread started successfully" ~)
         `this
       %-  (slog leaf+"Thread failed to start" u.p.sign)
       `this
     ::
         %fact
       ?+    p.cage.sign  (on-agent:def wire sign)
           %thread-fail
         =/  err  !<  (pair term tang)  q.cage.sign
         %-  (slog leaf+"Thread failed: {(trip p.err)}" q.err)
         `this
           %thread-done
         =/  res  (trip !<(term q.cage.sign))
         %-  (slog leaf+"Result: {res}" ~)
         `this
       ==
     ==
   ==
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
```
{% endcode %}

</details>

{% code title="/ted/test-thread.hoon" overflow="nowrap" lineNumbers="true" %}
```hoon
/-  spider
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
|=  strand-input:strand
?+    q.arg  [~ %fail %not-foo ~]
    %foo
  [~ %done arg]
==
```
{% endcode %}

Save these, `|commit` and then poke the app with `:thread-starter [%test-thread %foo]`. You should see:

```
Thread started successfully
Result: foo
```

Now try `:thread-starter [%test-thread %bar]`. You should see:

```
Thread started successfully
Thread failed: not-foo
```

### Analysis {#analysis}

In `+on-poke` we've added an extra card _before_ the `%spider-start` poke to subscribe for the result:

```hoon
[%pass /thread/[ta-now] %agent [our.bowl %spider] %watch /thread-result/[tid]]
```

If successful the thread will return a cage with a mark of `%thread-done` and a vase containing the result.

If the thread failed it will return a cage with a mark of `%thread-fail` and a vase containing `[term tang]` where `term` is an error message and `tang` is a traceback. In our case our thread fails with error `%not-foo` when its argument is not `%foo`.

Note that spider will automatically `%kick` us from the subscription after ending the thread and returning the result.

```hoon
  %fact
?+    p.cage.sign  (on-agent:def wire sign)
    %thread-fail
  =/  err  !<  (pair term tang)  q.cage.sign
  %-  (slog leaf+"Thread failed: {(trip p.err)}" q.err)
  `this
    %thread-done
  =/  res  (trip !<(term q.cage.sign))
  %-  (slog leaf+"Result: {res}" ~)
  `this
==
```

Here in on-agent we've added a test for `%thread-fail` or `%thread-done` and print the appropriate result.

---

## When running a thread via Khan

Here's an example of a barebones Gall agent that runs a thread file via Khan and prints whether it succeeded.

<details>

<summary>/app/thread-starter.hoon code</summary>

{% code title="/app/thread-starter.hoon" overflow="nowrap" lineNumbers="true" %}
```hoon
/+  default-agent, dbug
=*  card  card:agent:gall
%-  agent:dbug
^-  agent:gall
|_  =bowl:gall
+*  this      .
    def   ~(. (default-agent this %|) bowl)
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  =+  !<  [ted=@tas txt=@tas]  vase
  :_  this
  [%pass /thread %arvo %k %fard %base ted noun+!>(txt)]~
::
++  on-arvo
  |=  [=wire sign=sign-arvo]
  ^-  (quip card _this)
  ?.  ?=([%khan %arow *] sign)
    (on-arvo:def wire sign)
  ?:  ?=(%| -.p.sign)
    %-  (slog leaf+"Thread error: %{(trip mote.p.p.sign)}" tang.p.p.sign)
    `this
  %-  (slog leaf+"Thread success!" ~)
  `this
::
++  on-agent  on-agent:def
++  on-init  on-init:def
++  on-save  on-save:def
++  on-load  on-load:def
++  on-watch  on-watch:def
++  on-leave  on-leave:def
++  on-peek   on-peek:def
++  on-fail   on-fail:def
--
```
{% endcode %}

</details>

And here's a minimal thread to test it with:

{% code title="/ted/test-thread.hoon" overflow="nowrap" lineNumbers="true" %}
```hoon
|=  arg=vase
=/  m  (strand:rand ,vase)
^-  form:m
|=  strand-input:rand
?+    q.arg  [~ %fail %not-foo ~]
    %foo
  [~ %done arg]
==
```
{% endcode %}

Save them as `/app/thread-starter.hoon` and `/ted/test-thread.hoon` respectively in the `%base` desk, `|commit %base`, and start the app with `|start %thread-starter`.

Now you can poke it with a pair of thread name and argument like:

```
:thread-starter [%test-thread %foo]
```

You should see `Thread success!`.

Now try it with `%bar` instead:

```
:thread-starter [%test-thread %bar]
```

You should see:

```
Thread error: %thread-fail
not-foo
```

### Analysis

In `+on-arvo` we expect a Khan `%arow` gift, which contains an `(each cage goof)`. If the head of the `$each` is false, the thread failed, and the `$goof` contains the error. If the `$each` head is true, then the thread succeeded and it contains a `$cage` with the result. We handle both these cases and either print the error message or print success:

```hoon
++  on-arvo
  |=  [=wire sign=sign-arvo]
  ^-  (quip card _this)
  ?.  ?=([%khan %arow *] sign)
    (on-arvo:def wire sign)
  ?:  ?=(%| -.p.sign)
    %-  (slog leaf+"Thread error: %{(trip mote.p.p.sign)}" tang.p.p.sign)
    `this
  %-  (slog leaf+"Thread success!" ~)
  `this
```
