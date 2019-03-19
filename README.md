# react-gears-cypress

# What is this?

This is a collection of helpers for testing
[react-gears](https://github.com/appfolio/react-gears) browser UIs with
Cypress.

# How do I use it?

First, install the commands in support/commands.js

```javascript
import {Commands} from 'react-gears-cypress'
const gears = new Commands(cy)

Cypress.Commands.overwrite('select', gears.select)
```

Then, in each test file where you want to interact with gears:

```javascript
import {Finders} from 'react-gears-cypress'
const gears = new Finders(cy)

gears.blockPanel('Personal Information').within(() => {
  gears.datapair('First Name').contains('Alice')
  gears.input('Last Name').clear().type('Liddel')

  # Finds either an HTML <select> or a gears component.
  # Must redefine the `select` command to interact with gears components.
  gears.select('Favorite Color').select('red')
})

```

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
