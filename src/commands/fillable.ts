/// <reference types="cypress" />

import * as match from '../match';
import { QUIET } from './internals/constants';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Find all fillable elements that match text.
       * Text can be the name, placeholder or any associated label of the form field.
       * Fillable elements include `<input>`, `<textarea>` and `<select>`.
       * For "complex" `react-gears` components, only the innermost `<input>` tag is
       * yielded (i.e. it does navigate to the outermost element as `cy.component` would).
       *
       * This command doesn't guarantee that it will yield exactly one element! The caller is responsible
       * for disambiguating, retrying, etc.
       */
      fillable(text: string): Chainable<Subject>;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

// TODO: match vs. regexp so caller can specify case-insensitive, etc
const matchContent = (el: HTMLElement, text: string) =>
  el.getAttribute('name') === text || el.getAttribute('placeholder') === text;

// TODO: match vs. regexp so caller can specify case-insensitive, optional `*`, etc
function matchLabels(el: HTMLElement, text: string) {
  const labels = Array.from((el as HTMLInputElement).labels || []);
  return labels.some((label: HTMLElement) => label.textContent === text);
}

export function fillable(text: string) {
  // TODO: Cypress.log so we can see what the heck we're doing!
  return cy.get('input,select,textarea', QUIET).then($all => {
    return $all.filter(
      (_i, el) => matchContent(el, text) || matchLabels(el, text)
    );
  });
}
