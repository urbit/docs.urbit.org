+++
title = "API overview by prefix"
weight = 4
+++
Let's run through the `u3` modules one by one.  All public
functions are commented, but the comments may be cryptic.

## u3m: main control

To start `u3`, run

```c
/* u3m_boot(): start the u3 system.
*/
  void
  u3m_boot(c3_o nuu_o, c3_o bug_o, c3_c* dir_c);
```

`nuu_o` is `c3y` (yes, `0`) if you're creating a new pier,
`c3n` (no, `1`) if you're loading an existing one.  `bug_o`
is `c3y` if you want to test the garbage-collector, `c3n`
otherwise.  `dir_c` is the directory for the pier files.

`u3m_boot()` expects an `urbit.pill` file to load the kernel
from.  It will try first `$dir/.urb.urbit.pill`, then `U3_LIB`.

Any significant computation with nouns, certainly anything Turing
complete, should be run (a) virtualized and (b) in an inner road.
These are slightly different things, but at the highest level we
bundle them together for your convenience, in `u3m_soft()`:

```c
/* u3m_soft(): system soft wrapper.  unifies unix and nock errors.
**
**  Produces [%$ result] or [%error (list tank)].
*/
  u3_noun
  u3m_soft(c3_w sec_w, u3_funk fun_f, u3_noun arg);
```

`sec_w` is the number of seconds to time out the computation.
`fun_f` is a C function accepting `arg`.

The result of `u3m_soft()` is a cell whose head is an atom.  If
the head is `%$` - ie, `0` - the tail is the result of
`fun_f(arg)`.  Otherwise, the head is a `term` (an atom which is
an LSB first string), and the tail is a `(list tank)` (a list of
`tank` printables - see `++tank` in `hoon.hoon`).  Error terms
should be the same as the exception terms above.

If you're confident that your computation won't fail, you can
use `u3m_soft_sure()`, `u3m_soft_slam()`, or `u3m_soft_nock()`
for C functions, Hoon function calls, and Nock invocations.
Caution - this returns just the result, and asserts globally.

All the `u3m_soft` functions above work **only on the surface**.
Within the surface, virtualize with `u3m_soft_run()`.  Note that
this takes a `fly` (a namespace gate), thus activating the `11`
super-operator in the nock virtualizer, `++mock`.  When actually
using the `fly`, call `u3m_soft_esc()`.  Don't do either unless
you know what you're doing!

For descending into a subroad **without** Nock virtualization,
use `u3m_hate()` and `u3m_love` respectively.  Hating enters
a subroad; loving leaves it, copying out a product noun.

Other miscellaneous tools in `u3m`: `u3m_file()` loads a Unix
file as a Nock atom;  `u3m_water()` measures the boundaries of
the loom in current use (ie, watermarks); and a variety of
prettyprinting routines, none perfect, are available, mainly for
debugging printfs: `u3m_pretty()`, `u3m_p()`, `u3m_tape()` and
`u3m_wall()`.

It's sometimes nice to run a mark-and-sweep garbage collector,
`u3m_grab()`, which collects the world from a list of roots,
and asserts if it finds any leaks or incorrect refcounts.  This
tool is for debugging and long-term maintenance only; refcounts
should never err.

## u3j: jets

The jet system, `u3j`, is what makes `u3` and `nock` in any sense
a useful computing environment.  Except perhaps `u3a` (there is
really no such thing as a trivial allocator, though `u3a` is
dumber than most) - `u3j` is the most interesting code in `u3`.

Let's consider the minor miracle of driver-to-battery binding
which lets `u3j` work - and decrement not be `O(n)` - without
violating the precisely defined semantics of pure Nock, **ever**.

It's easy to assume that jets represent an architectural coupling
between Hoon language semantics and Nock interpreter internals.
Indeed such a coupling would be wholly wrongtious and un-Urbit.
But the jet system is not Hoon-specific.  It is specific to nock
runtime systems that use a design pattern we call a `core`.

### u3j: core structure

A core is no more than a cell `[code data]`, in which a `code` is
either a Nock formula or a cell of `code`s, and `data` is anything.
In a proper core, the subject each formula expects is the core
itself.

Except for the arbitrary decision to make a core `[code data]`,
(or as we sometimes say, `[battery payload]`), instead of `[data
code]`, any high-level language transforming itself to Nock would
use this design.

So jets are in fact fully general.  Broadly speaking, the jet
system works by matching a C **driver** to a battery.  When the
battery is invoked with Nock operator `9`, it must be found in
associative memory and linked to its driver.  Then we link the
formula axis of the operation (`a` in `[9 a b]`) to a specific
function in the driver.

To validate this jet binding, we need to know two things.  One,
we need to know the C function actually is a perfect semantic
match for the Nock formula.  This can be developed with driver
test flags, which work, and locked down with a secure formula
hash in the driver, which we haven't bothered with just yet.
(You could also try to develop a formal method for verifying
that C functions and Nock formulas are equivalent, but this is
a research problem for the future.)

