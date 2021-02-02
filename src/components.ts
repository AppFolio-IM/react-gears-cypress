/// <reference types="cypress" />

import { Component } from './interfaces';

export const Alert: Component = {
  selector: 'div.alert',
  name: 'Alert',
};

export const BlockPanel: Component = {
  selector: '.card .card-title',
  name: 'BlockPanel',
  traverseViaLabel: ($el: JQuery) => $el.closest('.card'),
};

export const Button: Component = {
  selector: 'button',
  name: 'Button',
};

export const Card: Component = {
  selector: '.card .card-title',
  name: 'Card',
  traverseViaLabel: ($el: JQuery) => $el.closest('.card'),
};

export const Datapair: Component = {
  selector: '.form-group.js-datapair label',
  name: 'Datapair',
  traverseViaLabel: ($el: JQuery) => $el.closest('.form-group'),
};

export const Input: Component = {
  selector: ':not(:has(select,.Select)) label',
  name: 'Input',
  traverseViaLabel: $el => {
    const forId = $el.attr('for');
    if (forId) {
      const $for = Cypress.$(`#${forId}`);
      if ($for.length) return $for;
    }
    return $el.closest('.form-group').find('input,textarea');
  },
};

export const Link: Component = {
  selector: 'a,button.btn-link',
  name: 'Link',
};

export const Modal: Component = {
  selector: '.modal-title',
  name: 'Modal',
  traverseViaLabel: ($el: JQuery) => $el.closest('.modal-dialog'),
};

export const Nav: Component = {
  selector: 'ul.nav',
  name: 'Nav',
};

export const Select: Component = {
  selector: ':has(select,.Select) label',
  name: 'Select',
  traverseViaLabel: ($el: JQuery) => {
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
  selector: '.card.border-secondary > .card-body > small',
  name: 'SummaryBoxItem',
  traverseViaLabel: ($el: JQuery) => $el.closest('.card.border-secondary'),
};
