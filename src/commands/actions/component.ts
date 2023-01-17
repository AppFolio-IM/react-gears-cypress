/// <reference types="cypress" />

import {
  Component,
  ComponentOptions,
  isComponent,
  isComponentWithText,
  isReact,
} from '../../interfaces';
import {
  describePseudoSelector,
  getOptions,
  getText,
  mapAll,
  normalizeOptions,
} from '../internals/component';
import { getFirstDeepestElement } from '../internals/driver';
import { findAllByText, orderByInnerText } from '../internals/text';

export function component(
  prevSubject: JQuery | void,
  component: Component,
  ...rest: any[]
) {
  const options = normalizeOptions(rest);
  const text = getText(rest);

  if (!isComponent(component)) {
    throw new Error(
      isReact(component)
        ? `react-gears-cypress: cannot use a React component as a specification: ${component}`
        : `react-gears-cypress: invalid component specification ${component}`
    );
  } else if (text && !isComponentWithText(component)) {
    throw new Error(
      `react-gears-cypress: trying to find by text, but ${component.name} does not implement ComponentWithText`
    );
  }

  const consoleProps: Record<string, any> = {
    Component: component.name,
  };
  let logEntry: any;
  if (options.log !== false) {
    const loggableOptions = getOptions(rest);
    // @ts-expect-error cypress(2339) undocumented command
    const withinSubject = cy.state('withinSubject');
    const message: any[] = [component.name];
    if (text) {
      message.push(text);
      consoleProps.Text = text;
    }
    if (loggableOptions) {
      message.push(loggableOptions);
      consoleProps.Options = loggableOptions;
    }

    consoleProps['Applies To'] = Cypress.dom.getElements(
      prevSubject || withinSubject
    );

    logEntry = Cypress.log({
      name: 'component',
      message,
      type: prevSubject || withinSubject ? 'child' : 'parent',
      consoleProps: () => {
        return consoleProps;
      },
    });
  }

  const setEl = ($el: JQuery | undefined) => {
    if (logEntry) {
      consoleProps.Yielded = $el && Cypress.dom.getElements($el);
      consoleProps.Elements = $el != null ? $el.length : undefined;
      logEntry.set({ $el });
    }
    return $el;
  };

  // this function just tries to find the element
  // we cannot use Cypress commands - aside from static ones,
  // but we can use normal DOM JavaScript and jQuery methods
  const getValue = () => {
    // @ts-expect-error cypress(2339) undocumented command
    const $subject = prevSubject || cy.state('withinSubject') || cy.$$('body');
    let $el: JQuery;

    if (text && isComponentWithText(component)) {
      $el = findAllByText($subject, component.textQuery, text);
      if ($el && $el.length && !options.all)
        $el = getFirstDeepestElement(orderByInnerText($el));
      if ($el.length && component.traverseViaText)
        $el = mapAll($el, component.traverseViaText);
    } else {
      $el = $subject.find(component.query);
      if ($el.length > 1 && !options.all) $el = getFirstDeepestElement($el);
      if ($el.length && component.traverse)
        $el = mapAll($el, component.traverse);
    }

    // Make command log more readable by emulating Cypress internal state.
    // @ts-expect-error cypress(2551) undocumented extension to JQuery interface?
    if (!$el.selector) $el.selector = describePseudoSelector(component, text);

    return $el;
  };

  const resolveValue = () => {
    return Cypress.Promise.try(getValue).then(($el) => {
      // important: pass a jQuery object to cy.verifyUpcomingAssertions
      if (!Cypress.dom.isJquery($el)) {
        $el = Cypress.$($el);
      }

      // Under Cypress 12, it seems like our onPass is not always called back.
      // Ensure we setEl at least once.
      setEl($el);

      // @ts-expect-error cypress(2339) undocumented command
      return cy.verifyUpcomingAssertions($el, options, {
        onRetry: resolveValue,
        onPass: () => setEl($el),
      });
    });
  };

  return cy.wrap(resolveValue(), { log: false, timeout: options.timeout });
}
