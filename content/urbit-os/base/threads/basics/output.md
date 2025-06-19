---
description: "Guide to strand output including cards and response codes (%wait, %skip, %cont, %fail, %done), flow control mechanisms, error handling, and completion patterns in thread execution."
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

# Output

A strand produces a `[(list card) <response>]`. The first part is a list of cards to be sent off immediately, and `<response>` is one of:

- `[%wait ~]`
- `[%skip ~]`
- `[%cont self=(strand-form-raw a)]`
- `[%fail err=error]`
- `[%done value=a]`

So, for example, if you feed `2 2` into the following function:

```hoon
|=  [a=@ud b=@ud]
=/  m  (strand:rand ,vase)
^-  form:m
=/  res  !>(`@ud`(add a b))
(pure:m res)
```

The resulting strand won't just produce `[#t/@ud q=4]`, but rather `[~ %done [#t/@ud q=4]]`.

**Note:** that Spider doesn't actually return the codes themselves to thread subscribers, they're only used internally to manage the flow of the thread.

Since a strand is a function from the previously discussed `strand-input` to the output discussed here, you can compose a valid strand like:

```hoon
|=  strand-input:rand
[~ %done 'foo']
```

So this is a valid thread:

```hoon
|=  arg=vase
=/  m  (strand:rand ,vase)
^-  form:m
|=  strand-input:rand
[~ %done arg]
```

As is this:

```hoon
|%
++  my-function
  =/  m  (strand:rand ,@t)
  ^-  form:m
  |=  strand-input:rand
  [~ %done 'foo']
--
|=  arg=vase
=/  m  (strand:rand ,vase)
^-  form:m
;<  msg=@t  bind:m  my-function
(pure:m !>(msg))
```

As is this:

```hoon
|=  arg=vase
=/  m  (strand:rand ,vase)
^-  form:m
|=  strand-input:rand
=/  umsg  !<  (unit @tas)  arg
?~  umsg
[~ %fail %no-arg ~]
=/  msg=@tas  u.umsg
?.  =(msg %foo)
[~ %fail %not-foo ~]
[~ %done arg]
```

Which works like:

```
> -mythread
thread failed: %no-arg
> -mythread %bar
thread failed: %not-foo
> -mythread %foo
[~ %foo]
```

Now let's look at the meaning of each of the response codes.

### wait {#wait}

Wait tells spider not to move on from the current strand, and to wait for some new input. For example, `+sleep:strandio` will return a `[%wait ~]` along with a card to start a Behn timer. Spider passes the card to Behn, and when Behn sends a wake back to Spider, the new input will be given back to `+sleep` as a `%sign`. Sleep will then issue `[~ %done ~]` and (assuming it's in a `+bind`) `+bind` will proceed to the next strand.

### skip {#skip}

Spider will normally treat a `%skip` the same as a `%wait` and just wait for some new input. When used inside a `+main-loop:strandio`, however, it will instead tell `+main-loop` to skip this function and try the next one with the same input. This is very useful when you want to call different functions depending on the mark of a poke or some other condition.

### cont {#cont}

Cont means continue computation. When a `%cont` is issued, the issuing gate will be called again with the new value provided. Therefore `%cont` essentially creates a loop.

### fail {#fail}

Fail says to end the thread here and don't call any subsequent strands. It includes an error message and optional traceback. When spider gets a `%fail` it will send a fact with mark `%thread-fail` containing the error and traceback to its subscribers, and then end the thread.

### done {#done}

Done means the computation was completed successfully and includes the result. When Spider recieves a `%done` it will send the result it contains in a fact with a mark of `%thread-done` to subscribers and end the thread. When `bind` receives a `%done` it will extract the result and call the next gate with it.
