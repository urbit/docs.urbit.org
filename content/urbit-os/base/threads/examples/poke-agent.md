# Poke Agent

Here's a thread that sends a `|hi` to a ship via the `%hood` agent:

{% code title="/ted/send-hi.hoon" overflow="nowrap" lineNumbers="true" %}
```hoon
/+  *strandio
|=  arg=vase
=/  m  (strand:rand ,vase)
=/  uarg  !<  (unit @p)  arg
?~  uarg
  (strand-fail:rand %no-arg ~)
=/  =ship  u.uarg
^-  form:m
;<  our=@p   bind:m  get-our
;<  now=@da  bind:m  get-time
;<  ~        bind:m  (poke [our %hood] helm-send-hi+!>([ship ~]))
(pure:m !>(~))
```
{% endcode %}

Save it in `/ted` of the `%base` desk, `|commit %base`, and run it like:

```
-send-hi ~zod
```

### Analysis {#analysis}

Pretty simple, just use `+poke` with an argument of `[ship term] cage` where `term` is the agent and `cage` is whatever the particular agent expects.
