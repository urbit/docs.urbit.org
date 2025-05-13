# Hood

**Hood** is the "system app", it controls various basic functions of Arvo and provides an interface for some of those functions with [generators](/glossary/generator) in the [dojo](/glossary/dojo). While Hood is technically a single app, it's really three different apps under the hood:

- `%kiln`: Manages desk and agent installation, updates, etc.
- `%drum`: Provides an interface to [Dill](/glossary/dill), the terminal driver [vane](/glossary/vane), for userspace apps.
- [`%helm`](/glossary/helm): Provides a user interface for various low-level settings, kernel functions and reports.
