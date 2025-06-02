# Eyre

Eyre is the webserver vane.

HTTP messages come in from outside and Eyre produces HTTP messages in response. In general, apps do not call Eyre; rather, Eyre calls apps. Eyre has a number of ways to handle such HTTP requests which we'll briefly describe.

## Authentication {#authentication}

Most types of requests require the client provide a valid session cookie which is obtained by authenticating with your ship's web login code. Authentication is documented in the [Authentication](reference/external-api-ref.md#authentication) section of the [External API Reference](reference/external-api-ref.md) documentation.

## The Channel System {#the-channel-system}

Eyre's channel system is the primary way of interacting with Gall agents from outside of Urbit. It provides a simple JSON API that allows you to send data to apps and subscribe for updates from apps. Updates come back on a SSE ([Server Sent Event](https://html.spec.whatwg.org/#server-sent-events)) stream which you can easily handle with an EventSource object in Javascript or the equivalent in whichever language you prefer.

The channel system is designed to be extremely simple with just a handful of `action` and `response` JSON objects to deal. Essentially it's a thin layer on top of the underlying Gall agent interface. You can poke agents, subscribe for updates, etc, just like you would from within Urbit.

Detailed documentation of the channel system's JSON API is provided in the [External API Reference](reference/external-api-ref.md) document with corresponding examples in the [Guide](guides/guide.md#using-the-channel-system) "BROKEN_ANCHOR" document.

## Scrying {#scrying}

Along with the channel system, Eyre also provides a way to make read-only requests for data which are called scries. Eyre's scry interface is separate to the channel system but may be useful in conjunction with it.

Details of Eyre's scry API are in the [Scry](reference/external-api-ref.md#scry) section of the [External API Reference](reference/external-api-ref.md) document.

## Spider Threads {#spider-threads}

Spider (the Gall agent that manages threads) has an Eyre binding that allows you to run threads through Eyre. Spider's [HTTP API](../../../userspace/threads/guides/http-api.md) is not part of Eyre proper, so is documented separately in the [Threads](../../../userspace/threads) documentation.

## Generators {#generators}

Generators, which are like Hoon scripts, can also be used through Eyre. Rather than having a predefined JSON API, they instead handle HTTP requests and return HTTP responses directly, and are therefore a more complex case that you're less likely to use.

Their usage is explained in the [%serve](reference/tasks.md#serve) section of the [Internal API Reference](reference/tasks.md) documentation and a practical example is provided in the [Generators](guides/guide.md#generators) section of the [Guide](guides/guide.md) document.

## Direct HTTP Handling With Gall Agents {#direct-http-handling-with-gall-agents}

As well as the [Channel System](#the-channel-system) and [Scries](#scrying), it's also possible for Gall agents to deal directly with HTTP requests. This method is much more complicated than the channel system so you're unlikely to use it unless you want to build a custom HTTP-based API or something like that.

This method is explained in the [%connect](reference/tasks.md#connect) section of the [Internal API Reference](reference/tasks.md) document and a detailed example is provided in the [Agents: Direct HTTP](guides/guide.md#agents-direct-http) section of the [Guide](guides/guide.md) document.

## Cross-Origin Resource Sharing {#cross-origin-resource-sharing}

Eyre supports both simple [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) requests and OPTIONS preflight requests. It has a CORS registry with three categories - `approved`, `rejected` and `requests`. Eyre will respond positively for origins in its `approved` list and negatively for all others. Eyre will add origins in requests that it doesn't have in either its `approved` or `rejected` lists to its `requests` list. Eyre always allows all methods and headers over CORS.

There are three generators - `+eyre/cors/registry`, `|eyre/cors/approve`, and `|eyre/cors/reject` to view, approve, and deny origins respectively from the dojo. Eyre also has [tasks](reference/tasks.md) to [approve](reference/tasks.md#approve-origin) and [reject](reference/tasks.md#reject-origin) origins programmatically, and a number of [scry endpoints](reference/scry.md) to query them. Examples are also included in the [Managing CORS Origins](guides/guide.md#managing-cors-origins) section of the Guide document.
