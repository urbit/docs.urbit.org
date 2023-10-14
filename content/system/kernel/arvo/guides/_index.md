+++
title = "Guides"
weight = 300
sort_by = "weight"
+++

Resources about the Urbit OS.

## [Overview](/system/kernel/overview)

Arvo is Urbit's functional operating system, written in [Hoon](/courses/hoon-school/). It's composed of modules called _vanes_, each of which has its own folder:

## [Ames](/reference/arvo/ames/ames)

Ames is the name of our network and the vane that communicates over it. It's an encrypted P2P network composed of instances of the Arvo operating system.

## [Behn](/system/kernel/behn/behn)

Behn is our timer. It allows vanes and applications to set and timer events, which are managed in a simple priority queue.

## [Clay](/system/kernel/clay/clay)

Clay is our filesystem and revision-control system.

## [Dill](/system/kernel/dill/dill)

Dill is our terminal driver. Unix sends keyboard events to dill from the terminal, and dill produces terminal output.

## [Eyre](/system/kernel/eyre/eyre)

Eyre is our HTTP server. Unix sends HTTP messages to `%eyre`, and `%eyre` produces HTTP messages in response.

## [Gall](/system/kernel/gall/gall)

Gall is the vane for controlling userspace apps.

## [Iris](/system/kernel/iris/iris)

Iris is our HTTP client.

## [Jael](/system/kernel/jael/jael)

Jael manages keys and Azimuth state.

## [Khan](/system/kernel/khan/khan)

Khan is our thread dispatcher.

## [Concepts](/reference/arvo/concepts/)

Explanations of design decisions that are pervasive throughout Arvo.

## [Tutorials](/reference/arvo/tutorials/)

Walkthroughs that teach you more about how Arvo works.
