---
description: Documentation application for distributing docs with Urbit desks, supporting multiple file formats (txt, udon, gmi, html), automatic detection, and structured browsing through the %docs app.
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

# Docs App

The `%docs` app allows you to include documentation with the desks you distribute, making them available for easy browsing by users and developers.

The `%docs` app will automatically detect and publish any docs included with any installed desks. As long as they're in the correct place and of a filetype with appropriate `mark` conversion methods, they'll be picked up.

A `doc.toc` file may be included in the root of the desk, specifying the files to be included, their `$mark`s, and their titles. See the [Index File](index-file.md) section for details.

The files will be in a `/doc` directory in the root of the desk. They may be of any filetype, as long as it has conversion methods to the `%docu` mark used by the `%docs` app. The `%docs` app includes parsers and conversion methods for the following marks by default:

- `%txt` - Ordinary `.txt` text files.
- `%udon` - A markdown-like format that supports embedded hoon.
- `%gmi` - An ultra-minimalist markup format called "gemtext".
- `%html` - An ordinary `.html` file.

For more details of these file formats, as well as details of the `%docu` mark and other format requirements of the `%docs` app, see the [File Format](file-format.md) section.

Apart from the `$mark` and location requirements described above, there are no particular restrictions on how you organise your docs, or what docs you include. There are, however, some general recommendations detailed in the [Suggested Structure](structure.md) section.

## Dev desk {#dev-desk}

To include docs in your own desk, there are a few files you'll need (mark files, etc). These are included in the `/docs-dev` directory in the [github repo](https://github.com/tinnus-napbus/docs-app). These files are all symlinked, so you'll need to clone the whole repo, then copy them across with something like:

```
cp -rL git/docs-app/docs-dev/* /path/to/your/development/desk
```
