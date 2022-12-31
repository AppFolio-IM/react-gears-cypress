import { isQuery } from './internals/constants';

/**
 * Click something and deal with empty buttons that contain only an icon.
 * @deprecated this is not necessary since Cypress 10
 */
export function click(
  this: Mocha.Context,
  originalFn: Cypress.CommandOriginalFnWithSubject<'click', unknown>,
  prevSubject: unknown,
  x: number,
  y: number,
  options?: Partial<Cypress.ClickOptions>
) {
  if (!isQuery(prevSubject)) {
    return originalFn(prevSubject, x, y, options);
  }
  if (prevSubject.is('button') && prevSubject.text() === '') {
    return originalFn(prevSubject, x, y, { ...options, force: true });
  }
  return originalFn(prevSubject, x, y, options);
}
