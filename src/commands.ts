/// <reference types="cypress" />

import * as match from './match';

declare var cy: Cypress.Chainable;

type Cmd = (subject: any, options: any) => any;
type ValCmd = (subject: any, value: string, options: any) => any;

function dismissPopupIfNeeded(subject: any) {
  const popupParent = subject.parents('div').eq(1);
  const dismissPopup =
    popupParent && popupParent.attr('aria-expanded') === 'true';
  if (dismissPopup) popupParent.find('.input-group-append > button').click();
  return subject;
}

/**
 * Clear an input or a gears Select component.
 */
export function clear(originalClear: Cmd, subject: any, options: any) {
  // Use the "X" button to clear Select components.
  if (subject.hasClass('Select-control')) {
    const btn = subject.find('button.close');
    if (btn.length === 1)
      return cy
        .wrap(btn)
        .click({ force: true })
        .then(() => subject);
    return subject;
  }
  // For other inputs, use original cy.clear but also dismiss popups (e.g. DateInput).
  return originalClear(subject, options).then(dismissPopupIfNeeded);
}

/**
 * Replace a form component's existing value. Works on
 * input, textarea, or fancy input (e.g. calendar).
 */
export function fill(subject: any, value: string) {
  const fancy = subject.hasClass('Select-control');
  const textInput = subject.is('input');
  const textArea = subject.is('textarea');
  const vanillaSelect = subject.is('select');
  if (fancy) {
    if (Array.isArray(value))
      throw new Error(
        'gears Select multi not yet supported; have fun implementing!'
      );
    cy.wrap(subject)
      .clear()
      .find('input')
      .type(value, { force: true, delay: 1 });
    return cy
      .wrap(subject)
      .parent()
      .get('.Select-menu')
      .contains('button', match.exact(value))
      .click();
  } else if (textInput) {
    cy.wrap(subject)
      .clear()
      .type(value, { delay: 1 })
      .then(dismissPopupIfNeeded);
  } else if (textArea) {
    cy.wrap(subject)
      .clear()
      .type(value, { delay: 1 });
  } else if (vanillaSelect) {
    cy.wrap(subject).select(value);
  } else {
    throw new Error(`cy.fill: unknown tag ${subject[0].tagName.toLowerCase()}`);
  }
}

/**
 * Choose a value from a select (either vanilla HTML or gears).
 */
export function select(
  originalSelect: ValCmd,
  subject: any,
  value: string,
  options: any
) {
  if (subject.hasClass('Select-control')) {
    if (Array.isArray(value))
      throw new Error(
        'gears Select multi not yet supported; have fun implementing!'
      );
    cy.wrap(subject).within(() => {
      cy.get('input')
        .clear({ force: true })
        .type(value, { force: true });
    });
    return cy
      .wrap(subject)
      .parent()
      .get('.Select-menu')
      .contains('button', match.exact(value))
      .click();
  }

  return originalSelect(subject, value, options);
}

declare global {
  /* eslint-disable-next-line @typescript-eslint/no-namespace */
  namespace Cypress {
    interface Chainable<Subject = any> {
      fill: (value: string) => Chainable<Subject>;
    }
  }
}
