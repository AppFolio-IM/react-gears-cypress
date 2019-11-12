# react-gears-cypress

# What is this?

This is a collection of helpers for testing
[react-gears](https://github.com/appfolio/react-gears) browser UIs with
Cypress.

# How do I use it?

Install the commands at startup by adding a line to `cypress/support/commands.js`:

```javascript
import {commands} from 'react-gears-cypress'

Cypress.Commands.overwrite('clear', commands.clear);
Cypress.Commands.add('fill', { prevSubject: true }, commands.fill);
Cypress.Commands.overwrite('select', commands.select);
```

Then, in each test where you want to interact with react-gears components:

```javascript
import {find as gears} from 'react-gears-cypress'

gears.blockPanel('Personal Information').within(() => {
  gears.datapair('First Name').contains('Alice')
  gears.input('Last Name').clear().type('Liddel')
  # Finds either HTML <select> or a gears component.
  gears.select('Favorite Color').select('red')
})
```

Inputs and other components are always identified by their label/title. The
intended usage is with the form-labelling components, which provide a
`<label>` element for basically any nested component(s).

```
import {FormLabelGroup, Input} from 'react-gears';

...
const TestableComponent = () => (
  <FormLabelGroup label="foo"><Input/></FormLabelGroup>
)
```

To deal with labels, values and other text whose whitespace varies, you
can use the `match` helpers which return a RegExp that can be passed
instead of a string for more precise or relaxed matching.

```
import {match} from 'react-gears-cypress

// Matches "Name" or "Name *" but not "First Name"
cy.contains(match.exact('Name'))
// Matches "foo bar", "foo badger bar", "foo badger badger mushroom bar", etc
cy.contains(match.fuzzyFirstLast('foo', 'bar'))
// Matches "foo\nbar baz", "foo     bar\nbaz", etc
cy.contains(match.fuzzyMultiline('foo bar baz'))
```

# Contributing

## Building the repo

```sh
npm run build
```

## Type-checking the repo

```sh
npm run type-check
```

And to run in `--watch` mode:

```sh
npm run type-check:watch
```

## Releasing a new version

This repository is currently private (because `react-gears` is private); therefore, we publish it to Appfolio's internal [Nexus](https://nexus.dev.appf.io/) repository. You will need Nexus
credentials to release new versions.

No `npm adduser` step is required because an `.npmrc` is committed to this repository with
a shared API token (as is standard practice in our GitHub org).

To release a new version:

1) Merge your work to master.

2) Check `package.json` for the previously released version X.Y.Z.

3) Run `git log vX.Y.Z..HEAD` to review new work from yourself and others. Decide on a new version number according to semver guidelines.

4) Edit `package.json` to your new version (let's say it is X.Y.W). Commit your change.

5) Create a git tag for `vX.Y.W` and push the tag make things easier for future maintainers.

6) `npm publish` to share your new version with the world.

TODO: ask Hillary about the npm shortcuts she learned which should simplify this workflow (but might not help with the Git tagging).
