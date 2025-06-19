---
description: "Gall data type reference - agent structures for subscriptions, bowls, cards, signs, and agent lifecycle management."
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

# Gall Data Types

This document describes the data types for Gall defined in `lull.hoon`.


## `bitt` {#bitt}

Incoming subscriptions.

```hoon
+$  bitt  (map duct (pair ship path))
```

This is the structure Gall uses to keep track of incoming subscriptions for a Gall agent. The `sup` field of a [`bowl`](#bowl) contains the `bitt` for our agent.

---

## `boat` {#boat}

Outgoing subscriptions.

```hoon
+$  boat  (map [=wire =ship =term] [acked=? =path])
```

This is the structure Gall uses to keep track of subscriptions our agent has initiated. The `wex` field of a [`bowl`](#bowl) contails the `boat` for that agent.

The `wire` field is the `wire` which [`sign:agent`](#signagent)s will come in on. The `ship` and `term` fields are the ship and the name of the agent to which our agent has subscribed.

The `acked` field is `%.y` if they have acknowledged our subscription request with a `%watch-ack`, and `%.n` if they have not. The `path` field is the `path` on the other agent to which our agent has subscribed.

---

## `boar` {#boar}

Subscription nonces.

```hoon
+$  boar  (map [=wire =ship =term] nonce=@)
```

Gall uses this to keep track of nonces for subscriptions.

---

## `fans` {#fans}

Revisions for a remote scry file published at a particular path.

```hoon
+$  fans  ((mop @ud (pair @da (each page @uvI))) lte)
```

The `mop` is organized by file revision number. Each value includes the date-time of the entry, and then either the file as a `page` or just the `@uvI` hash of the file if it has been tombstoned.

---

## `bowl` {#bowl}

Additional agent state.

```hoon
+$  bowl                                              ::  standard app state
  $:  $:  our=ship                                    ::  host
          src=ship                                    ::  guest
          dap=term                                    ::  agent
          sap=path                                    ::  provenance
      ==                                              ::
      $:  wex=boat                                    ::  outgoing subs
          sup=bitt                                    ::  incoming subs
          sky=(map path fans)                         ::  scry bindings
      ==                                              ::
      $:  act=@ud                                     ::  change number
          eny=@uvJ                                    ::  entropy
          now=@da                                     ::  current time
          byk=beak                                    ::  load source
  ==  ==                                              ::
```

A `bowl` is given to the agent core each time an event comes in. The fields are as follows:

- `our`: Our ship.
- `src`: The ship from which the current request originated.
- `dap`: The name of our agent.
- `wex`: Outgoing subscriptions. That is, subscriptions our agent has initiated. See the [`boat`](#boat) section for details of the type.
- `sup`: Incoming subscriptions. That is, subscriptions others have made to our agent. See the [`bitt`](#bitt) section for details of the type.
- `sky`: Remote scry bindings. A map from binding paths to a [`fans`](#fans), an ordered map of files by revision number. Tombstoned files have an `@uvI` hash rather than `page`.
- `act`: The total number of [`move`](../../../hoon/arvo.md#move)s our agent has processed so far.
- `eny`: 512 bits of entropy.
- `now`: The current date-time.
- `byk`: The ship, desk and `case` in Clay from which this agent was loaded. The `case` will be `[%da @da]` where the `@da` is the when the agent was loaded. A `beak` is a triple of `[ship desk case]`.

---

## `dude` {#dude}

Agent name.

```hoon
+$  dude  term
```

---

## `gill` {#gill}

A general contact.

```hoon
+$  gill  (pair ship term)
```

A pair of the ship and agent name.

---

## `load` {#load}

Loadout.

```hoon
+$  load  (list [=dude =beak =agent])
```

The [`dude`](#dude) is the agent name, the `beak` is the ship/desk/case in which it resides, and the [`agent`](#agent) is the built agent itself. Clay passes this to Gall when it builds or modifies the state of running agents.

---

## `scar` {#scar}

Opaque duct - used internally.

```hoon
+$  scar
  $:  p=@ud
      q=(map duct bone)
      r=(map bone duct)
  ==
```

---

## `suss` {#suss}

Configuration report.

```hoon
+$  suss  (trel dude @tas @da)
```

---

## `well` {#well}

Desk and agent.

```hoon
+$  well  (pair desk term)
```

## `deal` {#deal}

An agent task or raw poke.

```hoon
+$  deal
  $%  [%raw-poke =mark =noun]
      task:agent
  ==
```

The additional `%raw-poke` is for pokes which haven't yet been converted to an ordinary `%poke` by molding the `noun` with the specified `mark` core. This structure is passed around on the kernel level, it would not be used in userspace.

---

## `unto` {#unto}

An agent gift or a raw fact.

```hoon
+$  unto
  $%  [%raw-fact =mark =noun]
      sign:agent
  ==
```

The additional `%raw-fact` is for facts which haven't yet been converted to an ordinary `%fact` by molding the `noun` it with the specified `mark` core. This structure is passed around on the kernel level, it would not be used in userspace.

---

## `verb` {#verb}

Verbosity flags.

```hoon
+$  verb  ?(%odd)
```

Flags to set Gall verbosity. Currently only `%odd` for unusual errors.

---

## `coop` {#coop}

Verbosity flags.

```hoon
+$  coop  spur
```

A security context for remote scries.

---

## `agent` {#agent}

```hoon
++  agent
  =<  form
  |%
```

Container for Gall agent types. The most significant arm is [`form:agent`](#formagent), which specifies the structure of the agent itself. There are also some additional structures defined here, mostly defining the kinds of messages agents can send. The different arms of the core in `agent` are considered separately below.

### `step:agent` {#stepagent}

```hoon
+$  step  (quip card form)
```

A cell of [`card:agent`](#cardagent)s to be sent and a new agent state. This is the type returned by most arms of an agent. A `(quip a b)` is the same as `[(list a) b]`, it's just a more convenient way to specify it.

---

### `card:agent` {#cardagent}

```hoon
+$  card  (wind note gift)
```

An effect - typically a message to be sent to another agent or vane. A list of these are returned by most agent arms along with a new state in a [`step:agent`](#stepagent). A `wind` is the following:

```hoon
++  wind
  |$  [a b]
  $%  [%pass p=path q=a]
      [%slip p=a]
      [%give p=b]
  ==
```

Gall will not allow a `%slip`, so in practice a `card` will be one of:

- `[%pass path note]`
- `[%give gift]`

For `%pass`, `p` specifies the `wire` on which a response should be returned. See [`note:agent`](#noteagent) and [`gift:agent`](#giftagent) below for details of their types.

---

### `note:agent` {#noteagent}

```hoon
+$  note
  $%  [%agent [=ship name=term] =task]
      [%arvo note-arvo]
      [%pyre =tang]
  ::
      [%grow =spur =page]
      [%tomb =case =spur]
      [%cull =case =spur]
  ==
```

The type for messages initiated by our agent. This is opposed to [`gift:agent`](#giftagent), which is the type for responding to other agents or vanes, or for sending out updates to subscribers. The three cases are:

- `%agent`: Poke another agent, subscribe to another agent, or cancel a subscription to another agent. The `ship` and `name` fields are the ship and agent to which the `task` should be sent. The `task` is the request itself, see [`task:agent`](#taskagent) below for its possible types.
- `%arvo`: Pass a `task` to a vane. The type of a `note-arvo` is:
  ```hoon
  +$  note-arvo
    $~  [%b %wake ~]
    $%  [%a task:ames]
        [%b task:behn]
        [%c task:clay]
        [%d task:dill]
        [%e task:eyre]
        [%g task:gall]
        [%i task:iris]
        [%j task:jael]
        [%k task:khan]
        [%$ %whiz ~]
        [@tas %meta vase]
    ==
  ```
  You can refer to the `/sys/lull.hoon` source code for all the possible vane tasks, or see each vane's API Reference section in the [Arvo documentation](../arvo)
- `%pyre`: This is for aborting side-effects initiated during agent installation. The `tang` is an error message.
- `%grow`/`%tomb`/`%cull`: These are used for publishing and managing data available for remote scries. For more information, see the [remote scries guide](../../../build-on-urbit/userspace/remote-scry.md).

A `note:agent` is always wrapped in a `%pass` [`card:agent`](#cardagent).

---

### `task:agent` {#taskagent}

The types of messages initiated by our agent and sent to another agent.

```hoon
+$  task
  $%  [%watch =path]
      [%watch-as =mark =path]
      [%leave ~]
      [%poke =cage]
      [%poke-as =mark =cage]
  ==
```

This is in contrast to [`gift:agent`](#giftagent)s, which are responses to incoming messages from agents or updates to agents already subscribed. The five kinds of `task:agent` are:

- `%watch`: Subscribe to `path` on the target ship and agent.
- `%watch-as`: Same as `%watch`, except you ask the target's Gall to convert subscription updates to the `mark` you specified rather than just giving you the `mark` produced by the agent.
- `%leave`: Cancel subscription. The particular subscription to cancel will be determined by the `wire` given in the `p` field of the containing `%pass` [`card:agent`](#cardagent).
- `%poke`: Poke the target ship and agent with the given `cage`, which is a pair of `[mark vase]`.
- `%poke-as`: Same as `%poke`, except the `cage` will be converted to the specified `mark` before sending.

A `task:agent` is always wrapped in a `%pass` [`card:agent`](#cardagent).

---

### `gift:agent` {#giftagent}

The types of messages our agent can either send in response to messages from other agents, or send to subscribed agents.

```hoon
+$  gift
  $%  [%fact paths=(list path) =cage]
      [%kick paths=(list path) ship=(unit ship)]
      [%watch-ack p=(unit tang)]
      [%poke-ack p=(unit tang)]
  ==
```

This is in contrast to [`task:agent`](#taskagent)s, which are messages to other agents our agent initiates rather than sends in response. The four kinds of `gift:agent` are:

- `%fact`: An update to existing subscribers. The `paths` field specifies which subscription paths the update should go out to. The `cage` is the data, and is a `[mark vase]`.
- `%kick`: Kick subscriber, ending their subscription. The `paths` field specifies which paths the subscriber should be kicked from, and the `ship` field specifies the ship to kick. If the `ship` field is null, all subscribers on the specified paths are kicked. Gall will automatically remove the subscription from our agent's [`bitt`](#bitt) (inbound subscription `map`), and subscriber will no longer receive updates on the `path`s in question.
- `%watch-ack`: Acknowledge a subscription request. If `p` is null, it's an ack (positive acknowledgement), and if `p` is non-null, it's a nack (negative acknowledgement). Simply crashing will caused Gall to nack a subscription request, and not crashing but not explicitly producing a `%watch-ack` `gift` will cause Gall to ack a subscription request. Therefore, you'd typically only explicitly produce a `%watch-ack` `gift` if you wanted to nack a subscription request with a custom error in the `tang`.
- `%poke-ack`: Acknowledge a poke. If `p` is null, it's an ack, and if `p` is non-null, it's a nack. Simply crashing will cause Gall to nack a poke, and not crashing but not explicitly producing a `%poke-ack` `gift` will cause Gall to ack a poke. Therefore, you'd typically only explicitly produce a `%poke-ack` `gift` if you wanted to nack a poke with a custom error in the `tang`.

A `gift:agent` is always wrapped in a `%give` [`card:agent`](#cardagent).

---

### `sign:agent` {#signagent}

A `sign` is like a [`gift:agent`](#giftagent) but it's something that comes _in_ to our agent from another agent rather than something we send out.

```hoon
+$  sign
  $%  [%poke-ack p=(unit tang)]
      [%watch-ack p=(unit tang)]
      [%fact =cage]
      [%kick ~]
  ==
```

The possible types are:

- `%poke-ack`: Another agent has acked (positively acknowledged) or nacked (negatively acknowledged) a `%poke` [`task:agent`](#taskagent) we previously sent. It's an ack if `p` is null and a nack if `p` is non-null. The `tang` contains an error or traceback if it's a nack.
- `%watch-ack`: Another agent has acked or nacked a `%watch` [`task:agent`](#taskagent) (subscription request) we previously sent. It's an ack if `p` is null and a nack if `p` is non-null. The `tang` contains an error or traceback if it's a nack. If it's a nack, Gall will automatically remove the subscription from our agent's [`boat`](#boat) (outbound subscription map).
- `%fact`: An update from another agent to which we've previously subscribed with a `%watch` [`task:agent`](#taskagent) (subscription request). The `cage` contains the data, and is a `[mark vase]`.
- `%kick`: Our subscription to another agent has been ended, and we'll no longer receive updates. A `%kick` may be intentional, but it may also happen due to certain network conditions or other factors. As a result, it's best to try and resubscribe with another `%watch` [`task:agent`](#taskagent), and if they nack the `%watch`, we can conclude it was intentional and give up.

---

### `form:agent` {#formagent}

This defines the structure of the agent itself.

```hoon
++  form
  $_  ^|
  |_  bowl
  ++  on-init
    *(quip card _^|(..on-init))
  ::
  ++  on-save
    *vase
  ::
  ++  on-load
    |~  old-state=vase
    *(quip card _^|(..on-init))
  ::
  ++  on-poke
    |~  [mark vase]
    *(quip card _^|(..on-init))
  ::
  ++  on-watch
    |~  path
    *(quip card _^|(..on-init))
  ::
  ++  on-leave
    |~  path
    *(quip card _^|(..on-init))
  ::
  ++  on-peek
    |~  path
    *(unit (unit cage))
  ::
  ++  on-agent
    |~  [wire sign]
    *(quip card _^|(..on-init))
  ::
  ++  on-arvo
    |~  [wire sign-arvo]
    *(quip card _^|(..on-init))
  ::
  ++  on-fail
    |~  [term tang]
    *(quip card _^|(..on-init))
  --
--
```

The agent is a door with a [`bowl`](#bowl) as its sample and exactly ten arms. Below we'll describe each arm briefly.

#### `on-init`

- Accepts: Nothing.
- Produces: [`step:agent`](#stepagent)

This arm is called when the agent is initially installed.

#### `on-poke`

- Accepts: `cage`
- Produces: [`step:agent`](#stepagent)

This arm is called when another agent pokes our agent.

#### `on-watch`

- Accepts: `path`
- Produces: [`step:agent`](#stepagent)

This arm is called when another agent subscribes to our agent.

#### `on-leave`

- Accepts: `path`
- Produces: [`step:agent`](#stepagent)

This arm is called when another agent unsubscribes from a subscription path on our agent.

#### `on-peek`

- Accepts: `path`
- Produces: `(unit (unit cage))`

This arm is called when a [scry](../arvo/scry.md) is performed on our agent.

#### `on-agent`

- Accepts: `[wire sign:agent]`
- Produces: [`step:agent`](#stepagent)

This arm is called when another agent give our agent a [`sign:agent`](#signagent).

#### `on-arvo`

- Accepts: `[wire sign-arvo]`
- Produces: [`step:agent`](#stepagent)

This arm is called when a vane gives our agent a `gift`. A `sign-arvo` is:

```hoon
+$  sign-arvo
  $%  [%ames gift:ames]
      $:  %behn
          $%  gift:behn
              $>(%wris gift:clay)
              $>(%writ gift:clay)
              $>(%mere gift:clay)
              $>(%unto gift:gall)
          ==
      ==
      [%clay gift:clay]
      [%dill gift:dill]
      [%eyre gift:eyre]
      [%gall gift:gall]
      [%iris gift:iris]
      [%jael gift:jael]
      [%khan gift:khan]
  ==
```

You can refer to the `/sys/lull.hoon` source code, or the API Reference of each vane in the [Arvo documentation](../arvo).

#### `on-fail`

- Accepts: `[term tang]`
- Produces: [`step:agent`](#stepagent)

This arm is called if certain errors occur in Gall, such as if our agent tries to create a duplicate subscription.

---
