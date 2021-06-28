/**
 * Helper functions that assert nonexistence of react-gears components.
 * These vary from Finders because negative assertions cannot backtrack;
 * they must be custom written for each component.
 */

/// <reference types="cypress" />

import { Color, Text } from '.';
import * as components from './components';

declare var cy: Cypress.Chainable;

// @deprecated please use cy.component() with Component definitions and .should('not.exist')
export function alert(text: Text, color?: Color) {
  return cy.component(components.Alert, text).should('not.exist');
}

// @deprecated please use cy.component() with Component definitions and .should('not.exist')
export function button(text: Text) {
  return cy.component(components.Button, text).should('not.exist');
}

// @deprecated please use cy.component() with Component definitions and .should('not.exist')
export function blockPanel(text: Text) {
  return cy.component(components.BlockPanel, text).should('not.exist');
}

// @deprecated please use cy.component() with Component definitions and .should('not.exist')
export function checkboxInput(text: Text) {
  // TODO: type option
  return cy.component(components.Input, text).should('not.exist');
}

// @deprecated please use cy.component() with Component definitions and .should('not.exist')
export function datapair(text: Text) {
  return cy.component(components.Datapair, text).should('not.exist');
}

// @deprecated please use cy.component() with Component definitions and .should('not.exist')
export function hasMany(text: Text) {
  // HACK: this is imprecise and bound to break in numerous circumstances ...
  // once we have a sel.hasManyFields and friends we can do closest(sel.hasManyFields)
  return cy.contains('label', text).should('not.exist');
}

// @deprecated please use cy.component() with Component definitions and .should('not.exist')
export function input(text: Text) {
  return cy.component(components.Input, text).should('not.exist');
}

// @deprecated please use cy.component() with Component definitions and .should('not.exist')
export function link(text: string) {
  return cy.component(components.Link, text).should('not.exist');
}

// @deprecated please use cy.component() with Component definitions and .should('not.exist')
export function modal(text: Text) {
  return cy.component(components.Modal, text).should('not.exist');
}

// @deprecated please use cy.component() with Component definitions and .should('not.exist')
export function radioInput(text: Text) {
  // TODO: type option
  return cy.component(components.Input, text).should('not.exist');
}
