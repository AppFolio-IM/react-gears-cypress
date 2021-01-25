# react-gears-cypress

# What is this?

This is a collection of helpers for testing
[react-gears](https://github.com/appfolio/react-gears) browser UIs with
Cypress. It provides "finder" functions for finding `react-gears` components
in the DOM, Cypress commands for interacting with compomnents, and some fuzzy
text-matching functions to promote more reliable tests.

# How do I use it?

Install the commands at startup by adding a few lines to `cypress/support/commands.js`:

```javascript
import { commands as gears } from 'react-gears-cypress'

// Adds all commands: clear, fill, gears, select. Pass string[] to
// install just some of the commands.
gears.add();
```

Then, in each test where you want to interact with react-gears components:

```javascript
import { BlockPanel, Datapair, Input, Select } from 'react-gears-cypress';

cy.component(BlockPanel, 'Personal Information').within(() => {
  cy.component(Datapair, 'First Name').contains('Alice')
  cy.component(Input, 'Last Name').clear().type('Liddel')
  cy.component(Select, 'Favorite Color').select('red')
})
```

Inputs and other components are always identified by their label/title. The
intended usage is with the form-labelling component `FormLabelGroup`, which provides a `<label>` element for basically any nested component(s).

```javascript
import { FormLabelGroup, Input } from '@appfolio/react-gears';

...
const TestableComponent = () => (
  <FormLabelGroup label="foo"><Input/></FormLabelGroup>
)
```

To deal with labels, values and other text whose whitespace varies, you
can use the `match` helpers which return a RegExp that can be passed
instead of a string for more precise or relaxed matching.

```javascript
import {Datapair, match} from 'react-gears-cypress

// Matches "Name" or "Name *" but not "First Name"
cy.component(Datapair, match.exact('Name'))
// Matches "foo bar", "foo badger bar", "foo badger badger mushroom bar", etc
cy.component(Datapair, match.fuzzyFirstLast('foo', 'bar'))
// Matches "foo\nbar baz", "foo     bar\nbaz", etc
cy.component(Datapair, match.fuzzyMultiline('foo bar baz'))
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

To release a new version:

1) Merge your work to master.

2) Check `package.json` for the previously released version X.Y.Z.

3) Run `git log vX.Y.Z..HEAD` to review new work from yourself and others. Decide on a new version number according to semver guidelines; for the sake of this example, let's say
you decide the new version will be `X.Y.W`.
  - if you want a prerelease version, the preferred format is `X.Y.Z-rc.0` (then `rc.1`, etc)

4) Run `npm version X.Y.W` to bump to the new version you decided on above.
  - You can also use `npm version <patch|minor|major>` if you just want to increment one of those components.

5) Run `npm run build` to produce distributables with the new version number.

6) `npm publish` to share your distributables with the world.
  - if publishing a prerelease version you _must_ add `--tags=beta` to the `npm publish` command!
  - otherwise, people will accidentally upgrade to your prerelease and you will be forced to support them

7) `git push` and `git push --tags` to ensure that the npm version bump is preserved
for posterity.

