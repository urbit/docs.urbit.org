# Strandio {#strandio}

Documented below are the many useful functions in the
`/lib/strandio.hoon` helper library. 

## Send Cards {#send-cards}

### `send-raw-cards` {#send-raw-cards}

Send a list of `card`s.

#### Accepts {#accepts}

A `(list card:agent:gall)`.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  send-raw-cards
  |=  cards=(list =card:agent:gall)
  =/  m  (strand ,~)
  ^-  form:m
  |=  strand-input:strand
  [cards %done ~]
```

#### Example {#example}

```hoon
;~  now=@da  bind:m  get-time
=/  cards=(list card)
  :~  [%pass /foo %agent [~zod %foo] %poke %noun !>(~)]
      [%pass /bar %arvo %b %wait now]
  ==
;<  ~  bind:m  (send-raw-cards cards)
```

---

### `send-raw-card` {#send-raw-card}

Send a single `card`.

#### Accepts {#accepts}

A `card:agent:gall`

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  send-raw-card
  |=  =card:agent:gall
  =/  m  (strand ,~)
  ^-  form:m
  (send-raw-cards card ~)
```

#### Example {#example}

```hoon
=/  card  [%pass /foo %agent [~zod %foo] %poke %noun !>(~)]
;<  ~  bind:m  (send-raw-card card)
```

---

## Bowl {#bowl}

### `get-bowl` {#get-bowl}

Get the bowl.

#### Accepts {#accepts}

Nothing.

#### Produces {#produces}

A `bowl:rand`.

#### Source {#source}

```hoon
++  get-bowl
  =/  m  (strand ,bowl:strand)
  ^-  form:m
  |=  tin=strand-input:strand
  `[%done bowl.tin]
```

#### Example {#example}

```hoon
;<  =bowl:rand  bind:m  get-bowl
```

---

### `get-beak` {#get-beak}

Get the beak.

#### Accepts {#accepts}

Nothing.

#### Produces {#produces}

A `beak`.

#### Source {#source}

```hoon
++  get-beak
  =/  m  (strand ,beak)
  ^-  form:m
  |=  tin=strand-input:strand
  `[%done [our q.byk da+now]:bowl.tin]
```

#### Example {#example}

```hoon
;<  =beak  bind:m  get-beak
```

---

### `get-time` {#get-time}

Get the current date-time.

#### Accepts {#accepts}

Nothing.

#### Produces {#produces}

A `@da`.

#### Source {#source}

```hoon
++  get-time
  =/  m  (strand ,@da)
  ^-  form:m
  |=  tin=strand-input:strand
  `[%done now.bowl.tin]
```

#### Example {#example}

```hoon
;<  now=@da  bind:m  get-time
```

---

### `get-our` {#get-our}

Get our ship.

#### Accepts {#accepts}

Nothing.

#### Produces {#produces}

A `@p`.

#### Source {#source}

```hoon
++  get-our
  =/  m  (strand ,ship)
  ^-  form:m
  |=  tin=strand-input:strand
  `[%done our.bowl.tin]
```

#### Example {#example}

```hoon
;<  our=@p  bind:m  get-our
```

---

### `get-entropy` {#get-entropy}

Get some entropy.

#### Accepts {#accepts}

Nothing.

#### Produces {#produces}

A `@uvJ`.

#### Source {#source}

```hoon
++  get-entropy
  =/  m  (strand ,@uvJ)
  ^-  form:m
  |=  tin=strand-input:strand
  `[%done eny.bowl.tin]
```

#### Example {#example}

```hoon
;<  eny=@uvJ  bind:m  get-entropy
```

---

## Misc {#misc}

### `install-domain` {#install-domain}

Install a domain in Eyre, triggering the setup of an SSL certificate.

#### Accepts {#accepts}

A `turf`.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  install-domain
  |=  =turf
  =/  m  (strand ,~)
  ^-  form:m
  (send-raw-card %pass / %arvo %e %rule %turf %put turf)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (install-domain 'com' 'example' ~)
```

---

### `check-online` {#check-online}

Require that a peer respond before timeout.

The peer is pinged with a "hi" and must ack the poke before the timeout.

#### Accepts {#accepts}

A pair of `[ship @dr]`. The `@dr` is the amount of time the peer has to respond before failure.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  check-online
  |=  [who=ship lag=@dr]
  =/  m  (strand ,~)
  ^-  form:m
  %+  (map-err ,~)  |=(* [%offline *tang])
  %+  (set-timeout ,~)  lag
  ;<  ~  bind:m
    (poke [who %hood] %helm-hi !>(~))
  (pure:m ~)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (check-online ~zod ~s10)
```

---

### `take-sign-arvo` {#take-sign-arvo}

Wait for a sign from Arvo.

#### Accepts {#accepts}

Nothing.

#### Produces {#produces}

A pair of `[wire sign-arvo]`.

#### Source {#source}

```hoon
++  take-sign-arvo
  =/  m  (strand ,[wire sign-arvo])
  ^-  form:m
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~
    `[%wait ~]
  ::
      [~ %sign *]
    `[%done [wire sign-arvo]:u.in.tin]
  ==
```

#### Example {#example}

```hoon
;<  [=wire =sign-arvo]  bind:m  take-sign-arvo
```

---

## Pokes {#pokes}

### `poke` {#poke}

Poke an agent, then await a positive ack.

#### Accepts {#accepts}

A pair of `[dock cage]`, where the `dock` is the ship and agent you want to poke, and the `cage` is the data.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  poke
  |=  [=dock =cage]
  =/  m  (strand ,~)
  ^-  form:m
  =/  =card:agent:gall  [%pass /poke %agent dock %poke cage]
  ;<  ~  bind:m  (send-raw-card card)
  (take-poke-ack /poke)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (poke [~zod %foo] %noun !>(~))
```

---

### `raw-poke` {#raw-poke}

Poke an agent then await a (n)ack.

This doesn't care whether the ack is positive or negative, unlike the ordinary [poke](#poke).

#### Accepts {#accepts}

A pair of `[dock cage]`, where the `dock` is the ship and agent to poke, and the `cage` is the data.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  raw-poke
  |=  [=dock =cage]
  =/  m  (strand ,~)
  ^-  form:m
  =/  =card:agent:gall  [%pass /poke %agent dock %poke cage]
  ;<  ~  bind:m  (send-raw-card card)
  =/  m  (strand ,~)
  ^-  form:m
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~
    `[%wait ~]
  ::
      [~ %agent * %poke-ack *]
    ?.  =(/poke wire.u.in.tin)
      `[%skip ~]
    `[%done ~]
  ==
```

