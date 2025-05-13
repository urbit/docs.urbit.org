# Subscription

**Subscriptions** are one of the main ways [Gall](urbit-docs/glossary/gall) [agents](urbit-docs/glossary/agent) communicate. An agent will define a number of subscription [paths](urbit-docs/glossary/path) in its `++on-watch` [arm](urbit-docs/glossary/arm), and other agents (either local or remote) can subscribe. Once subscribed, they'll receive any [facts](urbit-docs/glossary/fact) sent out on the path in question, until they either unsubscribe or are kicked.

#### Further reading

- [App School: subscriptions](urbit-docs/courses/app-school/8-subscriptions): A lesson on Gall agent subscriptions.
