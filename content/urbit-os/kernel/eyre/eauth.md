# EAuth

EAuth is a system built into Eyre which allows one ship to log into the web interface of another. Once logged in, all requests through Eyre will appear to Gall agents as having come from the foreign ship, in the `src` of the bowl. The agents can apply whatever logic they want based on the foreign `src`. Most Urbit apps (including Landscape) don't currently allow requests from anyone but the local ship. Nevertheless, EAuth has many potential useful applications, such as a allowing comments from other ships on a public-facing Urbit-hosted blog.

## When to use {#when-to-use}

Landscape and its `%docket` agent don't currently support access from foreign ships. You therefore cannot provide an app-launcher interface to foreign ships, nor serve them an ordinary globbed front-end. This leaves three potential use-cases:

1. A sail-based UI for a public-facing Urbit-hosted app.
2. A glob-based UI, but with the front-end files served independently from `%docket`.
3. As an authentication system for an externally hosted service, with an additional API for that service to talk to the ship.

 The first case is the most common one.

## How it works {#how-it-works}

1.  Eyre's `/~/login` endpoint receives an HTTP POST request asking for EAuth login with `~sampel-palnet`.
2.  Eyre asks `~sampel-palnet` for its EAuth endpoint URL.
3.  `~sampel-palnet` responds with its EAuth endpoint URL.
4.  Eyre redirects the user to `~sampel-palnet`'s EAuth endpoint URL to approve or reject the authorization request.
5.  The user approves the request on `~sampel-palnet`.
6.  `~sampel-palnet` redirects the user back to your ship's EAuth endpoint.
7.  Your ship's EAuth endpoint sets a cookie in the user's browser attesting to their identity as `~sampel-palnet`.
8.  Your ship's EAuth endpoint redirects the user to the local URL path specified in the original POST request.
9.  All HTTP requests from that user's browser to your ship will now come in to agents with the `src` set to `~sampel-palnet`, until the user logs out or the cookie expires.
10. You can apply whatever logic you want based on that `src`, e.g. serving info about that user's account on your blog and allowing that user to post comments.

There are some additional semantics around tokens and nonces to associate sessions, cookies, and EAuth authentication state, but these are handled in the background and aren't relevant from an app developer's perspective.

The user can logout from the session with a simple GET request to Eyre's `/~/logout` endpoint.

## How to use it {#how-to-use-it}

The HTTP POST request to initiate an EAuth login request is very simple. It's made to the `/~/login` URL of your ship, and its body is standard `form-data` query parameter encoding. The three fields are:

1. `name`: the ship to login as, e.g. `~sampel-palnet`.
2. `redirect`: a URL path on your ship to send the user to after authentication is completed. If it's root-relative like `/foo/bar/baz`, that's where they'll be sent. If it's not root-relative, it'll be prefixed with `/~/`, so `foo` will become `/~/foo`. If the value's empty, it'll default to `/`.
3. `eauth`: this field simply needs to exist to specify an EAuth login. The value can be empty.

Therefore, the body of the POST request to `/~/login` might look like `name=~sampel&redirect=/foo&eauth=` or `name=~sampel&redirect=&eauth=`.

In order to log out, you can simply make an HTTP GET request to `/~/logout`. The body of the GET request may optionally include `all=`. If included, all other sessions for the user will also be logged out.

In general, you'll want to serve an initial fully public page that gives the user the opportunity to login. Once logged in, you can then serve identity-specific data.

## The endpoint {#the-endpoint}

Ships implicitly determine the host for the EAuth endpoint URL by looking at the `Host` header of the HTTP request of the last successful login attempt.

For performance optimization reasons, the request for the endpoint of a remote ship is rounded down to the last hour. This means that if a remote ship has updated its endpoint within the last hour, the new endpoint may not be discovered.

In additon to the implicitly determined endpoint, an endpoint can be explicitly set with Eyre's `%eauth-host` task. It looks like:

```hoon
[%eauth-host host=(unit @t)]
```

If `host` is null it unsets any previous explicitly set host. Otherwise, it sets the URL given in the `@t`. This is stored separately to the inferred host, and overrides it.

Most of the time, Urbit does a good job at guessing what the ship's URL is in sufficient detail for Eauth (remote login) to work correctly.  Sometimes, however, the address must be supplied explicitly (per the above) for things to work.


## Errors {#errors}

When an EAuth login attempt is initiated with an HTTP POST request, a response will not be returned until your ship can contact the remote ship for its EAuth endpoint. If the ship is unknown, it may take a little time to discover a route. If the ship cannot be contacted, the request will eventually time out and return a 50x error message. If the foreign ship *does* respond, but it doesn't have any EAuth endpoint set, it will also fail.

Most ships will know their EAuth endpoint and things will work fine, but if they're behind a reverse-proxy that does not pass through the HTTP `Host` header, they may never discover their endpoint. This can be remedied by reconfiguring the reverse-proxy or explicitly setting the endpoint with the Eyre task described above.
