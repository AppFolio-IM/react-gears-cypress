import * as match from '../match';
import { FORCE_QUIET, QUIET } from './internals/constants';

/**
 * Choose a value from a select (either vanilla HTML or gears).
 */
export function select(
  originalFn: Cypress.CommandOriginalFnWithSubject<'select', unknown>,
  prevSubject: unknown,
  valueOrTextOrIndex: string | number | (string | number)[],
  options?: Partial<Cypress.SelectOptions>
) {
  if (!Cypress.dom.isJquery(prevSubject)) {
    return originalFn(prevSubject, valueOrTextOrIndex, options);
  }

  if (prevSubject.hasClass('Select-control')) {
    if (!options || options.log !== false)
      Cypress.log({
        name: 'select',
        $el: prevSubject,
        consoleProps: () => ({
          'Applied to': Cypress.dom.getElements(prevSubject),
          Value: valueOrTextOrIndex,
        }),
      });

    if (typeof valueOrTextOrIndex !== 'string')
      throw new Error(
        'react-gears-cypress: Select multi not yet supported; have fun implementing!'
      );
    cy.wrap(prevSubject, QUIET).within(() => {
      cy.get('input', QUIET)
        .click(FORCE_QUIET)
        //.clear(FORCE_QUIET)
        .type(valueOrTextOrIndex, FORCE_QUIET);
    });
    return cy
      .wrap(prevSubject, QUIET)
      .parent(QUIET)
      .get('.Select-menu', QUIET)
      .contains('button', match.exact(valueOrTextOrIndex), QUIET)
      .click(QUIET);
  }

  return originalFn(prevSubject, valueOrTextOrIndex, options);
}
