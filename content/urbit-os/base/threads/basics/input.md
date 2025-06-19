---
description: "Guide to strand input including $bowl structure with ship, timing, and subscription data, input types (pokes, signs, agent communication), and accessing input data within thread execution."
layout:
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# Input

The input to a `+strand` is defined in `lull.hoon` as:

```hoon
+$  strand-input
  $+  strand-input
  [=bowl in=(unit input)]
```

When a thread is first started, spider will populate the `bowl` and provide it along with an `input` of `~`. If/when new input comes in (such as a poke, sign or watch) it will provide a new updated bowl along with the new input.

For example, here's a thread that gets the time from the bowl, runs an IO-less function that takes one or two seconds to compute, and then gets the time again:

```hoon
/+  strandio
|%
++  ackermann
  |=  [m=@ n=@]
  ?:  =(m 0)  +(n)
  ?:  =(n 0)  $(m (dec m), n 1)
  $(m (dec m), n $(n (dec n)))
--
|=  arg=vase
=/  m  (strand:rand ,vase)
^-  form:m
;<  t1=@da  bind:m  get-time:strandio
=/  ack  (ackermann 3 8)
;<  t2=@da  bind:m  get-time:strandio
(pure:m !>([t1 t2]))
```

Since it never does any IO, `t1` and `t2` are the same: `[~2021.3.17..07.47.39..e186 ~2021.3.17..07.47.39..e186]`. However, if we replace the ackermann function with a 2 second `+sleep` from strandio:

```hoon
/+  strandio
|=  arg=vase
=/  m  (strand:rand ,vase)
^-  form:m
;<  t1=@da  bind:m  get-time:strandio
;<  ~       bind:m  (sleep:strandio ~s2)
;<  t2=@da  bind:m  get-time:strandio
(pure:m !>([t1 t2]))
```

...and run it again we get different values for `t1` and `t2`: `[~2021.3.17..07.50.28..8a5d ~2021.3.17..07.50.30..8a66]`. This is because `+sleep` gets a `%wake` sign back from Behn, so Spider updates the time in the bowl along with it.

Now let's look at the contents of `bowl` and `input` in detail:

## bowl {#bowl}

`bowl` is the following:

```hoon
+$  bowl
  $+  strand-bowl
  $:  our=ship
      src=ship
      tid=tid
      mom=(unit tid)
      wex=boat:gall
      sup=bitt:gall
      eny=@uvJ
      now=@da
      byk=beak
  ==
```

- `our` - our ship
- `src` - ship where input is coming from
- `tid` - ID of this thread
- `mom` - parent thread if this is a child thread
- `wex` - outgoing subscriptions
- `sup` - incoming subscriptions
- `eny` - entropy
- `now` - current datetime
- `byk` - `[p=ship q=desk r=case]` path prefix

There are a number of functions in `strandio` to access the `bowl` contents like `+get-bowl`, `+get-beak`, `+get-time`, `+get-our` and `+get-entropy`.

You can also write a function with a gate whose sample is `strand-input:rand` and access the bowl that way like:

```hoon
|%
++  bowl-stuff
  =/  m  (strand:rand ,[boat:gall bitt:gall])
  ^-  form:m
  |=  tin=strand-input:rand
  `[%done [wex.bowl.tin sup.bowl.tin]]
--
|=  arg=vase
=/  m  (strand:rand ,vase)
^-  form:m
;<  res=[boat:gall bitt:gall]  bind:m  bowl-stuff
(pure:m !>(res))
```

## input {#input}

`input` is defined in libstrand as:

```hoon
+$  input
  $+  input
  $%  [%poke =cage]
      [%sign =wire =sign-arvo]
      [%agent =wire =sign:agent:gall]
      [%watch =path]
  ==
```

- `%poke` incoming poke
- `%sign` incoming sign from Arvo
- `%agent` incoming sign from a Gall agent
- `%watch` incoming subscription

Various functions in `strandio` will check `input` and conditionally do things based on its contents. For example, `+sleep` sets a Behn timer and then calls `+take-wake` to wait for a `%wake` sign from Behn:

```hoon
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
