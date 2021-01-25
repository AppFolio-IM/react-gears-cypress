/**
 * Legacy API for finder functions.
 */

/// <reference types="cypress" />

import * as components from './components';
import * as assertNo from './findNegative';
import { Color, Text } from './interfaces';

export { assertNo };

// @deprecated please use cy.component() with Component definitions
export function alert(text: Text, color?: Color) {
  return cy.component(components.Alert, text);
}

// @deprecated please use cy.component() with Component definitions
export function blockPanel(text: Text) {
  return cy.component(components.BlockPanel, text);
}

// @deprecated please use cy.component() with Component definitions
export function button(text: Text) {
  return cy.component(components.Button, text);
}

// @deprecated please use cy.component() with Component definitions
export function card(text: Text) {
  return cy.component(components.Card, text);
}

// @deprecated please use cy.component() with Component definitions
export function cardTitle(text: Text) {
  return cy.component(components.Card, text).find('.card-title');
}

// @deprecated please use cy.component() with Component definitions
export function checkboxInput(text: Text) {
  return cy.component(components.Input, text);
}

// @deprecated please use cy.component() with Component definitions
export function datapair(text: Text) {
  return cy.component(components.Datapair, text);
}

export function hasManyFields(text: Text) {
  // HACK: this is imprecise and bound to break in numerous circumstances ...
  // once we have a sel.hasManyFields and friends we can do closest(sel.hasManyFields)
  return cy.contains('label', text).parent();
}

// @deprecated please use cy.component() with Component definitions
export function input(text: Text) {
  return cy.component(components.Input, text);
}

// @deprecated please use cy.component() with Component definitions
export function link(text: Text) {
  return cy.component(components.Link, text);
}

// @deprecated please use cy.component() with Component definitions
export function modal(text: Text) {
  return cy.component(components.Modal, text);
}

// @deprecated please use cy.component() with Component definitions
export function modalTitle(text: Text) {
  return cy.component(components.Modal, text).find('.modal-title');
}

// @deprecated please use cy.component() with Component definitions
export function radioInput(text: Text) {
  // TODO: type option
  return cy.component(components.Input, text);
}

// @deprecated please use cy.component() with Component definitions
export function select(text: Text) {
  return cy.component(components.Select, text);
}

// @deprecated please use cy.component() with Component definitions
export function summaryBoxItem(text: Text) {
  return cy.component(components.SummaryBoxItem, text);
}