Two, we need to validate that the payload is appropriate for the
battery.  We should note that jets are a Nock feature and have no
reference to Hoon.  A driver which relies on the Hoon type system
to only pair it with valid payloads is a broken driver, and
breaks the Nock compliance of the system as a whole.  So don't.

Now, a casual observer might look at `[battery payload]` and
expect the simplest case of it to be `[formula subject]`.  That
is: to execute a simple core whose battery is a single formula,
we compute

```
nock(+.a -.a)
```

Then, naturally, when we go from Hoon or a high-level language
containing functions down to Nock, `[function arguments]` turns
into `[formula subject]`.  This seems like an obvious design, and
we mention it only because it is **completely wrong**.

Rather, to execute a one-armed core like the above, we run

```
nock(a -.a)
```

and the normal structure of a `gate`, which is simply Urbitese
for "function," is:

```
[formula [sample context]]
```

where `sample` is Urbitese for "arguments" - and `context`, any
Lisper will at once recognize, is Urbitese for "environment."

To `slam` or call the gate, we simply replace the default sample
with the caller's data, then nock the formula on the entire gate.

What's in the context?  Unlike in most dynamic languages, it is
not some secret system-level bag of tricks.  Almost always it is
another core.  This onion continues until at the bottom, there is
an atomic constant, conventionally is the kernel version number.

Thus a (highly desirable) `static` core is one of the form

```
[battery constant]
[battery static-core]
```

ie, a solid stack of nested libraries without any dynamic data.
The typical gate will thus be, for example,

```
[formula [sample [battery battery battery constant]]]
```

but we would be most foolish to restrict the jet mechanism to
cores of this particular structure.  We cannot constrain a
payload to be `[sample static-core]`, or even `[sample core]`.
Any such constraint would not be rich enough to handle Hoon,
let alone other languages.

### u3j: jet state

There are two fundamental rules of computer science: (1) every
system is best understood through its state; (2) less state is
better than more state.  Sadly, a pier has three different jet
state systems: `cold`, `warm` and `hot`.  It needs all of them.

Hot state is associated with this particular Unix process.  The
persistent pier is portable not just between process and process,
but machine and machine or OS and OS.  The set of jets loaded
into a pier may itself change (in theory, though not in the
present implementation) during the lifetime of the process.  Hot
state is a pure C data structure.

Cold state is associated with the logical execution history of
the pier.  It consists entirely of nouns and ignores restarts.

Warm state contains all dependencies between cold and hot
state.  It consists of C structures allocated on the loom.

Warm state is purely a function of cold and hot states, and
we can wipe and regenerate it at any time.  On any restart where
the hot state might have changed, we clear the warm state
with `u3j_ream()`.

There is only one hot state, the global jet dashboard
`u3j_Dash` or `u3D` for short.  In the present implementation,
u3D is a static structure not modified at runtime, except for
numbering itself on process initialization.  This structure -
which embeds function pointers to all the jets - is defined
in `j/tree.c`.  The data structures:

```c
    /* u3j_harm: driver arm.
    */
      typedef struct _u3j_harm {
        c3_c*               fcs_c;            //  `.axe` or name
        u3_noun           (*fun_f)(u3_noun);  //  compute or 0 / semitransfer
        c3_o                ice;              //  perfect (don't test)
        c3_o                tot;              //  total (never punts)
        c3_o                liv;              //  live (enabled)
      } u3j_harm;

    /* u3j_core: C core driver.
    */
      typedef struct _u3j_core {
        c3_c*             cos_c;              //  control string
        struct _u3j_harm* arm_u;              //  blank-terminated static list
        struct _u3j_core* dev_u;              //  blank-terminated static list
        struct _u3j_core* par_u;              //  dynamic parent pointer
        c3_l              jax_l;              //  dynamic jet index
      } u3j_core;

    /* u3e_dash, u3_Dash, u3D: jet dashboard singleton
    */
      typedef struct _u3e_dash {
        u3j_core* dev_u;                      //  null-terminated static list
        c3_l      len_l;                      //  ray_u filled length
        c3_l      all_l;                      //  ray_u allocated length
        u3j_core* ray_u;                      //  dynamic driver array
      } u3j_dash;
```

Warm and cold state is **per road**.  In other words, as we nest
roads, we also nest jet state.  The jet state in the road is:

```c
      struct {                                //  jet dashboard
        u3p(u3h_root) har_p;                  //  warm state
        u3_noun       das;                    //  cold state
      } jed;
```

In case you understand Hoon, `das` (cold state) is a `++dash`,
and `har_p` (warm state) is a map from battery to `++calx`:

