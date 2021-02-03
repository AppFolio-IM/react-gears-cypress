/// <reference types="cypress" />

import { Component } from './interfaces';

export const Alert: Component = {
  textSelector: 'div.alert',
  name: 'Alert',
};

export const BlockPanel: Component = {
  textSelector: '.card .card-title',
  name: 'BlockPanel',
  traverseViaText: ($el: JQuery) => $el.closest('.card'),
};

export const Button: Component = {
  textSelector: 'button',
  name: 'Button',
};

export const Card: Component = {
  textSelector: '.card .card-title',
  name: 'Card',
  traverseViaText: ($el: JQuery) => $el.closest('.card'),
};

export const Datapair: Component = {
  textSelector: '.form-group.js-datapair label',
  name: 'Datapair',
  traverseViaText: ($el: JQuery) => $el.closest('.form-group'),
};

export const Input: Component = {
  textSelector: ':not(:has(select,.Select)) label',
  name: 'Input',
  traverseViaText: $el => {
    const forId = $el.attr('for');
    if (forId) {
      const $for = Cypress.$(`#${forId}`);
      if ($for.length) return $for;
    }
    return $el.closest('.form-group').find('input,textarea');
  },
};

export const Link: Component = {
  textSelector: 'a,button.btn-link',
  name: 'Link',
};

export const Modal: Component = {
  textSelector: '.modal-title',
  name: 'Modal',
  traverseViaText: ($el: JQuery) => $el.closest('.modal-dialog'),
};

export const Nav: Component = {
  topSelector: 'ul.nav',
  name: 'Nav',
};

export const Select: Component = {
  textSelector: ':has(select,.Select) label',
  name: 'Select',
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

export const SummaryBoxItem: Component = {
  textSelector: '.card.border-secondary > .card-body > small',
  name: 'SummaryBoxItem',
  traverseViaText: ($el: JQuery) => $el.closest('.card.border-secondary'),
};
