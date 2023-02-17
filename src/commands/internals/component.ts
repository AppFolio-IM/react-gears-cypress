import { ComponentOptions, isText } from '../../interfaces';

const DESCRIBE_MAX = 24;

/// Return a string representation of a set of JQuery elements, e.g. for error messages.
export function describeSet($collection: JQuery) {
  return $collection.map(function (this) {
    const html = this?.outerHTML || 'unknown';
    const end = html.indexOf('>');
    if (end < DESCRIBE_MAX) {
      return html.substring(0, end + 1);
    } else {
      return html.substring(0, DESCRIBE_MAX) + '…';
    }
  }).toArray().join(',');
}

/// Extract the options passed to the command, if any.
export function getOptions(rest: any[]) {
  switch (rest.length) {
    case 1:
      if (rest[0] && !isText(rest[0])) return rest[0];
      break;
    default:
      return rest[1];
  }
}

/// Extract the text paramter passed to the command, if any.
export const getText = (rest: any[]) => (isText(rest[0]) ? rest[0] : undefined);

/// Return a full hash of options w/ default values for anything not overrridden.
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