```hoon
    ++  bane  ,@tas                                 ::  battery name
    ++  bash  ,@uvH                                 ::  label hash
    ++  bosh  ,@uvH                                 ::  local battery hash
    ++  batt  ,*                                    ::  battery
    ++  calf                                        ::
      $:  jax=,@ud                                  ::  hot core index
          hap=(map ,@ud ,@ud)                       ::  axis/hot arm index
          lab=path                                  ::  label as path
          jit=*                                     ::  arbitrary data
      ==                                            ::
    ++  calx  (trel calf (pair bash cope) club)     ::  cached by battery
    ++  clog  (pair cope (map batt club))           ::  identity record
    ++  club  (pair corp (map term nock))           ::  battery pattern
    ++  cope  (trel bane axis (each bash noun))     ::  core pattern
    ++  core  ,*                                    ::  core
    ++  corp  (each core batt)                      ::  parent or static
    ++  dash  (map bash clog)                       ::  jet system
```

The driver index `jax` in a `++calx` is an index into `ray_u` in the
dashboard - ie, a pointer into hot state.  This is why the warm
state has to be reset when we reload the pier in a new process.

Why is jet state nested?  Nock of course is a functional system,
so as we compute we don't explicitly create state.  Jet state is
an exception to this principle (which works only because it can't
be semantically detected from Nock/Hoon) - but it can't violate
the fundamental rules of the allocation system.

For instance, when we're on an inner road, we can't allocate on
an outer road, or point from an outer road to an inner.  So if we
learn something - like a mapping from battery to jet - in the
inner road, we have to keep it in the inner road.

Mitigating this problem, when we leave an inner road (with
`u3m_love()`), we call `u3j_reap()` to promote jet information in
the dying road.  Reaping promotes anything we've learned about
any battery that either (a) already existed in the outer road, or
(b) is being saved to the outer road.

### u3j: jet binding

Jet binding starts with a `%fast` hint.  (In Hoon, this is
produced by the runes `~%`, for the general case, or `~/`
for simple functions.)  To bind a jet, execute a formula of the
form:

```
[10 [%fast clue-formula] core-formula]
```

`core-formula` assembles the core to be jet-propelled.
`clue-formula` produces the hint information, or `++clue`
above, which we want to annotate it with.

A clue is a triple of name, parent, and hooks:

```hoon
++  clue  (trel chum nock (list (pair term nock)))
```

The name, or `++chum`, has a bunch of historical structure which
we don't need (cleaning these things up is tricky), but just gets
flattened into a term.

The parent axis is a nock formula, but always reduces to a simple
axis, which is the address of this core's **parent**.  Consider
again an ordinary gate

```
[formula [sample context]]
```

Typically the `context` is itself a library core, which itself
has a jet binding.  If so, the parent axis of this gate is `7`.

If the parent is already bound - and the parent **must** be already
bound, in this road or a road containing it - we can hook this core
bottom-up into a tree hierarchy.  Normally the child core is
produced by an arm of the parent core, so this is not a problem -
we wouldn't have the child if we hadn't already made the parent.

The clue also contains a list of **hooks**, named nock formulas on
the core.  Usually these are arms, but they need not be.  The
point is that we often want to call a core from C, in a situation
where we have no type or other source information.  A common case
of this is a complex system in which we're mixing functions which
are jet-propelled with functions that aren't.

In any case, all the information in the `%fast` hint goes to
`u3j_mine()`, which registers the battery in cold state (`das` in
`jed` in `u3R`), then warm state (`har_p` in `jed`).

It's essential to understand that the `%fast` hint has to be,
well, fast - because we apply it whenever we build a core.  For
instance, if the core is a Hoon gate - a function - we will call
`u3j_mine` every time the function is called.

### u3j: the cold jet dashboard

For even more fun, the jet tree is not actually a tree of
batteries.  It's a tree of battery **labels**, where a label is
an [axis term] path from the root of the tree.  (At the root,
if the core pattern is always followed properly, is a core whose
payload is an atomic constant, conventionally the Hoon version.)

Under each of these labels, it's normal to have an arbitrary
number of different Nock batteries (not just multiple copies
of the same noun, a situation we **do** strive to avoid).  For
instance, one might be compiled with debugging hints, one not.

We might even have changed the semantics of the battery without
changing the label - so long as those semantics don't invalidate
any attached driver.

For instance, it's normal to have two equivalent Nock batteries
at the same time in one pier: one battery compiled with
debugging hints, one not.

Rather, the jet tree is a semantic hierarchy.  The root of the
hierarchy is a constant, by convention the Hoon kernel version
because any normal jet-propelled core has, at the bottom of its
onion of libraries, the standard kernel.  Thus if the core is

```
[foo-battery [bar-battery [moo-battery 164]]]
```

we can reverse the nesting to construct a hierarchical core
path.  The static core

```
164/moo/bar/foo
```

extends the static core `164/moo/bar` by wrapping the `foo`
battery (ie, in Hoon, `|%`) around it.  With the core above,
you can compute `foo` stuff, `bar` stuff, and `moo` stuff.
Rocket science, not.

Not all cores are static, of course - they may contain live data,
like the sample in a gate (ie, argument to a function).  Once
again, it's important to remember that we track jet bindings not
by the core, which may not be static, but by the battery, which
is always static.

(And if you're wondering how we can use a deep noun like a Nock
formula or battery as a key in a key-value table, remember
`mug_w`, the lazily computed short hash, in all boxed nouns.)

