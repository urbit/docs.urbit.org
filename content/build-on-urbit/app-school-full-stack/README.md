---
description: Walkthrough for building a full-stack Urbit application with a Gall backend and React frontend, demonstrating how to create complete web applications on Urbit.
layout:
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# App School II (Full-Stack)

In [App School I](../app-school) you learned about the structure of a Gall agent. In this course, we'll walk through the writing of a full agent that serves as the backend for a React application which we'll also write.

We'll write a simple journal app, called "Journal". In the browser, users will be able to add plaintext journal entires organized by date. They'll be able to scroll through their entires in ascending date order, with more entries loaded each time the bottom of the list is reached. They'll be able to edit and delete old entries, and search through entries by specifying a date range.

![](https://media.urbit.org/guides/core/app-school-full-stack-guide/entries.png)

The Journal app we'll be writing can be installed from `~pocwet/journal`, and its source code is available [here](https://github.com/urbit/docs-examples/tree/main/journal-app).

This walkthrough doesn't cover every aspect of building the app in full depth. Rather, its purpose is to demonstrate the process of creating a full-stack app, showing how everything fits together, and how concepts you learned in App School I are applied in practice. Consequently, the example app is fairly simple and runs on a local ship only, rather than one with more complex inter-ship networking.

Each section of this walkthrough will list additional resources and learning material at the bottom of the page, which will cover the concepts discussed in a more comprehensive manner.

Here is the basic structure of the app we'll be building:

![](https://media.urbit.org/guides/core/app-school-full-stack-guide/journal-app-diagram.svg)

## Sections {#sections}

- [1. Types](./1-types.md) - Creating the `/sur` structure file for our `%journal` agent.
- [2. Agent](./2-agent.md) - Creating the `%journal` agent itself.
- [3. JSON](./3-json.md) - Writing a library to convert between our agent's marks and JSON. This lets our React front-end poke our agent, and our agent send updates back to it.
- [4. Marks](./4-marks.md) - Creating the mark files for the pokes our agent takes and updates it sends out.
- [5. Eyre](./5-eyre.md) - A brief overview of how the webserver vane Eyre works.
- [6. React App Setup](./6-react-setup.md) - Creating a new React app, installing the required packages, and setting up some basic things for our front-end.
- [7. React App Logic](./7-app-logic.md) - Analyzing the core logic of our React app, with particular focus on using methods of the `Urbit()` class from `@urbit/http-api` to communicate with our agent.
- [8. Desk and Glob](./8-desk.md) - Building and "globbing" our front-end, and putting together a desk for distribution.
- [9. Summary](./9-final.md) - Some final comments and additional resources.

