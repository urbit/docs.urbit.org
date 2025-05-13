# Replay

**Replay** is how [Vere](/glossary/vere) computes the state of a ship's [Arvo](/glossary/arvo) instance from the [event log](/glossary/eventlog) after a ship reboots. In order to avoid replaying the entire event log, Replay takes a snapshot of the current state of the ship approximately once every ten minutes. Then when a ship reboots, Replay loads the most recent snapshot and replays events from the event log up to the most recent event.

### Further Reading

- [The Vere tutorial](/system/runtime/): An in-depth technical guide to Vere.
