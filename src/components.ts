/// <reference types="cypress" />

import { Component, ComponentWithText } from './interfaces';

export const Alert: ComponentWithText = {
  name: 'Alert',
  query: 'div.alert',
  textQuery: 'div.alert',
};

export const BlockPanel: ComponentWithText = {
  name: 'BlockPanel',
  query: '.card',
  textQuery: '.card .card-title',
  traverseViaText: ($el: JQuery) => $el.closest('.card'),
};

export const Button: ComponentWithText = {
  name: 'Button',
  query: 'button',
  textQuery: 'button',
};

export const Card: ComponentWithText = {
  name: 'Card',
  query: '.card',
  textQuery: '.card .card-title',
  traverseViaText: ($el: JQuery) => $el.closest('.card'),
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
  traverseViaText: $el => {
    const forId = $el.attr('for');
    if (forId) {
      const $for = Cypress.$(`#${forId}`);
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
  query: 'select,.Select',
  textQuery: ':has(select,.Select) label',
  traverseViaText: ($el: JQuery) => {
    $el = $el.closest('.form-group');
    const fancy = $el.find('.Select-control');
    if (fancy.length) return fancy;
    const vanilla = $el.find('select');
    if (vanilla.length) return vanilla;
    throw new Error(
      `react-gears-cypress: cannot determine select type for '${$el}'`
    );
  },
};

export const SummaryBoxItem: ComponentWithText = {
  name: 'SummaryBoxItem',
  query: '.card.border-secondary',
  textQuery: '.card.border-secondary > .card-body > small',
  traverseViaText: ($el: JQuery) => $el.closest('.card.border-secondary'),
};
