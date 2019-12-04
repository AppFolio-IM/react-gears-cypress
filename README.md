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
