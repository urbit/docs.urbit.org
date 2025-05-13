# Hood

**Hood** is the "system app", it controls various basic functions of Arvo and provides an interface for some of those functions with [generators](generator) in the [dojo](dojo). While Hood is technically a single app, it's really three different apps under the hood:

- `%kiln`: Manages desk and agent installation, updates, etc.
- `%drum`: Provides an interface to [Dill](dill), the terminal driver [vane](vane), for userspace apps.
- [`%helm`](helm): Provides a user interface for various low-level settings, kernel functions and reports.
