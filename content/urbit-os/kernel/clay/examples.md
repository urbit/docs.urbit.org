---
description: "Clay filesystem examples - reading files, tracking changes, managing desks, merging, and filesystem operations."
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

# Clay Examples

This document contains a number of examples of interacting with Clay using its various tasks. Sections correspond to the general details in the [API Reference](tasks.md) document.

Most examples will either use `|pass` to just send a task or the following thread to send a task and take the resulting gift. You can save the following thread to the `/ted` directory of the `%base` desk on a fake ship:

`send-task-take-gift.hoon`

```hoon
/-  spider
/+  strandio
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
=/  uarg  !<  (unit task:clay)  arg
?~  uarg
  (strand-fail:strand %no-arg ~)
=/  =task:clay  u.uarg
=/  =card:agent:gall  [%pass /foo %arvo %c task]
;<  ~  bind:m  (send-raw-card:strandio card)
;<  res=[wire sign-arvo]  bind:m  take-sign-arvo:strandio
~&  +>:res
(pure:m !>(~))
```

## `%warp` {#warp}

See the [Read and Subscribe](tasks.md#warp---read-and-track) section of the [API Reference](tasks.md) document for general details.

### `%sing` {#sing}

Here we'll look at reading files by passing Clay a `%warp` task with a `%sing` `$rave` and receiving a `%writ` gift containing the data in response.

Using the `send-task-take-gift.hoon` thread, let's try reading `gen/hood/hi.hoon`:

```
> -send-task-take-gift [%warp our %base ~ %sing %x da+now /gen/hood/hi/hoon]
```

You should see something like this as the output:

```
[ %writ
    p
  [ ~
    [ p=[p=%x q=[%da p=~2021.5.20..23.37.50..e79b] r=%base]
      q=/gen/hood/hi/hoon
        r
      [ p=%hoon
          q
        [ #t/@
            q
          3.548.750.706.400.251.607.252.023.288.575.526.190.856.734.474.077.821.289.791.377.301.707.878.697.553.411.219.689.905.949.957.893.633.811.025.757.107.990.477.902.858.170.125.439.223.250.551.937.540.468.638.902.955.378.837.954.792.031.592.462.617.422.136.386.332.469.076.584.061.249.923.938.374.214.925.312.954.606.277.212.923.859.309.330.556.730.410.200.952.056.760.727.611.447.500.996.168.035.027.753.417.869.213.425.113.257.514.474.700.810.203.348.784.547.006.707.150.406.298.809.062.567.217.447.347.357.039.994.339.342.906
        ]
      ]
    ]
  ]
]
```

The `$cage` in the `$riot` of the `%writ` contains the file's data due to our use of an `%x` `$care`. It needn't be `%x` though. If we change it to `%u`, for example, we'll get a `?` `$cage` instead:

```
> -send-task-take-gift [%warp our %base ~ %sing %u da+now /gen/hood/hi/hoon]
[ %writ
    p
  [ ~
    [ p=[p=%u q=[%da p=~2021.5.20..23.42.21..bb33] r=%base]
      q=/gen/hood/hi/hoon
      r=[p=%flag q=[#t/?(%.y %.n) q=0]]
    ]
  ]
]
```

Here's a breakdown of the task we sent:

![](https://media.urbit.org/docs/arvo/clay/sing.png "%sing diagram")

### `%next` {#next}

Here we'll look at subscribing to the next version of a file by passing Clay a `%warp` task with a `%next` `$rave` and receiving a `%writ` gift when the file changes.

Using the `send-task-take-gift.hoon` thread, let's subscribe to the next version of `foo.txt`:

```
> -send-task-take-gift [%warp our %base ~ %next %x da+now /foo/txt]
```

Now, in unix, create a file called `foo.txt` in the root of the `$base` directory of your ship. In the dojo, hit backspace to disconnect the thread from the dojo prompt and run `|commit %base`. You should see something like:

```
> |commit %base
>=
[%writ p=[~ [p=[p=%x q=[%ud p=3] r=%base] q=/foo/txt r=[p=%txt q=[#t/*'' q=0]]]]]
+ /~zod/base/3/foo/txt
```

As you can see, the `$riot` in the `%writ` includes a `$cage` with the data of `/foo/txt` due to our use of an `%x` `$care`.

Now run the thread again, and this time delete the file in unix and again `|commit %base` in the dojo. You should see:

```
> |commit %base
>=
[%writ p=~]
- /~zod/base/4/foo/txt
```

You can see the `$riot` is just `~` due to the file being deleted.

Here's a breakdown of the task we sent:

![](https://media.urbit.org/docs/arvo/clay/next.png "%next diagram")

### `%mult` {#mult}

Here we'll look at subscribing to the next version of multiple files by passing Clay a `%warp` task with a `%mult` `$rave` and receiving a `%wris` gift when any of the files change.

This thread will subscribe to `/foo/txt` with an `%x` `$care` and `/bar/txt` with a `%u` `$care`. It will print out the `%wris` it gets back from Clay.

`sub-mult.hoon`

```hoon
/-  spider
/+  strandio
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
=/  files=(set (pair care:clay path))
  %-  sy  :~
            [%x /foo/txt]
            [%u /bar/txt]
          ==
;<  =bowl:strand  bind:m  get-bowl:strandio
=/  =task:clay  [%warp our.bowl %base ~ %mult da+now.bowl files]
=/  =card:agent:gall  [%pass /mult %arvo %c task]
;<  ~  bind:m  (send-raw-card:strandio card)
;<  response=(pair wire sign-arvo)  bind:m  take-sign-arvo:strandio
~&  +.q.response
(pure:m !>(~))
```

Save the above to `ted/sub-mult.hoon`, `|commit %base` and run with `-sub-mult`. Now, create `foo.txt` and `bar.txt` in your base directory, hit backspace in the dojo to disconnect the thread and run `|commit %base`. You should see something like:

```
> |commit %base
>=
[%wris p=[%da p=~2021.4.27..06.07.08..5ec4] q={[p=%u q=/bar/txt] [p=%x q=/foo/txt]}]
+ /~zod/base/151/foo/txt
+ /~zod/base/151/bar/txt
```

You'll notice that, unlike a `%writ`, the `%wris` doesn't give you the data. It merely tells you the `$care`s and `$path`s of the files that changed. If you need to actually get the data, you can just scry or send a request for the files in question.

Now, run the thread again, open `bar.txt` in an editor, modify its contents, save it and `|commit %base`. You'll notice you didn't receive a `%wris`. This is because we subscribed to `/bar/txt` with `%u` care and its existence didn't change.

Lastly, delete `foo.txt` and `|commit %base`. You should see something like:

```
> |commit %base
>=
[%wris p=[%da p=~2021.4.27..06.15.03..0da4] q={[p=%x q=/foo/txt]}]
- /~zod/base/153/foo/txt
```

As you can see, a relevant change to any of the subscribed files will trigger a response, not just when all of them change.

Here's a breakdown of the task we sent:

![](https://media.urbit.org/docs/arvo/clay/sub-mult.png "subscribe mult diagram")

### `%many` {#many}

Here we'll look at subscribing to a range of changes to a desk by passing Clay a `%warp` task with a `%many` `$rave` and receiving `%writ` gifts when changes occur.

This thread will subscribe to changes to your `%base` desk for the next three minutes. The `track` is `%.y` so it will only inform you of changes, not send the full `$nako`. It will only get updates if the specified file exists. It contains a `main-loop` that will take an arbitrary number of `$sign`s and print them out in the dojo. Since it never ends, you'll need to stop it with the `:spider|kill` command in the dojo.

`sub-many.hoon`

```hoon
/-  spider
/+  strandio
=,  strand=strand:spider
|%
++  take-sign-loop
  =/  m  (strand ,~)
  ^-  form:m
  %-  (main-loop:strandio ,~)
  :~  |=  ~
      ^-  form:m
      ;<    res=(pair wire sign-arvo)
          bind:m
        ((handle:strandio ,(pair wire sign-arvo)) take-sign-arvo:strandio)
      ~&  res
      (pure:m ~)
  ==
--
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
=/  uarg  !<  (unit path)  arg
?~  uarg
  (strand-fail:strand %no-arg ~)
=/  =path  u.uarg
;<  =bowl:strand  bind:m  get-bowl:strandio
=/  =task:clay  [%warp our.bowl %base ~ %many %.y da+now.bowl da+(add ~m3 now.bowl) path]
=/  =card:agent:gall  [%pass /many %arvo %c task]
;<  ~  bind:m  (send-raw-card:strandio card)
;<  ~  bind:m  take-sign-loop
(pure:m !>(~))
```

Make sure `foo.txt` doesn't exist in the root of your `%base` desk. Save this to `ted/sub-many.hoon`, `|commit %base`, run it like `-sub-many /foo/txt`, and hit backspace in the dojo to free up the dojo prompt. Now, add a file called `bar.txt` to your desk and `|commit %base`. You should see something like:

```
> |commit %base
>=
+ /~zod/base/260/bar/txt
```

Notice you've received no `%writ` from Clay. This is because `/foo/txt` doesn't exist. Now, create `foo.txt` and `|commit %base` again. You should see:

```
> |commit %base
>=
[ p=/many
  q=[%clay [%writ p=[~ [p=[p=%w q=[%ud p=261] r=%base] q=/ r=[p=%null q=[#t/@n q=0]]]]]]
]
+ /~zod/base/261/foo/txt
```

Now that `/foo/txt` exists it will inform you of updates. Note that if you delete `/foo/txt` again it will again stop sending updates.

Now try adding `baz.txt`:

```
> |commit %base
>=
[ p=/many
  q=[%clay [%writ p=[~ [p=[p=%w q=[%ud p=262] r=%base] q=/ r=[p=%null q=[#t/@n q=0]]]]]]
]
+ /~zod/base/262/baz/txt
```

Now wait until the three minutes is up and try making a change, for example deleting `baz.txt`:

```
> |commit %base
>=
[ p=/many
  q=[%clay [%writ p=[~ [p=[p=%w q=[%ud p=264] r=%base] q=/ r=[p=%null q=[#t/@n q=0]]]]]]
]
[p=/many q=[%clay [%writ p=~]]]
- /~zod/base/263/baz/txt
```

You can see that along with the normal `%writ` it's also sent a second `%writ` with a null `$riot` to indicate the subscription has ended. This is because it has now passed the end of the range of `$case`s to which you subscribed.

Run `:spider|kill` to stop the thread.

Here's a breakdown of the task we sent:

![](https://media.urbit.org/docs/arvo/clay/sub-many.png "subscribe many diagram")

### Cancel Subscription {#cancel-subscription}

Here we'll look at cancelling a subscription by sending Clay a `%warp` task with a null `(unit rave)` in the `$riff`.

This thread will subscribe to the `%next` version of `/foo/txt`, then immediately cancel the subscription and wait for a response to print (which it will never receive).

`stop-sub.hoon`

```hoon
/-  spider
/+  strandio
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
;<  =bowl:strand  bind:m  get-bowl:strandio
=/  =task:clay  [%warp our.bowl %base ~ %next %x da+now.bowl /foo/txt]
=/  =card:agent:gall  [%pass /next %arvo %c task]
;<  ~             bind:m  (send-raw-card:strandio card)
=.  task  [%warp our.bowl %base ~]
=.  card  [%pass /next %arvo %c task]
;<  ~             bind:m  (send-raw-card:strandio card)
;<  =riot:clay    bind:m  (take-writ:strandio /next)
~&  riot
(pure:m !>(~))
```

Save the above to `/ted/stop-sub.hoon`, `|commit %base`, run it with `-stop-sub` and hit backspace to detach it from the dojo prompt. Now, add `foo.txt` to the root of your `%base` desk and `|commit %base`. You should see:

```
> |commit %base
>=
+ /~zod/base/266/foo/txt
```

As you can see we've received no `%writ`. We can thus conclude the subscription has successfully been cancelled.

Run `:spider|kill` to stop the thread.

Here's a breakdown of the task we sent:

![](https://media.urbit.org/docs/arvo/clay/stop-sub.png "cancel subscription diagram")

## `%info` {#info}

See the [Write and Modify](tasks.md#write-and-modify) section of the [API Reference](tasks.md) document for general details.

### `%ins` {#ins}

Here we'll look at adding a file by sending Clay a `%info` task containing a `%ins` `$miso`.

Let's try adding a `foo.txt` file with 'foo' as its contents:

```
> |pass [%c [%info %base %& [/foo/txt %ins %txt !>(~['foo'])]~]]
+ /~zod/base/5/foo/txt
```

If you have a look in the base of your pier you'll see there's now a file called `foo.txt` with the text `foo` in it.

We've created the `$cage` of the content like `[%txt !>(~['foo'])]`, if you want to write something besides a text file you'd just give it the appropriate `$mark` and `$vase`.

Here's a breakdown of the task we sent:

![](https://media.urbit.org/docs/arvo/clay/ins.png)

### `%del` {#del}

Here we'll look at deleting a file by sending Clay a `%info` task containing a `%del` `$miso`.

Let's try deleting the `foo.txt` file created in the [previous example](#ins):

```
> |pass [%c [%info %base %& [/foo/txt %del ~]~]]
- /~zod/base/6/foo/txt
```

If you have a look in the base of your pier you'll see the `foo.txt` file is now gone.

Here's a breakdown of the task we sent:

![](https://media.urbit.org/docs/arvo/clay/del.png)

### `%mut` {#mut}

Identical to the [%ins](#ins) example, just replace `%ins` with `%mut`.

### Multiple Changes {#multiple-changes}

Here we'll look at changing multiple files in one request by sending Clay a `%info` task containing multiple `$miso` in the `$soba`.

Since `$soba` is just a `+list` of `$miso`, you can add a bunch of `$miso` and they'll all be applied. This thread adds three files and then deletes them. Here there's only one type of `$miso` in each request but you could mix different types together too.

`multi-change.hoon`

```hoon
/-  spider
/+  strandio
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
=/  soba-a  :~  [/foo/txt %ins %txt !>(['foo' ~])]
                [/bar/txt %ins %txt !>(['bar' ~])]
                [/baz/txt %ins %txt !>(['baz' ~])]
            ==
=/  soba-b  :~  [/foo/txt %del ~]
                [/bar/txt %del ~]
                [/baz/txt %del ~]
            ==
;<  ~  bind:m  (send-raw-card:strandio [%pass /info %arvo %c %info %base %& soba-a])
;<  ~  bind:m  (send-raw-card:strandio [%pass /info %arvo %c %info %base %& soba-b])
(pure:m !>(~))
```

Save to `ted/multi-change.hoon`, `|commit %base`, and run:

```
> -multi-change
+ /~zod/base/37/foo/txt
+ /~zod/base/37/bar/txt
+ /~zod/base/37/baz/txt
- /~zod/base/38/foo/txt
- /~zod/base/38/bar/txt
- /~zod/base/38/baz/txt
```

## Manage Mounts {#manage-mounts}

See the [Manage Mounts](tasks.md#manage-mounts) section of the [API Reference](tasks.md) document for general details.

### `%boat` {#boat}

Here we'll look at requesting the list of existing mount points on a ship by sending Clay a `%boat` task and receiving a `%hill` gift.

Using the `send-task-take-gift.hoon` thread, let's make such a request:

```
> -send-task-take-gift [%boat ~]
[%hill p=~[%base]]
```

### `%mont` {#mont}

Here we'll look at mounting desks, directories and files to unix by sending Clay a `%mont` task.

Let's first try mounting our `%landscape` desk:

```
> |pass [%c [%mont %landscape [our %landscape da+now] /]]
```

If you look in your pier, you should now see a `/landscape` folder which contains the contents of that desk.

If we make a `%boat` request as detailed in the [%boat](#boat) section, we'll now see the mount point listed:

```
> -send-task-take-gift [%boat ~]
[%hill p=~[%landscape %base]]
```

Note the mount point doesn't need to match a desk, file, or directory. We can also do:

```
> |pass [%c [%mont %wibbly-wobbly [our %base da+now] /]]
```

And you'll now see that there's a `/wibbly-wobbly` folder with the contents of the `%base` desk. You'll also notice we can mount the same file or directory more than once. There's no problem having `%base` mounted to both `$base` and `/wibbly-wobbly`. The only requirement is that their mount points be unique.

Let's try mounting a subdirectory and a single folder:

```
> |pass [%c [%mont %gen [our %base da+now] /gen]]
> |pass [%c [%mont %hi [our %base da+now] /gen/hood/hi]]
```

If you look in your pier you'll now see a `/gen` folder with the contents of `/gen` and a `hi.hoon` file by itself. Notice how the file extension has been automatically added.

### `%ogre` {#ogre}

Here we'll look at unmounting desks, directories and files by sending Clay a `%ogre` task.

Let's unmount what we mounted in the [%mont](#mont) section. First we'll unmount the `%landscape` desk:

```
|pass [%c [%ogre %landscape]]
```

Our custom mount point `%wibbly-wobbly`:

```
|pass [%c [%ogre %wibbly-wobbly]]
```

And the single `hi.hoon` we previously mounted by specifying its mount point `%hi`:

```
|pass [%c [%ogre %hi]]
```

If we specify a non-existent mount point it will fail with an error printed to the dojo like:

```
> |pass [%c [%ogre %foo]]
[%not-mounted %foo]
```

If we give it an unmounted `$beam` it will not print an error but still won't work.

### `%dirk` {#dirk}

Here we'll look at committing changed files by sending Clay a `%dirk` task.

This task performs the same function as the `|commit` dojo command.

With your `%base` desk mounted, try adding a file and send a `%dirk` to commit the change:

```
> |pass [%c [%dirk %base]]
+ /~zod/base/12/foo/txt
```

Clay will print the changed files to the dojo with a leading `+`, `-` or `:` to indicate a new file, deleted file and changed file respectively.

If you have the same desk mounted to multiple points, a committed change in one mount will also update the others.

## Merge Desks {#merge-desks}

See the [Merge Desks](tasks.md#merge-desks) section of the [API Reference](tasks.md) document for general details.

### `%merg` {#merg}

Here we'll look at merging desks by sending Clay a `%merg` task and receiving a `%mere` gift in response.

First, using the `send-task-take-gift.hoon` thread, let's try creating a new desk:

```
> -send-task-take-gift [%merg %foo our %base da+now %init]
[%mere p=[%.y p={}]]
```

Now if we scry for our desks we'll see `%foo` is there:

```hoon
> .^((set desk) %cd %)
```

Next, we'll create a merge conflict and try a couple of things. Mount `%foo` with `|mount /=foo=`, then add a `foo.txt` to both desks but with different text in each and `|commit` them.

Now we'll try merging `%base` into `%foo` with a `%mate` strategy:

```
> -send-task-take-gift [%merg %foo our %base da+now %mate]
[ /foo
  [ %clay
    [ %mere
        p
      [ %.n
          p
        [ p=%mate-conflict
          q=~[[%rose p=[p="/" q="/" r=""] q=[i=[%leaf p="foo"] t=[i=[%leaf p="txt"] t=~]]]]
        ]
      ]
    ]
  ]
]
```

As you can see, the merge has failed. Let's try again with a `%meld` strategy:

```
> -send-task-take-gift [%merg %foo our %base da+now %meld]
[/foo [%clay [%mere p=[%.y p={/foo/txt}]]]]
```

Now the merge has succeeded and the `%mere` notes the file with a merge conflict. If we try with a `%only-that` strategy:

```
> -send-task-take-gift [%merg %foo our %base da+now %only-that]
[/foo [%clay [%mere p=[%.y p={}]]]]
: /~zod/foo/6/foo/txt
```

...you can see it's overwritten the `/foo/txt` in the `%foo` desk and the `%mere` now has an empty `+set`, indicating no merge conflicts.

Next, let's look at subscribing for future changes. Since the `$case` is specified explicitly in the `%merge` task, we can set it in the future:

```
> -send-task-take-gift [%merg %foo our %base da+(add ~m2 now) %only-that]
```

Now change the text in the `foo.txt` in the `%base` desk, hit backspace to detach the thread and `|commit %base`. After the two minutes pass you should see:

```
[/foo [%clay [%mere p=[%.y p={}]]]]
: /~zod/foo/7/foo/txt
```

You can also specify it by revision number or label.

## Permissions {#permissions}

See the [Permissions](tasks.md#permissions) section of the [API Reference](tasks.md) document for general details.

### `%perm` {#perm}

Here we'll look at setting permissions by sending Clay a `%perm` task.

First, let's allow `~nes` to read `/gen/hood/hi/hoon`:

```
> |pass [%c [%perm %base /gen/hood/hi/hoon %r ~ %white (sy [%.y ~nes]~)]]
```

...and we'll do a `%p` scry to see that the permission was set:

```
> .^([r=dict:clay w=dict:clay] %cp %/gen/hood/hi/hoon)
[r=[src=/gen/hood/hi/hoon rul=[mod=%white who=[p={~nes} q={}]]] w=[src=/ rul=[mod=%white who=[p={} q={}]]]]
```

You can see that `~nes` is now in the read whitelist. Next, let's try a write permission:

```
> |pass [%c [%perm %base /ted %w ~ %white (sy [%.y ~nes]~)]]
```

You can see `~nes` can now write to `/ted`:

```
> .^([r=dict:clay w=dict:clay] %cp %/ted)
[r=[src=/ rul=[mod=%white who=[p={} q={}]]] w=[src=/ted rul=[mod=%white who=[p={~nes} q={}]]]]
```

Since we've set it for the whole `/ted` directory, if we check a file inside it we'll see it also has this permission:

```
> .^([r=dict:clay w=dict:clay] %cp %/ted/aqua/ames/hoon)
[r=[src=/ rul=[mod=%white who=[p={} q={}]]] w=[src=/ted rul=[mod=%white who=[p={~nes} q={}]]]]
```

...and you'll notice that `src` tells us it's inherited the rule from `/ted`.

Now let's try setting both read and write permissions:

```
> |pass [%c [%perm %base /gen/help/hoon %rw `[%black (sy [%.y ~nes]~)] `[%white (sy [%.y ~nes]~)]]]
```

```
 .^([r=dict:clay w=dict:clay] %cp %/gen/help/hoon)
[r=[src=/gen/help/hoon rul=[mod=%black who=[p={~nes} q={}]]] w=[src=/gen/help/hoon rul=[mod=%white who=[p={~nes} q={}]]]]
```

Lastly, let's look at deleting a permission rule we've previously set. To do that, we just send a null `(unit rule)` in the `$rite`.

For example, to remove a read permission (or write if you specify `%w`):

```
> |pass [%c [%perm %base /gen/help/hoon %r ~]]
```

```
> .^([r=dict:clay w=dict:clay] %cp %/gen/help/hoon)
[r=[src=/ rul=[mod=%white who=[p={} q={}]]] w=[src=/gen/help/hoon rul=[mod=%white who=[p={~nes} q={}]]]]
```

...and to remove both read and write at the same time:

```
> |pass [%c [%perm %base /gen/help/hoon %rw ~ ~]]
```

```
> .^([r=dict:clay w=dict:clay] %cp %/gen/help/hoon)
[r=[src=/ rul=[mod=%white who=[p={} q={}]]] w=[src=/ rul=[mod=%white who=[p={} q={}]]]]
```

As you can see it's back to the default inherited from `/`.

Here's a breakdown of a `%perm` task:

![](https://media.urbit.org/docs/arvo/clay/perm-diagram.png)

### `%cred` {#cred}

Here we'll look at creating a permission group by sending Clay a `%cred` task.

Let's create a group called `'foo'` with a few ships:

```
|pass [%c [%crew 'foo' (sy ~[~zod ~nec ~bud ~wes ~sev])]]
```

We'll check it with the next kind of task: [`%crew`](#crew).

### `%crew` {#crew}

Here we'll look at retrieving permission groups by sending Clay a `%crew` task and receiving a `%cruz` gift in response.

Let's check, using the `send-task-take-gift.hoon` thread, for the permission group created in the [`%cred`](#cred) example:

```
> -send-task-take-gift [%crew ~]
[%cruz cez={[p=~.foo q={~nec ~bud ~wes ~zod ~sev}]}]
```

### `%crow` {#crow}

Here we'll look at retrieving a list of all files and directories in all desks which have permissions set for a group by sending Clay a `%crow` task and receiving a `%croz` gift in response.

First we'll set a couple of permissions for the `foo` group we created in the [`%cred`](#cred) section:

```
> |pass [%c [%perm %base /gen/hood/hi/hoon %w ~ %white (sy [%.n 'foo']~)]]
> |pass [%c [%perm %base /ted %w ~ %white (sy [%.n 'foo']~)]]
```

Notice we use a `%.n` in the `$whom` to indicate a group rather than the `%.y` of a ship.

Now we'll use the `send-task-take-gift.hoon` thread to try `%crow`:

```
> -send-task-take-gift [%crow 'foo']
[ %croz
    rus
  { [ p=%base
        q
      [ r={}
          w
        { [p=/gen/hood/hi/hoon q=[mod=%white who={[%.n p=~.foo]}]]
          [p=/ted q=[mod=%white who={[%.n p=~.foo]}]]
        }
      ]
    ]
  }
]
```

## Foreign Ships {#foreign-ships}

See the [Foreign Ships](tasks.md#foreign-ships) section of the [API Reference](tasks.md) document for general details.

### `%warp` - Remote {#warp---remote}

Here we'll look at reading files on a foreign ship by sending Clay a `%warp` task with a foreign ship in the `wer` field and receiving a `%writ` gift in response.

We'll use a fake `~nes` as the the foreign ship and a fake `~zod` as the local ship.

First we'll set permissions on the foreign ship. Create a file called `foo.txt` in the `%base` of ~nes, then send a `%perm` request to allow ~zod to read and write the file:

```
> |pass [%c [%perm %base /foo/txt %rw `[%white (sy [%.y ~zod]~)] `[%white (sy [%.y ~zod]~)]]]
```

If we scry the file for its permissions with a `%p` `$care`, we'll see `~zod` is now whitelisted:

```
> .^([r=dict:clay w=dict:clay] %cp %/foo/txt)
[r=[src=/foo/txt rul=[mod=%white who=[p={~zod} q={}]]] w=[src=/foo/txt rul=[mod=%white who=[p={~zod} q={}]]]]
```

Back on `~zod`: Using the `send-task-take-gift.hoon` thread, send a `%x` read request for `/foo/txt` on ~nes like:

```
> -send-task-take-gift [%warp ~nes %base ~ %sing %x da+now /foo/txt]
[ %writ
    p
  [ ~
    [ p=[p=%x q=[%da p=~2021.5.3..08.24.22..9ce7] r=%base]
      q=/foo/txt
      r=[p=%txt q=[#t/txt=*'' q=[7.303.014 0]]]
    ]
  ]
]
```

As you can see, we've received a `%writ` containing the requested data just as we would with a local request. Let's try a `%u`:

```
> -send-task-take-gift [%warp ~nes %base ~ %sing %u da+now /foo/txt]
[ %writ
    p
  [ ~
    [ p=[p=%u q=[%da p=~2021.5.3..08.26.32..88cf] r=%base]
      q=/foo/txt
      r=[p=%flag q=[#t/?(%.y %.n) q=0]]
    ]
  ]
]
```

If we send a `%d` request however, it will crash:

```
> -send-task-take-gift [%warp ~nes %base ~ %sing %d da+now /foo/txt]
call: failed
/sys/vane/clay/hoon:<[4.085 3].[4.314 5]>
...
/sys/vane/clay/hoon:<[1.365 7].[1.365 51]>
[ %clay-bad-foreign-request-care
  [%sing mood=[care=%d case=[%da p=~2021.5.3..20.04.57..1092] path=/foo/txt]]
]
/sys/vane/clay/hoon:<[1.365 48].[1.365 50]>
```

### `%merg` - Remote {#merg---remote}

To merge a foreign desk into a local one, you just send Clay a `%merg` task (as you would for a local merge) and specify the foreign ship in the `her` field. For an example, see the [`%merg`](#merg) section.

The foreign ship will respond only if correct permissions have been set. See the [`%perm`](#perm) section for an example.
