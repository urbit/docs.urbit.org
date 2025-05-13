# Subscription {#subscription}

**Subscriptions** are one of the main ways [Gall](gall.md) [agents](agent.md) communicate. An agent will define a number of subscription [paths](path.md) in its `++on-watch` [arm](arm.md), and other agents (either local or remote) can subscribe. Once subscribed, they'll receive any [facts](fact.md) sent out on the path in question, until they either unsubscribe or are kicked.

#### Further reading {#further-reading}

- [App School: subscriptions](../courses/app-school/8-subscriptions.md): A lesson on Gall agent subscriptions.
