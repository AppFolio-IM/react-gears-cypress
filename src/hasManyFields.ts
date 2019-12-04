/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Chainable} from '.'
import * as match from './match'

declare var cy: Chainable;

const QUIET = { log: false };


/**
 * Finds a HasMany by a label
 * @param {*} $parent
 */
export function find(label: string) {
    return cy.contains('label', match.exact(label)).parent();
}

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
export function removeAll($parent: any) {
    return removeLast($parent).then((deleted: any) =>
        deleted ? removeAll($parent) : false
    );
}

/**
 * Add one or more items to a HasManyFields, where each item consists of potentially
 * many form fields. Form fields can be an <input> (identified by placeholder) or
 * a <select> (identified by lower-case name).
 *
 * @param {jQuery} $parent element that contains the entire HasManyFields
 * @param {wide DataTable} table one row per item; column names are input placeholders
 */
export function add($parent: any, dataTable: any) {
    cy.wrap($parent, QUIET).within(() => {
        dataTable.hashes().forEach((row: { [s: string]: unknown } | ArrayLike<unknown>) => {
            cy.contains('button.text-success', /^Add/)
                .click()
                .then(() => {
                    Object.entries(row).forEach(([placeholder, value]) => {
                        const name = placeholder.toLowerCase();
                        cy.get(`input[placeholder="${placeholder}"],select[name="${name}"]`)
                            .last()
                            .then(($formField: { (cb: any): any; (cb: any): any; is?: any }) => {
                                if ($formField.is('select'))
                                    cy.wrap($formField, QUIET).fill(value as string);
                                else cy.wrap($formField, QUIET).fill(value as string);
                            });
                    });
                });
        });
    });
}

/**
 * Add fill many fields in a form group, where each item consists of potentially
 * many form fields. Form fields can be an <input> (identified by placeholder) or
 * a <select> (identified by lower-case name).
 *
 * @param {jQuery} $parent element that contains the entire HasManyFields
 * @param {wide DataTable} table one row per item; column names are input placeholders
 */
export function fillFields($parent: any, dataTable: any) {
    cy.wrap($parent, QUIET).within(() => {
        dataTable.raw().forEach(([placeholder, value]) => {
            const name = placeholder.toLowerCase();
            cy.get(`input[placeholder="${placeholder}"],select[name="${name}"]`)
                .last()
                .then(($formField: { (cb: any): any; (cb: any): any; is?: any }) => {
                    if ($formField.is('select')) cy.wrap($formField, QUIET).fill(value);
                    else cy.wrap($formField, QUIET).fill(value);
                });
        });
    });
}

/**
 * Add fill many fields in a form group, where each item consists of potentially
 * many form fields. Form fields can be an <input> (identified by placeholder) or
 * a <select> (identified by lower-case name).
 *
 * @param {jQuery} $parent element that contains the entire HasManyFields
 * @param {wide DataTable} table one row per item; column names are input placeholders
 */
export function clearFields($parent: any, fields: any) {
    cy.wrap($parent, QUIET).within(() => {
        fields.split(',').forEach((placeholder: { toLowerCase: () => void }) => {
            const name = placeholder.toLowerCase();
            cy.get(`input[placeholder="${placeholder}"],select[name="${name}"]`)
                .last()
                .then(($formField: { (cb: any): any; (cb: any): any; is?: any }) => {
                    if ($formField.is('select')) cy.wrap($formField, QUIET).eq(0);
                    // The second option, because the first is a heading
                    else cy.wrap($formField, QUIET).clear();
                });
        });
    });
}
