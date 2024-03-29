+++
title = "Decrement"
weight = 3
+++

A good practice exercise for Nock is a decrement formula.  Ie, a
formula `f` which implements the partial function that produces
`(s - 1)` if `s` is a nonzero atom, and otherwise does not
terminate.

As we know, the equivalent formula for increment is

```hoon
[%4 %0 1]
```

Thus:

```
> .*(42 [4 0 1])
43
```

Of course, increment is built into Nock.  So, ha, that's easy.

The best way to learn Nock is to **stop reading right now**, and
go write your own decrement formula.  There's no substitute for
doing it yourself.  But the second best way is faster...

## Decrement in Hoon

How do we decrement?  A good way to start is to gaze fondly on
how we'd do it if we actually had a real language, ie, Hoon.
Here is a minimal decrement in Hoon:

```hoon
=>  a=.                     ::  line 1
=+  b=0                     ::  line 2
|-                          ::  line 3
?:  =(a +(b))               ::  line 4
  b                         ::  line 5
$(b +(b))                   ::  line 6
```

Or for fun, on one line:

```hoon
=>(a=. =+(b=0 |-(?:(=(a +(b)) b $(b +(b))))))
```

Does Hoon actually work?

```
> =>(42 =>(a=. =+(b=0 |-(?:(=(a +(b)) b $(b +(b)))))))
41
```

Let's translate this into English.  How do we decrement the
subject?  First (line 1), we rename the subject `a`.  Second
(line 2), we add a variable, `b`, an atom with value `0`.
Third (line 3), we loop.  Fourth, we test if `a` equals `b` plus
1 (line 4), produce `b` if it does (line 5), repeat the loop with
`b` set to `b` plus 1 (line 6) if it doesn't.  Obviously, while
the syntax is unusual, the algorithm is anything but deep.  We
are calculating `b` minus one by counting up from `0`.

(Obviously, this is an O(n) algorithm.  Is there a better way?
There is not.  Do we actually do this in practice?  Yes and no.)

Unfortunately we are missing a third of our Rosetta stone.  We
have decrement in Hoon and we have it in English.  How do we
express this in Nock?  What will the Hoon compiler generate from
the code above?  Let's work through it line by line.

Nock has no types, variable names, etc.  So line 1 is a no-op.

How do we add a variable (line 2)?  We compute a new subject,
which is a cell of the present subject and the variable.  With
this new subject, we execute another formula.

Since `0` is a constant, a formula that produces it is

```hoon
[%1 0]
```

To combine `0` with the subject, we compute

```hoon
[[%1 0] [%0 1]]
```

which, if our subject is 42, gives us

```hoon
[0 42]
```

which we can use as the subject for an inner formula, `g`.
Composing our new variable with `g`, we have `f` as

```hoon
[%2 [[%1 0] [%0 1]] [%1 g]]
```

which seems a little funky for something so simple.  But we
can simplify it with the composition macro, `7`:

```hoon
[%7 [[%1 0] [%0 1]] g]
```

and still further with the augmentation macro, `8`:

```hoon
[%8 [%1 0] g]
```

If you refer back to the Nock definition, you'll see that all
these formulas are semantically equivalent.

Let's continue with our decrement.  So what's `g`?  We seem to
loop.  Does Nock have a loop instruction?  It most certainly does
not.  So what do we do?

We build a noun called a **core** - a construct which is behind any
kind of interesting control flow in Hoon.  Of course, the Nock
programmer is not constrained to use the same techniques as the
Hoon compiler, but it is probably a good idea.

In Hoon, all the flow structures from your old life as an Earth
programmer become cores.  Functions and/or closures are cores,
objects are cores, modules are cores, even loops are cores.

The core is just a cell whose tail is data (possibly containing
other cores) and whose head is code (containing one or more
formulas).  The tail is the **payload** and the head is the
**battery**.  Hence your core is

```hoon
[bat pay]
```

To activate a core, pick a formula out of the battery, and use
the entire core (**not** just the payload) as the subject.

(A core formula is called an **arm**.  An arm is almost like an
object-oriented method, but not quite - a method would be an arm
that produces a function on an argument.  The arm is just a
function of the core, ie, a computed attribute.)

Of course, because we feed it the entire core, our arm can
invoke itself (or any other formula in the battery).  Hence, it
can loop.  And this is what a loop is - the simplest of cores.