#### Example {#example}

```hoon
;<  ~  bind:m  (raw-poke [~zod %foo] %noun !>(~))
```

---

### `raw-poke-our` {#raw-poke-our}

Poke a local agent then await a (n)ack.

This doesn't care whether the ack is positive or negative, unlike the ordinary [poke-our](#poke-our).

#### Accepts {#accepts}

A pair of `[app=term =cage]`, where `app` is the local agent to poke and `cage` is the data.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  raw-poke-our
  |=  [app=term =cage]
  =/  m  (strand ,~)
  ^-  form:m
  ;<  =bowl:spider  bind:m  get-bowl
  (raw-poke [our.bowl app] cage)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (raw-poke-our %foo %noun !>(~))
```

---

### `poke-our` {#poke-our}

Poke a local agent then await an ack.

Note this fails if it gets a nack back.

#### Accepts {#accepts}

A pair of `[=term =cage]` where `term` is the name of a local agent and `cage` is the data.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  poke-our
  |=  [=term =cage]
  =/  m  (strand ,~)
  ^-  form:m
  ;<  our=@p  bind:m  get-our
  (poke [our term] cage)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (poke-our %foo %noun !>(~))
```

---

### `take-poke-ack` {#take-poke-ack}

Take a poke ack on the given wire.

If the ack is a nack, the strand fails.

#### Accepts {#accepts}

A `wire`.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  take-poke-ack
  |=  =wire
  =/  m  (strand ,~)
  ^-  form:m
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~  `[%wait ~]
      [~ %agent * %poke-ack *]
    ?.  =(wire wire.u.in.tin)
      `[%skip ~]
    ?~  p.sign.u.in.tin
      `[%done ~]
    `[%fail %poke-fail u.p.sign.u.in.tin]
  ==
```

#### Example {#example}

```hoon
;<  ~  bind:m  (take-poke-ack /foo)
```

---

### `take-poke` {#take-poke}

Wait for a poke with a particular mark.

#### Accepts {#accepts}

A `mark`.

#### Produces {#produces}

A `vase`.

#### Source {#source}

```hoon
++  take-poke
  |=  =mark
  =/  m  (strand ,vase)
  ^-  form:m
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~
    `[%wait ~]
  ::
      [~ %poke @ *]
    ?.  =(mark p.cage.u.in.tin)
      `[%skip ~]
    `[%done q.cage.u.in.tin]
  ==
```

#### Example {#example}

```hoon
;<  =vase  bind:m  (take-poke %noun)
```

---

## Subscriptions {#subscriptions}

### `watch` {#watch}

Watch a subscription path on an agent, then await a positive watch ack.

Note this fails if it gets a watch nack back.

#### Accepts {#accepts}

A triple of `[=wire =dock =path]` where `dock` is the ship and agent, and `path` is the subscription path.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  watch
  |=  [=wire =dock =path]
  =/  m  (strand ,~)
  ^-  form:m
  =/  =card:agent:gall  [%pass watch+wire %agent dock %watch path]
  ;<  ~  bind:m  (send-raw-card card)
  (take-watch-ack wire)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (watch /foo [~zod %foo] /some/path)
```

---

### `watch-one` {#watch-one}

Subscribe to a watch path on an agent, take a single fact, then await a kick.

#### Accepts {#accepts}

A triple of `[=wire =dock =path]` where `dock` is a ship and agent, and `path` is the subscription path.

#### Produces {#produces}

The `cage` of the received fact.

#### Source {#source}

```hoon
++  watch-one
  |=  [=wire =dock =path]
  =/  m  (strand ,cage)
  ^-  form:m
  ;<  ~  bind:m  (watch wire dock path)
  ;<  =cage  bind:m  (take-fact wire)
  ;<  ~  bind:m  (take-kick wire)
  (pure:m cage)
```

#### Example {#example}

```hoon
;<  [=mark =vase]  bind:m  (watch-one /foo [~zod %foo] /some/path)
```

---

### `watch-our` {#watch-our}

Subscribe to a watch path on a local agent, then wait for a positive
ack.

This will fail if it gets a watch nack.

#### Accepts {#accepts}

A triple of `[=wire =term =path]` where `term` is the name of the agent and `path` is the subscription path.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
::
++  watch-our
  |=  [=wire =term =path]
  =/  m  (strand ,~)
  ^-  form:m
  ;<  our=@p  bind:m  get-our
  (watch wire [our term] path)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (watch-our /foo %foo /some/path)
```

---

### `leave` {#leave}

Leave a subscription.

#### Accepts {#accepts}

A pair of `[=wire =dock]` where `dock` is the ship and agent in question.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  leave
  |=  [=wire =dock]
  =/  m  (strand ,~)
  ^-  form:m
  =/  =card:agent:gall  [%pass watch+wire %agent dock %leave ~]
  (send-raw-card card)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (leave /foo ~zod %foo)
```

---

### `leave-our` {#leave-our}

Unsubscribe from a local agent.

#### Accepts {#accepts}

A pair of `[=wire =term]` where `term` is the local agent.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  leave-our
  |=  [=wire =term]
  =/  m  (strand ,~)
  ^-  form:m
  ;<  our=@p  bind:m  get-our
  (leave wire [our term])
```

#### Example {#example}

```hoon
;<  ~  bind:m  (leave-our /foo %foo)
```

---

### `rewatch` {#rewatch}

Resubscribe on kick.

This waits for a kick on a given wire, then rewatches the given ship, agent and path on the same wire. It then waits for a positive watch ack.

#### Accepts {#accepts}

A triple of `[=wire =dock =path]` where `dock` is the ship and agent, and `path` is the subscription path.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  rewatch
  |=  [=wire =dock =path]
  =/  m  (strand ,~)
  ;<  ~  bind:m  ((handle ,~) (take-kick wire))
  ;<  ~  bind:m  (flog-text "rewatching {<dock>} {<path>}")
  ;<  ~  bind:m  (watch wire dock path)
  (pure:m ~)
```

#### Exmaple {#exmaple}

```hoon
;<  ~  bind:m  (rewatch /foo [~zod %foo] /some/path)
```

---

### `take-fact-prefix` {#take-fact-prefix}

Wait for a subscription update on a wire.

#### Accepts {#accepts}

A `wire` as the *prefix* of what you expect. E.g. if `/foo` is given, a fact with a wire of `/foo`, `/foo/bar`, `/foo/bar/baz`, etc, will be accepted.

#### Produces {#produces}

A cell of `[wire cage]`.

#### Source {#source}

```hoon
++  take-fact-prefix
  |=  =wire
  =/  m  (strand ,[path cage])
  ^-  form:m
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~  `[%wait ~]
      [~ %agent * %fact *]
    ?.  =(watch+wire (scag +((lent wire)) wire.u.in.tin))
      `[%skip ~]
    `[%done (slag (lent wire) wire.u.in.tin) cage.sign.u.in.tin]
  ==
```

