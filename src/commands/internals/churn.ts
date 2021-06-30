/// <reference types="cypress" />

function indexOf(el: Element | null) {
  var i = 1;
  while (el && (el = el.previousElementSibling)) ++i;
  return i;
}

function pathToRoot(el: HTMLElement | null) {
  const path: string[] = [];

  while (el) {
    const tag = el.tagName.toLowerCase();
    const idx = el.parentElement ? `:nth-child(${indexOf(el)})` : '';
    path.unshift(`${tag}${idx}`);
    el = el.parentElement;
  }

  return path.join(' > ');
}

function requeryById(el: HTMLElement) {
  if (el.id) return document.getElementById(el.id);
}

// TODO: could we call Cypress.SelectorPlayground instead?
//   - It seems to throw exception w/ detached DOM elements...
//   - Also, it may be too vague (specifies nth-child, but not tag name)
function requeryByPath(el: HTMLElement) {
  return document.querySelector(pathToRoot(el));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function requeryOne(this: Window, el: HTMLElement, _i: number) {
  return Cypress.dom.isDetached(el) ? requeryById(el) || requeryByPath(el) : el;
}

/**
 * Mitigate churn by attempting to requery detached DOM elements.
 */
export function requeryDetached($q: JQuery<HTMLElement>) {
  // HACK: I got tired of paying the TypeScript tax and used `as`
  // TODO: remove hack & do it right
  return Cypress.$(Cypress.$.map($q, requeryOne)) as JQuery<HTMLElement>;
}