In any case, `das`, the dashboard, is a map from `bash` to jet
location record (`++clog`).  A `clog` in turn contains two kinds
of information: the `++cope`, or per-location noun; and a map of
batteries to a per-battery `++club`.

The `cope` is a triple of `++bane` (battery name, right now just
a `term`); `++axis`, the axis, within **this** core, of the parent;
and `(each bash noun)`, which is either `[0 bash]` if the parent
is another core, or `[1 noun]`, for the constant noun (like
`164`) if there is no parent core.

A `bash` is just the noun hash (`++sham`) of a `cope`, which
uniquely expresses the battery's hierarchical location without
depending on the actual formulas.

The `club` contains a `++corp`, which we use to actually validate
the core.  Obviously jet execution has to be perfectly compatible
with Nock.  We search on the battery, but getting the battery
right is not enough - a typical battery is dependent on its
context.  For example, your jet-propelled library function is
very likely to call `++dec` or other advanced kernel technology.
If you've replaced the kernel in your context with something
else, we need to detect this and not run the jet.

There are two cases for a jet-propelled core - either the entire
core is a static constant, or it isn't.  Hence the definition
of `corp`:

```hoon
++  corp  (each core batt)                ::  parent or static
```

Ie, a `corp` is `[0 core]` or `[1 batt]`.  If it's static -
meaning that the jet only works with one specific core, ie, the
parent axis of each location in the hierarchy is `3` - we can
validate with a single comparison.  Otherwise, we have to recurse
upward by checking the parent.

Note that there is at present no way to force a jet to depend on
static **data**.

### u3j: the warm jet dashboard

We don't use the cold state to match jets as we call them.  We
use the cold state to register jets as we find them, and also to
rebuild the warm state after the hot state is reset.

What we actually use at runtime is the warm state, `jed->har_p`,
which is a `u3h` (built-in hashtable), allocated on the loom,
from battery to `++calx`.

A `calx` is a triple of a `++calf`, a `[bash cope]` cell, and a
`club`.  The latter two are all straight from cold state.

The `calf` contains warm data dependent on hot state.  It's a
quadruple: of `jax`, the hot driver index (in `ray_u` in
`u3j_dash`); `hap`, a table from arm axis (ie, the axis of each
formula within the battery) to driver arm index (into `arm_u` in
`u3j_core`); `lab`, the complete label path; and  `jit`, any
other dynamic data that may speed up execution.

We construct `hap`, when we create the calx, by iterating through
the arms registered in the `u3j_core`.  Note the way a `u3j_harm`
declares itself, with the string `fcs_c` which can contain either
an axis or a name.  Most jetted cores are of course gates, which
have one formula at one axis within the core: `fcs_c` is `".3"`.

But we do often have fast cores with more complex arm structure,
and it would be sad to have to manage their axes by hand.  To use
an `fcs_c` with a named arm, it's sufficient to make sure the
name is bound to a formula `[0 axis]` in the hook table.

`jit`, as its name suggests, is a stub where any sort of
optimization data computed on battery registration might go.  To
use it, fill in the `_cj_jit()` function.

### u3j: the hot dashboard

Now it should be easy to see how we actually invoke jets.  Every
time we run a nock `9` instruction (pretty often, obviously), we
have a core and an axis.  We pass these to `u3j_kick()`, which
will try to execute them.

Because nouns with a reference count of 1 are precious,
`u3j_kick()` has a tricky reference control definition.  It
reserves the right to return `u3_none` in the case where there is
no driver, or the driver does not apply for this case; in this
case, it retains argument `cor`.  If it succeeds, though, it
transfers `cor`.

`u3j_kick()` searches for the battery (always the head of the
core, of course) in the hot dashboard.  If the battery is
registered, it searches for the axis in `hap` in the `calx`.
If it exists, the core matches a driver and the driver jets this
arm.  If not, we return `u3_none`.

Otherwise, we call `fun_f` in our `u3j_harm`.  This obeys the
same protocol as `u3j_kick()`; it can refuse to function by
returning `u3_none`, or consume the noun.

Besides the actual function pointer `fun_f`, we have some flags
in the `u3j_harm` which tell us how to call the arm function.

If `ice` is yes (`&`, `0`), the jet is known to be perfect and we
can just trust the product of `fun_f`.  Otherwise, we need to run
**both** the Nock arm and `fun_f`, and compare their results.

(Note that while executing the C side of this test, we have to
set `ice` to yes; on the Nock side, we have to set `liv` to no.
Otherwise, many non-exponential functions become exponential.
When auto-testing jets in this way, the principle is that the
test is on the outermost layer of recursion.)

(Note also that anyone who multi-threads this execution
environment has a slight locking problem with these flags if arm
testing is multi-threaded.)

If `tot` is yes, (`&`, `0`), the arm function is **total** and has
to return properly (though it can still return **u3_none**).
Otherwise, it is **partial** and can `u3_cm_bail()` out with
c3__punt.  This feature has a cost: the jet runs in a subroad.

