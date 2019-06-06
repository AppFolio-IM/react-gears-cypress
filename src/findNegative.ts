/**
 * Helper functions that assert nonexistence of react-gears components.
 * These vary from Finders because negative assertions cannot backtrack;
 * they must be custom written for each component.
 */

import {Chainable, Color, Text} from '.'
import * as sel from './sel'

declare var cy: Chainable;

export function alert(title:Text, color?:Color) {
  let combo = sel.alert;
  if(color)
    combo = `${combo}${combo}-${color}`

  cy.contains(combo, title).should('not.exist')
} 

export function button(label:Text) {
  cy.contains(sel.button, label).should('not.exist');
}

export function blockPanel(title:Text) {
  cy.contains(sel.cardTitle, title).should('not.exist')
}

export function link(label:string) {
  cy.contains(sel.link, label).should('not.exist')
}

export function modal(title:Text) {
  cy.contains(sel.modalTitle, title).should('not.exist')
}
