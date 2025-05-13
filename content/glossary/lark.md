# Lark

**Lark** notation is a way to reference a relative tree address, an alternative to using a numerical [axis](axis.md). It's valid syntax as part of a [wing](wing.md) address.

The syntax alternates between using `-`/`+` and `<`/`>` for [head](head.md)/[tail](tail.md). It always starts with a `-`/`+`, then can follow with a `<`/`>`, then back to `-`/`+`, and so on. For example, `-<+>+` means "the tail of the tail of the tail of the head of the head of the subject" or, put another way, "descend into the head, then head, then tail, then tail, then tail."

Lark notation is usually only used for trivial cases, like `+<` or `-.foo`. It's generally bad practice to use long expressions like `+<->+<-<+>->-`. You should also use [faces](face.md) like `p.foo` rather than lark notation like `-.foo` where possible.

A couple of examples in the [dojo](dojo.md):

```
:: get the 4th item in a cell
::
> =foo [1 2 3 4 5]
> +>+<.foo
4

:: get the sample of the ++add gate
::
> +<:add
[a=0 b=0]
```

#### Further Reading

- [Hoon School Lesson 6: Trees and Addressing](../courses/hoon-school/G-trees.md)
