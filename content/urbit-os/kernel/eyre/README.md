# Eyre

Eyre is Arvo's HTTP server module.

HTTP requests come in from clients (web frontends, mobile apps, etc.) and Eyre produces HTTP responses. Eyre has a number of ways to handle such HTTP requests which we'll briefly describe.

## Authentication {#authentication}

Most types of HTTP request require the client to provide a valid session cookie, which is given to the client by the [ship](../../../glossary/ship.md) when the user logs in with their web login code. This process is documented in the [Authentication](reference/external-api-ref.md#authentication) section of Eyre's [External API Reference](reference/external-api-ref.md).

## The Channel System {#the-channel-system}

An Eyre channel is a Server Sent Event (SSE) stream. It's the primary way of interacting with Urbit apps from outside Urbit, because it provides a simple JSON API that allows you to send data to apps 

Eyre's "channel" system is the primary way of interacting with Urbit apps from clients outside of Urbit. It provides a simple JSON API that allows you to send data to apps, and a [Server Sent Event](https://html.spec.whatwg.org/#server-sent-events) (SSE) stream to subscribe to updates from a backend on the Urbit ship.

Detailed documentation of the channel system's JSON API is provided in Eyre's [External API Reference](reference/external-api-ref.md), with corresponding examples in the [Guide](guides/guide.md#using-channels) document.

## Scrying {#scrying}

You can make read-only requests to Eyre with HTTP GET requests or [scries](../../../glossary/scry.md). Eyre's scry interface documented in the [Scry](reference/external-api-ref.md#scry) section of the [External API Reference](reference/external-api-ref.md).

## Threads {#threads}

You can also run [threads](../../../glossary/thread.md) directly through Eyre via HTTP request. The [API for this](../../base/threads/guides/http-api.md) is not part of Eyre itself, so is documented in the seperate [Threads](../../base/threads) section.

## Generators {#generators}

[Generators](../../../glossary/generator.md) (Hoon scripts) can also be used by clients via Eyre. These don't have a JSON API, but handle HTTP requests and return HTTP responses directly.

This usage is uncommon, but is explained in the [`%serve`](reference/tasks.md#serve) section of Eyre's [Internal API Reference](reference/tasks.md). A practical example is provided in the [Generators](guides/guide.md#generators) section of the Eyre [guide](guides/guide.md).

## Direct HTTP Handling With Gall Agents {#direct-http-handling-with-gall-agents}

As well as the [Channel System](#the-channel-system) and [Scries](#scrying), it's also possible for Urbit apps to deal directly with HTTP requests using their own developer-defined logic.

This method is explained in the [`%connect`](reference/tasks.md#connect) section of Eyre's [Internal API Reference](reference/tasks.md) document; a detailed example is provided in the [Agents: Direct HTTP](guides/guide.md#agents-direct-http) section of the Eyre [guide](guides/guide.md).

## Cross-Origin Resource Sharing (CORS) {#cross-origin-resource-sharing}

Eyre supports both simple [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) requests and OPTIONS preflight requests. Eyre has a CORS registry with three categories: `approved`, `rejected` and `requests`. Eyre will respond positively for origins in its `approved` list, and negatively for all others. If a request comes in that isn't from an `approved` or `rejected` origin, Eyre will add that origin to the `requests` list. Eyre always allows all methods and headers over CORS.

This is documented in [Managing CORS Origins](guides/guide.md#managing-cors-origins).

