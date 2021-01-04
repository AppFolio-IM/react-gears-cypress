/// <reference types="cypress" />

import { Text } from '../../interfaces';

/// Find all elements under subject matching selector and containing text.
export function findAllByLabelText(
  subject: JQuery,
  selector: string,
  text: Text
): JQuery {
  if (text instanceof RegExp)
    return subject
      .find(selector)
      .filter((_, e) => !!e.textContent && text.test(e.textContent));
  else
    return subject
      .find(selector)
      .filter((_, e) => !!e.textContent && e.textContent.includes(text));
}

/// Sort query results by increasing inner-text length.
export function orderByInnerText(results: JQuery) {
  if (results.length < 2) return results.eq(0);

  return Cypress.$(
    results.toArray().sort((a, b) => a.innerText.length - b.innerText.length)
  );
}
