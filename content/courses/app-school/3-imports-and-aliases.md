# 3. Imports and Aliases

In the last lesson we looked at the most basic aspects of a Gall agent's structure. Before we get into the different agent arms in detail, there's some boilerplate to cover that makes life easier when writing Gall agents.

## Useful libraries {#useful-libraries}

There are a couple of libraries that you'll very likely use in every agent you write. These are [`/lib/default-agent.hoon`](#default-agent) and [`/lib/dbug.hoon`](#dbug). In brief, `/lib/default-agent.hoon` provides simple default behaviours for each agent arm, and `/lib/dbug.hoon` lets you inspect the state and bowl of an agent from the dojo, for debugging purposes. Every example agent we look at from here on out will make use of both libraries.

Let's look at each in more detail:

### `/lib/default-agent.hoon` {#default-agent}

The default-agent library contains a basic agent with sane default behaviours for each arm. In some cases it just crashes and prints an error message to the terminal, and in others it succeeds but does nothing. It has two primary uses:

- For any agent arms you don't need, you can just have them call the matching function in `/lib/default-agent.hoon`, rather than having to manually handle events on those arms.
- A common pattern in an agent is to switch on the input of an arm with [wutlus](../../hoon/reference/rune/wut.md#wutlus) (`?+`) runes or maybe [wutcol](../../hoon/reference/rune/wut.md#wutcol) (`?:`) runes. For any unexpected input, you can just pass it to the relevant arm of default-agent rather than handling it manually.

The default-agent library lives in `/lib/default-agent/hoon` of the `%base` desk, and you would typically include a copy in any new desk you created. It's imported at the beginning of an agent with the [faslus](../../hoon/reference/rune/fas.md#faslus) (`/+`) rune.

The library is a wet gate which takes two arguments: `agent` and `help`. The first is your agent core itself, and the second is a `?`. If `help` is `%.y` (equivalently, `%&`), it will crash in all cases. If `help` is `%.n` (equivalently, `%|`), it will use its defaults. You would almost always have `help` as `%.n`.

The wet gate returns an `+agent:gall` door with a sample of `$bowl:gall` - a typical agent core. Usually you would define an alias for it in a virtual arm ([explained below](#virtual-arms)) so it's simple to call.

### `/lib/dbug.hoon` {#dbug}

The dbug library lets you inspect the state and `$bowl` of your agent from the dojo. It includes an `+agent:dbug` function which wraps your whole `+agent:gall` door, adding its extra debugging functionality while transparently passing events to your agent for handling like usual.

To use it, you just import `/lib/dbug.hoon` with a [faslus](../../hoon/reference/rune/fas.md#faslus) (`/+`) rune at the beginning, then add the following line directly before the door of your agent:

```hoon
%-  agent:dbug
```

With that done, you can poke your agent with the `+dbug` generator from the Dojo and it will pretty-print its state, like:

```
> :your-agent +dbug
```

The generator also has a few useful optional arguments:

- `%bowl`: Print the agent's bowl.
- `[%state 'some code']`: Evaluate some code with the agent's state as its subject and print the result. The most common case is `[%state %some-face]`, which will print the contents of the wing with the given face.
- `[%incoming ...]`: Print details of the matching incoming subscription, one of:
  - `[%incoming %ship ~some-ship]`
  - `[%incoming %path /part/of/path]`
  - `[%incoming %wire /part/of/wire]`
- `[%outgoing ...]`: Print details of the matching outgoing subscription, one of:
  - `[%outgoing %ship ~some-ship]`
  - `[%outgoing %path /part/of/path]`
  - `[%outgoing %wire /part/of/wire]`
  - `[outgoing %term %agent-name]`

By default it will retrieve your agent's state by using its `+on-save` arm, but if your app implements a scry endpoint with a path of `/x/dbug/state`, it will use that instead.

We haven't yet covered some of the concepts described here, so don't worry if you don't fully understand `/lib/dbug.hoon`'s functionality - you can refer back here later.

## Virtual arms {#virtual-arms}

An agent core must have exactly ten arms. However, there's a special kind of "virtual arm" that can be added without actually increasing the core's arm count, since it really just adds code to the other arms in the core. A virtual arm is created with the [lustar](../../hoon/reference/rune/lus.md#lustar) (`+*`) rune, and its purpose is to define "deferred expressions". It takes a list of pairs of names and Hoon expressions. When compiled, the deferred expressions defined in the virtual arm are implicitly inserted at the beginning of every other arm of the core, so they all have access to them. Each time a name in a `+*` is called, the associated Hoon is evaluated in its place, similar to lazy evaluation except it is re-evaluated whenever needed. See the [tistar](../../hoon/reference/rune/tis.md#tistar) reference for more information on deferred expressions.

A virtual arm in an agent often looks something like this:

```hoon
+*  this  .
    def   ~(. (default-agent this %.n) bowl)
```

`.this` and `.def` are the deferred expressions, and next to each one is the Hoon expression it evaluates whenever called. Notice that unlike most things that take _n_ arguments, a virtual arm is not terminated with a `==`. You can define as many aliases as you like. The two in this example are conventional ones you'd use in most agents you write. Their purposes are:

```hoon
this  .
```

Rather than having to return `+on-init` like we did in the last lesson, instead our arms can just refer to `.this` whenever modifying or returning the agent core.

```hoon
def  ~(. (default-agent this %.n) bowl)
```

This sets up the default-agent library we [described above](#default-agent), so you can easily call its arms like `+on-poke:def`, `+on-agent:def`, etc.

## Additional cores {#additional-cores}

While Gall expects a single 10-arm agent core, it's possible to include additional cores by composing them into the subject of the agent core itself. The contents of these cores will then be available to arms of the agent core.

Usually to compose cores in this way, you'd have to do something like insert [tisgar](../../hoon/reference/rune/tis.md#tisgar) (`=>`) runes in between them. However, Clay's build system implicitly composes everything in a file by wrapping it in a [tissig](../../hoon/reference/rune/tis.md#tissig) (`=~`) expression, which means you can just butt separate cores up against one another and they'll all still get composed.

You can add as many extra cores as you'd like before the agent core, but typically you'd just add one containing type definitions for the agent's state, as well as any other useful structures. We'll look at the state in more detail in the next lesson.

## Example {#example}

Here's the `/app/skeleton.hoon` dummy agent from the previous lesson, modified with the concepts discussed here:

<details>
<summary>/app/skeleton (modified)</summary>

```hoon
/+  default-agent, dbug
|%
+$  card  card:agent:gall
--
%-  agent:dbug
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %.n) bowl)
++  on-init
  ^-  (quip card _this)
  `this
++  on-save   on-save:def
++  on-load   on-load:def
++  on-poke   on-poke:def
++  on-watch  on-watch:def
++  on-leave  on-leave:def
++  on-peek   on-peek:def
++  on-agent  on-agent:def
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
```

</details>

The first line uses the faslus (`/+`) Ford rune to import `/lib/default-agent.hoon` and `/lib/dbug.hoon`, building them and loading them into the subject of our agent so they're available for use. You can read more about Ford runes in the [Fas section of the rune documentation](../../hoon/reference/rune/fas.md).

Next, we've added an extra core. Notice how it's not explicitly composed, since the build system will do that for us. In this case we've just added a single `$card` arm, which makes it simpler to reference the `$card:agent:gall` type.

After that core, we call `+agent:dbug` with our whole agent core as its argument. This allows us to use the `/lib/dbug.hoon` features described earlier.

Inside our agent door, we've added an extra virtual arm and defined a couple deferred expressions:

```hoon
+*  this  .
    def   ~(. (default-agent this %.n) bowl)
```

In most of the arms, you see we've been able to replace the dummy code with simple calls to the corresponding arms of default-agent, which we set up as a deferred expression named `.def` in the virtual arm. We've also replaced the old `..on-init` with our deferred expression named `.this` in the `+on-init` arm as an example - it makes things a bit simpler.

You can save the code above in `/app/skeleton.hoon` of your `%base` desk like before and `|commit %base` in the dojo. Additionally, you can start the agent so we can try out `+dbug`. To start it, run the following in the dojo:

```
> |rein %base [& %skeleton]
```

For details of using the `|rein` generator, see the [Dojo Tools](../../manual/os/dojo-tools.md#rein) documentation.

Now our agent should be running, so let's try out `+dbug`. In the dojo, let's try poking our agent with the `+dbug` generator:

```
>   ~
> :skeleton +dbug
>=
```

It just printed out `~`. Our dummy `%skeleton` agent doesn't have any state defined, so it's printing out null as a result. Let's try printing the `$bowl` instead:

```
>   [ [our=~zod src=~zod dap=%skeleton sap=/gall/dojo]
  [wex=~ sup=~ sky=~]
  act=5
    eny
  0v209.tg795.bc2e8.uja0d.11eq9.qp3b3.mlttd.gmf09.q7ro3.6unfh.16jiu.m9lh9.6jlt8.4f847.f0qfh.up08t.3h4l2.qm39h.r3qdd.k1r11.bja8l
  now=~2024.5.9..13.28.24..e20e
  byk=[p=~zod q=%base r=[%da p=~2024.5.9..12.02.22..f99b]]
]
> :skeleton +dbug %bowl
>=
```

We'll use `+dbug` more throughout the guide, but hopefully you should now have an idea of its basic usage.

## Summary {#summary}

The key takeaways are:

- Libraries are imported with `/+`.
- `/lib/default-agent.hoon` is a library that provides default behaviors for Gall agent arms.
- `/lib/dbug.hoon` is a library that lets you inspect the state and `$bowl` of an agent from the dojo, with the `+dbug` generator.
- Convenient deferred expressions for Hoon expressions can be defined in a virtual arm with the [lustar](../../hoon/reference/rune/lus.md#lustar) (`+*`) rune.
- `.this` is a conventional deferred expression name for the agent core itself.
- `.def` is a conventional deferred expression name for accessing arms in the `/lib/default-agent.hoon` library.
- Extra cores can be composed into the subject of the agent core. The composition is done implicitly by the build system. Typically we'd include one extra core that defines types for our agent's state and maybe other useful types as well.

## Exercises {#exercises}

- Run through the [example](#example) yourself on a fake ship if you've not done so already.
- Have a read through the [Ford rune documentation](../../hoon/reference/rune/fas.md) for details about importing libraries, structures and other things.
- Try the `+dbug` generator out on some other agents, like `:settings +dbug`, `:contacts +dbug`, etc, and try some of its options [described above](#dbug).
- Have a quick look over the source of the `/lib/default-agent.hoon` library, located at `/lib/default-agent.hoon` in the `%base` desk. We've not yet covered what the different arms do but it's still useful to get a general idea, and you'll likely want to refer back to it later.