Finally, if `liv` is no (`|`, 1), the jet is off and doesn't run.

It should be easy to see how the tree of cores gets declared -
precisely, in `j/dash.c`.  We declare the hierarchy as a tree
of `u3j_core` structures, each of which comes with a static list
of arms `arm_u` and sub-cores `dev_u`.

In `u3j_boot()`, we traverse the hierarchy, fill in parent
pointers `par_u`, and enumerate all `u3j_core` structures
into a single flat array `u3j_dash.ray_u`.  Our hot state
then appears ready for action.

### u3j: jet functions

At present, all drivers are compiled statically into `u3`.  This is
not a long-term permanent solution or anything.  However, it will
always be the case with a certain amount of core functionality.

For instance, there are some jet functions that we need to call
as part of loading the Arvo kernel - like `++cue` to unpack a
noun from an atom.  And obviously it makes sense, when jets are
significant enough to compile into `u3`, to export their symbols
in headers and the linker.

There are three interface prefixes for standard jet functions:
`u3k`, `u3q`, and `u3w`.  All jets have `u3w` interfaces; most
have `u3q`; some have `u3k`.  Of course the actual logic is
shared.

`u3w` interfaces use the same protocol as `fun_f` above: the
caller passes the entire core, which is retained if the function
returns `u3_none`, transferred otherwise.  Why?   Again, use
counts of 1 are special and precious for performance hackers.

`u3q` interfaces break the core into C arguments, **retain** noun
arguments, and **transfer** noun returns.  `u3k` interfaces are the
same, except with more use of `u3_none` and other simple C
variations on the Hoon original, but **transfer** both arguments
and returns.  Generally, `u3k` are most convenient for new code.

Following `u3k/q/w` is `[a-f]`, corresponding to the 6 logical
tiers of the kernel, or `g` for user-level jets.  Another letter
is added for functions within subcores.  The filename, under
`j/`, follows the tier and the function name.

For instance, `++add` is `u3wa_add(cor)`, `u3qa_add(a, b)`, or
`u3ka_add(a, b)`, in `j/a/add.c`.  `++get` in `++by` is
`u3wdb_get(cor)`, `u3kdb_get(a, b)`, etc, in `j/d/by_get.c`.

For historical reasons, all internal jet code in `j/[a-f]`
**retains** noun arguments, and **transfers** noun results.  Please
do not do this in new `g` jets!  The new standard protocol is to
transfer both arguments and results.

## u3a: allocation functions

`u3a` allocates on the current road (u3R).  Its internal
structures are uninteresting and typical of a naive allocator.

The two most-used `u3a` functions are `u3a_gain()` to add a
reference count,  and `u3a_lose()` to release one (and free the
noun, if the use count is zero).  For convenience, `u3a_gain()`
returns its argument.  The pair are generally abbreviated with
the macros `u3k()` and `u3z()` respectively.

Normally we create nouns through `u3i` functions, and don't call
the `u3a` allocators directly.  But if you do:

One, there are **two** sets of allocators: the word-aligned
allocators and the fully-aligned (ie, malloc compatible)
allocators.  For instance, on a typical OS X setup, malloc
produces 16-byte aligned results - needed for some SSE
instructions.

These allocators are **not compatible**.  For 32-bit alignment
as used in nouns, call

```c
    /* u3a_walloc(): allocate storage measured in words.
    */
      void*
      u3a_walloc(c3_w len_w);

    /* u3a_wfree(): free storage.
    */
      void
      u3a_wfree(void* lag_v);

    /* u3a_wealloc(): word realloc.
    */
      void*
      u3a_wealloc(void* lag_v, c3_w len_w);
```

For full alignment, call:

```c
    /* u3a_malloc(): aligned storage measured in bytes.
    */
      void*
      u3a_malloc(size_t len_i);

    /* u3a_realloc(): aligned realloc in bytes.
    */
      void*
      u3a_realloc(void* lag_v, size_t len_i);

    /* u3a_realloc2(): gmp-shaped realloc.
    */
      void*
      u3a_realloc2(void* lag_v, size_t old_i, size_t new_i);

    /* u3a_free(): free for aligned malloc.
    */
      void
      u3a_free(void* tox_v);

    /* u3a_free2(): gmp-shaped free.
    */
      void
      u3a_free2(void* tox_v, size_t siz_i);
```

There are also a set of special-purpose allocators for building
atoms.  When building atoms, please remember that it's incorrect
to have a high 0 word - the word length in the atom structure
must be strictly correct.

Of course, we don't always know how large our atom will be.
Therefore, the standard way of building large atoms is to
allocate a block of raw space with `u3a_slab()`, then chop off
the end with `u3a_malt()` (which does the measuring itself)
or `u3a_mint()` in case you've measured it yourself.

