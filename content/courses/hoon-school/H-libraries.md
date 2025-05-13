# 7. Libraries

_Libraries allow you to import and share processing code.  This module will discuss how libraries can be produced, imported, and used._

##  Importing a Library

If you have only built [generators](urbit-docs/glossary/generator), you will soon or later become frustrated with the apparent requirement that you manually reproduce helper cores and arms every time you need them in a different generator. Libraries are [cores](urbit-docs/glossary/core) stored in `/lib` which provide access to [arms](urbit-docs/glossary/arm) and legs (operations and data).  While the Hoon standard library is directly available in the regular [subject](urbit-docs/glossary/subject), many other elements of functionality have been introduced by software authors.

### Building Code Generally

A generator gives us on-demand access to code, but it is helpful to load and use code from files while we work in the [Dojo](urbit-docs/glossary/dojo).

A conventional library import with `/+` [faslus](urbit-docs/language/hoon/reference/rune/fas#-faslus) will work in a generator or another file, but won't work in Dojo, so you can't use `/+` faslus interactively.  The first line of many generators will include an import line like this:

```hoon
/+  number-to-words
```

Subsequent invocations of the [core](urbit-docs/glossary/core) require you to refer to it by name:

**/gen/n2w.hoon**

```hoon
/+  number-to-words
|=  n=@ud
(to-words:eng-us:numbers:number-to-words n)
```

Since `/` fas runes don't work in the Dojo, you need to instead use the [-build-file](urbit-docs/manual/os/dojo-tools#-build-file) thread to load the code. Most commonly, you will do this with library code when you need a particular [gate's](urbit-docs/glossary/gate) functionality for interactive coding.

`-build-file` accepts a file path and returns the built operational code.  For instance:

```hoon
> =ntw -build-file %/lib/number-to-words/hoon

> one-hundred:numbers:ntw  
100

> (to-words:eng-us:numbers:ntw 19)
[~ "nineteen"]
```

