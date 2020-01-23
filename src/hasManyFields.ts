/// <reference types="cypress" />

declare var cy: Cypress.Chainable;

const QUIET = { log: false };

/**
 * Remove the last deletable item from a HasManyFields.
 * Resolve with true if something got deleted, or false if nothing was deletable.
 * @param {jQuery} $parent element that contains the entire HasManyFields
 */
export function removeLast($parent: any) {
  const $buttons = $parent.find('button.btn-outline-danger');
  if ($buttons.length > 0)
    return cy
      .wrap($buttons.last())
      .click()
      .click()
      .then(() => true);
  return cy.wrap(false, QUIET);
}

/**
 * Remove all of the items from a HasManyFields.
 * Resolve with false.
 * @param {jQuery} $parent element that contains the entire HasManyFields
 */
export function removeAll($parent: any): Cypress.Chainable<boolean> {
  return removeLast($parent).then((deleted: any) =>
    deleted ? removeAll($parent) : cy.wrap(false, QUIET)
  );
}

/**
 * Add one or more items to a HasManyFields, where each item consists of potentially
 * many form fields. Form fields can be an <input> (identified by placeholder) or
 * a <select> (identified by lower-case name).
 *
 * @param {jQuery} $parent element that contains the entire HasManyFields
 * @param {wide DataTable} table one row per item; column names are either input placeholders, or select names (but NOT labels; sorry!)
 */
export function add($parent: any, dataTable: any) {
  debugger;
  cy.wrap($parent, QUIET).within(() => {
    dataTable.forEach((row: { [s: string]: unknown } | ArrayLike<unknown>) => {
      cy.contains('button.btn', /^Add/)
        .click()
        .then(() => {
          Object.entries(row).forEach(([placeholder, value]) => {
            const name = placeholder.toLowerCase();
            cy.get(`input[placeholder="${placeholder}"],select[name="${name}"]`)
              .last()
              .then($formField => {
                if ($formField.is('select'))
                  cy.wrap($formField, QUIET).fill(value as string);
                else cy.wrap($formField, QUIET).fill(value as string);
              });
          });
        });
    });
  });
}