Once again, **do not call `malloc()`** (or C++ `new`) within any
code that may be run within a jet.  This will cause rare sporadic
corruption when we interrupt execution within a `malloc()`.  We'd
just override the symbol, but `libuv` uses `malloc()` across
threads within its own synchronization primitives - for this to
work with `u3a_malloc()`, we'd have to introduce our own locks on
the surface-level road (which might be a viable solution).

## u3n: nock execution

The `u3n` routines execute Nock itself.  On the inside, they have
a surprising resemblance to the spec proper (the only interesting
detail is how we handle tail-call elimination) and are, as one
would expect, quite slow.  (There is no such thing as a fast tree
interpreter.)

There is only one Nock, but there are lots of ways to call it.
(Remember that all `u3n` functions **transfer** C arguments and
returns.)

The simplest interpreter, `u3n_nock_on(u3_noun bus, u3_noun fol)`
invokes Nock on `bus` (the subject) and `fol` (the formula).
(Why is it`[subject formula]`, not `[formula subject]`?  The same
reason `0` is true and `1` is false.)

A close relative is `u3n_slam_on(u3_noun gat, u3_noun sam)`,
which slams a **gate** (`gat`) on a sample (`sam`).  (In a normal
programming language which didn't talk funny and was retarded,
`u3n_slam_on()` would call a function on an argument.)  We could
write it most simply as:

```c
    u3_noun
    u3n_slam_on(u3_noun gat, u3_noun sam)
    {
      u3_noun pro = u3n_nock_on
                      (u3nc(u3k(u3h(gat)),
                            u3nc(sam, u3k(u3t(u3t(gat))))),
                       u3k(u3h(gat)));
      u3z(gat);
      return pro;
    }
```

Simpler is `u3n_kick_on(u3_noun gat)`, which slams a gate (or,
more generally, a **trap** - because sample structure is not even
needed here) without changing its sample:

```c
    u3_noun
    u3n_kick_on(u3_noun gat, u3_noun sam)
    {
      return u3n_nock_on(gat, u3k(u3h(gat)));
    }
```

The `_on` functions in `u3n` are all defined as pure Nock.  But
actually, even though we say we don't extend Nock, we do.  But we
don't.  But we do.

Note that `u3` has a well-developed error handling system -
`u3m_bail()` to throw an exception, `u3m_soft_*` to catch one.
But Nock has no exception model at all.  That's okay - all it
means if that if an `_on` function bails, the exception is an
exception in the caller.

However, `u3`'s exception handling happens to match a convenient
virtual super-Nock in `hoon.hoon`, the infamous `++mock`.  Of
course, Nock is slow, and `mock` is Nock in Nock, so it is
(logically) super-slow.  Then again, so is decrement.

With the power of `u3`, we nest arbitrary layers of `mock`
without any particular performance cost.  Moreover, we simply
treat Nock proper as a special case of `mock`.  (More precisely,
the internal VM loop is `++mink` and the error compiler is
`++mook`.  But we call the whole sandbox system `mock`.)

The nice thing about `mock` functions is that (by executing
within `u3m_soft_run()`, which as you may recall uses a nested
road) they provide both exceptions and the namespace operator -
`.^` in Hoon, which becomes operator `11` in `mock`.

`11` requires a namespace function, or `fly`, which produces a
`++unit` - `~` (`0`) for no binding, or `[0 value]`.  The sample
to a `fly` is a `++path`, just a list of text `span`.

`mock` functions produce a `++toon`.  Fully elaborated:

```hoon
    ++  noun  ,*                                      ::  any noun
    ++  path  (list ,@ta)                             ::  namespace path
    ++  span  ,@ta                                    ::  text-atom (ASCII)
    ++  toon  $%  [%0 p=noun]                         ::  success
                  [%1 p=(list path)]                  ::  blocking paths
                  [%2 p=(list tank)]                  ::  stack trace
              ==                                      ::
    ++  tank                                          ::  printable
              $%  [%leaf p=tape]                      ::  flat text
                  $:  %palm                           ::  backstep list
                      p=[p=tape q=tape r=tape s=tape] ::  mid cap open close
                      q=(list tank)                   ::  contents
                  ==                                  ::
                  $:  %rose                           ::  straight list
                      p=[p=tape q=tape r=tape]        ::  mid open close
                      q=(list tank)                   ::  contents
                  ==                                  ::
              ==
```

(Note that `tank` is overdesigned and due for replacement.)

