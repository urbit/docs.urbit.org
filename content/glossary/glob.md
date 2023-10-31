+++
title = "Glob"

[extra]
category = "arvo"

[glossaryEntry.glob]
name = "glob"
symbol = ""
usage = "arvo"
desc = "A bundle of front-end resources for an app."

+++

A **glob** is a bundle of front-end resources for an app which is served to a
web client by the `%docket` [agent](/glossary/agent) in the
[%landscape](/glossary/landscape) [desk](/glossary/desk). The glob
will typically contain an `index.html` file, along with CSS, JS, and other
resources the web app needs. The glob for an app will be retrieved when you
install it, either over [Ames](/glossary/ames) or from an external web
server.

#### Further reading

- [Glob reference](/userspace/apps/reference/dist/glob): Details on how to make and
  distribute globs.
- [The software distribution guide](/userspace/apps/guides/software-distribution): A
  walk-through of putting together and distribution an app, including globs.
