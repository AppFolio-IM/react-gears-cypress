/// <reference types="cypress" />

import { describeSet } from './commands/internals/component';
import { Component, ComponentWithText } from './interfaces';

export const Alert: ComponentWithText = {
  name: 'Alert',
  query: 'div.alert',
  textQuery: 'div.alert',
};

/// Fork of Block with identical styling & similar behavior, used by
/// some projects that have adopted Gears. Included here as a convenience.
export const Block: ComponentWithText = {
  name: 'Block',
  query: '.card',
  textQuery: '.card .card-title',
  traverseViaText: ($el: JQuery) => $el.closest('.card'),
};

/// Canonical component from Gears design system.
export const BlockPanel: ComponentWithText = {
  name: 'BlockPanel',
  query: '.card',
  textQuery: '.card .card-title',
  traverseViaText: ($el: JQuery) => $el.closest('.card'),
};

export const Button: ComponentWithText = {
  name: 'Button',
  query: 'button,a.btn',
  textQuery: 'button,a.btn',
};

/// Functionally identical to Block, but semantically different according to
/// the gears design system.
export const Card: ComponentWithText = {
  name: 'Card',
  query: '.card',
  textQuery: '.card .card-title',
  traverseViaText: ($el: JQuery) => $el.closest('.card'),
};

export const Combobox: ComponentWithText = {
  name: 'Combobox',
  query: '.dropdown:has([data-testid=combobox-input])',
  textQuery: '.form-group:has([data-testid=combobox-input]) label',
  traverseViaText: ($el: JQuery) =>
    $el
      .closest('.form-group')
      .find('.dropdown:has([data-testid=combobox-input])'),
};

export const Datapair: ComponentWithText = {
  name: 'Datapair',
  query: '.form-group.js-datapair',
  textQuery: '.form-group.js-datapair label',
  traverseViaText: ($el: JQuery) => $el.closest('.form-group'),
};

export const Input: ComponentWithText = {
  name: 'Input',
  query: ':not(.Select) input,textarea',
  textQuery: ':not(:has(select,.Select)) label',
  traverseViaText: ($el) => {
    const forId = $el.attr('for');

    if (forId) {
      const $for = Cypress.$(`[id="${forId}"]`);
      if ($for.length) return $for;
    }
    return $el.closest('.form-group').find('input,textarea');
  },
};

export const Link: ComponentWithText = {
  name: 'Link',
  query: 'a,button.btn-link',
  textQuery: 'a,button.btn-link',
};

export const Modal: ComponentWithText = {
  name: 'Modal',
  query: '.modal',
  textQuery: '.modal-title',
  traverseViaText: ($el: JQuery) => $el.closest('.modal-dialog'),
};

export const Nav: Component = {
  name: 'Nav',
  query: 'ul.nav',
};

export const Select: ComponentWithText = {
  name: 'Select',
  query: 'select,.Select-control',
  textQuery: ':has(select,.Select-control) label',
  traverseViaText: ($el: JQuery) => {
    $el = $el.closest('.form-group');
    const fancy = $el.find('.Select-control');
    if (fancy.length) return fancy;
    const vanilla = $el.find('select');
    if (vanilla.length) return vanilla;
    throw new Error(
      `react-gears-cypress: cannot determine a Select inside '${describeSet($el)}'; do you need to use Combobox instead?`
    );
  },
};

export const SummaryBoxItem: ComponentWithText = {
  name: 'SummaryBoxItem',
  query: '.card.border-secondary',
  textQuery: '.card.border-secondary > .card-body > small',
  traverseViaText: ($el: JQuery) => $el.closest('.card.border-secondary'),
};
