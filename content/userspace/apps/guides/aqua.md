# Aqua Tests

## Concepts {#concepts}

Aqua (short for "aquarium", alluding to the idea that you're running multiple ships in a safe, artificial environment and watching them carefully) is an app that lets you run one or more virtual ships from within a single host.

The `/ph ` folder in `/base/ted` contains functions designed to make it easy to write integration tests using `%aqua`.

## First test {#first-test}

To run your first pH test, run the following commands:

{% code title="Dojo" wrap="nowrap" %}

```
|start %aqua
:aqua +pill/solid
-ph-add
```

{% endcode %}

This will start `%aqua`, compile a new kernel for it, and then compile and run `/ted/ph/add.hoon`. Here are the contents of that file:

{% code title="/ted/ph/add.hoon" wrap="nowrap" %}

```hoon
/-  spider
/+  *ph-io
=,  strand=strand:spider
^-  thread:spider
|=  args=vase
=/  m  (strand ,vase)
;<  ~  bind:m  start-simple
;<  ~  bind:m  (raw-ship ~bud ~)
;<  ~  bind:m  (dojo ~bud "[%test-result (add 2 3)]")
;<  ~  bind:m  (wait-for-output ~bud "[%test-result 5]")
;<  ~  bind:m  end-simple
(pure:m *vase)
```

{% endcode %}

There's a few lines of boilerplate, with three important lines defining the test.

{% code title="/ted/ph/add.hoon" wrap="nowrap" %}

```
;<  ~  bind:m  (raw-ship ~bud ~)
;<  ~  bind:m  (dojo ~bud "[%test-result (add 2 3)]")
;<  ~  bind:m  (wait-for-output ~bud "[%test-result 5]")
```

{% endcode %}

We boot a ship with `+raw-ship`. In this case the ship we are booting will be ~bud. These ships exist in a virtual environment so you could use any valid Urbit ID.

Next we enter some commands with `+dojo`, and then we wait until we get a line that includes some expected output. Each of these commands we need to specify the ship we want to run on.

Many tests can be created with nothing more than these simple tools. Try starting two ships and having one send a `|hi` to the other, and check that it arrives.

Many more complex tests can be created, including file changes, personal breaches, mock http clients or servers, or anything you can imagine. Check out `/lib/ph/io.hoon` for other available functions, and look at other tests in `/ted/ph/` for inspiration.

## Reference {#reference}

Aqua has the following commands:

`:aqua +pill/solid` Compiles a "pill" (kernel) for the guest ships and loads it into Aqua.

`:aqua [%swap-files ~]` modifies the pill to use the files you have in your filesystem without rebuilding the whole pill. For example, if you change an app and you want to test the new version, you must install it in the pill. This command will do that.

`:aqua [%swap-vanes ~[%a]]` Modifies the pill to load a new version of a vane (`%a` == Ames in this example, but it can be any list of vanes). This is faster than running `:aqua +pill/solid`.