We need to do two things with this core: create it, and activate
it.  To be precise, we need two formulas: a formula which
produces the core, and one which activates its subject.  We can
compose these functions with the handy `7` instruction:

```hoon
[%8 [%1 0] [%7 p a]]
```

`p` produces our core, `a` activates it.  Let's take these in
reverse order.  How do we activate a core?

Since we have only one formula, it's the battery itself.
Thus we want to execute Nock with the whole core (already the
subject, and the entire battery (slot `2`)).  Hence, `a` is

```hoon
[%2 [%0 1] [%0 2]]
```

We could also use the handy `9` macro - which almost seems
designed for firing arms on cores:

```hoon
[%9 2 [%0 1]]
```

Which leaves us seeking

```hoon
[%8 [%1 0] [%7 p [%9 2 %0 1]]]
```

And all we have to do is build the core, `p`.  How do we build a
core?  We add code to the subject, just as we added a variable
above.  The initial value of our counter was a constant, `0`.
The initial (and permanent) value of our battery is a constant,
the loop formula `l`.  So `p` is

```hoon
[%8 [%1 l] [%0 1]]
```

Which would leave us seeking

```hoon
[%8 [%1 0] [%7 [%8 [%1 l] [%0 1]] [%9 2 %0 1]]]
```

except that we have duplicated the `8` pattern again, since we
know

```hoon
[%7 [%8 [%1 l] [%0 1]] [%9 2 %0 1]]
```

is equivalent to

```hoon
[%8 [%1 l] [%9 2 %0 1]]
```

so the full value of `f` is

```hoon
[%8 [%1 0] [%8 [%1 l] [%9 2 %0 1]]]
```

Thus our only formula to compose is the loop body, `l`.
Its subject is the loop core:

```hoon
[bat pay]
```

where `bat` is just the loop formula, and `pay` is the pair `[b
a]`, `b` being the counter, and `a` the input subject.  Thus we
could also write this subject as

```hoon
[l b a]
```

and we see readily that `a` is at slot `7`, `b` `6`, `l` `2`.
With this subject, we need to express the Hoon loop body

```hoon
?:  =(a +(b))               ::  line 4
  b                         ::  line 5
$(b +(b))                   ::  line 6
```

This is obviously an if statement, and it calls for `6`.  Ie:

```hoon
[%6 t y n]
```

Giving our decrement program as:

```hoon
[%8 [%1 0] [%8 [%1 %6 t y n] [%9 2 %0 1]]]
```

For `t`, how do we compute a flag that is yes (`0`) if `a` equals
`b` plus one?  Equals, we recall, is `5`.  So `t` can only be

```hoon
[%5 [%0 7] [%4 %0 6]]
```

If so, our product `y` is just the counter `b`:

```hoon
[%0 6]
```

And if not?  We have to re-execute the loop with the counter
incremented.  If we were executing it with the same counter,
obviously an infinite loop, we could use the same core:

```hoon
[%9 2 %0 1]
```

But instead we need to construct a new core with the counter
incremented:

```hoon
[l +(b) a]
```

ie,

```hoon
[[%0 2] [%4 %0 6] [%0 7]]
```

and `n` is:

```hoon
[%9 2 [[%0 2] [%4 %0 6] [%0 7]]]
```

Hence our complete decrement.  Let's reformat vertically so we
can actually read it:

```hoon
[%8
  [%1 0]
  [ %8
    [ %1
      [ %6
        t
        y
        n
      ]
    ]
    [%9 2 %0 1]
  ]
]
```

which becomes

```hoon
[%8
  [%1 0]
  [ %8
    [ %1
      [ %6
        [%5 [%0 7] [%4 %0 6]]
        [%0 6]
        [%9 2 [[%0 2] [%4 %0 6] [%0 7]]]
      ]
    ]
    [%9 2 %0 1]
  ]
]
```

or, on one line without superfluous brackets:

```hoon
[%8 [%1 0] %8 [%1 %6 [%5 [%0 7] %4 %0 6] [%0 6] %9 2 [%0 2] [%4 %0 6] %0 7] %9 2 %0 1]
```

which works for the important special case, 42:

```
> .*(42 [8 [1 0] 8 [1 6 [5 [0 7] 4 0 6] [0 6] 9 2 [0 2] [4 0 6] 0 7] 9 2 0 1])
41
```

If you understood this, you understand Nock.  At least in principle!
Now, go write an adder.  Or don't.
