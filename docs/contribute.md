# Contribution wiki

## Commits

### Messages

- Messages are all lower-case
- Messages contain a reference to the issue/ticket

All commit messages start with a semantic commit type (from
[here](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)).

- feat: (new feature for the user, not a new feature for build script)
- fix: (bug fix for the user, not a fix to a build script)
- docs: (changes to the documentation)
- style: (formatting, missing semi colons, etc; no production code change)
- refactor: (refactoring production code, eg. renaming a variable)
- test: (adding missing tests, refactoring tests; no production code change)
- chore: (updating grunt tasks etc; no production code change)

We also add:

- deps: (install, uninstall or update dependencies)

#### Examples

- `feat: JUKE-9 better error message for not-existing session`
- `fix: JUKE-20 crash on empty name login`
- `refactor: remove redundant classes`