There are also a number of other import [runes](urbit-docs/glossary/rune) which make library, structure, and mark code available to you.  For now, the only one you need to worry about is `/+` [faslus](urbit-docs/language/hoon/reference/rune/fas#-faslus).

For simplicity, everything we do will take place on the `%base` [desk](urbit-docs/glossary/desk) for now.  We will learn how to create a library in a subsequent lesson.

### Exercise: Loading a Library

In a [generator](urbit-docs/glossary/generator), load the `number-to-words` library using the `/+` [tislus](urbit-docs/language/hoon/reference/rune/tis#-tislus) rune.  (This must take place at the very top of your file.)

Use this to produce a [gate](urbit-docs/glossary/gate) which accepts an unsigned decimal integer and returns the text interpretation of its increment.

## Helper Cores

Another common design pattern besides creating a library is to sequester core-specific behavior in a helper [core](urbit-docs/glossary/core), which sits next to the interface operations. Two runes are used to compose expressions together so that the subject has everything it needs to carry out the desired calculations.

- `=>` [tisgar](urbit-docs/language/hoon/reference/rune/tis#-tisgar) composes two expressions so that the first is included in the second's [subject](urbit-docs/glossary/subject) (and thus can see it).
- `=<` [tisgal](urbit-docs/language/hoon/reference/rune/tis#-tisgal) inverts the order of composition, allowing heavier helper cores to be composed after the core's logic but still be available for use.

Watch for these being used in generators and libraries over the next few modules.

### Exercise:  A Playing Card Library

In this exercise, we examine a library that can be used to represent a deck of 52 playing cards.  The [core](urbit-docs/glossary/core) below builds such a library, and can be accessed by programs.  You should recognize most of the things this program does aside from the `++shuffle-deck` arm which uses a [door](urbit-docs/courses/hoon-school/K-doors) to produce [randomness](urbit-docs/courses/hoon-school/O-subject).  This is fairly idiomatic Hoon and it relies a lot on the convention that heavier code should be lower in the expression.  This means that instead of `?:` [wutcol](urbit-docs/language/hoon/reference/rune/wut#-wutcol) you may see `?.` [wutdot](urbit-docs/language/hoon/reference/rune/wut#-wutdot), which inverts the order of the true/false [arms](urbit-docs/glossary/arm), as well as other new constructions.

<details>
<summary>Playing Card Library code</summary>

```hoon
|%
+$  suit  ?(%hearts %spades %clubs %diamonds)
+$  darc  [sut=suit val=@ud]  :: see below about naming
+$  deck  (list darc)
++  make-deck
  ^-  deck
  =/  mydeck  *deck
  =/  i  1
  |-
  ?:  (gth i 4)
    mydeck
  =/  j  2
  |-
  ?.  (lte j 13)
    ^$(i +(i))
  %=  $
    j       +(j)
    mydeck  [[(num-to-suit i) j] mydeck]
  ==
++  num-to-suit
  |=  val=@ud
  ^-  suit
  ?+  val  !!
    %1  %hearts
    %2  %spades
    %3  %clubs
    %4  %diamonds
  ==
++  shuffle-deck
  |=  [unshuffled=deck entropy=@]
  ^-  deck
  =/  shuffled  *deck
  =/  random  ~(. og entropy)
  =/  remaining  (lent unshuffled)
  |-
  ?:  =(remaining 1)
    :_  shuffled
    (snag 0 unshuffled)
  =^  index  random  (rads:random remaining)
  %=  $
    shuffled      [(snag index unshuffled) shuffled]
    remaining     (dec remaining)
    unshuffled    (oust [index 1] unshuffled)
  ==
++  draw
  |=  [n=@ud d=deck]
  ^-  [hand=deck rest=deck]
  :-  (scag n d)
  (slag n d)
--
```

</details>

The `|%` [barcen](urbit-docs/language/hoon/reference/rune/bar#-barcen) core created at the top of the file contains the entire library's code, and is closed by `--` [hephep](urbit-docs/language/hoon/reference/rune/terminators#---hephep) on the last line.

To create three types we're going to need, we use `+$` [lusbuc](urbit-docs/language/hoon/reference/rune/lus#-lusbuc), which is an [arm](urbit-docs/glossary/arm) used to define a type.

- `+$  suit  ?(%hearts %spades %clubs %diamonds)` defines `+$suit`, which can be either `%hearts`, `%spades`, `%clubs`, or `%diamonds`. It's a type union created by the irregular form of `$?` [bucwut](urbit-docs/language/hoon/reference/rune/buc#-bucwut).

- `+$  darc  [sut=suit val=@ud]` defines `+$darc`, which is a pair of `suit` and a `@ud`. By pairing a suit and a number, it represents a particular playing card, such as “nine of hearts”.  Why do we call it `darc` and not `card`?  Because `card` already has a meaning in [Gall](urbit-docs/glossary/gall), the [Arvo](urbit-docs/glossary/arvo) app module, where one would likely to use this (or any) library.  It's worthwhile to avoid any confusion over names.

- `+$  deck  (list darc)` is simply a [list](urbit-docs/glossary/list) of `darc`.

One way to get a feel for how a library works is to skim the `++` [luslus](urbit-docs/language/hoon/reference/rune/lus#-luslus) arm-names before diving into any specific [arm](urbit-docs/glossary/arm).  In this library, the arms are `++make-deck`, `++num-to-suit`, `++shuffle-deck`, and `++draw`. These names should be very clear, with the exception of `++num-to-suit` (although you could hazard a guess at what it does).  Let's take a closer look at it first:

```hoon
++  num-to-suit
  |=  val=@ud
  ^-  suit
  ?+  val  !!
    %1  %hearts
    %2  %spades
    %3  %clubs
    %4  %diamonds
  ==
```

`++num-to-suit` defines a gate which takes a single `@ud` unsigned decimal integer and produces a `suit`.  The `?+` [wutlus](urbit-docs/language/hoon/reference/rune/wut#-wutlus) rune creates a structure to switch against a value with a default in case there are no matches.  (Here the default is to crash with `!!` [zapzap](urbit-docs/language/hoon/reference/rune/zap#-zapzap).)  We then have options 1–4 which each resulting in a different suit.

```hoon
++  make-deck
  ^-  deck
  =/  mydeck  *deck
  =/  i  1
  |-
  ?:  (gth i 4)
    mydeck
  =/  j  2
  |-
  ?.  (lte j 14)
    ^$(i +(i))
  %=  $
    j       +(j)
    mydeck  [[(num-to-suit i) j] mydeck]
  ==
```

`++make-deck` assembles a deck of 52 cards by cycling through every possible suit and number and combining them.  It uses `++num-to-suit` and a couple of loops to go through the counters.  It has an interesting `^$` loop skip where when `j` is greater than 14 it jumps instead to the outer loop, incrementing `i`.

`?.` [wutdot](urbit-docs/language/hoon/reference/rune/wut#-wutdot) may be an unfamiliar rune; it is simply the inverted version of `?:` [wutcol](urbit-docs/language/hoon/reference/rune/wut#-wutcol), so the first branch is actually the if-false branch and the second is the if-true branch. This is done to keep the “heaviest” branch at the bottom, which makes for more idiomatic and readable Hoon code.

```hoon
++  draw
  |=  [n=@ud d=deck]
  ^-  [hand=deck rest=deck]
  :-  (scag n d)
  (slag n d)
```

`++draw` takes two arguments:  `n`, an unsigned integer, and `d`, a `deck`.  The gate will produce a cell of two `decks` using [++scag](urbit-docs/language/hoon/reference/stdlib/2b#scag) and [++slag](urbit-docs/language/hoon/reference/stdlib/2b#slag). [++scag](urbit-docs/language/hoon/reference/stdlib/2b#scag) is a standard library [gate](urbit-docs/glossary/gate) produces the first `n` elements from a [list](urbit-docs/glossary/list), while [++slag](urbit-docs/language/hoon/reference/stdlib/2b#slag) is a standard library gate that produces the remaining elements of a list starting after the `n`th element.  So we use `++scag` to produce the drawn hand of `n` cards in the head of the cell as `hand`, and `++slag` to produce the remaining deck in the tail of the cell as `rest`.

```hoon
++  shuffle-deck
  |=  [unshuffled=deck entropy=@]
  ^-  deck
  =/  shuffled  *deck
  =/  random  ~(. og entropy)
  =/  remaining  (lent unshuffled)
  |-
  ?:  =(remaining 1)
    :_  shuffled
    (snag 0 unshuffled)
  =^  index  random  (rads:random remaining)
  %=  $
    shuffled      [(snag index unshuffled) shuffled]
    remaining     (dec remaining)
    unshuffled    (oust [index 1] unshuffled)
  ==
```

Finally we come to `++shuffle-deck`.  This gate takes two arguments:  a `deck`, and a `@` as a bit of `entropy` to seed the [og](urbit-docs/language/hoon/reference/stdlib/3d#og) random-number [core](urbit-docs/glossary/core).  It will produce a `deck`.

We add a bunted `deck`, then encounter a very interesting statement that you haven't run into yet.  This is the irregular form of `%~` [censig](urbit-docs/language/hoon/reference/rune/cen#-censig), which “evaluates an arm in a door.”  For our purposes now, you can see it as a way of creating a random-value arm that we'll use later on with `++rads:random`.

With `=/  remaining  (lent unshuffled)`, we get the length of the unshuffled deck with [++lent](urbit-docs/language/hoon/reference/stdlib/2b#lent).

`?:  =(remaining 1)` checks if we have only one card remaining. If that's true, we produce a [cell](urbit-docs/glossary/cell) of `shuffled` and the one card left in `unshuffled`. We use the `:_` [colcab](urbit-docs/language/hoon/reference/rune/col#_-colcab) rune here, so that the “heavier” expression is at the bottom.

If the above conditional evaluates to `%.n` false, we need to do a little work. `=^` [tisket](urbit-docs/language/hoon/reference/rune/tis#-tisket) is a rune that pins the head of a pair and changes a leg in the [subject](urbit-docs/glossary/subject) with the tail.  It's useful for interacting with the [og](urbit-docs/language/hoon/reference/stdlib/3d#og) core arms, as many of them produce a pair of a random numbers and the next state of the core. We're going to put the random number in the [subject](urbit-docs/glossary/subject) with the [face](urbit-docs/glossary/face) `index` and change `random` to be the next core.

With that completed, we use `%=` [centis](urbit-docs/language/hoon/reference/rune/cen#-centis) to call `$` buc to recurse back up to `|-` [barhep](urbit-docs/language/hoon/reference/rune/bar#--barhep) with a few changes:

- `shuffled` gets the `darc` from `unshuffled` at `index` added to the front of it.

- `remaining` gets decremented. Why are we using a counter here instead of just checking the length of `unshuffled` on each loop? [++lent](urbit-docs/language/hoon/reference/stdlib/2b#lent) traverses the entire list every time it's called so maintaining a counter in this fashion is much faster.

- `unshuffled` becomes the result of using [++oust](urbit-docs/language/hoon/reference/stdlib/2b#oust) to remove 1 `darc` at `index` on `unshuffled`.

This is a very naive shuffling algorithm.  We leave the implementation of a better shuffling algorithm as an exercise for the reader.


### Exercise:  Using the Playing Card Library

Unfortunately `/` [fas](urbit-docs/language/hoon/reference/rune/fas) runes don't work in the [Dojo](urbit-docs/glossary/dojo) right now, so we need to build code using the [-build-file](urbit-docs/manual/os/dojo-tools#-build-file) thread if we want to use the library directly.

- Import the `/lib/playing-cards.hoon` library and use it to shuffle and show a deck and a random hand of five cards.

    We first import the library:

    ```hoon
    =playing-cards -build-file /===/lib/playing-cards/hoon
    ```

    We then invoke it using the _entropy_ or system randomness.  (This is an unpredictable value we will use when we want a process to be random.  We will discuss it in detail when we talk about [subject-oriented programming](urbit-docs/courses/hoon-school/O-subject).)

    ```hoon
    > =deck (shuffle-deck:playing-cards make-deck:playing-cards eny)

    > deck
    ~[
      [sut=%spades val=12]
      [sut=%spades val=8]
      [sut=%hearts val=5]
      [sut=%clubs val=2]
      [sut=%diamonds val=10]
      ...
      [sut=%spades val=2]
      [sut=%hearts val=6]
      [sut=%hearts val=12]
    ]
    ```

    Draw a hand of five cards from the deck:

    ```hoon
    > (draw:playing-cards 5 deck)
    [   hand
      ~[
        [sut=%spades val=12]
        [sut=%spades val=8]
        [sut=%hearts val=5]
        [sut=%clubs val=2]
        [sut=%diamonds val=10]
      ]
        rest
      ~[
        [sut=%hearts val=2]
        [sut=%clubs val=7]
        [sut=%clubs val=9]
        [sut=%diamonds val=6]
        [sut=%diamonds val=8]
        ...
        [sut=%spades val=2]
        [sut=%hearts val=6]
        [sut=%hearts val=12]
      ]
    ]
    ```

    Of course, since the deck was shuffled once, any time we draw from the same deck we will get the same hand.  But if we replace the deck with the `rest` remaining, then we can continue to draw new hands.


##  Desks

A [desk](urbit-docs/glossary/desk) organizes a collection of files, including [generators](urbit-docs/glossary/generator), libraries, [agents](urbit-docs/glossary/agent), and system code, into one coherent bundle. A desk is similar to a file drive in a conventional computer, or a Git branch.  Desks are supported by the [Clay](urbit-docs/glossary/clay) [vane](urbit-docs/glossary/vane) in [Arvo](urbit-docs/glossary/arvo), the Urbit OS.

At this point, you've likely only worked on the `%base` desk.  You can see data about any particular desk using the [+vats](urbit-docs/manual/os/dojo-tools#vats) generator:

```hoon
> +vats %base
%base
  /sys/kelvin:           [%zuse 413]
  base hash ends in:     hih5c
  %cz hash ends in:      hih5c
  app status:            running
  pending updates:       ~

> +vats %base, =verb %.y
%base
  /sys/kelvin:      [%zuse 413]
  base hash:        0v2.vhcjk.rj42q.e3la7.1679q.u2qs2.35vnn.9n1jm.mj66h.kgpe5.hih5c
  %cz hash:         0v2.vhcjk.rj42q.e3la7.1679q.u2qs2.35vnn.9n1jm.mj66h.kgpe5.hih5c
  app status:       running
  force on:         ~
  force off:        ~
  publishing ship:  ~
  updates:          remote
  source ship:      ~marnec-dozzod-marzod
  source desk:      %kids
  source aeon:      43
  kids desk:        %kids
  pending updates:  ~
```

You'll see a slightly different configuration on the particular [ship](urbit-docs/glossary/ship) you are running.

### Aside:  Filesystems

A filesystem is responsible for providing access to blobs of data somewhere on a disk drive.  If you have worked with Windows or macOS, you have become accustomed to using a file browser to view and interact with files.  Mobile devices tend to obscure the nature of files more, in favor of just providing an end-user interface for working with or viewing the data.  To use files effectively, you need to know a few things:

1. How to identify the data.
2. How to locate the data.
3. How to read or interpret the data.

Files are identified by a _file name_, which is typically a short descriptor like `Waterfall Visit 5.jpg` (if produced by a human) or `DSC_54694.jpg` (if produced by a machine).

Files are located using the _path_ or _file path_.  Colloquially, this is what we mean when we ask which folder or directory a file is located in.  It's an address that users and programs can use to uniquely locate a particular file, even if that file has the same name as another file.

An Earth filesystem and path orients itself around some key metaphor:
- Windows machines organize the world by drive, e.g. `C:\`.
- Unix machines (including macOS and Linux) organize the world from `/`, the root directory.

**Absolute paths** are like street addresses, or latitude and longitude. They let you unambiguously locate a file or folder.  **Relative paths** are more like informal (but correct) instructions:  “It's on the right just three houses past the church.”  They are often shorter but require the user to know the starting point.

Once you have located a particular file, you need to load the data. Conventionally, _file extensions_ indicate what kind of file you are dealing with:  `.jpg`, `.png`, and `.gif` are image files, for instance; `.txt`, `.docx`, and `.pdf` are different kinds of documents; and `.mp3` and `.ogg` are audio files.  Simply changing the extension on the file doesn't change the underlying data, but it can either elicit a stern warning from the OS or confuse it, depending on the OS.  Normally you have to open the file in an appropriate program and save it as a new type if such a conversion is possible.

### File Data in Urbit

On Mars, we treat a filesystem as a way of organizing arbitrary access to blocks of persistent data.  There are some concessions to Earth-style filesystems, but [Clay](urbit-docs/glossary/clay) (Urbit's filesystem) organizes everything with respect to a [desk](urbit-docs/glossary/desk), a discrete collection of static data on a particular [ship](urbit-docs/glossary/ship). Of course, like everything else in Hoon, a desk is a tree as well.

So far everything we have done has taken place on the `%base` desk.  You have by this point become proficient at synchronizing Earthling data (Unix data) and Martian data (Urbit data), using [|mount](urbit-docs/manual/os/dojo-tools#mount) and [|commit](urbit-docs/manual/os/dojo-tools#commit), and every time you've done this with `%base` that has been recorded in the update report the [Dojo](urbit-docs/glossary/dojo) makes to you.

```hoon
> |commit %base
>=
+ /~zod/base/2/gen/demo/hoon
```

This message says that a file `demo.hoon` was added to the Urbit filesystem at the path in `/gen`.  What is the rest of it, though, the first three components?  We call this the [beak](urbit-docs/system/kernel/clay/reference/data-types#beak).  The beak lets Clay globally identify any resource on any ship at any point in time.  A beak has three components:

1. The **ship**, here `~zod`.  (You can find this out on any ship using `our`.)
2. The **desk**, here `%base`.
3. A **revision number** or **timestamp**, here `2`.  (The current system time is available as `now`.)  Clay tracks the history of each file, so older versions can be accessed by their revision number. (This is uncommon to need to do today.)

The beak is commonly constructed with the `/` fas prefix and `=` tis signs for the three components:

```hoon
> /===
[~.~zod ~.base ~.~2022.6.14..18.13.35..ccaf ~]
```

Any one of those can be replaced as necessary:

```hoon
> /=sandbox=
[~.~zod %sandbox ~.~2022.6.14..18.14.49..a3da ~]
```

You'll also sometimes see `%` cen stand in for the whole including the “current” desk.  The current desk is a Dojo concept, since for [Clay](urbit-docs/glossary/clay) we can access any desk at any time (with permission).

```hoon
> %
[~.~zod ~.base ~.~2022.6.14..18.15.10..698c ~]
```

### Paths and Files

A `path` is a `(list @ta)`, a list of text identifiers.  The first three are always the beak and the last one conventionally refers to the mark by which the file is represented.

For instance, the [+cat](urbit-docs/manual/os/dojo-tools#cat) generator displays the contents of any path, e.g.

```hoon
> +cat /===/gen/ls/hoon
/~zod/base/~2022.6.14..18.16.53..2102/gen/ls/hoon
::  LiSt directory subnodes
::
::::  /hoon/ls/gen
  ::
/?    310
/+    show-dir
::
::::
  ::
~&  %
:-  %say
|=  [^ [arg=path ~] vane=?(%g %c)]
=+  lon=.^(arch (cat 3 vane %y) arg)
tang+[?~(dir.lon leaf+"~" (show-dir vane arg dir.lon))]~
```

If no data are located at the given path, `+cat` simply shows `~` null:

```hoon
> +cat /=landscape=/gen/ls/hoon
~ /~zod/landscape/~2022.6.14..18.17.16..07ff/gen/ls/hoon
```

Every desk has a standard directory structure:

-   `/app` for [agents](urbit-docs/glossary/agent)
-   `/gen` for [generators](urbit-docs/glossary/generator)
-   `/lib` for library and helper files
-   `/mar` for [marks](urbit-docs/glossary/mark)
-   `/sur` for shared structures
-   `/ted` for [threads](urbit-docs/glossary/thread)

To run a generator from a different desk in Dojo, you need to prefix the desk name to the generator; to run `/=landscape=/gen/tally/hoon`, you would say:

```hoon
> +landscape!tally

tallied your activity score! find the results below.
to show non-anonymized resource identifiers, +tally |
counted from groups and channels that you are hosting.
groups are listed with their member count.
channels are listed with activity from the past week:
  - amount of top-level content
  - amount of unique authors

the date is ~2022.6.14..18.19.30..8c94
you are in 0 group(s):

you are hosting 0 group(s):
```

### Marks

[Marks](urbit-docs/glossary/mark) play the role of file extensions, with an important upgrade:  they are actually [molds](urbit-docs/glossary/mold) and define conversion paths.  We won't write them in Hoon School, but you will encounter them when you begin writing apps. They are used more broadly than merely as file types, because they act as smart molds to ingest and yield data structures such as JSON and HTML from Hoon data structures.

In brief, each mark has a `++grab` arm to convert from other types to it; a `++grow` arm to convert it to other types; and a `++grad` arm for some standard operations across marks.  You can explore the marks in `/mar`.


##  Other Ford Runes

The `++ford` arm of Clay builds Hoon code.  It provides [a number of runes](urbit-docs/language/hoon/reference/rune/fas) which allow fine-grained control over building and importing files.  These must be in the specific order at the top of any file.  (They also don't work in Dojo; see [-build-file](urbit-docs/manual/os/dojo-tools#-build-file) for a workaround.) The runes include:

- `/-` [fashep](urbit-docs/language/hoon/reference/rune/fas#--fashep) imports a structure file from `/sur`.  Structure files are a way to share common data structures (across agents, for instance).
- `/+` [faslus](urbit-docs/language/hoon/reference/rune/fas#-faslus) imports a library file from `/lib`.

    Both `/-` fashep and `/+` faslus allow you to import by affecting the name of the exposed core:
    
    1.  With the default name:

        ```hoon
        /+  apple
        ```

    2.  With no name:

        ```hoon
        /-  *orange
        ```

    3.  With a new name:

        ```hoon
        /+  pomme=apple
        ```

    `*` is useful when importing libraries with unwieldy names, but otherwise should be avoided as it can shadow names in your current subject.

- `/=` [fastis](urbit-docs/language/hoon/reference/rune/fas#-fastis) builds a user-specified path and wraps it with a given [face](urbit-docs/glossary/face).
- `/*` [fastar](urbit-docs/language/hoon/reference/rune/fas#-fastar) imports the contents of a file, applies a [mark](urbit-docs/glossary/mark) to convert it, and wraps it with a given face.
