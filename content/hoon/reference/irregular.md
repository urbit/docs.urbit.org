# Irregular forms

While Hoon has a large amount of sugar syntax, some forms that may look irregular are actually regular wing syntax or another language feature, such as `,`.

When in doubt, you can use the [`!,` zapcom](rune/zap.md#zapcom) rune to determine the AST to which Hoon parses an expression.

```
> !,(*hoon c.b.a)
[%wing p=~[%c %b %a]]
```

## Quick Lookup of Irregular Forms {#quick-lookup-of-irregular-forms}

| Form | Regular Form |
| ---- | ------------ |
| `_foo` | [`$_`](rune/buc.md#_-buccab), normalizes to an example |
| `foo=bar` | [`$=`](rune/buc.md#buctis), wraps a face around a value |
| `?(%foo %bar %baz)` | [`$?`](rune/buc.md#bucwut), forms a type union |
| `(fun a b c)` | [`%:`](rune/cen.md#cencol), calls a gate with n arguments |
| `~(arm core arg)` | [`%~`](rune/cen.md#censig), pulls an arm in a door |
| `foo(x 1, y 2, z 3)` | [`%=`](rune/cen.md#centis), resolve a wing with changes |
| `[a b c]` | [`:*`](rune/col.md#coltar) or [`$:`](rune/buc.md#buccol), constructs _n_-tuple in normal mode or its structure in structure mode |
| `~[a b c]` | [`:~`](rune/col.md#colsig), constructs null-terminated list |
| `+(42)` | [`.+`](rune/dot.md#dotlus), increments with Nock 4 |
| `=(a b)` | [`.=`](rune/dot.md#dottis), tests for equality wiht Nock 5 |
| `` `foo` bar`` | [`^-`](rune/ket.md#kethep), typecasts by explicit type label |
| `foo=bar` | [`^=`](rune/ket.md#kettis), binds name to value |
| `*foo` | [`^*`](rune/ket.md#kettar), bunts (produces default mold value) |
| `,foo` | [`^:`](rune/ket.md#ketcol), produces “factory” gate for type |
| `:(fun a b c d)` | [`;:`](rune/mic.md#miccol), calls binary function as _n_-ary function |
| `foo:bar` | [`=<`](rune/tis.md#tisgal), composes two expressions, inverted |
| `\|(foo bar baz)` | [`?\|`](rune/wut.md#wutbar), logical OR (loobean) |
| `&(foo bar baz)` | [`?&`](rune/wut.md#wutpam), logical AND (loobean) |
| `!foo` | [`?!`](rune/wut.md#wutzap), logical NOT (loobean) |

<br>

<br>

##### Reading guide

Headings contain runes, phonetics and tokens. Description contains a link to the docs and a short description of the rune. Both regular and irregular forms are given.

Want to `Ctrl-f` to find out the meaning of something weird you saw? Search for `\symbol`. ie `\?` or `\=`. It'll show you to the irregular forms that uses that symbol.

## `.` dot (nock) {#dot-nock}

Anything Nock can do, Hoon can do also.

### `.+` dotlus {#dotlus}

[docs](rune/dot.md#dotlus) \\+

`[%dtls p=atom]`: increment an atom with Nock 4.

Regular: `.+(p)`

Irregular: `+(p)`

### `.=` dottis {#dottis}

[docs](rune/dot.md#dottis) \\=

`[%dtts p=hoon q=hoon]`: test for equality with Nock 5.

Regular: `.=(p q)`

Irregular: `=(p q)`

## `;` mic (make) {#mic-make}

Miscellaneous useful macros.

### `;:` miccol {#miccol}

[docs](rune/mic.md#miccol) \\:

`[%mccl p=hoon q=(list hoon)]`: call a binary function as an n-ary function.

Regular: `;:(p q)`

Irregular: `:(p q)`

## `:` col (cells) {#col-cells}

The cell runes.

### `:-` colhep {#colhep}

[docs](rune/col.md#colhep) \\[\\]\\^\\/\\+\\\`\\~

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

## `=` tis (flow) {#tis-flow}

Flow hoons change the subject. All non-flow hoons (except cores) pass the subject down unchanged.

### `=<` tisgal {#tisgal}

[docs](rune/tis.md#tisgal) \\:

`[%tsgl p=hoon q=hoon]`: compose two hoons, inverted.

Regular: `=<(p q)`

Irregular: `p:q`

## `|` bar (core) {#bar-core}

[docs](rune/bar.md) \\$

Core hoons are flow hoon.

Technically not irregular syntax, but worth mentioning.

- `|= bartis`
- `|. bardot`
- `|- barhep`
- `|* bartar`

The above runes produce a core with a single arm, named `$` ("buc"). We can recompute this arm with changes, useful for recursion among other things. Commonly used with the irregular syntax for `%=`, `:make`, like so: `$()`.

## `%` cen (call) {#cen-call}

The invocation family of runes.

### `%=` centis {#centis}

[docs](rune/cen.md#centis) \\(\\)

`[%cnts p=wing q=(list (pair wing hoon))]`: take a wing with changes.

Regular: `%=(p a 1)`

Irregular: `p(a 1)`

### `%~` censig {#censig}

[docs](rune/cen.md#censig) \\~

`[%cnsg p=wing q=hoon r=hoon]`: call with multi-armed door.

Regular: `%~(p q r)`

Irregular: `~(p q r)`

### `%-` cenhep {#cenhep}

[docs](rune/cen.md#cenhep) \\(\\)

`[%cnhp p=hoon q=hoon]`: call a gate (function).

Regular: `%-(p q)`

Irregular: `(p q)`

Note: `(p)` becomes `$:p` (`=<($ p)`), which behaves as you would expect (func call w/o args).

## `$` buc (mold) {#buc-mold}

A mold is a gate (function) that helps us build simple and rigorous data structures.

### `$?` bucwut {#bucwut}

[docs](rune/buc.md#bucwut) \\?

`[%bcwt p=(list model)]`: mold which normalizes a general union.

Regular: `$?(p)`

Irregular: `?(p)`

### `$_` buccab {#buccab}

[docs](rune/buc.md#_-buccab) \\\_

`[%bccb p=value]`: mold which normalizes to an example.

Regular: `$_(p)`

Irregular: `_p`

### `$=` buctis {#buctis}

[docs](rune/buc.md#buctis)  \\=

`[%bcts p=skin q=spec]`: wraps a face around a structure.

Regular: `$=(p q)`

Irregular:
```hoon
 p=q   ==>   $=(p q)
  =q   ==>   q=q
=p=q   ==>   p-q=q
```

## `?` wut (test) {#wut-test}

Hoon has the usual branches and logical tests.

### `?!` wutzap {#wutzap}

[docs](rune/wut.md#wutzap) \\!

`[%wtzp p=hoon]`: logical not.

Regular: `?!(p)`

Irregular: `!(p)`

### `?&` wutpam {#wutpam}

[docs](rune/wut.md#wutpam) \\&

`[%wtpm p=(list hoon)]`: logical and.

Regular: `?&(p)`

Irregular: `&(p)`

### `?|` wutbar {#wutbar}

[docs](rune/wut.md#wutbar) \\|

`[%wtbr p=(list hoon)]`: logical or.

Regular: `?|(p)`

Irregular: `|(p)`

## `^` ket (cast) {#ket-cast}

Lets us adjust types without violating type constraints.

### `^:` ketcol {#ketcol}

[docs](rune/ket.md#ketcol) \\,

`[%ktcl p=spec]`: mold gate for type `p`.

Regular: `^:(p)`

Irregular: `,p`

### `^-` kethep {#kethep}

[docs](rune/ket.md#kethep) \\\`

`[%kthp p=model q=value]`: typecast by mold.

Regular: `^-(p q)`

Irregular: `` `p`q ``

### `^*` kettar {#kettar}

[docs](rune/ket.md#kettar) \\\*

`[%kttr p=spec]`: produce bunt value of mold.

Regular: `^*(p)`

Irregular: `*p`

### `^=` kettis {#kettis}

[docs](rune/ket.md#kettis) \\=

`[%ktts p=toga q=value]`: name a value.

Regular: `^=(p q)`

Irregular: `p=q`

## Miscellaneous {#miscellaneous}

### Trivial molds {#trivial-molds}

\\\*\\@\\^\\?\\~

- `*` noun.
- `@` atom.
- `^` cell.
- `?` loobean.
- `~` null.

### Values {#values}

\\~\\&\\|\\%

- `~` null.
- `&` loobean true.
- `|` loobean false.
- `%a` constant `a`, where `a` can be an ((ir)regularly defined) atom or a symbol.

See [%sand](rune/constants.md#warm) for other irregular definitions of atoms.

### List addressing {#list-addressing}

\\&\\|

- `&n` nth element of a list.
- `|n` tail of list after nth element (i.e. n is the head).

### Limbs {#limbs}

[docs](limbs/limb.md) \\+\\.\\^\\-

`[%limb p=(each @ud [p=@ud q=@tas])]`: attribute of subject.

- `+15` is slot 15
- `.` is the whole subject (slot 1)
- `^a` is the `a` "of a higher scope", i.e. "resolve variable a, ignoring the first one found".
- `^^p` even higher, etc.
- 'Lark' syntax for slots / tree addressing:

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

### Wings {#wings}

[docs](limbs/wing.md) \\.

`[%wing p=(list limb)]`; a limb search path.

`a.b` finds limb `a` within limb `b` ("var" `a` within "var" `b`).

### Printing stuff {#printing-stuff}

\\\<\\\>

- `>a b c<` produces a [tank](stdlib/2q.md#tank) of the output of the contents (wrapped in cell if more than 1 item), formatted in pretty-print.

  ```hoon
  > >1 2 3<
  [%rose p=[p=" " q="[" r="]"] q=~[[%leaf p="1"] [%leaf p="2"] [%leaf p="3"]]]
  ```

- `<a b c>` produces a [tape](stdlib/2q.md#tape) of the tank above (ie `<1 2 3>` is same as `~(ram re >1 2 3<)`).

  ```hoon
  > <1 2 3>
  "[1 2 3]"

  > <`(list @)`~[1 2 3]>
  "~[1 2 3]"
  ```

### `,` com {#com}

`,` can serve in several capacities in Hoon programs:

1. As sugar for the `^:` ketcol or `$;` bucmic runes, toggling structure and value mode. (Toggling out of structure mode is uncommon.)

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
    
    (`$;` bucmic, or manual value mode, allows the use of value mode syntax to construct a mold.  Concretely, it lets you build a mold out of `hoon` instead of out of `spec`.  It is not commonly used.)
    
    From value mode to structure mode:

    ```hoon
    [%ktcl p=spec]
    ```

    From structure mode to value mode:

    ```hoon
    [%bcmc p=hoon]
    ```

2. As wing syntax for stripping a face.

    For instance, a line similar to the following is present in many Gall agents receiving HTTP requests via Eyre:

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

3. As a separator, e.g. between pairs in an inline `%=` centis expression, `$(i +(i), j (dec j))`.

## Commentary {#commentary}

In our in-house examples throughout our documentation, we use irregular forms instead of regular for the sake of verbosity. But remember with irregular forms: everything is just runes! Like magic. In general, irregular forms (usually) read better, but of course regular forms provide more information about what you're doing by showing you the full rune. Of course, it's up to you, the Hoon programmer, as to whether or not you want to use these.
