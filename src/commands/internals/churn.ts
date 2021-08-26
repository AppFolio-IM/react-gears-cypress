/// <reference types="cypress" />

interface Metrics {
  missedById: string[];
  missedByPath: string[];
  numberOfHits: number;
  numberOfMisses: number;
}

export function getMetrics() {
  return Cypress.env('Metrics') as Metrics;
}

export function resetMetrics() {
  const metrics: Metrics = {
    missedById: [],
    missedByPath: [],
    numberOfHits: 0,
    numberOfMisses: 0,
  };
  Cypress.env('Metrics', metrics);
}

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
  if (!el.id) return;
  const metrics = getMetrics();
  const results = document.getElementById(el.id);
  if (!results) {
    metrics.missedById.push(el.id);
  }
  return results;
}

// TODO: could we call Cypress.SelectorPlayground instead?
//   - It seems to throw exception w/ detached DOM elements...
//   - Also, it may be too vague (specifies nth-child, but not tag name)
function requeryByPath(el: HTMLElement) {
  const metrics = getMetrics();
  const elementPath = pathToRoot(el);
  const results = document.querySelector(elementPath);
  if (!results) {
    metrics.missedByPath.push(elementPath);
  }
  return results;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function requeryOne(this: Window, el: HTMLElement, _i: number) {
  if (!Cypress.dom.isDetached(el)) return el;
  //Track Hits Here
  const metrics = getMetrics();
  const results = requeryById(el) || requeryByPath(el);
  if (results) {
    metrics.numberOfHits++;
    return results;
  } else {
    metrics.numberOfMisses++;
    return el;
  }
}

/**
 * Mitigate churn by attempting to requery detached DOM elements.
 */
export function requeryDetached($q: JQuery<HTMLElement>) {
  // HACK: I got tired of paying the TypeScript tax and used `as`
  // TODO: remove hack & do it right
  return Cypress.$(Cypress.$.map($q, requeryOne)) as JQuery<HTMLElement>;
}

resetMetrics();
