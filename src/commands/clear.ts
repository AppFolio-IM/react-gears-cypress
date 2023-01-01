import { QUIET, FORCE_QUIET } from './internals/constants';
import { blurIfNecessary, dismissAriaPopup } from './internals/interaction';

/**
 * Clear a vanilla HTML input or a fancy gears component e.g. Select.
 */
export function clear(
  originalFn: Cypress.CommandOriginalFnWithSubject<'clear', unknown>,
  prevSubject: unknown,
  options?: Partial<Cypress.ClearOptions>
) {
  if (!Cypress.dom.isJquery(prevSubject)) {
    return originalFn(prevSubject, options);
  }

  const isGearsCombobox = prevSubject.is(
    '.dropdown:has([data-testid=combobox-input])'
  );
  const isGearsSelect = prevSubject.hasClass('Select-control');

  if (!isGearsCombobox && !isGearsSelect) {
    // For other inputs, use original but also dismiss popups (e.g. DateInput).
    return originalFn(prevSubject, options).then(dismissAriaPopup);
  }

  if (!options || options.log !== false)
    Cypress.log({
      name: 'clear',
      $el: prevSubject,
      consoleProps: () => ({
        'Applied to': Cypress.dom.getElements(prevSubject),
      }),
    });

  if (isGearsCombobox) {
    return cy
      .wrap(prevSubject, QUIET)
      .find('[data-testid=combobox-input]', QUIET)
      .focus()
      .type('{backspace}{backspace}', QUIET)
      .then(blurIfNecessary);
  }

  if (isGearsSelect) {
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
    // No "X" button (clearable=false); fall through to original cy.clear
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

  throw new Error(
    'react-gears-cypress: internal error in clear command (conditionals exhausted); please report this!'
  );
}
