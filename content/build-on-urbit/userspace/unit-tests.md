---
description: "Unit testing framework using -test thread and /lib/test.hoon. Write test arms with +test-* pattern that return $tang."
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

# Unit Tests

## Structure {#structure}

The `%base` desk includes a `-test` thread which can run unit tests you've written. A test is a Hoon file which produces a core. The `-test` thread will look for any arms in the core whose name begin with `test-`, e.g:

{% code overflow="nowrap" %}

```hoon
|%
++  test-foo
  ::  ...
++  test-bar
  ::  ...
++  test-foo-bar
  ::  ...
--
```

{% endcode %}

Any arms that don't begin with `test-` will be ignored. Each `+test-*` arm must produce a `$tang` (a `(list tank)`). If the `$tang` is empty (`~`), it indicates success. If the `$tang` is non-empty, it indicates failure, and the contents of the `$tang` is the error message.

To make test-writing easier, the `%base` desk includes the `/lib/test.hoon` library which you can import into your test file. The library contains four functions which all produce `$tang`s:

- `+expect-eq` - test whether an expression produces the expected value. This function takes `[expected=vase actual=vase]`, comparing `.expected` to `.actual`.
- `+expect` - test whether an expression produces `%.y`. This function takes a `$vase` containing the result to check.
- `+expect-fail` - tests whether the given `$trap` crashes, failing if it succeeds.
- `+category` - this is a utility that prepends an error message to a failed test (non-null `$tang`), passing through an empty `$tang` (successful test) unchanged.

The most commonly used function is `+expect-eq`, which is used like:

{% code overflow="nowrap" %}

```hoon
++  test-foo
  %+  expect-eq
  !>  'the result I expect'
  !>  (function-i-want-to-test 'some argument')
```

{% endcode %}

Of course, you'll want to test something else you've written rather than just expressions in the test file itself. To do that, you'd just import the file with `/=` or a similar Ford rune, and then call its functions in the test arms. You're free to do any compositions, import types, etc, as long as the file ultimately produces a `$core` with `+test-*` arms.

## Running {#running}

The `-test` thread takes a `(list path)` in the Dojo, where each path is a path to a test file. The path _must_ include the full path prefix (`/[ship]/[desk]/[case]`). The path _may_ omit the mark, since a `.hoon` file is assumed. The path _may_ include the name of a test arm after the filename. In that case, only the specified test arm will be run.

The conventional location for tests is a `/tests` directory in the root of a desk.

The output of the `-test` thread will note which arms were tested and whether they succeeded. It will also include:

- The number of micro-seconds it took to execute each test arm.
- A `?` specifying whether all tests succeeded.
- A message confirming the file was built successfully.

Here's an example of running the tests for `/lib/naive.hoon`:

{% code title="Dojo" overflow="nowrap" %}

```
> -test %/tests/lib/naive ~
built   /tests/lib/naive/hoon
>   test-zod-spawn-to-zero: took 81359µs
OK      /lib/naive/test-zod-spawn-to-zero
>   test-zod-spawn-proxy: took 128125µs
OK      /lib/naive/test-zod-spawn-proxy
.............................
....truncated for brevity....
.............................
>   test-approval-for-all: took 647403µs
OK      /lib/naive/test-approval-for-all
>   test-address-padding: took 75104µs
OK      /lib/naive/test-address-padding
ok=%.y
```

{% endcode %}

Here's an example of running just a single test for `/lib/naive.hoon`, the `+test-deposit` arm:

{% code title="Dojo" overflow="nowrap" %}

```
> -test %/tests/lib/naive/test-deposit ~
built   /tests/lib/naive/hoon
>   test-deposit: took ms/45.542
OK      /lib/naive/test-deposit
ok=%.y
```

{% endcode %}

