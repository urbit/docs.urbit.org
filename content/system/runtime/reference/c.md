+++
title = "C in Urbit"
weight = 4
+++
Under `u3` is the simple `c3` layer, which is just how we write C
in Urbit.

When writing C in u3, please of course follow the conventions of
the code around you as regards indentation, etc.  It's especially
important that every function have a header comment, even if it
says nothing interesting.

But some of our idiosyncrasies go beyond convention.  Yes, we've
done awful things to C. Here's what we did and why we did.

## c3: integer types

First, it's generally acknowledged that underspecified integer
types are C's worst disaster.  C99 fixed this, but the `stdint`
types are wordy and annoying.  We've replaced them with:

```c
    /* Good integers.
    */
      typedef uint64_t c3_d;  // double-word
      typedef int64_t c3_ds;  // signed double-word
      typedef uint32_t c3_w;  // word
      typedef int32_t c3_ws;  // signed word
      typedef uint16_t c3_s;  // short
      typedef int16_t c3_ss;  // signed short
      typedef uint8_t c3_y;   // byte
      typedef int8_t c3_ys;   // signed byte
      typedef uint8_t c3_b;   // bit

      typedef uint8_t c3_t;   // boolean
      typedef uint8_t c3_o;   // loobean
      typedef uint8_t c3_g;   // 5-bit atom for a 32-bit log.
      typedef uint32_t c3_l;  // little; 31-bit unsigned integer
      typedef uint32_t c3_m;  // mote; also c3_l; LSB first a-z 4-char string.

    /* Bad integers.
    */
      typedef char      c3_c; // does not match int8_t or uint8_t
      typedef int       c3_i; // int - really bad
      typedef uintptr_t c3_p; // pointer-length uint - really really bad
      typedef intptr_t c3_ps; // pointer-length int - really really bad
```

Some of these need explanation.  A loobean is a Nock boolean -
Nock, for mysterious reasons, uses 0 as true (always say "yes")
and 1 as false (always say "no").

Nock and/or Hoon cannot tell the difference between a short atom
and a long one, but at the `u3` level every atom under `2^31` is
direct.  The `c3_l` type is useful to annotate this.  A `c3_m` is
a **mote** - a string of up to 4 characters in a `c3_l`, least
significant byte first.  A `c3_g` should be a 5-bit atom.  Of
course, C cannot enforce these constraints, only document them.

Use the "bad" - ie, poorly specified - integer types only when
interfacing with external code that expects them.

An enormous number of motes are defined in `i/c/motes.h`.  There
is no reason to delete motes that aren't being used, or even to
modularize the definitions.  Keep them alphabetical, though.

## c3: variables and variable naming

The C3 style uses Hoon style TLV variable names, with a quasi
Hungarian syntax.  This is weird, but works really well, as long
as what you're doing isn't hideously complicated.  (Then it works
badly, but we shouldn't need anything hideous in u3.)

A TLV variable name is a random pronounceable three-letter
string, sometimes with some vague relationship to its meaning,
but usually not.  Usually CVC (consonant-vowel-consonant) is a
good choice.

You should use TLVs much the way math people use Greek letters.
The same concept should in general get the same name across
different contexts.  When you're working in a given area, you'll
tend to remember the binding from TLV to concept by sheer power
of associative memory.  When you come back to it, it's not that
hard to relearn.  And of course, when in doubt, comment it.

Variables take pseudo-Hungarian suffixes, matching in general the
suffix of the integer type:

```c
c3_w wor_w;     //  32-bit word
```

Unlike in standard Hungarian, there is no change for pointer
variables.  C structure variables take a `_u` suffix.

## c3: loobeans

The code (from `defs.h`) tells the story:

```c
    #     define c3y      0
    #     define c3n      1

    #     define _(x)        (c3y == (x))
    #     define __(x)       ((x) ? c3y : c3n)
    #     define c3a(x, y)   __(_(x) && _(y))
    #     define c3o(x, y)   __(_(x) || _(y))
```

In short, use `_()` to turn a loobean into a boolean, `__` to go
the other way.  Use `!` as usual, `c3y` for yes and `c3n` for no,
`c3a` for and and `c3o` for or.
