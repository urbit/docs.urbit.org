+++
title = "System"
weight = 20
sort_by = "weight"
+++

This section of the docs contains guides and reference material for the three
basic components of the system: the Arvo kernel, the Vere runtime and Azimuth,
the PKI and identity system on the Ethereum blockchain.

While most of the app-related documentation is in the [Userspace](/userspace)
section, the [Kernel](/system/kernel) documentation is a useful reference when
interacting with Vanes from apps.

{% grid %}

  {% iconcard
    title="Kernel"
    description="Guides and reference material about Urbit's kernel Arvo, and its kernel modules called Vanes."
    label="View"
    href="/system/kernel"
    icon="Arvo"
  /%}

  {% iconcard
    title="Runtime"
    description="Urbit's runtime is called Vere. It interprets compiled Nock, handles I/O, and manages state checkpoints and the event log."
    label="View"
    href="/system/runtime"
    icon="Vere"
  /%}

  {% iconcard
    title="Identity"
    description="Urbit's indentity system and public-key infrastructure is called Azimuth, and lives on the Ethereum blockchain."
    label="View"
    href="/system/identity"
    icon="Azimuth"
  /%}

{% /grid %}
