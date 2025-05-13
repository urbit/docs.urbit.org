# ; mic · Make

Miscellaneous useful macros.

## `;:` "miccol"

Call a binary function as an n-ary function.

#### Syntax

One fixed argument, then a variable number of arguments.

{% tabs %}

{% tab title="Tall form" %}

```hoon
;:  p
  q1
  q2
  qn
==
```

{% endtab %}

{% tab title="Wide form" %}

```hoon
;:(p q1 q2 qn)
```

{% endtab %}

{% tab title="Irregular form" %}

```hoon
:(p q1 q2 qn)
```

{% endtab %}

{% endtabs %}

#### AST

```hoon
[%mccl p=hoon q=(list hoon)]
```

#### Expands to

**Pseudocode**: `a`, `b`, `c`, ... as elements of `q`:

Regular form:

```hoon
%+(p a %+(p b %+(p c ...)))
```

Irregular form:

```hoon
(p a (p b (p c ...)))
```

#### Desugaring

```hoon
|-
?~  q  !!
?~  t.q  !!
?~  t.t.q
  (p i.q i.t.q)
(p i.q $(q t.q))
```

#### Examples

```
> (add 3 (add 4 5))
12

> ;:(add 3 4 5)
12

> :(add 3 4 5)
12

> `@t`:((cury cat 3) 'a' 'b' 'c' 'd')
'abcd'
```

---

## `;<` "micgal"

Monadic do notation.

#### Syntax

Four arguments, fixed.

| Tall form                      | Wide form                   | Irregular form |
|--------------------------------|-----------------------------|----------------|
| `;<  mold  bind  expr1  expr2` | `;<(mold bind expr1 expr2)` | None           |

#### AST

```hoon
[%mcgl p=spec q=hoon r=hoon s=hoon]
```

#### Semantics

A `;<` is for sequencing two computations, `expr1` and `expr2`, using a provided implementation of monadic bind. This rune takes a gate `bind` which takes a mold `mold` and produces an implementation of monadic bind.

#### Desugaring

```hoon
%+  (bind mold)
  expr1
|=  mold
expr2
```

#### Discussion

`;<` is much like Haskell `do` notation. You have a sequence of events you'd like to run such that each past the first depends on the output of the previous one. The output of the previous one may not be of the correct type to use as an input to the next one, and so an adapter such as `+biff` is needed.

