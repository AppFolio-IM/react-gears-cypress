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
  const isGearsCombobox = prevSubject.is(
    '.dropdown:has([data-testid=combobox-input])'
  );
  const isGearsSelect = prevSubject.hasClass('Select-control');

  if (!isGearsCombobox && !isGearsSelect) {
    return originalFn(prevSubject, valueOrTextOrIndex, options);
  }

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
      'react-gears-cypress: cy.select requires a string; multi and select-by-index not yet supported; sorry!'
    );

  if (isGearsCombobox) {
    return cy.wrap(prevSubject, QUIET).within(QUIET, () => {
      cy.get('[data-testid=combobox-input]', QUIET)
        .click(FORCE_QUIET)
        //.clear(FORCE_QUIET)
        .type(valueOrTextOrIndex, FORCE_QUIET);
      cy.contains(
        'button.dropdown-item.active',
        valueOrTextOrIndex,
        QUIET
      ).click(QUIET);
    });
  }

  if (isGearsSelect) {
    cy.wrap(prevSubject, QUIET).within(QUIET, () => {
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

  throw new Error(
    'react-gears-cypress: internal error in select command (conditionals exhausted); please report this as a GitHub issue.'
  );
}
