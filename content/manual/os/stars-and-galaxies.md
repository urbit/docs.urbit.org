# Star and Galaxy Operations

To boot your galaxy or star, follow our [installation instructions](../../get-on-urbit.md).

### Hosting your star {#hosting-your-star}

If you plan to distribute planets in any capacity, we ask that you keep your star running. If you fail to do so, those planets will become orphans that are unable to communicate with the network unless they transfer to a new star.

See our [cloud hosting instructions](../running/cloud-hosting.md) for instructions on settings up a Digital Ocean droplet.

### Distributing planets {#distributing-planets}

You can distribute planets from your star via [Bridge](https://bridge.urbit.org/). As a reminder if you do distribute planets, please boot and run your star on the Arvo network, otherwise those planets won't be able to connect, which has a negative effect on the network as a whole, as orphan planets are left with very limited functionality.

### Software updates {#software-updates}

By default, your star accepts software updates from its galaxy and routes them to its planets. You can use this mechanism to push custom software to your planets. Keep in mind that planets expect functional, non-breaking software updates, and generally want to be able to communicate with planets that are sponsored by other stars.

### Star-owner etiquette {#star-owner-etiquette}

- If you distribute planets, boot and run your star on the Arvo network, or the planets won't be able to boot for the first time or connect unless they transfer to a different star.
- A star is networking infrastructure. For that reason, the machine running your star or galaxy must have sufficient bandwidth, storage, and processing power for your dependent planets. Until event log pruning is implemented, expect ships to consume more disk space every year; stars looking to serve around 100 planets will want to ensure around 50GB of space per year of operation.
- When messaging others, communicate using your star only when speaking in an official/infrastructural capacity. Otherwise, use your personal planet.

### Taxes {#taxes}

Urbit address space has value, which means the distribution of address space has tax implications. You should speak with your tax advisor about these implications.