#### Example {#example}

```hoon
;<  [=wire =mark =vase]  bind:m  (take-fact-prefix /foo)
```

---

### `take-fact` {#take-fact}

Wait for a subscription update on a wire.

#### Accepts {#accepts}

The `wire` you want to listen on.

#### Produces {#produces}

A `cage`.

#### Source {#source}

```hoon
++  take-fact
  |=  =wire
  =/  m  (strand ,cage)
  ^-  form:m
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~  `[%wait ~]
      [~ %agent * %fact *]
    ?.  =(watch+wire wire.u.in.tin)
      `[%skip ~]
    `[%done cage.sign.u.in.tin]
  ==
```

#### Example {#example}

```hoon
;<  [=mark =vase]  bind:m  (take-fact /foo)
```

---

### `take-kick` {#take-kick}

Wait for a subscription close.

#### Accepts {#accepts}

The `wire` you want to listen on.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  take-kick
  |=  =wire
  =/  m  (strand ,~)
  ^-  form:m
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~  `[%wait ~]
      [~ %agent * %kick *]
    ?.  =(watch+wire wire.u.in.tin)
      `[%skip ~]
    `[%done ~]
  ==
```

#### Example {#example}

```hoon
;<  ~  bind:m  (take-kick /foo)
```

---

### `take-watch-ack` {#take-watch-ack}

Take a watch ack on a given wire.

If the watch ack is a nack, the strand fails.

#### Accepts {#accepts}

A `wire`.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  take-watch-ack
  |=  =wire
  =/  m  (strand ,~)
  ^-  form:m
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~  `[%wait ~]
      [~ %agent * %watch-ack *]
    ?.  =(watch+wire wire.u.in.tin)
      `[%skip ~]
    ?~  p.sign.u.in.tin
      `[%done ~]
    `[%fail %watch-ack-fail u.p.sign.u.in.tin]
  ==
```

#### Example {#example}

```hoon
;<  ~  bind:m  (take-watch-ack /foo)
```

---

### `take-watch` {#take-watch}

Wait for a subscription request.

#### Accepts {#accepts}

Nothing.

#### Produces {#produces}

The subscription `path`.

#### Source {#source}

```hoon
++  take-watch
  =/  m  (strand ,path)
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~  `[%wait ~]
      [~ %watch *]
    `[%done path.u.in.tin]
  ==
```

#### Example {#example}

```hoon
;<  =path  bind:m  take-watch
```

---

## Scries {#scries}

### `scry` {#scry}

Scry an agent or vane.

#### Accepts {#accepts}

A pair of `[=mold =path]` where `mold` is the type returned and `path` has the following format:

```hoon
/[vane letter and care]/[desk]/[rest of path after beak]
```

The strand implicitly fills in `our` and `now` in the beak.

#### Produces {#produces}

Data of the type produced by the mold you specified.

#### Source {#source}

```hoon
++  scry
  |*  [=mold =path]
  =/  m  (strand ,mold)
  ^-  form:m
  ?>  ?=(^ path)
  ?>  ?=(^ t.path)
  ;<  =bowl:spider  bind:m  get-bowl
  %-  pure:m
  .^(mold i.path (scot %p our.bowl) i.t.path (scot %da now.bowl) t.t.path)
```

#### Example {#example}

```hoon
;<  has=?  bind:m  (scry ? %cu %base /gen/vats/hoon)
```

---

### `keen` {#keen}

Make a remote scry request.

Note this doesn't wait for a response, you'd have to use a separate [take-tune](#take-tune) strand to receive the result.

#### Accept {#accept}

A pair of `[=wire =spar:ames]`.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  keen
  |=  [=wire =spar:ames]
  =/  m  (strand ,~)
  ^-  form:m
  (send-raw-card %pass wire %arvo %a %keen spar)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (keen /foo ~sampel /c/x/4/base/sys/hoon/hoon)
```

---

### `take-tune` {#take-tune}

Wait for a remote scry result on a particular wire.

#### Accepts {#accepts}

A `wire`.

#### Produces {#produces}

A `[spar:ames (unit roar:ames)]`

#### Source {#source}

```hoon
++  take-tune
  |=  =wire
  =/  m  (strand ,[spar:ames (unit roar:ames)])
  ^-  form:m
  |=  tin=strand-input:strand
  ?+    in.tin  `[%skip ~]
      ~  `[%wait ~]
    ::
      [~ %sign * %ames %tune ^ *]
    ?.  =(wire wire.u.in.tin)
      `[%skip ~]
    `[%done +>.sign-arvo.u.in.tin]
  ==
```

#### Example {#example}

```hoon
;<  [spar roar=(unit roar)]  bind:m  (take-tune /foo)
```

---

## Time {#time}

### `wait` {#wait}

Send a `%wait` to Behn and wait for the `%wake`.

Note there's also [sleep](#sleep) to wait for a relative amount of time
rather than having to specify an absolute time.

#### Accepts {#accepts}

A `@da` of when the timer should fire.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  wait
  |=  until=@da
  =/  m  (strand ,~)
  ^-  form:m
  ;<  ~  bind:m  (send-wait until)
  (take-wake `until)
```

#### Example {#example}

```hoon
;<  now=@da  bind:m  get-time
;<  ~  bind:m  (wait (add now ~s2))
```

---

### `sleep` {#sleep}

Wait for a relative amount of time.

#### Accepts {#accepts}

A `@dr`.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  sleep
  |=  for=@dr
  =/  m  (strand ,~)
  ^-  form:m
  ;<  now=@da  bind:m  get-time
  (wait (add now for))
```

#### Example {#example}

```hoon
;<  ~  bind:m  (sleep ~s2)
```

---

### `send-wait` {#send-wait}

Send Behn a `%wait` but don't wait for the `%wake`.

#### Accepts {#accepts}

A `@da`.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  send-wait
  |=  until=@da
  =/  m  (strand ,~)
  ^-  form:m
  =/  =card:agent:gall
    [%pass /wait/(scot %da until) %arvo %b %wait until]
  (send-raw-card card)
