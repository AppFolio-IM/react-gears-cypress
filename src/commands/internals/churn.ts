/* eslint-disable no-undef */
/// <reference types="cypress" />

/**
 * Mitigate churn by attempting to requery detached DOM elements.
 */
export function requeryDetached($q: JQuery) {
  return Cypress.$(
    //@ts-ignore
    Cypress.$.map($q, (el: HTMLElement) =>
      Cypress.dom.isDetached(el) && el.id ? document.getElementById(el.id) : el
    )
  );
}
