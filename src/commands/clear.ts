/// <reference types="cypress" />

import { requeryDetached } from './internals/churn';
import { QUIET, FORCE_QUIET } from './internals/constants';
import { blurIfNecessary, dismissAriaPopup } from './internals/interaction';

type ClearFn = (
  subject: JQuery,
  options?: Cypress.ClearOptions
) => Cypress.Chainable;

/**
 * Clear an input or a gears Select component.
 */
export function clear(
  originalClear: ClearFn,
  subject: JQuery,
  options?: Cypress.ClearOptions
) {
  if (subject.hasClass('Select-control')) {
    if (!options || options.log !== false)
      Cypress.log({
        name: 'clear',
        $el: subject,
        consoleProps: () => ({
          'Applied to': Cypress.dom.getElements(subject),
        }),
      });

    const btn = subject.find('button.close');

    // Use the "X" button to clear Select components.
    if (btn.length === 1)
      return cy
        .wrap(requeryDetached(btn), QUIET)
        .click(FORCE_QUIET)
        .then(() => {
          // try to ensure that the popup disappears
          blurIfNecessary(subject.find('input'));
          return subject;
        });
    // No "X" button; fall through to original cy.clear
    else
      return originalClear(requeryDetached(subject.find('input')), {
        ...options,
        force: true,
        log: false,
      } as Cypress.ClearOptions).then(() => {
        // try to ensure that the popup disappears
        blurIfNecessary(subject.find('input'));
        return subject;
      });
  }
  // For other inputs, use original cy.clear but also dismiss popups (e.g. DateInput).
  return originalClear(requeryDetached(subject), options).then(dismissAriaPopup);
}
