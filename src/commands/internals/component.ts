import { Component, Text, isText } from '../../interfaces';

/**
 * Options for the cy.component command.
 */
export interface ComponentOptions {
  all: boolean;
  log: boolean;
  timeout?: number;
}

export function describePseudoSelector(component: Component, text?: Text) {
  if (!text) return component.query;
  else if (text instanceof RegExp)
    return `${component.query}:component-text(${text})`;
  else return `${component.query}:component-text('${text}')`;
}

// Extract the options passed to the command, if any.
export function getOptions(rest: any[]) {
  switch (rest.length) {
    case 1:
      if (rest[0] && !isText(rest[0])) return rest[0];
      break;
    default:
      return rest[1];
  }
}

// Extract the text paramter passed to the command, if any.
export const getText = (rest: any[]) => (isText(rest[0]) ? rest[0] : undefined);

// Return a full hash of options w/ default values for anything not overrridden.
export function normalizeOptions(rest: any[]): ComponentOptions {
  // Deliberate copy of defaults every time; Cypress destructively modifies it.
  const defl = {
    all: false,
    log: true,
    timeout: Cypress.config().defaultCommandTimeout,
  };
  return getOptions(rest) || defl;
}

export function mapAll($collection: JQuery, callback: ($el: JQuery) => JQuery) {
  return $collection.map(function (this: HTMLElement) {
    const $element = Cypress.$(this);
    return callback($element).get()[0];
  });
}
