/// <reference types="cypress" />

import { Component } from './interfaces';

export const Alert: Component = {
  labelSelector: 'div.alert',
  name: 'Alert',
};

export const BlockPanel: Component = {
  labelSelector: '.card .card-title',
  name: 'BlockPanel',
  traverseViaLabel: ($el: JQuery) => $el.closest('.card'),
};

export const Button: Component = {
  labelSelector: 'button',
  name: 'Button',
};

export const Card: Component = {
  labelSelector: '.card .card-title',
  name: 'Card',
  traverseViaLabel: ($el: JQuery) => $el.closest('.card'),
};

export const Datapair: Component = {
  labelSelector: '.form-group.js-datapair label',
  name: 'Datapair',
  traverseViaLabel: ($el: JQuery) => $el.closest('.form-group'),
};

export const Input: Component = {
  // TODO: stop relying on .js-datapair and just use :has(input,textarea)?
  labelSelector: '.form-group:not(.js-datapair):not(:has(.Select)) label',
  name: 'Input',
  traverseViaLabel: $el => {
    if ($el.attr('role') === 'combobox')
      throw new Error(
        `Please use cy.gears(Select) to interact with this input`
      );
    const forId = $el.eq(0).attr('for');
    if (forId) return Cypress.$(`#${forId}`);
    return $el.closest('.form-group').find('input,textarea');
  },
};

export const Link: Component = {
  labelSelector: 'a,button.btn-link',
  name: 'Link',
};

export const Modal: Component = {
  labelSelector: '.modal-title',
  name: 'Modal',
  traverseViaLabel: ($el: JQuery) => $el.closest('.modal-dialog'),
};

export const Select: Component = {
  labelSelector: 'label',
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
  labelSelector: '.card.border-secondary > .card-body > small',
  name: 'SummaryBoxItem',
  traverseViaLabel: ($el: JQuery) => $el.closest('.card.border-secondary'),
};
