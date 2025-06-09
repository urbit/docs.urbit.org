# Take Fact

Taking a fact from an agent is easy. First you subscribe using `+watch:strandio` or `+watch-our:strandio`, then you use `t+ake-fact:strandio` to receive the fact.

Here's an example agent named `%fact-spam` that just emits the string "beep" every 5 seconds in a fact on the `/updates` path:

{% code title="/app/fact-spam.hoon" overflow="nowrap" lineNumbers="true" %}
```hoon
/+  default-agent, dbug
=*  card  card:agent:gall
%-  agent:dbug
^-  agent:gall
|_  =bowl:gall
+*  this      .
    def   ~(. (default-agent this %|) bowl)
++  on-init
  ^-  (quip card _this)
  :_  this
  [%pass /timer %arvo %b %wait (add now.bowl ~s5)]~
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?.  ?=([%updates ~] path)
    (on-watch:def path)
  `this
::
++  on-arvo
  |=  [=wire sign=sign-arvo]
  ^-  (quip card _this)
  ?.  ?=([%behn %wake *] sign)
    (on-arvo:def wire sign)
  :_  this
  :~  [%give %fact ~[/updates] %tape !>("beep")]
      [%pass /timer %arvo %b %wait (add now.bowl ~s5)]
  ==
++  on-poke  on-poke:def
++  on-agent  on-agent:def
++  on-save  on-save:def
++  on-load  on-load:def
++  on-leave  on-leave:def
++  on-peek   on-peek:def
++  on-fail   on-fail:def
--
```
{% endcode %}

And here's a thread called `%fact-finder` that subscribes to `%fact-spam`, takes the number of facts specified, and prints the message in each one:

{% code title="/ted/fact-finder.hoon" overflow="nowrap" lineNumbers="true" %}
```hoon
/+  *strandio
|=  arg=vase
=/  m  (strand:rand ,vase)
=+  !<(num=(unit @) arg)
=/  cnt=@  ?~(num 0 u.num)
^-  form:m
;<  ~      bind:m  (watch-our /beep %fact-spam /updates)
|-
;<  =cage  bind:m  (take-fact /beep)
=+  !<(msg=tape q.cage)
?:  (gte 1 cnt)
  %-  (slog leaf+msg ~)
  (pure:m !>(~))
%-  (slog leaf+msg ~)
$(cnt (dec cnt))
```

Save the agent in `/app/fact-spam.hoon` and the thread in `/ted/fact-finder.hoon` on the `%base` desk, `|commit %base`, and run `-fact-finder 3`. You should see:

```
> -fact-finder 3
beep
beep
beep
```

### Analysis {#analysis}

We get the number of facts to receive from the `arg` vase:

```hoon
=+  !<(num=(unit @) arg)
=/  cnt=@  ?~(num 0 u.num)
```

We call `watch-our` to subscribe:

```hoon
;<  ~  bind:m  (watch-our /beep %fact-spam /updates)
```

Then we create a loop and keep calling `+take-fact` and printing the result until we've reached the count:

```hoon
|-
;<  =cage  bind:m  (take-fact /beep)
=+  !<(msg=tape q.cage)
?:  (gte 1 cnt)
  %-  (slog leaf+msg ~)
  (pure:m !>(~))
%-  (slog leaf+msg ~)
$(cnt (dec cnt))
```


Note that `+take-fact` only takes a single fact, so you'd either need one for each fact you expect, or you'd need to create a loop like in this example.