What does a `toon` mean?  Either your computation succeeded (`[0
noun]`, or could not finish because it blocked on one or more
global paths (`[1 (list path)]`), or it exited with a stack trace
(`[2 (list tank)]`).

Note that of all the `u3` exceptions, only `%exit` is produced
deterministically by the Nock definition.  Therefore, only
`%exit` produces a `2` result.  Any other argument to
`u3m_bail()` will unwind the virtualization stack all the way to
the top - or to be more exact, to `u3m_soft_top()`.

In any case, the simplest `mock` functions are `u3n_nock_un()`
and `u3n_slam_un()`.  These provide exception control without
any namespace change, as you can see by the code:

```c
    /* u3n_nock_un(): produce .*(bus fol), as ++toon.
    */
    u3_noun
    u3n_nock_un(u3_noun bus, u3_noun fol)
    {
      u3_noun fly = u3nt(u3nt(11, 0, 6), 0, 0);  //  |=(a=* .^(a))

      return u3n_nock_in(fly, bus, fol);
    }

    /* u3n_slam_un(): produce (gat sam), as ++toon.
    */
    u3_noun
    u3n_slam_un(u3_noun gat, u3_noun sam)
    {
      u3_noun fly = u3nt(u3nt(11, 0, 6), 0, 0);  //  |=(a=* .^(a))

      return u3n_slam_in(fly, gat, sam);
    }
```

The `fly` is added as the first argument to `u3n_nock_in()` and
`u3n_slam_in()`.  Of course, logically, `fly` executes in the
caller's exception layer.  (Maintaining this illusion is slightly
nontrivial.)  Finally, `u3n_nock_an()` is a sandbox with a null
namespace.

## u3e: persistence

The only `u3e` function you should need to call is `u3e_save()`,
which saves the loom.  As it can be restored on any platform,
please make sure you don't have any state in the loom that is
bound to your process or architecture - except for exceptions
like the warm jet state, which is actively purged on reboot.

## u3r: reading nouns (weak)

As befits accessors they don't make anything, `u3r` noun reading
functions always retain their arguments and their returns.  They
never bail; rather, when they don't work, they return a `u3_weak`
result.

Most of these functions are straightforward and do only what
their comments say.  A few are interesting enough to discuss.

`u3r_at()` is the familiar tree fragment function, `/` from the
Nock spec.  For taking complex nouns apart, `u3r_mean()` is a
relatively funky way of deconstructing nouns with a varargs list
of `axis`, `u3_noun *`.  For cells, triples, etc, decompose with
`u3r_cell()`, `u3r_trel()`, etc.  For the tagged equivalents, use
`u3r_pq()` and friends.

`u3r_sing(u3_noun a, u3_noun b)` (true if `a` and `b` are a
**single** noun) are interesting because it uses mugs to help it
out.  Clearly, different nouns may have the same mug, but the
same nouns cannot have a different mug.  It's important to
understand the performance characteristics of `u3r_sing()`:
the worst possible case is a comparison of duplicate nouns,
which have the same value but were created separately.  In this
case, the tree is traversed

`u3r_sung()` is a deeply funky and frightening version of
`u3r_sing()` that unifies pointers to the duplicate nouns it
finds, freeing the second copy.  Obviously, do not use
`u3r_sung()` when you have live, but not reference counted, noun
references from C - if they match a noun with a refcount of 1
that gets freed, bad things happen.

It's important to remember that `u3r_mug()`, which produces a
31-bit, nonzero insecure hash, uses the `mug_w` slot in any boxed
noun as a lazy cache.  There are a number of variants of
`u3r_mug()` that can get you out of building unneeded nouns.

## u3x: reading nouns (bail)

`u3x` functions are like `u3r` functions, but instead of
returning `u3_none` when (for instance) we try to take the head
of an atom, they bail with `%exit`.  In other words, they do what
the same operation would do in Nock.

## u3h: hash tables.

We can of course use the Hoon `map` structure as an associative
array.  This is a balanced treap and reasonably fast.  However,
it's considerably inferior to a custom structure like an HAMT
(hash array-mapped trie).  We use `u3_post` to allocate HAMT
structures on the loom.

(Our HAMT implements the classic Bagwell algorithm which depends
on the `gcc` standard directive `__builtin_popcount()`.  On a CPU
which doesn't support popcount or an equivalent instruction, some
other design would probably be preferable.)

There's no particular rocket science in the API. `u3h_new()`
creates a hashtable; `u3h_free()` destroys one; `u3h_put()`
inserts, `u3h_get()` retrieves.  You can transform values in a
hashtable with `u3h_walk()`.

The only funky function is `u3h_gut()`, which unifies keys with
`u3r_sung()`.  As with all cases of `u3r_sung()`, this must be
used with extreme caution.

## u3z: memoization

Connected to the `~+` rune in Hoon, via the Nock `%memo` hint,
the memoization facility is a general-purpose cache.

