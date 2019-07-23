import { Chainable } from '.';
import * as match from './match';

declare var cy: Chainable;

type Cmd = (subject: any, options: any) => any;
type ValCmd = (subject: any, value: string, options: any) => any;

/**
 * Clear an input or a gears Select component.
 */
export function clear(originalClear: Cmd, subject: any, options: any) {
  if (subject.hasClass('Select-control')) {
    const btn = subject.find('button.close');
    if (btn.length === 1)
      return cy
        .wrap(btn)
        .click({ force: true })
        .then(() => subject);
    return subject;
  }
  return originalClear(subject, options);
}

/**
 * Replace a form component's existing value. Works on
 * input, textarea, or fancy input (e.g. calendar).
 */
export function fill(subject: any, value: string) {
  if (subject.is('input')) {
    const dismissPopup = subject
      .parents('div')
      .eq(1)
      .attr('aria-haspopup');
    cy.wrap(subject)
      .clear()
      .type(value + (dismissPopup ? '\t' : ''));
  } else if (subject.is('textarea')) {
    cy.wrap(subject)
      .clear()
      .type(value);
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
