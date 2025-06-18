# Iris API Reference

This document details the `task`s used by Iris. Iris only has three `task`s besides the standard vane `task`s: [%request](#request), [%cancel-request](#cancel-request), and [%receive](#receive). The `%receive` `task` is only sent to Iris by the runtime, so you're likely to only use `%request` and `%cancel-request`.

## `%request` {#request}

```hoon
[%request =request:http =outbound-config]
```

Fetch a remote HTTP resource.

The [$request:http](../eyre/data-types.md#requesthttp) is the request itself and contains the HTTP method, the fully qualified target URL, a list of HTTP headers to be included and maybe the data for the body of the request.

The [$outbound-config](data-types.md#outbound-config) specifies the number of redirects to follow before failing and the number of retries to attempt before giving up. The default values are `5` and `3` respectively. As of writing, **retries and auto-following redirects are not implemented**, so what you specify here is irrelevant and you can just use the bunt value of `outbound-config`.

#### Returns

Iris returns a `%http-response` `gift` in response to a `%request` task. A `%response` `gift` looks like:

```hoon
[%http-response =client-response]
```

The [$client-response](data-types.md#client-response) contains the HTTP response from the server including the status code, HTTP headers and any data along with its mime type.

The `client-response` structure specifies three kinds of responses - `%progress`, `%finished` and `%cancel`. The `%progress` response would contain each chunk of the message as it came in, `%finished` would contain the final assembled message from Vere's buffer, and `%cancel` would be sent if the runtime cancels the request.

Note that neither `%progress` partial messages nor `%cancel` responses have been implemented in Vere at the time of writing, so **you will only ever receive a single `%http-response` `gift` with a `%finished` `client-response`**. If the request fails for some reason, you'll still get an empty `%finished` `client-response` with a `504` status code.

#### Example

See the [Example](example.md) document.

## `%cancel-request` {#cancel-request}

```hoon
[%cancel-request ~]
```

Cancel a previous request to fetch a remote HTTP resource.

A `%cancel-request` `task` does not take any arguments, the [request](#request) to cancel is determined implicitly.

#### Returns

Iris does not return any `gift` in response to a `%cancel-request` `task`. You will also not receive any `gift` back from the original `%request` `task` you've cancelled.

## `%receive` {#receive}

```hoon
[%receive id=@ud =http-event:http]
```

Receives HTTP data from outside. This `task` is sent to Iris by the runtime, you would not use it manually.

The `id` is a sequential ID for the event and the [$http-event:http](../eyre/data-types.md#http-eventhttp) contains the HTTP headers and data.
