/// <reference types="cypress" />

import { FORCE_QUIET } from './constants';

export function blurIfNecessary(subject: JQuery) {
  if (subject.is(':focus')) cy.now('blur', subject, FORCE_QUIET);
  return subject;
}

/**
 * Dismiss popups for components that inherit from `Input`. Relies on proper use
 * of aria attributes to convey state, and also on the Gears pattern of using
 * an input-group append to present the button that shows/hides the popup.
 *
 * @param subject HTML input tag associated with a Gears Input component
 */
export function dismissAriaPopup(subject: JQuery) {
  const popupParent = subject.parents('div').eq(1);
  const dismissPopup =
    popupParent && popupParent.attr('aria-expanded') === 'true';
  if (dismissPopup)
    popupParent.find('.input-group-append > button').trigger('click');
  return subject;
}
