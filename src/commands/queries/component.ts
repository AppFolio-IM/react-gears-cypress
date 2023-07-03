/// <reference types="cypress" />

import {
  Component,
  isComponent,
  isComponentWithText,
  isReact,
} from '../../interfaces';
import {
  getOptions,
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

  // @ts-expect-error cypress(2339) undocumented command
  const withinSubjectChain = cy.state('withinSubjectChain');

  const consoleProps: Record<string, any> = {
    Component: defn.name,
  };
  let logEntry: Cypress.Log | undefined;
  if (options.log !== false) {
    const loggableOptions = getOptions(rest);
    const message: any[] = [defn.name];
    if (text) {
      message.push(text);
      consoleProps.Text = text;
    }
    if (loggableOptions) {
      message.push(loggableOptions);
      consoleProps.Options = loggableOptions;
    }

    logEntry = Cypress.log({
      name: 'component',
      message,
      consoleProps: () => {
        return consoleProps;
      },
    });
  }

  return (prevSubject: JQuery | void) => {
    // @ts-expect-error cypress(2339) undocumented command
    const withinSubject = cy.getSubjectFromChain(withinSubjectChain);

    consoleProps['Applies To'] = Cypress.dom.getElements(
      prevSubject || withinSubject
    );
    logEntry?.set('type', prevSubject || withinSubject ? 'child' : 'parent')


    const $subject = prevSubject || withinSubject || cy.$$('body');
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

    consoleProps['Yielded'] = Cypress.dom.getElements($el);
    consoleProps['Elements'] = $el.length
    logEntry?.set('$el', $el);
    return $el;
  };
}