```

#### Example {#example}

```hoon
;<  now=@da  bind:m  get-time
;<  ~  bind:m  (send-wait (add ~s2 now))
```

---

### `set-timeout` {#set-timeout}

Make a strand fail if it takes too long.

#### Accepts {#accepts}

This takes the `mold` produced but the strand you're timing, and produces a gate. The gate takes a pair of the `@dr` timeout and the strand being timed.

#### Produces {#produces}

Data of the type produced by the strand being timed.

#### Source {#source}

```hoon
++  set-timeout
  |*  computation-result=mold
  =/  m  (strand ,computation-result)
  |=  [time=@dr computation=form:m]
  ^-  form:m
  ;<  now=@da  bind:m  get-time
  =/  when  (add now time)
  =/  =card:agent:gall
    [%pass /timeout/(scot %da when) %arvo %b %wait when]
  ;<  ~        bind:m  (send-raw-card card)
  |=  tin=strand-input:strand
  =*  loop  $
  ?:  ?&  ?=([~ %sign [%timeout @ ~] %behn %wake *] in.tin)
          =((scot %da when) i.t.wire.u.in.tin)
      ==
    `[%fail %timeout ~]
  =/  c-res  (computation tin)
  ?:  ?=(%cont -.next.c-res)
    c-res(self.next ..loop(computation self.next.c-res))
  ?:  ?=(%done -.next.c-res)
    =/  =card:agent:gall
      [%pass /timeout/(scot %da when) %arvo %b %rest when]
    c-res(cards [card cards.c-res])
  c-res
```

#### Example {#example}

```hoon
;<  ~  bind:m  ((set-timeout ,~) ~s10 (poke-our %foo %noun !>(~)))
```

---

### `take-wake` {#take-wake}

Wait for a wake from Behn.

