/// <reference types="cypress" />

import { Component, Text, isComponent } from '../interfaces';
import { getFirstDeepestElement } from './internals/driver';
import { findAllByLabelText, orderByInnerText } from './internals/text';

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

const DEFAULT_OPTIONS: ComponentOptions = { log: true };

function getOptions(rest: any[]): ComponentOptions {
  switch (rest.length) {
    case 0:
      return DEFAULT_OPTIONS;
    case 1:
      if (typeof rest[0] === 'object') return rest[0] || DEFAULT_OPTIONS;
      else return DEFAULT_OPTIONS;
    default:
      return rest[1] || DEFAULT_OPTIONS;
  }
}

function getText(rest: any[]): Text | undefined {
  switch (rest.length) {
    case 0:
      return undefined;
    case 1:
      if (typeof rest[0] === 'object') return undefined;
      else return rest[0];
    default:
      return rest[0];
  }
}

export function component(
  subject: JQuery | undefined,
  component: Component,
  ...rest: any[]
) {
  const options = getOptions(rest);
  const text = getText(rest);

  if (!isComponent(component))
    throw new Error(
      `react-gears-cypress: invalid component specification ${component}`
    );

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
    let $el = text
      ? findAllByLabelText($subject, component.selector, text)
      : $subject.find(component.selector);
    if ($el && $el.length) $el = getFirstDeepestElement(orderByInnerText($el));
    if ($el.length && component.traverseViaLabel)
      $el = component.traverseViaLabel($el);

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
