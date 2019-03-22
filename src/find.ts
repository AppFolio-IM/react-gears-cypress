import {Chainable} from '.'
import * as sel from './sel'

export class Finders {
  assertNo: NegativeFinders
  cy: Chainable;

  constructor(cy: Chainable) {
    this.assertNo = new NegativeFinders(cy);
    this.cy = cy
  }

  blockPanel = (title:string) =>
    this.cy.contains(sel.cardTitle, title).closest('.card')

  button = (label:string) => this.cy.contains('button', label);

  datapair = (label:string) => this.cy.contains('label', label).parent();

  input = (label:string) =>
  this.cy
    .contains('label', label)
    .closest(sel.formGroup)
    .find('input,textarea')

  select = (label:string) =>
    this.cy
      .contains('label', label)
      .closest(sel.formGroup)
      .then(formGroup => {
        const fancy = formGroup.find(sel.select);
        if (fancy.length) return fancy;
        const vanilla = formGroup.find('select');
        if (vanilla.length) return vanilla;
        throw new Error(`react-gears-cypress: cannot determine select type for '${label}'`);
      });
}

export class NegativeFinders {
  cy: Chainable;

  constructor(cy:Chainable) {
    this.cy = cy
  }

  blockPanel = (title:string) =>
    this.cy.contains(sel.cardTitle, title).should('not.exist')
}
