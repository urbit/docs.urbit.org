+++
title = "Factory Reset"
[extra]
category = "arvo"

[glossaryEntry.breach]
name = "breach"
symbol = ""
usage = "azimuth"
desc = "A factory reset generating a new public/private key pair."

[glossaryEntry."factory reset"]
  name = "factory reset"
  symbol = ""
  usage = "azimuth"
  desc = "A factory reset generating a new public/private key pair."
+++

Continuity on the [Ames](/glossary/ames) network occasionally needs to be
broken in order to correct a networking error. These infrequent events are known
as **factory resets**, which causes an individual ship to forget its network
message history and restores it to the state in which you booted it for the
first time.

Factory resets are always initiated by the user, frequently in response to a
connectivity error. The easiest way to do this is with [Bridge](/glossary/bridge).
The option to perform a factory reset is given when changing the networking keys,
and when transferring the Urbit ID to a new ownership address.

In practical terms, the `life` (or key revision number) and `rift` (or
continuity number) are both incremented.  (The `rift` may be revised without a
corresponding change in keys, however, so these numbers may differ.)

Historically, there were also "network resets" or "network breaches", which happened when a major
Arvo revision that could not be implemented via an [OTA update](/glossary/ota-updates)
occured. Network resets were effectively factory resetting every ship on the network
at once. The most recent network reset occurred in December 2020, and we expect
it to be the final one.  Each period between network breaches was called an "era",
so we are living in the final era.

Factory resets used to be called "breaches", and you may still see this language
used in some places. The notion is identical, only the name differs.

### Further Reading

- [Guide to Factory Resets](/manual/id/guide-to-resets): A more in-depth
  explanation of factory resets, including how to perform one.
- [Ship Troubleshooting](/manual/os/ship-troubleshooting): General instructions on getting your ship to work, which includes network connectivity issues.
- [Life and Rift](/system/identity/concepts/life-and-rift)
- [Using Bridge](/manual/id/using-bridge): A guide to starting out with Bridge.
- [The Azimuth concepts page](/system/identity/guides/advanced-azimuth-tools): A more in-depth explanation of our identity layer.

