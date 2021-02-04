/// <reference types="cypress" />

import {
  Component,
  Text,
  isComponent,
  isComponentWithText,
  isReact,
  isText,
} from '../interfaces';
import { getFirstDeepestElement } from './internals/driver';
import { findAllByText, orderByInnerText } from './internals/text';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Find the DOM representation of a react-gears component, as identified
       * by its label, header or other characteristic text.
       *
       * @example
       *    import { components: { Button, Datapair } } from '@appfolio/react-gears-cypress'
       *    cy.component(Datapair, 'First Name').clear()
       *    cy.component(Button, /Create|Save/, { log: false }).click();
       */
      component(
        component: Component,
        text?: Text,
        options?: Partial<ComponentOptions>
      ): Chainable<Subject>;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

/**
 * Options for the cy.component command.
 */
export interface ComponentOptions {
  log: boolean;
}

function describePseudoSelector(component: Component, text?: Text) {
  if (!text) return component.query;
  else if (text instanceof RegExp)
    return `${component.query}:component-text(${text})`;
  else return `${component.query}:component-text('${text}')`;
}

function getOptions(rest: any[]): ComponentOptions {
  // fresh copy of defaults every time
  // (Cypress destructively modifies it)
  const defl = { log: true };

  switch (rest.length) {
    case 0:
      return defl;
    case 1:
      if (rest[0] && !isText(rest[0])) return rest[0];
      else return defl;
    default:
      return rest[1] || defl;
  }
}

const getText = (rest: any[]) => (isText(rest[0]) ? rest[0] : undefined);

export function component(
  subject: JQuery | undefined,
  component: Component,
  ...rest: any[]
) {
  const options = getOptions(rest);
  const text = getText(rest);

  if (!isComponent(component)) {
    throw new Error(
      isReact(component)
        ? `react-gears-cypress: cannot use a React component as a specification: ${component}`
        : `react-gears-cypress: invalid component specification ${component}`
    );
  } else if (text && !isComponentWithText(component)) {
    throw new Error(
      `react-gears-cypress: ${component.name} does not implement ComponentWithText`
    );
  }

  let consoleProps: Record<string, any> = {};
  let logEntry: any;
  if (options.log !== false) {
    consoleProps = {
      Component: component.name,
      Text: text,
      'Applied To': Cypress.dom.getElements(
        // @ts-ignore:2339
        subject || cy.state('withinSubject')
      ),
    };

    logEntry = Cypress.log({
      name: 'component',
      message: [component.name, text],
      // @ts-ignore:2345
      type: subject || cy.state('withinSubject') ? 'child' : 'parent',
      // timeout: options.timeout,
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
    // @ts-ignore:2339
    let $subject = subject || cy.state('withinSubject') || cy.$$('body');
    let $el: JQuery;

    if (text && isComponentWithText(component)) {
      $el = findAllByText($subject, component.textQuery, text);
      if ($el && $el.length)
        $el = getFirstDeepestElement(orderByInnerText($el));
      if ($el.length && component.traverseViaText)
        $el = component.traverseViaText($el);
    } else {
      $el = $subject.find(component.query);
      if ($el.length > 1) $el = getFirstDeepestElement($el);
      if ($el.length && component.traverse) $el = component.traverse($el);
    }

    // Cypress overrides some chai assertions to add command log entries, which
    // seem to rely on a hidden `selector` property of the JQuery in order to
    // describe what was found or not found. Make the log more readable by
    // providing a pseudo-selector to describe the component (not the DOM).
    // @ts-ignore:2551
    if (!$el.selector)
      // @ts-ignore:2551
      $el.selector = describePseudoSelector(component, text);

    return $el;
  };

  const resolveValue = () => {
    return Cypress.Promise.try(getValue).then($el => {
      // important: pass a jQuery object to cy.verifyUpcomingAssertions
      if (!Cypress.dom.isJquery($el)) {
        // @ts-ignore:2740
        $el = Cypress.$($el);
      }

      // @ts-ignore:2339
      return cy.verifyUpcomingAssertions($el, options, {
        onRetry: resolveValue,
        onPass: () => setEl($el),
      });
    });
  };

  return resolveValue();
}
