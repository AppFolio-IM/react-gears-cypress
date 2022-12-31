import { QUIET, FORCE_QUIET, isQuery } from './internals/constants';
import { blurIfNecessary, dismissAriaPopup } from './internals/interaction';

/**
 * Clear a vanilla HTML input or a fancy gears component e.g. Select.
 */
export function clear(
  this: Mocha.Context,
  originalFn: Cypress.CommandOriginalFnWithSubject<'clear', unknown>,
  prevSubject: unknown,
  options?: Partial<Cypress.ClearOptions>
) {
  if (!isQuery(prevSubject)) {
    return originalFn(prevSubject, options);
  }

  if (prevSubject.hasClass('Select-control')) {
    if (!options || options.log !== false)
      Cypress.log({
        name: 'clear',
        $el: prevSubject,
        consoleProps: () => ({
          'Applied to': Cypress.dom.getElements(prevSubject),
        }),
      });

    const btn = prevSubject.find('button.close');

    // Use the "X" button to clear Select components.
    if (btn.length === 1)
      return cy
        .wrap(btn, QUIET)
        .click(FORCE_QUIET)
        .then(() => {
          // try to ensure that the popup disappears
          blurIfNecessary(prevSubject.find('input'));
          return prevSubject;
        });
    // No "X" button; fall through to original cy.clear
    else
      return originalFn(prevSubject.find('input'), {
        ...options,
        force: true,
        log: false,
      } as Cypress.ClearOptions).then(() => {
        // try to ensure that the popup disappears
        blurIfNecessary(prevSubject.find('input'));
        return prevSubject;
      });
  }
  // For other inputs, use original cy.clear but also dismiss popups (e.g. DateInput).
  return originalFn(prevSubject, options).then(dismissAriaPopup);
}
