---
description: "Practical example of fetching and parsing JSON data in threads using strandio's +fetch-json function, demonstrated with a Bitcoin price fetcher that queries external APIs and processes responses."
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

# Fetch JSON

Grabbing JSON from some url is very easy.

`strandio` includes the `+fetch-json` function which will handle the HTTP request, response, and parsing, producing JSON.

The following thread fetches the current Bitcoin price from the [CoinGecko API](https://www.coingecko.com/en/api) in the specified currency and prints it to the terminal.

{% code title="/ted/btc-price.hoon" overflow="nowrap" lineNumbers="true" %}
```hoon
/+  *strandio
=,  dejs-soft:format
|=  arg=vase
=/  m  (strand:rand ,vase)
^-  form:m
=/  url
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies="
=/  cur  !<((unit @tas) arg)
?~  cur  (strand-fail:rand %no-arg ~)
=.  u.cur  (crip (cass (trip u.cur)))
?.  ((sane %tas) u.cur)  (strand-fail:rand %bad-currency-format ~)
;<  =json  bind:m  (fetch-json (weld url (trip u.cur)))
=/  price=(unit @ta)  ((ot ~[bitcoin+(ot [u.cur no]~)]) json)
?~  price  ((slog 'Currency not found.' ~) (pure:m !>(~)))
%-  (slog leaf+"{(trip u.price)} {(cuss (trip u.cur))}" ~)
(pure:m !>(~))
```
{% endcode %}

Save it as `/ted/btc-price.hoon` in the `%base` desk of a fake ship, `|commit %base` and run it with `-btc-price %usd`. You should see something like:

```
> -btc-price %usd
49168 USD
```

You can try with other currencies as well:

```
> -btc-price %nzd
72455 NZD
> -btc-price %aud
68866 AUD
> -btc-price %gbp
37319 GBP
```

### Analysis {#analysis}

The thread takes an `@tas` as its argument, which the dojo wraps in a `$unit`. We extract the `$vase` and check it's not empty:

```hoon
=/  cur  !<((unit @tas) arg)
?~  cur  (strand-fail:rand %no-arg ~)
```

We then convert it to lowercase and check it's a valid `@tas`:

```hoon
=.  u.cur  (crip (cass (trip u.cur)))
?.  ((sane %tas) u.cur)  (strand-fail:rand %bad-currency-format ~)
```

Next, we use the `+fetch-json` function in `strandio` like so:

```hoon
;<  =json  bind:m  (fetch-json (weld url (trip u.cur)))
```

We convert the currency to a `$tape` and `+weld` it to the end of the `url`, which we give as an argument to `+fetch-json`. The `+fetch-json` function will make the request to the URL, receive the result, parse the JSON and produce the result as a `$json` structure.

The JSON the API produces looks like:

```json
{
  "bitcoin": {
    "usd": 49477
  }
}
```

Since it's an object in an object, we decode them using nested [`ot:dejs-soft:format`](../../../../hoon/zuse/2d_7.md#otdejs-softformat) functions, and the price itself using [`no:dejs-soft:format`](../../../../hoon/zuse/2d_7.md#nodejs-softformat) to produce a `(unit @ta)`:

```hoon
=/  price=(unit @ta)  ((ot ~[bitcoin+(ot [u.cur no]~)]) json)
```

Finally, we check if the `$unit` is null and either print an error or print the price to the terminal with `+slog` functions (the thread itself produces `~`):

```hoon
?~  price  ((slog 'Currency not found.' ~) (pure:m !>(~)))
%-  (slog leaf+"{(trip u.price)} {(cuss (trip u.cur))}" ~)
(pure:m !>(~))
```

For more information about working with `json`, see the [JSON Guide](../../../../hoon/json-guide.md).
