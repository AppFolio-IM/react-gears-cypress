import * as match from '../match';
import { FORCE_QUIET, QUIET } from './internals/constants';

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
    cy.wrap(subject, QUIET).within(() => {
      cy.get('input', QUIET)
        .clear(FORCE_QUIET)
        .type(value, FORCE_QUIET);
    });
    return cy
      .wrap(subject, QUIET)
      .parent(QUIET)
      .get('.Select-menu', QUIET)
      .contains('button', match.exact(value), QUIET)
      .click(QUIET);
  }

  return originalSelect(subject, value, options);
}