`;<` differs from [`;~`](#-micsig) in that it takes a gate which takes a mold that produces an implementation of monadic bind, rather than taking an implementation of monadic bind directly.

`;<` can be used to glue a pipeline together to run an asynchronous function or event. This can be helpful when deferring parts of a computation based on external data.

We remark that you can switch binds in the middle of a sequence of `;<`.

#### Examples

[`+biff`](/language/hoon/reference/stdlib/2a/#biff) is the unit monad's implementation of monadic bind. That is to say, it takes a unit `a` and a gate `b` that accepts a noun that produces a unit, and extracts the value from `a` to pass as a sample to `b`.

We illustrate the usage of `;<` with `+biff` with a `map` of atoms:

```
> =m (my ~[[1 3] [2 2] [3 1]])
> (~(get by m) 1)
[~ 3]
```

A single usage of `;<` only serves to apply the binding function to the output of `expr1`:

```
> ;<  a=@  _biff  (~(get by m) 1)
  a
3
```

Here we see the result of chaining them together:

```
> ;<  a=@  _biff  (~(get by m) 1)
  ;<  b=@  _biff  (~(get by m) a)
  b
1
```

---

## `;+` "miclus"

make a single XML node (Sail)

#### Syntax

One argument, fixed.

| Tall form | Wide form | Irregular form |
|-----------|-----------|----------------|
| `;+  p`   | `;+(p)`   | None           |

`p` is a Hoon expression that produces a `manx`.

#### Produces

A [`marl`](/language/hoon/reference/stdlib/5e#marl), i.e., a list of [`manx`](/language/hoon/reference/stdlib/5e#manx). A `manx` is a noun that represents a single XML node.

#### Discussion

tl;dr -- `;+` converts a `manx` to a `marl`.

`;+` is a Sail rune. Sail is a part of Hoon used for creating and operating on nouns that represent XML nodes. With the appropriate rendering pipeline, a Sail document can be used to generate a static website.

In Sail a single XML node is represented by a `manx`. A single <code><p&gt;</code> node `manx` can be produced in the following way:

```
> ;p: This will be rendered as an XML node.
[[%p ~] [[%$ [%$ "This will be rendered as an XML node."] ~] ~] ~]
```

Sometimes what is needed is a `marl`, i.e., a list of `manx`. To convert a single `manx` to a `marl`, use the `;+` rune.

One interesting thing about Sail is that it allows you to use complex Hoon expressions to choose from among several nodes to render. The `;+` rune can take such a complex expression.

#### Examples

```
> ^-  marl
  ;+  ?:  (gth 3 2)
        ;p: This is the node for 'yes'.
      ;p: This is the node for 'no'.
~[
  [ g=[n=%p a=~]
    c=[i=[g=[n=%$ a=~[[n=%$ v="This is the node for 'yes'."]]] c=~] t=~]
  ]
]

> ^-  marl
  ;+  ?:  (gth 2 3)
        ;p: This is the node for 'yes'.
      ;p: This is the node for 'no'.
~[
  [ g=[n=%p a=~]
    c=[i=[g=[n=%$ a=~[[n=%$ v="This is the node for 'no'."]]] c=~] t=~]
  ]
]
```

---

## `;;` "micmic"

Mold noun.

#### Syntax

Two arguments, fixed.

{% tabs %}

{% tab title="Tall form" %}

```hoon
;;  p
q
```

{% endtab %}

{% tab title="Wide form" %}

```hoon
;;(p q)
```

{% endtab %}

{% tab title="Irregualr form" %}

None

{% endtab %}

{% endtabs %}

#### AST

```hoon
[%mcmc p=spec q=hoon]
```

#### Discussion

In an old version of Hoon, molds would return their bunt value when molding failed. Micmic was useful because it would make them crash rather than bunt on failure. In current Hoon, molds always crash on failure, so micmic is strictly unnecessary. However, it's still sometimes used for stylistic reasons, to clearly indicate "I'm molding" rather than "I'm merely calling a function".

It can also sometimes be useful to force structure-mode parsing of cell molds when molding, rather than using buccol's irregular form.

#### Examples

Basic micmic molding (same as normal molding):

```
> ;;(@ud 123)
123
```

Using buccol for a cell mold:

```
> (,[@ @] [1 1])
[1 1]
```

Using micmic instead:

```
> ;;([@ @] [1 1])
[1 1]
```

---

## `;/` "micfas"

Tape as XML element.

#### Syntax

One argument, fixed.

| Tall form | Wide form | Irregular form |
|-----------|-----------|----------------|
| `;/  p`   | `;/(p)`   | None           |

#### AST

```hoon
[%mcnt p=hoon]
```

#### Expands to

```hoon
~[%$ ~[%$ 'p']]
```

#### Examples

```
> ;/  "foo"
[[%~. [%~. "foo"] ~] ~]
```

---

## `;~` "micsig"

Glue a pipeline together with a product-sample adapter.

#### Syntax

One fixed argument, then a variable number of arguments.

{% tabs %}

{% tab title="Tall form" %}

```hoon
;~  p
  q1
  q2
  qn
==
```

{% endtab %}

{% tab title="Wide form" %}

```hoon
;~(p q1 q2 qn)
```

{% endtab %}

{% tab title="Irregular form" %}

None

{% endtab %}

{% endtabs %}

#### AST

```hoon
[%mcsg p=hoon q=(list hoon)]
```

#### Produces

The gates in `q` are composed together using the gate `p` as an intermediate function, which transforms a `q` product and a `q` gate into a `q` sample.

#### Expands to

**Note: these are structurally correct, but elide some type-system complexity.**

`;~(a b)` reduces to `b`.

`;~(a b c)` expands to

```hoon
|=  arg=*
(a (b arg) c(+6 arg))
```

`;~(a b c d)` expands to

```hoon
|=  arg=*
%+  a (b arg)
=+  arg=arg
|.  (a (c arg) d(+6 arg))
```

#### Desugaring

```hoon
?~  q  !!
|-
?~  t.q  i.q
=/  a  $(q t.q)
=/  b  i.q
=/  c  ,.+6.b
|.  (p (b c) a(,.+6 c))
```

#### Discussion

Apparently `;~` is a "Kleisli arrow." It's also a close cousin of the infamous "monad." Don't let that bother you. Hoon doesn't know anything about category theory, so you don't need to either.

`;~` is often used in parsers, but is not only for parsers.

This can be thought of as user-defined function composition; instead of simply nesting the gates in `q`, each is passed individually to `p` with the product of the previous gate, allowing arbitrary filtering, transformation, or conditional application.

#### Examples

A simple "parser." `trip` converts a `cord` (atomic string) to a `tape` (linked string).

```
> =cmp |=([a=tape b=$-(char tape)] `tape`?~(a ~ (weld (b i.a) t.a)))
> ;~(cmp trip)
<1.zje {a/@ <409.yxa 110.lxv 1.ztu $151>}>
```

With just one gate in the pipeline `q`, the glue `p` is unused:

```
> (;~(cmp trip) 'a')
"a"
```

But for multiple gates, we need it to connect the pipeline:

```
> (;~(cmp trip |=(a=@ ~[a a])) 'a')
"aa"

> (;~(cmp trip |=(a=@ ~[a a])) '')
""
```

A more complicated example:

```
> (;~(cmp trip ;~(cmp |=(a=@ ~[a a]) |=(a=@ <(dec a)>))) 'b')
"97b"

> (;~(cmp trip |=(a=@ ~[a a]) |=(a=@ <(dec a)>)) 'b')
"97b"

> (;~(cmp trip |=(a=@ ~[a a]) |=(a=@ <(dec a)>)) '')
""

> (;~(cmp trip |=(a=@ ~[a a]) |=(a=@ <(dec a)>)) 'a')
"96a"

> (;~(cmp trip |=(a=@ ~[a a]) |=(a=@ <(dec a)>)) 'acd')
"96acd"
```

---

## `;*` "mictar"

make a list of XML nodes from complex Hoon expression (Sail)

#### Syntax

One argument, fixed.

| Tall form | Wide form | Irregular form |
|-----------|-----------|----------------|
| `;*  p`   | `;*(p)`   | None           |

`p` is a Hoon expression that produces a `marl`.

#### Produces

A [`marl`](/language/hoon/reference/stdlib/5e#marl), i.e., a list of [`manx`](/language/hoon/reference/stdlib/5e#manx). A `manx` is a noun that represents a single XML node.

#### Discussion

`;*` is a Sail rune. Sail is a part of Hoon used for creating and operating on nouns that represent XML nodes. With the appropriate rendering pipeline, a Sail document can be used to generate a static website.

If you need a complex Hoon expression to produce a `marl`, use the `;*` rune. Often this rune is used with an expression, `p`, that includes one or more `;=` subexpressions.

(See also [`;=`](#-mictis).)

#### Examples

```
> ;*  ?:  (gth 3 2)
        ;=  ;p: This is node 1 of 'yes'.
            ;p: This is node 2 of 'yes'.
        ==
      ;=  ;p: This is node 1 of 'no'.
          ;p: This is node 2 of 'no'.
      ==
[ [[%p ~] [[%$ [%$ "This is node 1 of 'yes'."] ~] ~] ~]
  [[[%p ~] [[%$ [%$ "This is node 2 of 'yes'."] ~] ~] ~] ~]
]

> ;*  ?:  (gth 2 3)
          ;=  ;p: This is node 1 of 'yes'.
              ;p: This is node 2 of 'yes'.
          ==
        ;=  ;p: This is node 1 of 'no'.
            ;p: This is node 2 of 'no'.
        ==
[ [[%p ~] [[%$ [%$ "This is node 1 of 'no'."] ~] ~] ~]
  [[[%p ~] [[%$ [%$ "This is node 2 of 'no'."] ~] ~] ~] ~]
]
```

---

## `;=` "mictis"

make a list of XML nodes (Sail)

#### Syntax

A variable number of arguments.

{% tabs %}

{% tab title="Tall form" %}

```hoon
;=  p1
    p2
    p3
   pn
==
```

{% endtab %}

{% tab title="Wide form" %}

```hoon
;=(p1 p2 p3 pn)
```

{% endtab %}

{% tab title="Irregular form" %}

None

{% endtab %}

{% endtabs %}

`p1`-`pn` are Hoon expressions, each of which poduces a `manx`.

#### Produces

A [`marl`](/language/hoon/reference/stdlib/5e#marl), i.e., a list of [`manx`](/language/hoon/reference/stdlib/5e#manx). A `manx` is a noun that represents a single XML node.

#### Discussion

`;=` is a [Sail](/language/hoon/guides/sail) rune. Sail is a part of Hoon used for creating and operating on nouns that represent XML nodes. With the appropriate rendering pipeline, a Sail document can be used to generate a static website.

In Sail a single XML node is represented by a `manx`. A single `<p>` node `manx` can be produced in the following way:

```
> ;p: This will be rendered as an XML node.
[[%p ~] [[%$ [%$ "This will be rendered as an XML node."] ~] ~] ~]
```

Sometimes what is needed is a `marl`, i.e., a list of `manx`. To convert a series of `manx` nodes to a `marl`, use the `;=` rune.

(See also [`;*`](#-mictar).)

#### Examples

```
> ;=  ;p: This is the first node.
      ;p: This is the second.
      ;p: Here is the last one.
  ==
[ [[%p ~] [[%$ [%$ "This is the first node."] ~] ~] ~]
  [[%p ~] [[%$ [%$ "This is the second."] ~] ~] ~]
  [[%p ~] [[%$ [%$ "Here is the last one."] ~] ~] ~]
  ~
]
```
