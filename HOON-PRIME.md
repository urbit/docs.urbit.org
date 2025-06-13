# Hoon Prime

Code accessibility cannot be an afterthought for Urbit development.

Hoon has had a reputation for being a language of dense expressions, which we believe is now being cleared by sunshine. However, Hoon's extensive sugar syntax and irregular expressiveness can make it challenging for those relatively new to Hoon to decipher programs.

Code accessibility must be a priority for userspace Hoon. We can support developer learning and entry into the ecosystem by defining a subset of Hoon syntax that we adhere to in all of the appropriate guides and some of the userspace code.

Let's call this subset "Hoon Prime". Hoon Prime will be a code discipline within Hoon to promote a clear pathway for newer developers to understand the nature of Hoon programs before needing to grapple with the entire panoply of syntax and runes. Hoon Prime may not alway be the most concise Hoon code, and it will likely fail to maintain certain well-established preferences. (Even if there is a "better" way to write it, we should prefer this restricted discipline in Hoon Prime.) Hoon Prime will allow us to onboard developers into producing generators and agents from `%base`-distributed models as quickly as possible.

## Programming Style

### Runes

The first concerns are to limit the scope of runes that must be learned to the top 27 most important ones, with another 27 context-specific runes included for particular code constructions.

- `|_` barcab
- `|%` barcen
- `|.` bardot
- `|-` barhep
- `|^` barket
- `|=` bartis
- `$%` buccen
- `$:` buccol
- `$?` bucwut
- `%=` cenhep (sugar preferred but not mandated)
- `%-` cenhep
- `%:` cencol
- `%~` censig
- `:-` colhep
- `:~` colsig
- `:*` coltar
- `.+` dotlus (only as sugar syntax `+()`)
- `;:` miccol
- `~&` sigpam (with logging levels)
- `=/` tisfas (specifically preferred over `=+` and `=-`)
- `=>` tisgar
- `?:` wutcol
- `?-` wuthep
- `?+` wutlus
- `?~` wutsig
- `!!` zapzap

The following are allowed *in specific contexts or forms*:

- `|*` bartar
- `$_` buccab (only as sugar syntax `_`)
- `%+` cenlus (as contrastive with `%-` and `%:`)
- `.^` dotket
- `.=` dottis (only as sugar syntax `=()`)
- `^:` ketcol (only to explain structure vs. value mode; prefer sugar syntax `,`)
- `^*` kettar (only as sugar syntax `*`)
- `^=` kettis (only as sugar syntax `p=q`)
- `;;` micmic
- `;<` micgal
- `;/` micfas and other Sail runes (except in Sail materials)
- `;~` micsig (only for parsers)
- `~|` sigbar
- `=.` tisdot (illustrative for "edit a variable")
- `=<` tisgal (illustrative in a few particular cases)
- `=^` tisket
- `=*` tistar (only standard agent boilerplate)
- `?@` wutpat
- `?!` wutzap (only as sugar syntax `!`)
- `?&` wutpam (only as sugar syntax `&()`)
- `?|` wutbar (only as sugar syntax `|()`)
- `?>` wutgar (only for type resolution)
- `?^` wutket
- `!,` zapcom (mainly for illustration)
- `!<` zapgal
- `!>` zapgar (mainly for illustration)
- `!=` zaptis (mainly for illustration)

The following *should be specifically avoided* in Hoon Prime:

- Any rune beginning with `~` besides `~&`
- `|$` barbuc
- `|@` barpat (unless needed for `|*` wet gates)
- `|~` barsig
- `|?` barwut
- `|:` buccol (prefer `$_` buccab in irregular form)
- `%_` cencab
- `%.` cendot
- `%^` cenket
- `%*` centar
- `:_` colcab (mentioned in resources but not used in Hoon Prime code)
- `:^` colket
- `:+` collus
- `.?` dotwut (except in Nock materials)
- `.*` dottar (except in Nock materials)
- `^|` ketbar
- `^.` ketdot
- `^+` ketlus
- `^&` ketpam
- `^~` ketsig
- `^?` ketwut
- `=-` tishep
- `=|` tisbar
- `=,` tiscom
- `=:` tiscol
- `=+` tislus
- `=;` tismic
- `=~` tissig
- `=?` tiswut
- `?<` watgal
- `?.` wutdot
- `?<` wutgal
- `?#` wuthax (decision may be revised vis-à-vis `?=` wuttis)
- `?=` wuttis
- `!@` zappat
- `!?` zapwut

### Sugar Syntax

Sugar syntax should be deployed thoughtfully.

The following syntax expressions are *explicitly blessed*:

- `$_` buccab (only as sugar syntax `_`)
- `$?` bucwut (as both `?()` and explicitly)
- `.=` dottis (only as sugar syntax `=()`)
- `.+` dotlus (only as sugar syntax `+()`)
- `^:` ketcol (only to explain structure v. value mode; prefer sugar syntax `,`)
- `^*` kettar (only as sugar syntax `*`)
- `^=` kettis (only as sugar syntax `p=q`)
- `?|` wutbar (only as sugar syntax `|()`)
- `?&` wutpam (only as sugar syntax `&()`)
- `?!` wutzap (only as sugar syntax `!`)

The following constructions are *explicitly barred*:

- Never use irregular cell constructions like `tag+value`, `tag^value`, `tag/value` and the like; always prefer `[%tag value]`.
- See the note on `each` below.
- Do not use ``\`this`` for an empty set of cards; prefer `[~ this]`. (The structure is the same but the intent of a `unit` is different.)

Specific rules will accustom developers to use patterns before running into deeper concepts like the Hoon type system. These may be controversial, but each has a specific pedagogical motivation.

- Prefer head-tagged unions of values when multiple kinds of values should be included, e.g. in a `$?` bucwut type union.
- Type unions can only be made over constants. (No `?(@t tape)` sorts of expressions.)
- Explicitly mark `list`s as such, rather than relying on null-terminated tuples.
- All `:` runes can be used when explaining rune alternatives.

## Literate Programming

Hoon Prime should also adopt a standard of [literate programming](https://en.wikipedia.org/wiki/Literate_programming). Several example files already display such a self-documenting nature:
- [`simple.hoon` for solid-state subscriptions](https://github.com/wicrum-wicrun/sss/blob/master/urbit/app/simple.hoon)
- [`deco.hoon` for doccords](https://github.com/urbit/urbit/blob/develop/pkg/arvo/lib/deco.hoon)
- [`pals.hoon` for `%pals`](https://github.com/Fang-/suite/blob/master/app/pals.hoon)
- [`rudder.hoon` for serving websites](https://github.com/Fang-/suite/blob/master/lib/rudder.hoon)

Our userspace code accessibility model should allow contributors from widely different skill levels to interact. We need to surface and document code patterns as cleanly as possible in the code we distribute.

We need to upgrade as much code as possible to A standards per the Hoon Style Guide.

## Gall agents

Gall agent files should hew to the following standards:
- `/sur/<agent name>.hoon`
  - There should be only one `/sur` file per agent.
- `/lib/<agent name>.hoon`
  - There should only be one `/lib` file per agent.
  - If JSON handling is necessary, store it in a file `/lib/<agent name>/json.hoon` with `+dejs` and `+enjs` arms.
- `/mar/<agent name>/action.hoon`
  - There should be one `/mar` file per agent action.
  - Defer all JSON handling to the appropriate mark, never handle it in the main `/app` file.
  - Agent actions should be named from the app's corresponding `$action`, `$update`, `$result`, `$effect` etc. types.

Prefer these constructions:
- `=*  this  .`
- Use the rudder and schooner libraries when possible.
- Use `=(pole knot)` over `=path` in agent arms.
  - Just don't teach `path` in beginner materials in that context.
- After it has been introduced pedagogically, prefer the engine pattern around 50% of the time.
  - Show both versions (conventional and engine pattern) when feasible. Treat the engine pattern as a release version refactor, rather than a starting point for many learner cases.

## Rules

- Do not weigh heavier expressions down to the bottom with rune inversion (e.g. using `:_` or `=-`).
- Do not privilege three-letter and four-letter names in userspace.
- Be careful with metaphors. A good metaphor can illuminate, while a bad one will obfuscate.
- In working with type unions, use `+each` to distinguish values.
  - All values should be head-tagged semantically, and this need not match the aura form (as with `+scot`); that is, prefer `%text` instead of `%t` for a string.
- Userspace apps put out by the Urbit Foundation or submitted in completion of a bounty should include tests and docs (see below).

## Unit Testing and Docs

We need to include comments and unit tests so people can see how and why code works like it does. Include a file `/tests/<agent name>/test.hoon`, or multiple test files for different bits of app functionality.

## References

This document has benefited from a decade of Hoon code and organic best practices.
- [“Hoon Style Guide”](https://docs.urbit.org/hoon/guides/style)
- [“Urbit Precepts”](https://urbit.org/blog/precepts)
- [Alex Feinman, “Design Principles for Programming Languages, Part 2a: Readability, Expressability, Concision, and Regularity”](https://afeinman.medium.com/design-principles-2a-1874c14975ab)
