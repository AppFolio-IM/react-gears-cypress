import { requeryDetached } from './internals/churn';

type ClickFn = (
  subject: JQuery,
  options?: Partial<Cypress.ClickOptions>
) => Cypress.Chainable;

export function click(
  originalClick: ClickFn,
  subject: JQuery,
  options?: Partial<Cypress.ClickOptions>
) {
  if (subject.is('button') && subject.text() === '') {
    return originalClick(requeryDetached(subject), { ...options, force: true });
  }
  return originalClick(requeryDetached(subject), options);
}
