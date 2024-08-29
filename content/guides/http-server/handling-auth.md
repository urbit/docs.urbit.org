+++
title = "Handling Authentication"
weight = 10
+++

You must have a valid session cookie in order to use Eyre's interfaces (such as the channel system or scry interface). If your HTTP client is served from your ship, your browser will automatically add the session cookie it obtained upon login, so there's no need to worry about authentication in practice. If your client does not run in the browser or is not served by your ship, [authenticating](/system/kernel/eyre/reference/external-api-ref#authentication) with your web login code (which can be obtained by running `+code` in the dojo) is necessary.

Here we'll try authenticating with the default fakezod code.

Using `curl` in the unix terminal, we'll make an HTTP POST request with `"password=CODE"` in the body:

```
curl -i localhost:8080/~/login -X POST -d "password=lidlut-tabwed-pillex-ridrup"
```

Eyre will respond with HTTP status 204, and a `set-cookie` header containing the session cookie.

```
HTTP/1.1 204 ok
Date: Tue, 18 May 2021 01:38:48 GMT
Connection: keep-alive
Server: urbit/vere-1.5
set-cookie: urbauth-~zod=0v3.j2062.1prp1.qne4e.goq3h.ksudm; Path=/; Max-Age=604800
```

The `urbauth-....` cookie can be now be included in subsequent requests (e.g. to the channel system) by providing it in a Cookie HTTP header.