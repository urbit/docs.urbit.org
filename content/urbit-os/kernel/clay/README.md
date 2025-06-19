---
description: Documentation for Clay, Arvo's version-controlled, referentially-transparent, and global filesystem, including architecture, data types, marks, and usage patterns.
---

# Clay

Clay is Arvo's filesystem.

Clay is version-controlled, referentially-transparent, and global.

While this filesystem is stored in the Clay module, it can be mirrored to Unix for convenience. Unix tells Clay whenever a file changes in the Unix copy of the filesystem so that the change may be applied. Clay tells Unix whenever an app or vane changes the filesystem so that the change can be effected in Unix.

Clay includes three components:
- Filesystem and version control algorithms, which are mostly defined in `+ze` and `+zu` in Zuse.
- Write, query, and subscription logic.
- Logic for communicating requests to, and receiving requests from, foreign ships.
