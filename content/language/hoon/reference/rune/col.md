# : col · Cells {#-col-cells}

The `:` ("col") expressions are used to produce cells, which are pairs of
values. E.g., `:-(p q)` produces the cell `[p q]`. All `:` runes reduce to `:-`.

## `:-` "colhep" {#--colhep}

Construct a cell (2-tuple).

#### Syntax {#syntax}

Two arguments, fixed.

{% tabs %}

{% tab title="Tall form" %}

```hoon
:-  p
q
```

{% endtab %}

{% tab title="Wide form" %}

```hoon
:-(p q)
```

{% endtab %}

{% tab title="Irregular #1" %}

```hoon
[p q]
```

{% endtab %}

{% tab title="Irregular #2" %}

```hoon
p^q
```

{% endtab %}

{% endtabs %}

#### AST {#ast}

```hoon
[%clhp p=hoon q=hoon]
```

#### Produces {#produces}

The cell of `p` and `q`.

#### Discussion {#discussion}

Hoon expressions actually use the same "autocons" pattern as Nock formulas. If you're assembling expressions (which usually only the compiler does), `[a b]` is the same as `:-(a b)`.

#### Examples {#examples}

```
> :-(1 2)
[1 2]

~zod:dojo> 1^2
[1 2]
```

---

## `:_` "colcab" {#_-colcab}

Construct a cell, inverted.

#### Syntax {#syntax}

Two arguments, fixed.

{% tabs %}

{% tab title="Tall form" %}

```hoon
:_  p
q
```

{% endtab %}

{% tab title="Wide form" %}

```hoon
:_(p q)
```

{% endtab %}

{% tab title="Irregular form" %}

None

{% endtab %}

{% endtabs %}

#### AST {#ast}

```hoon
[%clcb p=hoon q=hoon]
```

#### Expands to {#expands-to}

```hoon
:-(q p)
```

#### Examples {#examples}

```
> :_(1 2)
[2 1]
```

---

## `:+` "collus" {#-collus}

Construct a triple (3-tuple).

#### Syntax {#syntax}

Three arguments, fixed.

{% tabs %}

{% tab title="Tall form" %}

```hoon
:+  p
  q
r
```

{% endtab %}

{% tab title="Wide form" %}

```hoon
:+(p q r)
```

{% endtab %}

{% tab title="Irregular form" %}

```hoon
  [p q r]
```

{% endtab %}

{% endtabs %}

#### AST {#ast}

```hoon
[%clls p=hoon q=hoon r=hoon]
```

#### Expands to: {#expands-to}

```hoon
:-(p :-(q r))
```

#### Examples {#examples}

```
> :+  1
    2
  3
[1 2 3]

> :+(%a ~ 'b')
[%a ~ 'b']
```

---

## `:^` "colket" {#-colket}

Construct a quadruple (4-tuple).

#### Syntax {#syntax}

Four arguments, fixed.

{% tabs %}

{% tab title="Tall form" %}

```hoon
:^    p
    q
  r
s
```

{% endtab %}

{% tab title="Wide form" %}

```hoon
:^(p q r s)
```

{% endtab %}

{% tab title="Irregular form" %}

```hoon
  [p q r s]
```

{% endtab %}

{% endtabs %}

#### AST {#ast}

```hoon
[%clkt p=hoon q=hoon r=hoon s=hoon]
```

#### Expands to {#expands-to}

```hoon
:-(p :-(q :-(r s)))
```

#### Examples {#examples}

```
> :^(1 2 3 4)
[1 2 3 4]

> :^    5
      6
    7
  8
[5 6 7 8]
```

---

## `:*` "coltar" {#-coltar}

Construct an n-tuple.

#### Syntax {#syntax}

Variable number of arguments.

{% tabs %}

{% tab title="Tall form" %}

```hoon
:*  p1
    p2
    p3
    pn
==
```

{% endtab %}

{% tab title="Wide form" %}

```hoon
:*(p1 p2 p3 pn)
```

{% endtab %}

{% tab title="Irregular form" %}

```hoon
[p1 p2 p3 pn]
```

{% endtab %}

{% endtabs %}

#### AST {#ast}

```hoon
[%cltr p=(list hoon)]
```

#### Expands to {#expands-to}

**Pseudocode**: `a`, `b`, `c`, ... as elements of `p`:

```hoon
:-(a :-(b :-(c :-(... z)))))
```

#### Desugaring {#desugaring}

```hoon
|-
?~  p
  !!
?~  t.p
  i.p
:-  i.p
$(p t.p)
```

#### Examples {#examples}

```
> :*(5 3 4 1 4 9 0 ~ 'a')
[5 3 4 1 4 9 0 ~ 'a']

> [5 3 4 1 4 9 0 ~ 'a']
[5 3 4 1 4 9 0 ~ 'a']

> :*  5
      3
      4
      1
      4
      9
      0
      ~
      'a'
  ==
[5 3 4 1 4 9 0 ~ 'a']
```

---

## `:~` "colsig" {#-colsig}

Construct a null-terminated list.

#### Syntax {#syntax}

Variable number of arguments.

{% tabs %}

{% tab title="Tall form" %}

```hoon
:~  p1
    p2
    p3
    pn
==
```

{% endtab %}

{% tab title="Wide form" %}

```hoon
:~(p1 p2 p3 pn)
```

{% endtab %}

{% tab title="Irregular form" %}

```hoon
~[p1 p2 p3 pn]
```

{% endtab %}

{% endtabs %}

#### AST {#ast}

```hoon
[%clsg p=(list hoon)]
```

#### Expands to {#expands-to}

**Pseudocode**: `a`, `b`, `c`, ... as elements of `p`:

```hoon
:-(a :-(b :-(c :-(... :-(z ~)))))
```

#### Desugaring {#desugaring}

```hoon
|-
?~  p
  ~
:-  i.p
$(p t.p)
```

#### Discussion {#discussion}

Note that this does not produce a `list` type, it just produces a null-terminated n-tuple. To make it a proper `list` it must be cast or molded.

#### Examples {#examples}

```
> :~(5 3 4 2 1)
[5 3 4 2 1 ~]

> ~[5 3 4 2 1]
[5 3 4 2 1 ~]

> :~  5
      3
      4
      2
      1
  ==
[5 3 4 2 1 ~]
```

---

## `::` "colcol" {#-colcol}

Code comment.

#### Syntax {#syntax}

```hoon
::  any text you like!
```

#### Examples {#examples}

```hoon
::
::  this is commented code
::
|=  a=@         ::  a gate
(add 2 a)       ::  that adds 2
                ::  to the input
```
