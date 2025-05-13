# Subscription

**Subscriptions** are one of the main ways [Gall](/glossary/gall) [agents](/glossary/agent) communicate. An agent will define a number of subscription [paths](/glossary/path) in its `++on-watch` [arm](/glossary/arm), and other agents (either local or remote) can subscribe. Once subscribed, they'll receive any [facts](/glossary/fact) sent out on the path in question, until they either unsubscribe or are kicked.

#### Further reading

- [App School: subscriptions](/courses/app-school/8-subscriptions): A lesson on Gall agent subscriptions.
