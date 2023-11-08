+++
title = "Apps"
auto_expand = true
+++

Gall is one of the nine vanes (kernel modules) of Arvo, Urbit's operating
system. Gall's purpose is to manage userspace applications called _agents_.
**Agents** are the main kind of userspace application on Urbit. They have a
persistent state and API that handles events and produces effects.Gall agents
can variously be treated as databases with developer-defined logic, services,
daemons, or a kind of state machine.

One or more Gall agents can be put together in a "desk" in Clay (the filesystem
vane) and, along with a front-end, can be published and distributed as a
cohesive app for users to install.

This section of the docs contains guides related to writing apps and
[distributing them](/userspace/apps/guides/software-distribution). It also
contains a number of different [examples and
exercises](/userspace/apps/examples) you can work through to learn how to build
different kinds of apps.

{% grid %}

  {% iconcard
    title="Reference"
    description="Reference information about apps and software distribution."
    href="/userspace/apps/reference"
    small=true
  /%}

  {% iconcard
    title="Guides"
    description="Guides to things like software distribution, CLI apps and remote scries."
    href="/userspace/apps/guides"
    small=true
  /%}

  {% iconcard
    title="Examples"
    description="A workbook of app exercises and examples."
    href="/userspace/apps/examples"
    small=true
  /%}

{% /grid %}

Additionally, the [courses](/courses) section of the docs contain two in-depth
app-building tutorials, which are the recommended place to start learning Urbit
app development:


{% grid %}

  {% iconcard
    title="App School"
    description="Learn the basics of app development."
    label="View Guide"
    href="/courses/app-school"
    icon="AppSchoolI"
  /%}

  {% iconcard
    title="App School II"
    description="Learn to build and publish a full app, back-end and front-end."
    label="View Guide"
    href="/courses/app-school-full-stack"
    icon="AppSchoolII"
  /%}

{% /grid %}
