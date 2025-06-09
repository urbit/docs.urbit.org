# Pier

A **pier** is the directory which contains the state of an Urbit [ship](ship.md). It is automatically created in the current directory when booting a ship for the first time.

Your pier should be kept safe - if it's deleted, you will need to perform a [factory reset](reset.md) in order to inform the rest of the network that your ship's state has been lost.

Note that a backup should usually _not_ be taken of your pier as a means of keeping it safe - once the ship is run on the network, the backup will be outdated and running from it will necessitate a factory reset. A running ship automatically backs up its own state within the pier directory for recovery purposes, so as long as the pier is preserved, recovery from most problems is possible.

### Further Reading <a href="#further-reading" id="further-reading"></a>

* [Event Log](eventlog.md): The main important content of the pier directory.
* [Guide to Factory Resets](../user-manual/id/guide-to-resets.md): Instructions on performing a factory reset.
* [Ship Troubleshooting](../user-manual/os/ship-troubleshooting.md): General instructions on getting your ship to work, which includes network connectivity issues.
