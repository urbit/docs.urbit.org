# Hood {#hood}

**Hood** is the "system app", it controls various basic functions of Arvo and provides an interface for some of those functions with [generators](generator.md) in the [dojo](dojo.md). While Hood is technically a single app, it's really three different apps under the hood:

- `%kiln`: Manages desk and agent installation, updates, etc.
- `%drum`: Provides an interface to [Dill](dill.md), the terminal driver [vane](vane.md), for userspace apps.
- [`%helm`](helm.md): Provides a user interface for various low-level settings, kernel functions and reports.
