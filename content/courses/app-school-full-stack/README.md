# App School II (Full-Stack) {#app-school-ii-full-stack}

This series walks through the writing of a full Gall agent, and then the process of integrating it with a React front-end. This series follows on from [App School I](../app-school). If you haven't completed that, or otherwise aren't familiar with the basics of writing Gall agents, it's strongly recommended to work through that guide first.

The app we'll be looking at is a simple journal with an agent called `%journal`. In the browser, users will be able to add plain text journal entries organized by date. Entries may be scrolled through in ascending date order, with more entries loaded each time the bottom of the list is reached. Old entries will be able to be edited and deleted, and users will be able to search through entries by specifying a date range.

The `Journal` app we'll be looking at can be installed on a live ship from `~pocwet/journal`, and its source code is available [here](https://github.com/urbit/docs-examples/tree/main/journal-app).

![journal ui screenshot](https://media.urbit.org/guides/core/app-school-full-stack-guide/entries.png)

This walkthrough does not contain exercises, nor does it completely cover every aspect of building the app in full depth. Rather, its purpose is to demonstrate the process of creating a full-stack Urbit app, showing how everything fits together, and how concepts you've previously learned are applied in practice.

The primary focus of the walkthrough is to show how a Javascript front-end is integrated with a Gall agent and distributed as a complete app. Consequently, the example app is fairly simple and runs on a local ship only, rather than one with more complex inter-ship networking.

Each section of this walkthrough will list additional resources and learning material at the bottom of the page, which will cover the concepts discussed in a more comprehensive manner.

Here is the basic structure of the app we'll be building:

![journal app diagram](https://media.urbit.org/guides/core/app-school-full-stack-guide/journal-app-diagram.svg)

## Sections {#sections}

#### [Introduction](.) {#introduction}

An overview of the guide and table of contents.

#### [1. Types](1-types.md) {#1-types1-typesmd}

Creating the `/sur` structure file for our `%journal` agent.

#### [2. Agent](2-agent.md) {#2-agent2-agentmd}

Creating the `%journal` agent itself.

#### [3. JSON](3-json.md) {#3-json3-jsonmd}

Writing a library to convert between our agent's marks and JSON. This lets our React front-end poke our agent, and our agent send updates back to it.

#### [4. Marks](4-marks.md) {#4-marks4-marksmd}

Creating the mark files for the pokes our agent takes and updates it sends out.

#### [5. Eyre](5-eyre.md) {#5-eyre5-eyremd}

A brief overview of how the webserver vane Eyre works.

#### [6. React App Setup](6-react-setup.md) {#6-react-app-setup6-react-setupmd}

Creating a new React app, installing the required packages, and setting up some basic things for our front-end.

#### [7. React App Logic](7-app-logic.md) {#7-react-app-logic7-app-logicmd}

Analyzing the core logic of our React app, with particular focus on using methods of the `Urbit` class from `@urbit/http-api` to communicate with our agent.

#### [8. Desk and Glob](8-desk.md) {#8-desk-and-glob8-deskmd}

Building and "globbing" our front-end, and putting together a desk for distribution.

#### [9. Summary](9-final.md) {#9-summary9-finalmd}

Some final comments and additional resources.
