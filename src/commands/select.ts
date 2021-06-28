import * as match from '../match';
import { FORCE_QUIET, QUIET } from './internals/constants';
import { requeryDetached } from './internals/churn';

type SelectFn = (
  subject: JQuery,
  value: string,
  options?: Cypress.SelectOptions
) => Cypress.Chainable;

/**
 * Choose a value from a select (either vanilla HTML or gears).
 */
export function select(
  originalSelect: SelectFn,
  subject: JQuery,
  value: string,
  options?: Cypress.SelectOptions
) {
  if (subject.hasClass('Select-control')) {
    if (!options || options.log !== false)
      Cypress.log({
        name: 'select',
        $el: subject,
        consoleProps: () => ({
          'Applied to': Cypress.dom.getElements(subject),
          Value: value,
        }),
      });

    if (Array.isArray(value))
      throw new Error(
        'gears Select multi not yet supported; have fun implementing!'
      );
    cy.wrap(requeryDetached(subject), QUIET).within(() => {
      cy.get('input', QUIET)
        .click(FORCE_QUIET)
        //.clear(FORCE_QUIET)
        .type(value, FORCE_QUIET);
    });
    return cy
      .wrap(requeryDetached(subject), QUIET)
      .parent(QUIET)
      .get('.Select-menu', QUIET)
      .contains('button', match.exact(value), QUIET)
      .click(QUIET);
  }

  return originalSelect(requeryDetached(subject), value, options);
}
