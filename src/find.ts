/**
 * Legacy API for finder functions.
 */

/// <reference types="cypress" />

import * as components from './components';
import * as assertNo from './findNegative';
import { Color, Text } from './interfaces';

export { assertNo };

export function alert(text: Text, color?: Color) {
  return cy.gears(components.Alert, text);
}

export function blockPanel(text: Text) {
  return cy.gears(components.BlockPanel, text);
}

export function button(text: Text) {
  return cy.gears(components.Button, text);
}

export function card(text: Text) {
  return cy.gears(components.Card, text);
}

export function cardTitle(text: Text) {
  return cy.gears(components.Card, text).find('.card-title');
}

export function checkboxInput(text: Text) {
  // TODO: type option
  return cy.gears(components.Input, text);
}

export function datapair(text: Text) {
  // TODO: type option
  return cy.gears(components.Datapair, text);
}

export function hasManyFields(text: Text) {
  // HACK: this is imprecise and bound to break in numerous circumstances ...
  // once we have a sel.hasManyFields and friends we can do closest(sel.hasManyFields)
  return cy.contains('label', text).parent();
}

export function input(text: Text) {
  return cy.gears(components.Input, text);
}

export function link(text: Text) {
  return cy.gears(components.Link, text);
}

export function modal(text: Text) {
  return cy.gears(components.Modal, text);
}

export function modalTitle(text: Text) {
  return cy.gears(components.Modal, text).find('.modal-title');
}

export function radioInput(text: Text) {
  // TODO: type option
  return cy.gears(components.Input, text);
}

export function select(text: Text) {
  return cy.gears(components.Select, text);
}

export function summaryBoxItem(text: Text) {
  return cy.gears(components.SummaryBoxItem, text);
}
