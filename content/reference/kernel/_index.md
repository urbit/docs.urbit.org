+++
title = "Kernel"
weight = 300
auto_expand = true
+++

{% grid %}

  {% iconcard
    title="Arvo"
    description="Arvo is the kernel itself."
    label="View Section"
    href="/system/kernel/arvo"
    icon="Arvo"
    small=true
  /%}

  {% iconcard
    title="Ames"
    description="Ames is the name of our network and the vane that communicates over it. It's an encrypted P2P network composed of instances of the Arvo operating system."
    label="View Section"
    href="/system/kernel/ames"
    icon="Ames"
    small=true
  /%}

  {% iconcard
    title="Behn"
    description="Behn is our timer. It allows vanes and applications to set and timer events, which are managed in a simple priority queue."
    label="View Section"
    href="/system/kernel/behn"
    icon="Behn"
    small=true
  /%}

  {% iconcard
    title="Clay"
    description="Clay is our filesystem and revision-control system."
    label="View Section"
    href="/system/kernel/clay"
    icon="Clay"
    small=true
  /%}

  {% iconcard
    title="Dill"
    description="Dill is our terminal driver. Unix sends keyboard events to dill from the terminal, and dill produces terminal output."
    label="View Section"
    href="/system/kernel/dill"
    icon="Dill"
    small=true
  /%}

  {% iconcard
    title="Eyre"
    description="Eyre is our HTTP server. Unix sends HTTP messages to Eyre, and Eyre produces HTTP messages in response."
    label="View Section"
    href="/system/kernel/eyre"
    icon="Eyre"
    small=true
  /%}

  {% iconcard
    title="Gall"
    description="Gall is the vane for controlling userspace apps."
    label="View Section"
    href="/system/kernel/gall"
    icon="Gall"
    small=true
  /%}

  {% iconcard
    title="Iris"
    description="Iris is our HTTP client."
    label="View Section"
    href="/system/kernel/iris"
    icon="Iris"
    small=true
  /%}

  {% iconcard
    title="Jael"
    description="Jael manages keys and Azimuth state."
    label="View Section"
    href="/system/kernel/jael"
    icon="Jael"
    small=true
  /%}

  {% iconcard
    title="Khan"
    description="Khan is our thread dispatcher."
    label="View Section"
    href="/system/kernel/khan"
    icon="Khan"
    small=true
  /%}

  {% iconcard
    title="Lick"
    description="Lick is the IPC vane, for communicating with processes on the host."
    label="View Section"
    href="/system/kernel/lick"
    icon="Lick"
    small=true
  /%}

{% /grid %}
