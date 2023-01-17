import { Component, ComponentOptions, FillOptions, Text } from '../interfaces';
import { clear } from './actions/clear';
import { component as componentCommand } from './actions/component';
import { fill } from './actions/fill';
import { select } from './actions/select';
import { component as componentQuery } from './queries/component';

export const supportsQueries = !!(Cypress.Commands as any).addQuery;
const component = supportsQueries ? componentQuery : componentCommand;

// Convenience export of our command functions, in case someone needs to wrap/augment them.
// TODO: stop exporting these in v6
export { clear, component, fill, select };

type CommandName = 'clear' | 'fill' | 'component' | 'select';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Find the DOM representation of a react-gears component, as identified
       * by its label, header or other characteristic text.
       *
       * @example verify that field initially has text; clear it; save the form
       *    import { Button, Input } from '@appfolio/react-gears-cypress'
       *    cy.component(Input, 'First Name, { log: false }).should('not.be.empty')
       *    cy.component(Input, 'First Name').clear()
       *    cy.component(Button, /Create|Save/).click();
       */
      component(
        component: Component,
        text: Text,
        options?: Partial<ComponentOptions>
      ): Chainable<Subject>;
      /**
       * Find DOM representation(s) of a react-gears component regardless of
       * label, header or other characteristic text.
       *
       * @example verify there are three Select fields
       *    import { Select } from '@appfolio/react-gears-cypress'
       *    cy.component(Select, { all: true }).count().should('eq', 3)
       */
      component(
        component: Component,
        options?: Partial<ComponentOptions>
      ): Chainable<Subject>;
      /**
       * Replace the contents of a form field by clearing it, then typing or
       * selecting. Handles react-gears Select and DateInput components, as
       * well as other text inputs that have an aria popup associated with them.
       *
       * @see https://github.com/appfolio/react-gears-cypress/blob/master/README.md
       *
       * @example
       *    cy.get('input').fill('Hello, World')
       *    cy.get('input["type=select"]').fill('Option 1')
       */
      fill(text: string, options?: Partial<FillOptions>): Chainable<Subject>;
    }
  }
}

/**
 * Register Cypress commands provided by this package. Some commands are new and
 * some are overridden.
 *
 * @example install everything
 *  commands.add();
 *
 * @example install just a couple commands
 *  commands.add('fill', 'gears);
 *
 * TODO: stop allowing the user to pick and choose commands in v6; just install everything
 * TODO: install upon require, vs. making the user call our add function?
 */
export function add(...names: CommandName[]) {
  const all = !names.length;
  if (all || names.includes('clear'))
    Cypress.Commands.overwrite('clear', clear);
  if (all || names.includes('fill'))
    Cypress.Commands.add('fill', { prevSubject: ['element'] }, fill);
  if (all || names.includes('component')) {
    if (supportsQueries) {
      // TODO: author and install the query version of cy.component
      Cypress.Commands.addQuery('component', componentQuery);
    } else {
      Cypress.Commands.add(
        'component',
        { prevSubject: ['optional'] },
        componentCommand
      );
    }
  }
  if (all || names.includes('select'))
    Cypress.Commands.overwrite('select', select);
}
