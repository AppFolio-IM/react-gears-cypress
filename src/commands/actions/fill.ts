/// <reference types="cypress" />

import { FillOptions } from '../../interfaces';
import { FORCE_QUIET, FORCE_QUICK_QUIET, QUIET } from '../internals/constants';
import { blurIfNecessary, dismissAriaPopup } from '../internals/interaction';
import * as match from '../../match';

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
      'react-gears-cypress: `cy.fill()` cannot accept empty/falsey values. Either fill with a value, or `cy.clear()` to remove all values.'
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

  const isGearsCombobox = prevSubject.is(
    '.dropdown:has([data-testid=combobox-input])'
  );
  const isGearsSelect = prevSubject.hasClass('Select-control');
  const isTextInput = prevSubject.is('input');
  const isTextArea = prevSubject.is('textarea');
  const isVanillaSelect = prevSubject.is('select');

  if (isGearsCombobox) {
    if (logEntry) consoleProps.Type = 'React Combobox';
    if (Array.isArray(value))
      throw new Error(
        'react-gears-cypress: cy.fill with multiple values is not yet supported; sorry!'
      );

    cy.wrap(prevSubject, QUIET).clear(QUIET);
    cy.wrap(prevSubject, QUIET)
      .find('[data-testid=combobox-input]', QUIET)
      .focus()
      .type(value, FORCE_QUICK_QUIET);
    return cy
      .contains('button.dropdown-item.active', value, QUIET)
      .click(QUIET);
  } else if (isGearsSelect) {
    if (logEntry) consoleProps.Type = 'React Select';
    if (Array.isArray(value))
      throw new Error(
        'react-gears-cypress: cy.fill with multiple values is not yet supported; sorry!'
      );

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
      `cy.fill: unsupported element \`${prevSubject[0].tagName.toLowerCase()}\``
    );
  }
}
