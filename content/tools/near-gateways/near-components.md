+++
title = "NEAR Components"
weight = 11
template = "doc.html"
+++

The `/src` folder isn’t so different from any other React app. The main difference is the use of NEAR components, which you’ll import from the NEAR blockchain or from your local testing environment.

In either case, you’ll import each of your components through a component called `Widget`.

```javascript
import { Widget } from 'near-social-vm'
```

The `Widget` component has several optional attributes, but for now you only need to know about three: `src`, `props`, and `code`.

The `src` attribute is the path to your component’s JavaScript code, stored onchain.

```JSX
<Widget src='influencer.testnet/widget/Greeter' />
```

The `props` attribute will be JSON data passed into a component. For example, this will return a component reading "3 cheers for Anna!"

```JSX
 <Widget src='influencer.testnet/widget/Greeter' props={{name: 'Anna', amount: 3}} />
```

The `code` attribute can accept stringified code and render it to the DOM. One highlight of our `create-near-app` fork is that we use this as an alternative to `src` to render local components from `/build/data.json`, which simulates onchain data. This makes it trivial to write and test local components which are ready to copy-paste onto the blockchain.

## Writing local components

The `/components` folder is where you’ll write new components. NEAR components mostly look like React components, but not wrapped in an exported class or function like `MyComponent()`. Out of the box, BOS supports [styled components](https://styled-components.com/); you don’t have to use them, but you might see them if you look at other NEAR components.

Here’s a simple example of a NEAR component.

```JSX
const userName = props.userName || "Anna";
const [count, setCount] = useState(1);

return (
  <div>
    <p> {count} cheers for {userName}! </p>
    <button onClick={() => setCount(count + 1)}>Cheers!</button>
  </div>
);
```

The only requirement for a NEAR component is a return statement. Usually these return JSX like a React component, but you can return any JavaScript you want.

## Testing components

When you’ve finished writing your components, you can make sure they build with this script.

```
> npm run component-build
```

This creates a file `/build/data.json` which encodes all your gateway’s components in one JSON file, simulating the component data you’d find onchain.

You can see those components being referenced in `Widget`s in `/pages/ExamplePage.js`, which is the homepage of the example gateway.

Now in your `Widget`s, you can import these local components by passing the JSON into the `code` attribute.

```JSX
import React from 'react'
import { Widget } from 'near-social-vm'
import localComponents from '../../build/data.json'

function ExamplePage({ api }) {
  const localUrbitHeader = localComponents['local.components/widget/components.header']
  const localPokeUrbit = localComponents['local.components/widget/components.pokeUrbit']
  const localScryUrbit = localComponents['local.components/widget/components.scryUrbit']

  return (
    <div>
      <Widget
        code={localUrbitHeader.code}
      />
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '500px',
          width: '75vw',
          margin: 'auto'
        }}>
          <div>
            <Widget
              // src={'urbitlabs.near/widget/pokeUrbit'}
              code={localPokeUrbit.code}
              props={{ api: api }}
            />
          </div>
          <div>
            <Widget
              // src={'urbitlabs.near/widget/scryUrbit'}
              code={localScryUrbit.code}
              props={{ api: api }}
            />
          </div>
        </div>
    </div>
  )
}

export default ExamplePage
```

When you want to see your components in action, you can run a dev server with `npm run dev`. (This script includes npm run build-component, so you’ll always be working with the latest version of your code.)

## Urbit-aware NEAR components

This gateway uses a fork of the NEAR Social VM that includes an `Urbit` object, and that object has three methods you can use to interact with your ship. The main ones are `Urbit.poke()` and `Urbit.scry()`.

### poke(app, mark, json, OnSuccess, OnError)

Send a poke (like a POST request) to the local ship.

This method takes the `app` you’d like to send a poke to, the `mark` that tells the app what kind of poke it is, and a `json` object with the data you’d like to send. (Note: as in the example below, the json argument can also be a string.)

The `OnSuccess` and `OnError` parameters are optional. These allow you to pass in callback functions which will run after the poke has succeeded or failed on the Urbit server.

```Javascript
Urbit.poke('hood', 'helm-hi', 'hello urbit!')
.then(res => {
  // code
})
```

An app’s `mark`s are defined by the developer, so you’ll have to read the app’s source code or documentation to find those, as well as the keys the `json` object should have.

Take a look at [this example Urbit app](https://docs.urbit.org/courses/app-school/6-pokes) from the App School course to see marks in context. With JSON keys, the key count in your JSON object should correspond to something like `count.action` or `count.act` in the app. If you want to understand more about the code in that example, it’s never been easier to [learn Hoon](https://docs.urbit.org/courses/hoon-school), Urbit’s native functional programming language.

### scry(app, path)

Send a scry (like a GET request) to the local ship.

This method takes the `app` you’d like to scry, and the `path` of the endpoint in that app. You can find the endpoints for a given app in the `on-peek` section of the file at `/zod/<desk-name>/app/<app-name>.hoon`.

As far as frontend developers are concerned a tuple like `[%x %charges ~]` corresponds to a scry path like `/charges`. A tuple like `[%x %foo %bar ~]` corresponds to a scry path like `/foo/bar`, etc.

```Javascript
Urbit.scry('docket', '/charges')
.then(res => {
  // code
})
```

(Note that in both methods, the `app` argument corresponds to the name of a “Gall agent” and not a desk. An agent is a combined state machine and API that serves as the backend for an app, and that helps make Urbit software composable by default. An agent could be a small app on its own, or it could be one of several state machines that run a larger app. In any case a desk is a package containing an app. A desk’s agents are the files in its `/app` folder.)

### setApi(api)

Treat this as boilerplate. When you write an Urbit-aware NEAR component, paste in the following two lines at the top and add destructured props to the first line as needed.

```Javascript
let { api } = props
Urbit.setApi(api)
```

With the `api` prop, your component can use `api.ship` and `api.url` to access the user’s Urbit ID and the host machine’s URL respectively. These are useful for UI text and navigation.
