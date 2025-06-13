# Urbit Docs Style Guide

## Style & Tone of Voice

The Urbit docs are written for several audiences: new Urbit developers, seasoned Urbit developers, potential investors, large language models, and more. Different sections of the site target different audiences, so they should be written in a tone of voice appropriate for that audience.

### The docs in general

* Write in a clear, formal tone with minimal color.
* Use American English spelling.
* Use the Oxford comma.
* Urbit IDs should be referred to as “Urbit IDs” outside of a Hoon context where it would make more sense to refer to them as “`@p`s”.
* Urbit IDs should not be monospaced or otherwise specially formatted by default, but this is fine if the situation really calls for it.
* Call it "Urbit OS" in top-level landing pages and the like unless you're actually talking about `/sys/arvo.hoon`.
* Avoid em-dashes — they look weird in the monospace code editors we use to edit the docs. They can also be mistaken as a telltale sign of LLM-generated text. Don’t use `--` or `&mdash;` in their place; use semicolons to break up two independent but related clauses and use a pair of commas (or round brackets) as parentheses.
* Try to avoid beginning a paragraph with monospaced text; whatever text you’d put in front of it would usually help the reader follow your thinking. Starting a bullet-point with monospaced text is fine.

### Landing pages, overview pages

* Overview/landing pages should be accessible to a non-technical audience to help them find their way around the site.
* Avoid Urbit-specific jargon wherever possible. A new developer should be able to do a "breadth-first" skim of these navigation pages and roughly understand the contents beneath those pages in the filetree.

### Guides, courses, tutorials

* Guides and courses should be accessible to new Urbit developers.
* Urbit has a strong track record of attracting non- or somewhat-technical people and turning them into productive developers. As such, references to big-brain computer science concepts should be avoided where possible, and contextualized where unavoidable.
  * Comparisons to common programming concepts like functions, Promises, etc. where appropriate are *strongly encouraged*.
* Err on the side of formatting common kernelspace structures and molds as `$path`, `$mark`, `+list` etc., where in other sections of the docs this would be discouraged.

### Reference material

* Reference pages may assume a high level of familiarity with the system.

## Formatting

The purpose of formatting is to disambiguate as quickly and clearly as possible: picoseconds of confusion add up to a poor reading experience, especially when the reader is unfamiliar with the concepts being discussed.

### Formatting prose

* Hoon arms are always `+foo`, never `foo` or `++foo`.
* Hoon paths are always `/foo/bar`.
* Named wings in the Hoon subject are always `.foo`, `.foo.bar`, etc.
  * Occassionally you might want to refer to the name of the wing as distinct from the value of that named wing. In this case, use backticks without prepending a `.`. (For example, the name of the wing `.foo` is `foo`.)
* Hoon structures are almost always `$foo`, and never `foo` or `+$foo`.
  * Use `%foo` when referring to the actual `%foo` mark, not when referring to the `$foo` datatype it converts to, nor the `/mar/foo.hoon` file that defines it.
  * When a kernelspace Hoon structure is referred to so many times throughout the docs, or this page, that it would be annoying to call it `$foo` every time, just call it “foo”.
    * Example: *The path ends with a mark.*
* Desks are always `%base`, never `base`.
  * Desks may be referred to as `/base` when referring to the Unix directory.
* Unix directories are always `/foo`, never `foo`.
* Files in a desk are generally referred to as `/app/foo.hoon`, `/lib/foo.hoon`, `/mar/foo.hoon`, `/sur/foo.hoon`, and so on.
* Library files in a desk are always introduced as `/lib/foo.hoon` and never `/lib/foo` or `lib/foo`.
  * When referring to a library like strandio by name, just call it "strandio" rather than `strandio`.
* When writing about non-Hoon languages, use whatever conventions of that language’s first- and third-party documentation that exist to format inline symbols. For example, JavaScript functions and classes should always be `foo()`, never `foo`.
* Vanes like Gall are always Gall, never %gall, `%gall`, or `gall`.

### Formatting code blocks

* Disambiguate between Unix and Dojo code blocks as clearly as possible.
  * Use `>`  and  `$`  prompts to differentiate between Dojo and Unix input.
  * You have the option of using the code block’s `title` metadata to specify “Dojo” or “Unix” if necessary.
* If the code block is part of a file, always include the name of the file in the code block’s metadata.
  * If the file is in a desk, include the parent directory (e.g. `/app/foo.hoon`).
* Hoon code blocks should never be wrapped.

## Hoon Style

Hoon in the docs should generally follow the [Hoon Style Guide](https://docs.urbit.org/hoon/guides/style), with some extra considerations for new developers and for limited screen real estate:
* A line of Hoon should be no more than 80 columns wide. It should strive to be no more than 56 columns wide.
* Backstep as early and often as you reasonably can.

### Hoon Prime

Hoon in the docs should conform to "Hoon Prime" conventions, originally defined by \~lagrev-nocfep. There’s too much Hoon in the docs to apply this all at once. So whenever you’re reviewing Hoon code in the docs, consider whether it could be made more prime.

Our canonical definition of Hoon Prime lives [here](./HOON-PRIME.md).
