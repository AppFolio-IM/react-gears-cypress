/// <reference types="cypress" />

import * as match from '../match';
import { FORCE_QUIET, FORCE_QUICK_QUIET, QUIET } from './internals/constants';
import { blurIfNecessary, dismissAriaPopup } from './internals/interaction';

/* eslint-disable @typescript-eslint/no-namespace */
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
/* eslint-enable @typescript-eslint/no-namespace */

/**
 * Options for the cy.fill command.
 */
export interface FillOptions {
  log: boolean;
}

/**
 * Replace a form component's existing value. Works on
 * input, textarea, or fancy input (e.g. calendar).
 */
export function fill(
  subject: JQuery,
  value: string,
  options: FillOptions = { log: true }
) {
  if (!value)
    throw new Error(
      'CypressError: `cy.fill()` cannot accept an empty string. You need to fill with a value, or `cy.clear()` to remove all values.'
    );

  let consoleProps: Record<string, any> = {};
  let logEntry: any;
  if (options.log !== false) {
    consoleProps = {
      'Applied to': Cypress.dom.getElements(subject),
      Value: value,
    };

    logEntry = Cypress.log({
      name: 'fill',
      message: value,
      $el: subject,
      consoleProps: () => {
        return consoleProps;
      },
    });
  }

  const isFancySelect = subject.hasClass('Select-control');
  const isTextInput = subject.is('input');
  const isTextArea = subject.is('textarea');
  const isVanillaSelect = subject.is('select');

  if (isFancySelect) {
    if (logEntry) consoleProps.Type = 'React Select';
    if (Array.isArray(value))
      throw new Error(
        'gears Select multi not yet supported; have fun implementing!'
      );

    // NB repeatedly re-finding elements relative to subject in order to
    // deal with DOM churn
    cy.wrap(subject, QUIET).clear(QUIET);
    cy.wrap(subject, QUIET)
      .find('input', QUIET)
      .focus(QUIET)
      .type(value, FORCE_QUICK_QUIET);
    cy.wrap(subject, QUIET)
      .parent(QUIET)
      .get('.Select-menu', QUIET)
      .contains('button', match.exact(value), QUIET)
      .click(QUIET);
  } else if (isTextInput) {
    if (logEntry) consoleProps.Type = 'HTML input';
    return (
      cy
        .wrap(subject, QUIET)
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
        .wrap(subject, QUIET)
        .clear(QUIET)
        .focus(QUIET)
        .type(value, FORCE_QUICK_QUIET)
        // try to ensure that React on-change callbacks fire
        .then(blurIfNecessary)
    );
  } else if (isVanillaSelect) {
    if (logEntry) consoleProps.Type = 'HTML select';
    return cy.wrap(subject, QUIET).select(value, FORCE_QUIET);
  } else {
    throw new Error(
      `cy.fill: unsupported element ${subject[0].tagName.toLowerCase()}`
    );
  }
}
