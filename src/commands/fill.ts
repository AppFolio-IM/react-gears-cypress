/// <reference types="cypress" />

import * as match from '../match';
import { FORCE_QUIET, FORCE_QUICK_QUIET, QUIET } from './internals/constants';
import { blurIfNecessary, dismissAriaPopup } from './internals/interaction';

/**
 * Options for the cy.fill command.
 */
export interface FillOptions {
  log: boolean;
}

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
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
 * Replace a form component's existing value. Works on
 * input, textarea, or fancy input (e.g. calendar).
 */
export function fill(
  prevSubject: JQuery,
  value: string,
  options?: Partial<FillOptions>
) {
  if (!options) {
    options = { log: true };
  }

  if (!value)
    throw new Error(
      'CypressError: `cy.fill()` cannot accept an empty string. You need to fill with a value, or `cy.clear()` to remove all values.'
    );

  let consoleProps: Record<string, any> = {};
  let logEntry: any;
  if (options.log !== false) {
    consoleProps = {
      'Applied to': Cypress.dom.getElements(prevSubject),
      Value: value,
    };

    logEntry = Cypress.log({
      name: 'fill',
      message: value,
      $el: prevSubject,
      consoleProps: () => {
        return consoleProps;
      },
    });
  }

  const isFancySelect = prevSubject.hasClass('Select-control');
  const isTextInput = prevSubject.is('input');
  const isTextArea = prevSubject.is('textarea');
  const isVanillaSelect = prevSubject.is('select');

  if (isFancySelect) {
    if (logEntry) consoleProps.Type = 'React Select';
    if (Array.isArray(value))
      throw new Error(
        'gears Select multi not yet supported; have fun implementing!'
      );

    // NB repeatedly re-finding elements relative to subject in order to
    // deal with DOM churn
    cy.wrap(prevSubject, QUIET).clear(QUIET);
    cy.wrap(prevSubject, QUIET)
      .find('input', QUIET)
      .focus(QUIET)
      .type(value, FORCE_QUICK_QUIET);
    cy.wrap(prevSubject, QUIET)
      .parent(QUIET)
      .get('.Select-menu', QUIET)
      .contains('button', match.exact(value), QUIET)
      .click(QUIET);
  } else if (isTextInput) {
    if (logEntry) consoleProps.Type = 'HTML input';
    return (
      cy
        .wrap(prevSubject, QUIET)
        .clear(QUIET)
        .focus(QUIET)
        .type(value, FORCE_QUICK_QUIET)
        // try to ensure that React on-change callbacks fire
        .then(blurIfNecessary)
        .then(dismissAriaPopup)
    );
  } else if (isTextArea) {
    if (logEntry) consoleProps.Type = 'HTML textarea';
    return (
      cy
        .wrap(prevSubject, QUIET)
        .clear(QUIET)
        .focus(QUIET)
        .type(value, FORCE_QUICK_QUIET)
        // try to ensure that React on-change callbacks fire
        .then(blurIfNecessary)
    );
  } else if (isVanillaSelect) {
    if (logEntry) consoleProps.Type = 'HTML select';
    return cy.wrap(prevSubject, QUIET).select(value, FORCE_QUIET);
  } else {
    throw new Error(
      `cy.fill: unsupported element ${prevSubject[0].tagName.toLowerCase()}`
    );
  }
}