This is meant for internal use by [wait](#wait), you'd not typically
use it directly.

#### Accepts {#accepts}

A `(unit @da)`. If the unit is non-null, it'll only accept a `%wake`
whose wire is of the form `/wait/(scot %da the-given-time)`. If the unit
is null, it'll accept a `%wake` with a wire of `/wait/(scot %da
any-time)`.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
::
++  take-wake
  |=  until=(unit @da)
  =/  m  (strand ,~)
  ^-  form:m
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~  `[%wait ~]
      [~ %sign [%wait @ ~] %behn %wake *]
    ?.  |(?=(~ until) =(`u.until (slaw %da i.t.wire.u.in.tin)))
      `[%skip ~]
    ?~  error.sign-arvo.u.in.tin
      `[%done ~]
    `[%fail %timer-error u.error.sign-arvo.u.in.tin]
  ==
```

#### Example {#example}

```hoon
;<  now=@da  bind:m  get-time
=/  card=card:agent:gall  [%pass /wait/(scot %da now) %arvo %b %wait now]
;<  ~  bind:m  (send-raw-card card)
;<  ~  bind:m  (take-wake `now)
```

---

## Errors {#errors}

### `retry` {#retry}

Retry a strand that produces a `unit` if the `unit` is null, with a backoff.

#### Accepts {#accepts}

`retry` first takes a `result=mold` of the return type and produces a gate. That gate takes two arguments:

- `crash-after=(unit @ud)`: the number of tries before failing.
- `computation`: A strand that produces a `(unit result)`.

#### Produces {#produces}

The type of `result`.

#### Source {#source}

```hoon
++  retry
  |*  result=mold
  |=  [crash-after=(unit @ud) computation=_*form:(strand (unit result))]
  =/  m  (strand ,result)
  =|  try=@ud
  |-  ^-  form:m
  =*  loop  $
  ?:  =(crash-after `try)
    (strand-fail %retry-too-many ~)
  ;<  ~                  bind:m  (backoff try ~m1)
  ;<  res=(unit result)  bind:m  computation
  ?^  res
    (pure:m u.res)
  loop(try +(try))
```

#### Example {#example}

```hoon
=/  =hiss:eyre  [(need (de-purl:html 'http://example.com')) %get ~ ~]
;<  =httr:eyre  bind:m  ((retry httr:eyre) `3 (hiss-request hiss))
```
---

### `backoff` {#backoff}

Wait for increasing amounts of time with each try.

#### Accepts {#accepts}

A pair of `[try=@ud limit=@dr]`, specifying the current try count and the maximum amount of time to wait.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  backoff
  |=  [try=@ud limit=@dr]
  =/  m  (strand ,~)
  ^-  form:m
  ;<  eny=@uvJ  bind:m  get-entropy
  %-  sleep
  %+  min  limit
  ?:  =(0 try)  ~s0
  %+  add
    (mul ~s1 (bex (dec try)))
  (mul ~s0..0001 (~(rad og eny) 1.000))
```

---

### `map-err` {#map-err}

Rewrite a strand failure error.

#### Accepts {#accepts}

This function takes the return `mold` of the strand in question as its argument and returns a gate that takes two arguments:

- `f`: a gate that takes a `[term tang]` and produces a `[term tang]`. This is the `%error-tag` and stack trace of the failure you're rewriting.
- `computation`: the strand whose errors you're rewriting.

See the example below for usage.

#### Produces {#produces}

Data of the type produced by the strand in question.

#### Source {#source}

```hoon
++  map-err
  |*  computation-result=mold
  =/  m  (strand ,computation-result)
  |=  [f=$-([term tang] [term tang]) computation=form:m]
  ^-  form:m
  |=  tin=strand-input:strand
  =*  loop  $
  =/  c-res  (computation tin)
  ?:  ?=(%cont -.next.c-res)
    c-res(self.next ..loop(computation self.next.c-res))
  ?.  ?=(%fail -.next.c-res)
    c-res
  c-res(err.next (f err.next.c-res))
```

#### Example {#example}

```hoon
;<  ~  bind:m
  %+  (map-err ,~)
    |=  [=term =tang]
    ?:  =(%poke-fail term)
      [%foo tang]
    [term tang]
  (poke-our %foo %noun !>(~))
```

---

## HTTP {#http}

### `send-request` {#send-request}

Make an HTTP request via Iris, but don't wait for the response.

#### Accepts {#accepts}

A [`request:http`](../../../system/kernel/eyre/reference/data-types.md#requesthttp).

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  send-request
  |=  =request:http
  =/  m  (strand ,~)
  ^-  form:m
  (send-raw-card %pass /request %arvo %i %request request *outbound-config:iris)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (send-request %'GET' 'http://example.com' ~ ~)
```

---

### `send-cancel-request` {#send-cancel-request}

Cancel a previous Iris HTTP request.

This sends it on the `/request` wire used by [`send-request`](#send-request). It won't work if the original request was on a different wire.

#### Accepts {#accepts}

Nothing.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  send-cancel-request
  =/  m  (strand ,~)
  ^-  form:m
  (send-raw-card %pass /request %arvo %i %cancel-request ~)
```

#### Example {#example}

```hoon
;<  ~  bind:m  send-cancel-request
```

---

### `take-client-response` {#take-client-response}

Take the HTTP response from a previous HTTP request made with [`send-request`](#send-request).

This listens on the `/request` wire, it won't work if you're made a request on a different wire.

#### Accepts {#accepts}

Nothing.

#### Produces {#produces}

A [`client-response:iris`](../../../system/kernel/iris/reference/data-types.md#client-response).

#### Source {#source}

```hoon
++  take-client-response
  =/  m  (strand ,client-response:iris)
  ^-  form:m
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~  `[%wait ~]
    ::
      [~ %sign [%request ~] %iris %http-response %cancel *]
    ::NOTE  iris does not (yet?) retry after cancel, so it means failure
    :-  ~
    :+  %fail
      %http-request-cancelled
    ['http request was cancelled by the runtime']~
    ::
      [~ %sign [%request ~] %iris %http-response %finished *]
    `[%done client-response.sign-arvo.u.in.tin]
  ==
```

#### Example {#example}

```hoon
;<  res=client-response:iris  bind:m  take-client-response
```

---

### `take-maybe-sigh` {#take-maybe-sigh}

Take a unitized raw HTTP response.

#### Accepts {#accepts}
 
Nothing

#### Produces {#produces}

A `(unit httr:eyre)`. The `unit` is null if we failed to receive a response.

#### Source {#source}

```hoon
++  take-maybe-sigh
  =/  m  (strand ,(unit httr:eyre))
  ^-  form:m
  ;<  rep=(unit client-response:iris)  bind:m
    take-maybe-response
  ?~  rep
    (pure:m ~)
  ::  XX s/b impossible
  ::
  ?.  ?=(%finished -.u.rep)
    (pure:m ~)
  (pure:m (some (to-httr:iris +.u.rep)))
```

#### Example {#example}

```hoon
;<  res=(unit httr:eyre)  bind:m  take-maybe-sigh
```

---

### `take-maybe-response` {#take-maybe-response}

Take a unitized HTTP response.

#### Accepts {#accepts}

Nothing

#### Produces {#produces}

A `(unit client-response:iris)`. The `unit` is null if we failed to receive a response.

#### Source {#source}

```hoon
++  take-maybe-response
  =/  m  (strand ,(unit client-response:iris))
  ^-  form:m
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~  `[%wait ~]
      [~ %sign [%request ~] %iris %http-response %cancel *]
    `[%done ~]
      [~ %sign [%request ~] %iris %http-response %finished *]
    `[%done `client-response.sign-arvo.u.in.tin]
  ==
```

#### Example {#example}

```hoon
;<  res=(unit client-response:iris)  bind:m  take-maybe-response
```

---

### `extract-body` {#extract-body}

Extract body from an HTTP response.

#### Accepts {#accepts}

A `client-response:iris`

#### Produces {#produces}

A `cord`.

#### Source {#source}

```hoon
++  extract-body
  |=  =client-response:iris
  =/  m  (strand ,cord)
  ^-  form:m
  ?>  ?=(%finished -.client-response)
  %-  pure:m
  ?~  full-file.client-response  ''
  q.data.u.full-file.client-response
```

---

### `fetch-cord` {#fetch-cord}

Get the HTTP response body from a URL.

#### Accepts {#accepts}

The URL in a `tape`.

#### Produces {#produces}

A `cord` of the response body.

#### Source {#source}

```hoon
++  fetch-cord
  |=  url=tape
  =/  m  (strand ,cord)
  ^-  form:m
  =/  =request:http  [%'GET' (crip url) ~ ~]
  ;<  ~                      bind:m  (send-request request)
  ;<  =client-response:iris  bind:m  take-client-response
  (extract-body client-response)
```

#### Example {#example}

```hoon
;<  bod=@t  bind:m  (fetch-cord "http://example.com")
```

---

### `fetch-json` {#fetch-json}

Get some JSON from a URL.

#### Accepts {#accepts}

The URL as a `tape`.

#### Produces {#produces}

A `json` structure.

#### Source {#source}

```hoon
++  fetch-json
  |=  url=tape
  =/  m  (strand ,json)
  ^-  form:m
  ;<  =cord  bind:m  (fetch-cord url)
  =/  json=(unit json)  (de-json:html cord)
  ?~  json
    (strand-fail %json-parse-error ~)
  (pure:m u.json)
```

#### Example {#example}

```hoon
;<  =json  bind:m  (fetch-json "http://example.com")
```

---

### `hiss-request` {#hiss-request}

Make a raw HTTP request, take a raw response.

#### Accepts {#accepts}

`hiss:eyre`

#### Produces {#produces}

A `(unit httr:eyre)`. The `unit` is null if we failed to receive a response.

#### Source {#source}

```hoon
::
++  hiss-request
  |=  =hiss:eyre
  =/  m  (strand ,(unit httr:eyre))
  ^-  form:m
  ;<  ~  bind:m  (send-request (hiss-to-request:html hiss))
  take-maybe-sigh
```

#### Example {#example}

```hoon
=/  =hiss:eyre  [(need (de-purl:html 'http://example.com')) %get ~ ~]
;<  res=(unit httr:eyre)  bind:m  (hiss-request hiss)
```

---

## Build {#build}

### `build-file` {#build-file}

Build a source file at the specified `beam`.

#### Accepts {#accepts}

A `beam`.

#### Produces {#produces}

A `(unit vase)`. The `vase` contains the compiled file, the `unit` is null if it failed.

#### Source {#source}

```hoon
++  build-file
  |=  [[=ship =desk =case] =spur]
  =*  arg  +<
  =/  m  (strand ,(unit vase))
  ^-  form:m
  ;<  =riot:clay  bind:m
    (warp ship desk ~ %sing %a case spur)
  ?~  riot
    (pure:m ~)
  ?>  =(%vase p.r.u.riot)
  (pure:m (some !<(vase q.r.u.riot)))
```

#### Example {#example}

```hoon
;<  now=@da          bind:m  get-time
;<  res=(unit vase)  bind:m  (build-file [~zod %base da+now] /gen/hood/hi/hoon)
```

---

### `build-file-hard` {#build-file-hard}

Build a source file at the specified `beam`, crashing if it fails.

#### Accepts {#accepts}

A `beam`.

#### Produces {#produces}

A `vase`.

#### Source {#source}

```hoon
++  build-file-hard
  |=  [[=ship =desk =case] =spur]
  =*  arg  +<
  =/  m  (strand ,vase)
  ^-  form:m
  ;<    =riot:clay
      bind:m
    (warp ship desk ~ %sing %a case spur)
  ?>  ?=(^ riot)
  ?>  ?=(%vase p.r.u.riot)
  (pure:m !<(vase q.r.u.riot))
```

#### Example {#example}

```hoon
;<  now=@da  bind:m  get-time
;<  =vase    bind:m  (build-file-hard [~zod %base da+now] /gen/hood/hi/hoon)
```

---

### `build-mark` {#build-mark}

Build a dynamic mark core from file.

#### Accepts {#accepts}

A pair of `[beak mark]`.

#### Produces {#produces}

A `dais:clay`

#### Source {#source}

```hoon
++  build-mark
  |=  [[=ship =desk =case] mak=mark]
  =*  arg  +<
  =/  m  (strand ,dais:clay)
  ^-  form:m
  ;<  =riot:clay  bind:m
    (warp ship desk ~ %sing %b case /[mak])
  ?~  riot
    (strand-fail %build-mark >arg< ~)
  ?>  =(%dais p.r.u.riot)
  (pure:m !<(dais:clay q.r.u.riot))
```

#### Example {#example}

```hoon
;<  now=@da     bind:m  get-time
;<  =dais:clay  bind:m  (build-mark [~zod %base da+now] %noun)
```

---

### `build-tube` {#build-tube}

Build a dynamic mark conversion gate from file.

#### Accepts {#accepts}

A pair of `[beak mars:clay]`. A `mars` is a pair of the *from* and *to* mark.

#### Produces {#produces}

A `tube:clay`

#### Source {#source}

```hoon
++  build-tube
  |=  [[=ship =desk =case] =mars:clay]
  =*  arg  +<
  =/  m  (strand ,tube:clay)
  ^-  form:m
  ;<  =riot:clay  bind:m
    (warp ship desk ~ %sing %c case /[a.mars]/[b.mars])
  ?~  riot
    (strand-fail %build-tube >arg< ~)
  ?>  =(%tube p.r.u.riot)
  (pure:m !<(tube:clay q.r.u.riot))
```

#### Example {#example}

```hoon
;<  now=@da     bind:m  get-time
;<  =tube:clay  bind:m  (build-tube [~zod %base da+now] %mime %txt)
```

---

### `build-nave` {#build-nave}

Build a static mark core from file.

#### Accepts {#accepts}

A pair of `[beak mark]`.

#### Produces {#produces}

A `vase`.

#### Source {#source}

```hoon
++  build-nave
  |=  [[=ship =desk =case] mak=mark]
  =*  arg  +<
  =/  m  (strand ,vase)
  ^-  form:m
  ;<  =riot:clay  bind:m
    (warp ship desk ~ %sing %e case /[mak])
  ?~  riot
    (strand-fail %build-nave >arg< ~)
  ?>  =(%nave p.r.u.riot)
  (pure:m q.r.u.riot)
```

#### Example {#example}

```hoon
;<  now=@da     bind:m  get-time
;<  =nave:clay  bind:m  (build-nave [~zod %base da+now] %txt)
```

---

### `build-cast` {#build-cast}

Build a static mark conversion gate from file.

#### Accepts {#accepts}

A pair of `[beak mars:clay]`. A `mars` is a pair of the *from* mark and *to* mark.

#### Source {#source}

```hoon
++  build-cast
  |=  [[=ship =desk =case] =mars:clay]
  =*  arg  +<
  =/  m  (strand ,vase)
  ^-  form:m
  ;<  =riot:clay  bind:m
    (warp ship desk ~ %sing %f case /[a.mars]/[b.mars])
  ?~  riot
    (strand-fail %build-cast >arg< ~)
  ?>  =(%cast p.r.u.riot)
  (pure:m q.r.u.riot)
```

#### Example {#example}

```hoon
;<  now=@da  bind:m  get-time
;<  =vase    bind:m  (build-cast [~zod %base da+now] %mime %txt)
```

---

### `eval-hoon` {#eval-hoon}

Evaluate some hoon and produce the result.

#### Accepts {#accepts}

A pair of `[gen=hoon bez=(list beam)]`. The `gen` argument is the hoon to be evaluated. If `bez` is empty, it will be evaluated against the standard `..zuse` subject. If a list of `beam`s are provided in `bez`, each one will be read from Clay, build, and pinned to the head of the subject, before `gen` is evaluated against it.

#### Produces {#produces}

A `vase` of the result.

#### Source {#source}

```hoon
++  eval-hoon
  |=  [gen=hoon bez=(list beam)]
  =/  m  (strand ,vase)
  ^-  form:m
  =/  sut=vase  !>(..zuse)
  |-
  ?~  bez
    (pure:m (slap sut gen))
  ;<  vax=vase  bind:m  (build-file-hard i.bez)
  $(bez t.bez, sut (slop vax sut))
```

#### Example {#example}

```hoon
;<  =vase  bind:m  (eval-hoon !,(*hoon (add 1 1)))
```

---

## Clay {#clay}

### `warp` {#warp}

Raw read from Clay.

#### Accepts {#accepts}

A pair of `ship` and [`riff:clay`](../../../system/kernel/clay/reference/data-types.md#riff).

#### Produces {#produces}

A [`riot:clay`](../../../system/kernel/clay/reference/data-types.md#riot).

#### Source {#source}

```hoon
++  warp
  |=  [=ship =riff:clay]
  =/  m  (strand ,riot:clay)
  ;<  ~  bind:m  (send-raw-card %pass /warp %arvo %c %warp ship riff)
  (take-writ /warp)
```

#### Example {#example}

```hoon
;<  now=@da  bind:m  get-time
;<  =riot:clay  bind:m  (warp %base ~ %sing %x da+now /foo/txt)
```

---

### `read-file` {#read-file}

Read a file from Clay.

#### Accepts {#accepts}

A `beam`.

#### Produces {#produces}

A `cage`.

#### Source {#source}

```hoon
++  read-file
  |=  [[=ship =desk =case] =spur]
  =*  arg  +<
  =/  m  (strand ,cage)
  ;<  =riot:clay  bind:m  (warp ship desk ~ %sing %x case spur)
  ?~  riot
    (strand-fail %read-file >arg< ~)
  (pure:m r.u.riot)
```

#### Example {#example}

```hoon
;<  now=@da  bind:m  get-time
;<  =cage    bind:m  (read-file [~zod %base da+now] /foo/txt)
```

---

### `check-for-file` {#check-for-file}

Check for the existence of a file in Clay.

#### Accepts {#accepts}

A `beam`.

#### Produces {#produces}

A `?` which is `%.y` if the file exists, and `%.n` if not.

#### Source {#source}

```hoon
++  check-for-file
  |=  [[=ship =desk =case] =spur]
  =/  m  (strand ,?)
  ;<  =riot:clay  bind:m  (warp ship desk ~ %sing %x case spur)
  (pure:m ?=(^ riot))
```

#### Example {#example}

```hoon
;<  now=@da  bind:m  get-time
;<  has=?    bind:m  (check-for-file [~zod %base da+now] /foo/txt)
```

---

### `list-tree` {#list-tree}

Get a list of all files in the given Clay directory.

#### Accepts {#accepts}

A `beam`.

#### Produces {#produces}

A `(list path)`.

#### Source {#source}

```hoon
++  list-tree
  |=  [[=ship =desk =case] =spur]
  =*  arg  +<
  =/  m  (strand ,(list path))
  ;<  =riot:clay  bind:m  (warp ship desk ~ %sing %t case spur)
  ?~  riot
    (strand-fail %list-tree >arg< ~)
  (pure:m !<((list path) q.r.u.riot))
```

#### Example {#example}

```hoon
;<  now=@da            bind:m  get-time
;<  paths=(list path)  bind:m  (list-tree [~zod %base da+now] /sys)
```

---

### `take-writ` {#take-writ}

Take a Clay read result.

#### Accepts {#accepts}

The `wire` to listen on.

#### Produces {#produces}

A [`riot:clay`](../../../system/kernel/clay/reference/data-types.md#riot)

#### Source {#source}

```hoon
++  take-writ
  |=  =wire
  =/  m  (strand ,riot:clay)
  ^-  form:m
  |=  tin=strand-input:strand
  ?+  in.tin  `[%skip ~]
      ~  `[%wait ~]
      [~ %sign * ?(%behn %clay) %writ *]
    ?.  =(wire wire.u.in.tin)
      `[%skip ~]
    `[%done +>.sign-arvo.u.in.tin]
  ==
```

#### Example {#example}

```hoon
;<  =riot-clay  bind:m  (take-writ /warp)
```

---

## Main Loop {#main-loop}

### `ignore` {#ignore}

Try next on failure.

This produces a failure with an `%ignore` status, which [main-loop](#main-loop) uses to skip the strand and try the next one. This is of little use outside the context of a `main-loop`.

#### Accepts {#accepts}

Nothing.

#### Produces {#produces}

Nothing.

#### Source {#source}

```hoon
++  ignore
  |=  tin=strand-input:strand
  `[%fail %ignore ~]
```

---

### `handle` {#handle}

Convert skips to `%ignore` failures.

This tells [main-loop](#main-loop) to try the next strand on skips. This would not be used outside of a `main-loop`.

#### Accepts {#accepts}

`+handle` takes a mold and produces a gate that takes another strand.

#### Produces {#produces}

Data of the type produced by the given mold.

#### Source {#source}

```hoon
++  handle
  |*  a=mold
  =/  m  (strand ,a)
  |=  =form:m
  ^-  form:m
  |=  tin=strand-input:strand
  =/  res  (form tin)
  =?  next.res  ?=(%skip -.next.res)
    [%fail %ignore ~]
  res
```

#### Example {#example}

```hoon
;<  =vase  bind:m  ((handle ,vase) (take-poke %foo))
```

---

### `main-loop` {#main-loop}

A `main-loop` can be used for three things:

1. create a loop.
2. try the same input against multiple strands.
3. Queue input on `%skip` and then dequeue from the beginning on `%done`.

#### Accepts {#accepts}

It first accepts a `mold`, specifying the return type, and produces a gate. The gate produced takes a `list` of gates that take an argument of the specified `mold`, and produce the `form` of a `strand` of that mold.

#### Produces {#produces}

Data of the type produced by the given `mold`.

#### Source {#source}

<details>
<summary>main-loop code</summary>

```hoon
++  main-loop
  |*  a=mold
  =/  m  (strand ,~)
  =/  m-a  (strand ,a)
  =|  queue=(qeu (unit input:strand))
  =|  active=(unit [in=(unit input:strand) =form:m-a forms=(list $-(a form:m-a))])
  =|  state=a
  |=  forms=(lest $-(a form:m-a))
  ^-  form:m
  |=  tin=strand-input:strand
  =*  top  `form:m`..$
  =.  queue  (~(put to queue) in.tin)
  |^  (continue bowl.tin)
  ::
  ++  continue
    |=  =bowl:strand
    ^-  output:m
    ?>  =(~ active)
    ?:  =(~ queue)
      `[%cont top]
    =^  in=(unit input:strand)  queue  ~(get to queue)
    ^-  output:m
    =.  active  `[in (i.forms state) t.forms]
    ^-  output:m
    (run bowl in)
  ::
  ++  run
    ^-  form:m
    |=  tin=strand-input:strand
    ^-  output:m
    ?>  ?=(^ active)
    =/  res  (form.u.active tin)
    =/  =output:m
      ?-  -.next.res
          %wait  `[%wait ~]
          %skip  `[%cont ..$(queue (~(put to queue) in.tin))]
          %cont  `[%cont ..$(active `[in.u.active self.next.res forms.u.active])]
          %done  (continue(active ~, state value.next.res) bowl.tin)
          %fail
        ?:  &(?=(^ forms.u.active) ?=(%ignore p.err.next.res))
          %=  $
            active  `[in.u.active (i.forms.u.active state) t.forms.u.active]
            in.tin  in.u.active
          ==
        `[%fail err.next.res]
      ==
    [(weld cards.res cards.output) next.output]
  --
```

</details>

#### Example {#example}

See the [separate `main-loop`
example](../examples/main-loop.md) or the
[`echo`](#echo) example below.

---

### `echo` {#echo}

Echo a given message to the terminal every 2 seconds until told to stop.

#### Accepts {#accepts}

This strand takes nothing directly, but expects a poke with a `mark` of `%echo` and vase containing a `tape` with the message to echo. To finish, it expects a poke with a `mark` of `%over`.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  echo
  =/  m  (strand ,~)
  ^-  form:m
  %-  (main-loop ,~)
  :~  |=  ~
      ^-  form:m
      ;<  =vase  bind:m  ((handle ,vase) (take-poke %echo))
      =/  message=tape  !<(tape vase)
      %-  (slog leaf+"{message}..." ~)
      ;<  ~      bind:m  (sleep ~s2)
      %-  (slog leaf+"{message}.." ~)
      (pure:m ~)
  ::
      |=  ~
      ^-  form:m
      ;<  =vase  bind:m  ((handle ,vase) (take-poke %over))
      %-  (slog leaf+"over..." ~)
      (pure:m ~)
  ==
```

---

## Printing {#printing}

### `flog` {#flog}

Send a wrapped Dill task to Dill.

#### Accepts {#accepts}

A [`flog:dill`](../../../system/kernel/dill/reference/data-types.md#flog)

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  flog
  |=  =flog:dill
  =/  m  (strand ,~)
  ^-  form:m
  (send-raw-card %pass / %arvo %d %flog flog)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (flog %text "foo")
```

---

### `flog-text` {#flog-text}

Print a message to the terminal via Dill.

#### Accepts {#accepts}

A `tape`.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  flog-text
  |=  =tape
  =/  m  (strand ,~)
  ^-  form:m
  (flog %text tape)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (flog-text "foo")
```

---

### `flog-tang` {#flog-tang}

Print a `tang` to the terminal via Dill.

#### Accepts {#accepts}

A `tang`

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  flog-tang
  |=  =tang
  =/  m  (strand ,~)
  ^-  form:m
  =/  =wall
    (zing (turn (flop tang) (cury wash [0 80])))
  |-  ^-  form:m
  =*  loop  $
  ?~  wall
    (pure:m ~)
  ;<  ~  bind:m  (flog-text i.wall)
  loop(wall t.wall)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (flog-tang 'foo' 'bar' 'baz' ~)
```

---

### `trace` {#trace}

Slog a `tang` to the terminal.

#### Accepts {#accepts}

A `tang`.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  trace
  |=  =tang
  =/  m  (strand ,~)
  ^-  form:m
  (pure:m ((slog tang) ~))
```

#### Example {#example}

```hoon
;<  ~  bind:m  (trace 'foo' 'bar' 'baz' ~)
```

---

### `app-message` {#app-message}

Print a message to the terminal tagged with an app name, like:

```
my-app: foo bar baz
```

Then, optionally, print a `tang`.

#### Accepts {#accepts}

A triple of `[term cord tang]`. The `term` is the app name, the `cord` is the message, and the `tang` is any traceback.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  app-message
  |=  [app=term =cord =tang]
  =/  m  (strand ,~)
  ^-  form:m
  =/  msg=tape  :(weld (trip app) ": " (trip cord))
  ;<  ~  bind:m  (flog-text msg)
  (flog-tang tang)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (app-message %foo 'foo bar baz' ~)
```

---

## Threads {#threads}

### `send-thread` {#send-thread}

Run an inline thread via Khan.

#### Accepts {#accepts}

A triple of:

- `bear:khan`: desk or beak.
- `shed:khan`: the thread itself.
- `wire`: the wire for responses from Khan.

#### Produces {#produces}

`~`

#### Source {#source}

```hoon
++  send-thread
  |=  [=bear:khan =shed:khan =wire]
  =/  m  (strand ,~)
  ^-  form:m
  (send-raw-card %pass wire %arvo %k %lard bear shed)
```

---

### `start-thread` {#start-thread}

Start a child thread.

#### Accepts {#accepts}

A `term`, the name of a thread in `/ted` of this desk.

#### Produces {#produces}

A `tid:spider`, the ID of the child thread.

#### Source {#source}

```hoon
++  start-thread
  |=  file=term
  =/  m  (strand ,tid:spider)
  ;<  =bowl:spider  bind:m  get-bowl
  (start-thread-with-args byk.bowl file *vase)
```

#### Example {#example}

```hoon
;<  ~  bind:m  (start-thread %foo)
```

---

### `start-thread-with-args` {#start-thread-with-args}

Start a child thread with arguments.

#### Accepts {#accepts}

A triple of:

- `beak`: the ship/desk/case where the thread is located.
- `term`: the name of the thread in `/ted` of the given desk.
- `vase`: the start argument.

#### Produces {#produces}

A `tid:spider`, the ID of the child thread.

#### Source {#source}

```hoon
++  start-thread-with-args
  |=  [=beak file=term args=vase]
  =/  m  (strand ,tid:spider)
  ^-  form:m
  ;<  =bowl:spider  bind:m  get-bowl
  =/  tid
    (scot %ta (cat 3 (cat 3 'strand_' file) (scot %uv (sham file eny.bowl))))
  =/  poke-vase  !>(`start-args:spider`[`tid.bowl `tid beak file args])
  ;<  ~  bind:m  (poke-our %spider %spider-start poke-vase)
  ;<  ~  bind:m  (sleep ~s0)  ::  wait for thread to start
  (pure:m tid)
```

#### Example {#example}

```hoon
;<  now=@da  bind:m  get-time
;<  ~        bind:m  (start-thread-with-args [~zod %base da+now] %foo !>(~))
```

---

### `thread-result` {#thread-result}

Type definition of a thread result.

#### Source {#source}

```hoon
+$  thread-result
  (each vase [term tang])
```

---

### `await-thread` {#await-thread}

Start a thread with an argument, then await its result.

#### Accepts {#accepts}

A pair of `[term vase]` where `term` is the name of a thread in `/ted` of this desk, and `vase` contains the start argument.

#### Produces {#produces}

A [`thread-result`](#thread-result)

#### Source {#source}

```hoon
++  await-thread
  |=  [file=term args=vase]
  =/  m  (strand ,thread-result)
  ^-  form:m
  ;<  =bowl:spider  bind:m  get-bowl
  =/  tid  (scot %ta (cat 3 'strand_' (scot %uv (sham file eny.bowl))))
  =/  poke-vase  !>(`start-args:spider`[`tid.bowl `tid byk.bowl file args])
  ;<  ~      bind:m  (watch-our /awaiting/[tid] %spider /thread-result/[tid])
  ;<  ~      bind:m  (poke-our %spider %spider-start poke-vase)
  ;<  ~      bind:m  (sleep ~s0)  ::  wait for thread to start
  ;<  =cage  bind:m  (take-fact /awaiting/[tid])
  ;<  ~      bind:m  (take-kick /awaiting/[tid])
  ?+  p.cage  ~|([%strange-thread-result p.cage file tid] !!)
    %thread-done  (pure:m %& q.cage)
    %thread-fail  (pure:m %| ;;([term tang] q.q.cage))
  ==
```

#### Example {#example}

```hoon
;<  =thread-result  bind:m  (await-thread %foo !>(~))
```

---
