/**
 * Finder functions for react-gears components. These functions use the `cy` global
 * to issue Cypress commands and find the DOM elements that correspond to gears
 * components. Finders take one parameter: a label or title that identifies
 * the specific component that is being sought.
 *
 * Finders always begin a new Cypress command chain; they cannot be chained after
 * other commands. However, you can use `wrap`, `then`, `within` and other
 * commands to scope your finders to a certain context. To click a button in a
 * modal:
 *
 *     import * as gears from 'react-gears-cypress/find'
 *     gears.modal('Confirm Delete').within(()  {
 *         gears.button('Delete').click()
 *     })
 *
 * GUIDELINES
 * ==========
 * Finders adhere to the following protocol.
 *   1) MUST return a Cypress chainable
 *   2) MUST behave deterministically (e.g. no backtracking)
 *   3) MUST use selectors (or combinations) from `react-gears-cypress/sel`
 *   4) SHOULD NOT call each other (each finder stands alone)
 *   5) SHOULD take a 0th parameter describing prominent, user-visible text
 *        - e.g. the title of a block, the label of a button
 *        - SHOULD NOT be ambiguous with any other component of the same type
 *        - MAY tolerate minor differences (e.g. trailing ` *` for form field labels)
 *   6) MAY take a 1th parameter with additional matching context (e.g. theme color)
 */

import { Chainable, Color, Text } from '.';
import * as sel from './sel';

import * as assertNo from './findNegative';
export { assertNo };

declare var cy: Chainable;

export function alert(title: Text, color?: Color) {
  let combo = sel.alert;
  if (color) combo = `${combo}${combo}-${color}`;

  return cy.contains(combo, title);
}

export function blockPanel(title: Text) {
  return cy.contains(sel.cardTitle, title).closest(sel.card);
}

export function button(label: Text) {
  return cy.contains(sel.button, label);
}

export function card(title: Text) {
  return cy.contains(sel.cardTitle, title).closest(sel.card);
}

export function cardTitle(title: Text) {
  return cy.contains(sel.cardTitle, title);
}

export function datapair(label: Text) {
  return cy.contains(sel.datapairLabel, label).closest(sel.formGroup);
}

export function input(label: Text) {
  return cy
    .contains(sel.inputLabel, label)
    .closest(sel.formGroup)
    .find(sel.input)
    .then($input => {
      if ($input.attr('role') === 'combobox') {
        throw new Error(
          `Please use gears.select to interact with the "${label}" input`
        );
      }
      return $input;
    });
}

export function link(label: string) {
  return cy.contains(sel.link, label);
}

export function modal(title: Text) {
  return cy.contains(sel.modalTitle, title).closest(sel.modal);
}

export function modalTitle(title: Text) {
  return cy.contains(sel.modalTitle, title);
}

export function select(label: Text) {
  return cy
    .contains(sel.label, label)
    .closest(sel.formGroup)
    .then(formGroup => {
      const fancy = formGroup.find(sel.selectControl);
      if (fancy.length) return fancy;
      const vanilla = formGroup.find(sel.select);
      if (vanilla.length) return vanilla;
      throw new Error(
        `react-gears-cypress: cannot determine select type for '${label}'`
      );
    });
}

export function summaryBoxItem(label: Text) {
  return cy
    .contains(sel.summaryBoxItemLabel, label)
    .closest(sel.summaryBoxItem);
}
