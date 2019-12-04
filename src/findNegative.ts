/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Helper functions that assert nonexistence of react-gears components.
 * These vary from Finders because negative assertions cannot backtrack;
 * they must be custom written for each component.
 */

import { Chainable, Color, Text } from '.';
import * as sel from './sel';

declare var cy: Chainable;

export function alert(title: Text, color?: Color) {
  let combo = sel.alert;
  if (color) combo = `${combo}${combo}-${color}`;

  cy.contains(combo, title).should('not.exist');
}

export function button(label: Text) {
  cy.contains(sel.button, label).should('not.exist');
}

export function blockPanel(title: Text) {
  cy.contains(sel.cardTitle, title).should('not.exist');
}

// TODO: delete when bumping to react-gears v5
export function checkboxInput(label: Text) {
  cy.contains(sel.checkboxInputLabel, label).should('not.exist');
}

export function datapair(label: Text) {
  cy.contains(sel.datapairLabel, label).should('not.exist');
}

export function input(label: Text) {
  cy.contains(sel.inputLabel, label).should('not.exist');
}

export function link(label: string) {
  cy.contains(sel.link, label).should('not.exist');
}

export function modal(title: Text) {
  cy.contains(sel.modalTitle, title).should('not.exist');
}

// TODO: delete when bumping to react-gears v5
export function radioInput(label: Text) {
  cy.contains(sel.radioInputLabel, label).should('not.exist');
}
