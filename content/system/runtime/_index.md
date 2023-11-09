+++
title = "Runtime"
weight = 600
sort_by = "weight"
insert_anchor_links = "right"
+++

This section of the docs is about Urbit's Nock interpreter and runtime system
**Vere**, which is written in C. This is of interest if you're planning to work
on the Urbit interpreter, you're a language implementation geek, or you don't
really understand anything until you've seen the actual structs.

### Developer Docs

{% grid %}

  {% iconcard
    title="U3 Overview"
    description="An overview of the noun-wrangling part of the runtime, U3."
    href="/system/runtime/concepts/u3"
    small=true
  /%}

  {% iconcard
    title="Conn.c Guide"
    description="Using `conn.c` to interact with a running ship from the outside."
    href="/system/runtime/guides/conn"
    small=true
  /%}

  {% iconcard
    title="How to Write a Jet"
    description="A jetting guide by for new Urbit developers."
    href="/system/runtime/guides/jetting"
    small=true
  /%}

  {% iconcard
    title="C3: C in Urbit"
    description="Under u3 is the simple c3 layer, which is just how we write C in Urbit."
    href="/system/runtime/reference/c"
    small=true
  /%}

  {% iconcard
    title="U3: Land of Nouns"
    description="The division between c3 and u3 is that you could theoretically imagine using c3 as just a generic C environment. Anything to do with nouns is in u3."
    href="/system/runtime/reference/nouns"
    small=true
  /%}

  {% iconcard
    title="U3: API Overview"
    description="A walkthrough of each of the u3 modules."
    href="/system/runtime/reference/api"
    small=true
  /%}

  {% iconcard
    title="Cryptography"
    description="References on the cryptography libraries utilized by jets."
    href="/system/runtime/reference/cryptography"
    small=true
  /%}

{% /grid %}

### Additional Resources

{% grid %}

  {% iconcard
    title="User Reference"
    description="Reference for the utilities and options the runtime takes from the terminal."
    href="/manual/running/vere"
    small=true
  /%}

  {% iconcard
    title="The Vere Repo"
    description="Github repository for the runtime."
    href="https://github.com/urbit/vere"
    small=true
  /%}

{% /grid %}
