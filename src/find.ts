import {Chainable} from '.'
import * as sel from './sel'

/**
 * "Page object" for asserting nonexistence of react-gears components.
 * These vary from Finders because negative assertions cannot backtrack;
 * they must be custom written for each component.
 */
export class NegativeFinders {
  cy: Chainable;

  constructor(cy:Chainable) {
    this.cy = cy
  }

  blockPanel = (title:string) =>
    this.cy.contains(sel.cardTitle, title).should('not.exist')
}

/**
 * "Page object" for react-gears components. Because Cypress is functional,
 * the interface to this module is largely functional too; the only reason you
 * need to instantiate it is to pass it a reference to the global `cy` variable.
 * 
 * Finders are designed to act as top-level commands; they cannot be chained after
 * a plain Cypress command. However, you can use `wrap`, `then`, `within` and other
 * Cypress commands to provide context. To click a button in a modal:
 * 
 *     const gears = new Finders(cy);
 *     gears.modal('Confirm Delete').within(() => {
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
export class Finders {
  assertNo: NegativeFinders

  cy: Chainable;

  constructor(cy: Chainable) {
    this.assertNo = new NegativeFinders(cy);
    this.cy = cy
  }

  alert = (title:string, color?:string) => {
    let combo = sel.alert;
    if(color)
      combo = `${combo}${combo}-${color}`

    this.cy.contains(combo, title)
  }

  blockPanel = (title:string) =>
    this.cy.contains(sel.cardTitle, title).closest(sel.card)

  button = (label:string) => this.cy.contains(sel.button, label);

  card = (title:string) =>
  this.cy.contains(sel.cardTitle, title).closest(sel.card)

  cardTitle = (title:string) =>
    this.cy.contains(sel.cardTitle, title)

  datapair = (label:string) => this.cy.contains(sel.label, label).parent();

  input = (label:string) =>
  this.cy
    .contains(sel.label, label)
    .closest(sel.formGroup)
    .find(sel.input)

  link = (label:string) =>
    this.cy.contains(sel.link, label)

  modal = (title:string) => 
    this.cy.contains(sel.modalTitle, title).closest(sel.modal)

  modalTitle = (title:string) =>
    this.cy.contains(sel.modalTitle, title)

  select = (label:string) =>
    this.cy
      .contains(sel.label, label)
      .closest(sel.formGroup)
      .then(formGroup => {
        const fancy = formGroup.find(sel.selectControl);
        if (fancy.length) return fancy;
        const vanilla = formGroup.find(sel.select);
        if (vanilla.length) return vanilla;
        throw new Error(`react-gears-cypress: cannot determine select type for '${label}'`);
      });
}
