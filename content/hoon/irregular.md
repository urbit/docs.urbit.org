---
description: Reference guide to Hoon's irregular syntax forms, showing both the irregular and regular forms for common patterns with quick lookup table and detailed explanations.
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

# Irregular forms

While Hoon has a large amount of sugar syntax, some forms that may look irregular are actually regular wing syntax or another language feature, such as `,`.

When in doubt, you can use the [`!,` zapcom](rune/zap.md#zapcom) rune to determine the AST to which Hoon parses an expression.

```
> !,(*hoon c.b.a)
[%wing p=~[%c %b %a]]
```

## Quick Lookup of Irregular Forms <a href="#quick-lookup-of-irregular-forms" id="quick-lookup-of-irregular-forms"></a>

| Form                 | Regular Form                                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `_foo`               | [`$_`](rune/buc.md#buccab), normalizes to an example                                                                             |
| `foo@bar`            | [`$@`](rune/buc.md#bucpat), normalizes to a type union of an atom and a cell                                                     |
| `foo=bar`            | [`$=`](rune/buc.md#buctis), wraps a face around a value                                                                          |
| `?(%foo %bar %baz)`  | [`$?`](rune/buc.md#bucwut), forms a type union                                                                                   |
| `(foo a b c)`        | [`%:`](rune/cen.md#cencol), calls a gate with _n_ arguments                                                                      |
| `~(arm core arg)`    | [`%~`](rune/cen.md#censig), pulls an arm in a door                                                                               |
| `foo(a 1, b 2, c 3)` | [`%=`](rune/cen.md#centis), resolve a wing with changes                                                                          |
| `[foo bar]`          | [`:-`](rune/col.md#colhep), constructs a cell                                                                                    |
| `[a b c]`            | [`:*`](rune/col.md#coltar) or [`$:`](rune/buc.md#buccol), constructs _n_-tuple in normal mode or its structure in structure mode |
| `~[a b c]`           | [`:~`](rune/col.md#colsig), constructs null-terminated list                                                                      |
| `+(42)`              | [`.+`](rune/dot.md#dotlus), increments with Nock 4                                                                               |
| `=(a b)`             | [`.=`](rune/dot.md#dottis), tests for equality with Nock 5                                                                       |
| `` `foo`bar ``       | [`^-`](rune/ket.md#kethep), typecasts by explicit type label                                                                     |
| `=foo` or `foo=bar`  | [`^=`](rune/ket.md#kettis), binds name to value                                                                                  |
| `*foo`               | [`^*`](rune/ket.md#kettar), bunts (produces default mold value)                                                                  |
| `,foo`               | [`^:`](rune/ket.md#ketcol), produces “factory” gate for type                                                                     |
| `:(fun a b c d)`     | [`;:`](rune/mic.md#miccol), calls binary function as _n_-ary function                                                            |
| `foo:bar`            | [`=<`](rune/tis.md#tisgal), composes two expressions, inverted                                                                   |
| `\|(foo bar baz)`    | [`?\|`](rune/wut.md#wutbar), logical OR (loobean)                                                                                |
| `&(foo bar baz)`     | [`?&`](rune/wut.md#wutpam), logical AND (loobean)                                                                                |
| `!foo`               | [`?!`](rune/wut.md#wutzap), logical NOT (loobean)                                                                                |

\
\


**Reading guide**

Headings contain runes, phonetics and tokens. Description contains a link to the docs and a short description of the rune. Both regular and irregular forms are given.

Want to `Ctrl-f` to find out the meaning of something weird you saw? Search for "\symbol". ie `\?` or `\=`. It'll show you to the irregular forms that uses that symbol.

## `.` dot (nock) <a href="#dot-nock" id="dot-nock"></a>

Anything Nock can do, Hoon can do also.

### `.+` dotlus <a href="#dotlus" id="dotlus"></a>

[docs](rune/dot.md#dotlus) \\+

`[%dtls p=atom]`: increment an atom with Nock 4.

Regular: `.+(p)`

Irregular: `+(p)`

### `.=` dottis <a href="#dottis" id="dottis"></a>

[docs](rune/dot.md#dottis) \\=

`[%dtts p=hoon q=hoon]`: test for equality with Nock 5.

Regular: `.=(p q)`

Irregular: `=(p q)`

## `;` mic (make) <a href="#mic-make" id="mic-make"></a>

Miscellaneous useful macros.

### `;:` miccol <a href="#miccol" id="miccol"></a>

[docs](rune/mic.md#miccol) \\:

`[%mccl p=hoon q=(list hoon)]`: call a binary function as an n-ary function.

Regular: `;:(p q)`

Irregular: `:(p q)`

## `:` col (cells) <a href="#col-cells" id="col-cells"></a>

The cell runes.

### `:-` colhep <a href="#colhep" id="colhep"></a>

[docs](rune/col.md#colhep) \\\[\\]\\^\\/\\+\\\`\\\~

`[%clhp p=hoon q=hoon]`: construct a cell (2-tuple).

Regular: `:-(p q)`

Irregular:

```
  [a b]   ==>   :-(a b)
[a b c]   ==>   [a [b c]]
  a^b^c   ==>   [a b c]
    a/b   ==>   [%a b]
    a+b   ==>   [%a b]
     `a   ==>   [~ a]
 ~[a b]   ==>   [a b ~]
  [a b]~  ==>   [[a b] ~]
```

## `=` tis (flow) <a href="#tis-flow" id="tis-flow"></a>

Flow runes change the subject. All non-flow runes (except cores) pass the subject down unchanged.

### `=<` tisgal <a href="#tisgal" id="tisgal"></a>

[docs](rune/tis.md#tisgal) \\:

`[%tsgl p=hoon q=hoon]`: compose two hoons, inverted.

Regular: `=<(p q)`

Irregular: `p:q`

## `|` bar (core) <a href="#bar-core" id="bar-core"></a>

[docs](rune/bar.md) \\$

Core runes are flow hoon.

Technically not irregular syntax, but worth mentioning.

* `|= bartis`
* `|. bardot`
* `|- barhep`
* `|* bartar`

The above runes produce a core with a single arm, named `$` ("buc"). We can recompute this arm with changes, useful for recursion among other things. Commonly used with the irregular syntax for `%=`, `:make`, like so: `$()`.

## `%` cen (call) <a href="#cen-call" id="cen-call"></a>

The invocation family of runes.

### `%=` centis <a href="#centis" id="centis"></a>

[docs](rune/cen.md#centis) \\(\\)

`[%cnts p=wing q=(list (pair wing hoon))]`: take a wing with changes.

Regular: `%=(p a 1)`

Irregular: `p(a 1)`

### `%~` censig <a href="#censig" id="censig"></a>

[docs](rune/cen.md#censig) \\\~

`[%cnsg p=wing q=hoon r=hoon]`: call with multi-armed door.

Regular: `%~(p q r)`

Irregular: `~(p q r)`

### `%-` cenhep <a href="#cenhep" id="cenhep"></a>

[docs](rune/cen.md#cenhep) \\(\\)

`[%cnhp p=hoon q=hoon]`: call a gate (function).

Regular: `%-(p q)`

Irregular: `(p q)`

Note: `(p)` becomes `$:p` (`=<($ p)`), which behaves as you would expect (function call without arguments).

## `$` buc (mold) <a href="#buc-mold" id="buc-mold"></a>

A mold is a gate (function) that helps us build simple and rigorous data structures.

### `$?` bucwut <a href="#bucwut" id="bucwut"></a>

[docs](rune/buc.md#bucwut) \\?

`[%bcwt p=(list model)]`: mold which normalizes a general union.

Regular: `$?(p)`

Irregular: `?(p)`

### `$_` buccab <a href="#buccab" id="buccab"></a>

[docs](rune/buc.md#buccab) \\\_

`[%bccb p=value]`: mold which normalizes to an example.

Regular: `$_(p)`

Irregular: `_p`

### `$=` buctis <a href="#buctis" id="buctis"></a>

[docs](rune/buc.md#buctis) \\=

`[%bcts p=skin q=spec]`: wraps a face around a structure.

Regular:

```
$=(p q)
```

Irregular:

```
 p=q   ==>   $=(p q)
  =q   ==>   q=q
=p=q   ==>   p-q=q
```

## `?` wut (test) <a href="#wut-test" id="wut-test"></a>

Hoon has the usual branches and logical tests.

### `?!` wutzap <a href="#wutzap" id="wutzap"></a>

[docs](rune/wut.md#wutzap) \\!

`[%wtzp p=hoon]`: logical not.

Regular: `?!(p)`

Irregular: `!(p)`

### `?&` wutpam <a href="#wutpam" id="wutpam"></a>

[docs](rune/wut.md#wutpam) \\&

`[%wtpm p=(list hoon)]`: logical AND.

Regular: `?&(p)`

Irregular: `&(p)`

### `?|` wutbar <a href="#wutbar" id="wutbar"></a>

[docs](rune/wut.md#wutbar) \\|

`[%wtbr p=(list hoon)]`: logical OR.

Regular: `?|(p)`

Irregular: `|(p)`

## `^` ket (cast) <a href="#ket-cast" id="ket-cast"></a>

Lets us adjust types without violating type constraints.

### `^:` ketcol <a href="#ketcol" id="ketcol"></a>

[docs](rune/ket.md#ketcol) \\,

`[%ktcl p=spec]`: mold gate for type `.p`.

Regular: `^:(p)`

Irregular: `,p`

### `^-` kethep <a href="#kethep" id="kethep"></a>

[docs](rune/ket.md#kethep) \\\`

`[%kthp p=model q=value]`: typecast by mold.

Regular: `^-(p q)`

Irregular: `` `p`q ``

### `^*` kettar <a href="#kettar" id="kettar"></a>

[docs](rune/ket.md#kettar) \\\*

`[%kttr p=spec]`: produce bunt value of mold.

Regular: `^*(p)`

Irregular: `*p`

### `^=` kettis <a href="#kettis" id="kettis"></a>

[docs](rune/ket.md#kettis) \\=

`[%ktts p=toga q=value]`: name a value.

Regular: `^=(p q)`

Irregular: `p=q`

## Miscellaneous <a href="#miscellaneous" id="miscellaneous"></a>

### Trivial molds <a href="#trivial-molds" id="trivial-molds"></a>

\\\*\\@\\^\\?\\\~

* `*` noun.
* `@` atom.
* `^` cell.
* `?` loobean.
* `~` null.

### Values <a href="#values" id="values"></a>

\\\~\\&\\|\\%

* `~` null.
* `&` loobean true.
* `|` loobean false.
* `%a` constant `a`, where `a` can be an ((ir)regularly defined) atom or a symbol.

See [%sand](rune/constants.md#warm) for other irregular definitions of atoms.

### List addressing <a href="#list-addressing" id="list-addressing"></a>

\\&\\|

* `&n` _&#x6E;_&#x74;h element of a list.
* `|n` tail of list after _&#x6E;_&#x74;h element (i.e. _n_ is the head).

### Limbs <a href="#limbs" id="limbs"></a>

[docs](limbs/limb.md) \\+\\.\\^\\-

`[%limb p=(each @ud [p=@ud q=@tas])]`: attribute of subject.

* `+15` is slot 15
* `.` is the whole subject (slot 1)
* `^a` is the `.a` "of a higher scope", i.e. "resolve variable `a`, ignoring the first one found".
* `^^p` even higher, and so on.

'Lark' syntax for slots / tree addressing:

```
+1
+2 -
+3 +
+4 -<
+5 ->
+6 +<
+7 +>
+8 -<-
...
```

### Wings <a href="#wings" id="wings"></a>

[docs](limbs/wing.md) \\.

`[%wing p=(list limb)]`; a limb search path.

`a.b` finds limb `.a` within limb `.b` ("variable" `.a` within "variable" `.b`).

### Printing stuff <a href="#printing-stuff" id="printing-stuff"></a>

\\<\\>

*   `>a b c<` produces a [tank](stdlib/2q.md#tank) of the output of the contents (wrapped in cell if more than one item), formatted in pretty-print.

    ```hoon
    > >1 2 3<
    [%rose p=[p=" " q="[" r="]"] q=~[[%leaf p="1"] [%leaf p="2"] [%leaf p="3"]]]
    ```
*   `<a b c>` produces a [tape](stdlib/2q.md#tape) of the tank above (i.e. `<1 2 3>` is same as `~(ram re >1 2 3<)`).

    ```hoon
    > <1 2 3>
    "[1 2 3]"

    > <`(list @)`~[1 2 3]>
    "~[1 2 3]"
    ```

### `,` com <a href="#com" id="com"></a>

`,` can serve in several capacities in Hoon programs:

#### `,` as syntactic sugar

Sugar for the `^:` ketcol or `$;` bucmic runes, toggling structure and value mode. (Toggling out of structure mode is uncommon.)

```
> !,(*hoon ,[@t @t])
[ %ktcl
  p=[%bccl p=[i=[%base p=[%atom p=~.t]] t=[i=[%base p=[%atom p=~.t]] t=~]]]
]

> !,(*hoon |=(a=,[@t @t] b))
[ %brts
    p
  [ %bcts
    p=term=%a
      q
    [ %bcmc
      p=[%cltr p=[i=[%base p=[%atom p=~.t]] t=[i=[%base p=[%atom p=~.t]] t=~]]]
    ]
  ]
  q=[%cnts p=~[[%.y p=2] %a] q=~]
]

> !,(*hoon ,,[@t @t])
[ %ktcl
    p
  [ %bcmc
    p=[%cltr p=[i=[%base p=[%atom p=~.t]] t=[i=[%base p=[%atom p=~.t]] t=~]]]
  ]
]
```

(`$;` bucmic, or manual value mode, allows the use of value mode syntax to construct a mold. Concretely, it lets you build a mold out of `$hoon` instead of out of `$spec`. It is not commonly used.)

From value mode to structure mode:

```hoon
[%ktcl p=spec]
```

From structure mode to value mode:

```hoon
[%bcmc p=hoon]
```

#### `,` as wing syntax for stripping a face

For example, a line similar to the following is present in many Gall agents receiving HTTP requests via Eyre:

```
=/  ,request-line:server  (parse-request-line:server url.request.inbound-request)
```

This `,` lets you avoid using an outer face when handling the result.

```
> =/  ,@ud  1
  -
1
> !,(*hoon =/(,@ud 1 -))
[ %tsfs
  p=[%spec spec=[%bcmc p=[%base p=[%atom p=~.ud]]] skin=[%base base=%noun]]
  q=[%sand p=%ud q=1]
  r=[%cnts p=~[[%.y p=2]] q=~]
]
```

#### `,` as separator

For example, between pairs in an inline `%=` centis expression.

```hoon
$(i +(i), j (dec j))
```
