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
       * @example verify that field initially has text; clear it; save the form
       *    import { Button, Input } from '@appfolio/react-gears-cypress'
       *    cy.component(Input, 'First Name, { log: false }).should('not.be.empty')
       *    cy.component(Input, 'First Name').clear()
       *    cy.component(Button, /Create|Save/).click();
       */
      component(
        component: Component,
        text: Text,
        options?: Partial<ComponentOptions>
      ): Chainable<Subject>;
      /**
       * Find DOM representation(s) of a react-gears component regardless of
       * label, header or other characteristic text.
       *
       * @example verify there are three Select fields
       *    import { Select } from '@appfolio/react-gears-cypress'
       *    cy.component(Select, { all: true }).count().should('eq', 3)
       */
      component(
        component: Component,
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
  all: boolean;
  log: boolean;
  timeout?: number;
}

function describePseudoSelector(component: Component, text?: Text) {
  if (!text) return component.query;
  else if (text instanceof RegExp)
    return `${component.query}:component-text(${text})`;
  else return `${component.query}:component-text('${text}')`;
}

// Extract the options passed to the command, if any.
function getOptions(rest: any[]) {
  switch (rest.length) {
    case 1:
      if (rest[0] && !isText(rest[0])) return rest[0];
      break;
    default:
      return rest[1];
  }
}

// Extract the text paramter passed to the command, if any.
const getText = (rest: any[]) => (isText(rest[0]) ? rest[0] : undefined);

// Return a full hash of options w/ default values for anything not overrridden.
function normalizeOptions(rest: any[]): ComponentOptions {
  // fresh copy of defaults every time
  // (Cypress destructively modifies it)
  const defl = { all: false, log: true };

  return getOptions(rest) || defl;
}

function mapAll($collection: JQuery, callback: ($el: JQuery) => JQuery) {
  return $collection.map(function (this: HTMLElement) {
    const $element = Cypress.$(this);
    return callback($element).get()[0];
  });
}

export function component(
  subject: JQuery | undefined,
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
      `react-gears-cypress: ${component.name} does not implement ComponentWithText`
    );
  }

  const consoleProps: Record<string, any> = {
    Component: component.name,
  };
  let logEntry: any;
  if (options.log !== false) {
    const loggableOptions = getOptions(rest);
    // @ts-ignore:2339 hidden command
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
      subject || withinSubject
    );

    logEntry = Cypress.log({
      name: 'component',
      message,
      // @ts-ignore:2345 hidden option
      type: subject || withinSubject ? 'child' : 'parent',
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
    return Cypress.Promise.try(getValue).then(($el) => {
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