(It's also used for partial memoization - a feature that'll
probably be removed, in which conservative worklist algorithms
(which would otherwise be exponential) memoize everything in the
subject **except** the worklist.  This is used heavily in the Hoon
compiler jets (j/f/*.c).  Unfortunately, it's probably not
possible to make this work perfectly in that it can't be abused
to violate Nock, so we'll probably remove it at a later date,
instead making `++ut` keep its own monadic cache.)

Each `u3z` function comes with a `c3_m` mote which disambiguates
the function mapping key to value.  For Nock itself, use 0.  For
extra speed, small tuples are split out in C; thus, find with

```c
    u3_weak u3z_find(c3_m, u3_noun);
    u3_weak u3z_find_2(c3_m, u3_noun, u3_noun);
    u3_weak u3z_find_3(c3_m, u3_noun, u3_noun, u3_noun);
    u3_weak u3z_find_4(c3_m, u3_noun, u3_noun, u3_noun, u3_noun);
```

and save with

```c
    u3_noun u3z_save(c3_m, u3_noun, u3_noun);
    u3_noun u3z_save_2(c3_m, u3_noun, u3_noun, u3_noun);
    u3_noun u3z_save_3(c3_m, u3_noun, u3_noun, u3_noun, u3_noun);
    u3_noun u3z_save_4(c3_m, u3_noun, u3_noun, u3_noun, u3_noun, u3_noun);
```

where the value is the last argument.  To eliminate duplicate
nouns, there is also

```c
    u3_noun
    u3z_uniq(u3_noun);
```

`u3z` functions retain keys and transfer values.

The `u3z` cache, built on `u3h` hashes, is part of the current
road, and goes away when it goes away.  (In future, we may wish
to promote keys/values which outlive the road, as we do with jet
state.)  There is no cache reclamation at present, so be careful.

## u3t: tracing and profiling.

TBD.

## u3v: the Arvo kernel

An Arvo kernel - or at least, a core that compiles with the Arvo
interface - is part of the global `u3` state.  What is an Arvo
core?  Slightly pseudocoded:

```hoon
    ++  arvo
      |%
      ++  come  |/  {yen/@ ova/(list ovum) nyf/pone}  ::  11
                ^-  {(list ovum) _+>}
                !!
      ++  keep  |/  {now/@da hap/path}                ::  4
                ^-  (unit ,@da)
                !!
      ++  load  |/  {yen/@ ova/(list ovum) nyf/pane}  ::  86
                ^-  {(list ovum) _+>}
                !!
      ++  peek  |/  {now/@da path}                    ::  87
                ^-  (unit)
                !!
      ++  poke  |/  {now/@da ovo/ovum}                ::  42
                ^-  {(list ovum) _+>}
                !!
      ++  wish  |/  txt/@ta                           ::  20
                ^-  *
                !!
      --
    ++  card  {p/@tas q/*}                           ::  typeless card
    ++  ovum  {p/wire q/card}                        ::  Arvo event
    ++  wire  path                                    ::  event cause
```

This is the Arvo ABI in a very real sense.  Arvo is a core with
these six arms.  To use these arms, we hardcode the axis of the
formula (`11`, `4`, `86`, etc) into the C code that calls Arvo,
because otherwise we'd need type metadata - which we can get, by
calling Arvo.

It's important to understand the Arvo event/action structure, or
`++ovum`.  An `ovum` is a `card`, which is any `[term noun]`
cell, and a `++wire`, a `path` which indicates the location of
the event.  At the Unix level, the `wire` corresponds to a system
module or context.  For input events, this is the module that
caused the event; for output actions, it's the module that
performs the action.

`++poke` sends Arvo an event `ovum`, producing a cell of action
ova and a new Arvo core.

`++peek` dereferences the Arvo namespace.  It takes a date and a
key, and produces `~` (`0`) or `[~ value]`.

`++keep` asks Arvo the next time it wants to be woken up, for the
given `wire`.  (This input will probably be eliminated in favor
of a single global timer.)

`++wish` compiles a string of Hoon source.  While just a
convenience, it's a very convenient convenience.

`++come` and `++load` are used by Arvo to reset itself (more
precisely, to shift the Arvo state from an old kernel to a new
one); there is no need to call them from C.

Now that we understand the Arvo kernel interface, let's look at
the `u3v` API.  As usual, all the functions in `u3v` are
commented, but unfortunately it's hard to describe this API as
clean at present.  The problem is that `u3v` remains design
coupled to the old `vere` event handling code written for `u2`.
But let's describe the functions you should be calling, assuming
you're not writing the next event system.  There are only two.

`u3v_wish(str_c)` wraps the `++wish` functionality in a cache
(which is read-only unless you're on the surface road).

`u3v_do()` uses `wish` to provide a convenient interface for
calling Hoon kernel functions by name.  Even more conveniently,
we tend to call `u3v_do()` with these convenient aliases:

```c
    #define  u3do(txt_c, arg)         u3v_do(txt_c, arg)
    #define  u3dc(txt_c, a, b)        u3v_do(txt_c, u3nc(a, b))
    #define  u3dt(txt_c, a, b, c)     u3v_do(txt_c, u3nt(a, b, c))
    #define  u3dq(txt_c, a, b, c, d)  u3v_do(txt_c, u3nt(a, b, c, d))
```

##  Code Mnemonics

| Shorthand | Expansion | Meaning |
| --- | --- | --- |
| `u3A` | `(&(u3v_Home->arv_u))` | Arvo |
| `u3C` | `u3o_Config` | command line options |
| `u3D` | `u3j_Dash` | jet dashboard |
| `u3H` | `u3v_Home` | home road |
| `u3P` | `u3e_Pool` | snapshotting system |
| `u3R` | `u3a_Road` | current road |
| `u3T` | `u3t_Trace` | tracing profiler |
