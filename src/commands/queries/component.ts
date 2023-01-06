/// <reference types="cypress" />

import {
  Component,
  isComponent,
  isComponentWithText,
  isReact,
} from '../../interfaces';
import {
  describePseudoSelector,
  getText,
  mapAll,
  normalizeOptions,
} from '../internals/component';
import { getFirstDeepestElement } from '../internals/driver';
import { findAllByText, orderByInnerText } from '../internals/text';

export function component(
  this: Cypress.Command,
  defn: Component,
  ...rest: any[]
) {
  const options = normalizeOptions(rest);
  const text = getText(rest);

  if (!isComponent(defn)) {
    throw new Error(
      isReact(defn)
        ? `react-gears-cypress: cannot use a React component as a specification: ${defn}`
        : `react-gears-cypress: invalid component specification ${defn}`
    );
  } else if (text && !isComponentWithText(defn)) {
    throw new Error(
      `react-gears-cypress: trying to find by text, but ${defn.name} does not implement ComponentWithText`
    );
  }

  if (options.timeout) {
    // @ts-expect-error cypress(2345) undocumented queued command attribute (our tests prove that it works)
    this.set('timeout', options.timeout);
  }

  return (prevSubject: JQuery | void) => {
    const $subject = prevSubject || cy.$$('body');
    let $el: JQuery;

    if (text && isComponentWithText(defn)) {
      $el = findAllByText($subject, defn.textQuery, text);
      if ($el && $el.length && !options.all)
        $el = getFirstDeepestElement(orderByInnerText($el));
      if ($el.length && defn.traverseViaText)
        $el = mapAll($el, defn.traverseViaText);
    } else {
      $el = $subject.find(defn.query);
      if ($el.length > 1 && !options.all) $el = getFirstDeepestElement($el);
      if ($el.length && defn.traverse) $el = mapAll($el, defn.traverse);
    }

    // Make command log more readable by emulating Cypress internal state.
    // @ts-expect-error cypress(2551) undocumented extension to JQuery interface?
    if (!$el.selector) $el.selector = describePseudoSelector(defn, text);

    return $el;
  };
}
