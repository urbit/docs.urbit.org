---
description: "Thread example showing how to scry ames for ship IP addresses and ports - practical scrying with formatted output."
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

# Scry

Here's an example of a thread that scries ames for the IP address & port of a ship and nicely prints it:

{% code title="/ted/get-ip.hoon" overflow="nowrap" lineNumbers="true" %}
```hoon
/+  strandio
|%
++  process-lanes
  |=  [target=@p lanes=(list lane:ames)]
  =/  m  (strand:rand ,~)
  ^-  form:m
  ?~  `(list lane:ames)`lanes
    %-  (slog leaf+"No route for {(scow %p target)}." ~)
    (pure:m ~)
  =/  lroute  (skip lanes |=(a=lane:ames -.a))
  ?~  lroute
    %-  (slog leaf+"No direct route for {(scow %p target)}." ~)
    (pure:m ~)
  =/  ip  +:(scow %if p.i.lroute)
  =/  port  (skip (scow %ud (cut 5 [1 1] p.i.lroute)) |=(a=@tD =(a '.')))
  %-  (slog leaf+"{ip}:{port}" ~)
  (pure:m ~)
--
|=  arg=vase
=/  m  (strand:rand ,vase)
^-  form:m
=/  utarget  !<  (unit @p)  arg
?~  utarget
  (strand-fail:rand %no-arg ~)
=/  target  u.utarget
;<  lanes=(list lane:ames)  bind:m  (scry:strandio (list lane:ames) /ax//peers/(scot %p target)/forward-lane)
;<  ~                       bind:m  (process-lanes target lanes)
(pure:m !>(~))
```
{% endcode %}

**Note:** Pretty useless on a fake ship.

Save as `/ted/get-ip.hoon` in the `%base` desk, `|commit %base`, and run it with `-get-ip ~bitbet-bolbel`. You should see something like:

```
34.83.113.220:60659
```

### Analysis {#analysis}

Here we use the `strandio` function `+scry` which takes an argument of `[mold path]` where:

- `mold` is the return type of the scry
- `path` is the scry path formatted like:
  1.  vane letter and care
  2.  desk if scrying arvo or agent if scrying a gall agent
  3.  rest of path

In our case the mold is `(list lane:ames)` and the path is `/ax//peers/(scot %p target)/forward-lane` like:

```hoon
;<  lanes=(list lane:ames)  bind:m  (scry:strandio (list lane:ames) /ax//peers/(scot %p target)/forward-lane)
```

After that we just process the result in `+process-lanes` and print it.
